import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const Register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate request body
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required.",
                status: false,
            });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already in use.",
                status: false,
            });
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(12);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // Respond with success
        return res.status(201).json({
            message: "Account created successfully.",
            status: true,
            user: { id: newUser.id, email: newUser.email, name: newUser.name },
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({
            message: "An internal server error occurred.",
            status: false,
        });
    }
};

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate request body
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are mandatory.",
                status: false,
            });
        }

        // Find user by email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({
                message: "Invalid email or password.",
                status: false,
            });
        }

        // Validate password
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password.",
                status: false,
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Set token in cookies and respond
        res.cookie("token", token);

        return res.status(200).json({
            message: "User logged in successfully.",
            status: true,
            user
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "An internal server error occurred.",
            status: false,
        });
    }
};

export const Logout = async (req, res) => {
    try {
        // Clear the token cookie
        res.cookie("token", null, {
            expires: new Date(0),
        });

        return res.status(200).json({
            message: "Logged out successfully.",
            status: true,
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            message: "An internal server error occurred.",
            status: false,
        });
    }
};

export const GetProfile = async (req, res) => {
    try {
        // Assuming `req.user` is set via middleware
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized. Please log in.",
                status: false,
            });
        }

        return res.status(200).json({
            message: "User profile fetched successfully.",
            user,
            status: true,
        });
    } catch (error) {
        console.error("GetProfile error:", error);
        return res.status(500).json({
            message: "An internal server error occurred.",
            status: false,
        });
    }
};
