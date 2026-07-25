// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(
//   process.env.GEMINI_API_KEY
// );

// export const getFashionRecommendation = async (
//   req,
//   res
// ) => {
//   const {
//     occasion,
//     gender,
//     color,
//     budget,
//     season,
//   } = req.body;

//   const model = genAI.getGenerativeModel({
//     model: "gemini-1.5-flash",
//   });

//   const prompt = `
// You are a professional fashion stylist.

// Customer Details:
// Occasion: ${occasion}
// Gender: ${gender}
// Color Preference: ${color}
// Budget: ${budget}
// Season: ${season}

// Return JSON only:

// {
//  "outfitName":"",
//  "fabric":"",
//  "color":"",
//  "style":"",
//  "accessories":"",
//  "estimatedPrice":"",
//  "reason":""
// }
// `;

//   const result = await model.generateContent(
//     prompt
//   );

//   const text =
//     result.response.text();

//   res.json(JSON.parse(text));
// };