import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import FileUploadPicker from '../components/FileUploadPicker';
import { uploadResume } from '../services/studentService';

export default function ResumeUploadPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setError('');
  };

  const handleUpload = async (file) => {
    try {
      setUploading(true);
      setUploadProgress(0);
      setError('');

      // Simulate progress (since axios doesn't provide real upload progress easily with FormData)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadResume(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Navigate to resumes list page after successful upload
      setTimeout(() => {
        navigate('/dashboard/resume');
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload resume');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard/resume')}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Resumes
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Upload Your Resume</h1>
          <p className="text-sm text-slate-600 mt-1">
            Upload your resume and our AI will automatically extract your skills, experience, and education
          </p>
        </div>

        {/* Upload Component */}
        <FileUploadPicker
          onFileSelect={handleFileSelect}
          onUpload={handleUpload}
          uploading={uploading}
          uploadProgress={uploadProgress}
        />

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-900">Upload Failed</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={() => setError('')}
              className="mt-3 text-sm font-medium text-red-600 hover:text-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Info Cards */}
        <div className="mt-8 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li className="flex gap-2">
                <span className="font-semibold">1.</span>
                <span>AI scans your resume and extracts all relevant information</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">2.</span>
                <span>Review and edit the extracted data on the analysis page</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">3.</span>
                <span>Your skills are automatically added to your profile</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">4.</span>
                <span>Get AI-powered internship matches based on your resume</span>
              </li>
            </ol>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <h3 className="font-semibold text-emerald-900 mb-2">Supported formats</h3>
            <div className="flex flex-wrap gap-2 text-sm text-emerald-800">
              <span className="px-3 py-1 bg-white rounded-full font-medium">PDF</span>
              <span className="px-3 py-1 bg-white rounded-full font-medium">DOC</span>
              <span className="px-3 py-1 bg-white rounded-full font-medium">DOCX</span>
              <span className="px-3 py-1 bg-white rounded-full font-medium">JPG</span>
              <span className="px-3 py-1 bg-white rounded-full font-medium">PNG</span>
            </div>
            <p className="text-xs text-emerald-700 mt-2">Maximum file size: 5MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
