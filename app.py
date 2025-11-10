import os
import sqlite3
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash

BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = BASE_DIR / "residents.db"
DEFAULT_PROPERTY_IMAGE = "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80"

app = Flask(__name__, static_folder='.', static_url_path='')
app.config['JSON_SORT_KEYS'] = False
CORS(app, resources={r"/api/*": {"origins": "*"}})


def get_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                phone TEXT,
                unit TEXT,
                password_hash TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        conn.commit()


def normalize_email(value: str | None) -> str | None:
    if value is None:
        return None
    cleaned = value.strip().lower()
    return cleaned or None


def build_properties(row: sqlite3.Row) -> list[dict]:
    unit = (row["unit"] or "").strip()
    if not unit:
        return []
    return [
        {
            "id": f"residence-{unit.lower()}",
            "name": f"Residence {unit}",
            "location": "Codex Residences",
            "price": None,
            "moveIn": None,
            "leaseTerm": "12 Month Lease",
            "image": DEFAULT_PROPERTY_IMAGE,
        }
    ]


def serialize_user(row: sqlite3.Row) -> dict:
    full_name = " ".join(filter(None, [row["first_name"], row["last_name"]])).strip() or "Codex Resident"
    return {
        "id": row["id"],
        "name": full_name,
        "email": row["email"],
        "phone": row["phone"] or "",
        "unit": row["unit"] or "",
        "properties": build_properties(row),
    }


@app.route("/")
def serve_index():
    return app.send_static_file("index.html")


@app.post("/api/auth/signup")
def signup():
    payload = request.get_json(silent=True) or {}
    first_name = (payload.get("firstName") or "").strip()
    last_name = (payload.get("lastName") or "").strip()
    email = normalize_email(payload.get("email"))
    phone = (payload.get("phone") or "").strip()
    unit = (payload.get("unit") or "").strip()
    password = (payload.get("password") or "").strip()

    if not first_name:
        return jsonify({"message": "First name is required."}), 400
    if not last_name:
        return jsonify({"message": "Last name is required."}), 400
    if not email:
        return jsonify({"message": "A valid email address is required."}), 400
    if len(password) < 8:
        return jsonify({"message": "Passwords must contain at least 8 characters."}), 400

    try:
        with get_connection() as conn:
            cursor = conn.execute(
                "INSERT INTO users (first_name, last_name, email, phone, unit, password_hash) VALUES (?, ?, ?, ?, ?, ?)",
                (first_name, last_name, email, phone, unit, generate_password_hash(password)),
            )
            user_id = cursor.lastrowid
            conn.commit()
            row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    except sqlite3.IntegrityError:
        return jsonify({"message": "An account with that email already exists. Try logging in instead."}), 409

    return (
        jsonify(
            {
                "message": f"Welcome to Codex Residences, {first_name}.",
                "user": serialize_user(row),
            }
        ),
        201,
    )


@app.post("/api/auth/login")
def login():
    payload = request.get_json(silent=True) or {}
    email = normalize_email(payload.get("email"))
    password = (payload.get("password") or "").strip()

    if not email or not password:
        return jsonify({"message": "Email and password are required."}), 400

    with get_connection() as conn:
        row = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()

    if row is None or not check_password_hash(row["password_hash"], password):
        return jsonify({"message": "Invalid email or password."}), 401

    return jsonify({"message": f"Welcome back, {row['first_name']}.", "user": serialize_user(row)})


@app.get("/api/health")
def health() -> tuple[dict, int]:
    return {"status": "ok"}, 200


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)
else:
    init_db()
