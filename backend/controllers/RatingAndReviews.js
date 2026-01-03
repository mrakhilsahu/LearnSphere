import Rating from "../models/RatingAndReviews.js";

/* ================= CREATE RATING & REVIEW ================= */
export const createRatingAndReview = async (req, res) => {
  try {
    const { rating, review, courseId } = req.body;

    if (!rating || !courseId) {
      return res.status(400).json({ success: false, message: "Rating and courseId are required" });
    }

    const newRating = await Rating.create({
      rating,
      review,
      course: courseId,
      user: req.user.id,
    });

    return res.status(201).json({ success: true, data: newRating });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to create rating", error: error.message });
  }
};

/* ================= GET AVERAGE RATING ================= */
export const getAverageRating = async (req, res) => {
  try {
    const result = await Rating.aggregate([
      { $match: { course: req.params.courseId } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ]);

    return res.status(200).json({
      success: true,
      averageRating: result[0]?.averageRating || 0,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to fetch average rating", error: error.message });
  }
};

/* ================= GET ALL RATINGS & REVIEWS ================= */
export const getAllRatingsAndReviews = async (req, res) => {
  try {
    const ratings = await Rating.find()
      .populate("user", "firstName lastName email") // only fetch user basic info
      .populate("course", "title description"); // only fetch course basic info

    return res.status(200).json({ success: true, data: ratings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to fetch ratings", error: error.message });
  }
};
