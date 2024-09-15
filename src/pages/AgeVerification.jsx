import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Camera, Upload, FileText } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/useToast';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const AgeVerification = () => {
  const [idFile, setIdFile] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [faceImage, setFaceImage] = useState(null);
  const [birthDate, setBirthDate] = useState(null);
  const videoRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

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
          facingMode: "user",
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
      showToast("Failed to access camera. Please ensure camera permissions are granted.", "error");
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
      showToast("Please upload ID, capture face image, and select birth date", "error");
      return;
    }

    setIsVerifying(true);
    const formData = new FormData();
    formData.append('id_file', idFile);
    formData.append('face_image', faceImage);
    formData.append('birth_date', format(birthDate, 'dd/MM/yyyy'));

    try {
      const response = await axios.post('http://localhost:5000/verify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const { face_match, age, is_over_18 } = response.data;

      if (face_match && is_over_18) {
        navigate('/age-verified', { state: { age } });
      } else if (!face_match) {
        navigate('/age-not-verified', { state: { reason: 'face_mismatch' } });
      } else {
        navigate('/age-not-verified', { state: { reason: 'underage' } });
      }
    } catch (error) {
      console.error("Error during verification:", error);
      navigate('/age-not-verified', { state: { reason: 'error' } });
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Age Verification</h1>
      <Card className="p-4 mb-4">
        <h2 className="text-xl mb-2 text-center">Upload ID</h2>
        <label htmlFor="id-upload" className="flex flex-col items-center p-4 bg-secondary text-secondary-foreground rounded-md cursor-pointer">
          <Upload className="w-8 h-8 mb-2" />
          <span className="text-center">Choose ID Image or PDF</span>
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Capture Face Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <video ref={videoRef} autoPlay playsInline className="w-full rounded-md" />
              <div className="flex justify-between mt-4">
                <Button onClick={() => setIsDialogOpen(false)} variant="outline" className="w-[48%]">Cancel</Button>
                <Button onClick={captureImage} className="w-[48%]">Capture</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {faceImage && <img src={faceImage} alt="Face" className="mt-4 w-full rounded-md" />}
      </Card>
      <Card className="p-4 mb-4">
        <h2 className="text-xl mb-2 text-center">Birth Date</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !birthDate && "text-muted-foreground"
              )}
            >
              {birthDate ? format(birthDate, "MMMM yyyy") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={birthDate}
              onSelect={setBirthDate}
              initialFocus
              disabled={(date) => date > new Date() || date < new Date(1900, 0, 1)}
              captionLayout="dropdown-buttons"
              fromYear={1900}
              toYear={new Date().getFullYear()}
            />
          </PopoverContent>
        </Popover>
      </Card>
      <Button onClick={verifyAge} className="w-full" disabled={!idFile || !faceImage || !birthDate || isVerifying}>
        {isVerifying ? 'Verifying...' : 'Verify Age'}
      </Button>
    </div>
  );
};

export default AgeVerification;
