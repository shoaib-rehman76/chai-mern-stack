import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDNARY_NAME || "shoaiborg",
    api_key: process.env.CLOUDNARY_API_KEY || "199669282354769",
    api_secret: process.env.CLOUDNARY_API_SECRET_KEY || "y339d-t5jtW7aWkcwZIhoTYVlYg"
});
const uploadOnCloudnary = async (localFilePath) => {
    try {

        if (!localFilePath) {
            console.error('No local file path provided');
            return null;
        }
        // Upload an image
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        fs.unlinkSync(localFilePath)
        return uploadResult

    } catch (error) {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); // Remove the locally saved temporary file as the upload failed
        }
        return null;
    }
}

export default uploadOnCloudnary
// Optimize delivery by resizing and applying auto-format and auto-quality
// const optimizeUrl = cloudinary.url('shoes', {
//     fetch_format: 'auto',
//     quality: 'auto'
// });

// console.log(optimizeUrl);

// // Transform the image: auto-crop to square aspect_ratio
// const autoCropUrl = cloudinary.url('shoes', {
//     crop: 'auto',
//     gravity: 'auto',
//     width: 500,
//     height: 500,
// });

// console.log(autoCropUrl);