import { Briefcase, IndianRupee, Award } from 'lucide-react';

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <article className={`rounded-2xl border p-5 ${accent}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-3xl font-extrabold">{value}</p>
          <p className="mt-1 text-sm font-semibold opacity-80">{label}</p>
        </div>
        <div className="rounded-xl bg-white/60 p-2.5">
          <Icon size={20} />
        </div>
      </div>
    </article>
  );
}

export default function CompensationStatsCards({ total = 0, paid = 0, unpaid = 0, loading = false }) {
  const format = (value) => (loading ? '—' : Number(value).toLocaleString('en-IN'));

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatCard
        icon={Briefcase}
        label="Total Internships"
        value={format(total)}
        accent="border-slate-200 bg-white text-slate-900"
      />
      <StatCard
        icon={IndianRupee}
        label="Paid Internships"
        value={format(paid)}
        accent="border-emerald-200 bg-emerald-50 text-emerald-900"
      />
      <StatCard
        icon={Award}
        label="Unpaid Internships"
        value={format(unpaid)}
        accent="border-orange-200 bg-orange-50 text-orange-900"
      />
    </section>
  );
}
