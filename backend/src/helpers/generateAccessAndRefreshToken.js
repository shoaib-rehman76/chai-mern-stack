import { User } from "../models/user.model.js"
import { ApiError } from "./ApiError.js"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findOne(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        user.refreshToken = refreshToken

        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, 'something went wrong')
    }
}

export { generateAccessAndRefreshToken }