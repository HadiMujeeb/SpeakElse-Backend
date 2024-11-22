import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from './cloudinary.config';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads'as any, 
    allowedFormats: ['jpg', 'png','pdf','doc', 'docx'],
  } as any
});

export const upload = multer({ storage });
