import { Request } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads");

    // Check if directory exists, if not, create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir); // Directory where files will be stored
  },
  filename: (req: Request, file: any, cb: any) => {
    const ext = path.extname(file.originalname); // Get file extension

    const file_url = `${
      req.user_id + "" + generateOrderNumber()
    }-profile${ext}`;

    req.imgUrl = "uploads/" + file_url;

    cb(null, file_url); // Create unique file name
  },
});

// File filter to allow only images
const fileFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only image files are allowed!"), false); // Reject file
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB file size limit
  },
});

function generateOrderNumber() {
  const prefix = "img";
  const timestamp = Date.now(); // Current timestamp in milliseconds

  return `${prefix}${timestamp}`;
}

// REMOVE FILES
export const removeFile = (imgUrl: string) => {
  const filePath = path.join(__dirname, "../../uploads", path.basename(imgUrl));

  fs.unlink(filePath, async (err) => {
    if (err) {
      return {
        success: false,
        message: "Failed to delete profile picture",
      };
    }
  });
};
