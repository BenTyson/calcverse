import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getCategoryColors, type ChartCategory } from '../../../lib/utils/chart-colors';
import { formatCurrency } from '../../../lib/utils/formatters';

interface DonutChartDataItem {
  label: string;
  value: number;
}

interface DonutChartProps {
  data: DonutChartDataItem[];
  category?: ChartCategory;
  formatValue?: (value: number) => string;
  innerLabel?: string;
  innerValue?: string;
  height?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: DonutChartDataItem;
  }>;
  formatter: (value: number) => string;
}

function CustomTooltip({ active, payload, formatter }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-white rounded-lg shadow-lg border border-neutral-100 px-3 py-2">
      <p className="text-sm font-medium text-neutral-900">{item.payload.label}</p>
      <p className="text-sm text-neutral-600">{formatter(item.value)}</p>
    </div>
  );
}

export function DonutChart({
  data,
  category = 'freelance',
  formatValue = formatCurrency,
  innerLabel,
  innerValue,
  height = 280,
}: DonutChartProps) {
  const validData = data.filter((d) => d.value > 0);
  if (validData.length === 0) return null;

  const colors = getCategoryColors(category);

  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={validData}
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="80%"
            dataKey="value"
            nameKey="label"
            strokeWidth={0}
          >
            {validData.map((_, index) => (
              <Cell
                key={index}
                fill={colors.shades[index % colors.shades.length]}
              />
            ))}
          </Pie>
          <Tooltip
            content={<CustomTooltip formatter={formatValue} />}
          />
          {(innerLabel || innerValue) && (
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {innerValue && (
                <tspan
                  x="50%"
                  dy={innerLabel ? '-0.4em' : '0'}
                  className="text-lg font-bold"
                  fill="#1c1917"
                  fontSize={20}
                  fontWeight={700}
                >
                  {innerValue}
                </tspan>
              )}
              {innerLabel && (
                <tspan
                  x="50%"
                  dy={innerValue ? '1.4em' : '0'}
                  fill="#78716c"
                  fontSize={13}
                >
                  {innerLabel}
                </tspan>
              )}
            </text>
          )}
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-2">
        {validData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{
                backgroundColor: colors.shades[index % colors.shades.length],
              }}
            />
            <span className="text-sm text-neutral-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
