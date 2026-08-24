import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Globe, ChevronRight, ChevronLeft,
  GraduationCap, Code, FolderOpen, Award, Trophy, Briefcase, Heart,
  MapPin, Target, Loader, CheckCircle, Sparkles, Plus, X, Link as LinkIcon
} from 'lucide-react';
import { generateAIResume } from '../services/studentService';

const STEPS = [
  { id: 1, title: 'Personal Details', icon: User },
  { id: 2, title: 'Career Objective', icon: Target },
  { id: 3, title: 'Education', icon: GraduationCap },
  { id: 4, title: 'Skills', icon: Code },
  { id: 5, title: 'Projects', icon: FolderOpen },
  { id: 6, title: 'Certifications', icon: Award },
  { id: 7, title: 'Achievements', icon: Trophy },
  { id: 8, title: 'Experience', icon: Briefcase },
  { id: 9, title: 'Preferences', icon: Heart },
];

export default function AIResumeBuilderPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  // Form data
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
    linkedIn: '',
    github: '',
    portfolio: ''
  });
  const [summary, setSummary] = useState('');
  const [education, setEducation] = useState([{
    institution: '',
    degree: '',
    field: '',
    startYear: null,
    endYear: null,
    cgpa: null,
    description: ''
  }]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([{
    title: '',
    description: '',
    technologies: [],
    url: '',
    startDate: '',
    endDate: ''
  }]);
  const [certifications, setCertifications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [experience, setExperience] = useState([]);
  const [interests, setInterests] = useState([]);
  const [preferredRole, setPreferredRole] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGenerate = async () => {
    // Validate required fields
    if (!personalInfo.name || !personalInfo.email) {
      setError('Please provide at least your name and email.');
      return;
    }

    try {
      setGenerating(true);
      setError('');

      const resumeData = {
        personalInfo,
        summary,
        education: education.filter(e => e.institution || e.degree),
        skills,
        projects: projects.filter(p => p.title),
        certifications,
        experience: experience.filter(e => e.company || e.role),
        achievements,
        interests,
        preferredRole,
        preferredLocation
      };

      const result = await generateAIResume(resumeData);
      
      // Navigate to preview page with generated resume
      navigate(`/dashboard/resume/preview/${result.resume._id}`);
    } catch (err) {
      setError(err.message || 'Failed to generate resume');
    } finally {
      setGenerating(false);
    }
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
    if (education.length > 1) {
      setEducation(education.filter((_, i) => i !== index));
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
    if (projects.length > 1) {
      setProjects(projects.filter((_, i) => i !== index));
    }
  };

  const addCertification = (cert) => {
    if (cert) {
      setCertifications([...certifications, { title: cert, issuer: '', issueDate: '' }]);
    }
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

  const addInterest = (interest) => {
    if (interest && !interests.includes(interest)) {
      setInterests([...interests, interest]);
    }
  };

  const removeInterest = (index) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Personal Details
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Let's start with your basic information</h3>
              <p className="text-sm text-slate-600">This helps us create a professional header for your resume.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={personalInfo.name}
                onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address *
              </label>
              <input
                type="email"
                value={personalInfo.email}
                onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <input
                type="tel"
                value={personalInfo.phone}
                onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="+1 234 567 8900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={personalInfo.linkedIn}
                onChange={(e) => setPersonalInfo({ ...personalInfo, linkedIn: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="https://linkedin.com/in/johndoe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                GitHub Profile
              </label>
              <input
                type="url"
                value={personalInfo.github}
                onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="https://github.com/johndoe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Portfolio Website
              </label>
              <input
                type="url"
                value={personalInfo.portfolio}
                onChange={(e) => setPersonalInfo({ ...personalInfo, portfolio: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="https://johndoe.com"
              />
            </div>
          </div>
        );

      case 2: // Career Objective
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">What are your career interests?</h3>
              <p className="text-sm text-slate-600">Tell us about your career goals and what you're passionate about. AI will help craft a professional summary.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Career Objective / Interests</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={6}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                placeholder="Example: Aspiring software engineer passionate about building scalable web applications. Interested in full-stack development, cloud technologies, and contributing to open-source projects. Seeking internship opportunities to apply my skills in React, Node.js, and Python..."
              />
              <p className="mt-2 text-xs text-slate-500">
                <Sparkles className="w-3 h-3 inline mr-1" />
                AI will enhance this into a professional summary
              </p>
            </div>
          </div>
        );

      case 3: // Education
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Tell us about your education</h3>
              <p className="text-sm text-slate-600">Add your academic qualifications and achievements.</p>
            </div>
            {education.map((edu, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative">
                {education.length > 1 && (
                  <button
                    onClick={() => removeEducation(index)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="space-y-3 pr-8">
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    placeholder="Institution / University *"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      placeholder="Degree (e.g., B.Tech)"
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                    />
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) => updateEducation(index, 'field', e.target.value)}
                      placeholder="Field (e.g., Computer Science)"
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="number"
                      value={edu.startYear || ''}
                      onChange={(e) => updateEducation(index, 'startYear', parseInt(e.target.value))}
                      placeholder="Start Year"
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                    />
                    <input
                      type="number"
                      value={edu.endYear || ''}
                      onChange={(e) => updateEducation(index, 'endYear', parseInt(e.target.value))}
                      placeholder="End Year"
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={edu.cgpa || ''}
                      onChange={(e) => updateEducation(index, 'cgpa', parseFloat(e.target.value))}
                      placeholder="CGPA"
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addEducation}
              className="w-full py-2.5 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Another Education
            </button>
          </div>
        );

      case 4: // Skills
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">What are your skills?</h3>
              <p className="text-sm text-slate-600">List your technical skills, tools, and technologies you're proficient in.</p>
            </div>
            <div className="flex flex-wrap gap-2 p-4 border border-slate-200 rounded-lg bg-slate-50 min-h-[100px]">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(index)}
                    className="p-0.5 hover:bg-emerald-200 rounded-full transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {skills.length === 0 && (
                <p className="text-sm text-slate-400 italic">No skills added yet. Type below to add.</p>
              )}
            </div>
            <input
              type="text"
              placeholder="Type a skill and press Enter (e.g., JavaScript, Python, React)"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  addSkill(e.target.value.trim());
                  e.target.value = '';
                }
              }}
            />
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <Sparkles className="w-4 h-4 inline mr-1" />
                <strong>AI Tip:</strong> Add at least 5-10 relevant skills for better internship matching.
              </p>
            </div>
          </div>
        );

      case 5: // Projects
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Share your projects</h3>
              <p className="text-sm text-slate-600">Tell us about projects you've worked on. AI will enhance your descriptions.</p>
            </div>
            {projects.map((project, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative">
                {projects.length > 1 && (
                  <button
                    onClick={() => removeProject(index)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="space-y-3 pr-8">
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => updateProject(index, 'title', e.target.value)}
                    placeholder="Project Title *"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  />
                  <textarea
                    value={project.description}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    placeholder="Brief description of the project and your role..."
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none bg-white"
                  />
                  <input
                    type="url"
                    value={project.url}
                    onChange={(e) => updateProject(index, 'url', e.target.value)}
                    placeholder="Project URL (GitHub, live demo, etc.)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addProject}
              className="w-full py-2.5 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Another Project
            </button>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <Sparkles className="w-4 h-4 inline mr-1" />
                <strong>AI will:</strong> Enhance your project descriptions with action verbs and professional wording.
              </p>
            </div>
          </div>
        );

      case 6: // Certifications
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Do you have any certifications?</h3>
              <p className="text-sm text-slate-600">Add professional certifications, courses, or awards you've earned.</p>
            </div>
            <div className="space-y-2">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <Award className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="flex-1 text-sm text-slate-700">{cert.title}</span>
                  <button
                    onClick={() => removeCertification(index)}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Type a certification and press Enter"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  addCertification(e.target.value.trim());
                  e.target.value = '';
                }
              }}
            />
            <p className="text-xs text-slate-500">Optional: Skip if you don't have any certifications yet.</p>
          </div>
        );

      case 7: // Achievements
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Share your achievements</h3>
              <p className="text-sm text-slate-600">List any awards, recognitions, or notable accomplishments.</p>
            </div>
            <div className="space-y-2">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <Trophy className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
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
              placeholder="Type an achievement and press Enter"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  addAchievement(e.target.value.trim());
                  e.target.value = '';
                }
              }}
            />
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <Sparkles className="w-4 h-4 inline mr-1" />
                <strong>AI will:</strong> Format your achievements with action verbs for ATS compatibility.
              </p>
            </div>
          </div>
        );

      case 8: // Experience
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Do you have work experience?</h3>
              <p className="text-sm text-slate-600">Add internships, part-time jobs, or volunteer work (optional).</p>
            </div>
            {experience.length > 0 ? (
              experience.map((exp, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative">
                  <button
                    onClick={() => removeExperience(index)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="space-y-3 pr-8">
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      placeholder="Company / Organization"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                    />
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateExperience(index, 'role', e.target.value)}
                      placeholder="Role / Position"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                    />
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      placeholder="Brief description of your responsibilities..."
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none bg-white"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 border-2 border-dashed border-slate-300 rounded-lg text-center">
                <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600 mb-3">No work experience yet? That's okay!</p>
                <button
                  onClick={addExperience}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Add Experience
                </button>
              </div>
            )}
            {experience.length > 0 && (
              <button
                onClick={addExperience}
                className="w-full py-2.5 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Another Experience
              </button>
            )}
            <p className="text-xs text-slate-500">Optional: Skip if you don't have work experience yet.</p>
          </div>
        );

      case 9: // Preferences
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Finally, your preferences</h3>
              <p className="text-sm text-slate-600">Tell us what kind of role and location you're looking for.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Preferred Role / Position
              </label>
              <input
                type="text"
                value={preferredRole}
                onChange={(e) => setPreferredRole(e.target.value)}
                placeholder="e.g., Software Engineer Intern, Data Analyst"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Preferred Location
              </label>
              <input
                type="text"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                placeholder="e.g., Bangalore, Remote, Anywhere in India"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Interests (Optional)
              </label>
              <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] p-2 border border-slate-200 rounded-lg bg-slate-50">
                {interests.map((interest, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-300 text-slate-700 rounded-full text-sm"
                  >
                    {interest}
                    <button
                      onClick={() => removeInterest(index)}
                      className="p-0.5 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Type an interest and press Enter (e.g., Open Source, Cloud Computing)"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    addInterest(e.target.value.trim());
                    e.target.value = '';
                  }
                }}
              />
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-sm text-emerald-900 font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                You're all set!
              </p>
              <p className="text-sm text-emerald-800">
                Click "Generate Resume" to create your professional ATS-friendly resume with AI enhancements.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const CurrentStepIcon = STEPS[currentStep - 1].icon;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">AI Resume Builder</h1>
              <p className="text-sm text-slate-600">Create a professional resume in minutes with AI assistance</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="flex justify-between mb-2">
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`flex-1 h-2 rounded-full mx-0.5 transition-colors ${
                    step.id < currentStep
                      ? 'bg-emerald-600'
                      : step.id === currentStep
                      ? 'bg-emerald-400'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Step {currentStep} of {STEPS.length}</span>
              <span>{STEPS[currentStep - 1].title}</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <X className="w-5 h-5 text-red-600" />
            <p className="text-sm font-medium text-red-900">{error}</p>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CurrentStepIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">{STEPS[currentStep - 1].title}</h2>
          </div>
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          {currentStep < STEPS.length ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {generating ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Generating Resume...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Resume
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
