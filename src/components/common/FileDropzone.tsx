import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { UploadCloud, X, Trash2, Image as ImageIcon } from 'lucide-react';

export interface FileDropzoneProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
  className?: string;
  files?: File[];
  required?: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFilesChange,
  maxFiles = 3,
  accept = 'image/png, image/jpeg, image/webp, image/*',
  className = '',
  files: controlledFiles,
  required = false,
}) => {
  const [internalFiles, setInternalFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentFiles = controlledFiles !== undefined ? controlledFiles : internalFiles;

  const updateFiles = (newFiles: File[]) => {
    const sliced = newFiles.slice(0, maxFiles);
    if (controlledFiles === undefined) {
      setInternalFiles(sliced);
    }
    onFilesChange(sliced);
  };

  const handleFileSelection = (incoming: FileList | File[]) => {
    const validIncoming = Array.from(incoming).filter((f) =>
      f.type.startsWith('image/')
    );
    // Combine and limit to maxFiles
    const combined = [...currentFiles, ...validIncoming];
    updateFiles(combined);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files);
    }
    // reset input value so re-selecting the same file works
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files);
    }
  };

  const handleRemove = (index: number) => {
    const updated = currentFiles.filter((_, i) => i !== index);
    updateFiles(updated);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Visual Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
          isDragOver
            ? 'border-gold bg-gold/5 scale-[0.99]'
            : 'border-stone-300 hover:border-gold/60 bg-white/70 hover:bg-stone-50/80'
        }`}
      >
        {/* Visually hidden accessible input */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          required={required && currentFiles.length === 0}
          title="Upload story images"
          onChange={handleInputChange}
          className="sr-only"
          tabIndex={0}
        />

        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
          isDragOver ? 'bg-gold text-black' : 'bg-gold/10 text-gold'
        }`}>
          <UploadCloud size={24} />
        </div>

        <div>
          <p className="text-sm font-bold text-stone-800">
            Drag images here or <span className="text-gold underline underline-offset-2">click to browse</span>
          </p>
          <p className="text-xs text-stone-500 mt-1">
            PNG/JPG up to {maxFiles} {maxFiles === 1 ? 'image' : 'images'}
          </p>
        </div>
      </div>

      {/* Thumbnail Previews */}
      {currentFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium px-1">
            <span>Selected Images ({currentFiles.length}/{maxFiles})</span>
            {currentFiles.length > 0 && (
              <button
                type="button"
                onClick={() => updateFiles([])}
                className="text-rose-500 hover:underline flex items-center gap-1 text-[11px]"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {currentFiles.map((file, idx) => {
              const previewUrl = URL.createObjectURL(file);
              return (
                <div
                  key={`${file.name}-${idx}`}
                  className="relative group rounded-xl overflow-hidden aspect-square border border-stone-200 shadow-sm bg-stone-100"
                >
                  <img
                    src={previewUrl}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onLoad={() => URL.revokeObjectURL(previewUrl)}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(idx);
                      }}
                      title="Remove image"
                      className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-lg transition-transform hover:scale-110"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                    {idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
