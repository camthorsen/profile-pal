// app/page.tsx
'use client'; // ← This file uses React hooks, so it must run in the browser

import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import dynamic from 'next/dynamic';

const ReactMic = dynamic(() => import('react-mic').then((mod) => mod.ReactMic), {
  ssr: false,
});

interface ProfileResponse {
  tags: string[]; // e.g. ["cat", "short fur", …]
  summary: string; // 1–2 paragraphs of descriptive text
}

export default function GeneratorPage() {
  // —— State for image upload/compression —— //
  const [rawImageFile, setRawImageFile] = useState<File | null>(null);
  const [compressedImage, setCompressedImage] = useState<File | null>(null);

  // —— State for audio upload or recording —— //
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);

  // —— State for server response —— //
  const [responseData, setResponseData] = useState<ProfileResponse | null>(null);

  // Ref for resetting file input TODO: Remove if not needed
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 1) Handle image selection from disk and compress it client‐side.
   */
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setRawImageFile(file);

    try {
      // Configure options: max 0.5 MB, max dimension 800px
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      const compressedBlob = await imageCompression(file, options);
      // Wrap the Blob into a new File so we can append it to FormData
      const compressedFile = new File([compressedBlob], file.name, {
        type: compressedBlob.type,
        lastModified: Date.now(),
      });
      setCompressedImage(compressedFile);
    } catch (err) {
      console.error('Image compression failed:', err);
      // If compression fails, fall back to the original file
      setCompressedImage(file);
    }
  };

  /**
   * 2A) Handle when a user uploads an existing audio file from disk.
   */
  const handleAudioUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setAudioFile(e.target.files[0]);
  };

  /**
   * 2B) In-browser recording with ReactMic
   */
  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
  };
  const onData = (recordedChunk: Blob) => {
    // We could process streaming chunks here; for MVP we just ignore intermediate data
  };
  const onStop = (recordedData: { blob: Blob }) => {
    // Once recording stops, we get a Blob. Wrap it in a File so we can attach to FormData
    setRecordingBlob(recordedData.blob);
    const fileFromBlob = new File([recordedData.blob], 'recorded_audio.webm', {
      type: recordedData.blob.type,
      lastModified: Date.now(),
    });
    setAudioFile(fileFromBlob);
  };

  /**
   * 3) Package compressedImage + audioFile into FormData and POST to the API route.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!compressedImage || !audioFile) {
      alert('Please provide both an image and an audio clip before submitting.');
      return;
    }

    // Build FormData: keys must match what our API will expect (“image” & “audio”)
    const formData = new FormData();
    formData.append('image', compressedImage);
    formData.append('audio', audioFile);

    try {
      // Use the Fetch API to POST to /api/process-profile
      const resp = await fetch('/api/process-profile', {
        method: 'POST',
        body: formData,
      });

      if (!resp.ok) {
        throw new Error(`Server responded with ${resp.status}`);
      }

      const data: ProfileResponse = await resp.json();
      setResponseData(data);
    } catch (err) {
      console.error('Error calling /api/process-profile:', err);
      alert('Something went wrong generating the profile. Check console for details.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Animal Adoption Profile Demo</h1>

      {/* —— IMAGE UPLOAD + PREVIEW —— */}
      <div>
        <label className="block font-medium mb-1">1. Upload an image of the animal:</label>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} />
        {rawImageFile && (
          <div className="mt-2">
            <p>
              Original: {rawImageFile.name} ({(rawImageFile.size / 1024).toFixed(1)} KB)
            </p>
          </div>
        )}
        {compressedImage && (
          <div className="mt-2">
            <p>Compressed size: {(compressedImage.size / 1024).toFixed(1)} KB</p>
            <Image
              src={URL.createObjectURL(compressedImage)}
              alt="Compressed preview"
              width={200}
              height={200}
              className="object-contain rounded-md border"
            />
          </div>
        )}
      </div>

      {/* —— AUDIO UPLOAD OR RECORD —— */}
      <div>
        <label className="block font-medium mb-1">2. Provide audio describing the animal:</label>
        <div className="space-y-4">
          {/* 2A: Upload existing audio */}
          <div>
            <input type="file" accept="audio/*" onChange={handleAudioUploadChange} />
            {audioFile && (
              <p className="mt-1 text-sm text-gray-600">
                Selected audio: {audioFile.name} ({(audioFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          {/* 2B: Record in-browser */}
          <div>
            <button
              onClick={toggleRecording}
              className={`px-4 py-2 rounded ${isRecording ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            <div className="mt-2">
              <ReactMic
                record={isRecording}
                className="w-full"
                onStop={onStop}
                onData={onData}
                mimeType="audio/webm" // record as WebM (reasonable bitrate)
                strokeColor="#4CAF50"
                backgroundColor="#f0f0f0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* —— SUBMIT BUTTON —— */}
      <div>
        <button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Generate Profile
        </button>
      </div>

      {/* —— DISPLAY RESULTS —— */}
      {responseData && (
        <div className="mt-6 border-t pt-4 space-y-4">
          <h2 className="text-xl font-semibold">Generated Tags:</h2>
          <ul className="list-disc list-inside">
            {responseData.tags.map((tag, i) => (
              <li key={i}>{tag}</li>
            ))}
          </ul>
          <h2 className="text-xl font-semibold">Profile Summary:</h2>
          <div className="prose max-w-none">
            {responseData.summary.split('\n\n').map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
