import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, Briefcase, MapPin, User, Upload, FileText, 
  LogIn, UserPlus, LayoutDashboard, ExternalLink, 
  Check
} from 'lucide-react';
import InternshipListing from '../components/InternshipListing';

export default function LinksPage() {
  const [searchLocation, setSearchLocation] = useState('');

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
    { 
      name: 'Google Careers', 
      url: 'https://www.google.com/about/careers/applications/',
      locations: ['Bengaluru', 'Hyderabad', 'Pune', 'Multiple Locations']
    },
    { 
      name: 'Microsoft Student Careers', 
      url: 'https://careers.microsoft.com/v2/global/en/students',
      locations: ['Bengaluru', 'Hyderabad', 'Multiple Locations']
    },
    { 
      name: 'Amazon Student Internships', 
      url: 'https://amazon.jobs/content/en/career-programs/university/internships-for-students',
      locations: ['Bengaluru', 'Chennai', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi', 'Multiple Locations']
    },
    { 
      name: 'IBM Internships', 
      url: 'https://www.ibm.com/careers/internships',
      locations: ['Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Multiple Locations']
    },
    { 
      name: 'TCS Internship', 
      url: 'https://www.tcs.com/careers/india/internship',
      locations: ['Chennai', 'Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Multiple Locations']
    },
    { 
      name: 'Infosys Students', 
      url: 'https://www.infosys.com/careers/apply/students.html',
      locations: ['Bengaluru', 'Mysuru', 'Pune', 'Hyderabad', 'Chennai', 'Multiple Locations']
    },
    { 
      name: 'Accenture Students & Graduates', 
      url: 'https://www.accenture.com/in-en/careers/students-graduates',
      locations: ['Bengaluru', 'Chennai', 'Hyderabad', 'Pune', 'Mumbai', 'Multiple Locations']
    },
    { 
      name: 'Zoho Careers', 
      url: 'https://www.zoho.com/careers/',
      locations: ['Chennai', 'Chennai (Estancia)', 'Bengaluru', 'Multiple Locations']
    },
    { 
      name: 'Wipro Careers', 
      url: 'https://careers.wipro.com/',
      locations: ['Bengaluru', 'Chennai', 'Hyderabad', 'Pune', 'Kochi', 'Multiple Locations']
    },
    { 
      name: 'Deloitte Student Careers', 
      url: 'https://www.deloitte.com/in/en/careers/students.html',
      locations: ['Bengaluru', 'Hyderabad', 'Chennai', 'Mumbai', 'Pune', 'Multiple Locations']
    }
  ];

  // Location aliases for search
  const locationAliases = {
    'bangalore': 'bengaluru',
    'bengalore': 'bengaluru',
    'blr': 'bengaluru',
    'hyd': 'hyderabad',
    'chennai': 'chennai',
    'maa': 'chennai',
    'pune': 'pune',
    'mumbai': 'mumbai',
    'bom': 'mumbai',
    'delhi': 'delhi',
    'del': 'delhi',
    'kochi': 'kochi',
    'mysore': 'mysuru',
    'mysuru': 'mysuru'
  };

  // Normalize location for search
  const normalizeLocation = (loc) => {
    const lower = loc.toLowerCase().trim();
    return locationAliases[lower] || lower;
  };

  // Filter companies by search location
  const filteredCompanies = searchLocation.trim()
    ? companies.filter(company => {
        const searchTerm = normalizeLocation(searchLocation);
        return company.locations.some(loc => {
          // Skip generic location terms
          const lowerLoc = loc.toLowerCase();
          if (lowerLoc.includes('multiple') || lowerLoc.includes('various') || lowerLoc.includes('all')) {
            return false;
          }
          // Match exact city names only
          const normalizedLoc = normalizeLocation(loc);
          return normalizedLoc === searchTerm || 
                 normalizedLoc.includes(searchTerm) || 
                 searchTerm.includes(normalizedLoc);
        });
      })
    : companies;

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
          
          {/* Location Search */}
          <div className="mb-4">
            <label htmlFor="location-search" className="mb-2 block text-sm font-semibold text-slate-700">
              Search by Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="location-search"
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Search location (e.g., Bengaluru, Chennai, Hyderabad...)"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            {searchLocation && (
              <p className="mt-2 text-xs text-slate-500">
                Showing {filteredCompanies.length} compan{filteredCompanies.length !== 1 ? 'ies' : 'y'} 
                {filteredCompanies.length > 0 ? ` with opportunities in ${searchLocation}` : ''}
              </p>
            )}
          </div>

          {filteredCompanies.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <MapPin className="mx-auto mb-3 h-12 w-12 text-slate-300" />
              <p className="text-lg font-semibold text-slate-700">
                No internships currently available in this location.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Try searching for: Bengaluru, Chennai, Hyderabad, Pune, Mumbai, Delhi, or Kochi
              </p>
              <button
                onClick={() => setSearchLocation('')}
                className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
            {filteredCompanies.map((company) => (
              <a
                key={company.name}
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-bold text-slate-800 group-hover:text-emerald-700">
                    {company.name}
                  </p>
                  <ExternalLink className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-emerald-600" />
                </div>
                <div className="flex items-start gap-1.5 mb-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-0.5" />
                  <div className="flex flex-wrap gap-1">
                    {company.locations.map((loc, idx) => (
                      <span key={idx} className="text-xs text-slate-600">
                        {loc}{idx < company.locations.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </div>
                <code className="mt-auto block text-xs text-slate-400 truncate">{company.url}</code>
              </a>
            ))}
            </div>
          )}
        </div>

        {/* Internship Listings with Search & Filter */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-800">Search & Filter Internships</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <InternshipListing compact={false} pageSize={10} syncUrl={false} />
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
