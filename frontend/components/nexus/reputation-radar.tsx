import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import type { Agent } from "@/lib/nexus-data";
import { DOMAINS } from "@/lib/nexus-data";

export function ReputationRadar({ agent, mini = false }: { agent: Agent; mini?: boolean }) {
  const data = DOMAINS.map((d) => ({
    domain: d,
    value: agent.scores[d].value,
    confidence: agent.scores[d].confidence * 100,
  }));
  return (
    <div className={mini ? "h-[120px] w-full" : "h-[320px] w-full"}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="78%">
          <PolarGrid stroke="oklch(0.3 0.008 270)" />
          <PolarAngleAxis
            dataKey="domain"
            tick={{ fill: "oklch(0.65 0.01 270)", fontSize: 10, fontFamily: "JetBrains Mono" }}
          />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Confidence floor"
            dataKey="confidence"
            stroke="oklch(0.65 0.18 250)"
            fill="oklch(0.65 0.18 250)"
            fillOpacity={0.08}
            strokeOpacity={0.4}
            strokeDasharray="3 3"
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke="oklch(0.72 0.17 158)"
            fill="oklch(0.72 0.17 158)"
            fillOpacity={0.25}
            strokeWidth={1.5}
            isAnimationActive
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
