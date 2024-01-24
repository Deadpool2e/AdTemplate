import React, { useState } from "react";
import Canvas from "./CanvasFile";
import Form from "./Form";
import { Box, Divider, Paper } from "@mui/material";
import Image from "./assessts/img.jpg";

const App = () => {
  const initialTemplateData = {
    // Initial template data
    caption: {
      text: "1 & 2 BHK Luxury Apartments at just Rs.34.97 Lakhs",
      position: {
        x: 50,
        y: 50,
      },
      max_characters_per_line: 31,
      font_size: 44,
      alignment: "left",
      text_color: "#FFFFFF",
    },
    cta: {
      text: "Shop Now",
      position: {
        x: 190,
        y: 320,
      },
      text_color: "#FFFFFF",
      background_color: "#000000",
    },
    image_mask: {
      x: 56,
      y: 442,
      width: 970,
      height: 600,
    },
    urls: {
      mask: "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_mask.png",
      stroke:
        "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Mask_stroke.png",
      design_pattern:
        "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Design_Pattern.png",
    },
  };

  const [templateData, setTemplateData] = useState(initialTemplateData);
  const [selectedColor, setSelectedColor] = useState("#0369A1");

  const handleColorChange = (color) => {
    setTemplateData((prevData) => ({
      ...prevData,
      background_color: color,
    }));
  };

  const canvasStyle = {
    // Scale down the canvas using CSS
    // flex: '1', // Take remaining space
    maxHeight: "50vh",
    border: "1px solid rgb(59 59 59 / 67%)",
    boxShadow:
      "0 4px 6px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box sx={{ flex: "1" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundImage: `url(${Image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#e0e0e0",
          }}
        >
          <Canvas templateData={templateData} style={canvasStyle} />
        </Box>
      </Box>
      <Divider
        orientation="vertical"
        flexItem
        style={{ backgroundColor: "#555" }}
      />
      <Box sx={{ flex: "1" }}>
        <Form templateData={templateData} setTemplateData={setTemplateData} />
      </Box>
    </Box>
  );
};

export default App;
