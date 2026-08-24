import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Globe, Briefcase, 
  GraduationCap, Award, Code, FolderOpen, Trophy, Heart,
  Save, AlertCircle, CheckCircle, Loader, Edit3, X, Plus, Link as LinkIcon
} from 'lucide-react';
import { getResumeById, updateResume } from '../services/studentService';

export default function ResumeAnalysisPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resume, setResume] = useState(null);
  
  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
    linkedIn: '',
    github: '',
    portfolio: ''
  });
  const [summary, setSummary] = useState('');
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [interests, setInterests] = useState([]);
  const [preferredRole, setPreferredRole] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');
  
  // Editing states
  const [editingSection, setEditingSection] = useState(null);

  useEffect(() => {
    loadResume();
  }, [id]);

  const loadResume = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getResumeById(id);
      setResume(data);
      
      // Populate form fields
      setPersonalInfo(data.personalInfo || {});
      setSummary(data.summary || '');
      setSkills(data.extractedSkills || []);
      setEducation(data.education || []);
      setExperience(data.experience || []);
      setProjects(data.projects || []);
      setCertifications(data.certifications || []);
      setAchievements(data.achievements || []);
      setInterests(data.interests || []);
      setPreferredRole(data.preferredRole || '');
      setPreferredLocation(data.preferredLocation || '');
    } catch (err) {
      setError(err.message || 'Failed to load resume data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      const updateData = {
        personalInfo,
        summary,
        extractedSkills: skills,
        education,
        experience,
        projects,
        certifications,
        achievements,
        interests,
        preferredRole,
        preferredLocation
      };
      
      await updateResume(id, updateData);
      setSuccess('Resume data saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save resume data');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = (skill) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEducation([...education, {
      institution: '',
      degree: '',
      field: '',
      startYear: null,
      endYear: null,
      cgpa: null,
      description: ''
    }]);
  };

  const updateEducation = (index, field, value) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    setExperience([...experience, {
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      responsibilities: []
    }]);
  };

  const updateExperience = (index, field, value) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };

  const removeExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const addProject = () => {
    setProjects([...projects, {
      title: '',
      description: '',
      technologies: [],
      url: '',
      startDate: '',
      endDate: ''
    }]);
  };

  const updateProject = (index, field, value) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };

  const removeProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const addCertification = () => {
    setCertifications([...certifications, {
      title: '',
      issuer: '',
      issueDate: '',
      credentialId: '',
      url: ''
    }]);
  };

  const updateCertification = (index, field, value) => {
    const updated = [...certifications];
    updated[index][field] = value;
    setCertifications(updated);
  };

  const removeCertification = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const addAchievement = (achievement) => {
    if (achievement) {
      setAchievements([...achievements, achievement]);
    }
  };

  const removeAchievement = (index) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const addInterest = (interest) => {
    if (interest && !interests.includes(interest)) {
      setInterests([...interests, interest]);
    }
  };

  const removeInterest = (index) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Resume Analysis</h1>
              <p className="text-sm text-slate-600 mt-1">
                Review and edit the extracted information from your resume
              </p>
              {resume?.aiConfidenceScore && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">AI Confidence: {resume.aiConfidenceScore}%</span>
                </div>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <p className="text-sm font-medium text-emerald-900">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm font-medium text-red-900">{error}</p>
          </div>
        )}

        {/* Personal Information */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={personalInfo.name || ''}
                onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email *
              </label>
              <input
                type="email"
                value={personalInfo.email || ''}
                onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone
              </label>
              <input
                type="tel"
                value={personalInfo.phone || ''}
                onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="+1 234 567 8900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                LinkedIn
              </label>
              <input
                type="url"
                value={personalInfo.linkedIn || ''}
                onChange={(e) => setPersonalInfo({ ...personalInfo, linkedIn: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="https://linkedin.com/in/johndoe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                GitHub
              </label>
              <input
                type="url"
                value={personalInfo.github || ''}
                onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="https://github.com/johndoe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Portfolio
              </label>
              <input
                type="url"
                value={personalInfo.portfolio || ''}
                onChange={(e) => setPersonalInfo({ ...personalInfo, portfolio: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="https://johndoe.com"
              />
            </div>
          </div>
        </section>

        {/* Professional Summary */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Edit3 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-slate-900">Professional Summary</h2>
          </div>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
            placeholder="A brief professional summary about yourself..."
          />
        </section>

        {/* Skills */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-slate-900">Skills</h2>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium"
              >
                {skill}
                <button
                  onClick={() => removeSkill(index)}
                  className="p-0.5 hover:bg-emerald-100 rounded-full transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a skill (press Enter)"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addSkill(e.target.value.trim());
                  e.target.value = '';
                }
              }}
            />
          </div>
        </section>

        {/* Education */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-slate-900">Education</h2>
            </div>
            <button
              onClick={addEducation}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Education
            </button>
          </div>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg relative">
                <button
                  onClick={() => removeEducation(index)}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    placeholder="Institution"
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    placeholder="Degree"
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => updateEducation(index, 'field', e.target.value)}
                    placeholder="Field of Study"
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={edu.startYear || ''}
                      onChange={(e) => updateEducation(index, 'startYear', parseInt(e.target.value))}
                      placeholder="Start Year"
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    <input
                      type="number"
                      value={edu.endYear || ''}
                      onChange={(e) => updateEducation(index, 'endYear', parseInt(e.target.value))}
                      placeholder="End Year"
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    value={edu.cgpa || ''}
                    onChange={(e) => updateEducation(index, 'cgpa', parseFloat(e.target.value))}
                    placeholder="CGPA/GPA"
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <textarea
                    value={edu.description}
                    onChange={(e) => updateEducation(index, 'description', e.target.value)}
                    placeholder="Description (optional)"
                    rows={2}
                    className="md:col-span-2 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-slate-900">Work Experience</h2>
            </div>
            <button
              onClick={addExperience}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Experience
            </button>
          </div>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg relative">
                <button
                  onClick={() => removeExperience(index)}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    placeholder="Company"
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => updateExperience(index, 'role', e.target.value)}
                    placeholder="Role/Position"
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => updateExperience(index, 'location', e.target.value)}
                    placeholder="Location"
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                      placeholder="Start (MMM YYYY)"
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                      placeholder="End (MMM YYYY)"
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <label className="flex items-center gap-2 col-span-full">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                      className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-slate-700">I currently work here</span>
                  </label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    placeholder="Description"
                    rows={3}
                    className="md:col-span-2 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FolderOpen className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-slate-900">Projects</h2>
            </div>
            <button
              onClick={addProject}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          </div>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg relative">
                <button
                  onClick={() => removeProject(index)}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 gap-3 pr-8">
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => updateProject(index, 'title', e.target.value)}
                    placeholder="Project Title"
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <textarea
                    value={project.description}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    placeholder="Project Description"
                    rows={3}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  />
                  <input
                    type="url"
                    value={project.url}
                    onChange={(e) => updateProject(index, 'url', e.target.value)}
                    placeholder="Project URL (optional)"
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-slate-900">Certifications</h2>
            </div>
            <button
              onClick={addCertification}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Certification
            </button>
          </div>
          <div className="space-y-4">
            {certifications.map((cert, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg relative">
                <button
                  onClick={() => removeCertification(index)}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                  <input
                    type="text"
                    value={cert.title}
                    onChange={(e) => updateCertification(index, 'title', e.target.value)}
                    placeholder="Certification Title"
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                    placeholder="Issuing Organization"
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <input
                    type="text"
                    value={cert.issueDate}
                    onChange={(e) => updateCertification(index, 'issueDate', e.target.value)}
                    placeholder="Issue Date"
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <input
                    type="url"
                    value={cert.url}
                    onChange={(e) => updateCertification(index, 'url', e.target.value)}
                    placeholder="Certificate URL (optional)"
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-slate-900">Achievements</h2>
          </div>
          <div className="space-y-2 mb-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
                <span className="flex-1 text-sm text-slate-700">{achievement}</span>
                <button
                  onClick={() => removeAchievement(index)}
                  className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add an achievement (press Enter)"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addAchievement(e.target.value.trim());
                e.target.value = '';
              }
            }}
          />
        </section>

        {/* Interests */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-slate-900">Interests</h2>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {interests.map((interest, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
              >
                {interest}
                <button
                  onClick={() => removeInterest(index)}
                  className="p-0.5 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add an interest (press Enter)"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addInterest(e.target.value.trim());
                e.target.value = '';
              }
            }}
          />
        </section>

        {/* Career Preferences */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-slate-900">Career Preferences</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Role</label>
              <input
                type="text"
                value={preferredRole}
                onChange={(e) => setPreferredRole(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="e.g., Software Engineer, Data Analyst"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Location</label>
              <input
                type="text"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="e.g., Bangalore, Remote"
              />
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => navigate('/dashboard/resume')}
            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save & Continue
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
