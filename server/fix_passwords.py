"""
Fix all user passwords to use a valid bcrypt hash for 'admin@123'.
Run this from c:\ContractIQ\server
"""
import sys
sys.path.insert(0, '.')

import src.database.core as db_core
from sqlalchemy import select
from src.database.models import User
from src.auth.security import hash_password

db_core.initialize_database()
db = db_core.SessionLocal()

new_hash = hash_password('admin@123')
print('New hash:', new_hash)
print('Updating all users...')

users = db.execute(select(User)).scalars().all()
for u in users:
    u.password = new_hash
    print(f'  Updated: {u.email}')

db.commit()
print(f'\nDone! {len(users)} user(s) updated.')
print('You can now login with password: admin@123')
db.close()
