# LLM prompt processor
---
## Idea
---
- Scans for requests
- Communicates with database
- Processes requests
- Generate code
- support local and remote LLMs
## Communication
Unorthodox way of communicating with model enforces unusual API format.
Any server call is done using updateSheet() method to post request, and getLLMresponse() (name not really fitting anymore, delay can  be reduced for no llm) to get results.
## I/O
Input
| Category| Query| ProjectId(default=projectDev)| FunctionName| ConversationId|
|---------|------|------------------------------|-------------|---------------|
| cat| query           |projectId| fName   |convoId|
|category of query|query content|projectId in simplest version there is one project|uqnique function name for given project| id of conversation
Output
| Output|
|-------|
|out
|Output string|

## Categories
|Category|Query|ProjectId|FunctionName|ConversationId|Output|Note|
|-|-|-|-|-|-|-|
|getSelect|SQL query|-|-|current conversation id/-|results/error log|optional conversation id is used for saving to conversation database
|chatSubcategory|LLM query|current project id|function name|current conversation id|result| chatSubcategory is LLM generation category
|saveFunction|code|current project id|function name|current conversation id/-|true/error log| optional conversation id is used for saving to conversation database
|deleteProject|-|project id|-|-|true/error log|
|deleteFunction|-|project id|function name|current conversation id/-|true/error log|optional conversation id is used for saving to conversation database
|deleteConversation|-|project id|-|conversation id|true/ error log|

## TODO
---
- XAI features
- add files ...
- advance prompt logic
- describe categories and database in README
