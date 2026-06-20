// ===================================> IMPORTS & CONFIG <=================================== //
import express from "express";
import cors from "cors";
import getConnection from "./utils/getConnection.js";

// Models
import Users from "./models/Users.js";
import Cart from "./models/Cart.js"; 

// Routers
import ProductRouter from "./routes/ProductRouter.js";
import OrderRouter from "./routes/OrderRouter.js";
import OrderRouter2 from "./routes/OrderRouter2.js";
import AccountRouter from "./routes/AccountRouter.js";
import CartRouter from "./routes/CartRouter.js";
import dashboardRouter from "./routes/DashboardRouter.js";

// Controllers
import Register from "./controllers/Register.js";
import Login from "./controllers/Login.js";
import ForgetPass from "./controllers/ForgetPass.js";
import VerifyOtp from "./controllers/VerifyOtp.js";
import GetOtpTimer from "./controllers/GetOtpTimer.js";
import UpdatePass from "./controllers/UpdatePass.js";
// import connectCloudinary from "./config/cloudinary.js";

// Initialization
const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',')
    : [];


// await connectCloudinary();

// ===================================> MIDDLEWARES <=================================== //

app.use(
    cors({
        // Production me hamesha .env variables use karna best hota he
        origin: allowedOrigins,
        methods: ["POST", "GET", "PUT", "DELETE"], // Added standard methods for future use
        credentials: true,
    })
);

app.use(express.json());

// ===================================> DATABASE CONNECTION <=================================== //
getConnection();

// ===================================> HEALTH CHECK ROUTE <=================================== //
app.get("/", async (req, res) => {
    try {
        // your code logic 
        res.json("Success");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

// ===================================> USER AUTHENTICATION APIS <=================================== //
import adminAuthRouter from './routes/AdminAuthRouter.js';
import adminSettingsRouter from './routes/AdminSettingsRouter.js';


// Baaki code ke sath isko mount kar do
app.use('/admin', adminSettingsRouter);


app.use('/admin/auth', adminAuthRouter); 

// ... baaki middlewares aur routes


app.post("/signup", Register);
app.post("/login", Login);
app.post("/forgetpass", ForgetPass);
app.post("/verify", VerifyOtp); 
app.post("/GetOtpTimer", GetOtpTimer);
app.post("/UpdatePass", UpdatePass);

// ===================================> MODULE ROUTERS <=================================== //
app.use("/products", ProductRouter);
app.use("/orders", OrderRouter);
app.use("/orders2", OrderRouter2);
app.use("/account", AccountRouter);
app.use("/cart", CartRouter);
app.use('/dashboard', dashboardRouter)

// ===================================> ADMIN APIS <=================================== //
app.post("/adminremove", async (req, res) => {
    try {
        let { id } = req.body;
        let product = await Cart.find({});

        for (let cartproduct of product) {
            for (let i = 0; i < cartproduct.items.length; i++) {
                let item = cartproduct.items[i];
                if (item.productId === Number(id).toString()) {
                    cartproduct.items.splice(i, 1);
                    console.log("Removed:", item);
                }
            }
            await cartproduct.save();
        }

        // Yahan maine response add kiya he taki request infinite loading me na fase
        res.status(200).json({ success: true, message: "Item removed successfully" });
    } catch (error) {
        console.error("Admin Remove Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// ===================================> SERVER START <=================================== //
app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on port " + port);
    } else {
        console.log("Error : " + error);
    }
});