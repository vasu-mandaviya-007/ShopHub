import jwt from 'jsonwebtoken';

const fetchAdmin = (req, res, next) => {
    // Admin frontend se 'admin-token' aayega
    const token = req.header('admin-token'); 

    if (!token) {
        return res.status(401).json({ success: false, error: 'Access Denied. No token provided.' });
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);

        // Check if role is admin
        if (data.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Access Denied. You are not an Admin.' });
        }

        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, error: 'Invalid or expired token.' });
    }
};

export default fetchAdmin;