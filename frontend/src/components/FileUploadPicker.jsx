import { useState, useRef, useCallback } from 'react';
import { Upload, X, File, FileText, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

const ALLOWED_TYPES = {
  'application/pdf': { ext: 'PDF', icon: FileText, color: 'text-red-600' },
  'application/msword': { ext: 'DOC', icon: FileText, color: 'text-blue-600' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { ext: 'DOCX', icon: FileText, color: 'text-blue-600' },
  'image/jpeg': { ext: 'JPG', icon: ImageIcon, color: 'text-green-600' },
  'image/jpg': { ext: 'JPG', icon: ImageIcon, color: 'text-green-600' },
  'image/png': { ext: 'PNG', icon: ImageIcon, color: 'text-green-600' },
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function FileUploadPicker({ onFileSelect, onUpload, uploading = false, uploadProgress = 0 }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validateFile = useCallback((selectedFile) => {
    setError('');

    if (!ALLOWED_TYPES[selectedFile.type]) {
      setError('Invalid file type. Please upload PDF, DOC, DOCX, JPG, or PNG files only.');
      return false;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File size exceeds 5MB. Please upload a smaller file.');
      return false;
    }

    return true;
  }, []);

  const handleFile = useCallback((selectedFile) => {
    if (!validateFile(selectedFile)) {
      return;
    }

    setFile(selectedFile);
    setError('');

    // Generate preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }

    // Notify parent component
    if (onFileSelect) {
      onFileSelect(selectedFile);
    }
  }, [validateFile, onFileSelect]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    setFile(null);
    setPreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleUploadClick = useCallback(() => {
    if (file && onUpload) {
      onUpload(file);
    }
  }, [file, onUpload]);

  const getFileIcon = () => {
    if (!file) return File;
    const fileInfo = ALLOWED_TYPES[file.type];
    return fileInfo ? fileInfo.icon : File;
  };

  const getFileColor = () => {
    if (!file) return 'text-slate-400';
    const fileInfo = ALLOWED_TYPES[file.type];
    return fileInfo ? fileInfo.color : 'text-slate-600';
  };

  const getFileExtension = () => {
    if (!file) return '';
    const fileInfo = ALLOWED_TYPES[file.type];
    return fileInfo ? fileInfo.ext : file.name.split('.').pop().toUpperCase();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const FileIcon = getFileIcon();

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Upload Area */}
      {!file && (
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 ${
            dragActive
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-white'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleChange}
          />

          <div className="flex flex-col items-center justify-center text-center">
            <div className={`mb-4 p-4 rounded-full ${dragActive ? 'bg-emerald-100' : 'bg-slate-200'}`}>
              <Upload className={`w-8 h-8 ${dragActive ? 'text-emerald-600' : 'text-slate-500'}`} />
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {dragActive ? 'Drop your file here' : 'Upload your resume'}
            </h3>

            <p className="text-sm text-slate-600 mb-4">
              Drag and drop your file here, or click to browse
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Choose File
            </button>

            <p className="mt-4 text-xs text-slate-500">
              Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">Upload Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* File Preview */}
      {file && (
        <div className="mt-4 border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
          {/* File Info Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`p-2 rounded-lg bg-white border border-slate-200 ${getFileColor()}`}>
                <FileIcon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate">{file.name}</p>
                <p className="text-sm text-slate-500">
                  {getFileExtension()} • {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="p-4 bg-slate-50">
              <img
                src={preview}
                alt="Resume preview"
                className="max-h-64 mx-auto rounded-lg border border-slate-200 shadow-sm"
              />
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Uploading...</span>
                <span className="text-sm font-semibold text-emerald-600">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success State */}
          {!uploading && uploadProgress === 100 && (
            <div className="p-4 bg-emerald-50 border-t border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Upload complete!</span>
              </div>
            </div>
          )}

          {/* Upload Button */}
          {!uploading && uploadProgress !== 100 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Upload & Scan Resume
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
