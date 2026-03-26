from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import numpy as np
import cv2
import mediapipe as mp

app = Flask(__name__)
CORS(app)

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False,
                       max_num_hands=1,
                       min_detection_confidence=0.7)

labels = ["Hello", "Yes", "No", "Thank You"]

def process_image(image):
    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = hands.process(rgb)

    if results.multi_hand_landmarks:
        return "Hello"  # placeholder
    return "No hand detected"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json["image"]
    img_bytes = base64.b64decode(data)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    result = process_image(frame)
    return jsonify({"text": result})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
