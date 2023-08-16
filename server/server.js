import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors";

const app = express();
app.use(cors());
// Allow CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  


const port = 8000;

// Set up the multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Filter for valid image mimetypes
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

// Create the multer instance
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Handle the upload route
const handleUpload = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        // Generate the URL to the uploaded image
        const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
        console.log(imageUrl)
        return res.status(201).json({
            message: 'File uploaded successfully',
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Use the multer middleware for the /upload route
app.post("/upload", upload.single('image'), handleUpload);

app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
});
