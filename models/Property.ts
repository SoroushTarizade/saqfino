import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type PropertyTransactionType =
  | "buy"
  | "rent";

export type PropertyType =
  | "apartment"
  | "house"
  | "villa"
  | "land"
  | "commercial";

export type PropertyStatus =
  | "pending"
  | "active"
  | "rejected";

export interface IProperty
  extends Document {
  userId: mongoose.Types.ObjectId;

  title: string;

  transactionType:
    | "buy"
    | "rent";

  propertyType:
    | "apartment"
    | "house"
    | "villa"
    | "land"
    | "commercial";

  area: number;
  bedrooms: number;
  floor: number;
  totalFloors: number;
  yearBuilt: number;

  salePrice?: number;
  deposit?: number;
  rent?: number;

  amenities: string[];

  description: string;

  city: string;
  district: string;

  latitude: number;
  longitude: number;

  images: string[];

  status:
    | "pending"
    | "active"
    | "rejected";

  rejectionReason?: string;

  createdAt: Date;
  updatedAt: Date;
}

const propertySchema =
  new Schema<IProperty>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      title: {
        type: String,
        required: true,
        trim: true,
      },

      transactionType: {
        type: String,
        enum: ["buy", "rent"],
        required: true,
      },

      propertyType: {
        type: String,
        enum: [
          "apartment",
          "house",
          "villa",
          "land",
          "commercial",
        ],
        required: true,
      },

      area: {
        type: Number,
        required: true,
        min: 1,
      },

      bedrooms: {
        type: Number,
        required: true,
        min: 0,
      },

      floor: {
        type: Number,
        required: true,
        min: 0,
      },

      totalFloors: {
        type: Number,
        required: true,
        min: 1,
      },

      yearBuilt: {
        type: Number,
        required: true,
        min: 1300,
        max: 1405,
      },

      salePrice: {
        type: Number,
        min: 0,
      },

      deposit: {
        type: Number,
        min: 0,
      },

      rent: {
        type: Number,
        min: 0,
      },

      amenities: {
        type: [String],
        default: [],
      },

      description: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      district: {
        type: String,
        required: true,
        trim: true,
      },

      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },

      images: {
        type: [String],
        default: ["/images/default.png"],
      },

      status: {
        type: String,
        enum: [
          "pending",
          "active",
          "rejected",
        ],
        default: "pending",
        required: true,
      },

      rejectionReason: {
        type: String,
        trim: true,
        default: "",
      },
    },
    {
      timestamps: true,
    },
  );

propertySchema.index({
  transactionType: 1,
  status: 1,
});

propertySchema.index({
  city: 1,
  district: 1,
});

const Property: Model<IProperty> =
  mongoose.models.Property ||
  mongoose.model<IProperty>(
    "Property",
    propertySchema,
  );

export default Property;