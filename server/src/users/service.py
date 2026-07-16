from .models import UserCreate, UserResponse

def create_user(user_data: UserCreate) -> UserResponse:
    # Placeholder for database insertion logic
    return UserResponse(
        id=1, 
        email=user_data.email, 
        name=user_data.name, 
        is_active=True
    )

def get_user_by_id(user_id: int) -> Optional[UserResponse]:
    # Placeholder for database retrieval logic
    if user_id == 1:
        return UserResponse(
            id=1, 
            email="admin@contractiq.com", 
            name="Spandana Doe", 
            is_active=True
        )
    return None