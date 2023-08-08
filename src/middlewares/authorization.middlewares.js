const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.session.user) return res.status(401).json({ message: "Unauthorized" });
        const user  = req.session.user;
        if (user.role === "ADMIN")return next();
        if ( user.role !== role ) {
            console.log(user.role)
            console.log(role)
            return res.status(403).json({ message: "Forbidden or unauthorized" });
        }
    next();
    };
};

export default authorization;