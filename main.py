from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
import bcrypt
#import jwt  # Ajout
import datetime
#import sqlite3 # Ajout

from db import get_connection

app = FastAPI()

SECRET_KEY = "supersecretkey"

# --- SCHÉMAS ---
class FilmResponse(BaseModel):
    ID: int
    Nom: str
    Note: Optional[float] = None
    DateSortie: Optional[int] = None
    Image: Optional[str] = None
    Video: Optional[str] = None
    Genre_ID: Optional[int] = None

class GenreResponse(BaseModel):
    ID: int
    Type: str

class PaginatedResponse(BaseModel):
    data: list[FilmResponse]
    page: int
    per_page: int
    total: int

class RegisterBody(BaseModel):
    email: str
    pseudo: Optional[str] = "User"
    password: str

class LoginBody(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class PreferenceBody(BaseModel):
    genre_id: int

# --- UTILS ---
def create_token(user_id: int) -> str:
    payload = {
        "user_id": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def get_user_id_from_header(authorization: str) -> int:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Header invalide")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["user_id"]
    except:
        raise HTTPException(status_code=401, detail="Token invalide")

# --- ROUTES ---
@app.get("/ping")
def ping():
    return {"message": "pong"}

@app.get("/films", response_model=PaginatedResponse)
def get_films(page: int = 1, per_page: int = 20, genre_id: Optional[int] = None):
    offset = (page - 1) * per_page
    with get_connection() as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        if genre_id:
            cursor.execute("SELECT COUNT(*) FROM Film WHERE Genre_ID = ?", (genre_id,))
            total = cursor.fetchone()[0]
            cursor.execute("SELECT * FROM Film WHERE Genre_ID = ? ORDER BY DateSortie DESC LIMIT ? OFFSET ?", (genre_id, per_page, offset))
        else:
            cursor.execute("SELECT COUNT(*) FROM Film")
            total = cursor.fetchone()[0]
            cursor.execute("SELECT * FROM Film ORDER BY DateSortie DESC LIMIT ? OFFSET ?", (per_page, offset))
        films = [dict(row) for row in cursor.fetchall()]
    return {"data": films, "page": page, "per_page": per_page, "total": total}

@app.get("/films/{film_id}", response_model=FilmResponse)
def get_film(film_id: int):
    with get_connection() as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Film WHERE ID = ?", (film_id,))
        film = cursor.fetchone()
    if not film: raise HTTPException(status_code=404)
    return dict(film)

@app.get("/genres", response_model=list[GenreResponse])
def get_genres():
    with get_connection() as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Genre ORDER BY Type ASC")
        return [dict(row) for row in cursor.fetchall()]

@app.post("/auth/register", response_model=TokenResponse)
def register(body: RegisterBody):
    hashed = bcrypt.hashpw(body.password.encode(), bcrypt.gensalt()).decode()
    with get_connection() as conn:
        try:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO Utilisateur (AdresseMail, Pseudo, MotDePasse) VALUES (?, ?, ?)", (body.email, body.pseudo, hashed))
            user_id = cursor.lastrowid
            conn.commit()
            return {"access_token": create_token(user_id)}
        except sqlite3.IntegrityError:
            raise HTTPException(status_code=409)

@app.post("/auth/login", response_model=TokenResponse)
def login(body: LoginBody):
    with get_connection() as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Utilisateur WHERE AdresseMail = ?", (body.email,))
        user = cursor.fetchone()
    if not user or not bcrypt.checkpw(body.password.encode(), user["MotDePasse"].encode()):
        raise HTTPException(status_code=401)
    return {"access_token": create_token(user["ID"])}

@app.post("/preferences", status_code=201)
def add_preference(body: PreferenceBody, authorization: str = Header(None)):
    user_id = get_user_id_from_header(authorization)
    with get_connection() as conn:
        try:
            conn.execute("INSERT INTO Genre_Utilisateur (ID_Genre, ID_User) VALUES (?, ?)", (body.genre_id, user_id))
            conn.commit()
        except sqlite3.IntegrityError:
            raise HTTPException(status_code=409)
    return {"detail": "OK"}

@app.delete("/preferences/{genre_id}")
def delete_preference(genre_id: int, authorization: str = Header(None)):
    user_id = get_user_id_from_header(authorization)
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Genre_Utilisateur WHERE ID_Genre = ? AND ID_User = ?", (genre_id, user_id))
        if cursor.rowcount == 0: raise HTTPException(status_code=404)
        conn.commit()
    return {"detail": "Supprimé"}

@app.get("/preferences/recommendations", response_model=list[FilmResponse])
def get_recommendations(authorization: str = Header(None)):
    user_id = get_user_id_from_header(authorization)
    with get_connection() as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("""
            SELECT F.* FROM Film F 
            JOIN Genre_Utilisateur GU ON F.Genre_ID = GU.ID_Genre 
            WHERE GU.ID_User = ? ORDER BY F.DateSortie DESC LIMIT 5
        """, (user_id,))
        return [dict(row) for row in cursor.fetchall()]