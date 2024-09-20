from flask import Flask, request, jsonify
import face_recognition
import cv2
import numpy as np
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def calculate_age(birth_date):
    today = datetime.today()
    birth_date = datetime.strptime(birth_date, "%d/%m/%Y")
    age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    return age

def get_face_encoding(image_path):
    # Load image from path
    image = face_recognition.load_image_file(image_path)
    face_encodings = face_recognition.face_encodings(image)
    if len(face_encodings) == 0:
        return None
    return face_encodings[0]

def capture_image_from_camera():
    # Capture image from camera
    cam = cv2.VideoCapture(0)
    ret, frame = cam.read()
    cam.release()
    
    if not ret:
        return None
    return frame

def get_camera_encoding():
    # Capture the image and get face encoding
    camera_image = capture_image_from_camera()
    if camera_image is None:
        return None
    face_encodings = face_recognition.face_encodings(camera_image)
    if len(face_encodings) == 0:
        return None
    return face_encodings[0]

def compare_faces(id_encoding, camera_encoding):
    return face_recognition.face_distance([id_encoding], camera_encoding)[0]

@app.route('/verify', methods=['POST'])
def verify_age():
    data = request.json
    birth_date = data['birth_date']
    print(birth_date)

    # Load and extract face encoding from ID image
    id_encoding = get_face_encoding(data['id_image'])
    if id_encoding is None:
        return jsonify({'error': 'No face found in ID image'}), 400

    # Capture and extract face encoding from camera image
    camera_encoding = get_camera_encoding()
    if camera_encoding is None:
        return jsonify({'error': 'No face found in camera image'}), 400

    # Compare faces and get similarity score
    face_distance = compare_faces(id_encoding, camera_encoding)
    similarity_percentage = (1 - face_distance) * 100
    face_match = face_distance <= 0.6  # Using 0.6 as the threshold

    # Calculate age from the birth date
    age = calculate_age(birth_date)

    return jsonify({
        'face_match': bool(face_match),
        'age': age,
        'is_over_18': age >= 18,
        'similarity_percentage': similarity_percentage
    })

if __name__ == '__main__':
    app.run(debug=True)
