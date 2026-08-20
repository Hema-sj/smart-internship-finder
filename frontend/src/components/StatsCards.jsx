import { useEffect, useState } from 'react';
import { fetchInternshipStats } from '../services/internshipService';

const FALLBACK = [
  ['—', 'Total Internships'],
  ['—', 'Paid Internships'],
  ['—', 'Unpaid Internships'],
  ['9', 'Locations'],
  ['—', 'Companies'],
];

export default function StatsCards() {
  const [stats, setStats] = useState(FALLBACK);

  useEffect(() => {
    fetchInternshipStats()
      .then((data) => {
        setStats([
          [String(data.total ?? 0), 'Total Internships'],
          [String(data.paid ?? 0), 'Paid Internships'],
          [String(data.unpaid ?? 0), 'Unpaid Internships'],
          [String((data.topLocations || []).length || 9), 'Locations'],
          [String((data.topCourses || []).length || 0), 'Courses'],
        ]);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map(([value, label]) => (
        <article key={label} className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-2xl font-bold text-emerald-700">{value}</p>
          <p className="mt-1 text-xs font-medium text-slate-600">{label}</p>
        </article>
      ))}
    </section>
  );
}
