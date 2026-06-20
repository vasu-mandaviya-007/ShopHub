// // middleware/upload.js


import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "ShopHub/products",
        allowed_formats: ["jpg", "jpeg", "png", "webp"], 
    },
}); 

const upload = multer({ storage : storage });

export default upload;



// import multer from "multer";

// const storage = multer.memoryStorage({});

// const upload = multer({ storage: storage });

// export default upload;

