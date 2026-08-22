"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface TimelinePoint {
  date: string;
  hours: number;
}

export function BalanceTimelineChart({ data }: { data: TimelinePoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d9488" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} />
          <YAxis
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
            width={40}
            tickFormatter={(v) => `${v}h`}
          />
          <Tooltip
            formatter={(value) => [`${Number(value).toFixed(1)} hrs`, "Balance"]}
            contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0", fontSize: 12 }}
          />
          <Area type="monotone" dataKey="hours" stroke="#0d9488" strokeWidth={2} fill="url(#balanceFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
