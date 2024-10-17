const express = require('express');
const { registerStudent, loginStudent, getStudentProfile, updateStudentProfile } = require('../controllers/StudentController');
const { uploadFile, readFile, deleteFile } = require('../controllers/FileController');
const auth = require('../middlewares/AuthMiddleware');
const upload = require('../middlewares/FileUpload');

const router = express.Router();

// Student registration and login
router.post('/register', registerStudent);
router.post('/login', loginStudent);

// Student profile routes
router.get('/profile', auth, getStudentProfile);
router.put('/profile', auth, updateStudentProfile);

// File upload, read, and delete routes
router.post('/upload', upload.single('file'), uploadFile);
router.get('/file/:fileName', readFile);
router.delete('/file/:fileName', deleteFile);

module.exports = router;