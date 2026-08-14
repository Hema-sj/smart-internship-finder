import { useMemo, useState } from 'react';
import InternshipSearch from '../components/InternshipSearch';
import InternshipTable from '../components/InternshipTable';
import { internships } from '../data/internships';

export default function InternshipListPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');

  const filtered = useMemo(
    () =>
      internships.filter(
        (i) =>
          (type === 'All' || i.type === type) &&
          `${i.title} ${i.company} ${i.skills.join(' ')}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [query, type]
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">Browse</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-800">All Internships</h1>
        <p className="mt-2 text-slate-500">Explore and filter engineering internship opportunities.</p>
      </div>
      <InternshipSearch query={query} setQuery={setQuery} type={type} setType={setType} />
      <InternshipTable internships={filtered} title="Internship Listings" />
    </div>
  );
}
