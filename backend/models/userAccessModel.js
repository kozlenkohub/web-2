import mongoose from 'mongoose';

const userAccessSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true },
});

const UserAccessModel = mongoose.model('UserAccess', userAccessSchema);
export default UserAccessModel;
