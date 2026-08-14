import { Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() { return <Routes><Route element={<AppLayout />}><Route path="/" element={<HomePage />} /></Route><Route path="*" element={<NotFoundPage />} /></Routes>; }
