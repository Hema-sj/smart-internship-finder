import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AppLayout() { return <div><Navbar /><main className="mx-auto max-w-7xl px-5 py-10"><Outlet /></main></div>; }
