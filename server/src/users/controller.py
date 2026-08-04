from fastapi import APIRouter, HTTPException, status
from .models import UserCreate, UserResponse
from .models import UserManagementCreate, UserManagementResponse

from .service import (
    create_user,
    get_user_by_id,
    get_all_users,
    get_user_by_id_db,
    create_user_db,
    update_user_db,
    delete_user_db
)

router = APIRouter()


# Authentication/User Registration
@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate):
    return create_user(user)


@router.get("/users/{user_id}", response_model=UserResponse)
def read_user(user_id: int):
    user = get_user_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user




@router.get("/users", response_model=list[UserManagementResponse])
def read_all_users():
    return get_all_users()


@router.get("/users/db/{user_id}", response_model=UserManagementResponse)
def read_user_from_database(user_id: int):
    user = get_user_by_id_db(user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user


@router.post("/users/create", response_model=UserManagementResponse)
def create_management_user(user: UserManagementCreate):
    return create_user_db(user)


@router.put("/users/update/{user_id}", response_model=UserManagementResponse)
def update_management_user(user_id: int, user: UserManagementCreate):
    updated_user = update_user_db(user_id, user)

    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return updated_user


@router.delete("/users/delete/{user_id}")
def delete_management_user(user_id: int):
    deleted = delete_user_db(user_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return {"message": "User deleted successfully"}
