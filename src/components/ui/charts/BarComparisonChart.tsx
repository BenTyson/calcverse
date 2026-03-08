import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getCategoryColors, type ChartCategory } from '../../../lib/utils/chart-colors';
import { formatCompactNumber, formatCurrency } from '../../../lib/utils/formatters';

interface BarComparisonDataItem {
  label: string;
  [key: string]: string | number;
}

interface BarConfig {
  dataKey: string;
  label: string;
  color?: string;
}

interface BarComparisonChartProps {
  data: BarComparisonDataItem[];
  bars: BarConfig[];
  category?: ChartCategory;
  formatValue?: (value: number) => string;
  stacked?: boolean;
  height?: number;
  showGrid?: boolean;
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
  barConfigs: BarConfig[];
}

function CustomTooltip({ active, payload, label, formatter, barConfigs }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-neutral-100 px-3 py-2">
      <p className="text-sm font-medium text-neutral-900 mb-1">{label}</p>
      {payload.map((entry, index) => {
        const config = barConfigs.find((b) => b.dataKey === entry.dataKey);
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

export function BarComparisonChart({
  data,
  bars,
  category = 'freelance',
  formatValue = formatCurrency,
  stacked = false,
  height = 300,
  showGrid = true,
}: BarComparisonChartProps) {
  const colors = getCategoryColors(category);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
        )}
        <XAxis
          dataKey="label"
          tick={{ fill: '#78716c', fontSize: 13 }}
          axisLine={{ stroke: '#e7e5e4' }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatCompactNumber}
          tick={{ fill: '#78716c', fontSize: 13 }}
          axisLine={false}
          tickLine={false}
          width={50}
        />
        <Tooltip
          content={<CustomTooltip formatter={formatValue} barConfigs={bars} />}
        />
        {bars.map((bar, index) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.label}
            fill={bar.color ?? colors.shades[index % colors.shades.length]}
            radius={[4, 4, 0, 0]}
            {...(stacked ? { stackId: 'stack' } : {})}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
