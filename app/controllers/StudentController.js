// controllers/StudentController.js

const Student = require('../model/StudentModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config');

// Student Registration
exports.registerStudent = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let student = await Student.findOne({email});
        if (student) return res.status(400).json({ msg: 'Student already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        student = new Student({ name, email, password: hashedPassword });
        await student.save();

        res.json({ msg: 'Student registered successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Student Login
exports.loginStudent = async (req, res) => {
    const { email, password } = req.body;

    try {
        const student = await Student.findOne({ email });
        if (!student) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: student._id }, config.secretKey, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });

        res.json({ msg: 'Student logged in successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Read Student Profile
exports.getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id);
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        res.json(student);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Update Student Profile
exports.updateStudentProfile = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const student = await Student.findById(req.user.id);
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        student.name = name || student.name;
        student.email = email || student.email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            student.password = await bcrypt.hash(password, salt);
        }

        await student.save();
        res.json({ msg: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};
