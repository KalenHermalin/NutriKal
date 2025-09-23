import { useEffect, useRef, useState } from "react";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BarcodeDetectorPolyfill } from '@undecaf/barcode-detector-polyfill'
import { analyzePhoto, scanBarcode } from "@/hooks/useApi";
import { useNavigate } from "react-router";

const Scanner = () => {
  const [scanMode, setScanMode] = useState("scan-food");
  const [hasPhoto, setHasPhoto] = useState(false);
  const [scanedBarcode, setScanedBarcode] = useState<string>('')
  const [base64Pic, setBase64Pic] = useState<string>('')
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream>(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate()

  const { data: barcodeData } = scanBarcode(scanedBarcode)
  const { data: photoData} = analyzePhoto(base64Pic)

  
useEffect(() => {
  if (photoData && photoData !== undefined && photoData !== null) {
    navigate("/add-meal", {state: {
      meal: {
        name: photoData.meal_name,
        foods: photoData.ingredients
      }
    }})
  }
}, [photoData])

  try {
    //@ts-ignore
    window['BarcodeDetector'].getSupportedFormats()
  } catch {
    //@ts-ignore
    window['BarcodeDetector'] = BarcodeDetectorPolyfill
  }


  // Function to handle file selection (optional, for processing selected files)
  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> { }

  interface SelectedFiles {
    length: number;
    [index: number]: File;
  }

  const handleFileChange = (event: FileChangeEvent) => {
    const selectedFiles: SelectedFiles = event.target.files as SelectedFiles;
    if (selectedFiles.length > 0) {
      console.log('Selected files:', selectedFiles);
      selectedFiles[0].arrayBuffer().then(buffer => {
        const base64String = btoa(
          new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        setBase64Pic(base64String)
        setHasPhoto(true);
      });
      // You can process the selected files here (e.g., upload them, display their names)
    }
  };

  const stopVideo = () => {
    if (streamRef.current) {
      let stream = streamRef.current;
      let tracks = stream.getTracks();
      tracks.forEach(track =>
        track.stop()
      );
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }
  const getVideo = () => {
    stopVideo();
    navigator.mediaDevices.getUserMedia({
      video: { width: 1080, height: 1920, facingMode: "environment" }, audio: false
    }).then(stream => {
      let video = videoRef.current;
      if (!video) return;
      //@ts-ignore
      video.srcObject = stream;
      streamRef.current = stream;
      video?.play();
    })
      .catch(err => {
        console.error("error:", err);
      });
  }

  const ScanBarcode = async () => {
    try {
      console.log("detecting")
      //@ts-ignore
      const detector: BarcodeDetectorPolyfill = new BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'] })
      const barcodes = await detector.detect(photoRef.current)
      if (barcodes.length > 0) {
        const barcode = barcodes[0];
        if (barcode.format === 'upc_a') {
          barcode.rawValue = `0${barcode.rawValue}`;
        }
        if (barcode.format === 'ean_8') {
          barcode.rawValue = `00000${barcode.rawValue}`;
        }
        setScanedBarcode(barcode.rawValue)
      } else {
        console.log("no barcodes found")
        setHasPhoto(false);
        videoRef.current?.play()
      }
    } catch (error) {
      console.log(error)
    }
    

  }

  const scanFood = () => {
      console.log("scanning")
      let photo = photoRef.current;
      const b64Pic = photo?.toDataURL('image/jpeg').split(',')[1]
      if (!b64Pic) {
        alert("Couldn't get image data");
        setHasPhoto(false);
        videoRef.current?.play()
      }
      setBase64Pic(b64Pic!)
    }
  const takePhoto = () => {
    let video = videoRef.current;
    let photo = photoRef.current;
    if (!video || !photo) return;
    photo.width = video.videoWidth;
    photo.height = video.videoHeight;
    let ctx = photo.getContext("2d");
    ctx?.drawImage(video, 0, 0);
    if (scanMode === "barcode") ScanBarcode();
    else if (scanMode === "scan-food") scanFood();
      setHasPhoto(true);
    video.pause();
  }
  useEffect(() => {
    getVideo();
  }, [videoRef])
  // Disable scrolling on mount, restore on unmount
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      stopVideo();
      document.body.style.overflow = original;
    };
  }, []);
  return (
    <div className="flex flex-col items-center overflow-hidden w-full flex-1">
      {/* Header */}
      <div className="px-4 py-6 flex-shrink-0 w-full">
        <h1 className="text-xl font-semibold text-foreground">Scanner</h1>
      </div>

      {/* Camera Feed - Full available space */}
      <div className="flex-1 px-4 w-full flex justify-center overflow-hidden pb-24">
        <div className="relative w-full max-w-[375px] rounded-3xl overflow-hidden">
          {/* Camera feed placeholder */}
          {/* VIDEO FEED */}

          <video className={`w-full h-full flex items-center justify-center object-cover ${hasPhoto ? "hidden" : "block"}`} ref={videoRef} />

          
          <canvas className={`w-full h-full flex items-center justify-center object-cover ${hasPhoto ? "block" : "hidden"}`} ref={photoRef} />

          {/* Toggle Group for Scan Options - Bottom overlay */}
          <div className="absolute bottom-25 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
            <ToggleGroup
              type="single"
              value={scanMode}
              onValueChange={(value) => value && setScanMode(value)}
              className="flex gap-2"
            >
              <ToggleGroupItem
                value="scan-food"
                className="inline-flex flex-col h-16 items-center gap-1 px-2 py-1 bg-card hover:bg-accent data-[state=on]:bg-primary text-card-foreground rounded"
              >
                <Camera size={20} />
                <span className="text-sm font-medium">scan food</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="barcode"
                className="inline-flex flex-col h-16 items-center gap-1 px-2 py-1 bg-card hover:bg-accent data-[state=on]:bg-primary text-card-foreground rounded"
              >
                <div className="w-5 h-5 border-2 border-current rounded-sm flex items-center justify-center">
                  <div className="w-2 h-3 border-l-2 border-current"></div>
                </div>
                <span className="text-sm font-medium">Barcode</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="food-label"
                className="inline-flex flex-col h-16 items-center gap-1 px-2 py-1 bg-card hover:bg-accent data-[state=on]:bg-primary text-card-foreground rounded"
              >
                <div className="w-5 h-5 border-2 border-current rounded-sm flex items-center justify-center">
                  <div className="w-3 h-1 bg-current rounded-full"></div>
                </div>
                <span className="text-sm font-medium">Food Label</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Red Shutter Button - Bottom Center */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <Button
              size="icon"
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-900 border-4 border-white shadow-lg"
              onClick={takePhoto}
            >
              <div className="w-12 h-12 rounded-full bg-red-600"></div>
            </Button>
          </div>
          {/* Gray Upload Button - Bottom Right */}

          <div className="absolute bottom-6 right-4 z-50">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden" // Hide the input visually
            />
            <Button
              size="icon"
              className="w-12 h-12 rounded-lg bg-card hover:bg-accent shadow-lg"
              onClick={() => {
                //@ts-ignore
                fileInputRef.current.click();
              }}
            >
              <Upload className="w-6 h-6 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
