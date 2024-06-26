import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // HASH THE PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    // CREATE A NEW USER AND SAVE TO DB
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    const age = 1000 * 60 * 60 * 24 * 7; // 1 week
    const token = jwt.sign({
      id: newUser.id,
      isAdmin: true, // Example of adding additional claims to the token
    }, process.env.JWT_SECRET_KEY, { expiresIn: age });

    const { password: userPassword,...userInfo } = newUser;

    res.status(201).json({userInfo,accessToken:token});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create user!" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ message: 'Invalid Credentials!' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid Credentials!' });

    const age = 1000 * 60 * 60 * 24 * 7; // 1 week
    const token = jwt.sign({
      id: user.id,
      isAdmin: true, // Example of adding additional claims to the token
    }, process.env.JWT_SECRET_KEY, { expiresIn: age });

    const { password: userPassword,...userInfo } = user;

    res.status(200).json({userInfo,accessToken:token});

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to log in!" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    domain: '.estate-2qkt.onrender.com', // Ensure this matches the domain set in the login cookie
    path: '/', // Ensure path is set correctly
    secure: true, // Ensure this is consistent with the login cookie
    sameSite: 'None', // Ensure this is consistent with the login cookie
  }).status(200).json({ message: "Logout successful" });
};