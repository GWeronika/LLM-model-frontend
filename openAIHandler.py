import openai
import  json


class OpenAIHandler:
    def __init__(self):
        with open("keys/oai.json", 'r') as f: data = json.load(f)
        self.OPENAI_API_KEY = data["KEY"]
    
    def __parseHistory(self, msg, history):
        result = []
        for entry in history:
            if entry[1]==1: result.append({"role":"user", "content":entry[0]})
            else: result.append({"role":"assistant", "content":entry[0]})
        result.append({"role":"user", "content":msg})
        return result

    def callAI(self, msg, history):
        try:
            client = openai.OpenAI(api_key=self.OPENAI_API_KEY)
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=self.__parseHistory(msg, history)
            )
            return  response.choices[0].message.content.strip()
        except Exception as e:
            return str(e)