import { useEffect, useState } from 'react';
import { BrainCircuit, MapPin, Upload } from 'lucide-react';
import api from '../services/api';
import ServiceStatus from '../components/ServiceStatus';

export default function HomePage() {
  const [status, setStatus] = useState('Checking backend connection…');
  useEffect(() => { api.get('/health').then(({ data }) => setStatus(data.message)).catch(() => setStatus('Backend is offline — start the Express service on port 5000.')); }, []);
  return <section className="grid gap-10 lg:grid-cols-[1.3fr_.7fr] lg:items-center"><div><p className="mb-4 text-sm font-semibold uppercase tracking-widest text-emerald-700">Built for engineering students</p><h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Find internships that fit your skills.</h1><p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">Upload a resume, select a location, and receive focused internship recommendations with practical skill-gap guidance.</p><div className="mt-8 flex flex-wrap gap-3"><button className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white"><Upload size={18} /> Upload resume</button><button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold"><MapPin size={18} /> Choose location</button></div><ServiceStatus status={status} /></div><aside className="rounded-2xl bg-slate-900 p-7 text-white shadow-xl"><BrainCircuit className="text-emerald-300" size={32}/><h2 className="mt-5 text-2xl font-bold">Phase one foundation</h2><ul className="mt-5 space-y-3 text-sm text-slate-300"><li>• Resume-ready student profile</li><li>• Paid and unpaid opportunity matching</li><li>• Dream Company skill analysis</li></ul></aside></section>;
}
