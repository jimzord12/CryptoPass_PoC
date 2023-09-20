// Load HTTP module
const http = require("http");

const options = {
  hostname: "localhost",
  port: 8787, // adjust this to your Express server's port
  path: "/testing/web3auth", // replace with your specific endpoint path
  method: "GET",
};

const req = http.request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log("Response:", data);
  });
});

req.on("error", (error) => {
  console.error(error);
});

req.end();
