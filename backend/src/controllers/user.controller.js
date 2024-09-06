import { asyncHandler } from "../helpers/AsyncHandlers.js";
import { ApiError } from "../helpers/ApiError.js"
import { User } from '../models/user.model.js'
import uploadOnCloudnary from '../helpers/Cloudnary.js'
import { ApiResponse } from "../helpers/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
    const { fullName, userName, email, password } = req.body

    // check for validation
    if ([userName, email, fullName, password].some((field) => field.trim() === "")) {
        throw new ApiError(400, 'All fields are required')
    }

    // check for existing user
    const existingUser = await User.findOne({
        $or: [{ email }, { userName }]
    })

    if (existingUser) {
        throw new Error(409, 'User already exists')
    }

    // check for images
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, 'Avartar file is required')
    }

    const avatar = await uploadOnCloudnary(avatarLocalPath)
    const coverImage = await uploadOnCloudnary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, 'Avartar file is required')
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: avatar?.url || '',
        email,
        userName: userName.toLowerCase(),
    })

    const createdUser = await User.findById(user._id).select('-password -refreshToken')
    if (!createdUser) {
        throw new ApiError(500, 'Something went wrong while registering the user')
    }
    return res.status(200).json(
        new ApiResponse(200, createdUser, 'User registered Successfully')
    )
})

export { registerUser }