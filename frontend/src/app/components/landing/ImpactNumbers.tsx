import CountUp from 'react-countup';

const stats = [
  { value: 23, suffix: "+", label: "Families Joined" },
  { value: 10, suffix: "+", label: "Events Organized" },
  { value: 10, suffix: "+", label: "Ongoing Clubs" },
  { value: 100, suffix: "+", label: "Workshops & Trips" },

  { value: 100, suffix: "%", label: "Smiles Created" },
];

export default function ImpactStats() {
  return (
    <section className="w-full py-10 text-wondergreen bg-[#FAF7ED] mt-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h2 className="text-5xl font-bold mb-4 text-center">
          Empowering Families Through Connection
        </h2>
        <div className="mx-auto my-4 h-1 w-3/4 rounded-full bg-gradient-to-r from-wonderleaf to-wondergreen shadow-md" />

        <div className="flex justify-center w-full mt-4">
          <p className="text-xl mb-8 text-gray-600 max-w-5xl text-center">
            We believe that learning flourishes when children and families come together.
            <br />
            WonderHood connects homeschoolers through real experiences, new friendships, and joyful discovery.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-7xl mx-auto mt-6 divide-x divide-green-300 items-stretch">
          {stats.map((stat, idx) => (
            
            <div
              key={stat.label}
              className="flex flex-col items-center px-6"
            >
              <span className="text-5xl font-bold text-wondergreen">
                <CountUp end={stat.value} duration={1.4 + idx * 0.2} suffix={stat.suffix} />
              </span>
              <span className="mt-2 text-lg text-orange-400 font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

