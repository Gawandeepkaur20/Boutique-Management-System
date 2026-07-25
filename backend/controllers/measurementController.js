import Measurement from '../models/Measurement.js';
import Customer from '../models/Customer.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Create/update measurements
export const saveMeasurement = asyncHandler(async (req, res) => {
  let customerId = req.body.customerId;

  if (req.user.role === 'customer') {
    const customer = await Customer.findOne({ user: req.user._id });
    customerId = customer._id;
  }

  const {
    height,
    chest,
    waist,
    shoulder,
    sleeveLength,
    hip,
    neck,
    inseam,
    additionalMeasurements,
    notes,
    isDefault,
  } = req.body;

  if (isDefault) {
    await Measurement.updateMany({ customer: customerId }, { isDefault: false });
  }

  const measurement = await Measurement.create({
    customer: customerId,
    height,
    chest,
    waist,
    shoulder,
    sleeveLength,
    hip,
    neck,
    inseam,
    additionalMeasurements,
    notes,
    isDefault: isDefault ?? true,
  });

  res.status(201).json(measurement);
});

// @desc    Get measurements for customer
export const getMeasurements = asyncHandler(async (req,res)=>{

  let customerId=req.params.customerId;
  
  if(req.user.role==="customer"){
  
  const customer=await Customer.findOne({
  user:req.user._id
  });
  
  customerId=customer._id;
  
  }
  
  const measurement=
  await Measurement.findOne({
  
  customer:customerId,
  
  isDefault:true
  
  }).sort("-createdAt");
  
  if(!measurement){
  
  return res.json({
  
  chest:"",
  waist:"",
  shoulder:"",
  sleeveLength:"",
  hip:"",
  neck:"",
  inseam:""
  
  });
  
  }
  console.log("Measurement from DB:", measurement);
  res.json(measurement);
  
  });
// @desc    Get single measurement
export const getMeasurement = asyncHandler(async (req, res) => {
  const measurement = await Measurement.findById(req.params.id).populate({
    path: 'customer',
    populate: { path: 'user', select: 'name email' },
  });

  if (!measurement) {
    res.status(404);
    throw new Error('Measurement not found');
  }

  res.json(measurement);
  
});
export const getAllMeasurements = asyncHandler(async (req, res) => {

    const measurements = await Measurement.find()
        .populate({
            path: "customer",
            populate: {
                path: "user",
                select: "name email phone"
            }
        });

    res.json(measurements);

});