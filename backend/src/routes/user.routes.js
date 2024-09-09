import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = Router()

router.route('/register').post(upload.fields([
    {
        name: 'avatar',
        maxCount: 1
    },
    {
        name: 'coverImage',
        maxCount: 1
    },
]), registerUser)

router.route('/login').post(loginUser)


// protected routes
router.route('/logout').post(isAuthenticated, loginUser)




export default router