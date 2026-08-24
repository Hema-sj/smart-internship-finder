import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Upload, Trash2, Loader, Sparkles, Eye, Edit, Download, 
  Plus, AlertCircle, CheckCircle, Brain, Wand2
} from 'lucide-react';
import { getResumes, deleteResume } from '../services/studentService';

function ResumeCard({ resume, onDelete, onView, onEdit }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    setDeleting(true);
    try {
      await onDelete(resume._id);
    } catch (err) {
      alert('Failed to delete resume');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md transition-all hover:border-emerald-200">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
          <FileText className="w-6 h-6 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 truncate">
                {resume.personalInfo?.name || resume.fileName || 'Untitled Resume'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {resume.source === 'ai-generated' ? (
                  <span className="inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Generated • {formatDate(resume.uploadedAt)}
                  </span>
                ) : (
                  <span>Uploaded • {formatDate(resume.uploadedAt)}</span>
                )}
              </p>
            </div>
            {resume.aiConfidenceScore && (
              <div className="px-2 py-1 bg-emerald-50 rounded text-xs font-semibold text-emerald-700">
                {resume.aiConfidenceScore}% Match
              </div>
            )}
          </div>
          
          {resume.extractedSkills && resume.extractedSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {resume.extractedSkills.slice(0, 5).map((skill, index) => (
                <span 
                  key={index} 
                  className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
              {resume.extractedSkills.length > 5 && (
                <span className="text-xs text-slate-500 py-0.5">
                  +{resume.extractedSkills.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
        <button
          onClick={() => onView(resume._id)}
          className="flex-1 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
        <button
          onClick={() => onEdit(resume._id)}
          className="flex-1 px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

export default function ResumePage() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getResumes();
      setResumes(data);
    } catch (err) {
      setError(err.message || 'Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteResume(id);
    setResumes(prev => prev.filter(r => r._id !== id));
  };

  const handleView = (id) => {
    navigate(`/dashboard/resume/preview/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/resume/analysis/${id}`);
  };

  const handleUploadClick = () => {
    navigate('/dashboard/resume/upload');
  };

  const handleAIBuilderClick = () => {
    navigate('/dashboard/resume/ai-builder');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Resume Manager</h1>
            <p className="text-sm text-slate-600 mt-1">
              Upload your resume or create one with AI to get personalized internship matches
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
              {resumes.length} {resumes.length === 1 ? 'Resume' : 'Resumes'}
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Error loading resumes</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Resume Card */}
        <div 
          onClick={handleUploadClick}
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
              <Upload className="w-6 h-6" />
            </div>
            <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
              Quick Upload
            </div>
          </div>
          <h2 className="text-xl font-bold mb-2">Upload Resume</h2>
          <p className="text-emerald-50 text-sm mb-4">
            Upload your existing resume and let AI extract skills, experience, and education automatically
          </p>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span>Get Started</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2 text-xs text-emerald-50">
              <CheckCircle className="w-4 h-4" />
              <span>Supports PDF, DOC, DOCX, JPG, PNG</span>
            </div>
          </div>
        </div>

        {/* AI Resume Builder Card */}
        <div 
          onClick={handleAIBuilderClick}
          className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
              AI Powered
            </div>
          </div>
          <h2 className="text-xl font-bold mb-2">Create with AI</h2>
          <p className="text-purple-50 text-sm mb-4">
            Don't have a resume? No problem! Build a professional ATS-friendly resume with AI assistance in minutes
          </p>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span>Start Building</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2 text-xs text-purple-50">
              <Wand2 className="w-4 h-4" />
              <span>9-step guided wizard with AI enhancements</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Features Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 mb-2">What AI does with your resume</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Automatically extracts skills and experience</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Calculates match % for every internship</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Identifies skill gaps and learning paths</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Ranks you in company applicant pools</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Your Resumes List */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Resumes</h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">No resumes yet</h3>
            <p className="text-sm text-slate-600 mb-4">Upload your resume or create one with AI to get started</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleUploadClick}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Resume
              </button>
              <button
                onClick={handleAIBuilderClick}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Create with AI
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resumes.map(resume => (
              <ResumeCard
                key={resume._id}
                resume={resume}
                onDelete={handleDelete}
                onView={handleView}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
