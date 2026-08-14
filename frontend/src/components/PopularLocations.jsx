import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { popularLocations } from '../data/internships';
export default function PopularLocations() { return <section><h2 className="text-2xl font-bold">Popular Locations</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{popularLocations.map(location => <Link key={location} to={`/internships?location=${encodeURIComponent(location)}`} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-400 hover:shadow-sm"><MapPin className="text-emerald-700" size={19}/><span className="font-semibold">{location}</span></Link>)}</div></section>; }
