const { parse } = require("url");
const { DEFAULT_HEADER } = require("./util/util.js");
const { controller, getUrlParameter } = require("./controller");
const { createReadStream } = require("fs");
const path = require("path");
const fs = require("fs").promises;

const allRoutes = {
  // GET: localhost:3000/form
  "/:get": (request, response) => {
    controller.getFormPage(request, response);
  },
  // POST: localhost:3000/form
  "/form:post": (request, response) => {
    controller.sendFormData(request, response);
  },
  // POST: localhost:3000/images
  "/images:post": (request, response) => {
    controller.uploadImages(request, response);
  },
  // GET: localhost:3000/feed
  // Shows instagram profile for a given user
  "/feed:get": (request, response) => {
    controller.getFeed(request, response);
  },
  "/profile:get": async (request, response) => {
    const userName = getUrlParameter(request, response, "username");
    const imagepath = path.join(__dirname, "photos", userName, "profile.jpeg");
    const profilePic = await fs.readFile(imagepath);
    response.end(profilePic);
  },
  "/photo:get": async (request, response) => {
    const userName = getUrlParameter(request, response, "username");
    const num = getUrlParameter(request, response, "photo");
    const imagepath = path.join(__dirname, "photos", userName, `pic${num}.png`);
    const photoPic = await fs.readFile(imagepath);
    response.end(photoPic);
  },
  "/logo:get": async (request, response) => {
    const imagepath = path.join(__dirname, "photos", "logo", "logo.jpg");
    const logoPic = await fs.readFile(imagepath);
    response.end(logoPic);
  },
  // 404 routes
  default: (request, response) => {
    response.writeHead(404, DEFAULT_HEADER);
    createReadStream(path.join(__dirname, "views", "404.html"), "utf8").pipe(
      response
    );
  },
};

function handler(request, response) {
  const { url, method } = request;

  const { pathname } = parse(url, true);

  const key = `${pathname}:${method.toLowerCase()}`;
  const chosen = allRoutes[key] || allRoutes.default;

  return Promise.resolve(chosen(request, response)).catch(
    handlerError(response)
  );
}

function handlerError(response) {
  return (error) => {
    console.log("Something bad has  happened**", error.stack);
    response.writeHead(500, DEFAULT_HEADER);
    response.write(
      JSON.stringify({
        error: "internet server error!!",
      })
    );

    return response.end();
  };
}

module.exports = handler;
