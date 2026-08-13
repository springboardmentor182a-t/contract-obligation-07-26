import bcrypt


def _to_bytes_truncated(value: str) -> bytes:
    if isinstance(value, str):
        return value.encode("utf-8")[:72]
    return str(value).encode("utf-8")[:72]


def hash_password(password: str) -> str:
    """Hash a plain-text password before storing it in the database.

    Truncate to bcrypt's 72-byte limit to avoid backend errors.
    Returns the hashed password as a UTF-8 string.
    """
    pw = _to_bytes_truncated(password)
    hashed = bcrypt.hashpw(pw, bcrypt.gensalt())
    return hashed.decode("utf-8")


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """Check whether a plain password matches the stored hash."""
    try:
        pw = _to_bytes_truncated(plain_password)
        return bcrypt.checkpw(pw, hashed_password.encode("utf-8"))
    except Exception:
        return False