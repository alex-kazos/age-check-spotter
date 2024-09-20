import cv2
from flask import Flask, request, jsonify
from flask_cors import CORS
import face_recognition
import base64
import io
from PIL import Image
from datetime import datetime

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
    id_file = request.files.get('id_file')
    face_image = request.form.get('face_image')
    birth_date = request.form.get('birth_date')

    if not id_file or not face_image or not birth_date:
        return jsonify({'error': 'Missing required data'}), 400

    # Process ID image
    id_image = face_recognition.load_image_file(id_file)
    id_encoding = face_recognition.face_encodings(id_image)
    if not id_encoding:
        return jsonify({'error': 'No face found in ID image'}), 400
    id_encoding = id_encoding[0]

    # Process face image
    face_image_data = base64.b64decode(face_image)
    face_image = Image.open(io.BytesIO(face_image_data))
    face_image_array = face_recognition.load_image_file(io.BytesIO(face_image_data))
    face_encoding = face_recognition.face_encodings(face_image_array)
    if not face_encoding:
        return jsonify({'error': 'No face found in captured image'}), 400
    face_encoding = face_encoding[0]

    # Compare faces
    face_distance = face_recognition.face_distance([id_encoding], face_encoding)[0]
    similarity_percentage = (1 - face_distance) * 100
    face_match = face_distance <= 0.6  # Using 0.6 as the threshold

    # Calculate age
    birth_date = datetime.fromisoformat(birth_date.rstrip('Z'))
    age = (datetime.now() - birth_date).days // 365

    return jsonify({
        'face_match': bool(face_match),
        'age': age,
        'is_over_18': age >= 18,
        'similarity_percentage': similarity_percentage
    })

if __name__ == '__main__':
    app.run(debug=True)
