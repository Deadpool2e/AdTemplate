import React, { useEffect, useRef } from "react";

class CanvasEditor {
  constructor(canvasRef) {
    this.canvas = canvasRef.current;
    this.context = this.canvas.getContext("2d");
    this.templateData = null;
  }

  setTemplateData(templateData) {
    this.templateData = templateData;
  }

  renderBackgroundColor() {
    const { background_color } = this.templateData.urls;
    this.context.fillStyle = background_color || "#0369A1";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderDesignPattern() {
    const { design_pattern } = this.templateData.urls;
    const patternImage = new Image();
    patternImage.src = design_pattern + `?random=${Math.random()}`;
    patternImage.onload = () => {
      const pattern = this.context.createPattern(patternImage, "repeat");
      this.context.fillStyle = pattern;
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };
  }

  renderImageMask() {
    const { x, y, width, height } = this.templateData.image_mask;
    const { mask } = this.templateData.urls;
    const { image } = this.templateData.urls;
    if (!image) {
      // const maskImage = new Image();
      // maskImage.src = mask + `?random=${Math.random()}`;
      // maskImage.onload = () => {
      //   this.context.drawImage(maskImage, x, y, width, height);
      // };
      this.context.fillStyle = "white";
      this.context.fillRect(x-2, y, width+3, height);
    }
  }

  renderMaskStroke() {
    const { x, y, width, height } = this.templateData.image_mask;
    // const { stroke } = this.templateData.urls;
    // const strokeImage = new Image();
    // strokeImage.src = stroke + `?random=${Math.random()}`;
    // strokeImage.onload = () => {
    //   this.context.drawImage(strokeImage, x, y, width, height);
    // };

  }

  renderImageIfAvailable() {
    const { image } = this.templateData.urls;
    if (image) {
        const imageElement = new Image();
        imageElement.src = image;
        imageElement.onload = () => {
            const { x, y, width, height } = this.templateData.image_mask;

            // Draw the white border
            const borderWidth = 6; // You can adjust the border width as needed
            this.context.fillStyle = 'white';
            this.context.clearRect(x - borderWidth, y - borderWidth, width + 2 * borderWidth, height + 2 * borderWidth);
            this.context.fillRect(x - borderWidth, y - borderWidth, width + 2 * borderWidth, height + 2 * borderWidth);

            // Draw the image on top of the border
            this.context.drawImage(imageElement, x, y, width, height);
        };
    }
}


  renderText() {
    const {
      text,
      position,
      font_size,
      alignment,
      text_color,
      max_characters_per_line,
    } = this.templateData.caption;

    this.context.font = `${font_size}px Arial`;
    this.context.fillStyle = text_color || "#FFFFFF";
    this.context.textAlign = alignment || "left";

    let words = text.split(" ");
    let line = "";
    let lines = [];

    for (let i = 0; i < words.length; i++) {
      let testLine = `${line}${words[i]} `;
      let metrics = this.context.measureText(testLine);
      let testWidth = metrics.width;

      if (testWidth > max_characters_per_line && i > 0) {
        lines.push(line.trim());
        line = `${words[i]} `;
      } else {
        line = testLine;
      }
    }

    if (line.trim() !== "") {
      lines.push(line.trim());
    }

    let y = position.y;
    let currentLine = "";
    let count = 0;
    let shouldBreak = false;

    lines.forEach((line) => {
      if (!shouldBreak && (currentLine + line).length <= max_characters_per_line) {
        currentLine += line + " ";
      } else {
        if (!shouldBreak) {
          this.context.fillText(currentLine.trim(), position.x, y);
          y += font_size;
          count++;
          if (count >= 5) {
            shouldBreak = true; 
          }
        }
        currentLine = line + " ";
      }
    });

    if (!shouldBreak) {
      this.context.fillText(currentLine.trim(), position.x, y);
    }

  }

  roundRect(x, y, width, height, radius, fill, stroke) {
    this.context.beginPath();
    this.context.moveTo(x + radius, y);
    this.context.arcTo(x + width, y, x + width, y + height, radius);
    this.context.arcTo(x + width, y + height, x, y + height, radius);
    this.context.arcTo(x, y + height, x, y, radius);
    this.context.arcTo(x, y, x + width, y, radius);
    this.context.closePath();
    if (fill) this.context.fill();
    if (stroke) this.context.stroke();
  }

  renderCTA() {
    const {
      text,
      position,
      font_size = 30,
      text_color,
      background_color,
      wrap_length = 20,
    } = this.templateData.cta;
    const padding = 24;

    let words = text.split(" ");
    let line = "";
    let lines = [];

    for (let i = 0; i < words.length; i++) {
      let testLine = `${line}${words[i]} `;
      let metrics = this.context.measureText(testLine);
      let testWidth = metrics.width;

      if (testWidth > wrap_length && i > 0) {
        lines.push(line.trim());
        line = `${words[i]} `;
      } else {
        line = testLine;
      }
    }

    if (line.trim() !== "") {
      lines.push(line.trim());
    }

    let currentLine = "";

    let lineHeight = 1;
    lines.forEach((line) => {
      if ((currentLine + line).length <= wrap_length) {
        currentLine += line + " ";
      } else {
        lineHeight++;
        currentLine = line + " ";
      }
    });

    let textWidth = Math.min(
      this.context.measureText(text).width,
      wrap_length * 15
    );
    let textHeight = font_size * lineHeight;

    // Draw rounded rectangle as CTA background
    this.context.fillStyle = background_color || "#000000";
    this.roundRect(
      position.x - textWidth / 2 - padding / 2,
      position.y - textHeight / 2 - padding / 2,
      textWidth + padding,
      textHeight + padding,
      10,
      true,
      false
    );

    // Draw wrapped CTA text
    this.context.font = `${font_size}px Arial`;
    this.context.fillStyle = text_color || "#FFFFFF";
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";

    let y = position.y - ((lineHeight - 1) * font_size) / 2;
    currentLine = "";

    lines.forEach((line) => {
      if ((currentLine + line).length <= wrap_length) {
        currentLine += line + " ";
      } else {
        this.context.fillText(currentLine.trim(), position.x, y);
        y += font_size;
        currentLine = line + " ";
      }
    });

    if (currentLine.trim() !== "") {
      this.context.fillText(currentLine.trim(), position.x, y);
    }
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // calling all the functions in the order as mentioned
    this.renderBackgroundColor();
    this.renderDesignPattern();
    this.renderImageMask();
    this.renderMaskStroke();
    this.renderImageIfAvailable();
    this.renderText();
    this.renderCTA();
  }
}

const Canvas = ({ templateData, style }) => {
  const canvasRef = useRef(null);
  const canvasEditorRef = useRef(null);

  useEffect(() => {
    if (!canvasEditorRef.current) {
      canvasEditorRef.current = new CanvasEditor(canvasRef);
    }
    // console.log(templateData);
    canvasEditorRef.current.setTemplateData(templateData);
    canvasEditorRef.current.render();
  }, [templateData]);

  return (
    <div>
      <canvas ref={canvasRef} height="1080" width="1080" style={style} />
    </div>
  );
};

export default Canvas;
