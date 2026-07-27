import psycopg2
import sys

passwords = ["", "postgres", "admin", "root", "password"]

for pwd in passwords:
    try:
        conn = psycopg2.connect(
            dbname="postgres",
            user="postgres",
            password=pwd,
            host="localhost",
            port="5432"
        )
        print(f"SUCCESS: {pwd}")
        conn.close()
        sys.exit(0)
    except Exception as e:
        pass

print("FAILED")
