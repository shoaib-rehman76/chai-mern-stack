import jwt from "jsonwebtoken";
import { ApiError } from "../helpers/ApiError.js";
import { asyncHandler } from "../helpers/AsyncHandlers.js";
import { User } from "../models/user.model.js";

export const isAuthenticated = asyncHandler(async (req, _, next) => {
    try {
        const token = req?.cookies.accessToken || req.header("Authorization")?.split(' ')[1]

        if (!token) {
            throw new ApiError(401, 'unAuthorized')
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select('-password -refreshToken')

        if (!user) {
            throw new ApiError(401, 'invalid access token')
        }

        req.userInfo = user;
        next()
    } catch (error) {
        throw new ApiError(401, 'invalid access token')
    }
})