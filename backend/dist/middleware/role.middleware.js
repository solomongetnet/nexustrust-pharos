export const roleGuard = (options) => {
    return (req, res, next) => {
        try {
            const sessionUser = req.user;
            if (!sessionUser?.id) {
                return res.status(401).json({
                    message: "User not authenticated",
                });
            }
            const userRole = sessionUser.role;
            // Block specific roles
            if (options.deniedRoles &&
                userRole &&
                options.deniedRoles.includes(userRole)) {
                return res.status(403).json({
                    message: "You are not allowed to access this resource",
                });
            }
            // Allow only specific roles
            if (options.allowedRoles &&
                userRole &&
                !options.allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    message: "You don't have permission to access this resource",
                });
            }
            return next();
        }
        catch (err) {
            console.error("RoleGuard error:", err);
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    };
};
