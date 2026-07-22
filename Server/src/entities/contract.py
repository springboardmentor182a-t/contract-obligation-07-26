# Open: src/entities/todo.py
from sqlalchemy import Column, String

class TodoEntity:
    __tablename__ = "todos"  # Keep the table name as todos so database migrations don't break

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)        # Contract Title
    vendor = Column(String, nullable=False)       # Vendor Name
    todo_type = Column(String, nullable=False)    # Type (e.g., Cloud Services)
    value = Column(String, nullable=False)        # Contract Value (e.g., $2.40M)
    end_date = Column(String, nullable=False)     # Expiration Date
    owner = Column(String, nullable=False)        # Manager/Owner
    status = Column(String, default="Active")     # Active / Renewal Due
    compliance = Column(String, default="high")   # high / medium / low