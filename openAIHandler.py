import openai
import  json


class OpenAIHandler:
    def __init__(self):
        with open("keys/oai.json", 'r') as f: data = json.load(f)
        self.OPENAI_API_KEY = data["KEY"]
    
    def callAI(self, msg):
        try:
            client = openai.OpenAI(api_key=self.OPENAI_API_KEY)
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": msg}]
            )
            return  response.choices[0].message.content.strip()
        except Exception as e:
            return str(e)