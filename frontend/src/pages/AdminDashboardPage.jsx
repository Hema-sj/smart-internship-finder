import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Users, Briefcase, Building2, TrendingUp, LogOut, Bell, CheckCircle, XCircle,
  Eye, Edit, Trash2, Clock, AlertCircle, Search, Filter, ExternalLink
} from 'lucide-react';
import api from '../services/api';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    users: { total: 0, students: 0, companies: 0 },
    internships: { total: 0, open: 0 },
    applications: { total: 0 },
    companies: { pendingVerification: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-sm text-slate-500">Smart Internship Finder - Platform Management</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 shrink-0">
            <nav className="bg-white rounded-xl border border-slate-200 p-2 sticky top-24">
              {[
                { id: 'dashboard', icon: TrendingUp, label: 'Dashboard', badge: null },
                { id: 'notifications', icon: Bell, label: 'New Internships', badge: null },
                { id: 'companies', icon: Building2, label: 'Company Access', badge: stats.companies.pendingVerification },
                { id: 'internships', icon: Briefcase, label: 'Manage Internships', badge: null },
                { id: 'users', icon: Users, label: 'Manage Users', badge: null },
              ].map(({ id, icon: Icon, label, badge }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === id
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    {label}
                  </div>
                  {badge > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'dashboard' && <DashboardView stats={stats} />}
            {activeTab === 'notifications' && <NewInternshipsView />}
            {activeTab === 'companies' && <CompanyAccessView onUpdate={fetchStats} />}
            {activeTab === 'internships' && (
              <InternshipsView
                showAddForm={showAddForm}
                setShowAddForm={setShowAddForm}
              />
            )}
            {activeTab === 'users' && <UsersView />}
          </main>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Dashboard View
// ═══════════════════════════════════════════════════════════════════════════

function DashboardView({ stats }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Platform Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          label="Total Users" 
          value={stats.users.total} 
          icon={Users} 
          color="blue"
          subtitle={`${stats.users.students} students, ${stats.users.companies} companies`}
        />
        <StatCard 
          label="Total Internships" 
          value={stats.internships.total} 
          icon={Briefcase} 
          color="emerald"
          subtitle={`${stats.internships.open} currently open`}
        />
        <StatCard 
          label="Total Applications" 
          value={stats.applications.total} 
          icon={TrendingUp} 
          color="orange"
        />
        <StatCard 
          label="Pending Verification" 
          value={stats.companies.pendingVerification} 
          icon={AlertCircle} 
          color="red"
          subtitle="Companies awaiting approval"
        />
      </div>

      {/* Add New Internship - Prominent Card */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl border border-emerald-500 p-6 mb-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-lg">
              <Plus size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Add New Internship</h3>
              <p className="text-emerald-50 mt-1">Post a new internship opportunity and notify all students instantly</p>
            </div>
          </div>
          <button
            onClick={() => { setActiveTab('internships'); setShowAddForm(true); }}
            className="px-8 py-4 bg-white text-emerald-700 rounded-lg font-bold hover:bg-emerald-50 transition shadow-lg flex items-center gap-2 text-lg"
          >
            <Plus size={24} />
            Add Internship
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setActiveTab('notifications')}
            className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition text-left"
          >
            <Bell size={20} className="text-emerald-600 mt-1" />
            <div>
              <p className="font-semibold text-slate-900">View New Internships</p>
              <p className="text-xs text-slate-500 mt-1">Check recent internship postings</p>
            </div>
          </button>
          
          <button 
            onClick={() => setActiveTab('companies')}
            className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition text-left"
          >
            <Building2 size={20} className="text-emerald-600 mt-1" />
            <div>
              <p className="font-semibold text-slate-900">Approve Companies</p>
              <p className="text-xs text-slate-500 mt-1">Manage company access requests</p>
            </div>
          </button>
          
          <button 
            onClick={() => { setActiveTab('internships'); setShowAddForm(true); }}
            className="flex items-start gap-3 p-4 rounded-lg border-2 border-emerald-500 bg-emerald-50 hover:bg-emerald-100 transition text-left shadow-md"
          >
            <Plus size={20} className="text-emerald-600 mt-1 font-bold" />
            <div>
              <p className="font-semibold text-emerald-700">Add New Internship</p>
              <p className="text-xs text-emerald-600 mt-1">Post a new internship opportunity</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, subtitle }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-4`}>
        <Icon size={24} />
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}

function ActionButton({ icon: Icon, label, description }) {
  return (
    <button className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition text-left">
      <Icon size={20} className="text-emerald-600 mt-1" />
      <div>
        <p className="font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// New Internships Notifications View
// ═══════════════════════════════════════════════════════════════════════════

function NewInternshipsView() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/internships/notifications/new');
      setNotifications(data.internships || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">New Internship Offers</h2>
          <p className="text-sm text-slate-500 mt-1">Companies that posted internships in the last 7 days</p>
        </div>
        <span className="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-semibold">
          {notifications.length} New
        </span>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : notifications.length === 0 ? (
        <EmptyState icon={Bell} message="No new internships in the last 7 days" />
      ) : (
        <div className="space-y-4">
          {notifications.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    {item.company.verified && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                        <CheckCircle size={12} />
                        Verified
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.compensationType === 'Paid' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.compensationType}
                      {item.compensationType === 'Paid' && item.stipend ? ` - ₹${item.stipend}/mo` : ''}
                    </span>
                  </div>
                  
                  <p className="text-slate-700 font-semibold mb-1">{item.company.name}</p>
                  <p className="text-sm text-slate-500 mb-3">{item.location}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      Posted {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <a
                  href={item.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  <ExternalLink size={16} />
                  View Link
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Company Access Management View
// ═══════════════════════════════════════════════════════════════════════════

function CompanyAccessView({ onUpdate }) {
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingCompanies();
  }, []);

  const fetchPendingCompanies = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/companies/pending');
      setPendingCompanies(data.companies || []);
    } catch (error) {
      console.error('Error fetching pending companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (companyId, companyName) => {
    if (!confirm(`Approve access for "${companyName}"? They will be able to post internships and communicate with students.`)) {
      return;
    }

    try {
      await api.post(`/admin/companies/${companyId}/approve`, {
        message: `Congratulations! Your company "${companyName}" has been verified. You can now post internships and connect with students.`
      });
      alert(`${companyName} approved successfully!`);
      fetchPendingCompanies();
      onUpdate();
    } catch (error) {
      console.error('Error approving company:', error);
      alert('Failed to approve company: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleReject = async (companyId, companyName) => {
    const reason = prompt(`Enter rejection reason for "${companyName}":`);
    if (!reason) return;

    try {
      await api.post(`/admin/companies/${companyId}/reject`, { reason });
      alert(`${companyName} rejected.`);
      fetchPendingCompanies();
      onUpdate();
    } catch (error) {
      console.error('Error rejecting company:', error);
      alert('Failed to reject company: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Company Access Management</h2>
          <p className="text-sm text-slate-500 mt-1">Review and approve companies to give them access to post internships</p>
        </div>
        <span className="px-4 py-2 rounded-lg bg-orange-50 text-orange-700 font-semibold">
          {pendingCompanies.length} Pending
        </span>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : pendingCompanies.length === 0 ? (
        <EmptyState icon={Building2} message="No companies pending verification" />
      ) : (
        <div className="space-y-4">
          {pendingCompanies.map((company) => (
            <div key={company._id} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {company.logo && (
                      <img src={company.logo} alt={company.name} className="w-12 h-12 rounded-lg object-cover" />
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{company.name}</h3>
                      <p className="text-sm text-slate-500">{company.industry || 'Not specified'}</p>
                    </div>
                  </div>

                  {company.userId && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold">Contact:</span> {company.userId.name} ({company.userId.email})
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Registered: {new Date(company.userId.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-sm text-emerald-600 hover:underline"
                    >
                      <ExternalLink size={14} />
                      {company.website}
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleApprove(company._id, company.name)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(company._id, company.name)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Internships Management View
// ═══════════════════════════════════════════════════════════════════════════

function InternshipsView({ showAddForm, setShowAddForm }) {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/internships');
      setInternships(data.items || []);
    } catch (error) {
      console.error('Error fetching internships:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Manage Internships</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
        >
          <Plus size={20} />
          Add New Internship
        </button>
      </div>

      {showAddForm && <AddInternshipForm onClose={() => setShowAddForm(false)} onSuccess={fetchInternships} />}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {internships.map((internship) => (
                  <tr key={internship._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">{internship.title}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{internship.companyId?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{internship.location}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                        internship.compensationType === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {internship.compensationType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                        internship.status === 'Open'
                          ? 'bg-green-50 text-green-700'
                          : internship.status === 'Draft'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {internship.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={internship.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                          title="View Link"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Add Internship Form
// ═══════════════════════════════════════════════════════════════════════════

function AddInternshipForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    companyId: '',
    location: '',
    duration: '',
    mode: 'On-site',
    compensationType: 'Paid',
    stipend: '',
    certificateType: 'Soft Copy',
    requiredSkills: '',
    description: '',
    applicationUrl: '',
    startingDate: '',
    applicationDeadline: '',
  });
  const [companies, setCompanies] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Fetching companies...');
    console.log('Auth token:', localStorage.getItem('token') ? 'Present' : 'Missing');
    
    setLoading(true);
    api.get('/admin/companies')
      .then(({ data }) => {
        console.log('Companies fetched successfully:', data);
        console.log('Number of companies:', data.companies?.length);
        setCompanies(data.companies || []);
        
        if (!data.companies || data.companies.length === 0) {
          console.warn('No companies returned from API!');
          alert('No companies found. Please contact administrator.');
        }
      })
      .catch(err => {
        console.error('Error fetching companies:', err);
        console.error('Error response:', err.response?.data);
        console.error('Error status:', err.response?.status);
        alert('Failed to load companies: ' + (err.response?.data?.message || err.message) + '\nPlease check browser console for details.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    console.log('Form Data:', formData);

    try {
      const payload = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        stipend: formData.compensationType === 'Paid' ? parseFloat(formData.stipend) || 0 : 0,
      };

      console.log('Payload to send:', payload);

      const response = await api.post('/admin/internships', payload);
      console.log('Success response:', response);
      
      alert('Internship added successfully! All students have been notified.');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding internship:', error);
      console.error('Error response:', error.response?.data);
      alert('Failed to add internship: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">Add New Internship</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
            <XCircle size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., Software Development Intern" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Company *</label>
              <select name="companyId" value={formData.companyId} onChange={handleChange} required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                disabled={loading}>
                <option value="">{loading ? 'Loading companies...' : 'Select Company'}</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.companyName} {c.verified_status === 'approved' ? '✓' : ''}
                  </option>
                ))}
              </select>
              {companies.length === 0 && !loading && (
                <p className="text-xs text-red-600 mt-1">No companies available. Please add companies first.</p>
              )}
              {loading && (
                <p className="text-xs text-slate-500 mt-1">Loading companies from database...</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Location *</label>
              <select name="location" value={formData.location} onChange={handleChange} required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
                <option value="">Select Location</option>
                {['Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi', 'Noida', 'Remote'].map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Duration *</label>
              <input type="text" name="duration" value={formData.duration} onChange={handleChange} required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., 3 months" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Mode *</label>
              <select name="mode" value={formData.mode} onChange={handleChange} required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Compensation *</label>
              <select name="compensationType" value={formData.compensationType} onChange={handleChange} required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>

            {formData.compensationType === 'Paid' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Stipend (₹/month) *</label>
                <input type="number" name="stipend" value={formData.stipend} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., 15000" />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Certificate *</label>
              <select name="certificateType" value={formData.certificateType} onChange={handleChange} required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
                <option value="Soft Copy">Soft Copy</option>
                <option value="Hard Copy">Hard Copy</option>
                <option value="Both">Both</option>
                <option value="Not Provided">Not Provided</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Starting Date *</label>
              <input type="date" name="startingDate" value={formData.startingDate} onChange={handleChange} required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Deadline *</label>
              <input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Application URL *</label>
            <input type="url" name="applicationUrl" value={formData.applicationUrl} onChange={handleChange} required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              placeholder="https://company.com/careers/apply" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Required Skills (comma-separated) *</label>
            <input type="text" name="requiredSkills" value={formData.requiredSkills} onChange={handleChange} required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g., JavaScript, React, Node.js" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter internship description..." />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={onClose}
              className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="px-6 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">
              {submitting ? 'Adding...' : 'Add Internship'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Users View
// ═══════════════════════════════════════════════════════════════════════════

function UsersView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users')
      .then(({ data }) => setUsers(data.users || []))
      .catch(err => console.error('Error fetching users:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Manage Users</h2>
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Utility Components
// ═══════════════════════════════════════════════════════════════════════════

function LoadingSpinner() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent mx-auto" />
      <p className="mt-4 text-slate-500">Loading...</p>
    </div>
  );
}

function EmptyState({ icon: Icon, message }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
      <Icon size={48} className="mx-auto text-slate-300 mb-4" />
      <p className="text-slate-500">{message}</p>
    </div>
  );
}
