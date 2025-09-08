/* eslint no-alert: off */

'use client'; // ← This file uses React hooks, so it must run in the browser

import imageCompression from 'browser-image-compression';
import type { ClipScore } from 'pet-profiler-api';
import { type ChangeEvent, type ReactElement, useRef, useState } from 'react';

import { AudioSection } from '@/components/AudioSection.tsx';
import { DisclosurePanelComponent } from '@/components/DisclosurePanel.tsx';
import { Footer } from '@/components/Footer.tsx';
import { Header } from '@/components/Header.tsx';
import { ResetIcon } from '@/components/icons/index.ts';
import { ImageUploadSection } from '@/components/ImageUploadSection.tsx';
import { LanguageSelector } from '@/components/LanguageSelector.tsx';
import { LoadingSpinner } from '@/components/LoadingSpinner.tsx';
import { PrimaryButton } from '@/components/PrimaryButton.tsx';
import { ResultsSection } from '@/components/ResultsSection.tsx';
import { SecondaryButton } from '@/components/SecondaryButton.tsx';
import { Tips } from '@/components/Tips.tsx';
import { H1 } from '@/components/typography/H1.tsx';
import { cn } from '@/utils/cn.ts';

interface ProfileResponse {
  clipScores: ClipScore[];
  bestTag: string; // e.g. ["cat", "short fur", …]
  transcript: string; // The transcribed audio text
  summary: string; // 1–2 paragraphs of descriptive text
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
      <div className="flex-1 x-constraint py-12">
        <div className="flex gap-8">
          {/* Tips card - sticky sidebar (desktop only) */}
          <div className="hidden md:block w-80 flex-shrink-0">
            <div className="sticky top-8">
              <Tips />
            </div>
          </div>

          {/* Form upload section */}
          <div className="flex-1 space-y-8">
          <div className="flex flex-col gap-2">
            <H1>Create a custom profile bio for your pet</H1>
            <p className="text-gray-600 mb-4">
              Well-written profiles help pets find their forever homes. Upload a photo of the animal and a voice recording describing them, and the app will generate a professionally-written profile bio in the selected language. 
            </p>
          </div>

          {/* Tips card - mobile only (below intro) */}
          <div className="md:hidden">
            <Tips />
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
      <Footer />
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
