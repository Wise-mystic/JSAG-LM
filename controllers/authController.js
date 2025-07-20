const AdminUser = require('../models/AdminUser');
const { validatePasswordStrength } = require('../utils/passwordUtils');

class AuthController {
    // Register new admin user
    async register(req, res) {
        try {
            console.log('Registration request body:', req.body);
            
            const { email, password, name } = req.body;
            
            // Validate required fields
            if (!email || !password || !name) {
                return res.status(400).json({ 
                    error: 'All fields are required: email, password, name' 
                });
            }

            // Validate password strength
            const passwordValidation = validatePasswordStrength(password);
            if (!passwordValidation.isValid) {
                return res.status(400).json({ 
                    error: passwordValidation.errors.join(', ') 
                });
            }

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ 
                    error: 'Please enter a valid email address' 
                });
            }

            // Check if user already exists
            const existingUser = await AdminUser.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            // Create new admin user
            const adminUser = new AdminUser({
                email,
                password,
                name
            });

            await adminUser.save();

            res.status(201).json({ 
                message: 'Admin user created successfully',
                user: {
                    id: adminUser._id,
                    email: adminUser.email,
                    name: adminUser.name
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Registration failed' });
        }
    }

    // Login admin user
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await AdminUser.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Check password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Set session
            req.session.userId = user._id;
            req.session.userEmail = user.email;
            req.session.userName = user.name;

            res.json({
                message: 'Login successful',
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Login failed' });
        }
    }

    // Logout admin user
    async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: 'Logout failed' });
            }
            res.json({ message: 'Logout successful' });
        });
    }

    // Check authentication status
    async getAuthStatus(req, res) {
        if (req.session && req.session.userId) {
            res.json({
                authenticated: true,
                user: {
                    id: req.session.userId,
                    email: req.session.userEmail,
                    name: req.session.userName
                }
            });
        } else {
            res.json({ authenticated: false });
        }
    }
}

module.exports = new AuthController(); 