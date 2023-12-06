const { createReadStream, createWriteStream} = require("fs");
const fs = require("fs").promises;
const { DEFAULT_HEADER } = require("./util/util");
const path = require("path");
var qs = require("querystring");
const { formidable } = require("formidable");
const  ejs = require('ejs');


// Return the parameter value from a URL
function getUrlParameter(request, response, parameter) {
	const { pathname, searchParams } = new URL(request.url, `http://${request.headers.host}`);
  return searchParams.get(parameter); 
}


// Extract the user's data (as a object) from the JSON file.
function getData(username) {
  return new Promise((resolve, reject) => {
    const dataBasePath = path.join(__dirname, "..", "database", "data.json");

    fs.readFile(dataBasePath, "utf-8")
      .then((data) => {
        const users = JSON.parse(data);
        const foundUser = users.find((user) => user.username === username);

        if (foundUser) {
          resolve(foundUser);
        } else {
          reject(new Error("User not found"));
        }
      })
      .catch((err) => {
        console.log(err.message);
        reject(err);
      });
  });
}


// Get the list of users from the database
function getUserList() {
	return new Promise((resolve, reject) => {
		const dataBasePath = path.join(__dirname, "..", "database", "data.json");
	
		fs.readFile(dataBasePath, "utf-8")
			.then((data) => {
				let userList = [];	
				const users = JSON.parse(data);

				for (const user of users) {
					userList.push(user.username);
				}
				resolve(userList);
			})
			.catch((err) => {
				console.log(err.message);
				reject(err);
			});
	});
}


// Generate the html for the user card
async function userHtml(userList) {
  let promises = [];

  for (const userName of userList) {
    promises.push(
      getData(userName)
        .then((data) => {
          return `
            <div class="user-card">
              <img src="profile?username=${data.username}" alt="${data.username}">
              <div class="user-buttons">
								<form action="/images" method="post" enctype="multipart/form-data">
									<input type="hidden" name="userName" value="${data.username}">
									<input type="file" name="userFile" accept="image/png">
									<input type="submit" value="Upload"> 
                </form>
								<button onclick="window.location.href='/feed?username=${data.username}'">${data.username}</button>
              </div>
            </div>
          `;
        })
        .catch((error) => console.log(error.message))
    );
  }

  const results = await Promise.all(promises);
  const result = results.join(""); 
  return result;
}


// Generate the html for the user's photos
async function userPhotosHtml(userName) {
  try {
    const photoFolder = path.join(__dirname, "photos", userName);
		const files = await fs.readdir(photoFolder);
		const photoList = files.filter(file => file !== "profile.jpeg");

    let promises = [];

    for (let index = 0; index < photoList.length; index++) {
      promises.push(
        getData(userName)
          .then((data) => {
            return `
						<div class="gallery-item" tabindex="0">
						<img src="photo?username=${data.username}&photo=${index + 1}" class="gallery-image" alt="User photo">
						<div class="gallery-item-info">
							<ul>
								<li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i> 56</li>
								<li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i> 2</li>
							</ul>
						</div>
					</div>
            `;
          })
          .catch((error) => console.log(error.message))
      );
    }

    const results = await Promise.all(promises);
    const result = results.join("");
    return result;
  } catch (err) {
    console.log(err.message);
  }
}


const controller = {
	getFormPage: async (request, response) => {
    try {
      const userList = await getUserList();
      const userCards = await userHtml(userList);

      const formPath = path.join(__dirname, "form.ejs");
			ejs.renderFile(formPath, { userCards }, (err, str) => {
				if (err) {
					response.writeHead(404, DEFAULT_HEADER);
				} else {
					response.end(str);
				}
			});
		} catch (err) {
			console.log(err.message);
		}
  },

  sendFormData: (request, response) => {
    var body = "";

    request.on("data", function (data) {
      body += data;
    });

    request.on("end", function () {
      var post = qs.parse(body);
      console.log(post);
    });
  },
  
	getFeed: async (request, response) => {
		try {
			const userName = getUrlParameter(request, response, "username");
			const data = await getData(userName);
			const imageHTML = await userPhotosHtml(userName);
	
			const feedPath = path.join(__dirname, "feed.ejs");
			ejs.renderFile(feedPath, { data, imageHTML }, (err, str) => {
				if (err) {
					response.writeHead(404, DEFAULT_HEADER);
				} else {
					response.end(str);
				}
			});
		} catch (err) {
			console.log(err.message);
		}
	},
	
	uploadImages: async (request, response) => {
    if (request.url === "/images" && request.method.toLowerCase() === "post") {
			const form = formidable({});
			let fields;
			let files;

			try {
				[fields, files] = await form.parse(request);
				const { userFile } = files;
				const { userName } = fields;

				const photoName = userFile[0].originalFilename;
				const name = userName[0];
				const originPath = userFile[0].filepath;
				const destinationPath = path.join(__dirname, "photos", name, photoName);

				const readStream = createReadStream(originPath);
				const writeStream = createWriteStream(destinationPath);
				readStream.pipe(writeStream)
					
				const dataBasePath = path.join(__dirname, "..", "database", "data.json");
				const allUsersData = JSON.parse(await fs.readFile(dataBasePath, "utf-8"));
				const userIndex = allUsersData.findIndex((user) => user.username === name);
				allUsersData[userIndex].photos.push(photoName);
				const newData = JSON.stringify(allUsersData, null, 2);
				await fs.writeFile(dataBasePath, newData);

			} catch (err) {
				console.log(err.message);
				response.writeHead(500, { "Content-Type": "application/json" });
				response.end(JSON.stringify({ error: "Internal Server Error" }));
			}
	  }
	}

};

module.exports = { controller, getUrlParameter };
