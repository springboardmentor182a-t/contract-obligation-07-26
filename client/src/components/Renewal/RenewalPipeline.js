import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const defaultPipeline = [
  { month: "Jul", contracts: 0 },
  { month: "Aug", contracts: 0 },
  { month: "Sep", contracts: 0 },
  { month: "Oct", contracts: 0 },
  { month: "Nov", contracts: 0 },
  { month: "Dec", contracts: 0 },
];

export default function RenewalPipeline({ data }) {
  const pipelineData = Array.isArray(data) && data.length ? data : defaultPipeline;

  return (
    <section className="renewal-card renewal-card--pipeline">
      <div className="section-heading">
        <div>
          <h2>Renewal Pipeline</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">Upcoming renewal volume by month</p>
        </div>
      </div>

      <div className="chart-wrapper chart-wrapper--compact">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={pipelineData} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
            <CartesianGrid stroke="#E5E7EB" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} stroke="#94A3B8" />
            <YAxis axisLine={false} tickLine={false} stroke="#94A3B8" tickCount={5} domain={[0, 'dataMax']} padding={{ top: 0.05, bottom: 0.02 }} />
            <Tooltip
              cursor={{ fill: "rgba(59, 130, 246, 0.08)" }}
              contentStyle={{
                borderRadius: 16,
                border: "1px solid #E2E8F0",
                boxShadow: "0 18px 36px rgba(15, 23, 42, 0.08)",
              }}
            />
            <Legend verticalAlign="top" align="right" height={36} />
            <Bar dataKey="contracts" name="Renewals Due" fill="#2563EB" radius={[12, 12, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}


