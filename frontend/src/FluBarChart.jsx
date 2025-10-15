// frontend/src/FluBarChart.jsx
import { Typography, Paper } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

function FluBarChart({ fluData, title, xKey, yKey, yLabel, barColor }) {
  return (
    <Paper sx={{ p: 3, minHeight: 350 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart
          data={fluData}
          margin={{ top: 20, right: 30, left: 100, bottom: 70 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xKey}
            angle={-30}
            textAnchor="end"
            interval={0}
            tickFormatter={(label) => {
              if (typeof label === "string") {
                // remove trailing year if present
                return label.replace(/, \d{4}$/, "");
              }
              return label;
            }}
          />
          <YAxis>
            <Label
              value={yLabel}
              angle={-90}
              position="insideLeft"
              offset={-50}
            />
          </YAxis>
          <Tooltip />
          <Bar dataKey={yKey} fill={barColor} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default FluBarChart;








 
 
