import requests
import json


class LocalAIHandler:
    def __init__(self, model):
        self.model = model

    def callAI(self, msg):
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