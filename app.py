from flask import Flask, render_template, request, jsonify
import face_recognition
import numpy as np
import base64
import os
import cv2

app = Flask(__name__)

# Folders
BASE_DIR = "known_faces"
IMG_DIR = os.path.join(BASE_DIR, "images")
ENC_DIR = os.path.join(BASE_DIR, "encodings")

os.makedirs(IMG_DIR, exist_ok=True)
os.makedirs(ENC_DIR, exist_ok=True)


# ---------------------- ROUTES ----------------------

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/admin")
def admin():
    users = [f.replace(".npy", "") for f in os.listdir(ENC_DIR)]
    return render_template("admin.html", users=users)


# ------------------ ENROLL USER ---------------------

@app.route("/enroll", methods=["POST"])
def enroll():
    data = request.json
    name = data["name"]
    images = data["images"]

    # Create folder for user images
    user_folder = os.path.join(IMG_DIR, name)
    os.makedirs(user_folder, exist_ok=True)

    encodings = []

    for i, img_data in enumerate(images):
        img_bytes = base64.b64decode(img_data.split(",")[1])
        np_img = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        save_path = os.path.join(user_folder, f"{i}.jpg")
        cv2.imwrite(save_path, img)

        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        faces = face_recognition.face_locations(rgb)
        if faces:
            encoding = face_recognition.face_encodings(rgb)[0]
            encodings.append(encoding)

    if len(encodings) < 5:
        return jsonify({"message": "Face not detected enough times!"})

    avg_encoding = np.mean(encodings, axis=0)
    np.save(os.path.join(ENC_DIR, f"{name}.npy"), avg_encoding)

    return jsonify({"message": f"{name} enrolled successfully!"})


# ------------------ RECOGNIZE USER ------------------

@app.route("/recognize", methods=["POST"])
def recognize():
    data = request.json
    img_data = data["image"]

    img_bytes = base64.b64decode(img_data.split(",")[1])
    np_img = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    face_locs = face_recognition.face_locations(rgb)
    if not face_locs:
        return jsonify({"name": "No face found"})

    encoding = face_recognition.face_encodings(rgb)[0]

    best_match = "Unknown"
    best_distance = 1.0

    for file in os.listdir(ENC_DIR):
        saved_enc = np.load(os.path.join(ENC_DIR, file))
        dist = np.linalg.norm(saved_enc - encoding)

        if dist < best_distance:
            best_distance = dist
            best_match = file.replace(".npy", "")

    return jsonify({"name": best_match})


if __name__ == "__main__":
    app.run(debug=True)
