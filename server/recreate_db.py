from src.database.core import Base, engine, initialize_database
import src.database.core as db_core

def reset_db():
    initialize_database()
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=db_core.engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=db_core.engine)
    print("Done!")

if __name__ == "__main__":
    reset_db()
