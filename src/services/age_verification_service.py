from flask import Flask, request, jsonify
import face_recognition
import cv2
import numpy as np
from datetime import datetime

app = Flask(__name__)

def calculate_age(birth_date):
    today = datetime.today()
    birth_date = datetime.strptime(birth_date, "%d/%m/%Y")
    age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    return age

@app.route('/verify', methods=['POST'])
def verify_age():
    data = request.json
    id_image = face_recognition.load_image_file(data['id_image'])
    face_image = face_recognition.load_image_file(data['face_image'])
    birth_date = data['birth_date']

    # Extract face encodings
    id_encoding = face_recognition.face_encodings(id_image)[0]
    face_encoding = face_recognition.face_encodings(face_image)[0]

    # Compare faces
    results = face_recognition.compare_faces([id_encoding], face_encoding)
    face_match = results[0]

    # Calculate age
    age = calculate_age(birth_date)

    return jsonify({
        'face_match': bool(face_match),
        'age': age,
        'is_over_18': age >= 18
    })

if __name__ == '__main__':
    app.run(debug=True)