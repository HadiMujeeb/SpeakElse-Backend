import Cloudinary from "../../infrastructure/config/cloudinary.config";
import fs from "fs";

const uploadImage = (fileBuffer: Buffer): Promise<any> => {
  return new Promise((resolve, reject) => {
    Cloudinary.uploader
      .upload_stream({ resource_type: "image" }, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      })
      .end(fileBuffer);
  });
};

const uploadImageFromFile = async (filePath: string): Promise<any> => {
  try {
    const fileBuffer = fs.readFileSync(filePath); // Read the image file into a buffer
    const result = await uploadImage(fileBuffer); // Call the uploadImage function
    console.log("Image uploaded successfully:", result);
    return result; // Return the result for further processing
  } catch (err) {
    console.error("Error uploading image:", err);
    throw err; // Rethrow the error for handling
  }
};

export default { uploadImage, uploadImageFromFile };
