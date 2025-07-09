// import { motion } from "framer-motion";


// export default function ImpactStats() {
//     return (
//     <section className="w-full py-16 text-wondergreen">
//         <div className="max-w-7xl mx-auto flex flex-col item-center">
//             <h2 className="text-5xl font-bold mb-4 text-center">
//                 Empowering Families Through Connection
//             </h2>
//             <div className="flex justify-center w-full mt-2">
//                 <p className="text-xl mb-10 text-gray-600 max-w-5xl text-center">
//                     We believe that learning flourishes when children and families come together.
//                     WonderHood connects homeschoolers through real experiences, new friendships, and joyful discovery.
//                 </p>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mt-6 divide-x divide-green-200">
//                 {[
//                     { value: "23+", label: "Families Connected" },
//                     { value: "10+", label: "Programs" },
//                     { value: "100+", label: "Learning Experiences" },
//                     { value: "100%", label: "Parent Satisfaction" },
//                 ].map((stat, idx) => (
//                     <motion.div
//                     key={stat.label}
//                     className="flex flex-col items-center px-6"
//                     initial={{ opacity: 0, y: 40 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.6, delay: idx * 0.15 }}
//                     >
//                     <span className="text-5xl font-bold text-wondergreen">{stat.value}</span>
//                     <span className="mt-2 text-base text-orange-400 font-medium">{stat.label}</span>
//                     </motion.div>
//                 ))}
//             </div>
//         </div>

//     </section>

//     )

// }



// import CountUp from 'react-countup';

// export default function ImpactStats() {
//     return (
//         <section className="w-full py-16 text-wondergreen bg-wonderbg">
//             <div className="max-w-7xl mx-auto flex flex-col items-center">
//                 <h2 className="text-5xl font-bold mb-4 text-center">
//                     Empowering Families Through Connection
//                 </h2>
//                 <div className="flex justify-center w-full mt-2">
//                     <p className="text-xl mb-10 text-gray-600 max-w-4xl text-center">
//                         We believe that learning flourishes when children and families come together.<br/>
//                         WonderHood connects homeschoolers through real experiences, new friendships, and joyful discovery.
//                     </p>
//                 </div>

//                 <div className="flex flex-wrap justify-center gap-8 mt-4">
//                     <div className="flex flex-col items-center bg-white rounded-2xl shadow-md px-10 py-8 animate-fadeIn">
//                         <span className="text-5xl font-bold text-wondergreen">
//                             <CountUp end={23} duration={1.2} />+
//                         </span>
//                         <span className="mt-2 text-lg text-orange-400">Families Connected</span>
//                     </div>
//                     <div className="flex flex-col items-center bg-white rounded-2xl shadow-md px-10 py-8 animate-fadeIn">
//                         <span className="text-5xl font-bold text-wondergreen">
//                             <CountUp end={10} duration={1.2} />+
//                         </span>
//                         <span className="mt-2 text-lg text-orange-400">Programs</span>
//                     </div>
//                     <div className="flex flex-col items-center bg-white rounded-2xl shadow-md px-10 py-8 animate-fadeIn">
//                         <span className="text-5xl font-bold text-wondergreen">
//                             <CountUp end={100} duration={1.5} />+
//                         </span>
//                         <span className="mt-2 text-lg text-orange-400">Learning Experiences</span>
//                     </div>
//                     <div className="flex flex-col items-center bg-white rounded-2xl shadow-md px-10 py-8 animate-fadeIn">
//                         <span className="text-5xl font-bold text-wondergreen">
//                             <CountUp end={100} duration={1.8} suffix="%" />
//                         </span>
//                         <span className="mt-2 text-lg text-orange-400">Parent Satisfaction</span>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// }

import CountUp from 'react-countup';

const stats = [
  { value: 23, suffix: "+", label: "Families Joined" },
  { value: 10, suffix: "+", label: "Events Organized" },
  { value: 100, suffix: "+", label: "Workshops & Trips" },
  { value: 100, suffix: "%", label: "Smiles Created" },
];

export default function ImpactStats() {
  return (
    <section className="w-full py-10 text-wondergreen bg-[#FAF7ED]">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h2 className="text-5xl font-bold mb-4 text-center">
          Empowering Families Through Connection
        </h2>
        <div className="mx-auto my-4 h-1 w-2/6 rounded-full bg-gradient-to-r from-wonderleaf to-wondergreen shadow-md" />

        <div className="flex justify-center w-full mt-4">
          <p className="text-xl mb-8 text-gray-600 max-w-5xl text-center">
            We believe that learning flourishes when children and families come together.
            <br />
            WonderHood connects homeschoolers through real experiences, new friendships, and joyful discovery.
          </p>
        </div>
"
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mt-4 divide-x divide-green-300 items-stretch">
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

