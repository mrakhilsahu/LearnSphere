import User from "../models/User";
import Otp from "../models/Otp";

// send otp
exports.sendOtp = async (req, res) => {
  try {
    // fetch email from request body
    const { email } = req.body;

    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // generate unique otp
    let otp;
    let otpExists;

    do {
      otp = Math.floor(100000 + Math.random() * 900000).toString();
      otpExists = await Otp.findOne({ otp });
    } while (otpExists);

    // create otp entry in database
    await Otp.create({ email, otp });

    // return response
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

    
// signup code
exports.signup = async (req, res) => {
  try {
    // data fetch from req body
    const { firstName, email, password, confirmPassword, otp } = req.body;

    // validation
    if (!firstName || !email || !password || !confirmPassword || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // match password with confirm password
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match",
      });
    }

    // check user already exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // find most recent otp
    const recentOtp = await Otp.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    if (recentOtp.length === 0 || recentOtp[0].otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create entry in db
    const image = `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}`;

    await User.create({
      firstName,
      email,
      password: hashedPassword,
      image,
    });

    // return response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
};

// login
exports.login = async (req, res) => {
  try {
    // get data from req body
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // user exist or not
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist signup first",
      });
    }

    // password match
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // generate jwt
    const token = jwt.sign(
      { id: user._id, email: user.email },// this is payloder
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    // create cookie and send response
    return res
      .cookie("token", token, {
        httpOnly: true,        // these are option of cookie
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        token,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};
