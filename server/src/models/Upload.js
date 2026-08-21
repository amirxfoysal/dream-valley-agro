import mongoose from 'mongoose';

// Binary uploads stored in MongoDB so images survive serverless deployments
// (Vercel) where the local filesystem is ephemeral.
const uploadSchema = new mongoose.Schema(
  {
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true, default: 'image/jpeg' },
  },
  { timestamps: true }
);

const Upload = mongoose.model('Upload', uploadSchema);

export default Upload;
