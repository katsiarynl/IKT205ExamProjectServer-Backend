import mongoose from "mongoose";
const { Schema, model } = mongoose;

const restrauntSchema = new Schema({
  name: String,
  address: String,
  rating: Number,
  photos: String,
  menu: [
    {
      category: String,
      meals: [
        {
          name: String,
          price: String,
          description: String,
        },
      ],
    },
  ],
});

const Restraunt = model("Restraunt", restrauntSchema);

export { Restraunt };
