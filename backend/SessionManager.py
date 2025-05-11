import redis

class SessionManager:
    SESSION_EXPIRATION = 3600

    def __init__(self):
        self.r = redis.Redis(host='0.0.0.0', port=10000)

    def add_session(self, session_id):
        """
        Adds a new session to the session table. If it exists, the session will be erased
        :param session_id: The id of the session to add.
        :return: Generated session id
        """
        self.r.setex(f"session:{session_id}", 3600, "")

    def get_session(self, session_id):
        """
        Gets a session from the session table.
        :param session_id: The session id
        :return: The session object or None if not found
        """

        if self.verify_session_id(session_id):
            return self.r.get(f"session:{session_id}")
        return None

    def remove_session(self, session_id):
        """
        Removes a session from the session table.
        :param session_id: The session id
        """
        self.r.delete(f"session:{session_id}")

    def verify_session_id(self, session_id):
        return self.r.exists(f"session:{session_id}")

