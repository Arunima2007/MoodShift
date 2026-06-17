from fastapi import FastAPI, File, UploadFile, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import io
import base64
from PIL import Image
import uvicorn

from src.recommender import recommend, songs
from src.emotion_detector import detect_emotion

app = FastAPI(
    title="MoodShift API",
    description="Backend API for Emotion Transition-Based Music Recommender",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local testing and deployment flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Base64ImageRequest(BaseModel):
    image: str  # Base64 encoded image string (e.g. data:image/jpeg;base64,...)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to MoodShift API! Available endpoints: /api/detect-emotion (POST), /api/detect-emotion-base64 (POST), /api/recommend (GET), /api/genres (GET)"
    }

@app.post("/api/detect-emotion")
async def detect_emotion_file(file: UploadFile = File(...)):
    """Detect dominant emotion and scores from an uploaded face image file."""
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        dominant_emotion, emotion_scores = detect_emotion(image)
        return {
            "status": "success",
            "dominant_emotion": dominant_emotion,
            "emotion_scores": emotion_scores
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to detect emotion: {str(e)}"
        }

@app.post("/api/detect-emotion-base64")
async def detect_emotion_base64(payload: Base64ImageRequest):
    """Detect dominant emotion and scores from a base64 encoded face image (e.g., from webcam)."""
    try:
        # Check if the image contains the base64 header and strip it
        image_data = payload.image
        if "," in image_data:
            _, image_data = image_data.split(",", 1)
            
        decoded_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(decoded_bytes))
        dominant_emotion, emotion_scores = detect_emotion(image)
        return {
            "status": "success",
            "dominant_emotion": dominant_emotion,
            "emotion_scores": emotion_scores
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to process webcam image: {str(e)}"
        }

@app.get("/api/recommend")
def get_recommendations(
    current_emotion: str = Query(..., description="The user's starting emotion"),
    target_emotion: str = Query(..., description="The target emotion the user wants to achieve"),
    genre: str = Query(..., description="Preferred music genre"),
    steps: int = Query(5, ge=3, le=7, description="Number of transition tracks (between 3 and 7)")
):
    """Generate a step-by-step transition playlist based on current and target emotions."""
    try:
        playlist = recommend(
            current_emotion=current_emotion,
            target_emotion=target_emotion,
            genre=genre,
            steps=steps
        )
        return {
            "status": "success",
            "current_emotion": current_emotion,
            "target_emotion": target_emotion,
            "genre": genre,
            "steps": steps,
            "playlist": playlist
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to generate recommendations: {str(e)}"
        }

@app.get("/api/genres")
def get_genres():
    """Retrieve all unique genres available in the dataset."""
    try:
        unique_genres = sorted(songs["track_genre"].unique().tolist())
        return {
            "status": "success",
            "count": len(unique_genres),
            "genres": unique_genres
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to retrieve genres: {str(e)}"
        }

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)