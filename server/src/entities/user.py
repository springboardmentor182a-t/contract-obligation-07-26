class User:
    """Pure domain entity for a User. No external dependencies."""
    def __init__(self, id: int, email: str):
        self.id = id
        self.email = email
