import React, { useEffect, useRef, useState } from "react";
import {
  Col,
  Form,
  Row,
  Spinner,
  Button,
  Container,
  Card,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import FeatureSection from "./components/FeatureSection";
import Aos from "aos";
import "aos/dist/aos.css";

function App() {
  useEffect(() => {
    Aos.init();
  }, []);

  const navigate = useNavigate();
  const [csvData, setCsvData] = useState("");
  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("video", video);

    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://scienda-backend.adaptable.app/upload-video",
        formData
      );
      // console.log(data, "d");
      const response = await axios.post("http://localhost:5000/upload", {
        video: data?.location,
      });

      console.log("response jnjdbdhb", response);
      localStorage.setItem("setCsvData", JSON.stringify(response?.data?.data));
      localStorage.setItem(
        "setVideoPath",
        response.data.video_name
      );
      localStorage.setItem("analytics", JSON.stringify(response.data.statistics));
      setLoading(false);
      navigate("/component");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const renderTableHeaders = () => {
    const headers = Object.keys(csvData[0]);
    return headers.map((header, index) => (
      <th
        style={{ border: "1px solid black", textAlign: "center" }}
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
        style={{ border: "1px solid black", textAlign: "center" }}
      >
        {Object.values(row).map((value, columnIndex) => (
          <td key={columnIndex}>{value}</td>
        ))}
      </tr>
    ));
  };
  const [videoUrl, setVideoUrl] = useState("");
  const [videoPath, setVideoPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    setVideo(e.target.files[0]);

    reader.onload = () => {
      setVideoUrl(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <Header />

      <div className="my-5">
        {!videoUrl && (
          <h2
            className="logo-text text-center m-0 display-1"
            data-aos="fade-up"
            data-aos-duration="500"
            data-aos-delay="400"
          >
            Machine Productivity Tracking Using AI
          </h2>
        )}
      </div>
      <div className="d-flex flex-column body">
        <div className="main-content">
          <Row
            style={{ marginBottom: "40px" }}
            className={`align-items-center`}
          >
            <Col sm={12} className="text-center">
              <Button
                className="selector border-0 px-5"
                size="lg"
                onClick={handleButtonClick}
                data-aos="fade-up"
                data-aos-duration="500"
                data-aos-delay="600"
              >
                Select Video
              </Button>
              <input
                id="video-upload"
                ref={fileInputRef}
                onChange={handleFileChange}
                type="file"
                accept="video/*"
                style={{ display: "none" }}
              />
            </Col>
          </Row>
          {!videoUrl && (
            <Container className="px-md-5 ">
              <p
                className=" text-center text-white m-0 "
                data-aos="fade-up"
                data-aos-duration="500"
                data-aos-delay="800"
              >
                Real-time data helps identify inefficiencies, predict
                maintenance, and improve performance, leading to reduced costs,
                increased throughput, and enhanced efficiency for clients in
                manufacturing. Utilizing AI technologies, our platform tracks
                machine productivity, analyzes patterns, and provides actionable
                insights for optimizing operations.
              </p>
            </Container>
          )}

          {videoUrl && (
            <div className="preview">
              <div className="align-items-center justify-content-center mb-1">
                {videoUrl && (
                  <video
                    style={{
                      height: "400px",
                      width: "90%",
                      alignItems: "center",
                    }}
                    src={videoUrl}
                    controls
                  />
                )}
              </div>
              <div className="align-items-center">
                <Button
                  onClick={submitHandler}
                  className="pt-2 pb-2 uploader border-0"
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Upload Video"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
        {!videoUrl && <FeatureSection />}
        <Footer />
      </div>
    </div>
  );
}

export default App;
