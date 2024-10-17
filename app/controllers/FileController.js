// controllers/FileController.js

const fs = require('fs');
const path = require('path');

// Handle file upload (Multer middleware will handle the file itself)
exports.uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }
    res.status(200).json({ msg: 'File uploaded successfully', file: req.file });
};

// Read a file by filename
exports.readFile = (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, '../../uploads/', fileName);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(404).json({ msg: 'File not found' });
        }

        res.setHeader('Content-Type', 'application/octet-stream');
        res.send(data);
    });
};

// Delete a file by filename
exports.deleteFile = (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, '../../uploads/', fileName);

    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(404).json({ msg: 'File not found' });
        }
        res.status(200).json({ msg: 'File deleted successfully' });
    });
};
