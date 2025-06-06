import requests
import json


class LocalAIHandler:
    def __init__(self, model):
        self.model = model

    def __parseHistory(self, msg, history):
        result = []
        for entry in history:
            if entry[1]: result.append({"role":"user", "content":entry[0]})
            else: result.append({"role":"assistant", "content":entry[0]})
        return "Conversation history:" + str(result)[-5000:] + "Query: " + msg

    def callAI(self, msg, history):
        msg = self.__parseHistory(msg, history)
        url = "http://localhost:11434/api/chat"
        model = self.model
        payload = {
            "model": model,
            "messages": [{"role": "user", "content": msg}]
        }
        result = ""
        response = requests.post(url, json=payload, stream=True)
        if response.status_code == 200:
            for line in response.iter_lines(decode_unicode=True):
                if not line: continue
                try:
                    json_data = json.loads(line)
                    result += json_data["message"]["content"]
                except json.JSONDecodeError: continue
        else: return "Connection error"
        return result