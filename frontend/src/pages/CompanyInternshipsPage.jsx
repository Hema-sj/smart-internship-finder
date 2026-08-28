import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Building2, MapPin, Globe, Briefcase, Award, CheckCircle, 
  ExternalLink, Star, Clock, Calendar, DollarSign, FileText,
  Users, Target, TrendingUp, Info
} from 'lucide-react';
import api from '../services/api';

export default function CompanyInternshipsPage() {
  const { companyName } = useParams();
  const navigate = useNavigate();
  
  const [company, setCompany] = useState(null);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadCompanyData();
  }, [companyName]);
  
  const loadCompanyData = async () => {
    setLoading(true);
    try {
      // Fetch company details and internships
      const [companiesRes, internshipsRes] = await Promise.all([
        api.get('/companies'),
        api.get('/internships')
      ]);
      
      // Find the company by name (case-insensitive)
      const companyData = companiesRes.data.find(
        c => c.companyName.toLowerCase() === companyName.toLowerCase()
      );
      
      if (companyData) {
        setCompany(companyData);
        
        // Filter internships for this company
        const companyInternships = internshipsRes.data.data.filter(
          int => int.company?.companyName?.toLowerCase() === companyName.toLowerCase()
        );
        setInternships(companyInternships);
      }
    } catch (error) {
      console.error('Failed to load company data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <Building2 className="mx-auto h-16 w-16 text-slate-300" />
            <h2 className="mt-4 text-2xl font-bold text-slate-900">Company Not Found</h2>
            <p className="mt-2 text-slate-600">
              The company you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/internships')}
              className="mt-6 rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Browse Internships
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Link to="/dashboard" className="hover:text-emerald-700">Dashboard</Link>
          <span>/</span>
          <Link to="/internships" className="hover:text-emerald-700">Internships</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{company.companyName}</span>
        </div>
        
        {/* Company Header */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
          {/* Header Background */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6">
            <div className="flex items-center gap-6">
              {company.logo && (
                <div className="h-20 w-20 rounded-xl bg-white p-3 shadow-lg">
                  <img 
                    src={company.logo} 
                    alt={company.companyName}
                    className="h-full w-full object-contain"
                  />
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-extrabold text-white">{company.companyName}</h1>
                  {company.verified && (
                    <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                      <CheckCircle className="h-4 w-4" />
                      Verified
                    </div>
                  )}
                </div>
                
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-emerald-50">
                  {company.industry && (
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4" />
                      <span>{company.industry}</span>
                    </div>
                  )}
                  
                  {company.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      <span>{company.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    <span>{internships.length} Open Positions</span>
                  </div>
                </div>
              </div>
              
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition shadow-md flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  Visit Website
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
          
          {/* Company Info */}
          <div className="px-8 py-6">
            {company.description && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4 text-emerald-600" />
                  About {company.companyName}
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">{company.description}</p>
              </div>
            )}
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <p className="text-2xl font-bold text-emerald-700">{internships.length}</p>
                <p className="text-xs text-slate-600 mt-1">Open Positions</p>
              </div>
              
              <div className="text-center p-4 rounded-xl bg-blue-50 border border-blue-100">
                <p className="text-2xl font-bold text-blue-700">
                  {internships.filter(i => i.compensationType === 'Paid').length}
                </p>
                <p className="text-xs text-slate-600 mt-1">Paid Internships</p>
              </div>
              
              <div className="text-center p-4 rounded-xl bg-purple-50 border border-purple-100">
                <p className="text-2xl font-bold text-purple-700">
                  {[...new Set(internships.map(i => i.location))].length}
                </p>
                <p className="text-xs text-slate-600 mt-1">Locations</p>
              </div>
              
              <div className="text-center p-4 rounded-xl bg-orange-50 border border-orange-100">
                <p className="text-2xl font-bold text-orange-700">
                  {[...new Set(internships.flatMap(i => i.requiredSkills || []))].length}
                </p>
                <p className="text-xs text-slate-600 mt-1">Skills Needed</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Internship Opportunities Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-8 py-5">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Target className="h-6 w-6 text-emerald-600" />
              Internship Opportunities at {company.companyName}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Browse all available internship roles, schedules, and compensation details
            </p>
          </div>
          
          {internships.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase className="mx-auto h-16 w-16 text-slate-300" />
              <p className="mt-4 text-slate-600">No open internships at the moment.</p>
              <p className="text-sm text-slate-500 mt-1">Check back later for new opportunities!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100 border-b-2 border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                      Role / Position
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                      Mode
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                      Compensation
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                      Start Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                      Deadline
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-700">
                      Apply
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {internships.map((internship, index) => (
                    <tr 
                      key={internship.id || index}
                      className="hover:bg-emerald-50/50 transition"
                    >
                      {/* Role / Position */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{internship.title}</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {internship.requiredSkills?.slice(0, 3).map((skill, i) => (
                              <span 
                                key={i}
                                className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600"
                              >
                                {skill}
                              </span>
                            ))}
                            {internship.requiredSkills?.length > 3 && (
                              <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                                +{internship.requiredSkills.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      {/* Location */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-700">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          {internship.location}
                        </div>
                      </td>
                      
                      {/* Duration */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                          <Clock className="h-4 w-4 text-slate-400" />
                          {internship.duration}
                        </div>
                      </td>
                      
                      {/* Mode */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          internship.mode === 'Remote' 
                            ? 'bg-purple-100 text-purple-700'
                            : internship.mode === 'Hybrid'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {internship.mode}
                        </span>
                      </td>
                      
                      {/* Compensation */}
                      <td className="px-6 py-4">
                        <div>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                            internship.compensationType === 'Paid'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            <DollarSign className="h-3 w-3" />
                            {internship.compensationType}
                          </span>
                          {internship.compensationType === 'Paid' && internship.stipend && (
                            <p className="text-sm font-semibold text-slate-900 mt-1">
                              ₹{internship.stipend?.toLocaleString()}/mo
                            </p>
                          )}
                        </div>
                      </td>
                      
                      {/* Start Date */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-700">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          {internship.startingDate 
                            ? new Date(internship.startingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : 'TBD'}
                        </div>
                      </td>
                      
                      {/* Deadline */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-red-600">
                          <Calendar className="h-4 w-4" />
                          {internship.applicationDeadline
                            ? new Date(internship.applicationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            : 'Rolling'}
                        </div>
                      </td>
                      
                      {/* Apply Button */}
                      <td className="px-6 py-4 text-center">
                        <a
                          href={internship.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition shadow-sm"
                        >
                          Apply Now
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Certificate Information */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-600" />
              Certificate Information
            </h3>
            <div className="space-y-3">
              {internships.map((int, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <span className="text-sm text-slate-700">{int.title}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    int.certificateType === 'Hard Copy' || int.certificateType === 'Both'
                      ? 'bg-emerald-100 text-emerald-700'
                      : int.certificateType === 'Soft Copy'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {int.certificateType}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Required Skills Summary */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-600" />
              Skills in Demand
            </h3>
            <div className="flex flex-wrap gap-2">
              {[...new Set(internships.flatMap(int => int.requiredSkills || []))].map((skill, i) => (
                <span 
                  key={i}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-sm font-medium text-emerald-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
