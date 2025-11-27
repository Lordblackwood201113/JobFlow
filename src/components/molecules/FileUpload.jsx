import { useState, useRef } from 'react';
import { Upload, File, X } from 'lucide-react';
import Button from '../atoms/Button';
import Select from '../atoms/Select';

const FileUpload = ({ onFileSelect, uploading, progress }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('CV');
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect(selectedFile, documentType);
      setSelectedFile(null);
      setDocumentType('CV');
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Zone de drag & drop */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-[#DBEAFE] bg-[#DBEAFE]/10'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept=".pdf,.doc,.docx,.txt"
          disabled={uploading}
        />

        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />

        <p className="text-sm text-gray-600 mb-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-[#8B5CF6] font-medium hover:underline"
            disabled={uploading}
          >
            Cliquez pour sélectionner
          </button>{' '}
          ou glissez-déposez un fichier
        </p>

        <p className="text-xs text-gray-500">
          PDF, DOC, DOCX, TXT (max 5MB)
        </p>
      </div>

      {/* Fichier sélectionné */}
      {selectedFile && !uploading && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <File className="h-8 w-8 text-[#8B5CF6] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(selectedFile.size)}
              </p>

              <div className="mt-3">
                <Select
                  label="Type de document"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  options={[
                    { value: 'CV', label: 'CV' },
                    { value: 'Lettre de motivation', label: 'Lettre de motivation' },
                    { value: 'Portfolio', label: 'Portfolio' },
                    { value: 'Autre', label: 'Autre' },
                  ]}
                />
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleUpload}
                >
                  Uploader
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barre de progression */}
      {uploading && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <File className="h-6 w-6 text-[#8B5CF6]" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Upload en cours...
              </p>
              <p className="text-xs text-gray-500">{progress}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#8B5CF6] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
