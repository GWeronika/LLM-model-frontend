from localAIHandler import LocalAIHandler
from openAIHandler import OpenAIHandler


class AIHandler:
    TEMPLATES = {
        "utility":"\nWrite code similiar to provided that answers above first question of prompt.",
        "data":"\nBreakdown data processing into list of sequential operations. Write line by line code executing each operation.",
        "api":"\nConsider what method whould be called, what argument it takes and what format will be the return result.",
        "ui":".\nTake inspiration of style from provided code and descriptions",
        "event":"\nWrite code to handle this event, beaware of possible compatiblity issues, write answer that is secure and avoids these issues.",
        "acces":"\nWrite querry that performs described action. If you are not sure of the actual names of tables,variables etc. use self expnalatory names instead. Keep in mind authentication and security concerns.",
        "test":"\nThink about possible errors and write cases that would catch them. Firstly test for code breaking errors, then for not working as intedent errors.",
        "debug":"\nPredict what should the function do, then achieve this functionality by fixing code. "
    }

    ENDMSG = "Please write all code in one block surrounded with ```CODE```."

    def __init__(self, local=-1):
        categories = ["utility", "data", "api", "ui", "event", "acces", "auth", "explain", "test", "debugg", "XAI"]
        if local==2: self.LLMtoCategoryMap = {k:v for k,v in zip(categories, [1,1,1,1,1,2,1,3,1,3,3])}
        elif local==1: self.LLMtoCategoryMap = {k:v for k,v in zip(categories, [0,0,0,0,0,2,0,3,0,0,3])}
        else: self.LLMtoCategoryMap = {k:0 for k in categories}
        self.models = [OpenAIHandler()]+ [LocalAIHandler(modelName) for modelName in ["llama3.1:latest", "local-sql:latest", "deepseek-r1:latest"]]
        if local==2: self.defaultModelInx = 1
        else: self.defaultModelInx = 0

    def __addTemplate(self, category, msg):
        if category in self.TEMPLATES: return msg + self.TEMPLATES[category] + self.ENDMSG
        else: return msg + self.ENDMSG

    def callAI(self, category, msg, history):
        msg = self.__addTemplate(category, msg)
        try:
            if category in self.LLMtoCategoryMap: return self.models[self.LLMtoCategoryMap[category]].callAI(msg, history)
            else: return self.models[self.defaultModelInx].callAI(msg, history)
        except Exception as e:
            print(e)
            return str(e)