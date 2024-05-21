import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  Label,
} from "recharts";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Button } from "react-bootstrap";
import "aos/dist/aos.css";

const LightTheme = {
  textColor: "#333",
  axisLineColor: "#ccc",
  gridLineColor: "#eee",
  barColor: "#8884d8",
  lineColor: "#8884d8",
};

const data = [
  { name: "Jan", uv: 400, pv: 2400, amt: 2400 },
  { name: "Feb", uv: 300, pv: 1398, amt: 2210 },
  { name: "Mar", uv: 200, pv: 9800, amt: 2290 },
  { name: "Apr", uv: 278, pv: 3908, amt: 2000 },
  { name: "May", uv: 189, pv: 4800, amt: 2181 },
  { name: "Jun", uv: 239, pv: 3800, amt: 2500 },
  { name: "Jul", uv: 349, pv: 4300, amt: 2100 },
  { name: "Aug", uv: 200, pv: 2400, amt: 2400 },
  { name: "Sep", uv: 300, pv: 1398, amt: 2210 },
  { name: "Oct", uv: 200, pv: 9800, amt: 2290 },
  { name: "Nov", uv: 278, pv: 3908, amt: 2000 },
  { name: "Dec", uv: 189, pv: 4800, amt: 2181 },
];

function Component() {
  const [csvData, setCsvData] = useState(
    JSON.parse(localStorage.getItem("setCsvData")) || ""
  );
  const [videoPath, setVideoPath] = useState(
    localStorage.getItem("setVideoPath") || ""
  );

  const [analytics, setAnalytics] = useState(
    JSON.parse(localStorage.getItem("analytics")) || ""
  );

  console.log(csvData);

  const result = [];
  csvData.forEach((item) => {
    const startTime = new Date(item.start_time);
    const endTime = item.end_time === 0 ? new Date() : new Date(item.end_time);

    result.push({
      time: startTime,
      state: item.machine_state,
      duration: item.duration,
    });

    if (item.end_time !== 0) {
      result.push({
        time: endTime,
        state: item.machine_state,
        duration: 0,
      });
    }
  });

  const data1 = [
    { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Mar", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Apr", uv: 2780, pv: 3908, amt: 2000 },
    { name: "May", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Jun", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Jul", uv: 3490, pv: 4300, amt: 2100 },
  ];

  const downloadVideo = () => {
    fetch(`http://localhost:5000/output_vid/${videoPath}.mp4`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement("a");
        a.href = url;
        a.download = "video.mp4";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading video:", error);
      });
  };

  const [data, setData] = useState([
    { name: "Running State", value: 100 - analytics.downtime_percentage },
    { name: "Downtime State", value: analytics.downtime_percentage },
  ]);

  const [COLORS, setColors] = useState(["#008000", "#FF0000"]);

  const renderTableHeaders = () => {
    const headers = Object.keys(csvData[0]);
    return headers.map((header, index) => (
      <th
        style={{
          border: "1px solid #ddd",
          paddingTop: "1rem",
          paddingBottom: "1rem",
          textAlign: "center",
          color: "var(--neutral-color)",
        }}
        key={index}
      >
        {header.toUpperCase()}
      </th>
    ));
  };

  const renderTableRows = () => {
    return csvData.map((row, rowIndex) => (
      <tr
        key={rowIndex}
        style={{
          backgroundColor: rowIndex % 2 === 0 ? "#fff" : "#f9f9f9",
          color: "var(--neutral-color)",
        }}
      >
        {Object.values(row).map((value, columnIndex) => (
          <td
            key={columnIndex}
            style={{ padding: "10px", border: "1px solid #ddd" }}
          >
            {value}
          </td>
        ))}
      </tr>
    ));
  };
  const calculateDurationInSeconds = (data) => {
    const durations = {};
    data.forEach((item) => {
      if (item.end_time !== 0) {
        const startTime = new Date(item.start_time).getTime();
        const endTime = new Date(item.end_time).getTime();
        const durationInMilliseconds = endTime - startTime;
        const durationInSeconds = durationInMilliseconds / 1000; // Convert milliseconds to seconds
        durations[item.machine_state] =
          (durations[item.machine_state] || 0) + durationInSeconds;
      }
    });
    return durations;
  };
  const prepareLineChartData = (data) => {
    return data.map((item) => ({
      name: new Date(item.start_time).toLocaleTimeString(),
      machine_state: item.machine_state,
    }));
  };

  const durations = calculateDurationInSeconds(csvData);

  // Prepare data for the pie chart
  const chartData = Object.keys(durations).map((machineState) => ({
    name: machineState,
    value: durations[machineState],
  }));

  // Define colors for each machine state
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const lineChartData = prepareLineChartData(csvData);
  return (
    <div>
      <Header />

      <div className="d-flex flex-column body">
        <div className="main-content">
          {csvData && (
            <div className="csv-table">
              <div className="d-flex justify-content-center mt-2">
                <Button
                  className="selector border-0 px-5"
                  size="lg"
                  onClick={downloadVideo}
                >
                  Download Detection Video
                </Button>
                {/* <button onClick={downloadVideo}>Download Detection Video</button> */}
                {/* <video
                  style={{
                    height: "400px",
                    width: "90%",
                    alignItems: "center",
                  }}
                  src={videoPath}
                  controls
                /> */}
              </div>

              <div className="mt-4 d-flex justify-content-center flex-wrap">
                <div className="m-5 text-center" style={{ width: "100%" }}>
                  <h2
                    // className="text-center"
                    style={{ color: "var(--neutral-color)" }}
                  >
                    Pie Chart
                  </h2>
                  <PieChart
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                    width={600}
                    height={400}
                  >
                    <Pie
                      data={data}
                      cx={250}
                      cy={250}
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                  <PieChart
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                    width={600}
                    height={400}
                  >
                    <Pie
                      dataKey="value"
                      data={chartData}
                      cx={250}
                      cy={250}
                      outerRadius={100}
                      label={({ name, value }) =>
                        `${name}: ${value.toFixed(2)} seconds`
                      }
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[index % colors.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                  <LineChart
                    data={result}
                    width={700}
                    height={400}
                    style={{
                      marginLeft: "auto",
                      marginRight: "auto",
                      marginTop: "5rem",
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      tickFormatter={(tick) =>
                        new Date(tick).toLocaleTimeString()
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(label) =>
                        new Date(label).toLocaleString()
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="duration"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </div>
              </div>
              <h2
                className="mt-4 text-center "
                style={{ color: "var(--neutral-color)" }}
              >
                Logs
              </h2>
              <table
                style={{
                  width: "100%",
                }}
              >
                <thead>
                  <tr>{renderTableHeaders()}</tr>
                </thead>
                <tbody>{renderTableRows()}</tbody>
              </table>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Component;
