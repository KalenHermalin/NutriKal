// image-capture.d.ts
interface ImageCaptureOptions {
    imageWidth?: number;
    imageHeight?: number;
}

interface PhotoCapabilities {
    redEyeReduction?: string;
    imageHeight?: MediaSettingsRange;
    imageWidth?: MediaSettingsRange;
    fillLightMode?: string[];
}

interface PhotoSettings {
    fillLightMode?: string;
    imageHeight?: number;
    imageWidth?: number;
    redEyeReduction?: boolean;
}

interface ImageCapture {
    track: MediaStreamTrack;
    takePhoto(photoSettings?: PhotoSettings): Promise<Blob>;
    getPhotoCapabilities(): Promise<PhotoCapabilities>;
    getPhotoSettings(): Promise<PhotoSettings>;
    grabFrame(): Promise<ImageBitmap>;
}

interface ImageCaptureConstructor {
    new(track: MediaStreamTrack): ImageCapture;
}

interface Window {
    ImageCapture: ImageCaptureConstructor;
}
