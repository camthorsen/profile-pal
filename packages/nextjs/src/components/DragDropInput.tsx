import { type ChangeEvent, type ReactElement } from 'react';

interface DragDropInputProps {
  accept: string;
  file: File | undefined;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  fileInputRef?: React.RefObject<HTMLInputElement | null>;
  uploadText: string;
  fileTypesText: string;
  successText: string;
  changeText: string;
  uploadIcon: ReactElement;
  successIcon: ReactElement;
}

export function DragDropInput({
  accept,
  file,
  onFileChange,
  fileInputRef,
  uploadText,
  fileTypesText,
  successText,
  changeText,
  uploadIcon,
  successIcon,
}: DragDropInputProps): ReactElement {
  return (
    <label className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 text-center hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden">
      <input
        accept={accept}
        className="sr-only"
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
      />
      {file ? (
        <div className="p-8">
          <div className="mx-auto h-12 w-12 text-green-400 -mt-3">
            {successIcon}
          </div>
          <p className="mt-2 text-center text-sm text-gray-600">{successText}</p>
          <p className="text-center text-xs text-gray-500">{changeText}</p>
        </div>
      ) : (
        <div className="p-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            {uploadIcon}
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            <span className="relative rounded-md font-medium text-indigo-600 hover:text-indigo-500">
              {uploadText}
            </span>
            <span className="pl-1">or drag and drop</span>
          </div>
          <p className="mt-2 text-center text-xs text-gray-500">{fileTypesText}</p>
        </div>
      )}
    </label>
  );
} 