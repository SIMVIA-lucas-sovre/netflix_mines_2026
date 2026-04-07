from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db import get_connection, init_db
from routes_auth import router as auth_router
from routes_films import router as films_router
from routes_genres import router as genres_router
from routes_preferences import router as preferences_router

app = FastAPI(title="CinéAPI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(films_router)
app.include_router(genres_router)
app.include_router(preferences_router)


@app.on_event("startup")
def startup():
    with get_connection() as conn:
        init_db(conn)
        conn.commit()


@app.get("/ping")
def ping():
    return {"message": "pong"}

class Film(BaseModel):
    id: int | None = None
    nom: str
    note: float | None = None
    dateSortie: int
    image: str | None = None
    video: str | None = None
    genreId: int | None = None

@app.post("/film")
async def createFilm(film : Film):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(f"""
            INSERT INTO Film (Nom,Note,DateSortie,Image,Video)  
            VALUES('{film.nom}',{film.note},{film.dateSortie},'{film.image}','{film.video}') RETURNING *
            """)
        res = cursor.fetchone()
        print(res)
        return res


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
