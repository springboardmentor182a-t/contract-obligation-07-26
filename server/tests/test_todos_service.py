from src.todos.service import get_todos

def test_get_todos():
    todos = get_todos()
    assert len(todos) > 0
    assert todos[0].id == 1