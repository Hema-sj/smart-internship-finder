import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { fetchInternshipById } from '../services/internshipService';
import InternshipDetailModal from '../components/InternshipDetailModal';

export default function InternshipDetailPage() {
  const { id } = useParams();
  const [internship, setInternship] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchInternshipById(id)
      .then((data) => { if (!cancelled) setInternship(data); })
      .catch((err) => { if (!cancelled) setError(err.response?.data?.message || 'Internship not found.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500">
        <Loader2 className="animate-spin" size={22} />
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <p className="font-bold text-slate-800">{error || 'Internship not found.'}</p>
        <Link to="/internships" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
          <ArrowLeft size={14} /> Back to listings
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/internships" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
        <ArrowLeft size={14} /> Back to listings
      </Link>
      <InternshipDetailModal internship={internship} onClose={() => window.history.back()} />
    </div>
  );
}
