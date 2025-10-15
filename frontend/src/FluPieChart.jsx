// frontend/src/FluPieChart.jsx
import { Paper, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

// A set of fallback colors if none are passed
const DEFAULT_COLORS = [
  "#2196F3", // blue
  "#4CAF50", // green
  "#E53935", // red
  "#FF9800", // orange
  "#9C27B0", // purple
  "#00ACC1", // teal
  "#8BC34A", // light green
  "#FDD835", // yellow
];

function FluPieChart({ data, title, dataKey = "count", nameKey = "label", colors }) {
  const chartColors = colors || DEFAULT_COLORS;

  return (
    <Paper sx={{ p: 3, minHeight: 350 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={360}>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={chartColors[index % chartColors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default FluPieChart;
