const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());

app.use("/api/v1/collections", require("./api/v1/collections"));
app.use("/api/v1/users", require("./api/v1/users"));
app.use("/api/v1/adminAllCollections", require("./api/v1/adminAllCollections"));
app.use("/api/v1/tags", require("./api/v1/tags"));

app.use(express.static("client/build"));
app.get("*", (req, res) => {
   res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT || 3055;
app.listen(port, () =>
   console.log(`Server running at http://localhost:${port}`)
);
