import dynamic from 'next/dynamic';
import type { ChangeEvent, ReactElement } from 'react';

import { DragDropInput } from '@/components/DragDropInput.tsx';
import { SecondaryButton } from '@/components/SecondaryButton.tsx';
import { Stopwatch } from '@/components/Stopwatch.tsx';
import { SuccessIcon, UploadIcon } from '@/components/icons/index.ts';
import { cn } from '@/utils/cn.ts';

const ReactMic = dynamic(() => import('react-mic').then((mod) => mod.ReactMic), {
  ssr: false,
});

interface AudioSectionProps {
  audioFile: File | undefined;
  isRecording: boolean;
  onAudioUploadChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onToggleRecording: () => void;
  onStop: (recordedData: { blob: Blob }) => void;
  onData: (recordedChunk: Blob) => void;
}

export function AudioSection({
  audioFile,
  isRecording,
  onAudioUploadChange,
  onToggleRecording,
  onStop,
  onData,
}: AudioSectionProps): ReactElement {
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
        <div className="flex items-center gap-4">
          <SecondaryButton
            onClick={onToggleRecording}
            icon="🔴"
            text={isRecording ? 'Stop recording' : 'Start recording'}
            className={cn(isRecording && 'bg-red-500 text-white border-red-500 hover:bg-red-600 hover:text-white')}
          />
          <Stopwatch isActive={isRecording} />
        </div>
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
