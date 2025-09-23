import sqlite3
import json

DATABASE_NAME = "research.db"

def init_db():
    """Initializes the database and creates the results table if it doesn't exist."""
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            query TEXT NOT NULL,
            final_answer TEXT NOT NULL,
            research_data TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

def save_result(query, final_answer, research_data):
    """Saves a new research result to the database."""
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO results (query, final_answer, research_data) VALUES (?, ?, ?)",
        (query, final_answer, json.dumps(research_data))
    )
    conn.commit()
    conn.close()

def get_last_result():
    """Retrieves the most recent research result from the database."""
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT final_answer, research_data FROM results ORDER BY timestamp DESC LIMIT 1")
    row = cursor.fetchone()
    conn.close()
    if row:
        final_answer, research_data_json = row
        return {"final_answer": final_answer, "research_data": json.loads(research_data_json)}
    return None
