import mongoose from "mongoose";
import pkg from "validator";
const { isEmail } = pkg;
const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      lowercase: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    address: {
      type: String,
      required: true,
      maxlength: 400,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      require: [true, "store owner is required"],
    },
    OverallRatings: {
      type: Number,
      default: 0,
      max: 5,
      min: 0,
    },
    totalRatingsCount: {
      // New field
      type: Number,
      default: 0,
    },
    ratings: {
      type: [
        {
          userName: {
            type: String,
            trim: true,
            required: [true, "please enter user's name"],
          },
          userRating: {
            type: Number,
            default: 0,
            max: 5,
            min: 0,
          },
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

storeSchema.pre("save", function (next) {
  if (this.ratings.length > 0) {
    const totalRatings = this.ratings.reduce((acc, rating) => acc + rating.userRating, 0);
    this.OverallRatings = totalRatings / this.ratings.length;
    this.totalRatingsCount = this.ratings.length; // Calculate total ratings count
  } else {
    this.OverallRatings = 0;
    this.totalRatingsCount = 0; // Set to 0 if no ratings
  }
  next();
});

const Store = mongoose.model("Store", storeSchema);
export default Store;
