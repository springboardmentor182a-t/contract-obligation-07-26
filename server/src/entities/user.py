class User:
    """Pure domain entity for a User."""

    def __init__(
        self,
        id: int,
        name: str,
        full_name: str,
        email: str,
        password: str,
        role: str,
        organization_id: int,
        department: str,
        phone: str,
        is_active: bool,
    ):
        self.id = id
        self.name = name
        self.full_name = full_name
        self.email = email
        self.password = password
        self.role = role
        self.organization_id = organization_id
        self.department = department
        self.phone = phone
        self.is_active = is_active
