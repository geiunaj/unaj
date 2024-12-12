// const {google} = require('googleapis');
// const path = require('path');
// const fs = require('fs');
// const dotenv = require('dotenv');
// dotenv.config();
// // from .env
// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const REDIRECT_URI = process.env.REDIRECT_URI;
//
// const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
//
// const oauth2Client = new google.auth.OAuth2(
//     CLIENT_ID,
//     CLIENT_SECRET,
//     REDIRECT_URI
// );
//
// oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});
//
// const drive = google.drive({
//     version: 'v3',
//     auth: oauth2Client,
// });
//
// /*
// filepath which needs to be uploaded
// Note: Assumes example.jpg file is in root directory,
// though this can be any filePath
// */
// const filePath = path.join(__dirname, '../../public/img/fondoLogin.png');
//
// export async function uploadFile(filePath) {
//     try {
//         // Extraer el nombre del archivo y el tipo MIME
//         const fileName = path.basename(filePath); // Nombre del archivo
//         const mimeType = `image/${path.extname(filePath).slice(1)}`; // Tipo de archivo basado en la extensión
//
//         const response = await drive.files.create({
//             requestBody: {
//                 name: fileName, // Usar el nombre original
//                 mimeType,       // Usar el tipo MIME dinámico
//             },
//             media: {
//                 mimeType,
//                 body: fs.createReadStream(filePath),
//             },
//         });
//
//         generatePublicUrl(response.data.id);
//
//     } catch (error) {
//         console.error('Error al subir el archivo:', error.message);
//     }
// }
//
// uploadFile(filePath);
//
// async function deleteFile() {
//     try {
//         const response = await drive.files.delete({
//             fileId: 'YOUR FILE ID',
//         });
//         console.log(response.data, response.status);
//     } catch (error) {
//         console.log(error.message);
//     }
// }
//
// // deleteFile();
//
// async function generatePublicUrl(fileId) {
//     try {
//         await drive.permissions.create({
//             fileId: fileId,
//             requestBody: {
//                 role: 'reader',
//                 type: 'anyone',
//             },
//         });
//         const result = await drive.files.get({
//             fileId: fileId,
//             fields: 'webViewLink, webContentLink',
//         });
//         console.log(result.data);
//     } catch (error) {
//         console.log(error.message);
//     }
// }
//
// // generatePublicUrl();