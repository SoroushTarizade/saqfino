import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface IEmailVerificationToken
  extends Document {
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
}

const emailVerificationTokenSchema =
  new Schema<IEmailVerificationToken>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      tokenHash: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      expiresAt: {
        type: Date,
        required: true,
      },
    },
    {
      timestamps: {
        createdAt: true,
        updatedAt: false,
      },
    },
  );

// MongoDB automatically removes expired documents.
emailVerificationTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 },
);

const EmailVerificationToken: Model<IEmailVerificationToken> =
  mongoose.models.EmailVerificationToken ||
  mongoose.model<IEmailVerificationToken>(
    "EmailVerificationToken",
    emailVerificationTokenSchema,
  );

export default EmailVerificationToken;
