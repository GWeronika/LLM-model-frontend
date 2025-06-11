from AIHandler import AIHandler
from dbHandler import DbHandler
from openAIHandler import OpenAIHandler
from functionCallHandler import FunctionCallHandler
import json


class PromptProcessor:
    DBCATEGORIES = [
        "saveFunction",
        "saveDescription",
        "getSelect",
        "deleteFunction",
        "deleteConversation",
        "deleteProject",
        "saveConversationData",
        "loadConversationData",
        "loadConversationMsg",
        "appendFunction",
        "options"
    ]

    def __init__(self, local=-1):
        self.AI = AIHandler(local=local)
        self.DB = DbHandler()
        self.FC = FunctionCallHandler()
        self.formatResponse = False
        self.prevCat = ""
        self.prevOut = ""

    def response(self, df):
        if df['cat'][0] in self.DBCATEGORIES: res =  self.dbResponse(df)
        else:
            if df['cat'][0] == "FC":res =  self.parseToFunctionCall(df)
            else: res = self.genResponse(df)
            if self.formatResponse:
                try:
                    print("!FORMATING")
                    response = self.FC.formatOutput(res)
                    args = json.loads(response.choices[0].message.function_call.arguments)
                    name,text,code = args["name"], args["text"], args["code"]
                    out = f"""{name}\nCode:{code}\nText:{text}"""
                    res = out
                except Exception as e: print(e)
            self.prevOut = res
            self.DB.saveConversation(df['projectId'][0], df['convoId'][0], df['cat'][0], df['query'][0], user=True)
            self.DB.saveConversation(df['projectId'][0], df['convoId'][0], df['cat'][0], str(res), user=False)
        return res
    
    def parseToFunctionCall(self, df):
        history = self.conversationContext(df)
        response = self.FC.chooseGenCall(df['query'][0],  history)
        try:
            args = json.loads(response.choices[0].message.function_call.arguments)
            df['cat'][0] = args["category"].copy()
            df['query'][0]  = args["query"].copy()
        except Exception as e:
            df['cat'][0] = 'utility'
        return self.genResponse(df)

    def dbResponse(self, df):
        category = df['cat'][0]
        if category == 'saveFunction': 
            if self.prevCat == 'explain': self.DB.saveDescription(df['projectId'][0], df['fName'][0], self.prevOut)
            if df['query'][0].split()[0] == "CODESTYLERULES": df['fName'][0] = "CODESTYLERULES"
            return self.DB.saveFunction(df['projectId'][0], df['fName'][0], df['query'][0])
        elif category == 'saveDescription': return self.DB.saveDescription(df['projectId'][0], df['fName'][0], df['query'][0])
        elif category == 'getSelect': return self.DB.getSelect(df['query'][0])
        elif category == 'deleteFunction': return self.DB.deleteFunction(df['projectId'][0], df['fName'][0])
        elif category == 'deleteConversation': return self.DB.deleteConversation(df['projectId'][0], df['convoId'][0])
        elif category == 'saveConversationData': return self.DB.saveConversationData(df['projectId'][0], df['convoId'][0], df['convoCat'][0], df['fName'][0], df['query'][0])
        elif category == 'deleteProject': return self.DB.deleteProject(df['projectId'][0])
        elif category == 'loadConversationData': return self.DB.loadConversationData(df['projectId'][0])
        elif category == 'loadConversationMsg': return self.DB.loadConversationMsg(df['projectId'][0], df['convoId'][0])
        elif category == 'appendFunction': return self.DB.appendFunction(df['projectId'][0], df['fName'][0], df['query'][0])
        else:
            query = df['query'][0]
            if query == "SET":
                self.formatResponse = not self.formatResponse
                return True
            else: return self.DB.getSelect(query)

    def genResponse(self, df):
        self.prevCat = df['cat'][0]
        if df['cat'][0] == 'XAI': return self.XAI(df)
        else: return self.getAIresponse(df)

    def XAI(self, df):
        query = df['query'][0]
        history = self.conversationContext(df)
        prompt = f"""
        #Idendity
        You are coding assitant specialized in XAI, explain last generated answer.

        #Instruction
        Last generated answer: {query}
        """
        return self.callAI("XAI", prompt, history)
    
    def getAIresponse(self, df):
        query = df['query'][0]
        history = self.conversationContext(df)
        information = self.codebaseQA(df)
        style = self.DB.getStyle(df['projectId'][0])
        prompt = f"""
        #Idendity
        You are coding assitant specialized in {df['cat'][0]} code generation.
        
        #Instruction
        Answer this question: {query}. With additional context of {information}.
        """
        if len(style) > 5: prompt += f"""Write any code with this style guide: {style}."""
        
        return self.callAI(df['cat'][0], prompt, history)

    def callAI(self, category, msg, history):
        return self.AI.callAI(category, msg, history)
    
    def codebaseQA(self, df):
        fNames = self.DB.getProjectFunctions(df['projectId'][0])
        fNames = [name[0] for name in fNames if name[0].lower() in df['query'][0].lower()]
        code = {name:self.DB.getCode(df['projectId'][0], name) for name in fNames}
        desc = {name:self.DB.getDescription(df['projectId'][0], name) for name in fNames}
 
        
        resultString = "Code:\n"
        for fName in code:
            if code[fName] == []: continue
            else: resultString += f"{fName}:{code[fName]},\n"
        resultString = resultString[:5000]
        resultString += "Description:\n"
        for fName in desc:
            if desc[fName] == []: continue
            else: resultString += f"{fName}:{desc[fName]},\n"
        return resultString[:10000]
    
    def conversationContext(self, df):
        context = self.DB.getConversationContext(df['projectId'][0], df['convoId'][0])
        history = []
        for x in context: history.append([x[0], x[-1]])
        return history
