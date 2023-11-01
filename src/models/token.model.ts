import mongoose, { Document, Model } from 'mongoose';

interface IToken extends Document {
  refreshToken: string;
  ip: string;
  userAgent: string;
  isValid: boolean;
  user: mongoose.Types.ObjectId;
}

const TokenSchema = new mongoose.Schema(
  {
    refreshToken: { type: String, required: true },
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    isValid: { type: Boolean, default: true },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const Token: Model<IToken> = mongoose.model<IToken>('Token', TokenSchema);


