/* eslint no-alert: off */

'use client'; // ← This file uses React hooks, so it must run in the browser

import imageCompression from 'browser-image-compression';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import type { ClipScore } from 'pet-profiler-api';
import { type ChangeEvent, type FormEvent, type ReactElement, useRef, useState } from 'react';

import { Card } from '@/components/Card.tsx';
import { CopyToClipboard } from '@/components/CopyToClipboard.tsx';
import { DragDropInput } from '@/components/DragDropInput.tsx';
import { Header } from '@/components/Header.tsx';
import { H1 } from '@/components/typography/H1.tsx';
import { H2 } from '@/components/typography/H2.tsx';
import { cn } from '@/utils/cn.ts';

const ReactMic = dynamic(() => import('react-mic').then((mod) => mod.ReactMic), {
  ssr: false,
});

interface ProfileResponse {
  clipScores: ClipScore[];
  bestTag: string; // e.g. ["cat", "short fur", …]
  transcript: string; // The transcribed audio text
  summary: string; // 1–2 paragraphs of descriptive text
}

function ImageUploadSection({
  rawImageFile,
  compressedImage,
  fileInputRef,
  onImageChange,
}: {
  rawImageFile: File | undefined;
  compressedImage: File | undefined;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onImageChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
}): ReactElement {
  const uploadIcon = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );

  const successIcon = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  return (
    <div>
      <DragDropInput
        accept="image/*"
        file={compressedImage}
        onFileChange={onImageChange}
        fileInputRef={fileInputRef}
        uploadText="Upload an image"
        fileTypesText="PNG, JPG, GIF up to 10MB"
        successText="Image uploaded successfully"
        changeText="Click to upload a different image"
        uploadIcon={uploadIcon}
        successIcon={successIcon}
      />
      
      {rawImageFile && (
        <div className="mt-4 text-sm text-gray-600">
          <p>Original: {rawImageFile.name} ({(rawImageFile.size / 1024).toFixed(1)} KB)</p>
        </div>
      )}
      {compressedImage && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Compressed size: {(compressedImage.size / 1024).toFixed(1)} KB</p>
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
  );
}

function AudioSection({
  audioFile,
  isRecording,
  onAudioUploadChange,
  onToggleRecording,
  onStop,
  onData,
}: {
  audioFile: File | undefined;
  isRecording: boolean;
  onAudioUploadChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onToggleRecording: () => void;
  onStop: (recordedData: { blob: Blob }) => void;
  onData: (recordedChunk: Blob) => void;
}): ReactElement {
  const uploadIcon = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  );

  const successIcon = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  return (
    <div className="space-y-4">
      {/* 2A: Upload existing audio */}
      <div>
                 <DragDropInput
           accept="audio/*"
           file={audioFile}
           onFileChange={onAudioUploadChange}
           uploadText="Upload an audio file"
          fileTypesText="MP3, WAV, M4A up to 4MB"
          successText="Audio file uploaded successfully"
          changeText="Click to upload a different audio file"
          uploadIcon={uploadIcon}
          successIcon={successIcon}
        />
        {audioFile && (
          <p className="mt-1 text-sm text-gray-600">
            Selected audio: {audioFile.name} ({(audioFile.size / 1024).toFixed(1)} KB)
          </p>
        )}
      </div>

      {/* 2B: Record in-browser */}
      <div>
        <button
          onClick={onToggleRecording}
          className={cn(
            'px-4 py-2 rounded-full',
            isRecording ? 'bg-red-500 text-white' : 'text-gray-900 hover:bg-neutral-100 border',
            'hover:cursor-pointer',
          )}
        >
          🔴
          <span className="ml-2">{isRecording ? 'Stop recording' : 'Start recording'}</span>
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
  );
}

