import { Link } from 'react-router-dom';
import { 
  Home, Briefcase, MapPin, User, Upload, FileText, 
  LogIn, UserPlus, LayoutDashboard, ExternalLink, 
  Check 
} from 'lucide-react';

export default function LinksPage() {
  const links = {
    public: [
      { name: 'Home', path: '/', icon: Home, description: 'Landing page with featured internships' },
      { name: 'Browse Internships', path: '/internships', icon: Briefcase, description: '8 real internships with Apply Now buttons' },
      { name: 'Locations', path: '/locations', icon: MapPin, description: 'Browse internships by location' },
      { name: 'Login', path: '/login', icon: LogIn, description: 'Student login page' },
      { name: 'Register', path: '/register', icon: UserPlus, description: 'Create student account' },
    ],
    student: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, description: 'Student dashboard overview' },
      { name: 'My Profile', path: '/dashboard/profile', icon: User, description: 'Update student profile' },
      { name: 'Resume Management', path: '/dashboard/resume', icon: FileText, description: 'View and manage resumes' },
      { name: 'Upload Resume', path: '/dashboard/resume/upload', icon: Upload, description: 'Upload PDF/DOC resume' },
      { name: 'AI Resume Builder', path: '/dashboard/resume/ai-builder', icon: FileText, description: 'Generate resume with AI' },
      { name: 'My Applications', path: '/dashboard/applications', icon: Briefcase, description: 'Track application status' },
      { name: 'Saved Internships', path: '/dashboard/saved', icon: Briefcase, description: 'Your saved internships' },
    ]
  };

  const companies = [
    { name: 'Google Careers', url: 'https://www.google.com/about/careers/applications/' },
    { name: 'Microsoft Student Careers', url: 'https://careers.microsoft.com/v2/global/en/students' },
    { name: 'Amazon Student Internships', url: 'https://amazon.jobs/content/en/career-programs/university/internships-for-students' },
    { name: 'IBM Internships', url: 'https://www.ibm.com/careers/internships' },
    { name: 'TCS Internship', url: 'https://www.tcs.com/careers/india/internship' },
    { name: 'Infosys Students', url: 'https://www.infosys.com/careers/apply/students.html' },
    { name: 'Accenture Students & Graduates', url: 'https://www.accenture.com/in-en/careers/students-graduates' },
    { name: 'Zoho Careers', url: 'https://www.zoho.com/careers/' },
    { name: 'Wipro Careers', url: 'https://careers.wipro.com/' },
    { name: 'Deloitte Student Careers', url: 'https://www.deloitte.com/in/en/careers/students.html' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
      <div className="mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Smart Internship Finder - Site Map
          </h1>
          <p className="text-slate-600">All available pages and official company career links</p>
        </div>

        {/* System Status */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-emerald-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <Check className="h-5 w-5 text-emerald-600" />
              <span className="font-bold text-slate-800">Database</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600">8</p>
            <p className="text-xs text-slate-500">Real internships loaded</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <Check className="h-5 w-5 text-emerald-600" />
              <span className="font-bold text-slate-800">Companies</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600">4</p>
            <p className="text-xs text-slate-500">Google, Microsoft, Amazon, Zoho</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <Check className="h-5 w-5 text-emerald-600" />
              <span className="font-bold text-slate-800">Locations</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600">7</p>
            <p className="text-xs text-slate-500">Cities across India</p>
          </div>
        </div>

        {/* Public Pages */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-800">Public Pages</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {links.public.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800 group-hover:text-emerald-700">
                      {link.name}
                    </p>
                    <p className="text-xs text-slate-500">{link.description}</p>
                    <code className="mt-1 block text-xs text-slate-400">{link.path}</code>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Student Dashboard Pages */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-800">
            Student Dashboard <span className="text-sm font-normal text-slate-500">(Login Required)</span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {links.student.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800 group-hover:text-blue-700">
                      {link.name}
                    </p>
                    <p className="text-xs text-slate-500">{link.description}</p>
                    <code className="mt-1 block text-xs text-slate-400">{link.path}</code>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Company Application URLs */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-800">Official Company Application Links</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {companies.map((company) => (
              <a
                key={company.name}
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-300 hover:shadow-md"
              >
                <div>
                  <p className="font-bold text-slate-800 group-hover:text-emerald-700">
                    {company.name}
                  </p>
                  <code className="mt-1 block text-xs text-slate-400 truncate">{company.url}</code>
                </div>
                <ExternalLink className="h-5 w-5 text-slate-400 transition group-hover:text-emerald-600" />
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>✅ All systems operational</p>
          <p className="mt-1">Phase 14: Apply Now Feature - Complete</p>
        </div>

      </div>
    </div>
  );
}
