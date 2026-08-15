import { useEffect, useState } from 'react';
import { getResources } from '../services/studentService';
import { BookOpen, ExternalLink, Loader2, Filter } from 'lucide-react';

const LEVEL_STYLES = {
  beginner:     'bg-green-50 text-green-700 border-green-200',
  intermediate: 'bg-blue-50 text-blue-700 border-blue-200',
  advanced:     'bg-purple-50 text-purple-700 border-purple-200',
};

const PLATFORM_ICONS = {
  YouTube:  '🎥',
  Coursera: '🎓',
  Udemy:    '📚',
  freeCodeCamp: '💻',
  edX:      '🏛️',
};

function ResourceCard({ resource }) {
  const icon = PLATFORM_ICONS[resource.platform] || '📖';
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-md hover:border-emerald-200 transition group"
    >
      <div className="text-3xl shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition truncate">{resource.title}</h3>
        <div className="flex items-center gap-2 mt-1.5">
          {resource.platform && <span className="text-xs text-slate-400">{resource.platform}</span>}
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${LEVEL_STYLES[resource.level] || 'bg-slate-100 text-slate-600'}`}>
            {resource.level}
          </span>
          {resource.skill?.name && (
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              {resource.skill.name}
            </span>
          )}
        </div>
      </div>
      <ExternalLink size={16} className="text-slate-300 group-hover:text-emerald-500 shrink-0 transition" />
    </a>
  );
}

const FEATURED = [
  { title: 'React for Beginners', platform: 'YouTube', url: '#', level: 'beginner',     skill: { name: 'React' } },
  { title: 'Python Full Course', platform: 'freeCodeCamp', url: '#', level: 'beginner', skill: { name: 'Python' } },
  { title: 'Node.js & Express',  platform: 'Udemy',   url: '#', level: 'intermediate', skill: { name: 'Node.js' } },
  { title: 'MongoDB Crash Course',platform: 'YouTube', url: '#', level: 'beginner',     skill: { name: 'MongoDB' } },
  { title: 'Machine Learning A–Z',platform: 'Coursera', url: '#', level: 'advanced',   skill: { name: 'ML' } },
  { title: 'UI/UX Design Basics', platform: 'edX',    url: '#', level: 'beginner',     skill: { name: 'Design' } },
].map((r, i) => ({ ...r, _id: `featured-${i}` }));

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [level, setLevel]         = useState('');

  useEffect(() => {
    getResources(level ? { level } : {})
      .then(data => setResources(data.length > 0 ? data : FEATURED))
      .catch(() => setResources(FEATURED))
      .finally(() => setLoading(false));
  }, [level]);

  const levels = ['', 'beginner', 'intermediate', 'advanced'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Learning Resources</h1>
        <p className="text-slate-500 text-sm mt-1">Curated courses and tutorials to build your internship skills.</p>
      </div>

      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex items-center gap-5">
        <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
          <BookOpen size={28} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold">Skill up, stand out</h2>
          <p className="text-sm text-white/80 mt-1">Our AI analyzes top internship requirements and recommends resources tailored to close your skill gaps.</p>
        </div>
      </div>

      {/* Level filter */}
      <div className="flex items-center gap-3">
        <Filter size={16} className="text-slate-400" />
        <div className="flex gap-2">
          {levels.map(l => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold border capitalize transition ${
                level === l
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
              }`}
            >
              {l || 'All Levels'}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="space-y-3">
          {resources.map(r => <ResourceCard key={r._id} resource={r} />)}
        </div>
      )}
    </div>
  );
}
