from AIHandler import AIHandler
from dbHandler import DbHandler
from openAIHandler import OpenAIHandler

class PromptProcessor:
    """
    TODO: FC call
    TODO: Style sheet variation
    """

    DBCATEGORIES = [
        "saveFunction",
        "saveDescription",
        "getSelect",
        "deleteFunction",
        "deleteConversation",
        "deleteProject",
        "saveConversationData",
        "loadConversationData",
        "loadConversationMsg"
    ]

    def __init__(self, local=-1):
        self.AI = AIHandler(local=local)
        self.DB = DbHandler()
        self.FC = OpenAIHandler()

    def response(self, df):
        if df['cat'][0] in self.DBCATEGORIES: res =  self.dbResponse(df)
        else:
            if df['cat'][0] == "FC": res =  self.parseToFunctionCall(df)
            else: res = self.genResponse(df)
            self.DB.saveConversation(df['projectId'][0], df['convoId'][0], df['cat'][0], df['query'][0], user=True)
            self.DB.saveConversation(df['projectId'][0], df['convoId'][0], df['cat'][0], str(res), user=False)

        if df['cat'][0] == 'explain': self.DB.saveDescription(df['projectId'][0], df['fName'][0], str(res))
        return res
    
    def parseToFunctionCall(self, df): #FC
        msg = {'projectId':df['projectId'][0], 'fName':df['fName'][0], 'query':df['quey'][0], 'convoId':df['convoId'][0]}
        return self.autoGenerate('XAI', df['projectId'][0], df['fName'][0], df['query'][0], df['convoId'][0])

    def autoGenerate(self, cat, projectId, fName, query, convoId): #FC
        df = {'cat':[cat], 'projectId':[projectId], 'fName':[fName], 'query':[query], 'convoId':[convoId]}
        return self.response(df)

    def dbResponse(self, df):
        category = df['cat'][0]
        if category == 'saveFunction': return self.DB.saveFunction(df['projectId'][0], df['fName'][0], df['query'][0])
        elif category == 'saveDescription': return self.DB.saveDescription(df['projectId'][0], df['fName'][0], df['query'][0])
        elif category == 'getSelect': return self.DB.getSelect(df['query'][0])
        elif category == 'deleteFunction': return self.DB.deleteFunction(df['projectId'][0], df['fName'][0])
        elif category == 'deleteConversation': return self.DB.deleteConversation(df['projectId'][0], df['convoId'][0])
        elif category == 'saveConversationData': return self.DB.saveConversationData(df['projectId'][0], df['convoId'][0], df['cat'][0], df['fName'][0], df['query'][0])
        else: return self.DB.deleteProject(df['projectId'][0])
        

    def genResponse(self, df):
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
        prompt = f"""
        #Idendity
        You are coding assitant specialized in {df['cat'][0]}
        
        #Instruction
        Answer this question: {query}. With additional context of {information}.
        """
        return self.callAI(df['cat'][0], prompt, history)

    def callAI(self, category, msg, history):
        return self.AI.callAI(category, msg, history)
    
    def codebaseQA(self, df):
        fNames = self.DB.getProjectFunctions(df['projectId'][0])
        fNames = [name[0] for name in fNames if name[0] in df['query'][0]]
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