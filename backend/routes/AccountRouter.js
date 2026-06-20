import express from 'express';
import { getProfile, updateProfile, changePassword, getAllCustomers, deleteCustomer, updateCustomer } from '../controllers/AccountController.js';
import fetchuser from '../middleware/fetchuser.js'; // Centralized middleware import
import Users from '../models/Users.js';
import fetchAdmin from '../middleware/fetchAdmin.js';
import readOnlyGuard from '../middleware/readOnlyGuard.js';


const router = express.Router();


router.get('/allusers', fetchAdmin, getAllCustomers);

/* ─────────────────────────────────────────────────
   2. UPDATE CUSTOMER (Admin Only)
   Endpoint: PUT /account/admin/update/:id
───────────────────────────────────────────────── */
router.put('/admin/update/:id', fetchAdmin, readOnlyGuard, updateCustomer); 

/* ─────────────────────────────────────────────────
   3. DELETE CUSTOMER (Admin Only)
   Endpoint: DELETE /account/admin/delete/:id
───────────────────────────────────────────────── */
router.delete('/admin/delete/:id', fetchAdmin, readOnlyGuard, deleteCustomer);




// GET  /account/profile
router.get('/profile', fetchuser, getProfile);

// POST /account/update
router.post('/update', fetchuser, updateProfile);

// POST /account/changepassword
router.post('/changepassword', fetchuser, changePassword);

export default router;