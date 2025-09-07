/* eslint no-alert: off */

'use client'; // ← This file uses React hooks, so it must run in the browser

import imageCompression from 'browser-image-compression';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import type { ClipScore } from 'pet-profiler-api';
import { type ChangeEvent, type ReactElement, useRef, useState } from 'react';

import { Chip } from '@/components/Chip.tsx';
import { CopyToClipboardButton } from '@/components/CopyToClipboardButton.tsx';
import { DisclosurePanelComponent } from '@/components/DisclosurePanel.tsx';
import { DragDropInput } from '@/components/DragDropInput.tsx';
import { Header } from '@/components/Header.tsx';
import { SuccessIcon, UploadIcon, ResetIcon } from '@/components/icons/index.ts';
import { LanguageSelector } from '@/components/LanguageSelector.tsx';
import { LoadingSpinner } from '@/components/LoadingSpinner.tsx';
import { PrimaryButton } from '@/components/PrimaryButton.tsx';
import { SecondaryButton } from '@/components/SecondaryButton.tsx';
import { H1 } from '@/components/typography/H1.tsx';
import { H2 } from '@/components/typography/H2.tsx';
import { cn } from '@/utils/cn.ts';
import { Card } from '@/components/Card';

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
  const uploadIcon = <UploadIcon />;
  const successIcon = <SuccessIcon />;

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
          <p>
            Original: {rawImageFile.name} ({(rawImageFile.size / 1024).toFixed(1)} KB)
          </p>
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
  const uploadIcon = <UploadIcon />;
  const successIcon = <SuccessIcon />;

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
        <SecondaryButton
          onClick={onToggleRecording}
          icon="🔴"
          text={isRecording ? 'Stop recording' : 'Start recording'}
          className={cn(isRecording && 'bg-red-500 text-white border-red-500 hover:bg-red-600 hover:text-white')}
        />
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

