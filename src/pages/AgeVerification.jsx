import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Camera } from 'lucide-react';

const AgeVerification = () => {
  const [idImage, setIdImage] = useState(null);
  const [faceImage, setFaceImage] = useState(null);
  const videoRef = useRef(null);

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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
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
  };

  const verifyAge = async () => {
    if (!idImage || !faceImage) {
      toast.error("Please upload ID and capture face image");
      return;
    }

    // Here you would typically send the images to your backend for verification
    // For this example, we'll just simulate a successful verification
    toast.success("Age verification successful!");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Age Verification</h1>
      <Card className="p-4 mb-4">
        <h2 className="text-xl mb-2">Upload ID</h2>
        <Input type="file" onChange={handleIdUpload} accept="image/*" />
        {idImage && <img src={idImage} alt="ID" className="mt-2 max-w-xs" />}
      </Card>
      <Card className="p-4 mb-4">
        <h2 className="text-xl mb-2">Face Detection</h2>
        <Button onClick={startCamera} className="mb-2">
          <Camera className="mr-2 h-4 w-4" /> Start Camera
        </Button>
        <video ref={videoRef} autoPlay className="mb-2" />
        <Button onClick={captureImage}>Capture Image</Button>
        {faceImage && <img src={faceImage} alt="Face" className="mt-2 max-w-xs" />}
      </Card>
      <Button onClick={verifyAge} className="w-full">Verify Age</Button>
    </div>
  );
};

export default AgeVerification;