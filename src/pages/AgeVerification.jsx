import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Camera, Upload } from 'lucide-react';
import axios from 'axios';

const AgeVerification = () => {
  const [idImage, setIdImage] = useState(null);
  const [faceImage, setFaceImage] = useState(null);
  const [birthDate, setBirthDate] = useState('');
  const videoRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleIdUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Failed to access camera");
    }
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    setFaceImage(canvas.toDataURL('image/jpeg'));
    setIsCameraActive(false);
    if (videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const verifyAge = async () => {
    if (!idImage || !faceImage || !birthDate) {
      toast.error("Please upload ID, capture face image, and enter birth date");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/verify', {
        id_image: idImage,
        face_image: faceImage,
        birth_date: birthDate
      });

      const { face_match, age, is_over_18 } = response.data;

      if (face_match && is_over_18) {
        toast.success(`Age verification successful! You are ${age} years old.`);
      } else if (!face_match) {
        toast.error("Face does not match the ID. Please try again.");
      } else {
        toast.error("You must be 18 or older to proceed");
      }
    } catch (error) {
      console.error("Error during verification:", error);
      toast.error("An error occurred during verification. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Age Verification</h1>
      <Card className="p-4 mb-4">
        <h2 className="text-xl mb-2 text-center">Upload ID</h2>
        <label htmlFor="id-upload" className="flex flex-col items-center p-4 bg-secondary text-secondary-foreground rounded-md cursor-pointer">
          <Upload className="w-8 h-8 mb-2" />
          <span>Choose ID Image</span>
          <Input id="id-upload" type="file" onChange={handleIdUpload} accept="image/*" className="hidden" />
        </label>
        {idImage && <img src={idImage} alt="ID" className="mt-4 w-full rounded-md" />}
      </Card>
      <Card className="p-4 mb-4">
        <h2 className="text-xl mb-2 text-center">Face Detection</h2>
        {!isCameraActive ? (
          <Button onClick={startCamera} className="w-full mb-2">
            <Camera className="mr-2 h-4 w-4" /> Start Camera
          </Button>
        ) : (
          <Button onClick={captureImage} className="w-full mb-2">Capture Image</Button>
        )}
        {isCameraActive && <video ref={videoRef} autoPlay playsInline className="w-full rounded-md mb-2" />}
        {faceImage && <img src={faceImage} alt="Face" className="w-full rounded-md" />}
      </Card>
      <Card className="p-4 mb-4">
        <h2 className="text-xl mb-2 text-center">Birth Date</h2>
        <Input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full"
        />
      </Card>
      <Button onClick={verifyAge} className="w-full" disabled={!idImage || !faceImage || !birthDate}>
        Verify Age
      </Button>
    </div>
  );
};

export default AgeVerification;