class Todo:
    """Pure domain entity for a Todo item. No external dependencies."""
    def __init__(self, id: int, title: str, done: bool = False):
        self.id = id
        self.title = title
        self.done = done
