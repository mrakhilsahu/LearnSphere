import mongoose from "mongoose";
import Course from "../models/Course.js";
import User from "../models/User.js";
import mailSender from "../utils/mailsender.js";

// ================= MOCK PAYMENT =================

// capture payment & create fake order
export const capturePayment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const uid = new mongoose.Types.ObjectId(userId);

    if (course.studentsEnrolled.includes(uid)) {
      return res.status(400).json({
        success: false,
        message: "User already enrolled in this course",
      });
    }

    // ================= MOCK ORDER =================
    // This simulates Razorpay response
    const paymentResponse = {
      id: `order_test_${Date.now()}`,
      amount: course.price * 100,
      currency: "INR",
      receipt: `receipt_${courseId}`,
      status: "created",
      notes: { courseId, userId },
    };

    return res.status(200).json({
      success: true,
      message: "Order created successfully (mock)",
      data: paymentResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while creating order",
      error: error.message,
    });
  }
};

// ================= MOCK WEBHOOK =================
// This simulates Razorpay webhook processing
export const razorpayWebhook = async (req, res) => {
  try {
    const { userId, courseId } = req.body; // frontend can send this directly in mock mode

    // enroll student in course
    await Course.findByIdAndUpdate(courseId, {
      $push: { studentsEnrolled: userId },
    });

    // add course to user's enrolled courses
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { courses: courseId } },
      { new: true }
    );

    // send confirmation email
    await mailSender(
      user.email,
      "Course Enrollment Successful",
      `<p>You are successfully enrolled in the course (mock payment).</p>`
    );

    return res.status(200).json({
      success: true,
      message: "Webhook processed successfully (mock)",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Webhook error",
      error: error.message,
    });
  }
};
