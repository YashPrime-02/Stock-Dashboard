import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Charts({ data }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data}>
        {/* 🔥 Gradient */}
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Clean grid */}
        <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />

        {/* Clean X axis */}
        <XAxis
          dataKey="date"
          tick={{ fill: "#64748b", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />

        {/* Clean Y axis */}
        <YAxis
          tick={{ fill: "#64748b", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          domain={["auto", "auto"]}
        />

        {/* Tooltip */}
        <Tooltip
          contentStyle={{
            backgroundColor: "#020617",
            border: "1px solid #334155",
            borderRadius: "8px",
          }}
          formatter={(value) => `₹ ${value.toLocaleString()}`}
        />

        {/* 🔥 Smooth line + glow */}
        <Line
          type="monotone"
          dataKey="price"
          stroke="#38bdf8"
          strokeWidth={2}
          dot={false}
          fill="url(#colorPrice)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}