import Customer from '../models/Customer.js';
import User from '../models/User.js';
import Measurement from '../models/Measurement.js';
import asyncHandler from '../utils/asyncHandler.js';


import Groq from "groq-sdk";

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// @desc    Get all customers


export const getCustomers = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  let customers = await Customer.find()
    .populate('user', 'name email phone isActive')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(Number(limit));

  if (search) {
    const regex = new RegExp(search, 'i');
    customers = customers.filter(
      (c) => regex.test(c.user?.name) || regex.test(c.user?.email)
    );
  }

  const total = await Customer.countDocuments();
  res.json({ customers, total, page: Number(page) });
});

// @desc    Get customer profile
export const getCustomerProfile = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({ user: req.user._id }).populate(
    'user',
    'name email phone avatar'
  );

  if (!customer) {
    res.status(404);
    throw new Error('Customer profile not found');
  }

  const measurements = await Measurement.find({ customer: customer._id }).sort('-createdAt');
  res.json({ customer, measurements });
});

// @desc    Update customer profile
export const updateCustomerProfile = asyncHandler(async (req, res) => {
  const { name, phone, address, city, state, zipCode, notes } = req.body;

  if (name || phone) {
    await User.findByIdAndUpdate(req.user._id, {
      ...(name && { name }),
      ...(phone && { phone }),
    });
  }

  const customer = await Customer.findOneAndUpdate(
    { user: req.user._id },
    { address, city, state, zipCode, notes },
    { new: true }
  ).populate('user', 'name email phone avatar');

  res.json(customer);
});

// @desc    Upload reference images
export const uploadReferenceImages = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({ user: req.user._id });
  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  const images = req.files.map((f) => ({
    url: `/uploads/${f.filename}`,
    filename: f.filename,
  }));

  customer.referenceImages.push(...images);
  await customer.save();
  res.json(customer.referenceImages);
});

// @desc    Add modification request
export const addModificationRequest = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const customer = await Customer.findOne({ user: req.user._id });

  customer.modificationRequests.push({ title, description });
  await customer.save();
  res.status(201).json(customer.modificationRequests);
});





