// frontend/src/FluLineChart.jsx
import {
  LineChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label
} from "recharts";
import { Paper, Typography, Box } from "@mui/material";

function FluLineChart({ data, title, xKey, yKey, yLabel, lineColor, baseline = null }) {
  console.log("baseline received in FluLineChart:", baseline);

  return (
    <Paper sx={{ p: 3, minHeight: 200 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ overflowX: "auto" }}>
        <ResponsiveContainer width="100%" height={360}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 90, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={xKey}
              angle={-45}
              textAnchor="end"
              interval={0}
              tickFormatter={(label) => {
                if (typeof label === "string") {
                  return label.replace(/, \d{4}$/, ""); // drop year if present
                }
                return label;
              }}
            />
            <YAxis
              // ✅ Use callback form so the axis always includes the baseline
              domain={[
                0,
                (max) => Math.max(max ?? 0, baseline ?? 0)
              ]}
            >
              <Label
                value={yLabel}
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
                offset={-30}
              />
            </YAxis>
            <Tooltip />
            <Line
              type="monotone"
              dataKey={yKey}
              stroke={lineColor}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            {/* ✅ Optional baseline line */}
            {baseline !== null && (
              <ReferenceLine
                y={baseline}
                stroke="#8884d8"
                strokeDasharray="5 5"
                label={{ value: `2023-2024 wILI Average (${baseline}%)`, position: "top" }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

export default FluLineChart;



