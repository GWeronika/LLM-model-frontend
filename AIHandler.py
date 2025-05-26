from localAIHandler import LocalAIHandler
from openAIHandler import OpenAIHandler


class AIHandler:
    def __init__(self, local=-1):
        categories = ["utility", "data", "api", "ui", "event", "acces", "auth", "explain", "test", "debugg", "XAI"]
        if local==2: self.LLMtoCategoryMap = {k:v for k,v in zip(categories, [1,1,1,1,1,2,1,3,1,3,3])}
        elif local==1: self.LLMtoCategoryMap = {k:v for k,v in zip(categories, [0,0,0,0,0,2,0,3,0,0,3])}
        else: self.LLMtoCategoryMap = {k:0 for k in categories}
        self.models = [OpenAIHandler()]+ [LocalAIHandler(modelName) for modelName in ["llama3.1:latest", "local-sql:latest", "deepseek-r1:latest"]]
        if local==2: self.defaultModelInx = 1
        else: self.defaultModelInx = 0

    def callAI(self, category, msg):
        try:
            if category in self.LLMtoCategoryMap: return self.models[self.LLMtoCategoryMap[category]].callAI(msg)
            else: return self.models[self.defaultModelInx].callAI(msg)
        except Exception as e:
            print(e)
            return str(e)