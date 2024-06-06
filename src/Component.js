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
import { LuDownload } from "react-icons/lu";

const LightTheme = {
  textColor: "#333",
  axisLineColor: "#ccc",
  gridLineColor: "#eee",
  barColor: "#8884d8",
  lineColor: "#8884d8",
};

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
    { name: "Coding", value: 60 },
    { name: "Testing", value: 40 },
    { name: "Analysis", value: 30 },
    { name: "Maintenance", value: 20 },
  ];

  const data2 = [
    { name: "Data Processing", value: 46 },
    { name: "Algorithm Optimization", value: 25 },
    { name: "System Maintenance", value: 16 },
    { name: "Recognition", value: 8 },
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

  const [COLORS, setColors] = useState([
    "#7b61ff",
    "#ff66b2",
    "#4292ff",
    "#c0c0c0",
  ]);

  const renderTableHeaders = () => {
    const headers = Object.keys(csvData[0]);
    return headers.map((header, index) => (
      <th
        style={{
          fontFamily: "Urbanist",
          fontSize: "16px",
          fontWeight: "500",
          lineHeight: "24px",
          textAlign: "center",
          backgroundColor: "rgba(0, 123, 255, 1)",
          color: "rgba(255, 255, 255, 1)",
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
          color: "rgba(255,255,255,1)",
          height: "64px",
        }}
      >
        {Object.values(row).map((value, columnIndex) => (
          <td
            key={columnIndex}
            style={{
              fontFamily: "Urbanist",
              fontSize: "16px",
              fontWeight: "600",
              lineHeight: "21px",
              textAlign: "center",
              color: "rgba(51, 51, 51, 1)",
            }}
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
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#000000"];
  const lineChartData = prepareLineChartData(csvData);
  return (
    <div>
      <Header />

      <div className="d-flex flex-column body mx-5">
        <div className="main-content">
          {csvData && (
            <div>
              <div className="d-flex justify-content-between mt-2">
                <div
                  style={{
                    height: "44px",
                    fontWeight: "700",
                    color: "rgba(51, 51, 51, 1)",
                    fontFamily: "Urbanist",
                    fontSize: "44px",
                  }}
                >
                  Results
                </div>
                <Button
                  className="bg-primary border-0"
                  style={{ width: "256px", height: "60px" }}
                  onClick={downloadVideo}
                >
                  <LuDownload /> Download Detection Video
                </Button>
              </div>

              <div className="d-flex justify-content-between my-4">
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    // textAlign: "center",

                    width: "49.5%",
                    height: "480px",
                    border: "1px solid",
                    borderRadius: "22px",
                    borderImageSource:
                      " linear-gradient(90deg, #FFFFFF -128.27%, rgba(255, 255, 255, 0.02) 188.05%)",
                    background:
                      "linear-gradient(90deg, #FFFFFF -128.27%, rgba(255, 255, 255, 0.02) 188.05%)",
                  }}
                >
                  <video
                    className="my-2"
                    style={{
                      width: "98%",

                      maxHeight: "450px",
                      // border: "1px solid black",
                      borderRadius: "22px",
                    }}
                    controls
                  >
                    <source
                      src={localStorage.getItem("setVideoPath")}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    // textAlign: "center",

                    width: "49.5%",
                    height: "480px",
                    border: "1px solid",
                    borderRadius: "22px",
                    borderImageSource:
                      " linear-gradient(90deg, #FFFFFF -128.27%, rgba(255, 255, 255, 0.02) 188.05%)",
                    background:
                      "linear-gradient(90deg, #FFFFFF -128.27%, rgba(255, 255, 255, 0.02) 188.05%)",
                  }}
                >
                  <div className="chart-container">
                    <PieChart width={280} height={280}>
                      <Pie
                        data={data1}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {data1.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      {/* <Legend />  */}
                    </PieChart>
                    <div className="details">
                      {data1.map((item, index) => (
                        <div key={index}>
                          <span
                            className="dot"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          ></span>
                          {item.name} - {item.value}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="chart-container">
                    <PieChart width={280} height={280}>
                      <Pie
                        data={data2}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {data2.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      {/* <Legend /> */}
                    </PieChart>
                    <div className="details">
                      {data2.map((item, index) => (
                        <div key={index}>
                          <span
                            className="dot"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          ></span>
                          {item.name} - {item.value}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <table
                style={{
                  width: "100%",
                }}
              >
                <thead
                  style={{
                    height: "44px",
                  }}
                >
                  <tr>{renderTableHeaders()}</tr>
                </thead>
                <tbody>{renderTableRows()}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Component;
