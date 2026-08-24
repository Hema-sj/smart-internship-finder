import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, MapPin, Globe, Briefcase, Award, CheckCircle, 
  ExternalLink, Star, TrendingUp
} from 'lucide-react';
import { fetchCompanyProfile } from '../services/locationService';
import InternshipCard from '../components/InternshipCard';
import InternshipDetailModal from '../components/InternshipDetailModal';
import { fetchInternshipById } from '../services/internshipService';

export default function CompanyProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState(null);
  
  useEffect(() => {
    async function loadCompany() {
      setLoading(true);
      try {
        const data = await fetchCompanyProfile(id);
        setCompany(data);
      } catch (error) {
        console.error('Failed to load company profile:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      loadCompany();
    }
  }, [id]);
  
  const handleViewDetails = async (internship) => {
    setSelectedInternship(internship);
    if (!internship?._id) return;
    try {
      const full = await fetchInternshipById(internship._id);
      setSelectedInternship(full);
    } catch (error) {
      console.error('Failed to load internship details:', error);
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
        {/* Company Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-sm text-emerald-700 hover:text-emerald-800 font-semibold"
          >
            ← Back
          </button>
          
          <div className="flex items-start gap-6">
            {company.logo && (
              <img 
                src={company.logo} 
                alt={company.companyName}
                className="h-24 w-24 rounded-xl border border-slate-200 object-contain p-3"
              />
            )}
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold text-slate-900">{company.companyName}</h1>
                {company.verified && (
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                )}
              </div>
              
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
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
                
                {company.averageRating && (
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="font-semibold text-slate-900">{company.averageRating}/5</span>
                  </div>
                )}
              </div>
              
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 transition"
                >
                  <Globe className="h-4 w-4" />
                  Visit Website
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
          
          {company.description && (
            <div className="mt-6 rounded-xl bg-slate-50 p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-2">About {company.companyName}</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{company.description}</p>
            </div>
          )}
        </div>
        
        {/* Company Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-3">
                <Briefcase className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{company.totalInternships}</p>
                <p className="text-xs text-slate-600">Open Positions</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-3">
                <TrendingUp className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{company.availableRoles.length}</p>
                <p className="text-xs text-slate-600">Different Roles</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-3">
                <Award className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{company.requiredSkills.length}</p>
                <p className="text-xs text-slate-600">Skills Required</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Available Roles */}
        {company.availableRoles.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-emerald-600" />
              Available Roles
            </h3>
            <div className="flex flex-wrap gap-2">
              {company.availableRoles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Required Skills */}
        {company.requiredSkills.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-600" />
              Skills Required
            </h3>
            <div className="flex flex-wrap gap-2">
              {company.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Internships */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            Open Internships ({company.internships.length})
          </h3>
          
          {company.internships.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Briefcase className="mx-auto h-16 w-16 text-slate-300" />
              <p className="mt-4 text-slate-600">No open internships at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {company.internships.map((internship) => (
                <InternshipCard
                  key={internship._id}
                  internship={internship}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Internship Detail Modal */}
      {selectedInternship && (
        <InternshipDetailModal
          internship={selectedInternship}
          onClose={() => setSelectedInternship(null)}
        />
      )}
    </div>
  );
}
