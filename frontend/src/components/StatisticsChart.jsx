import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [{ city: 'Bengaluru', roles: 420 }, { city: 'Hyderabad', roles: 310 }, { city: 'Pune', roles: 245 }, { city: 'Remote', roles: 380 }];

export default function StatisticsChart() { return <div className="h-56 rounded-xl border border-slate-200 bg-white p-4"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><XAxis dataKey="city" fontSize={11} tickLine={false} axisLine={false} /><YAxis fontSize={11} tickLine={false} axisLine={false} /><Tooltip cursor={{ fill: '#ecfdf5' }} /><Bar dataKey="roles" fill="#047857" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div>; }
