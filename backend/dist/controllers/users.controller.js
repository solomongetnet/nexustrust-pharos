import { prisma } from "../config/prisma.config.js";
const userController = {
    async getUsers(req, res, next) {
        const users = await prisma.user.findMany();
        res.json({
            users,
            message: "this is users",
        });
    },
};
export default userController;
