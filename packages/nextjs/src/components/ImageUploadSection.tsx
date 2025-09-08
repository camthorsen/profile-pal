import Image from 'next/image';
import type { ChangeEvent, ReactElement } from 'react';

import { DragDropInput } from '@/components/DragDropInput.tsx';
import { SuccessIcon, UploadIcon } from '@/components/icons/index.ts';

interface ImageUploadSectionProps {
  rawImageFile: File | undefined;
  compressedImage: File | undefined;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onImageChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export function ImageUploadSection({
  rawImageFile,
  compressedImage,
  fileInputRef,
  onImageChange,
}: ImageUploadSectionProps): ReactElement {
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
