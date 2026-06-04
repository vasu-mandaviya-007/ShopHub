import express from "express";
import { addtocart, removefromcart, getcartitem } from "../controllers/CartController.js";
import fetchuser from "../middleware/fetchuser.js"; // Direct import, no duplicate logic

const router = express.Router();

router.post("/addtocart", fetchuser, addtocart);
router.post("/removefromcart", fetchuser, removefromcart);
router.post("/getcartitem", fetchuser, getcartitem);

export default router;