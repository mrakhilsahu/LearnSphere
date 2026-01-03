import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/database.js";
import cloudinaryConnect from "./config/cloudinary.js";

// routes
import authRoutes from "./routes/Auth.js";
import courseRoutes from "./routes/Course.js";
import categoryRoutes from "./routes/Category.js";
import paymentRoutes from "./routes/Payment.js";
import userRoutes from "./routes/User.js";
import ratingRoutes from "./routes/RatingAndReviews.js";
import profileRoutes from "./routes/Profile.js";
import resetPasswordRoutes from "./routes/ResetPassword.js";
import sectionRoutes from "./routes/Section.js";
import subSectionRoutes from "./routes/SubSection.js";





dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* DB + Cloudinary */
connectDB();
cloudinaryConnect();

/* Middlewares (NO fileUpload here) */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

/* Routes */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/rating", ratingRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/password", resetPasswordRoutes);
app.use("/api/v1/section", sectionRoutes);
app.use("/api/v1/subsection", subSectionRoutes);


app.get("/", (req, res) => {
  res.json({ success: true, message: "LearnSphere Backend is running" });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
