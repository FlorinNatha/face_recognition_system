📸 Face Recognition System

A simple web-based face recognition system built using Python (Flask), OpenCV, face_recognition, JavaScript, and Bootstrap.
The system supports:

✅ Face Enrollment (capture 15 images automatically)
✅ Face Recognition (match with previously enrolled users)
✅ Progress Bar for capturing images
✅ Clean Bootstrap UI
✅ Dark Mode
✅ Admin Panel (view registered users)
✅ Saves Encodings + User Images

📁 Project Structure
face_recognition_system/
│
├── app.py
├── known_faces/              # Saved user's face encodings (.npy)
├── user_images/              # Saved user image frames (optional)
├── templates/
│   ├── index.html            # Main UI
│   └── admin.html            # Admin dashboard
└── static/
    └── js/
        └── script.js         # Frontend webcam + requests

🛠️ Technologies Used
Component	Technology
Backend	Python, Flask
Face Detection	face_recognition (dlib)
Webcam Access	JavaScript + HTML5 video
Styling	Bootstrap 5, Dark UI
Storage	NumPy Encoding Files
Frontend	HTML + JS + AJAX
🚀 Features
✅ 1. Face Enrollment

Captures 15 images from the webcam

Uses a progress bar to indicate capture status

Extracts face encodings

Saves them as <username>.npy

✅ 2. Face Recognition

Captures a single frame from webcam

Compares with saved encodings

Returns best match using distance score

✅ 3. Admin Panel

Lists all enrolled users

Shows files stored in known_faces/

📦 Installation Guide
1️⃣ Install required packages

Open your terminal:

pip install flask face_recognition opencv-python numpy


If dlib gives errors, install CMake first, then retry.

2️⃣ Run the Application
python app.py


The server will run at:

http://127.0.0.1:5000/

🎥 Usage
➡️ Enroll a face

Enter your name

Click Enroll Face

System automatically captures 15 images

Progress bar shows how many frames were captured

Encoding stored in known_faces/<name>.npy

➡️ Recognize a face

Turn on your webcam

Click Recognize Face

System captures 1 frame

It compares your face with saved encodings

Returns the matched name or Unknown

➡️ Admin Dashboard

Shows list of all registered users.

📚 How It Works (Algorithm Flow)
Face Enrollment

Capture 15 webcam frames

Convert Base64 → NumPy array

Detect face locations

Extract face encodings

Average all 15 encodings

Save as .npy file

Face Recognition

Capture 1 frame

Convert → NumPy array

Extract encoding

Compare with all saved encodings

Find lowest Euclidean distance

Return matched user

📝 Progress Bar Logic

Frontend JavaScript:

for (let i = 0; i < 15; i++) {
    updateProgress((i+1) / 15 * 100)
    captureFrame()
}


Backend is not involved in counting progress — everything happens in JavaScript.

🎯 Future Improvements

Add user authentication (login system)

Store user profiles in database

Add photo preview during enrollment

Improve matching accuracy with multiple encodings

Add live recognition (continuous scanning)

📄 License

This project is free for learning and educational purposes.

🤝 Author

Developed by Nathasha Florin
S