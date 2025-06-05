import MySQLdb


class DbHandler:
    def __init__(self):
        self.conn = None
        self.cursos = None
        self.__connect()

    def __connect(self):
        self.conn = MySQLdb.connect(
            host='localhost',
            user='root',
            password='1234',
            database='LLM'
        )
        self.cursor = self.conn.cursor()

    def __executeCommit(self, sql, values):
        try:
            self.cursor.execute(sql, values)
            self.conn.commit()
        except Exception as e:
            print(e)
            return str(e)
        return True
    
    def __executeFetchall(self, sql, values):
        try:
            self.cursor.execute(sql, values)
            rows = self.cursor.fetchall()
        except Exception as e:
            print(e)
            return [str(e)]
        return rows

    def saveFunction(self, projectId, fName, code):
        sql = """INSERT INTO codebase 
                (projectName , functionName , code) 
                VALUES (%s,%s,%s)"""
        values = (projectId, fName, code)
        return self.__executeCommit(sql, values)
    
    def saveDescription(self, projectId, fName, desc):
        sql = """INSERT INTO descriptions 
                (projectName , functionName , description) 
                VALUES (%s,%s,%s)"""
        values = (projectId, fName, desc)
        return self.__executeCommit(sql, values)

    def saveConversation(self, projectId, conversationId, category, query, user=True):
        sql = """INSERT INTO conversations (projectName, conversationId, category, query, userQuery) VALUES (%s, %s, %s, %s, %s)"""
        values = (projectId, conversationId, category, query, user)
        return self.__executeCommit(sql, values)

    def getSelect(self, sql):
        self.cursor.execute(sql)
        rows = self.cursor.fetchall()
        if len(rows) > 10: return rows[-10:]
        else: return rows

    def deleteProject(self, projectId):
        sql = """DELETE FROM codebase WHERE projectName = %s"""
        values = (projectId,)
        self.__executeCommit(sql, values)

        sql = """DELETE FROM descriptions WHERE projectName = %s"""
        self.__executeCommit(sql, values)

        sql = """DELETE FROM conversations WHERE projectName = %s"""
        self.__executeCommit(sql, values)

        sql = """DELETE FROM convodata WHERE projectName = %s"""
        return self.__executeCommit(sql, values)

    def deleteFunction(self, projectId, fName):
        sql = """DELETE FROM codebase WHERE functionName = %s AND projectName = %s"""
        values = (fName, projectId)
        self.__executeCommit(sql, values)

        sql = """DELETE FROM descriptions WHERE functionName = %s AND projectName = %s"""
        return self.__executeCommit(sql, values)
    
    def deleteConversation(self, projectId, conversationId):
        sql = """DELETE FROM conversations WHERE conversationId = %s AND projectName = %s"""
        values = (conversationId, projectId)
        self.__executeCommit(sql, values)

        sql = """DELETE FROM convodata WHERE conversationId = %s AND projectName = %s"""
        return self.__executeCommit(sql, values)
    
    def getCode(self, projectId, functionName):
        sql = """SELECT code FROM codebase WHERE projectName =%s AND functionName = %s ORDER BY id"""
        values = (projectId, functionName)
        rows = self.__executeFetchall(sql, values)
        if len(rows) > 0 :return rows[-1]
        return []
    
    def getDescription(self, projectId, functionName):
        sql = """SELECT description FROM descriptions WHERE projectName =%s AND functionName = %s ORDER BY id"""
        values = (projectId, functionName)
        rows = self.__executeFetchall(sql, values)
        if len(rows) > 0 :return rows[-1]
        return []

    def getConversationContext(self, projectId, conversationId):
        sql = """SELECT query, userQuery FROM conversations WHERE projectName =%s AND conversationId = %s ORDER BY id"""
        values = (projectId, conversationId)
        rows = self.__executeFetchall(sql, values)
        if len(rows) > 0: return rows
        return []

    def getProjectFunctions(self, projectId):
        sql = """SELECT DISTINCT functionName FROM codebase WHERE projectName =%s"""
        values = (projectId,)
        rows = self.__executeFetchall(sql, values)
        return rows
    
    def saveConversationData(self, projectId, convoId, category, convoName, date):
        sql = """INSERT INTO convodata 
                (projectName , conversationId , conversationName, creationDate, category) 
                VALUES (%s,%s,%s,%s,%s)"""
        values = (projectId, convoId, convoName, date, category)
        return self.__executeCommit(sql, values)
    
