from flask import Flask, request, jsonify
import face_recognition
import cv2
import numpy as np
from datetime import datetime
import os

app = Flask(__name__)

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

def compare_faces(id_encoding, camera_encoding, tolerance=0.6):
    return face_recognition.compare_faces([id_encoding], camera_encoding, tolerance=tolerance)[0]

@app.route('/verify', methods=['POST'])
def verify_age():
    print("Received data:", request.form)
    print("Received files:", request.files)

    birth_date = request.form.get('birth_date')
    id_file = request.files.get('id_file')
    face_image = request.files.get('face_image')

    if not birth_date or not id_file or not face_image:
        return jsonify({'error': 'Missing required data'}), 400

    # Save the uploaded files temporarily
    id_path = 'temp_id.jpg'
    face_path = 'temp_face.jpg'
    id_file.save(id_path)
    face_image.save(face_path)

    # Load and extract face encoding from ID image
    id_encoding = get_face_encoding(id_path)
    if id_encoding is None:
        return jsonify({'error': 'No face found in ID image'}), 400

    # Load and extract face encoding from uploaded face image
    face_encoding = get_face_encoding(face_path)
    if face_encoding is None:
        return jsonify({'error': 'No face found in uploaded image'}), 400

    # Compare faces
    face_match = compare_faces(id_encoding, face_encoding)

    # Calculate age from the birth date
    age = calculate_age(birth_date)

    # Clean up temporary files
    os.remove(id_path)
    os.remove(face_path)

    return jsonify({
        'face_match': bool(face_match),
        'age': age,
        'is_over_18': age >= 18
    })

if __name__ == '__main__':
    app.run(debug=True)