function ResultsSection({ 
  responseData, 
  editableSummary, 
  onSummaryChange 
}: { 
  responseData: ProfileResponse | null;
  editableSummary: string;
  onSummaryChange: (summary: string) => void;
}): ReactElement | null {
  if (!responseData) return null;

  return (
    <div className="mt-8 border-t pt-6 space-y-6">
      <div className="flex flex-col gap-3">
        <H2>Generated Tags:</H2>
        <div className="flex flex-wrap gap-2">
          {responseData.clipScores.map(({ label }) => (
            <Chip key={label} label={label} />
          ))}
        </div>
        <p>Raw tag scores:</p>
        <ul className="list-disc list-inside -mt-2">
          {responseData.clipScores.map(({ label, score }) => (
            <li key={label}>
              {label} ({score})
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex flex-col gap-3">
        <H2>Transcribed Audio:</H2>
        <div className="px-4 border-l-2 border-neutral-300">
          <p className="text-gray-700 italic">"{responseData.transcript}"</p>
        </div>
      </div>

      <Card title="Generated Profile Summary:">
        <div className="flex">
          <textarea
            id="summary"
            name="summary"
            rows={5}
            value={editableSummary}
            onChange={(e) => onSummaryChange(e.target.value)}
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
          />
        </div>
        <div className="flex mt-4">
          <CopyToClipboardButton text={editableSummary} buttonText="Copy Summary" successText="Copied!" />
        </div>
      </Card>
    </div>
  );
}


function GeneratorPageInner({ onReset }: { onReset: () => void }): ReactElement {
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

  // —— State for editable summary —— //
  const [editableSummary, setEditableSummary] = useState<string>('');

  // —— State for language selection —— //
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');

  // —— State for disclosure panels —— //
  const [isImageUploadOpen, setIsImageUploadOpen] = useState<boolean>(true);
  const [isAudioDescriptionOpen, setIsAudioDescriptionOpen] = useState<boolean>(true);
  const [isLanguageSelectionOpen, setIsLanguageSelectionOpen] = useState<boolean>(true);
  const [disclosureKey, setDisclosureKey] = useState<number>(0);

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
  async function handleSubmit() {
    setIsGenerating(true);
    setResponseData(null);
    
    // Close all disclosure panels when generation starts
    setDisclosureKey(prev => prev + 1);

    if (!compressedImage || !audioFile) {
      alert('Please provide both an image and an audio clip before submitting.');
      setIsGenerating(false);
      return;
    }

    // Build FormData: keys must match what our API will expect ("image", "audio", & "language")
    const formData = new FormData();
    formData.append('image', compressedImage);
    formData.append('audio', audioFile);
    formData.append('language', selectedLanguage);

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
      setEditableSummary(profileResponse.summary);
    } catch (error) {
      console.error('Error calling /api/process-profile:', error);
      alert('Something went wrong generating the profile. Check console for details.');
    }
    setIsGenerating(false);
  }

  const canGenerate = !!(compressedImage && audioFile);

  return (
    <div className="flex flex-col justify-center items-center bg-neutral-100 min-h-screen">
      <Header />
      <div className="grid md:grid-cols-3 x-constraint gap-8 py-12">
        {/* Tips card */}
        <div className="rounded-lg shadow-md flex flex-col bg-brand-orange p-10">
          <H2 className="mb-2">Audio Recording Tips</H2>
          <p className="mb-4">Focus on the facts and briefly mention the following:</p>
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
            <H1>Create a custom profile bio for your pet</H1>
            <p className="text-gray-600 mb-4">
              This is a demo of the animal adoption profile generator. It uses a simple image and audio to generate a
              profile.
            </p>
          </div>

          <DisclosurePanelComponent
            title="Image Upload"
            stepNumber={1}
            description="Upload a well-lit image of the animal you want to create a profile for."
            isOpen={disclosureKey === 0 ? isImageUploadOpen : false}
            onToggle={setIsImageUploadOpen}
            className="bg-white rounded-lg shadow-md p-6 mb-6"
            key={`image-${disclosureKey}`}
          >
            <ImageUploadSection
              rawImageFile={rawImageFile}
              compressedImage={compressedImage}
              fileInputRef={fileInputRef}
              onImageChange={handleImageChange}
            />
          </DisclosurePanelComponent>

          <DisclosurePanelComponent
            title="Audio Description"
            stepNumber={2}
            description="Record or provide an audio clip describing the animal. For faster results, keep the clip short (15-30 seconds)."
            isOpen={disclosureKey === 0 ? isAudioDescriptionOpen : false}
            onToggle={setIsAudioDescriptionOpen}
            className="bg-white rounded-lg shadow-md p-6 mb-6"
            key={`audio-${disclosureKey}`}
          >
            <AudioSection
              audioFile={audioFile}
              isRecording={isRecording}
              onAudioUploadChange={handleAudioUploadChange}
              onToggleRecording={toggleRecording}
              onStop={onStop}
              onData={onData}
            />
          </DisclosurePanelComponent>

          <DisclosurePanelComponent
            title="Language Selection"
            stepNumber={3}
            description="Choose the language for the generated profile summary."
            isOpen={disclosureKey === 0 ? isLanguageSelectionOpen : false}
            onToggle={setIsLanguageSelectionOpen}
            className="bg-white rounded-lg shadow-md p-6 mb-6"
            key={`language-${disclosureKey}`}
          >
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </DisclosurePanelComponent>

          {/* —— SUBMIT BUTTON —— */}
          <div className="flex justify-center gap-4">
            <PrimaryButton
              onClick={handleSubmit}
              disabled={!canGenerate}
              icon={isGenerating ? <LoadingSpinner /> : undefined}
              text={isGenerating ? 'Generating...' : 'Generate profile'}
              className={cn(isGenerating && 'bg-brand-pink-dark cursor-default')}
            />

            <SecondaryButton
                // Clicking Reset causes the keyed remount → clears all internal state
                onClick={onReset}
                text="Reset"
                icon={<ResetIcon />}
                disabled={isGenerating} // avoid mid-request resets
                className="border-gray-300"
              />
          </div>

          {isGenerating && <div className="mt-6 border-t pt-4 space-y-4">Generating profile ...</div>}

          <ResultsSection 
            responseData={responseData} 
            editableSummary={editableSummary}
            onSummaryChange={setEditableSummary}
          />
        </div>
      </div>
    </div>
  );
}

export default function GeneratorPage(): ReactElement {
  // NOTE: Need to keep this state here to ensure the inner component can be blown away and rebuilt
  const [pageKey, setPageKey] = useState<number>(0);

  return (
    // Changing `key` forces a full remount of everything inside (resets form without need to reload page)
    <GeneratorPageInner
      key={pageKey}
      onReset={() => {
        // Incrementing this value remounts `GeneratorPageInner` and clears all its state.
        setPageKey((k) => k + 1);
      }}
    />
  );
}
