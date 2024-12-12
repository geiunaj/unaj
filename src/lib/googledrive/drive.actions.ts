'use server';
import {google} from "googleapis";
import path from "path";
import fs from "fs";
import * as fs2 from "node:fs/promises";

export async function uploadFileToDrive(file: File): Promise<string> {
    try {
        // Configuración de autenticación de Google Drive
        const oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URI
        );
        oauth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN});

        const drive = google.drive({
            version: "v3",
            auth: oauth2Client,
        });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        await fs2.writeFile(`./public/tmp/${file.name}`, buffer);

        // Subir el archivo a Google Drive
        const response = await drive.files.create({
            requestBody: {
                name: file.name,
                mimeType: file.type,
            },
            media: {
                mimeType: file.type,
                body: fs.createReadStream(`./public/tmp/${file.name}`),
            },
        });

        console.log("File uploaded successfully:", response.data);

        // Eliminar el archivo temporal
        await fs2.unlink(`./public/tmp/${file.name}`);
        return `File uploaded successfully: ${response.data.id}`;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("Error uploading file");
    }
}
