import React, { useEffect, useState } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	PieChart,
	Pie,
	Cell,
	LineChart,
	Line,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { HomeIcon, BarChart3, Activity, LogOut, User } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const colors = {
	feliz: "#00C49F",
	neutral: "#FFBB28",
	estresado: "#FF8042",
	cansado: "#8884d8",
	sad: "#888888",
};

export default function Dashboard() {
	const [emotionData, setEmotionData] = useState([]);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	useEffect(() => {
		fetch("http://192.168.75.93:8000/emociones")
			.then((res) => res.json())
			.then((data) => setEmotionData(data));
	}, []);

	const filteredData = emotionData.filter((item) => {
		const date = new Date(item.timestamp);
		return (!startDate || date >= startDate) && (!endDate || date <= endDate);
	});

	const emotionCounts = filteredData.reduce((acc, item) => {
		acc[item.emocion] = (acc[item.emocion] || 0) + 1;
		return acc;
	}, {});

	const pieData = Object.entries(emotionCounts).map(([key, value]) => ({
		name: key,
		value,
	}));

	const lineData = filteredData.map((item) => ({
		time: new Date(item.timestamp).toLocaleString(),
		emocion: item.emocion,
	}));

	const generatePDF = () => {
		const input = document.getElementById("report-content");
		html2canvas(input).then((canvas) => {
			const imgData = canvas.toDataURL("image/png");
			const pdf = new jsPDF("p", "mm", "a4");
			const imgProps = pdf.getImageProperties(imgData);
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
			pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
			pdf.save("reporte_emociones.pdf");
		});
	};

	return (
		<div
			style={{
				display: "flex",
				minHeight: "100vh",
				backgroundColor: "#121212",
				color: "#ffffff",
			}}
		>
			<aside
				style={{
					backgroundColor: "#1e1e1e",
					width: "250px",
					padding: "1rem",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
				}}
			>
				<div>
					<div
						style={{
							borderBottom: "1px solid #333",
							paddingBottom: "1rem",
							marginBottom: "1rem",
						}}
					>
						<h1 style={{ color: "#00C49F" }}>Admin</h1>
					</div>
					<nav>
						<NavItem icon={<HomeIcon size={18} />} label="Inicio" />
						<NavItem icon={<BarChart3 size={18} />} label="Dashboard" />
						<NavItem icon={<Activity size={18} />} label="Actividad" />
						<NavItem icon={<User size={18} />} label="Perfil" />
					</nav>
				</div>
				<div style={{ borderTop: "1px solid #333", paddingTop: "1rem" }}>
					<button
						style={{
							color: "#ff4d4f",
							background: "none",
							border: "none",
							display: "flex",
							alignItems: "center",
							gap: "0.5rem",
						}}
					>
						<LogOut size={18} /> Cerrar sesión
					</button>
				</div>
			</aside>

			<main style={{ flexGrow: 1, padding: "2rem" }}>
				<h1 style={{ color: "#ffffff", marginBottom: "2rem" }}>
					Dashboard Emocional
				</h1>

				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "1rem",
						marginBottom: "2rem",
					}}
				>
					<DatePicker
						selected={startDate}
						onChange={setStartDate}
						placeholderText="Desde"
						className="form-control"
						style={{
							backgroundColor: "#2c2c2c",
							color: "#fff",
							border: "1px solid #444",
						}}
					/>
					<DatePicker
						selected={endDate}
						onChange={setEndDate}
						placeholderText="Hasta"
						className="form-control"
						style={{
							backgroundColor: "#2c2c2c",
							color: "#fff",
							border: "1px solid #444",
						}}
					/>
					<button
						onClick={generatePDF}
						style={{
							backgroundColor: "#00C49F",
							color: "#000",
							border: "none",
							padding: "0.5rem 1rem",
							borderRadius: "5px",
						}}
					>
						Generar PDF
					</button>
				</div>

				<div id="report-content">
					<div className="row g-4 mb-4">
						<div className="col-md-6">
							<Card title="Distribución Emocional">
								<ResponsiveContainer width="100%" height={300}>
									<PieChart>
										<Pie
											data={pieData}
											dataKey="value"
											nameKey="name"
											outerRadius={100}
											label
										>
											{pieData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={colors[entry.name]} />
											))}
										</Pie>
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</Card>
						</div>
						<div className="col-md-6">
							<Card title="Conteo por Emoción">
								<ResponsiveContainer width="100%" height={300}>
									<BarChart data={pieData}>
										<XAxis dataKey="name" stroke="#ffffff" />
										<YAxis stroke="#ffffff" />
										<Tooltip />
										<Legend />
										<Bar dataKey="value">
											{pieData.map((entry, index) => (
												<Cell key={`bar-${index}`} fill={colors[entry.name]} />
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</Card>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

const NavItem = ({ icon, label }) => (
	<div
		style={{
			display: "flex",
			alignItems: "center",
			marginBottom: "1rem",
			color: "#ffffff",
			cursor: "pointer",
		}}
	>
		{icon}
		<span style={{ marginLeft: "0.5rem" }}>{label}</span>
	</div>
);

const Card = ({ title, children }) => (
	<div
		style={{
			backgroundColor: "#1f1f1f",
			borderRadius: "0.5rem",
			padding: "1rem",
			marginBottom: "1rem",
			boxShadow: "0 0 10px rgba(0,0,0,0.2)",
		}}
	>
		<h5 style={{ color: "#ffffff", marginBottom: "1rem" }}>{title}</h5>
		{children}
	</div>
);
