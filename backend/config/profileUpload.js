
import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "ShopHub/avatar",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
});

const profileUpload = multer({ storage: storage });

export default profileUpload;