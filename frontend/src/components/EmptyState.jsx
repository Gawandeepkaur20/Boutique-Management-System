import { Package } from 'lucide-react';

export default function EmptyState({
  title,
  description,
  action,
  actionLabel,
}) {
  return (
    <div
      className="
      flex
      flex-col
      items-center
      justify-center
      py-20
      px-6
      text-center

      bg-[#FAF8F5]
      dark:bg-[#252525]
      "
    >
      <div
        className="
        w-20
        h-20
        rounded-3xl

        bg-[#F3EFD9]
        dark:bg-[#2F2A1D]

        flex
        items-center
        justify-center
        mb-6
        "
      >
        <Package
          className="
          w-10
          h-10
          text-[#C9A227]
          "
        />
      </div>

      <h3
        className="
        text-2xl
        font-semibold
        text-[#4A3F35]
        dark:text-white
        "
      >
        {title}
      </h3>

      <p
        className="
        mt-2
        text-[#8B7D6B]
        dark:text-gray-400
        max-w-sm
        "
      >
        {description}
      </p>

      {action && (
        <button
          onClick={action}
          className="
          mt-8

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
          {actionLabel}
        </button>
      )}
      
    </div>
  );
}