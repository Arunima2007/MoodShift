# 🎧 MoodShift – Emotion Transition-Based Music Recommender

MoodShift is an AI-powered web application that recommends music based on a user's current emotional state and desired target mood. Instead of simply recommending songs that match the user's current emotion, MoodShift focuses on **emotional transition**, helping users gradually shift from one emotional state to another (e.g., Sad → Neutral → Happy, Angry → Calm) through a mathematically interpolated sequence of songs.

---

## ✨ Core Features

1. **Facial Emotion Recognition (FER)**:
   - Capture a snapshot using your webcam directly in the browser, or drag-and-drop a face image.
   - The backend processes the facial image using a pre-trained FER convolutional neural network to detect the dominant emotion and raw confidence scores.
   - Mapped emotions: `Happy`, `Sad`, `Angry`, `Fear`, `Surprise`, and `Neutral`.

2. **Transition Path Selection**:
   - Choose a target emotion you want to reach (e.g., Sad $\rightarrow$ Happy, Angry $\rightarrow$ Calm).
   - Customize the playlist length ($3$, $5$, or $7$ tracks) depending on how gradual you want the transition to be.

3. **114+ Searchable Spotify Genres**:
   - Filter tracks by popular shortcuts (Pop, Rock, EDM, Bollywood, Lo-Fi, Hip-Hop) or search from a complete list of 114+ unique genres parsed directly from the Spotify tracks dataset.

4. **Vector Interpolation Recommendation Engine**:
   - Maps emotions to 4-dimensional vectors containing Spotify audio features: `[valence, energy, danceability, acousticness]`.
   - Computes linear steps along the path and retrieves the nearest neighbor tracks using Euclidean distance.
   - Guarantees unique track suggestions in the playlist.

5. **Mood Analytics Dashboard**:
   - **Detected Emotion Profile**: A Recharts bar chart displaying the confidence breakdown of the facial expression scan.
   - **Valence & Energy Journey**: A Recharts line chart illustrating how valence (happiness) and energy (intensity) transition across each song in the playlist.

6. **Interactive Spotify Playbacks**:
   - Cards embed the official **Spotify Play Widget** allowing you to listen to previews of recommended tracks instantly in your browser.

---

## 🧠 How the Recommendation Engine Works?

Most emotion-based music recommenders suggest songs that match the user's *current* mood, which can trap users in negative loops (e.g., playing sad songs when sad). MoodShift shifts your emotion using vector geometry:

### 1. The 4D Feature Space
We represent emotions as coordinates in a 4-dimensional space of normalized audio features:
* **Valence** (musical positiveness, 0 to 1)
* **Energy** (loudness/activity, 0 to 1)
* **Danceability** (beat stability/tempo, 0 to 1)
* **Acousticness** (unprocessed/acoustic properties, 0 to 1)

### 2. Linear Vector Interpolation
Given a starting mood vector $V_c$ (e.g., **Sad**: `[0.15, 0.20, 0.30, 0.75]`) and target mood vector $V_t$ (e.g., **Happy**: `[0.85, 0.80, 0.75, 0.10]`), the engine interpolates $N$ steps:
$$V_i = V_c + \frac{i}{N-1} (V_t - V_c) \quad \text{for } i \in [0, N-1]$$

* **Step 1 (Sad)**: `[0.15, 0.20, 0.30, 0.75]`
* **Step 2 (Midpoint)**: `[0.50, 0.50, 0.525, 0.425]` *(Neutralizes the mood)*
* **Step 3 (Happy)**: `[0.85, 0.80, 0.75, 0.10]`

### 3. Euclidean Search & De-duplication
For each step, it runs a nearest-neighbor distance search against all songs of the selected genre:
$$\text{Distance} = \sqrt{\sum (V_{\text{song}} - V_i)^2}$$
It picks the closest match that has not already been recommended in a previous step to keep the playlist unique and dynamic.

---

## 💻 Tech Stack

* **Frontend**: React (Vite), Tailwind CSS v3, Recharts, Lucide-React, Axios.
* **Backend**: FastAPI (Python), Uvicorn, OpenCV, Pillow (PIL), Scikit-Learn.
* **AI Model**: Facial Emotion Recognition (FER) powered by MTCNN (Multi-task Cascaded Convolutional Networks) and Keras/TensorFlow.
* **Dataset**: Spotify Tracks Dataset (114,000+ songs).

---

## 🚀 Installation & Setup

Ensure you have **Python 3.11+** and **Node.js 20+** installed on your machine.

### 1. Clone & Set Up the Repository
```bash
git clone https://github.com/<your-username>/MoodShift.git
cd MoodShift
```

### 2. Backend Setup
1. Activate the Python virtual environment:
   ```bash
   source venv/bin/activate
   ```
2. Install the Python dependencies:
   ```bash
   pip install -r requirement.txt
   pip install fastapi uvicorn python-multipart
   ```
3. Run the FastAPI server:
   ```bash
   python app.py
   ```
   *The backend will boot up on [http://localhost:8000](http://localhost:8000).*

### 3. Frontend Setup
1. Open a new terminal tab and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the node packages:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Run the Vite React development server:
   ```bash
   npm run dev
   ```
   *The application UI will run on [http://localhost:5173](http://localhost:5173).*

---

## 📄 License
This project is open-source and available under the MIT License.
