"use server";
import { google } from "googleapis";
import { Readable } from "node:stream";

export interface ResponseUploadFile {
  webViewLink: string;
  webContentLink: string;
  fileId: string;
}

export async function uploadFileToDrive(
  file: File
): Promise<ResponseUploadFile> {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const readableStream = Readable.from(Buffer.from(buffer));

    // Subir el archivo a Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: file.name,
        mimeType: file.type,
      },
      media: {
        mimeType: file.type,
        body: readableStream,
      },
    });

    // Generar la URL pública del archivo
    await drive.permissions.create({
      fileId: response.data.id ?? undefined,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const result = await drive.files.get({
      fileId: response.data.id ?? "",
      fields: "webViewLink, webContentLink",
    });

    return {
      webViewLink: result.data.webViewLink ?? "",
      webContentLink: result.data.webContentLink ?? "",
      fileId: response.data.id ?? "",
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Error uploading file");
  }
}

export async function deleteFileFromDrive(fileId: string) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    await drive.files.delete({
      fileId: fileId,
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Error deleting file");
  }
}