export const getFashionRecommendation = async (req, res) => {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const {
      occasion,
      gender,
      color,
      budget,
      season,
    } = req.body;

   const prompt = `
You are the Chief Fashion Designer of an internationally renowned luxury Indian couture boutique.

Your task is to design ONE premium outfit based on the customer's preferences.

Customer Details

Occasion: ${occasion}

Gender: ${gender}

Preferred Color: ${color}

Budget: ₹${budget}

Season: ${season}

--------------------------------------------------

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT use \`\`\`.

Return exactly this structure:

{
  "outfitName":"",
  "fabric":"",
  "color":"",
  "style":"",
  "embroidery":"",
  "neckDesign":"",
  "sleeves":"",
  "bottomStyle":"",
  "dupatta":"",
  "footwear":"",
  "hairstyle":"",
  "accessories":"",
  "estimatedPrice":"",
  "reason":"",
  "imagePrompt":""
}

--------------------------------------------------

Rules for recommendation

Design a fashionable Indian outfit.

If occasion is Wedding
→ create luxurious bridal couture.

If occasion is Party
→ glamorous designer wear.

If occasion is Festival
→ vibrant ethnic outfit.

If occasion is Office
→ elegant formal wear.

If occasion is Casual
→ stylish comfortable outfit.

Budget must be realistic.

Reason should explain WHY every design decision was made.

--------------------------------------------------

IMPORTANT

imagePrompt is NOT for humans.

imagePrompt is ONLY for an AI Image Generator.

Write approximately 500 words.

Describe everything visually.

The prompt MUST include:

Beautiful Indian fashion model

Age around 22-28

Natural glowing skin

Luxury makeup

Perfect facial features

Natural smile

Elegant confident pose

Looking towards camera

Full body

Front view

Fashion runway posture

--------------------------------------------------

Describe outfit in extreme detail.

Mention

Fabric texture

Embroidery

Thread work

Mirror work

Pearl work

Zari work

Stone work

Buttons

Sleeves

Neck design

Borders

Pleats

Layers

Dupatta

Footwear

Jewellery

Handbag if needed

Hairstyle

--------------------------------------------------

Background

Luxury Indian boutique showroom

Premium designer clothing racks

Warm wooden interiors

Luxury mirrors

Soft blurred background

Modern boutique

Luxury ambience

--------------------------------------------------

Lighting

Professional fashion photography

Soft studio lighting

Warm cinematic lighting

Luxury editorial lighting

--------------------------------------------------

Camera

Canon EOS R5

85mm Portrait Lens

Fashion Magazine

Vogue India

Bridal Catalogue

Luxury Boutique Advertisement

--------------------------------------------------

Quality Keywords

Ultra realistic

Hyper realistic

Photorealistic

RAW photo

Masterpiece

Best quality

8K

Highly detailed

Sharp focus

Luxury Indian couture

Professional fashion photography

Premium clothing textures

Award winning photography

Visible fabric texture

Visible embroidery

Perfect stitching

Magazine cover quality

--------------------------------------------------

Negative Prompt

No text

No logo

No watermark

No duplicate person

No extra hands

No extra fingers

No blurry image

No cartoon

No anime

No painting

No illustration

No CGI

No low quality

No distorted face

No cropped body

Only ONE model.

--------------------------------------------------

Return ONLY valid JSON.
`;
    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.9,
      });

    let text =
      completion.choices[0].message.content;

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    res.json(JSON.parse(text));

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const generateOutfitImage = async (req, res) => {
  try {

    const {
      imagePrompt,
      outfitName,
      fabric,
      color,
      style,
      embroidery,
      accessories,
      hairstyle,
      footwear,
    } = req.body;

    if (!imagePrompt) {
      return res.status(400).json({
        message: "Image prompt is missing",
      });
    }

    const finalPrompt = `
${imagePrompt}

Create an ultra realistic luxury Indian fashion catalogue photograph.

The subject is ONE elegant Indian female fashion model.

She is wearing:

Outfit Name:
${outfitName}

Fabric:
${fabric}

Primary Color:
${color}

Style:
${style}

Embroidery:
${embroidery}

Accessories:
${accessories}

Hairstyle:
${hairstyle}

Footwear:
${footwear}

The outfit should look handcrafted by a premium Indian designer boutique.

The fabric must show realistic folds, texture and detailed embroidery.

The stitching should appear premium and luxurious.

The model is standing naturally with a confident smile.

Pose:
Full body standing pose
Front facing
Natural hand position
Elegant posture

Facial Expression:
Soft smile
Natural makeup
Luxury fashion model

Hair:
${hairstyle}

Background:
Premium luxury boutique showroom
Modern Indian couture studio
Warm wooden interiors
Luxury mirrors
Designer clothing racks
Soft blurred background

Lighting:
Professional studio lighting
Soft cinematic lighting
Luxury fashion editorial lighting

Camera:
Canon EOS R5
85mm portrait lens
Fashion editorial photography
Magazine cover composition

Image Style:
Ultra realistic
Photorealistic
Hyper detailed
Luxury Indian couture
Designer catalogue
Fashion week editorial
Vogue India style
Premium boutique advertisement
Sharp focus
High quality fabric texture
Visible embroidery details
Natural skin texture
8K
Award winning fashion photography

Negative Prompt:
cartoon,
anime,
illustration,
painting,
3d render,
cgi,
plastic skin,
low quality,
low resolution,
pixelated,
blurry,
bad anatomy,
deformed face,
extra fingers,
extra arms,
cropped,
duplicate,
multiple people,
watermark,
logo,
text,
signature,
frame,
poor lighting,
oversaturated,
distorted clothing

masterpiece,
best quality,
RAW photo,
professional DSLR,
realistic,
fashion photography,
luxury designer outfit,
premium boutique,
highly detailed,
sharp focus
`;

    console.log(finalPrompt);

    const imageUrl =
`https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=768&height=1024&seed=${Date.now()}&enhance=true&nologo=true&model=flux`;

    res.json({
      imageUrl,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
export const getSizeRecommendation = async (req, res) => {
  try {

    const customer = await Customer.findOne({
      user: req.user._id,
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const measurement = await Measurement.findOne({
      customer: customer._id,
      isDefault: true,
    });

    if (!measurement) {
      return res.status(404).json({
        message: "Please save measurements first.",
      });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const prompt = `
You are an expert Indian boutique tailor with 20 years of experience.

Analyze the customer's body measurements and recommend the best fitting garment.

Measurements

Height: ${measurement.height} cm

Chest: ${measurement.chest} in

Waist: ${measurement.waist} in

Hip: ${measurement.hip} in

Shoulder: ${measurement.shoulder} in

Sleeve Length: ${measurement.sleeveLength} in

Neck: ${measurement.neck} in

Inseam: ${measurement.inseam} in
Return ONLY valid JSON.

{
"kurtaSize":"",
"shirtSize":"",
"blazerSize":"",
"trouserSize":"",
"lehengaWaist":"",
"fitType":"",
"confidence":"",
"recommendedNeck":"",
"recommendedSleeves":"",
"recommendedLength":"",
"recommendedBottom":"",
"recommendedFabric":"",
"recommendedOccasion":"",
"reason":""
}

Rules

Recommend the best boutique fitting.

Suggest neck style according to body shape.

Suggest sleeves according to proportions.

Suggest bottom style.

Suggest fabric according to comfort.

Confidence should be percentage.

Reason should explain every recommendation.
`;
    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

  let text =
  completion.choices[0].message.content;

text = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

const recommendation = JSON.parse(text);

// Save recommendation in Measurement
measurement.aiRecommendation = {
  recommendedSize:
    recommendation.kurtaSize ||
    recommendation.shirtSize ||
    "",

  shirtSize: recommendation.shirtSize,

  blazerSize: recommendation.blazerSize,

  trouserSize: recommendation.trouserSize,

  lehengaWaist: recommendation.lehengaWaist,

  fitType: recommendation.fitType,

  recommendedNeck:
    recommendation.recommendedNeck,

  recommendedSleeves:
    recommendation.recommendedSleeves,

  recommendedBottom:
    recommendation.recommendedBottom,

  recommendedFabric:
    recommendation.recommendedFabric,

  confidence: Number(
    String(recommendation.confidence)
      .replace("%", "")
  ) || 0,

  reason: recommendation.reason,
};

await measurement.save();

res.json(recommendation);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
};
export const virtualTryOn = async (
  req,
  res
) => {
  try {
    if (
      !req.files?.personImage ||
      !req.files?.outfitImage
    ) {
      return res.status(400).json({
        message:
          "Both images are required",
      });
    }

    const personImage =
      req.files.personImage[0];

    const outfitImage =
      req.files.outfitImage[0];

    console.log(
      "Person:",
      personImage.filename
    );

    console.log(
      "Outfit:",
      outfitImage.filename
    );

    /*
      HERE:
      Later connect
      IDM-VTON
      OOTDiffusion
      Replicate
      HuggingFace
    */

    return res.json({
      success: true,

      imageUrl: `/uploads/${outfitImage.filename}`,

      message:
        "Try-On placeholder generated",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Failed to generate try-on",
    });
  }
};
// @desc    Create customer (admin)

export const createCustomer = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address, city, state } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('Email already exists');
  }

  const user = await User.create({
    name,
    email,
    password: password || 'customer123',
    role: 'customer',
    phone,
  });

  const customer = await Customer.create({ user: user._id, address, city, state });
  const populated = await Customer.findById(customer._id).populate('user', 'name email phone');
  res.status(201).json(populated);
});
