import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Dialog,
  DialogContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { SketchPicker } from "react-color";
import AddIcon from "@mui/icons-material/Add";

const Form = ({ templateData, setTemplateData }) => {
  const [adContent, setAdContent] = useState(templateData.caption.text);
  const [cta, setCta] = useState(templateData.cta.text);
  const [imageFile, setImageFile] = useState(null);
  const [selectedColors, setSelectedColors] = useState(["#0369A1"]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#0369A1");

  const handleColorChange = (color) => {
    const colorAlreadyExists = selectedColors.includes(color);

    const newColors = colorAlreadyExists
      ? selectedColors.slice(0, 5)
      : [color, ...selectedColors.slice(0, 4)];

    setSelectedColors(newColors);
    handleBackgroundChange(color);
    setShowColorPicker(false);
  };

  const handleColorItemClick = (color) => {
    handleBackgroundChange(color);
    setSelectedColor(color);
  };

  const handlePlusButtonClick = () => {
    setShowColorPicker(true);
  };

  const handleCloseColorPicker = () => {
    setShowColorPicker(false);
  };

  const handleBackgroundChange = (color) => {
    if (templateData && templateData.urls.background_color === color) return;
    setTemplateData((prevData) => ({
      ...prevData,
      urls: {
        ...prevData.urls,
        background_color: color,
      },
    }));
  };

  const handleCaptionTextChange = (newText) => {
    setAdContent(newText);
    setTemplateData((prevData) => ({
      ...prevData,
      caption: {
        ...prevData.caption,
        text: newText,
      },
    }));
  };

  const handleCTATextChange = (newText) => {
    setCta(newText);
    setTemplateData((prevData) => ({
      ...prevData,
      cta: {
        ...prevData.cta,
        text: newText,
      },
    }));
  };

  const handleImageInputChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
    setTemplateData((prevData) => ({
      ...prevData,
      urls: {
        ...prevData.urls,
        image: URL.createObjectURL(file),
      },
    }));
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setTemplateData((prevData) => ({
      ...prevData,
      urls: {
        ...prevData.urls,
        image: null,
      },
    }));
  };

  return (
    <Box px={5}>
      <Box width="100%">
        <IconButton
          sx={{
            position: "absolute",
            right: "10px",
            top: "10px",
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box mt={13} mb={4}>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            Ad customization
          </Typography>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{
              textAlign: "center",
              marginX: "auto",
              fontWeight: "200",
              fontSize: "1rem",
              color:"grey"
            }}
          >
            Customise your ad and get the templates accordingly
          </Typography>
        </Box>
        {/* Add Image Input */}

        <Box mb={3}>
          <label htmlFor="image-input">
            <Button
              variant="contained"
              component="label"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "1rem",
                backgroundColor: "#f0f8ff00",
                "&:hover": {
                  backgroundColor: "#f0f8ffb5",
                },
                textTransform: "none",
              }}
            >
              {imageFile ? (
                <>
                  {/* <img src={URL.createObjectURL(imageFile)} alt="Ad Creative" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> */}
                  <Typography
                    variant="caption"
                    sx={{ marginTop: "0.5rem", color: "gray" }}
                  >
                    {imageFile.name}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleImageRemove}
                    sx={{ marginTop: "0.5rem" }}
                  >
                    Remove
                  </Button>
                </>
              ) : (
                <>
                  <input
                    id="image-input"
                    accept="image/*"
                    hidden
                    type="file"
                    onChange={handleImageInputChange}
                  />

                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <AddPhotoAlternateIcon sx={{ color: "#5a5858" }} />
                    <Typography sx={{ color: "#676666" }}>
                      Change the ad creative image.
                    </Typography>
                  </Box>
                </>
              )}
            </Button>
          </label>
        </Box>

        <Divider sx={{ margin: "20px 0", borderColor: "#ccc" }}>
          <Typography
            variant="caption"
            sx={{ padding: "0 10px", background: "white",color:"#6a6a6a" }}
          >
            Edit Contents
          </Typography>
        </Divider>
        {/* Edit Content */}
        <Box mt={2}>
          <TextField
            label="Ad Content"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={adContent}
            onChange={(e) => handleCaptionTextChange(e.target.value)}
            sx={{ marginTop: "1rem" }}
          />
          {/* Edit CTA */}
          <TextField
            label="CTA"
            variant="outlined"
            fullWidth
            value={cta}
            onChange={(e) => handleCTATextChange(e.target.value)}
            sx={{ marginTop: "1rem" }}
          />
        </Box>
        {/* Choose Color */}
        <Box>
          <Typography variant="body2" sx={{ marginTop: "20px", color: "gray" }}>
            Choose your color
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {selectedColors.map((color, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: color,
                  width: "20px",
                  height: "20px",
                  margin: "5px",
                  cursor: "pointer",
                  borderRadius: "50%",
                  border: color === selectedColor ? "2px solid white" : "none",
                  boxShadow:
                    color === selectedColor ? "0 0 0 1px #0369A1" : "none",
                }}
                onClick={() => handleColorItemClick(color)}
              ></Box>
            ))}

            <IconButton onClick={handlePlusButtonClick}>
              <AddIcon />
            </IconButton>
          </Box>

          {/* Show the color picker dialog */}
          <Dialog open={showColorPicker} onClose={handleCloseColorPicker}>
            <DialogContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <SketchPicker
                  color={selectedColor}
                  onChangeComplete={(color) => setSelectedColor(color.hex)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{
                    marginTop: 2,
                    width: "50%",
                  }}
                  onClick={() => handleColorChange(selectedColor)}
                >
                  Save
                </Button>
              </Box>
            </DialogContent>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
};

export default Form;
