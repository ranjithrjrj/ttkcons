const stats = [
  { value: '40+', label: 'Years of Legacy' },
  { value: '₹211 Cr+', label: 'FY23 Turnover' },
  { value: '₹1200 Cr+', label: 'Order Book' },
  { value: '200+', label: 'Successful Projects' },
];

export default function StatsSection() {
  return (
    <section className="py-12 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="border-r border-gray-700 last:border-r-0"
            >
              <p className="text-6xl font-extrabold embossed-text">{stat.value}</p>
              <p className="mt-2 text-xl font-light uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}