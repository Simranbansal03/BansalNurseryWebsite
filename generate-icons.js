const fs = require("fs");
const { exec } = require("child_process");

console.log("Generating Bansal Nursery icons from SVG...");
console.log("Note: This script requires Inkscape to be installed.");
console.log(
  "If you don't have Inkscape, you can manually convert the SVG to PNG and ICO files."
);

// Paths
const svgPath = "./src/logo.svg";
const favicon = "./public/favicon.ico";
const logo192 = "./public/logo192.png";
const logo512 = "./public/logo512.png";

// Check if Inkscape is installed
exec("inkscape --version", (error) => {
  if (error) {
    console.error("Error: Inkscape is not installed or not in PATH.");
    console.log(
      "Please install Inkscape or manually convert the SVG to PNG and ICO files."
    );
    return;
  }

  // Generate PNG files
  exec(
    `inkscape --export-filename=${logo192} --export-width=192 --export-height=192 ${svgPath}`,
    (error) => {
      if (error) {
        console.error("Error generating logo192.png:", error);
      } else {
        console.log("Generated logo192.png");
      }
    }
  );

  exec(
    `inkscape --export-filename=${logo512} --export-width=512 --export-height=512 ${svgPath}`,
    (error) => {
      if (error) {
        console.error("Error generating logo512.png:", error);
      } else {
        console.log("Generated logo512.png");
      }
    }
  );

  // Generate favicon.ico (requires ImageMagick)
  exec("convert --version", (error) => {
    if (error) {
      console.error("Error: ImageMagick is not installed or not in PATH.");
      console.log(
        "Please install ImageMagick or manually convert the SVG to ICO file."
      );
    } else {
      // Generate a temporary PNG for favicon
      const tempPng = "./temp-favicon.png";
      exec(
        `inkscape --export-filename=${tempPng} --export-width=64 --export-height=64 ${svgPath}`,
        (error) => {
          if (error) {
            console.error("Error generating temporary favicon PNG:", error);
          } else {
            // Convert PNG to ICO
            exec(
              `convert ${tempPng} -define icon:auto-resize=64,48,32,16 ${favicon}`,
              (error) => {
                if (error) {
                  console.error("Error generating favicon.ico:", error);
                } else {
                  console.log("Generated favicon.ico");
                  // Remove temporary file
                  fs.unlink(tempPng, (err) => {
                    if (err)
                      console.error("Error removing temporary file:", err);
                  });
                }
              }
            );
          }
        }
      );
    }
  });
});

console.log("Icon generation process started...");
