const allowRoles = (...roles) => {
    return (req, res, next) => {
        const { roles: user_roles } = req.user

        if (roles.includes(user_roles[0].role_name)) {
            return next();
        }
        res.status(403).json({ error: `Requires one of these roles: ${roles.join(', ')}` });
    };
};

export default allowRoles