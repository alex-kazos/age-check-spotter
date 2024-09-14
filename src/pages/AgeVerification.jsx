import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Camera, Upload, FileText } from 'lucide-react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AgeVerification = () => {
  const [idFile, setIdFile] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [faceImage, setFaceImage] = useState(null);
  const [birthDate, setBirthDate] = useState('');
  const videoRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleIdUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIdFile(file);
      if (file.type === 'application/pdf') {
        setIdPreview(<FileText className="w-16 h-16 mx-auto mt-4" />);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setIdPreview(<img src={reader.result} alt="ID Preview" className="mt-4 w-full rounded-md" />);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: { ideal: "user" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Failed to access camera. Please ensure camera permissions are granted.");
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      setFaceImage(canvas.toDataURL('image/jpeg'));
      stopCamera();
      setIsDialogOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const handleDialogClose = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      stopCamera();
    }
  };

  const verifyAge = async () => {
    if (!idFile || !faceImage || !birthDate) {
      toast.error("Please upload ID, capture face image, and enter birth date");
      return;
    }

    const formData = new FormData();
    formData.append('id_file', idFile);
    formData.append('face_image', faceImage);
    formData.append('birth_date', birthDate);

    try {
      const response = await axios.post('http://localhost:5000/verify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
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
          <span>Choose ID Image or PDF</span>
          <Input id="id-upload" type="file" onChange={handleIdUpload} accept="image/*,application/pdf" className="hidden" />
        </label>
        {idPreview}
      </Card>
      <Card className="p-4 mb-4">
        <h2 className="text-xl mb-2 text-center">Face Detection</h2>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setIsDialogOpen(true);
              startCamera();
            }} className="w-full mb-2">
              <Camera className="mr-2 h-4 w-4" /> Open Camera
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Capture Face Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <video ref={videoRef} autoPlay playsInline className="w-full rounded-md" />
              <Button onClick={captureImage} className="w-full">Capture Image</Button>
            </div>
          </DialogContent>
        </Dialog>
        {faceImage && <img src={faceImage} alt="Face" className="mt-4 w-full rounded-md" />}
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
      <Button onClick={verifyAge} className="w-full" disabled={!idFile || !faceImage || !birthDate}>
        Verify Age
      </Button>
    </div>
  );
};

export default AgeVerification;