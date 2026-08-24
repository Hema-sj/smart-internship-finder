import { useEffect, useState, useRef } from 'react';
import { getResumes, uploadResume, deleteResume } from '../services/studentService';
import { FileText, Upload, Trash2, Loader2, Sparkles, Download, Eye } from 'lucide-react';

function ResumeCard({ resume, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Delete this resume?')) return;
    setDeleting(true);
    try { await onDelete(resume._id); } finally { setDeleting(false); }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-md transition">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <FileText size={22} className="text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 truncate">{resume.fileName}</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Uploaded {new Date(resume.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          {resume.extractedSkills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {resume.extractedSkills.slice(0, 5).map(s => (
                <span key={s} className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">{s}</span>
              ))}
              {resume.extractedSkills.length > 5 && (
                <span className="text-xs text-slate-400">+{resume.extractedSkills.length - 5} more</span>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:text-red-500 hover:border-red-200 transition disabled:opacity-50"
          >
            {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResumePage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    getResumes().then(setResumes).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    await deleteResume(id);
    setResumes(prev => prev.filter(r => r._id !== id));
  };

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.name.match(/\.(pdf|doc|docx)$/i)) return alert('Only PDF, DOC, DOCX files are accepted.');
    if (file.size > 5 * 1024 * 1024) return alert('File must be under 5 MB.');

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const newResume = await uploadResume(formData);
      setResumes(prev => [newResume, ...prev]);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to upload resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Resume Builder</h1>
        <p className="text-slate-500 text-sm mt-1">Upload your resume to unlock AI-powered skill extraction and match scoring.</p>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative rounded-2xl border-2 border-dashed p-10 text-center transition-all cursor-pointer
          ${dragOver ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/50'}`}
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => handleFile(e.target.files[0])} />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={36} className="animate-spin text-emerald-600" />
            <p className="font-semibold text-slate-700">Uploading & extracting skills…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <Upload size={26} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-bold text-slate-800">Drop your resume here</p>
              <p className="text-sm text-slate-500 mt-1">or <span className="text-emerald-600 font-semibold">click to browse</span></p>
              <p className="text-xs text-slate-400 mt-2">PDF, DOC, DOCX • Max 5 MB</p>
            </div>
          </div>
        )}
      </div>

      {/* AI Features Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white flex items-start gap-4">
        <div className="h-11 w-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Sparkles size={22} className="text-yellow-300" />
        </div>
        <div>
          <h3 className="font-bold text-base">What AI does with your resume</h3>
          <ul className="mt-2 space-y-1 text-sm text-white/80">
            <li>✦ Extracts your skills automatically</li>
            <li>✦ Scores your match % against every internship</li>
            <li>✦ Identifies skill gaps and suggests resources</li>
            <li>✦ Ranks you in company applicant pools</li>
          </ul>
        </div>
      </div>

      {/* Uploaded resumes */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 size={28} className="animate-spin text-emerald-600" />
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          <FileText size={36} className="mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-semibold text-slate-500">No resumes uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-800">Your Resumes ({resumes.length})</h2>
          {resumes.map(r => <ResumeCard key={r._id} resume={r} onDelete={handleDelete} />)}
        </div>
      )}
    </div>
  );
}
