import { Link } from 'react-router-dom';
import { User, Shield } from 'lucide-react';

export default function LoginChoicePage() {
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">Welcome</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Choose Login Type</h1>
          <p className="mt-2 text-sm text-slate-600">Select how you want to access the platform</p>
        </div>

        <div className="space-y-4">
          {/* User Login Button */}
          <Link
            to="/login"
            className="flex items-center gap-4 p-6 rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
              <User size={28} className="text-emerald-700" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                User Login
              </h3>
              <p className="text-sm text-slate-600">
                Access your student dashboard and internships
              </p>
            </div>
          </Link>

          {/* Admin Login Button */}
          <Link
            to="/admin/login"
            className="flex items-center gap-4 p-6 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 group-hover:bg-blue-200 transition-colors">
              <Shield size={28} className="text-blue-700" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                Admin Login
              </h3>
              <p className="text-sm text-slate-600">
                Access admin dashboard and manage system
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            New user?{' '}
            <Link to="/register" className="font-semibold text-emerald-700 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
