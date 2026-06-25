// resumeUpload.middleware.js
import multer from "multer";

const upload = multer({
  dest: "uploads/resumes/",

  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

export default upload;
