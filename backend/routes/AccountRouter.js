import express from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/AccountController.js';
import fetchuser from '../middleware/fetchuser.js'; // Centralized middleware import

const router = express.Router();

// GET  /account/profile
router.get('/profile', fetchuser, getProfile);

// POST /account/update
router.post('/update', fetchuser, updateProfile);

// POST /account/changepassword
router.post('/changepassword', fetchuser, changePassword);

export default router;