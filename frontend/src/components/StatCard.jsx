export default function StatCard({
  title,
  value,
  icon: Icon,
  color = 'gold'
}) {
  const styles = {
    gold: {
      bg: 'bg-[#FBF7E8]',
      icon: 'text-[#C9A227]',
    },

    primary: {
      bg: 'bg-[#F8F1EF]',
      icon: 'text-[#C48A7A]',
    },

    sage: {
      bg: 'bg-[#EEF4EE]',
      icon: 'text-[#7A9B76]',
    },
  };

  return (
    <div
      className="
      bg-[#FAF8F5]
      dark:bg-[#252525]
      border
      border-[#EAE3D6]
      dark:border-[#333]
      rounded-3xl
      p-6
      transition-all
      hover:shadow-lg
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#8B7D6B] dark:text-gray-400">
            {title}
          </p>

          <h3 className="text-3xl font-semibold mt-2 text-[#4A3F35] dark:text-white">
            {value}
          </h3>
        </div>

        {Icon && (
          <div
  className="
  w-14
  h-14
  rounded-2xl
  flex
  items-center
  justify-center
  "
  style={{
    backgroundColor: `${color}20`,
  }}
>
  <Icon
    className="w-6 h-6"
    strokeWidth={2}
    style={{
      color,
    }}
  />
</div>
        )}
      </div>
    </div>
  );
}