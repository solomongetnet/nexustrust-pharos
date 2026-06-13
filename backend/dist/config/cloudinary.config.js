import { v2 as cloudinary } from "cloudinary";
// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const uploadToCloudinary = async (file, folder) => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({ folder: folder ? folder : "charapia", resource_type: "auto" }, function (err, result) {
            if (err) {
                console.log(err);
                reject({ message: "Some error occured try again" });
                return;
            }
            resolve(result);
        })
            .end(buffer);
    });
};
export default cloudinary;
