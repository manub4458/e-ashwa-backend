"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyOtp = exports.forgotPassword = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = require("bcrypt");
const user_1 = __importDefault(require("../model/user"));
const otplib_1 = require("otplib");
const emailer_1 = require("../utils/emailer");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const expression = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
        if (!pass.test(password.toString())) {
            return res.status(407).json({
                message: "Enter valid password with uppercase, lowercase, number & @",
            });
        }
        if (!expression.test(email.toString())) {
            return res.status(407).json({ message: "Enter valid email" });
        }
        const existinguser = yield user_1.default.findOne({ email });
        if (existinguser) {
            return res.status(400).json({ ok: false, message: "User already Exist" });
        }
        const newUser = new user_1.default({
            name,
            email,
            password,
        });
        yield newUser.save();
        res.status(200).json({ message: "registered successfully" });
    }
    catch (err) {
        res.status(407).json({ message: err });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return res.status(409).json({
                message: "User doesn't exist"
            });
        }
        const isMatch = (0, bcrypt_1.compareSync)(password, user.password);
        if (!isMatch) {
            return res.status(409).json({
                message: "Invalid credentials"
            });
        }
        const authToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET_KEY || " ", { expiresIn: '30m' });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET_KEY || " ", { expiresIn: '2h' });
        res.cookie('authToken', authToken, ({ httpOnly: true }));
        res.cookie('refreshToken', refreshToken, ({ httpOnly: true }));
        res.header('Authorization', `Bearer ${authToken}`);
        res.status(200).json({ ok: true, message: "User login successfully", userId: user.id, userEmail: user.email, authToken: authToken });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User with this email does not exist" });
        }
        const otp = otplib_1.authenticator.generateSecret().slice(0, 6);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        user.passwordResetToken = otp;
        user.tokenExpire = otpExpiry;
        yield user.save();
        (0, emailer_1.sendMail)(user.email, "Password Reset OTP", `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`);
        res.status(200).json({ message: "OTP sent to your email" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.forgotPassword = forgotPassword;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User with this email does not exist" });
        }
        if (user.passwordResetToken.length === 0 || (user.tokenExpire && user.tokenExpire < new Date())) {
            return res.status(400).json({ message: "OTP has expired" });
        }
        const isMatch = (0, bcrypt_1.compareSync)(otp, user.passwordResetToken);
        if (!isMatch) {
            return res.status(409).json({
                message: "Invalid otp"
            });
        }
        user.isVerified = true;
        yield user.save();
        res.status(200).json({ message: "OTP verified successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.verifyOtp = verifyOtp;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, newPassword } = req.body;
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User with this email does not exist" });
        }
        if (!user.isVerified) {
            return res.status(400).json({ message: "User is not verified. Please verify the OTP first." });
        }
        user.password = newPassword;
        user.passwordResetToken = '';
        user.tokenExpire = null;
        user.isVerified = false;
        yield user.save();
        res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.resetPassword = resetPassword;
