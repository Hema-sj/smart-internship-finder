import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-slate-200">404</h1>
          <h2 className="text-3xl font-bold text-slate-900 mt-4">Page Not Found</h2>
          <p className="text-slate-600 mt-2">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
        
        <div className="mt-8">
          <Link
            to="/dashboard"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Go to Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}
