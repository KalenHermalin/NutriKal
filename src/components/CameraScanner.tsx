import { useState, useRef, useEffect } from 'react';
import { Circle } from 'lucide-react';
import { useAnalyzePicture } from '../hooks/useApi';
import { useNavigate } from 'react-router-dom';
import { Food } from '../types';
import LoadingSpinner from './common/LoadingSpinner';
import { useError } from './ErrorSystem';

type CameraState = 'checking' | 'requesting' | 'active' | 'denied' | 'error' | 'stopped';

const CameraScanner = ({ onBarcodeDetected }: { onBarcodeDetected?: (barcode: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>('checking');
  const { analyzePicture } = useAnalyzePicture();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { addError } = useError();

  const retryAccess = () => {
    setCameraState('checking');
    checkPermissions();
  };

  const checkPermissions = async () => {
    try {
      console.log('Checking camera permissions...');

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraState('error');
        addError({
          message: 'Camera API not supported in this browser. Please use a modern browser.',
          type: 'system-critical'
        });
        return;
      }

      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        console.log('Camera permission status:', permission.state);

        if (permission.state === 'granted') {
          await startCamera();
        } else if (permission.state === 'denied') {
          setCameraState('denied');
          addError({
            message: 'Camera access is blocked. Please enable camera permissions in your browser settings.',
            type: 'user-recoverable',
            userAction: {
              label: 'Retry',
              onClick: retryAccess
            }
          });
        } else {
          await startCamera();
        }
      } else {
        await startCamera();
      }
    } catch (err) {
      console.error('Permission check error:', err);
      setCameraState('error');
      addError({
        message: 'Failed to check camera permissions.',
        type: 'system-critical'
      });
    }
  };
  const stopStream = () => {
    console.log("Stopping Stream")
    if (streamRef.current) {
      console.log('Stopping camera stream...');
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Camera track stopped:', track.label);
      });
      streamRef.current = null;
    }
  };

  const stopCamera = () => {
    stopStream();
    setCameraState('stopped');
    console.log('Camera manually stopped');
  };

  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      setCameraState('requesting');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment'
        },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log('Video playback started');
                setCameraState('active');
              })
              .catch(err => {
                console.error('Error playing video:', err);
                setCameraState('error');
                addError({
                  message: 'Failed to display camera feed.',
                  type: 'system-critical'
                });
              });
          }
        };
      }

      console.log('Camera started successfully');
    } catch (err) {
      console.error('Camera access error:', err);

      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraState('denied');
          addError({
            message: 'Camera access denied. Please allow camera permissions and try again.',
            type: 'user-recoverable',
            userAction: {
              label: 'Retry',
              onClick: retryAccess
            }
          });
        } else if (err.name === 'NotFoundError') {
          setCameraState('error');
          addError({
            message: 'No camera found on this device.',
            type: 'system-critical'
          });
        } else if (err.name === 'NotReadableError') {
          setCameraState('error');
          addError({
            message: 'Camera is already in use by another application.',
            type: 'user-recoverable',
            userAction: {
              label: 'Retry',
              onClick: retryAccess
            }
          });
        } else {
          setCameraState('error');
          addError({
            message: `Camera error: ${err.message}`,
            type: 'system-critical'
          });
        }
      } else {
        setCameraState('error');
        addError({
          message: 'An unknown camera error occurred.',
          type: 'system-critical'
        });
      }
    }
  };

  const takePhoto = async () => {
    setIsLoading(true);
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];

        try {
          const [data, error] = await analyzePicture(base64Image);
          if (error) {
            addError({
              message: error.message,
              type: 'user-recoverable',
              userAction: {
                label: 'Try Again',
                onClick: takePhoto
              }
            });
            setIsLoading(false);
            return
          }

          console.log("CamScan: ", data);

          if (data && data.ingredients && data.ingredients.length === 1) {
            const food: Food = data.ingredients[0];
            // Make sure we're passing the food object correctly
            navigate(`/food/${food.food_id}`, {
              state: { food }
            });
          } else if (data && data.ingredients && data.ingredients.length > 1) {
            // Pass the entire meal array as state
            navigate('/meal', {
              state: { meal: data.ingredients }
            });
          } else {
            console.warn('No ingredients found in the analysis result.');
            addError({
              message: 'No food detected. Try taking a clearer picture with better lighting.',
              type: 'user-recoverable',
              userAction: {
                label: 'Try Again',
                onClick: takePhoto
              }
            });
            setIsLoading(false);
          }
        } catch (error) {
          addError({
            message: 'Failed to analyze the picture. Please check your internet connection and try again.',
            type: 'user-recoverable',
            userAction: {
              label: 'Retry',
              onClick: takePhoto
            }
          });
          setIsLoading(false);
        }
      } else {
        addError({
          message: 'Failed to process the image. Please try again.',
          type: 'system-critical'
        });
        setIsLoading(false);

      }
    }
  };


  useEffect(() => {
    checkPermissions();
    // Cleanup on unmount
    return () => {
      console.log('CameraFeed component unmounting, cleaning up...');
      stopCamera()
    };
  }, []);



  const shutterButtonClass = `
     rounded-full
     bg-white
     shadow-lg
     border-4
     border-gray-200
     h-20
     w-20
     flex
     items-center
     justify-center
     focus:outline-none
     ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 active:bg-gray-200 cursor-pointer'}
   `;

  return (
    <div className="camera-container">
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`camera-video w-full h-full ${cameraState !== 'active' ? 'invisible' : ''}`}
        />

        {cameraState === 'active' && (
          <button
            className="camera-shutter-button absolute bottom-4 left-1/2 transform -translate-x-1/2"
            onClick={takePhoto}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size={48} color="#fff" />
            ) : (
              <Circle size={48} color="#333" />
            )}
          </button>
        )}
      </div>

      {cameraState === 'requesting' && <div className="overlay">Requesting camera permission...</div>}
      {cameraState === 'denied' && <div className="overlay">No access to camera. Please allow in settings.</div>}
    </div>
  );
};

export default CameraScanner;
