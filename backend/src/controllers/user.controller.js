import { asyncHandler } from "../helpers/AsyncHandlers.js";
import { ApiError } from "../helpers/ApiError.js"
import { User } from '../models/user.model.js'
import uploadOnCloudnary from '../helpers/Cloudnary.js'
import { ApiResponse } from "../helpers/ApiResponse.js";
import { generateAccessAndRefreshToken } from "../helpers/generateAccessAndRefreshToken.js";


const registerUser = asyncHandler(async (req, res) => {
    const { fullName, userName, email, password } = req.body

    // check for validation
    if ([userName, email, fullName, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, 'All fields are required')
    }

    // check for existing user
    const existingUser = await User.findOne({
        $or: [{ email }, { userName }]
    })

    if (existingUser) {
        return res.status(400).json(
            new ApiResponse(400, {}, 'User already exists')
        )
    }

    // check for images
    const avatarLocalPath = req.files?.avatar?.[0]?.path
    // const coverImageLocalPath = req?.files?.coverImage?.[0]?.path
    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req?.files?.coverImage?.[0]?.path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, 'Avatar file is required')
    }

    const avatar = await uploadOnCloudnary(avatarLocalPath)
    const coverImage = await uploadOnCloudnary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, 'Avartar file is required')
    }
    const prevUser = await User.findOne().sort({ 'createdAt': -1 });

    const user = await User.create({
        userId: prevUser?.userId ? prevUser?.userId + 1 : 1,
        userName: userName.toLowerCase(),
        email,
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || '',
        password
    })

    const createdUser = await User.findById(user._id).select('-password -refreshToken')

    if (!createdUser) {
        throw new ApiError(500, 'Something went wrong while registering the user')
    }

    return res.status(200).json(
        new ApiResponse(200, createdUser, 'User registered Successfully')
    )
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email })
    const isPasswordMatched = await existingUser.comparePassword(password)

    if (!email || !password) {
        return res.status(400).json(
            new ApiResponse(400, {}, 'Both fields are required')
        )
    }

    if (!existingUser) {
        return res.status(400).json(
            new ApiResponse(400, {}, 'No user found with the given email')
        )
    }

    if (!isPasswordMatched) {
        return res.status(400).json(
            new ApiResponse(401, {}, 'Invalid user credentials')
        )
    }


    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existingUser._id)

    const payload = {
        userId: existingUser.userId,
        userName: existingUser.userName,
        fullName: existingUser.fullName,
        email: existingUser.email,
        avatar: existingUser.avatar,
        coverImageUrl: existingUser.coverImage,
        watchHistory: existingUser.watchHistroy,
        createdAt: existingUser.createdAt,
        updatedAt: existingUser.updatedAt
    }

    const options = { secure: true, httpOnly: true }


    return res.status(400)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new ApiResponse(201, payload, 'login successfully', 1)
        )

})


const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.userInfo?._id, { $set: { refreshToken: undefined } }, { new: true })
    const options = { secure: true, httpOnly: true }
    res.status(401)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, 'logout successfully'))
})

export { registerUser, loginUser, logoutUser }