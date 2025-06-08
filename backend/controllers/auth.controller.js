const { User } = require("../models/user.model");
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie");
const { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } = require("../mailtrap/emails");
const { isValidObjectId } = require("mongoose");
const { use } = require("../routes/auth.route");
const signUp = async (req, res) => {
    const { email, password, name} = req.body;

    try {
        if(!email || !password || !name) {
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists) {
            return res.status(400).json({success: false, message: 'User already exists'});
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken: verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hrs
        });

        await user.save();

        generateTokenAndSetCookie(res, user._id);

        try {
            await sendVerificationEmail(user.email, verificationToken);
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
        }
        
        res.status(201).json({
            success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
        })

    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    }

};

const verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: {$gt: Date.now()}
        });

        if(!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code"
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);
        res.status(201).json({
            success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
        })
    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    }
}

const logIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }
        const isValidPassword = await bcryptjs.compare(password, user.password);
        if(!isValidPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }
        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(201).json({
            success: true,
            message: "User Loggged In successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        })
    } catch(error) {
        console.log('Error in login', error);
        res.status(400).json({success: false, message: error.message});
    }
};

const logOut = async(req, res) => {
    res.clearCookie("jwtToken");
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
};

const forgotPassword = async(req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({
                success: false,
                message: 'User does not exists',
            })
        }
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        await user.save()
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`); 
        res.status(200).json({ success: true, message: 'Password reset link has sent to your email'});
    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now()}
        })
        if(!user) {
            res.status(400).json({ success: false, message: "Invalid or expired reset token"});
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword,
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        user.save();
        await sendResetSuccessEmail(user.email);
        res.status(200).json({ success: true, message: "Password reset successful"});
    } catch(error) {

    }
}

const checkAuth = async(req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error in checkAuth ", error);
        res.status(400).json({ success: false, message: error.message });
    }
}

module.exports = { signUp, logIn, logOut, verifyEmail, forgotPassword, resetPassword, checkAuth};