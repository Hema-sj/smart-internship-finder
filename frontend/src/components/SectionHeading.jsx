export default function SectionHeading({ eyebrow, title, copy }) {
  return <div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">{eyebrow}</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{title}</h2>{copy && <p className="mt-3 leading-7 text-slate-600">{copy}</p>}</div>;
}
