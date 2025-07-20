import { useState, useRef, useEffect } from 'react';
import { Circle } from 'lucide-react';
import { useAnalyzePicture, useScanBarcode } from '../hooks/useApi';
import { useNavigate } from 'react-router-dom';
import { Food, MealServerResponse } from '../types';
import LoadingSpinner from './common/LoadingSpinner';
import { useNotification } from './ErrorSystem';

type CameraState = 'checking' | 'requesting' | 'active' | 'denied' | 'error' | 'stopped';
interface CameraScannerProps {
  mode: string;
}
const CameraScanner = ({ mode }: CameraScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [idk, setIdk] = useState<string>('');
  const [cameraState, setCameraState] = useState<CameraState>('checking');
  const [barcodeAvalible, setBarcodeAvalible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { addNotifications } = useNotification();
  const { analyzePicture } = useAnalyzePicture();
  const { scanBarcode } = useScanBarcode();

  const retryAccess = () => {
    setCameraState('checking');
    checkPermissions();
  };

  const checkPermissions = async () => {
    try {
      console.log('Checking camera permissions...');

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraState('error');
        addNotifications({
          message: 'Camera API not supported in this browser. Please use a modern browser.',
          type: 'system-critical'
        });
        return;
      }

      if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'camera' }).then(res => {
          if (res.state === 'prompt')
            addNotifications({
              message: "Requesting camera access...",
              type: "info"
            })
          if (res.state === 'denied') {
            addNotifications({
              message: "Camera access denied. Please allow camera permissions in your browser settings.",
              type: "user-error"
            })
          }
          if (res.state === 'granted') {
            startCamera();
          }

        })

      } else {
        addNotifications({
          message: 'Permissions API not supported in this browser. Please use a modern browser.',
          type: 'system-critical'
        });
        return;
      }
    } catch (err) {
      console.error('Permission check error:', err);
      setCameraState('error');
      addNotifications({
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
      setCameraState('stopped');
    }
  };

  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      setCameraState('requesting');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment',
        },
        audio: false
      });
      streamRef.current = stream;

      if (videoRef.current) {
        addNotifications({
          message: 'Camera access granted. Starting video feed...',
          type: 'info'
        });
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
                addNotifications({
                  message: 'Failed to display camera feed.',
                  type: 'system-critical'
                });
              });
          }
        };
      }
    } catch (err) {
      console.error('Camera access error:', err);

      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraState('denied');
          addNotifications({
            message: 'Camera access denied. Please allow camera permissions and try again.',
            type: 'user-error',
            userAction: {
              label: 'Retry',
              onClick: retryAccess
            }
          });
        } else if (err.name === 'NotFoundError') {
          setCameraState('error');
          addNotifications({
            message: 'No camera found on this device.',
            type: 'system-critical'
          });
        } else if (err.name === 'NotReadableError') {
          setCameraState('error');
          addNotifications({
            message: 'Camera is already in use by another application.',
            type: 'user-error',
            userAction: {
              label: 'Retry',
              onClick: retryAccess
            }
          });
        } else {
          setCameraState('error');
          addNotifications({
            message: `Camera error: ${err.message}`,
            type: 'system-critical'
          });
        }
      } else {
        setCameraState('error');
        addNotifications({
          message: 'An unknown camera error occurred.',
          type: 'system-critical'
        });
      }
    }
  };
  const toggleTorch = async () => {

    const track = streamRef.current?.getVideoTracks()[0];
    const capabilities = track?.getCapabilities();
    if (track) {
      if(capabilities) {
        setIdk(`Torch capabilities: ${JSON.stringify(capabilities)}`);
        if ('torch' in capabilities) {
          addNotifications({
          message: "AToggling torch mode...",
          type: 'info'
        });
            // Toggle torch by keeping a local state (for demo purposes, always turn on)
            track.applyConstraints({
              //@ts-ignore
              advanced: [{ torch: true }]
            });
          }
      }
    }

  }
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
        if (!base64Image) {
          addNotifications({
            message: 'Failed to capture image. Please try again.',
            type: 'user-error',
          });
          setIsLoading(false);
          return;
        }
        if (mode === 'barcode' && barcodeAvalible) {

          try {

            //@ts-ignore
            const barcodeDetector = new BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'] });
            const barcodes = await barcodeDetector.detect(canvas);
            if (barcodes.length > 0) {
              console.log("Detected barcodes: ", barcodes);
              addNotifications({
                message: `Detected barcode: ${barcodes[0].rawValue} & ${barcodes[0].format}`,
                type: 'info'
              });
              const barcode = barcodes[0];
              if (barcode.format === 'upc_a') {
                barcode.rawValue = `00${barcode.rawValue}`;
              }
              if (barcode.format === 'ean_8') {
                barcode.rawValue = `00000${barcode.rawValue}`;
              }
              const { data, error, isError } = await scanBarcode(barcode.rawValue);
              if (isError && error) {
                addNotifications({
                  message: error.message,
                  type: 'user-error',
                });
                setIsLoading(false);
                return;
              }
              const newState: MealServerResponse = {
                ingredients: [data.foods],
                success: true,
                meal_name: data.foods.food_name || data.foods._brand_name
              }
              navigate(`/food`, {
                state: { mealData: newState }
              });
            }
          } catch (error) {
            console.error("Error detecting barcodes:", error);
            addNotifications({
              message: `Failed to detect barcodes. Please try again. ${(error as Error).message}`,
              type: 'user-error',

            });
            setIsLoading(false);
          }
        } else if (mode === 'camera') {
          try {
            const { data, error, isError } = await analyzePicture(base64Image);
            if (isError && error) {
              addNotifications({
                message: error.message,
                type: 'user-error',
                userAction: {
                  label: 'Try Again',
                  onClick: takePhoto
                }
              });
              setIsLoading(false);
              return
            }

            console.log("CamScan: ", data);

            if (data && data.ingredients && data.ingredients.length >= 1) {

              navigate(`/food`, {
                state: { mealData: data }
              });
            } else {
              console.warn('No ingredients found in the analysis result.');
              addNotifications({
                message: 'No food detected. Try taking a clearer picture with better lighting.',
                type: 'user-error',
                userAction: {
                  label: 'Try Again',
                  onClick: takePhoto
                }
              });
              setIsLoading(false);
            }
          } catch (error) {
            console.log(error)
            addNotifications({
              message: 'Failed to analyze the picture. Please check your internet connection and try again.',
              type: 'user-error',
            });
            setIsLoading(false);
          }
        } else {
          addNotifications({
            message: 'Failed to process the image. Please try again.',
            type: 'system-critical'
          });
          setIsLoading(false);

        }
      }
    }
  };

  useEffect(() => {
    if ('BarcodeDetector' in globalThis) {
      addNotifications({
        message: "Barcode Detector is available",
        type: 'info'
      })
      setBarcodeAvalible(true);
    } else {
      addNotifications({
        message: "Barcode detector API is not available, some browsers need to enable this feature",
        type: 'info'
      })
      setBarcodeAvalible(false);
    }
    checkPermissions();
    // Cleanup on unmount
    return () => {
      console.log('CameraFeed component unmounting, cleaning up...');
      stopStream();
    };
  }, []);

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
        <button onClick={toggleTorch}>Click me for torch</button>
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
        <div>{idk}</div>
      </div>

      {cameraState === 'requesting' && (
        <RequestiongCamereaComp />
      )}
      {cameraState === 'denied' && <div className="overlay">No access to camera. Please allow in settings.</div>}
    </div>
  );
};


const RequestiongCamereaComp = () => {
  const { addNotifications } = useNotification()
  useEffect(() => {


  }, [])
  return (
    <div className="flex flex-col items-center justify-center">
      <LoadingSpinner size={128} color='#333' />
      <p className="mt-4 text-center text-gray-700">Requesting camera access...</p>
    </div>
  )
}
export default CameraScanner;
