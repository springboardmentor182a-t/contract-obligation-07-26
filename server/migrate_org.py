import sqlite3
import os
from pathlib import Path

SERVER_DIR = Path(__file__).resolve().parent
DB_FILE = SERVER_DIR / "dev.db"

if DB_FILE.exists():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    try:
        # Create organizations table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS organizations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        ''')

        # Check if organization_id exists in users table
        cursor.execute("PRAGMA table_info(users)")
        columns = [info[1] for info in cursor.fetchall()]
        if 'organization_id' not in columns:
            cursor.execute("ALTER TABLE users ADD COLUMN organization_id INTEGER REFERENCES organizations(id) ON DELETE SET NULL")
            print("Added organization_id to users.")

        # Check if organization_id exists in contracts table
        cursor.execute("PRAGMA table_info(contracts)")
        columns = [info[1] for info in cursor.fetchall()]
        if 'organization_id' not in columns:
            cursor.execute("ALTER TABLE contracts ADD COLUMN organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE")
            print("Added organization_id to contracts.")

        # Let's also create a default organization and assign it to existing users and contracts to avoid breaking existing features
        cursor.execute("SELECT COUNT(*) FROM organizations")
        if cursor.fetchone()[0] == 0:
            cursor.execute("INSERT INTO organizations (name, description) VALUES ('Default Organization', 'Auto-created default organization')")
            default_org_id = cursor.lastrowid
            
            cursor.execute("UPDATE users SET organization_id = ? WHERE organization_id IS NULL", (default_org_id,))
            cursor.execute("UPDATE contracts SET organization_id = ? WHERE organization_id IS NULL", (default_org_id,))
            print(f"Created default organization and assigned ID {default_org_id} to existing users and contracts.")

        conn.commit()
        print("Database updated successfully.")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()
else:
    print("dev.db not found. Skipping migration.")
