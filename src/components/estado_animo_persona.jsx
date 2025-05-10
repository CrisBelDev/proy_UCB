import React, { useEffect, useState } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { Card } from "react-bootstrap";

const emociones = ["feliz", "neutral", "estresado", "cansado"];
const colores = {
	feliz: "#00C49F",
	neutral: "#FFBB28",
	estresado: "#FF8042",
	cansado: "#8884d8",
};

// Función para generar una hora simulada
function generarTimestamp(baseDate, minutosExtra) {
	const nuevaFecha = new Date(baseDate.getTime() + minutosExtra * 60000);
	return nuevaFecha.toISOString();
}

export default function EstadoAnimoPersona() {
	const [simulacion, setSimulacion] = useState([]);

	useEffect(() => {
		const base = new Date();
		const datosSimulados = [];

		for (let i = 0; i < 10; i++) {
			const emocionAleatoria =
				emociones[Math.floor(Math.random() * emociones.length)];

			datosSimulados.push({
				timestamp: generarTimestamp(base, i * 30),
				emocion: emocionAleatoria,
			});
		}

		setSimulacion(datosSimulados);
	}, []);

	const lineData = simulacion.map((item) => ({
		time: new Date(item.timestamp).toLocaleTimeString(),
		emocion: item.emocion,
	}));

	return (
		<div className="container py-4">
			<h2 className="mb-4">Simulación de Estado de Ánimo</h2>

			<Card className="mb-4 shadow-sm">
				<Card.Body>
					<Card.Title className="mb-3">Historial de emociones</Card.Title>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={lineData}>
							<XAxis dataKey="time" />
							<YAxis dataKey="emocion" />
							<Tooltip />
							<Legend />
							{emociones.map((emo) => (
								<Line
									key={emo}
									type="monotone"
									dataKey={(d) => (d.emocion === emo ? emo : null)}
									name={emo}
									stroke={colores[emo]}
									isAnimationActive={false}
									dot={false}
								/>
							))}
						</LineChart>
					</ResponsiveContainer>
				</Card.Body>
			</Card>

			<Card className="shadow-sm">
				<Card.Body>
					<Card.Title className="mb-3">Datos simulados</Card.Title>
					<table className="table table-bordered">
						<thead>
							<tr>
								<th>#</th>
								<th>Hora</th>
								<th>Emoción</th>
							</tr>
						</thead>
						<tbody>
							{simulacion.map((item, index) => (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>{new Date(item.timestamp).toLocaleTimeString()}</td>
									<td>
										<span
											className="badge"
											style={{ backgroundColor: colores[item.emocion] }}
										>
											{item.emocion}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</Card.Body>
			</Card>
		</div>
	);
}
