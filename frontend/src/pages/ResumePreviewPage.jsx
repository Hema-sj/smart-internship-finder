import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Download, Edit, Share2, Printer, CheckCircle, Loader, 
  Mail, Phone, Globe, MapPin, AlertCircle,
  FileText, Sparkles, Link as LinkIcon
} from 'lucide-react';
import { getResumeById } from '../services/studentService';

export default function ResumePreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const resumeRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadResume();
  }, [id]);

  const loadResume = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getResumeById(id);
      setResume(data);
    } catch (err) {
      setError(err.message || 'Failed to load resume');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      
      // Use html2pdf.js or jsPDF with html2canvas
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = resumeRef.current;
      const opt = {
        margin: 0.5,
        filename: `${resume.personalInfo?.name || 'Resume'}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    navigate(`/dashboard/resume/analysis/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Failed to Load Resume</h2>
        <p className="text-slate-600 mb-4">{error}</p>
        <button
          onClick={() => navigate('/dashboard/resume')}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Back to Resumes
        </button>
      </div>
    );
  }

  const { personalInfo = {}, summary, extractedSkills = [], education = [], experience = [], projects = [], certifications = [], achievements = [], interests = [] } = resume;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Action Bar - Hidden in print */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm print:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-emerald-600" />
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Resume Preview</h1>
                <p className="text-sm text-slate-600">{personalInfo.name || 'Untitled Resume'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {downloading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Content */}
      <div className="container mx-auto px-4 py-8 print:p-0">
        <div 
          ref={resumeRef}
          className="bg-white max-w-[8.5in] mx-auto shadow-lg print:shadow-none print:max-w-none"
          style={{ minHeight: '11in' }}
        >
          {/* Resume Page */}
          <div className="p-12 print:p-8">
            {/* Header */}
            <header className="mb-6 pb-6 border-b-2 border-slate-900">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">{personalInfo.name || 'Your Name'}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-700">
                {personalInfo.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${personalInfo.email}`} className="hover:text-emerald-600">{personalInfo.email}</a>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4" />
                    <span>{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.linkedIn && (
                  <div className="flex items-center gap-1.5">
                    <LinkIcon className="w-4 h-4" />
                    <a href={personalInfo.linkedIn} className="hover:text-emerald-600 break-all">{personalInfo.linkedIn.replace('https://', '')}</a>
                  </div>
                )}
                {personalInfo.github && (
                  <div className="flex items-center gap-1.5">
                    <LinkIcon className="w-4 h-4" />
                    <a href={personalInfo.github} className="hover:text-emerald-600 break-all">{personalInfo.github.replace('https://', '')}</a>
                  </div>
                )}
                {personalInfo.portfolio && (
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4" />
                    <a href={personalInfo.portfolio} className="hover:text-emerald-600 break-all">{personalInfo.portfolio.replace('https://', '')}</a>
                  </div>
                )}
              </div>
            </header>

            {/* Professional Summary */}
            {summary && (
              <section className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide border-b border-slate-300 pb-1">Professional Summary</h2>
                <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide border-b border-slate-300 pb-1">Education</h2>
                <div className="space-y-3">
                  {education.map((edu, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-semibold text-slate-900">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                          <p className="text-sm text-slate-700">{edu.institution}</p>
                        </div>
                        <div className="text-right text-sm text-slate-600">
                          {edu.startYear && edu.endYear && `${edu.startYear} - ${edu.endYear}`}
                          {edu.cgpa && <div className="font-medium">CGPA: {edu.cgpa}</div>}
                        </div>
                      </div>
                      {edu.description && <p className="text-sm text-slate-600 mt-1">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {extractedSkills.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide border-b border-slate-300 pb-1">Technical Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {extractedSkills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-slate-100 text-slate-800 text-sm font-medium rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide border-b border-slate-300 pb-1">Work Experience</h2>
                <div className="space-y-4">
                  {experience.map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-semibold text-slate-900">{exp.role}</h3>
                          <p className="text-sm text-slate-700">{exp.company}{exp.location && `, ${exp.location}`}</p>
                        </div>
                        <div className="text-sm text-slate-600">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </div>
                      </div>
                      {exp.description && <p className="text-sm text-slate-700 mt-1">{exp.description}</p>}
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <ul className="mt-2 space-y-1 text-sm text-slate-700">
                          {exp.responsibilities.map((resp, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-slate-400">•</span>
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide border-b border-slate-300 pb-1">Projects</h2>
                <div className="space-y-3">
                  {projects.map((project, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-slate-900">{project.title}</h3>
                        {project.url && (
                          <a href={project.url} className="text-sm text-emerald-600 hover:underline break-all">
                            View Project
                          </a>
                        )}
                      </div>
                      {project.description && <p className="text-sm text-slate-700 mt-1">{project.description}</p>}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {project.technologies.map((tech, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide border-b border-slate-300 pb-1">Certifications</h2>
                <div className="space-y-2">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm">{cert.title}</h3>
                        {cert.issuer && <p className="text-sm text-slate-600">{cert.issuer}</p>}
                      </div>
                      {cert.issueDate && <span className="text-sm text-slate-600">{cert.issueDate}</span>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide border-b border-slate-300 pb-1">Achievements</h2>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  {achievements.map((achievement, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-slate-400">•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Interests */}
            {interests.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide border-b border-slate-300 pb-1">Interests</h2>
                <p className="text-sm text-slate-700">{interests.join(' • ')}</p>
              </section>
            )}

            {/* AI Generated Badge */}
            {resume.source === 'ai-generated' && (
              <div className="mt-8 pt-4 border-t border-slate-200 print:hidden">
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                  <Sparkles className="w-3 h-3" />
                  <span>Resume generated with AI assistance</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tips - Hidden in print */}
        <div className="max-w-[8.5in] mx-auto mt-6 print:hidden">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Resume Tips
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Keep your resume to one page if you have less than 10 years of experience</li>
              <li>• Use action verbs to describe your achievements</li>
              <li>• Quantify your accomplishments with numbers when possible</li>
              <li>• Tailor your resume for each internship application</li>
              <li>• Proofread carefully for spelling and grammar errors</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          @page {
            margin: 0.5in;
            size: letter;
          }
        }
      `}</style>
    </div>
  );
}
