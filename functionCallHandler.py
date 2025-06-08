import openai
import  json


class FunctionCallHandler:
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
        
    def chooseGenCall(self, query, history = []):
        tools = [
            {
                "name":"generateResponse",
                "description":"Function that generates response based on query and category",
                "parameters": {
                    "type":"object",
                    "properties": {
                        "category": {
                            "type": "string",
                            "enum": [
                                "utility", "data", "api", "ui",
                                "event", "acces", "auth", "explain", 
                                "test", "debugg", "XAI"
                            ],
                            "descrption":"category of question for generated response"
                        },
                        "query": {
                            "type":"string",
                            "description":"Query for generated response"
                        }
                    },
                    "required":["category", "query"]   
                }
            }
        ]
        msg = f"""
            Please call function with appropriate 
            category and query decide them based on: {query}
        """
        
        messages = self.__parseHistory(msg, history)
        try:
            client = openai.OpenAI(api_key=self.OPENAI_API_KEY)
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                functions=tools,
                function_call={"name":"generateResponse"}
            )
            return  response
        except Exception as e:
            return str(e)
    
    def formatOutput(self, response):
        tools = [
            {
                "name":"format",
                "description":"Function that formats text and code.",
                "parameters": {
                    "type":"object",
                    "properties": {
                        "text": {
                            "type": "string",
                            "descrption":"Text data in natural languages"
                        },
                        "code": {
                            "type":"string",
                            "description":"Text data that is written in some programming language"
                        },
                        "name": {
                            "type":"string",
                            "description":"Name you would give this code/description with .lang or .txt"
                        }
                    },
                    "required":["text", "code", "name"]   
                }
            }
        ]
        msg = f"""
            Please call function with text,code from query
            and appropriate name based on: {response} 
        """
        messages = self.__parseHistory(msg, [])
        try:
            client = openai.OpenAI(api_key=self.OPENAI_API_KEY)
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                functions=tools,
                function_call={"name":"format"}
            )
            return  response
        except Exception as e:
            return str(e)