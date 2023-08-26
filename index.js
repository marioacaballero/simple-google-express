import express from "express";
import { google } from "googleapis";
import process from "process";

const app = express();
const PORT = process.env.PORT || 3000;

const SCOPES = [
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/gmail.addons.current.action.compose",
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/gmail.modify",
];

const apiKey = "AIzaSyAyj1LoD9UqsduwSlKKH218ET7hBf-PSR8";

const credentials = {
  installed: {
    client_id:
      "342223814961-j1phjuua07hi4jab9k16bhrj2gf3uq36.apps.googleusercontent.com",
    client_secret: "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",
    redirect_uris: [
      "http://localhost:3000",
      "http://localhost",
      "http://localhost:3005",
    ],
  },
};
const oAuth2Client = new google.auth.OAuth2(
  credentials.installed.client_id,
  credentials.installed.client_secret,
  credentials.installed.redirect_uris[0]
);

app.get("/", async (req, res) => {
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
});

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

app.get("/api/sendEmail", async (req, res) => {
  const { token } = req.query;
  console.log(token);
  oAuth2Client.setCredentials({ access_token: token });
  // Crea una instancia de la API de Google People
  const people = google.people({ version: "v1", auth: oAuth2Client });

  // Obtiene el perfil del usuario
  const profile = await people.people.get({
    resourceName: "people/me", // 'me' se refiere al usuario autenticado
    personFields: "names", // Campos que deseas recuperar
  });

  const userIdAca = profile.data.resourceName.split("/")[1];
  console.log("User ID:", userIdAca);
  const gmail = google.gmail({
    version: "v1",
    auth: oAuth2Client,
    // key: apiKey,
  });

  const email = `
    To: destinatario@example.com
    Subject: Asunto del correo

    Contenido del correo electrónico.
  `;

  const raw = Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  try {
    const response = await gmail.users.drafts.create({
      userId: userIdAca,
      requestBody: {
        message: {
          raw: raw,
        },
      },
    });
    console.log("Email sent:", response.data);
    res.send("Email sent");
  } catch (error) {
    // console.error("Error sending email:", error);
    res.status(400).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
