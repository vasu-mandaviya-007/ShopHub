const readOnlyGuard = (req, res, next) => {
    if (req.user && req.user.isDemo) {
        return res.status(403).json({
            success: false,
            // Naya short aur professional message
            error: "Action restricted in Demo Mode."
        });
    }
    next();
}; 

export default readOnlyGuard;