function ResultsSection({ responseData }: { responseData: ProfileResponse | null }): ReactElement | null {
  if (!responseData) return null;

  return (
    <div className="mt-6 border-t pt-4 space-y-4">
      <h2 className="text-xl font-semibold">Generated Tags:</h2>
      <p>
        Best tag: <span className="font-bold">{responseData.bestTag}</span>
      </p>
      <p>Raw scores:</p>
      <ul className="list-disc list-inside">
        {responseData.clipScores.map(({ label, score }) => (
          <li key={label}>
            {label} ({score})
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold">Transcribed Audio:</h2>
      <div className="bg-gray-50 p-4 rounded-lg border">
        <p className="text-gray-700 italic">"{responseData.transcript}"</p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Profile Summary:</h2>
        <CopyToClipboard 
          text={responseData.summary} 
          buttonText="Copy Summary"
          successText="Summary Copied!"
        />
      </div>
      <div className="prose max-w-none">
        {responseData.summary.split('\n\n').map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>
    </div>
  );
}

export default function GeneratorPage(): ReactElement {
  // —— State for image upload/compression —— //
  const [rawImageFile, setRawImageFile] = useState<File | undefined>();
  const [compressedImage, setCompressedImage] = useState<File | undefined>();

  // —— State for audio upload or recording —— //
  const [audioFile, setAudioFile] = useState<File | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [_recordingBlob, setRecordingBlob] = useState<Blob | undefined>();

  // —— State for server response —— //
  const [responseData, setResponseData] = useState<ProfileResponse | null>(null);

  // Ref for resetting file input TODO: Remove if not needed
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 1) Handle image selection from disk and compress it client‐side.
   */
  async function handleImageChange(e: ChangeEvent<HTMLInputElement>): Promise<void> {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file) {
      setRawImageFile(undefined);
      return;
    }

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
    } catch (error) {
      console.error('Image compression failed:', error);
      // If compression fails, fall back to the original file
      setCompressedImage(file);
    }
  }

  /**
   * 2A) Handle when a user uploads an existing audio file from disk.
   */
  function handleAudioUploadChange(e: ChangeEvent<HTMLInputElement>): void {
    if (e.target.files && e.target.files.length > 0) {
      setAudioFile(e.target.files[0]);
    } else {
      setAudioFile(undefined);
    }
  }

  /**
   * 2B) In-browser recording with ReactMic
   */
  function toggleRecording() {
    setIsRecording((prev) => !prev);
  }
  function onData(_recordedChunk: Blob) {
    // We could process streaming chunks here; for MVP we just ignore intermediate data
  }

  function onStop(recordedData: { blob: Blob }) {
    // Once recording stops, we get a Blob. Wrap it in a File so we can attach to FormData
    setRecordingBlob(recordedData.blob);
    const fileFromBlob = new File([recordedData.blob], 'recorded_audio.webm', {
      type: recordedData.blob.type,
      lastModified: Date.now(),
    });
    setAudioFile(fileFromBlob);
  }

  /**
   * 3) Package compressedImage + audioFile into FormData and POST to the API route.
   */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setIsGenerating(true);
    setResponseData(null);

    if (!compressedImage || !audioFile) {
      alert('Please provide both an image and an audio clip before submitting.');
      setIsGenerating(false);
      return;
    }

    // Build FormData: keys must match what our API will expect ("image" & "audio")
    const formData = new FormData();
    formData.append('image', compressedImage);
    formData.append('audio', audioFile);

    try {
      // Use the Fetch API to POST to /api/process-profile
      const resp = await fetch('http://localhost:8787/api/process-profile', {
        method: 'POST',
        body: formData,
      });

      if (!resp.ok) {
        throw new Error(`Server responded with ${resp.status}`);
      }

      // FIXME: Validate response.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const profileResponse: ProfileResponse = await resp.json();
      setResponseData(profileResponse);
    } catch (error) {
      console.error('Error calling /api/process-profile:', error);
      alert('Something went wrong generating the profile. Check console for details.');
    }
    setIsGenerating(false);
  }

  const canGenerate = !!(compressedImage && audioFile);

  return (
    <div className="flex flex-col bg-neutral-100 min-h-screen">
      <Header />
      <div className="grid md:grid-cols-3 x-constraint gap-8 py-12">

        {/* Tips card */}
        <div className="rounded-lg shodow-md flex flex-col bg-brand-orange p-10">
           <H2 className="mb-2">Audio Recording Tips</H2>
          <p className="mb-4">
            Focus on the facts and briefly mention the following:
          </p>
          <ul className="list-disc list-outside px-6">
            <li>
              <strong>Age</strong>, <strong>breed</strong>, and <strong>size</strong> of the animal
            </li>
            <li>
              Spay/neuter status, health conditions, and <strong>special needs</strong> (e.g., only cat in the house)
            </li>
            <li>
              <strong>Rescue circumstances</strong> (e.g., owner surrendered, rescued from a hoarding situation, etc.)
            </li>
            <li>
              <strong>Distinct traits</strong>, behavioural characteristics (e.g., loves to play fetch, loves to cuddle)
            </li>
          </ul>
        </div>

        {/* Form upload section */}
        <div className="md:col-span-2 space-y-8">
          <div className="flex flex-col gap-2">
            <H1>Animal Adoption Profile Demo</H1>
          <p className="text-gray-600 mb-4">
            This is a demo of the animal adoption profile generator. It uses a simple image and audio to generate a profile.
          </p>
        </div>

          <Card title="Image Upload" stepNumber={1} description="Upload a well-lit image of the animal you want to create a profile for.">
            <ImageUploadSection
              rawImageFile={rawImageFile}
              compressedImage={compressedImage}
              fileInputRef={fileInputRef}
              onImageChange={handleImageChange}
            />
          </Card>
          
          <Card title="Audio Description" stepNumber={2} description="Record or provide an audio clip describing the animal. For faster results, keep the clip short (15-30 seconds).">
            <AudioSection
              audioFile={audioFile}
              isRecording={isRecording}
              onAudioUploadChange={handleAudioUploadChange}
              onToggleRecording={toggleRecording}
              onStop={onStop}
              onData={onData}
            />
          </Card>

                  {/* —— SUBMIT BUTTON —— */}
        <div className="flex justify-center">
          <button
            disabled={!canGenerate}
            onClick={handleSubmit}
            className={cn(
              'px-6 py-2 rounded-full flex items-center gap-2',
              'bg-gray-300',
              !canGenerate,
              canGenerate && 'bg-brand-pink text-white ',
              canGenerate && !isGenerating && 'hover:bg-brand-purple hover:cursor-pointer',
            )}
          >
            {isGenerating && (
              // SVG taken from: https://flowbite.com/docs/components/spinner/
              <svg aria-hidden="true" className="w-5 h-5 text-white animate-spin fill-neutral-900" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
            )}
            {isGenerating ? 'Generating...' : 'Generate profile'}
          </button>
        </div>

          {isGenerating && <div className="mt-6 border-t pt-4 space-y-4">Generating profile ...</div>}

          <ResultsSection responseData={responseData} />
        </div>
        
      </div>
  
    </div>
  );
}
