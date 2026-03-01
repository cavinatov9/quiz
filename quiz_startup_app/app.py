from flask import Flask, render_template, request, jsonify
import sqlite3, os

app = Flask(__name__)

def init_db():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute("""
    CREATE TABLE IF NOT EXISTS ranking (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        score INTEGER,
        time INTEGER
    )
    """)
    conn.commit()
    conn.close()

init_db()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/save", methods=["POST"])
def save():
    data = request.json
    name = data["name"]
    score = data["score"]
    total_time = data["time"]

    conn = sqlite3.connect("database.db")
    c = conn.cursor()

    c.execute("INSERT INTO ranking (name, score, time) VALUES (?, ?, ?)",
              (name, score, total_time))

    conn.commit()
    conn.close()

    return {"status": "ok"}

@app.route("/ranking")
def ranking():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()

    c.execute("""
    SELECT name, score, time FROM ranking
    ORDER BY score DESC, time ASC
    LIMIT 20
    """)

    data = c.fetchall()
    conn.close()

    return jsonify(data)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
