import { useState } from "react";
import { Sparkles } from "lucide-react";
import api from "../../services/api";
import { showError } from "../../utils/toast";
import { useNavigate } from "react-router-dom";

export default function FashionAdvisor() {
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();
const [outfitImage, setOutfitImage] =
  useState("");
const createOrderFromAI = () => {
  const orderData = {
    items: [
      {
        name: recommendation.outfitName,
        quantity: 1,
        fabric: recommendation.fabric,
        description: recommendation.style,
      },
    ],
    notes: `
AI Recommendation

Color: ${recommendation.color}

Accessories:
${recommendation.accessories}

Reason:
${recommendation.reason}
`,
  };

  localStorage.setItem(
    "aiRecommendedOrder",
    JSON.stringify(orderData)
  );

  navigate("/customer/orders");
};
  const [form, setForm] = useState({
    occasion: "",
    gender: "female",
    color: "",
    budget: "",
    season: "",
  });

  const [recommendation, setRecommendation] = useState(null);

  const generateRecommendation = async () => {
    try {
      setLoading(true);

     const { data } = await api.post(
  "/customers/fashion-recommendation",
  form
);

      setRecommendation(data);
    } catch (err) {
      console.log(err);
      showError("Failed to generate recommendation");
    } finally {
      setLoading(false);
    }
  };
const generateOutfitImage = async () => {
  try {
    const { data } = await api.post(
      "/customers/generate-outfit-image",
      recommendation
    );

    console.log(data);

    setOutfitImage(data.imageUrl);
  } catch (err) {
    console.log(err);
    showError("Failed to generate outfit");
  }
};
  return (
    <div className="space-y-6">

      {/* Header */}

      <div
        className="
        bg-[#FAF8F5]
        dark:bg-[#252525]
        border
        border-[#EAE3D6]
        dark:border-[#333]
        rounded-3xl
        p-6
      "
      >
        <p className="text-sm text-[#8B7D6B]">
          AI Powered Styling
        </p>

        <h1 className="text-3xl font-bold text-[#4A3F35] dark:text-white mt-2">
          Fashion Advisor
        </h1>

        <p className="text-[#8B7D6B] mt-3">
          Get personalized outfit recommendations using AI.
        </p>
      </div>

      {/* Form */}

      <div
        className="
        bg-[#FAF8F5]
        dark:bg-[#252525]
        border
        border-[#EAE3D6]
        dark:border-[#333]
        rounded-3xl
        p-6
      "
      >
        <div className="grid md:grid-cols-2 gap-4">

          <select
            value={form.occasion}
            onChange={(e) =>
              setForm({
                ...form,
                occasion: e.target.value,
              })
            }
            className="
            h-12
            px-4
            rounded-2xl
            border
            border-[#EAE3D6]
            dark:border-[#333]
            bg-white
            dark:bg-[#1F1F1F]
            text-[#4A3F35]
            dark:text-white
          "
          >
            <option value="">Select Occasion</option>
            <option value="Wedding">Wedding</option>
            <option value="Party">Party</option>
            <option value="Office">Office</option>
            <option value="Casual">Casual</option>
            <option value="Festival">Festival</option>
          </select>

          <select
            value={form.gender}
            onChange={(e) =>
              setForm({
                ...form,
                gender: e.target.value,
              })
            }
            className="
            h-12
            px-4
            rounded-2xl
            border
            border-[#EAE3D6]
            dark:border-[#333]
            bg-white
            dark:bg-[#1F1F1F]
            text-[#4A3F35]
            dark:text-white
          "
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>

          <input
            placeholder="Preferred Color"
            value={form.color}
            onChange={(e) =>
              setForm({
                ...form,
                color: e.target.value,
              })
            }
            className="
            h-12
            px-4
            rounded-2xl
            border
            border-[#EAE3D6]
            dark:border-[#333]
            bg-white
            dark:bg-[#1F1F1F]
            text-[#4A3F35]
            dark:text-white
          "
          />

          <select
            value={form.budget}
            onChange={(e) =>
              setForm({
                ...form,
                budget: e.target.value,
              })
            }
            className="
            h-12
            px-4
            rounded-2xl
            border
            border-[#EAE3D6]
            dark:border-[#333]
            bg-white
            dark:bg-[#1F1F1F]
            text-[#4A3F35]
            dark:text-white
          "
          >
            <option value="">Budget</option>
            <option value="1000-3000">
              ₹1000 - ₹3000
            </option>
            <option value="3000-5000">
              ₹3000 - ₹5000
            </option>
            <option value="5000-10000">
              ₹5000 - ₹10000
            </option>
            <option value="10000+">
              ₹10000+
            </option>
          </select>

          <select
            value={form.season}
            onChange={(e) =>
              setForm({
                ...form,
                season: e.target.value,
              })
            }
            className="
            h-12
            px-4
            rounded-2xl
            border
            border-[#EAE3D6]
            dark:border-[#333]
            bg-white
            dark:bg-[#1F1F1F]
            text-[#4A3F35]
            dark:text-white
          "
          >
            <option value="">Season</option>
            <option value="Summer">
              Summer
            </option>
            <option value="Winter">
              Winter
            </option>
            <option value="Monsoon">
              Monsoon
            </option>
            <option value="Spring">
              Spring
            </option>
          </select>
        </div>

        <button
          onClick={generateRecommendation}
          disabled={loading}
          className="
          mt-6
          flex
          items-center
          gap-2
          px-6
          py-3
          rounded-2xl
          bg-[#C48A7A]
          hover:bg-[#B17869]
          text-white
        "
        >
          <Sparkles className="w-5 h-5" />

          {loading
            ? "Generating..."
            : "Generate Recommendation"}
        </button>
      </div>

      {/* Result */}

      {recommendation && (
        <div
          className="
          bg-[#FAF8F5]
          dark:bg-[#252525]
          border
          border-[#EAE3D6]
          dark:border-[#333]
          rounded-3xl
          p-6
        "
        >
          <h2 className="text-2xl font-bold text-[#4A3F35] dark:text-white">
            {recommendation.outfitName}
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mt-5 text-[#4A3F35] dark:text-white">
            <p>
              <b>Fabric:</b>{" "}
              {recommendation.fabric}
            </p>

            <p>
              <b>Color:</b>{" "}
              {recommendation.color}
            </p>

            <p>
              <b>Style:</b>{" "}
              {recommendation.style}
            </p>

            <p>
              <b>Accessories:</b>{" "}
              {recommendation.accessories}
            </p>

            <p>
              <b>Budget:</b>{" "}
              {recommendation.estimatedPrice}
            </p>
            <p><b>Embroidery:</b> {recommendation.embroidery}</p>

<p><b>Neck:</b> {recommendation.neckDesign}</p>

<p><b>Sleeves:</b> {recommendation.sleeves}</p>

<p><b>Bottom:</b> {recommendation.bottomStyle}</p>

<p><b>Dupatta:</b> {recommendation.dupatta}</p>

<p><b>Footwear:</b> {recommendation.footwear}</p>

<p><b>Hairstyle:</b> {recommendation.hairstyle}</p>
          </div>

          <div className="mt-6">
            <p className="font-semibold text-[#4A3F35] dark:text-white">
              Why this recommendation?
            </p>

            <p className="text-[#8B7D6B] mt-2">
              {recommendation.reason}
            </p>
          </div>
          
         <div className="mt-8 flex flex-wrap gap-4">

  {!outfitImage && (
    <button
      onClick={generateOutfitImage}
      className="
      px-6
      py-3
      rounded-2xl
      bg-[#C48A7A]
      hover:bg-[#B17869]
      text-white
      font-medium
      transition
      "
    >
      👗 View Outfit
    </button>
  )}


</div>
{outfitImage && (
  <div
    className="
    mt-8
    bg-[#FAF8F5]
    dark:bg-[#252525]
    border
    border-[#EAE3D6]
    dark:border-[#333]
    rounded-3xl
    p-6
    "
  >
    <h2 className="text-2xl font-bold text-[#4A3F35] dark:text-white mb-6">
      Outfit Preview
    </h2>

    <img
      src={outfitImage}
      alt="Generated Outfit"
      className="
      w-full
      max-w-xl
      mx-auto
      rounded-3xl
      shadow-lg
      border
      border-[#EAE3D6]
      dark:border-[#333]
      "
    />

    <div className="flex flex-wrap justify-center gap-4 mt-8">

      <button
        onClick={() =>
          navigate("/customer/virtual-try-on", {
            state: {
              recommendation,
              outfitImage,
            },
          })
        }
        className="
        px-6
        py-3
        rounded-2xl
        bg-[#7C9A92]
        hover:bg-[#68857D]
        text-white
        font-medium
        "
      >
        🪞 Try On Outfit
      </button>

      <button
        onClick={createOrderFromAI}
        className="
        px-6
        py-3
        rounded-2xl
        bg-[#C48A7A]
        hover:bg-[#B17869]
        text-white
        font-medium
        "
      >
        📝 Create Order
      </button>

    </div>
  </div>
)}
        </div>
      )}
      
    </div>
  );
}