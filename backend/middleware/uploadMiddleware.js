import multer from "multer";

import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({

    cloudinary,

    params: async (req, file) => {

        return {

            folder: "placement_tracker_resumes",
            resource_type: "auto",
            public_id: Date.now() + "-resume"
        };

    }

});

const upload = multer({

    storage,

    limits: {

        fileSize: 2 * 1024 * 1024

    }

});

export default upload;