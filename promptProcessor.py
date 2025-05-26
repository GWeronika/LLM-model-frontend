from AIHandler import AIHandler
from dbHandler import DbHandler


class PromptProcessor:
    """
    Naive version
    TODO: Upload QA algorithm version
    TODO: Style sheet variation
    TODO: Function calling category determination
    """
    def __init__(self, local=-1):
        self.AI = AIHandler(local=local)
        self.DB = DbHandler()

    def getAIresponse(self):
        pass

    def codebaseQA(self):
        pass
    
    def conversationContext(self):
        pass
    
    def getTemplate(self):
        pass

    def explain(self):
        pass

    def generate(self, df):
        return self.AI.callAI(df['cat'][0], df['query'][0])

    def callAI(self, category, msg):
        return self.AI.callAI(category, msg)