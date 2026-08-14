import { Bookmark, FileText, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const cards = [[Sparkles, 'Recommended internships', 'Set your skills to get your first matches.'], [FileText, 'Resume', 'Upload a resume for AI-powered skill extraction.'], [Bookmark, 'Saved internships', 'Save promising opportunities to revisit them.']];
  return <section><p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">Student dashboard</p><h1 className="mt-3 text-4xl font-bold">Hi, {user.name.split(' ')[0]}.</h1><p className="mt-3 text-slate-600">Your personalized internship workspace is ready.</p><div className="mt-8 grid gap-4 md:grid-cols-3">{cards.map(([Icon, title, copy]) => <article key={title} className="rounded-xl border border-slate-200 bg-white p-5"><Icon className="text-emerald-700"/><h2 className="mt-5 font-bold">{title}</h2><p className="mt-2 text-sm text-slate-600">{copy}</p></article>)}</div></section>;
}
