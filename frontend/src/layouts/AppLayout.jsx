import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

export default function AppLayout() { return <div><Header /><main className="mx-auto max-w-6xl px-6 py-12"><Outlet /></main></div>; }
