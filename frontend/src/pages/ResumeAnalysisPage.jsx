import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getResumeById } from '../services/studentService';
import { fetchInternships } from '../services/internshipService';
import { 
  ArrowLeft, CheckCircle, XCircle, Target, TrendingUp, 
  BookOpen, Award, Sparkles, Building2 
} from 'lucide-react';

// Skill Match Card Component - Shows individual internship match with company logo and skills
function SkillMatchCard({ internship, userSkills }) {
  const requiredSkills = internship.requiredSkills || [];
  const userSkillsLower = userSkills.map(s => s.toLowerCase());
  const requiredSkillsLower = requiredSkills.map(s => s.toLowerCase());
  
  // Calculate matches
  const matchedSkills = requiredSkillsLower.filter(req => 
    userSkillsLower.some(userSkill => 
      userSkill.includes(req) || req.includes(userSkill)
    )
  );
  
  const missingSkills = requiredSkillsLower.filter(req => 
    !userSkillsLower.some(userSkill => 
      userSkill.includes(req) || req.includes(userSkill)
    )
  );
  
  const matchPercentage = requiredSkills.length > 0 
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
    : 0;
  
  // Get company object from internship
  const company = internship.company || {};
  
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
      {/* Company Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
            {company.logo 
              ? <img src={company.logo} alt="" className="h-8 w-8 object-contain" />
              : <Building2 size={20} className="text-emerald-700" />
            }
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{internship.title}</h3>
            <p className="text-sm text-slate-500">{company.companyName || company.name || 'Company'}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-extrabold ${
            matchPercentage >= 75 ? 'text-emerald-600' :
            matchPercentage >= 50 ? 'text-orange-600' : 
            'text-red-600'
          }`}>
            {matchPercentage}%
          </div>
          <p className="text-xs text-slate-500 font-medium">Match Score</p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div 
            className={`h-full transition-all ${
              matchPercentage >= 75 ? 'bg-emerald-500' :
              matchPercentage >= 50 ? 'bg-orange-500' : 
              'bg-red-500'
            }`}
            style={{ width: `${matchPercentage}%` }}
          />
        </div>
      </div>
      
      {/* Skills Breakdown */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Matched Skills */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} className="text-emerald-600" />
            <span className="text-sm font-semibold text-slate-700">
              You Have ({matchedSkills.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matchedSkills.map((skill, idx) => (
              <span 
                key={idx}
                className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200"
              >
                {requiredSkills.find(s => s.toLowerCase() === skill) || skill}
              </span>
            ))}
            {matchedSkills.length === 0 && (
              <span className="text-xs text-slate-400 italic">No matching skills</span>
            )}
          </div>
        </div>
        
        {/* Missing Skills */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <XCircle size={16} className="text-red-600" />
            <span className="text-sm font-semibold text-slate-700">
              You Need ({missingSkills.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {missingSkills.map((skill, idx) => (
              <span 
                key={idx}
                className="px-2.5 py-1 rounded-md bg-red-50 text-red-700 text-xs font-medium border border-red-200"
              >
                {requiredSkills.find(s => s.toLowerCase() === skill) || skill}
              </span>
            ))}
            {missingSkills.length === 0 && (
              <span className="text-xs text-emerald-600 italic font-medium">
                ✓ You have all required skills!
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-slate-100">
        <Link
          to={`/internships/${internship.id}`}
          className="flex-1 text-center px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition"
        >
          View Details
        </Link>
        {internship.applicationUrl && (
          <a
            href={internship.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center px-4 py-2 rounded-lg border border-emerald-600 text-emerald-600 text-sm font-semibold hover:bg-emerald-50 transition"
          >
            Apply Now
          </a>
        )}
      </div>
    </div>
  );
}

function LearningRecommendation({ skill }) {
  const courses = {
    // Programming Languages
    'python': ['Python for Beginners - Coursera', 'Complete Python Bootcamp - Udemy', 'Python Programming - freeCodeCamp'],
    'java': ['Java Programming Masterclass - Udemy', 'Java Fundamentals - Coursera', 'Learn Java - Codecademy'],
    'javascript': ['JavaScript - The Complete Guide - Udemy', 'Modern JavaScript - freeCodeCamp', 'JavaScript Algorithms - Udemy'],
    'typescript': ['TypeScript Course - Udemy', 'Understanding TypeScript - Maximilian', 'TypeScript for Beginners - YouTube'],
    'c++': ['C++ Programming - Coursera', 'Complete C++ Developer - Udemy', 'Learn C++ - LearnCpp.com'],
    'c#': ['C# Fundamentals - Pluralsight', 'Complete C# Unity Developer - Udemy', 'C# Programming - Microsoft Learn'],
    
    // Web Development
    'html': ['HTML & CSS Course - Coursera', 'HTML Full Course - freeCodeCamp', 'Learn HTML - W3Schools'],
    'css': ['CSS - The Complete Guide - Udemy', 'Responsive Web Design - freeCodeCamp', 'CSS Masterclass - Udemy'],
    'react': ['React - The Complete Guide - Udemy', 'React Tutorial - React.dev', 'Advanced React Patterns - Frontend Masters'],
    'angular': ['Angular - The Complete Guide - Udemy', 'Angular Fundamentals - Pluralsight', 'Learn Angular - Angular.io'],
    'vue.js': ['Vue.js Complete Guide - Udemy', 'Vue Mastery - vueschool.io', 'Vue 3 Course - Coursera'],
    'node.js': ['Node.js Developer Course - Udemy', 'Node.js Tutorial - NodeSchool', 'The Complete Node.js Developer - Udemy'],
    'express': ['Express.js Fundamentals - Udemy', 'RESTful APIs with Node.js - Coursera', 'Express Tutorial - MDN'],
    
    // Databases
    'sql': ['SQL for Data Science - Coursera', 'Complete SQL Bootcamp - Udemy', 'SQL Tutorial - W3Schools'],
    'mysql': ['MySQL Database Administration - Udemy', 'MySQL for Developers - PlanetScale', 'MySQL Course - Coursera'],
    'postgresql': ['PostgreSQL Bootcamp - Udemy', 'Learn PostgreSQL - Codecademy', 'PostgreSQL Tutorial'],
    'mongodb': ['MongoDB Complete Guide - Udemy', 'MongoDB University - Free Courses', 'MongoDB for Developers - Coursera'],
    
    // Cloud & DevOps
    'aws': ['AWS Certified Solutions Architect - A Cloud Guru', 'AWS Fundamentals - Coursera', 'AWS Developer Associate - Udemy'],
    'azure': ['Microsoft Azure Fundamentals - Microsoft Learn', 'Azure Administrator - Pluralsight', 'Azure DevOps - Udemy'],
    'gcp': ['Google Cloud Platform - Coursera', 'GCP Associate Cloud Engineer - A Cloud Guru', 'GCP Essentials - Qwiklabs'],
    'docker': ['Docker Mastery - Udemy', 'Docker for Beginners - freeCodeCamp', 'Docker Deep Dive - Pluralsight'],
    'kubernetes': ['Kubernetes for Beginners - Udemy', 'K8s Tutorial - Kubernetes.io', 'Certified Kubernetes Administrator'],
    'terraform': ['Terraform Course - Udemy', 'HashiCorp Terraform - A Cloud Guru', 'Learn Terraform - HashiCorp Learn'],
    'linux': ['Linux Command Line Basics - Udemy', 'Linux Fundamentals - Linux Academy', 'Introduction to Linux - edX'],
    'bash': ['Bash Scripting Tutorial - Udemy', 'Learn Bash - Codecademy', 'Shell Scripting - LinuxCommand.org'],
    'ci/cd': ['CI/CD Pipeline - Udemy', 'Continuous Integration - Coursera', 'DevOps CI/CD Tutorial - GitLab'],
    'devops': ['DevOps Complete Course - Udemy', 'Introduction to DevOps - Coursera', 'DevOps Bootcamp - Linux Academy'],
    
    // Mobile Development
    'android': ['Android Development - Udacity', 'Complete Android Developer - Udemy', 'Android Basics - Google Developers'],
    'ios': ['iOS Development - Udemy', 'Swift Programming - Stanford', 'iOS App Development - Coursera'],
    'react native': ['React Native Complete Guide - Udemy', 'React Native Course - Coursera', 'Learn React Native'],
    'flutter': ['Flutter & Dart Complete Guide - Udemy', 'Flutter Development - Google', 'Flutter Course - Udacity'],
    'swift': ['Swift Programming - Stanford', 'iOS & Swift Complete Guide - Udemy', 'Learn Swift - Apple Developer'],
    'kotlin': ['Kotlin for Android - Udemy', 'Kotlin Bootcamp - Udacity', 'Learn Kotlin - JetBrains Academy'],
    
    // Data Science & ML
    'machine learning': ['Machine Learning - Stanford (Coursera)', 'ML with Python - freeCodeCamp', 'Deep Learning Specialization'],
    'tensorflow': ['TensorFlow Developer Certificate - Coursera', 'TensorFlow Tutorial - tensorflow.org', 'ML with TensorFlow'],
    'pytorch': ['PyTorch for Deep Learning - Udemy', 'Practical Deep Learning - fast.ai', 'PyTorch Tutorial - pytorch.org'],
    'deep learning': ['Deep Learning Specialization - Coursera', 'Neural Networks - 3Blue1Brown', 'Deep Learning A-Z - Udemy'],
    'data science': ['Data Science Bootcamp - Udemy', 'IBM Data Science - Coursera', 'Applied Data Science - MIT'],
    'pandas': ['Pandas Tutorial - Kaggle', 'Data Analysis with Pandas - Coursera', 'Complete Pandas Bootcamp - Udemy'],
    'statistics': ['Statistics Fundamentals - Coursera', 'Statistics for Data Science - Udemy', 'Khan Academy Statistics'],
    'nlp': ['NLP Specialization - Coursera', 'Natural Language Processing - Stanford', 'NLP with Python - Udemy'],
    'data analysis': ['Data Analyst Bootcamp - Udemy', 'Google Data Analytics - Coursera', 'Data Analysis with Python'],
    
    // Design
    'figma': ['Figma UI/UX Design - Udemy', 'Learn Figma - figma.com', 'Figma Masterclass - YouTube'],
    'adobe xd': ['Adobe XD Complete Course - Udemy', 'UI/UX with Adobe XD - Coursera', 'Adobe XD Tutorial - Adobe'],
    'ui design': ['UI Design Fundamentals - Udemy', 'Google UX Design - Coursera', 'Daily UI Challenge - dailyui.co'],
    'ux design': ['UX Design Specialization - Coursera', 'Interaction Design - IDF', 'UX Research & Design - Udemy'],
    'ux': ['UX Design Specialization - Coursera', 'Google UX Design Certificate', 'UX Research Methods - Udemy'],
    'ui/ux': ['UI/UX Design Bootcamp - Udemy', 'Google UX Design - Coursera', 'Complete Web & Mobile Designer - Udemy'],
    'photoshop': ['Photoshop CC Masterclass - Udemy', 'Photoshop for Beginners - Adobe', 'Photo Editing - Coursera'],
    'prototyping': ['Prototyping & Design - Coursera', 'Rapid Prototyping - Udemy', 'Figma Prototyping - YouTube'],
    'user research': ['User Research Methods - Coursera', 'UX Research Fundamentals - Udemy', 'How to Conduct User Research'],
    
    // Testing & QA
    'selenium': ['Selenium WebDriver with Java - Udemy', 'Test Automation - Coursera', 'Selenium Tutorial - guru99.com'],
    'testing': ['Software Testing Bootcamp - Udemy', 'Software Testing - Coursera', 'QA Engineer Course - Udemy'],
    'test automation': ['Test Automation University - Applitools', 'Automated Testing - Udemy', 'Cypress Testing - Udemy'],
    
    // Other Technologies
    'git': ['Git & GitHub Complete Course - Udemy', 'Version Control with Git - Coursera', 'Learn Git - Atlassian'],
    'github': ['GitHub Actions - Udemy', 'Git and GitHub Bootcamp - Udemy', 'GitHub Skills - skills.github.com'],
    'graphql': ['GraphQL Complete Guide - Udemy', 'Introduction to GraphQL - Apollo', 'GraphQL Tutorial - How To GraphQL'],
    'rest': ['RESTful API Design - Udemy', 'API Development - Postman', 'REST API Tutorial - restfulapi.net'],
    'rest api': ['RESTful API Design - Udemy', 'API Development - Postman', 'REST API Tutorial - restfulapi.net'],
    'api': ['API Development - Udemy', 'REST API Design - Coursera', 'Building APIs - Frontend Masters'],
    'microservices': ['Microservices Architecture - Udemy', 'Building Microservices - O\'Reilly', 'Microservices Patterns'],
    'data structures': ['Data Structures & Algorithms - Coursera', 'DSA Course - freeCodeCamp', 'Master the Coding Interview'],
    'algorithms': ['Algorithms Specialization - Stanford', 'AlgoExpert - algoexpert.io', 'LeetCode Practice - leetcode.com'],
    'dsa': ['Data Structures & Algorithms - Coursera', 'DSA Complete Course - YouTube', 'Coding Interview Bootcamp'],
    'system design': ['System Design Interview - Udemy', 'Grokking System Design - Educative', 'System Design Primer - GitHub'],
    'agile': ['Agile Fundamentals - Coursera', 'Scrum Master Certification - Udemy', 'Agile Development - edX'],
    'scrum': ['Scrum Master Certification - Udemy', 'Agile with Scrum - Coursera', 'Professional Scrum Master - Scrum.org'],
    'networking': ['Computer Networking - Coursera', 'Network+ Certification - CompTIA', 'Networking Fundamentals - Udemy'],
    'cybersecurity': ['Cybersecurity Specialization - Coursera', 'Ethical Hacking - Udemy', 'Security+ Certification - CompTIA'],
    'security': ['Cybersecurity Fundamentals - Coursera', 'Web Application Security - Udemy', 'Security Basics - CompTIA'],
    'blockchain': ['Blockchain Basics - Coursera', 'Ethereum & Solidity - Udemy', 'Blockchain Development - Udacity'],
    'communication': ['Communication Skills - Coursera', 'Business Communication - Udemy', 'Effective Communication - edX'],
    'problem solving': ['Problem Solving Techniques - Coursera', 'Critical Thinking - Udemy', 'Creative Problem Solving - edX'],
    'teamwork': ['Team Collaboration - Coursera', 'Teamwork Skills - LinkedIn Learning', 'Working in Teams - Udemy'],
    'project management': ['Project Management Professional - Coursera', 'PMP Certification - Udemy', 'Agile PM - PMI'],
  };
  
  const skillLower = skill.toLowerCase();
  const recommendations = courses[skillLower] || [`Search "${skill}" courses on Udemy/Coursera`];
  
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
          <Target size={16} className="text-orange-600" />
        </div>
        <h4 className="font-semibold text-slate-900">{skill}</h4>
      </div>
      <div className="space-y-2">
        {recommendations.map((course, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm">
            <BookOpen size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <span className="text-slate-600">{course}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResumeAnalysisPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    Promise.all([
      getResumeById(id),
      fetchInternships({ limit: 10, sort: 'bestMatch' })
    ])
      .then(([resumeData, internshipData]) => {
        console.log('Resume data:', resumeData);
        console.log('Internship data:', internshipData);
        setResume(resumeData);
        // Backend returns { data: [...], totalCount, totalPages, currentPage }
        setInternships(internshipData.data || internshipData.items || internshipData.internships || []);
      })
      .catch(err => {
        console.error('Error loading analysis:', err);
        setError(err.response?.data?.message || 'Failed to load analysis');
      })
      .finally(() => setLoading(false));
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !resume) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-900">{error || 'Resume not found'}</p>
            <button
              onClick={() => navigate('/dashboard/resume')}
              className="mt-4 text-sm font-medium text-red-600 hover:underline"
            >
              Back to Resumes
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const userSkills = resume.extractedSkills || [];
  
  // Collect all missing skills across all internships
  const allMissingSkills = new Set();
  internships.forEach(internship => {
    const required = (internship.requiredSkills || []).map(s => s.toLowerCase());
    const userLower = userSkills.map(s => s.toLowerCase());
    required.forEach(req => {
      if (!userLower.some(u => u.includes(req) || req.includes(u))) {
        allMissingSkills.add(req);
      }
    });
  });
  
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard/resume')}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft size={16} />
            Back to Resumes
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Resume Analysis</h1>
              <p className="text-slate-600 mt-1">{resume.fileName}</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-200">
              <Sparkles size={18} className="text-emerald-600" />
              <span className="font-semibold text-emerald-900">
                {userSkills.length} Skills Detected
              </span>
            </div>
          </div>
        </div>
        
        {/* Your Skills */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Award size={20} className="text-emerald-600" />
            Your Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {userSkills.length > 0 ? (
              userSkills.map((skill, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-200"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500 italic">No skills extracted from resume</p>
            )}
          </div>
        </div>
        
        {/* Match Analysis */}
        <div className="mb-6">
          <h2 className="font-bold text-slate-900 text-xl mb-4 flex items-center gap-2">
            <TrendingUp size={22} className="text-emerald-600" />
            Internship Match Analysis
          </h2>
          <div className="grid gap-4">
            {internships.length > 0 ? (
              internships.map(internship => (
                <SkillMatchCard 
                  key={internship.id} 
                  internship={internship} 
                  userSkills={userSkills}
                />
              ))
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                <p className="text-slate-500">No internships available for matching</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Learning Recommendations */}
        {allMissingSkills.size > 0 && (
          <div>
            <h2 className="font-bold text-slate-900 text-xl mb-4 flex items-center gap-2">
              <BookOpen size={22} className="text-orange-600" />
              Recommended Courses to Learn
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(allMissingSkills).slice(0, 6).map((skill, idx) => (
                <LearningRecommendation key={idx} skill={skill} />
              ))}
            </div>
            {allMissingSkills.size > 6 && (
              <p className="text-sm text-slate-500 mt-4 text-center">
                + {allMissingSkills.size - 6} more skills to improve your matches
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
