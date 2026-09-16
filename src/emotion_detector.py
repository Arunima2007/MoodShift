#Emation detection module using FER library
from fer import FER
import cv2
import numpy as np

detector = FER()

def detect_emotion(image):
    # Convert image to numpy array if it is not already
    image = np.array(image)
    
    # Check if the image has 3 channels (RGB) and convert to BGR for OpenCV / FER
    if len(image.shape) == 3 and image.shape[2] == 3:
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    elif len(image.shape) == 3 and image.shape[2] == 4:
        # Handle RGBA images from some webcam outputs
        image = cv2.cvtColor(image, cv2.COLOR_RGBA2BGR)

    result = detector.detect_emotions(image)

    print("RESULT:", result)

    default_emotions = {
        "happy": 0.0,
        "sad": 0.0,
        "angry": 0.0,
        "fear": 0.0,
        "surprise": 0.0,
        "neutral": 1.0
    }

    if result:
        emotions = result[0]["emotions"]
        # Convert float32 values to standard python floats for JSON serialization
        emotions_serializable = {k: float(v) for k, v in emotions.items()}
        print("EMOTIONS:", emotions_serializable)

        dominant_emotion = max(emotions_serializable, key=emotions_serializable.get)
        return dominant_emotion, emotions_serializable

    return "neutral", default_emotions