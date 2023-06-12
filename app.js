const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is up and running on port 3000");
});
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/", function (req, res) {
  const firstName = req.body.FirstName;
  const lastName = req.body.LastName;
  const email = req.body.Email;
  const akshay = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const dam = JSON.stringify(akshay);
  const url = "https://us9.api.mailchimp.com/3.0/lists/fd1b660d19";
  const option = {
    method: "POST",
    auth: "akshay:449d0d27d5ceffdc12fca6ac68ecf87c-us9",
  };
  const request = https.request(url, option, function (response) {
    response.on("data", function (aks) {
      const some = JSON.parse(aks);
      console.log(some);
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });
  request.write(dam);
  request.end();
});
app.post("/failure", function (req, res) {
  res.redirect("/");
});
