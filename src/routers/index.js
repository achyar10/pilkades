import express from 'express'
import AuthController from '../controllers/AuthController'
import CandidateController from '../controllers/CandidateController'
import DistrictController from '../controllers/DistrictController'
import HomeController from '../controllers/HomeController'
import LandingController from '../controllers/LandingController'
import ProfileController from '../controllers/ProfileController'
import SettingController from '../controllers/SettingController'
import TpsController from '../controllers/TpsController'
import UserController from '../controllers/UserController'
import VoteController from '../controllers/VoteController'
import { isAuth, isLogin } from '../middlewares/auth'

const router = express.Router()

router.route('/').get(LandingController.index)
router.route('/timses').get(LandingController.timses)
router.route('/result/detail').get(LandingController.details)
router.route('/api/candidates').get(LandingController.detailCandidate)

router.route('/dashboard').get(isAuth, HomeController.index)

router.route('/login').get(isLogin, AuthController.getLogin)
router.route('/login').post(isLogin, AuthController.doLogin)
router.route('/logout').get(isAuth, AuthController.logout)

// Profile
router.route('/profile').get(isAuth, ProfileController.get)
router.route('/profile/edit').get(isAuth, ProfileController.edit)
router.route('/profile/cpw').post(isAuth, ProfileController.cpw)
router.route('/profile/edit').post(isAuth, ProfileController.editProcess)

// District
router.route('/district').get(isAuth, DistrictController.index)
router.route('/district/add').get(isAuth, DistrictController.add)
router.route('/district/add').post(isAuth, DistrictController.create)
router.route('/district/edit/:id').get(isAuth, DistrictController.edit)
router.route('/district/edit/:id').post(isAuth, DistrictController.change)

// TPS
router.route('/tps').get(isAuth, TpsController.index)
router.route('/tps/add').get(isAuth, TpsController.add)
router.route('/tps/add').post(isAuth, TpsController.create)
router.route('/tps/edit/:id').get(isAuth, TpsController.edit)
router.route('/tps/edit/:id').post(isAuth, TpsController.change)

// Candidate
router.route('/candidate').get(isAuth, CandidateController.index)
router.route('/candidate/add').get(isAuth, CandidateController.add)
router.route('/candidate/add').post(isAuth, CandidateController.create)
router.route('/candidate/edit/:id').get(isAuth, CandidateController.edit)
router.route('/candidate/edit/:id').post(isAuth, CandidateController.change)

// Vote
router.route('/vote').get(isAuth, VoteController.index)
router.route('/vote/removeall').get(isAuth, VoteController.removeAll)
router.route('/vote/add').get(isAuth, VoteController.add)
router.route('/vote/add').post(isAuth, VoteController.create)
router.route('/vote/edit/:id').get(isAuth, VoteController.edit)
router.route('/vote/edit/:id').post(isAuth, VoteController.change)

// Plano
router.route('/plano').get(isAuth, TpsController.plano)
router.route('/plano').post(isAuth, TpsController.uploadPlano)

// Users
router.route('/user').get(isAuth, UserController.index)
router.route('/user/add').get(isAuth, UserController.add)
router.route('/user/add').post(isAuth, UserController.create)
router.route('/user/edit/:id').get(isAuth, UserController.edit)
router.route('/user/edit/:id').post(isAuth, UserController.change)
router.route('/user/cpw/:id').get(isAuth, UserController.cpw)
router.route('/user/cpw/:id').post(isAuth, UserController.cpwProcess)
router.route('/user/votes').get(isAuth, UserController.votes)

// Setting
router.route('/setting').get(isAuth, SettingController.index)
router.route('/setting').post(isAuth, SettingController.change)



export default router