// routes/users.js
const express = require('express');
const upload = require('../middleware/multer');
const {
    register,
    login,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getConfirmedAppointments,
    updateUserFields  
} = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Handle OPTIONS requests for all routes
router.options('*', (req, res) => {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.header('Access-Control-Max-Age', '86400');
    res.sendStatus(200);
});

// Handle OPTIONS requests specifically for /login
router.options('/login', (req, res) => {
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.header('Access-Control-Max-Age', '86400');
    res.sendStatus(200);
});

router.post('/register', upload.single('image'), register);
router.post('/login', login);
router.get('/', auth(['admin']), getAllUsers);
router.get('/profile', auth(['user']), getUserById);
router.get('/:userId', auth(['admin', 'trainer']), getUserById);
router.put('/profile', auth(['user']), upload.single('image'), updateUser); 
router.put('/update-fields', auth(['user']), updateUserFields);
router.delete('/:userId', auth(['admin']), deleteUser);
router.get('/:userId/confirmed-appointments', auth(['user']), getConfirmedAppointments);

module.exports = router;