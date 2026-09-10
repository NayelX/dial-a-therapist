import React, { useState, useEffect, useRef, ChangeEvent, DragEvent } from 'react';
import { UploadCloud, Trash2, Image as ImageIcon } from 'lucide-react';

export interface FileDropzoneProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
  className?: string;
  files?: File[];
  required?: boolean;
}

const formatMimeType = (mime: string): string => {
  if (!mime) return 'FILE';
  const parts = mime.split('/');
  if (parts.length > 1) {
    const sub = parts[1].toUpperCase();
    if (sub.includes('JPEG') || sub.includes('JPG')) return 'JPEG';
    if (sub.includes('PNG')) return 'PNG';
    if (sub.includes('WEBP')) return 'WEBP';
    if (sub.includes('SVG')) return 'SVG';
    return sub;
  }
  return mime.toUpperCase();
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

const FilePreviewCard: React.FC<{
  file: File;
  index: number;
  onRemove: (index: number) => void;
}> = ({ file, index, onRemove }) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="flex items-center gap-3 p-3 bg-stone-50 border border-stone-200 rounded-xl shadow-sm">
      {/* Thumbnail preview with fixed dimensions and object-fit: cover */}
      <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-stone-200 border border-stone-200 flex items-center justify-center">
        {previewUrl ? (
          <img src={previewUrl} alt={file.name} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon size={20} className="text-stone-400" />
        )}
      </div>

      {/* File Details */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-stone-800 truncate" title={file.name}>
          {file.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-gold/15 text-gold-dark">
            {formatMimeType(file.type)}
          </span>
          <span className="text-xs text-stone-500 font-medium">
            {formatFileSize(file.size)}
          </span>
        </div>
      </div>

      {/* Remove Button */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        title="Remove file"
        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

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

      {/* Selected Files Preview List */}
      {currentFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium px-1">
            <span>Selected Images ({currentFiles.length}/{maxFiles})</span>
            <button
              type="button"
              onClick={() => updateFiles([])}
              className="text-rose-500 hover:underline flex items-center gap-1 text-[11px]"
            >
              Clear all
            </button>
          </div>

          <div className="space-y-2">
            {currentFiles.map((file, idx) => (
              <FilePreviewCard
                key={`${file.name}-${file.size}-${idx}`}
                file={file}
                index={idx}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
