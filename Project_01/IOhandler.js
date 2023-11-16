/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: 
 * Author: 
 *
 */

const AdmZip = require("adm-zip");
const PNG = require("pngjs").PNG;
const path = require("path");

const fs = require("fs").promises;
const { createReadStream, createWriteStream } = require("fs");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    const zip = new AdmZip(pathIn);

    try {
      zip.extractAllTo(pathOut, true);
      console.log("Extraction operation complete.");
      resolve();
    } catch (err) {
      console.error("Extraction failed:", err.message);
      reject(err);
    }
  });
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return new Promise((resolve, reject) => {
    photoPaths = [];
    fs.readdir(dir)
      .then(files => {
        for (let index = 0; index < files.length; index++) {
          const fileName = files[index];
          const filePath =  path.join("unzipped", fileName);
          if (fileName.toLowerCase().endsWith(".png")) {
            photoPaths.push(filePath);
          }
        }

        console.log("Files in the directory:", photoPaths);
        resolve(photoPaths);
      })
      .catch(err => {
        console.error("Error reading directory:", err.message);
        reject(err);
      });
  });
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    for (let index = 0; index < pathIn.length; index++) {
      const photoPathIn = path.join(__dirname, pathIn[index]);
      const photoPathOut = path.join(pathOut, `in${index}.png`);

      createReadStream(photoPathIn)
      .pipe(new PNG({}))
      .on("parsed", function () {
        for (var y = 0; y < this.height; y++) {
          for (var x = 0; x < this.width; x++) {
            var idx = (this.width * y + x) << 2;  
            let grayscale = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
            this.data[idx] = grayscale;
            this.data[idx + 1] = grayscale;
            this.data[idx + 2] = grayscale;
          }
        }
        this.pack()
          .pipe(createWriteStream(photoPathOut))
          .on("finish", () => {
            console.log(`Transformation complete for ${photoPathIn}`);
            resolve()
          });
      })
      .on("error", reject);
    }
  });  
};


/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const larkScale = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    for (let index = 0; index < pathIn.length; index++) {
      const photoPathIn = path.join(__dirname, pathIn[index]);
      const photoPathOut = path.join(pathOut, `in${index}.png`);

      createReadStream(photoPathIn)
      .pipe(new PNG({}))
      .on("parsed", function () {
        for (var y = 0; y < this.height; y++) {
          for (var x = 0; x < this.width; x++) {
            var idx = (this.width * y + x) << 2;  
            this.data[idx] = Math.min(255, this.data[idx] * 1.2); 
            this.data[idx + 1] = Math.min(255, this.data[idx + 1] * 1.1); 
            this.data[idx + 2] = Math.min(255, this.data[idx + 2] * 0.9); 
          }
        }
        this.pack()
          .pipe(createWriteStream(photoPathOut))
          .on("finish", () => {
            console.log(`Transformation complete for ${photoPathIn}`);
            resolve()
          });
      })
      .on("error", reject);
    }
  });  
};


module.exports = {
  unzip,
  readDir,
  grayScale,
  larkScale
};
