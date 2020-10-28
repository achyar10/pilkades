import express from 'express'
import AuthController from '../controllers/AuthController'
import HomeController from '../controllers/HomeController'
import ProfileController from '../controllers/ProfileController'
import TpsController from '../controllers/TpsController'
import { isAuth, isLogin } from '../middlewares/auth'

const router = express.Router()

router.route('/').get(isAuth, HomeController.index)

router.route('/login').get(isLogin, AuthController.getLogin)
router.route('/login').post(isLogin, AuthController.doLogin)
router.route('/logout').get(isAuth, AuthController.logout)

// Profile
router.route('/profile').get(isAuth, ProfileController.get)
router.route('/profile/edit').get(isAuth, ProfileController.edit)
// router.route('/profile/cpw').post(isAuth, ProfileController.cpw)
// router.route('/profile/edit').post(isAuth, ProfileController.editProcess)

// TPS
router.route('/tps').get(isAuth, TpsController.index)
router.route('/tps/add').get(isAuth, TpsController.add)
router.route('/tps/add').post(isAuth, TpsController.create)
router.route('/tps/edit/:id').get(isAuth, TpsController.edit)
router.route('/tps/edit/:id').post(isAuth, TpsController.change)



export default router