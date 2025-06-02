from dbHandler import DbHandler
from googleHandler import GoogleHandler
from promptProcessor import PromptProcessor
import pandas as pd
import time

class RequestHandler:
    def __init__(self, local=-1):
        self.sheet_url = 'https://docs.google.com/spreadsheets/d/1BcT1QrkEOvNpfmO_8fSMPnGdblZc5nNCVCFbPzTPMGc/export?format=csv'
        self.googleHandler = GoogleHandler()
        self.promptProcessor = PromptProcessor(local=local)

    def read(self):
        df = pd.read_csv(self.sheet_url)
        return df
    
    def checkStatus(self, df):
        st = df['status']
        st = st[0]
        if pd.isna(st) or pd.isnull(st) or st == 'true' or st == 'TRUE' or st==True: return True
        return False
    
    def adresRespone(self, df):
        res =  self.promptProcessor.response(df)
        self.googleHandler.write(str(res))
    
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
            print("Exception requestHandler")
            print(e)
            if depth < 2: self.__attempt(df, depth=depth+1)
            else: self.googleHandler.write('Failure:' + str(e))

if __name__ == "__main__":
    rq = RequestHandler()
    rq.run()