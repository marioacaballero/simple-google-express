import express from "express";
import morgan from "morgan";
import indexRouter from "./routers/index.js";

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Content-Length"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/api", indexRouter);
app.use(express.json({ limit: "500mb" }));
app.use(morgan("dev"));

// app.get("/", async (req, res) => {
// const code = req.query.code;
// try {
//   const { tokens } = await oAuth2Client.getToken(code);
//   oAuth2Client.setCredentials(tokens);
//   console.log(tokens);
//   res.send("tokens en consola");
// } catch (err) {
//   console.error("Error retrieving access token", err);
//   res.status(500).send("Error retrieving access token");
// }
// });

// app.get("/api/authenticate", (req, res) => {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: SCOPES,
//   });
//   res.redirect(authUrl);
// });

// app.get("/api/auth-callback", async (req, res) => {
//   const code = req.query.code;

//   try {
//     const { tokens } = await oAuth2Client.getToken(code);
//     oAuth2Client.setCredentials(tokens);
//     console.log(tokens);
//     res.redirect("/");
//   } catch (err) {
//     console.error("Error retrieving access token", err);
//     res.status(500).send("Error retrieving access token");
//   }
// });

// app.get("/api/sendEmail");

export default app;
