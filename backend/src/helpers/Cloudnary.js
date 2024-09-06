import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDNARY_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET_KEY
});
const uploadOnCloudnary = async (localFilePath) => {

    try {

        if (!localFilePath) return null;

        // Upload an image
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })

        console.log(uploadResult);

        return uploadResult

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
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload failed
        return null;
    }
}

export default uploadOnCloudnary