class AuthService:
    """Business logic for authentication. Depends on domain entities only."""

    def login(self, email: str, password: str) -> str:
        return "stub-token"
