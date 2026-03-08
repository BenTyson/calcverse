import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { getCategoryColors, type ChartCategory } from '../../../lib/utils/chart-colors';
import { formatCompactNumber, formatCurrency } from '../../../lib/utils/formatters';

interface ProjectionDataPoint {
  label: string;
  [key: string]: string | number;
}

interface LineConfig {
  dataKey: string;
  label: string;
  color?: string;
  dashed?: boolean;
  areaFill?: boolean;
}

interface ProjectionChartProps {
  data: ProjectionDataPoint[];
  lines: LineConfig[];
  category?: ChartCategory;
  formatValue?: (value: number) => string;
  height?: number;
  goalLine?: {
    value: number;
    label: string;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
  formatter: (value: number) => string;
  lineConfigs: LineConfig[];
}

function CustomTooltip({ active, payload, label, formatter, lineConfigs }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-neutral-100 px-3 py-2">
      <p className="text-sm font-medium text-neutral-900 mb-1">{label}</p>
      {payload.map((entry, index) => {
        const config = lineConfigs.find((l) => l.dataKey === entry.dataKey);
        return (
          <div key={index} className="flex items-center gap-2 text-sm">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-neutral-600">
              {config?.label ?? entry.name}: {formatter(entry.value)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function ProjectionChart({
  data,
  lines,
  category = 'freelance',
  formatValue = formatCurrency,
  height = 300,
  goalLine,
}: ProjectionChartProps) {
  const colors = getCategoryColors(category);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <defs>
          {lines.map((line, index) => {
            const color = line.color ?? colors.shades[index % colors.shades.length];
            return (
              <linearGradient
                key={line.dataKey}
                id={`fill-${line.dataKey}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={color} stopOpacity={0.15} />
                <stop offset="100%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            );
          })}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#78716c', fontSize: 13 }}
          axisLine={{ stroke: '#e7e5e4' }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={formatCompactNumber}
          tick={{ fill: '#78716c', fontSize: 13 }}
          axisLine={false}
          tickLine={false}
          width={50}
        />
        <Tooltip
          content={<CustomTooltip formatter={formatValue} lineConfigs={lines} />}
        />
        {goalLine && (
          <ReferenceLine
            y={goalLine.value}
            stroke="#a8a29e"
            strokeDasharray="6 4"
            label={{
              value: goalLine.label,
              position: 'insideTopRight',
              fill: '#78716c',
              fontSize: 12,
            }}
          />
        )}
        {lines.map((line, index) => {
          const color = line.color ?? colors.shades[index % colors.shades.length];
          return (
            <Area
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.label}
              stroke={color}
              strokeWidth={2}
              strokeDasharray={line.dashed ? '6 4' : undefined}
              fill={line.areaFill ? `url(#fill-${line.dataKey})` : 'transparent'}
              fillOpacity={1}
            />
          );
        })}
      </AreaChart>
    </ResponsiveContainer>
  );
}
