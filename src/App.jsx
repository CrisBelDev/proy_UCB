import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const colors = {
  feliz: "#00C49F",
  neutral: "#FFBB28",
  estresado: "#FF8042",
  cansado: "#8884d8"
};

export default function Dashboard() {
  const [emotionData, setEmotionData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/emociones") // Aquí tu backend o servicio
      .then((res) => res.json())
      .then((data) => setEmotionData(data));
  }, []);

  // Agrupar emociones
  const emotionCounts = emotionData.reduce((acc, item) => {
    acc[item.emocion] = (acc[item.emocion] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(emotionCounts).map(([key, value]) => ({
    name: key,
    value,
  }));

  const lineData = emotionData.map((item) => ({
    time: new Date(item.timestamp).toLocaleString(),
    emocion: item.emocion,
  }));

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">Estado Emocional del Personal</h1>

      <div className="flex gap-8">
        <PieChart width={300} height={300}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[entry.name]} />
            ))}
          </Pie>
        </PieChart>

        <BarChart width={400} height={300} data={pieData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8">
            {pieData.map((entry, index) => (
              <Cell key={`bar-${index}`} fill={colors[entry.name]} />
            ))}
          </Bar>
        </BarChart>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Historial Temporal</h2>
        <LineChart width={800} height={300} data={lineData}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="emocion" stroke="#82ca9d" />
        </LineChart>
      </div>
    </div>
  );
}
