'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { generateDiseaseReport } from '@/lib/groq-service';

// Import Capacitor plugins
let Camera;
// Dynamic import for Capacitor (only works on client-side)
if (typeof window !== 'undefined') {
  import('@capacitor/camera').then(module => {
    Camera = module.Camera;
  });
}

const PlantDiseaseDetector = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [reportMarkdown, setReportMarkdown] = useState('');
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Check if on mobile device
  useEffect(() => {
    setIsMobile(
      typeof window !== 'undefined' && 
      (navigator.userAgent.includes('Android') || 
       navigator.userAgent.includes('iPhone'))
    );
  }, []);

  // Clean up camera resources when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Function to handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setResult(null);
    setReportMarkdown('');
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    // Create image preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Function to start camera preview
  const startCameraPreview = async () => {
    try {
      // For Capacitor mobile apps
      if (isMobile && Camera) {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: 'dataUrl',
          source: 'CAMERA',
        });
        
        setImagePreview(image.dataUrl);
        setError(null);
        setResult(null);
        setReportMarkdown('');
        return;
      }
      
      // For desktop browsers - open camera modal with live preview
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        setShowCameraModal(true);
        
        // Small delay to ensure modal is rendered before accessing video element
        setTimeout(async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
              video: { facingMode: "environment" }, // prefer rear camera
              audio: false 
            });
            
            streamRef.current = stream;
            
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play();
            }
          } catch (e) {
            console.error('Camera preview error:', e);
            setShowCameraModal(false);
            setError('Could not access camera. Please check permissions.');
          }
        }, 100);
      } else {
        // Fallback if getUserMedia is not supported
        document.getElementById('image-upload')?.click();
      }
    } catch (e) {
      console.error('Camera error:', e);
      setError('Could not access camera. Falling back to file upload.');
      document.getElementById('image-upload')?.click();
    }
  };

  // Function to capture photo from live preview
  const capturePhoto = () => {
    if (!videoRef.current || !streamRef.current) return;
    
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const dataUrl = canvas.toDataURL('image/jpeg');
    
    // Stop the camera stream
    streamRef.current.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    
    // Close modal and set the captured image
    setShowCameraModal(false);
    setImagePreview(dataUrl);
    setError(null);
    setResult(null);
    setReportMarkdown('');
  };

  // Function to close camera modal
  const closeCameraModal = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCameraModal(false);
  };

  // Function to analyze the image
  const analyzeImage = async () => {
    if (!imagePreview) return;
    
    setIsAnalyzing(true);
    setError(null);
    setReportMarkdown('');
    
    try {
      // Extract base64 data from the data URL
      const base64Data = imagePreview.split(',')[1];
      
      // Call your API
      const response = await fetch('http://localhost:8000/plant/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_base64: base64Data
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResult(data.prediction);
        // After getting the prediction, fetch the detailed report
        fetchDetailedReport(data.prediction.label);
      } else {
        setError('Could not analyze the image. Please try again.');
      }
      
    } catch (err) {
      setError('Error connecting to the server. Please try again later.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Function to fetch detailed report from Groq
  const fetchDetailedReport = async (diseaseName) => {
    setIsLoadingReport(true);
    try {
      const report = await generateDiseaseReport(diseaseName);
      setReportMarkdown(report);
    } catch (error) {
      console.error("Error fetching report:", error);
      setReportMarkdown("# Error\nCouldn't retrieve detailed information at this time.");
    } finally {
      setIsLoadingReport(false);
    }
  };

  // Function to reset the component
  const resetDetector = () => {
    setImagePreview(null);
    setResult(null);
    setError(null);
    setIsAnalyzing(false);
    setReportMarkdown('');
  };

  return (
    <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto p-4">
      <div className="w-full border rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b">
          <h3 className="text-xl font-bold">Plant Disease Detector</h3>
          <p className="text-sm text-gray-500">
            Upload or take a photo of a plant leaf to identify potential diseases
          </p>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Image Upload/Preview Section */}
          <div className="flex flex-col items-center space-y-3">
            {imagePreview ? (
              <div className="relative w-full h-60 md:h-80 lg:h-96 rounded-lg overflow-hidden">
                <Image 
                  src={imagePreview} 
                  alt="Plant image" 
                  fill 
                  style={{ objectFit: 'cover' }} 
                  unoptimized={true}
                />
                <button 
                  className="absolute top-2 right-2 bg-white/70 hover:bg-white/90 p-2 rounded-full"
                  onClick={resetDetector}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z"></path>
                    <path d="M16 12 8 12"></path>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="w-full h-60 md:h-80 lg:h-96 bg-gray-100 rounded-lg flex flex-col items-center justify-center p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mb-2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <p className="text-sm text-gray-400">
                  Upload a clear image of the plant leaf
                </p>
              </div>
            )}
            
            {/* Image Upload Controls */}
            <div className="flex items-center justify-center w-full space-x-3">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              
              <button 
                className="flex-1 py-2 px-4 border rounded-md flex items-center justify-center text-sm"
                onClick={() => document.getElementById('image-upload')?.click()}
                disabled={isAnalyzing}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Upload Image
              </button>
              
              <button 
                className="flex-1 py-2 px-4 border rounded-md flex items-center justify-center text-sm"
                onClick={startCameraPreview}
                disabled={isAnalyzing}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                Take Photo
              </button>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 p-3 rounded-md flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mr-2 mt-0.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}
          
          {/* Analysis Results */}
          {isAnalyzing && (
            <div className="space-y-3">
              <p className="font-medium">Analyzing plant image...</p>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          )}
          
          {result && !isAnalyzing && (
            <div className="space-y-3 border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <p className="font-medium">Detection Result</p>
                <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {(result.score * 100).toFixed(1)}% confidence
                </span>
              </div>
              
              <div className="py-2">
                <h3 className="text-lg font-bold">{result.label}</h3>
                {isLoadingReport && (
                  <p className="text-sm text-gray-500 mt-1">
                    Getting detailed information about this disease...
                  </p>
                )}
              </div>
              
              {/* Detailed disease report */}
              {isLoadingReport ? (
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse mt-2"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mt-2"></div>
                </div>
              ) : reportMarkdown ? (
                <div className="bg-gray-50 p-4 rounded-lg prose prose-sm max-w-none">
                  <ReactMarkdown>{reportMarkdown}</ReactMarkdown>
                </div>
              ) : null}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t">
          <button 
            className={`w-full py-2 px-4 rounded-md text-white ${
              !imagePreview || isAnalyzing 
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={!imagePreview || isAnalyzing}
            onClick={analyzeImage}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Plant'}
          </button>
        </div>
      </div>

      {/* Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg overflow-hidden max-w-md w-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium">Camera Preview</h3>
              <button 
                onClick={closeCameraModal}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="bg-black relative">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-auto"
              ></video>
            </div>
            
            <div className="p-4">
              <button 
                onClick={capturePhoto}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Capture Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantDiseaseDetector;