import jwt from "jsonwebtoken";

const fetchuser = (req, res, next) => {
    // Get token from header
    const token = req.header('auth-token');

    if (!token) {
        return res.status(401).json({ success: false, error: 'Access Denied. Please login first.' });
    }

    try {
        // Verify token
        const data = jwt.verify(token, process.env.JWT_SECRET || 'secret_ecom');
        req.user = data.user;
        next(); // Token sahi he, ab aage controller pe jao
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({ success: false, error: 'Invalid or expired token. Please login again.' });
    }
};

export default fetchuser;