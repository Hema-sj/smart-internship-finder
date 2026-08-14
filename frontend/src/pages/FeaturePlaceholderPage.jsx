export default function FeaturePlaceholderPage({ title, description }) {
  return <section className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-8"><p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">Student workspace</p><h1 className="mt-3 text-3xl font-bold">{title}</h1><p className="mt-3 text-slate-600">{description}</p><p className="mt-6 text-sm text-slate-500">This feature is ready for implementation in the next phase.</p></section>;
}
