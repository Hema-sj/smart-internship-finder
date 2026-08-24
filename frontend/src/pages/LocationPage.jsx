import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Briefcase, DollarSign, Award, TrendingUp, Building2, 
  Users, Clock, Calendar, Filter, ChevronRight, Star
} from 'lucide-react';
import { fetchLocationStats, fetchLocationInternships } from '../services/locationService';
import InternshipCard from '../components/InternshipCard';
import InternshipDetailModal from '../components/InternshipDetailModal';
import { fetchInternshipById } from '../services/internshipService';

export default function LocationPage() {
  const { location } = useParams();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState(null);
  const [internships, setInternships] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState(null);
  
  // Filters
  const [courseFilter, setCourseFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [compensationFilter, setCompensationFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [page, setPage] = useState(1);
  
  // Load statistics
  useEffect(() => {
    async function loadStats() {
      setStatsLoading(true);
      try {
        const data = await fetchLocationStats(location);
        setStats(data);
      } catch (error) {
        console.error('Failed to load location stats:', error);
      } finally {
        setStatsLoading(false);
      }
    }
    
    if (location) {
      loadStats();
    }
  }, [location]);
  
  // Load internships
  const loadInternships = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        sort: sortBy,
      };
      
      if (courseFilter) params.course = courseFilter;
      if (companyFilter) params.company = companyFilter;
      if (compensationFilter !== 'All') params.compensationType = compensationFilter;
      if (modeFilter) params.mode = modeFilter;
      if (skillFilter) params.skill = skillFilter;
      
      const data = await fetchLocationInternships(location, params);
      setInternships(data.data || []);
      setPagination({
        page: data.currentPage || 1,
        pages: data.totalPages || 1,
        total: data.totalCount || 0,
      });
    } catch (error) {
      console.error('Failed to load internships:', error);
      setInternships([]);
    } finally {
      setLoading(false);
    }
  }, [location, page, sortBy, courseFilter, companyFilter, compensationFilter, modeFilter, skillFilter]);
  
  useEffect(() => {
    if (location) {
      loadInternships();
    }
  }, [location, loadInternships]);
  
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
  
  const handleCompanyClick = (companyId) => {
    if (companyId) {
      navigate(`/company/${companyId}`);
    }
  };
  
  const handleClearFilters = () => {
    setCourseFilter('');
    setCompanyFilter('');
    setCompensationFilter('All');
    setModeFilter('');
    setSkillFilter('');
    setPage(1);
  };
  
  if (statsLoading) {
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
  
  if (!stats || stats.totalInternships === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <MapPin className="mx-auto h-16 w-16 text-slate-300" />
            <h2 className="mt-4 text-2xl font-bold text-slate-900">No Internships in {location}</h2>
            <p className="mt-2 text-slate-600">
              There are currently no internships available in this location.
            </p>
            <button
              onClick={() => navigate('/internships')}
              className="mt-6 rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Browse All Internships
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="h-6 w-6 text-emerald-600" />
                <h1 className="text-3xl font-extrabold text-slate-900">{location}</h1>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {stats.totalInternships} internship{stats.totalInternships !== 1 ? 's' : ''} available
              </p>
            </div>
            <button
              onClick={() => navigate('/internships')}
              className="text-sm text-emerald-700 hover:text-emerald-800 font-semibold"
            >
              ← Back to All Internships
            </button>
          </div>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-3">
                <Briefcase className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.totalInternships}</p>
                <p className="text-xs text-slate-600">Total Internships</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-3">
                <DollarSign className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.paidInternships}</p>
                <p className="text-xs text-slate-600">Paid Internships</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-3">
                <Building2 className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.companies.length}</p>
                <p className="text-xs text-slate-600">Companies Hiring</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-3">
                <TrendingUp className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.averageStipend ? `₹${(stats.averageStipend / 1000).toFixed(0)}k` : 'N/A'}
                </p>
                <p className="text-xs text-slate-600">Avg. Stipend/Month</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mode Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Work Mode Distribution</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-700">{stats.modeBreakdown.Remote}</p>
              <p className="text-sm text-slate-600 mt-1">Remote</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-700">{stats.modeBreakdown['On-site']}</p>
              <p className="text-sm text-slate-600 mt-1">On-site</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-700">{stats.modeBreakdown.Hybrid}</p>
              <p className="text-sm text-slate-600 mt-1">Hybrid</p>
            </div>
          </div>
        </div>
        
        {/* Popular Companies */}
        {stats.companies.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-emerald-600" />
              Popular Companies in {location}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {stats.companies.slice(0, 6).map((company) => (
                <button
                  key={company._id}
                  onClick={() => handleCompanyClick(company._id)}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-left hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
                >
                  {company.logo && (
                    <img 
                      src={company.logo} 
                      alt={company.companyName}
                      className="h-10 w-10 rounded object-contain"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">
                      {company.companyName}
                    </p>
                    <p className="text-xs text-slate-600">
                      {company.internshipCount} internship{company.internshipCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Popular Skills */}
        {stats.popularSkills.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-600" />
              Popular Skills in {location}
            </h3>
            <div className="flex flex-wrap gap-2">
              {stats.popularSkills.slice(0, 12).map((item) => (
                <button
                  key={item.skill}
                  onClick={() => setSkillFilter(item.skill)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
                >
                  <span className="font-medium text-slate-800">{item.skill}</span>
                  <span className="text-xs text-slate-500">({item.count})</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900">Filter Internships</h3>
          </div>
          
          {/* Compensation Tabs */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {['All', 'Paid', 'Unpaid'].map((comp) => (
              <button
                key={comp}
                onClick={() => {
                  setCompensationFilter(comp);
                  setPage(1);
                }}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                  compensationFilter === comp
                    ? comp === 'Paid'
                      ? 'bg-emerald-600 text-white'
                      : comp === 'Unpaid'
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {comp}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <select
              value={courseFilter}
              onChange={(e) => {
                setCourseFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">All Courses</option>
              {stats.availableCourses.map((course) => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
            
            <input
              type="text"
              placeholder="Filter by company..."
              value={companyFilter}
              onChange={(e) => {
                setCompanyFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            
            <select
              value={modeFilter}
              onChange={(e) => {
                setModeFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">All Modes</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="latest">Latest</option>
              <option value="upcoming">Upcoming</option>
              <option value="highestStipend">Highest Stipend</option>
              <option value="deadline">Deadline Soon</option>
              <option value="aiMatch">Best AI Match</option>
            </select>
          </div>
          
          {(courseFilter || companyFilter || modeFilter || skillFilter || compensationFilter !== 'All') && (
            <button
              onClick={handleClearFilters}
              className="mt-3 text-sm text-emerald-700 hover:text-emerald-800 font-semibold"
            >
              Clear All Filters
            </button>
          )}
        </div>
        
        {/* Internships Grid */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            {loading ? 'Loading...' : `${pagination.total} Internships in ${location}`}
          </h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
            </div>
          ) : internships.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Briefcase className="mx-auto h-16 w-16 text-slate-300" />
              <p className="mt-4 text-slate-600">No internships found matching your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {internships.map((internship) => (
                  <InternshipCard
                    key={internship._id}
                    internship={internship}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
              
              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-slate-600">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    disabled={page >= pagination.pages}
                    onClick={() => setPage(p => p + 1)}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
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
