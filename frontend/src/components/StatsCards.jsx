import { useEffect, useState } from 'react';
import { fetchInternshipStats } from '../services/internshipService';

export default function StatsCards() {
  const [stats, setStats] = useState({ total: 0, paid: 0, unpaid: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternshipStats()
      .then((data) => {
        setStats({
          total: data.total ?? 0,
          paid: data.paid ?? 0,
          unpaid: data.unpaid ?? 0,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { value: stats.total, label: 'Total Internships', color: 'text-emerald-700' },
    { value: stats.paid, label: 'Paid Internships', color: 'text-emerald-700' },
    { value: stats.unpaid, label: 'Unpaid Internships', color: 'text-orange-600' },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-3">
      {cards.map(({ value, label, color }) => (
        <article key={label} className="rounded-xl border border-slate-200 bg-white p-5">
          <p className={`text-2xl font-bold ${color}`}>
            {loading ? '—' : Number(value).toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-600">{label}</p>
        </article>
      ))}
    </section>
  );
}
