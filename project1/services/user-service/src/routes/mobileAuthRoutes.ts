import express from 'express';
import * as mobileAuthController from '../controllers/mobileAuthController';

const router = express.Router();

/**
 * @route   POST /api/mobile-auth/send-code
 * @desc    ارسال کد تایید به شماره موبایل (ورود)
 * @access  Public
 */
router.post('/send-code', mobileAuthController.sendVerificationCode);

/**
 * @route   POST /api/mobile-auth/send-otp
 * @desc    ارسال کد تایید به شماره موبایل (ورود) - alias
 * @access  Public
 */
router.post('/send-otp', mobileAuthController.sendVerificationCode);

/**
 * @route   POST /api/mobile-auth/verify-code
 * @desc    تایید کد و ورود/ثبت‌نام کاربر
 * @access  Public
 */
router.post('/verify-code', mobileAuthController.verifyCode);

/**
 * @route   POST /api/mobile-auth/verify-otp
 * @desc    تایید کد و ورود/ثبت‌نام کاربر - alias
 * @access  Public
 */
router.post('/verify-otp', mobileAuthController.verifyCode);

/**
 * @route   POST /api/mobile-auth/register
 * @desc    ثبت‌نام با اطلاعات کامل و ارسال کد تایید
 * @access  Public
 */
router.post('/register', mobileAuthController.register);

/**
 * @route   POST /api/mobile-auth/verify-register
 * @desc    تایید کد و ثبت‌نام نهایی
 * @access  Public
 */
router.post('/verify-register', mobileAuthController.verifyRegister);

export default router;
