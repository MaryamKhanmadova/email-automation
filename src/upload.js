import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

const MAX_FILESIZE = 20 * 1024 * 1024; // 10 MB

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const uploadDir = path.join(__dirname, '../templates');
export const uploadDirImage = path.join(__dirname, '../images');
export const uploadDirFiles = path.join(__dirname, '../files');

[uploadDir, uploadDirImage, uploadDirFiles].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirImage);
  },
  filename: (req, file, cb) => {
    const guid = uuidv4();
    const newFilename = `${guid}${file.originalname}`;
    cb(null, newFilename);
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    let filetypes = /jpeg|jpg|gif|png/;
    let mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    }
    cb('Error: File upload only supports the following filetypes - ' + filetypes);
  },
  limits: { fileSize: MAX_FILESIZE },
});

export const storageFiles = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirFiles);
  },
  filename: (req, file, cb) => {
    if (file.originalname === "PROSOL_workers3.xlsx") {
      cb(null, file.originalname);
    } else {
      cb(new Error('Invalid filename. Please upload "PROSOL_workers3.xlsx" file only.'));
    }
  },
});

export const storageImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const uploadFiles = multer({ storage: storageFiles });
export const uploadImage = multer({ storage: storageImage });
export default uploadDirFiles;