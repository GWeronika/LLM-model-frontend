from dbHandler import DbHandler
from googleHandler import GoogleHandler
from promptProcessor import PromptProcessor
import pandas as pd
import time

class RequestHandler:
    def __init__(self):
        self.sheet_url = 'https://docs.google.com/spreadsheets/d/1BcT1QrkEOvNpfmO_8fSMPnGdblZc5nNCVCFbPzTPMGc/export?format=csv'
        self.dbHandler = DbHandler()
        self.googleHandler = GoogleHandler()
        self.promptProcessor = PromptProcessor()

    def read(self):
        df = pd.read_csv(self.sheet_url)
        return df
    
    def checkStatus(self, df):
        st = df['status']
        st = st[0]
        if pd.isna(st) or pd.isnull(st) or st == 'true' or st == 'TRUE': return True
        return False
    
    def generateResponse(self, df):
        response = self.promptProcessor.generate(df)
        self.googleHandler.write(response)
        return response

    def saveRequests(self, df):
        category = df['cat'][0]
        self.dbHandler.saveConversation(df['projectId'][0], df['convoId'][0], df['query'][0], user=True)
        if category == "saveFunction": return self.dbHandler.saveFunction(df['projectId'][0], df['fName'][0], df['query'][0])
        elif category == "saveDescription": return self.dbHandler.saveDescription(df['projectId'][0], df['fName'][0], df['query'][0])
        return "False"

    def deleteRequests(self, df):
        category = df['cat'][0]
        self.dbHandler.saveConversation(df['projectId'][0], df['convoId'][0], df['query'][0], user=True)
        if category == "deleteFunction": return self.dbHandler.deleteFunction(df['projectId'][0], df['fName'][0])
        elif category == "deleteConversation": return self.dbHandler.deleteConversation(df['projectId'][0], df['convoId'][0])
        elif category == "deleteProject": return self.dbHandler.deleteProject(df['projectId'][0])
        return "False"

    def getSelectRequest(self, df):
        self.dbHandler.saveConversation(df['projectId'][0], df['convoId'][0], df['query'][0], user=True)
        return self.dbHandler.getSelect(df['query'])

    def adresRespone(self, df):
        category = df['cat'][0]
        if category in ["saveFunction", "saveDescriptions"]: response = self.saveRequests(df)
        elif category in ["deleteProject", "deleteFunction", "deleteConversation"]: response = self.deleteRequests(df)
        elif category in ["getSelect"]: response = self.getSelectRequest(df)
        else:
            self.dbHandler.disconnect()
            response = self.generateResponse(df)
            self.dbHandler.connect()
        self.dbHandler.saveConversation(df['projectId'][0], df['convoId'][0], response, user=False)
    
    def run(self):
        while True:
            time.sleep(0.5)
            try:
                df = self.read()
                if self.checkStatus(df): continue
                else: self.__attempt(df, depth=0)
            except Exception: continue

    def __attempt(self, df, depth=0):
        try:
            self.adresRespone(df)
        except Exception as e:
            print(e)
            if depth == 0: self.__attempt(df, depth=1)
            else: self.googleHandler.write('Failure:' + str(e))

if __name__ == "__main__":
    rq = RequestHandler()
    rq.run()