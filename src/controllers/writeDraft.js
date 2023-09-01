import { google } from "googleapis";
import { credentials } from "../config/credentials.js";

export const writeDraft = async (req, res) => {
  const { token } = req.query;
  console.log(token);

  const oAuth2Client = new google.auth.OAuth2(
    credentials.installed.client_id,
    credentials.installed.client_secret,
    credentials.installed.redirect_uris[0]
  );
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
};
