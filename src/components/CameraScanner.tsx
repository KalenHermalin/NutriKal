import { useState, useRef, useEffect } from 'react';
import { Circle } from 'lucide-react';
type CameraState = 'checking' | 'requesting' | 'active' | 'denied' | 'error' | 'stopped';

const CameraScanner = ({ onBarcodeDetected }: { onBarcodeDetected?: (barcode: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>('checking');
  const [error, setError] = useState<string>('');

  const retryAccess = () => {
    setError('');
    setCameraState('checking');
    checkPermissions();
  };
  const checkPermissions = async () => {
    try {
      console.log('Checking camera permissions...');

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraState('error');
        setError('Camera API not supported in this browser.');
        return;
      }

      // Check if permissions API is available
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        console.log('Camera permission status:', permission.state);

        if (permission.state === 'granted') {
          await startCamera();
        } else if (permission.state === 'denied') {
          setCameraState('denied');
          setError('Camera access is blocked. Please enable camera permissions in your browser settings.');
        } else {
          // Permission state is 'prompt', so request access
          await startCamera();
        }
      } else {
        // Permissions API not available, directly request camera access
        await startCamera();
      }
    } catch (err) {
      console.error('Permission check error:', err);
      setCameraState('error');
      setError('Failed to check camera permissions.');
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
          facingMode: 'user'
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
                setError('Failed to display camera feed.');
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
          setError('Camera access denied. Please allow camera permissions and try again.');
        } else if (err.name === 'NotFoundError') {
          setCameraState('error');
          setError('No camera found on this device.');
        } else if (err.name === 'NotReadableError') {
          setCameraState('error');
          setError('Camera is already in use by another application.');
        } else {
          setCameraState('error');
          setError(`Camera error: ${err.message}`);
        }
      } else {
        setCameraState('error');
        setError('An unknown camera error occurred.');
      }
    }
  };

  // ... keep existing code (checkPermissions and retryAccess functions)

  useEffect(() => {
    checkPermissions();

    // Cleanup on unmount
    return () => {
      console.log('CameraFeed component unmounting, cleaning up...');
      stopCamera()
    };
  }, []);



  /* const shutterButtonClass = `
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
     ${isScanning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 active:bg-gray-200 cursor-pointer'}
   `;
 */
  return (
    <div className="camera-container">
      {error && <div className="error">{error}</div>}

      {/* Always render the video element but hide it when not active */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`camera-video w-full h-full ${cameraState !== 'active' ? 'invisible' : ''}`}
        />

        {cameraState === 'active' && (
          <>
            <button
              className="camera-shutter-button absolute bottom-4 left-1/2 transform -translate-x-1/2"
              onClick={() => { console.log("Scanning Barcode") }}
              disabled={false}
            >
              <Circle size={48} color="#333" />
            </button>
            <button onClick={(e) => {
              e.preventDefault();
              stopCamera();
            }}>Stop Camera</button>
          </>
        )}
      </div>

      {cameraState === 'requesting' && <div className="overlay">Requesting camera permission...</div>}
      {cameraState === 'denied' && <div className="overlay">No access to camera. Please allow in settings.</div>}
    </div>
  );
};

export default CameraScanner;
