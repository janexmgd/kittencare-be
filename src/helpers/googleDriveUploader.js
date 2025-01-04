import { google } from 'googleapis';
import env from '../utils/env.js';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const authorize = async () => {
  try {
    const googleClient = new google.auth.JWT(
      env.GDRIVE_EMAIL,
      null,
      env.GDRIVE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Pastikan format private key benar
      SCOPES
    );
    await googleClient.authorize();
    return googleClient;
  } catch (error) {
    console.error('Authorization error:', error);
    throw error;
  }
};

const uploadFile = async (media, fileMetadata, requestCase) => {
  try {
    if (requestCase == 'pfp') {
      fileMetadata.parents = [env.GDRIVE_PFP_FOLDER_ID];
    } else {
      fileMetadata.parents = [env.GDRIVE_PFP_FOLDER_ID];
    }
    const account = await authorize();
    const drive = google.drive({ version: 'v3', auth: account });
    const file = await drive.files.create({
      media: media,
      fields: 'id, webViewLink, webContentLink',
      resource: fileMetadata,
    });
    const fileId = file.data.id;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
    return {
      id: fileId,
      webViewLink: file.data.webViewLink,
      webContentLink: file.data.webContentLink,
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export default uploadFile;
