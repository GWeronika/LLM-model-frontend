from google.oauth2 import service_account
from googleapiclient.discovery import build


class GoogleHandler:
    def __init__(self):
        self.SERVICE_ACCOUNT_FILE = 'keys/sheet-key.json'
        self.SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

        self.SPREADSHEET_ID = '1BcT1QrkEOvNpfmO_8fSMPnGdblZc5nNCVCFbPzTPMGc'
        self.RANGE = 'Arkusz1!G2:H2'

    def __write(self, val='Server reached - LLM down'):
        creds = service_account.Credentials.from_service_account_file(
            self.SERVICE_ACCOUNT_FILE, scopes=self.SCOPES)

        service = build('sheets', 'v4', credentials=creds)
        sheet = service.spreadsheets()

        values = [['true', val]]
        body = {'values': values}

        result = sheet.values().update(
            spreadsheetId=self.SPREADSHEET_ID,
            range=self.RANGE,
            valueInputOption="USER_ENTERED",
            body=body
        ).execute()

    def write(self, val='Server reached - LLM down'):
        try:
            self.__write(val)
            return True
        except Exception as e:
            print(e)
            self.write(val)