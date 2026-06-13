import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
export const authGuard = async (req, res, next) => {
    try {
        const authSession = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        if (!authSession?.user?.id) {
            return res.status(401).json({
                message: "User not logged in",
            });
        }
        const sessionUser = authSession.user;
        req.user = { ...sessionUser };
        return next();
    }
    catch (err) {
        console.error("AuthGuard error:", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
