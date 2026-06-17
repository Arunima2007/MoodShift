import pandas as pd
import numpy as np

# Load dataset
songs = pd.read_csv("data/spotify_songs.csv")

# Keep only needed columns (cleaning step)
songs = songs.dropna(subset=["valence", "energy", "danceability", "acousticness"])

# ----------------------------------------
# Emotion → Vector Mapping (4D Space)
# [valence, energy, danceability, acousticness]
# ----------------------------------------

emotion_vectors = {
    "happy": [0.85, 0.80, 0.75, 0.10],
    "sad": [0.15, 0.20, 0.30, 0.75],
    "angry": [0.20, 0.85, 0.55, 0.10],
    "calm": [0.65, 0.25, 0.45, 0.65],
    "energetic": [0.75, 0.90, 0.80, 0.05],
    "neutral": [0.50, 0.50, 0.50, 0.45],
    "fear": [0.30, 0.55, 0.45, 0.40],
    "surprise": [0.75, 0.75, 0.65, 0.25]
}

# ----------------------------------------
# RECOMMENDATION FUNCTION
# ----------------------------------------

def recommend(current_emotion, target_emotion, genre, steps=5):
    # Normalize inputs to lowercase
    current_emotion = current_emotion.lower()
    target_emotion = target_emotion.lower()
    genre = genre.lower()

    # Fallback if emotion is not mapped
    if current_emotion not in emotion_vectors:
        current_emotion = "neutral"
    if target_emotion not in emotion_vectors:
        target_emotion = "neutral"

    current_vector = np.array(emotion_vectors[current_emotion])
    target_vector = np.array(emotion_vectors[target_emotion])

    # Filter by genre (case-insensitive)
    filtered_songs = songs[songs["track_genre"].str.lower() == genre]

    # If no songs found for the genre, fallback to all songs
    is_fallback = False
    if len(filtered_songs) == 0:
        filtered_songs = songs
        is_fallback = True

    features = ["valence", "energy", "danceability", "acousticness"]
    X_filtered = filtered_songs[features].values

    recommended_songs = []
    recommended_ids = set()

    for i in range(steps):
        # Linearly interpolate vector between current and target
        alpha = i / (steps - 1) if steps > 1 else 1.0
        step_vector = current_vector + alpha * (target_vector - current_vector)

        # Compute Euclidean distance from each song to the target vector
        distances = np.linalg.norm(X_filtered - step_vector, axis=1)

        # Sort songs by distance
        sorted_indices = np.argsort(distances)

        # Pick the closest song that hasn't been chosen yet
        selected_song = None
        for idx in sorted_indices:
            song_row = filtered_songs.iloc[idx]
            track_id = song_row["track_id"]
            if track_id not in recommended_ids:
                selected_song = song_row
                recommended_ids.add(track_id)
                break

        # Fallback: if all songs were recommended, pick the absolute closest
        if selected_song is None:
            selected_song = filtered_songs.iloc[sorted_indices[0]]

        # Compute similarity percentage
        # Max distance in 4D space of [0, 1] is sqrt(4) = 2.0
        dist = np.linalg.norm(selected_song[features].values - step_vector)
        similarity = float(np.round((1.0 - (dist / 2.0)) * 100, 1))

        # Setup stage and transition explanations
        if i == 0:
            stage_label = f"Start (Current: {current_emotion.capitalize()})"
            explanation = f"Matches your starting mood of {current_emotion.capitalize()} with similar valence, energy, and acoustic properties."
        elif i == steps - 1:
            stage_label = f"Destination (Target: {target_emotion.capitalize()})"
            explanation = f"Fully aligns with your target mood of {target_emotion.capitalize()} to complete the emotional transition."
        else:
            stage_label = f"Transition Step {i}"
            explanation = f"A bridging track, guiding your mood from {current_emotion.capitalize()} towards {target_emotion.capitalize()}."

        recommended_songs.append({
            "step": i + 1,
            "stage": stage_label,
            "track_id": str(selected_song["track_id"]),
            "track_name": str(selected_song["track_name"]),
            "artists": str(selected_song["artists"]),
            "album_name": str(selected_song["album_name"]),
            "valence": float(selected_song["valence"]),
            "energy": float(selected_song["energy"]),
            "danceability": float(selected_song["danceability"]),
            "acousticness": float(selected_song["acousticness"]),
            "tempo": float(selected_song["tempo"]),
            "popularity": int(selected_song["popularity"]),
            "similarity_score": similarity,
            "explanation": explanation,
            "fallback_used": is_fallback
        })

    return recommended_songs