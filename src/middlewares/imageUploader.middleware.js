import multer from 'multer';
// import path from 'path';
import crypto from 'crypto';
import createError from '../utils/createError.js';
import { uploadFile } from '../helpers/googleDrive.js';
import streamifier from 'streamifier';

const multerUpload = multer({
  storage: multer.memoryStorage(), // Simpan file di memori
  limits: {
    fileSize: 2000000, // Batas ukuran file 2MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']; // MIME types yang diizinkan
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'), false); // Tolak file
    }
  },
});

export default (req, res, next) => {
  const uploadSingle = multerUpload.single('image');

  uploadSingle(req, res, async (err) => {
    if (err) {
      console.error(err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(createError(400, 'File size exceeds the limit of 2MB'));
      }
      return next(
        createError(400, 'Invalid file type. Only images are allowed.')
      );
    }

    if (!req.file) {
      return next(createError(400, 'No file uploaded'));
    }

    try {
      const { buffer, mimetype } = req.file;
      const fileMetadata = {
        name: `${crypto.randomBytes(5).toString('hex')}.${
          mimetype.split('/')[1]
        }`,
      };
      const media = {
        mimetype: mimetype,
        body: streamifier.createReadStream(buffer),
      };
      let uploadedFile;
      if (req.url == '/profile/image') {
        uploadedFile = await uploadFile(media, fileMetadata, 'pfp');
      } else {
        uploadedFile = await uploadFile(media, fileMetadata, 'pets');
      }
      req.googleImageUrl = `https://lh3.googleusercontent.com/d/${uploadedFile.id}`;
      next();
    } catch (uploadError) {
      console.error(uploadError);
      return next(createError(500, 'Error uploading file to Google Drive'));
    }
  });
};
