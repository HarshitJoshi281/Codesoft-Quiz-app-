import mongoose from "mongoose";
const userSchema = new mongoose.Schema({

  Email: String,
  Password : String
});
const user = mongoose.model('user', userSchema);
export default user
