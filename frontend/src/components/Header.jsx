import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() { return <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex h-16 max-w-6xl items-center px-6"><Link to="/" className="flex items-center gap-2 font-bold text-emerald-700"><GraduationCap size={24} /> Smart Internship Finder</Link><span className="ml-auto text-sm text-slate-500">Engineering careers, intelligently matched.</span></div></header>; }
