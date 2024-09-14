import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Camera, Upload } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import * as faceapi from 'face-api.js';

const AgeVerification = () => {
  const [idImage, setIdImage] = useState(null);
  const [faceImage, setFaceImage] = useState(null);
  const [birthDate, setBirthDate] = useState(null);
  const videoRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    };
    loadModels();
  }, []);

  const handleIdUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setIdImage(reader.result);
        await extractBirthDate(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractBirthDate = async (imageData) => {
    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(imageData);
    await worker.terminate();

    const dateRegex = /\b\d{2}[/-]\d{2}[/-]\d{4}\b/;
    const match = text.match(dateRegex);
    if (match) {
      setBirthDate(match[0]);
      toast.success(`Birth date extracted: ${match[0]}`);
    } else {
      toast.error('Could not extract birth date from ID');
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
      toast.error("Please upload ID, capture face image, and ensure birth date is extracted");
      return;
    }

    // Check if the person is over 18
    const birthDateObj = new Date(birthDate);
    const ageDifMs = Date.now() - birthDateObj.getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    if (age < 18) {
      toast.error("You must be 18 or older to proceed");
      return;
    }

    // Compare faces
    const idFaceDetection = await faceapi.detectSingleFace(idImage).withFaceLandmarks().withFaceDescriptor();
    const liveFaceDetection = await faceapi.detectSingleFace(faceImage).withFaceLandmarks().withFaceDescriptor();

    if (idFaceDetection && liveFaceDetection) {
      const faceMatcher = new faceapi.FaceMatcher(idFaceDetection);
      const match = faceMatcher.findBestMatch(liveFaceDetection.descriptor);

      if (match.distance < 0.6) {
        toast.success("Age verification successful! Face match confirmed.");
      } else {
        toast.error("Face does not match the ID. Please try again.");
      }
    } else {
      toast.error("Could not detect faces in both images. Please try again.");
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
        {birthDate && <p className="mt-2 text-center">Extracted Birth Date: {birthDate}</p>}
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
      <Button onClick={verifyAge} className="w-full" disabled={!idImage || !faceImage || !birthDate}>
        Verify Age
      </Button>
    </div>
  );
};

export default AgeVerification;
