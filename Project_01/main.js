const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");
const pathProcessed2 = path.join(__dirname, "larkscaled");

IOhandler.unzip(zipFilePath, pathUnzipped)
  .then(() => IOhandler.readDir(pathUnzipped))
  .then((photoPaths) => {
    IOhandler.grayScale(photoPaths, pathProcessed),
    IOhandler.larkScale(photoPaths, pathProcessed2)
  })
  .catch(err => console.error("Error:", err.message));


