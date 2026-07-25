import mongoose from 'mongoose';

const measurementSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    height: { type: Number },
    chest: { type: Number },
    waist: { type: Number },
    shoulder: { type: Number },
    sleeveLength: { type: Number },
    hip: { type: Number },
    neck: { type: Number },
    inseam: { type: Number },
    additionalMeasurements: { type: Map, of: Number },
    notes: { type: String },
    aiRecommendation: {
  recommendedSize: String,
  shirtSize: String,
  blazerSize: String,
  trouserSize: String,
  lehengaWaist: String,
  fitType: String,
  recommendedNeck: String,
  recommendedSleeves: String,
  recommendedBottom: String,
  recommendedFabric: String,
  confidence: Number,
  reason: String,
},
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Measurement = mongoose.model('Measurement', measurementSchema);
export default Measurement;
