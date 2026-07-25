import { useState } from "react";
import { Upload, Sparkles, ImageIcon } from "lucide-react";
import api from "../../services/api";
import { showError, showSuccess } from "../../utils/toast";

export default function VirtualTryOn() {
  const [personImage, setPersonImage] = useState(null);
  const [outfitImage, setOutfitImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateTryOn = async () => {
    if (!personImage || !outfitImage) {
      return showError(
        "Please upload both your photo and outfit image"
      );
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("personImage", personImage);
      formData.append("outfitImage", outfitImage);

      const { data } = await api.post(
        "/customers/try-on",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setResultImage(data.imageUrl);

      showSuccess(
        "Virtual try-on generated successfully"
      );
    } catch (error) {
      console.log(error);

      showError(
        error.response?.data?.message ||
          "Failed to generate try-on"
      );
    } finally {
      setLoading(false);
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
          AI Fashion Studio
        </p>

        <h1
          className="
          text-3xl
          font-bold
          text-[#4A3F35]
          dark:text-white
          mt-2
          "
        >
          Virtual Try-On
        </h1>

        <p className="text-[#8B7D6B] mt-3">
          Upload your photo and an outfit image
          to see how the design looks on you.
        </p>
      </div>

      {/* Upload Section */}

      <div
        className="
        grid
        lg:grid-cols-2
        gap-6
        "
      >
        {/* Person Upload */}

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
          <h2
            className="
            text-xl
            font-semibold
            text-[#4A3F35]
            dark:text-white
            mb-5
            "
          >
            Your Photo
          </h2>

          <label
            className="
            flex
            flex-col
            items-center
            justify-center
            gap-3
            h-64
            rounded-3xl
            border-2
            border-dashed
            border-[#EAE3D6]
            dark:border-[#444]
            cursor-pointer
            "
          >
            <Upload className="w-10 h-10 text-[#C48A7A]" />

            <span className="text-[#8B7D6B]">
              Upload Your Photo
            </span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setPersonImage(
                  e.target.files?.[0]
                )
              }
            />
          </label>

          {personImage && (
            <img
              src={URL.createObjectURL(personImage)}
              alt=""
              className="
              mt-4
              w-full
              h-72
              object-cover
              rounded-2xl
              "
            />
          )}
        </div>

        {/* Outfit Upload */}

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
          <h2
            className="
            text-xl
            font-semibold
            text-[#4A3F35]
            dark:text-white
            mb-5
            "
          >
            Outfit Image
          </h2>

          <label
            className="
            flex
            flex-col
            items-center
            justify-center
            gap-3
            h-64
            rounded-3xl
            border-2
            border-dashed
            border-[#EAE3D6]
            dark:border-[#444]
            cursor-pointer
            "
          >
            <ImageIcon className="w-10 h-10 text-[#C48A7A]" />

            <span className="text-[#8B7D6B]">
              Upload Outfit
            </span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setOutfitImage(
                  e.target.files?.[0]
                )
              }
            />
          </label>

          {outfitImage && (
            <img
              src={URL.createObjectURL(outfitImage)}
              alt=""
              className="
              mt-4
              w-full
              h-72
              object-cover
              rounded-2xl
              "
            />
          )}
        </div>
      </div>

      {/* Generate Button */}

      <div className="flex justify-center">
        <button
          onClick={generateTryOn}
          disabled={loading}
          className="
          px-8
          py-4
          rounded-2xl
          bg-[#C48A7A]
          hover:bg-[#B17869]
          text-white
          font-medium
          flex
          items-center
          gap-2
          disabled:opacity-50
          "
        >
          <Sparkles className="w-5 h-5" />

          {loading
            ? "Generating..."
            : "Generate Virtual Try-On"}
        </button>
      </div>

      {/* Result */}

      {resultImage && (
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
          <h2
            className="
            text-2xl
            font-bold
            text-[#4A3F35]
            dark:text-white
            mb-5
            "
          >
            AI Result
          </h2>

          <img
            src={resultImage}
            alt="Try On Result"
            className="
            w-full
            rounded-3xl
            border
            border-[#EAE3D6]
            dark:border-[#333]
            "
          />
        </div>
      )}
    </div>
  );
}