export default function OurPrograms() {

    const programs = [
        {
            icon: "/programsIcon/fishing.png",
            tittle: "Outdoor Discovery",
            desc: "Fishing adventures, map reading skills, and nature-based science exploration in Colorado's beautiful wilderness.",
        },
        {
            icon: "/programsIcon/tent.png", // или emoji ⛺️
            title: "Survival & First Aid Skills",
            desc: "Essential life skills including knot tying, shelter building, emergency preparedness, and CPR certification.",
        },
        {
            icon: "/programsIcon/salad.png", // или emoji 🥗
            title: "Healthy Living & Cooking",
            desc: "Garden-to-table experiences, cooking workshops, nutrition education, and sustainable living practices.",
        },
        {
            icon: "/programsIcon/books.png", // или emoji 📚
            title: "Book & Art Club",
            desc: "Literary discussions, creative writing, sculpting, painting, and artistic expression in a supportive community.",
        },
        {
            icon: "/programsIcon/laptop.png", // или emoji 💻
            title: "Tech Evenings",
            desc: "Coding workshops, robotics, and technology exploration through partnerships with regional tech organizations.",
        },
        {
            icon: "/programsIcon/ski.png", // или emoji 🎿
            title: "Adventures & Field Trips",
            desc: "Sports activities, ski days, national park visits, museum trips, and seasonal community celebrations.",
        },
    ];

    return (
        <section className="w-full py-16 text-wondergreen bg-[#FAF7ED]">
        <div className="max-w-7xl mx-auto flex flex-col items-center px-4">
            <h2 className="text-5xl font-bold mb-4 text-center">
                Our Programs
            </h2>
            <div className="mx-auto my-4 h-1 w-1/6 rounded-full bg-gradient-to-r from-wonderleaf to-wondergreen shadow-md" />
            <p className="text-xl text-gray-600 max-w-3xl text-center mb-8">
                Hands-on experiences that bring homeschool families together.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {programs.map((prog, inx)=> (
                    <div
                    key={prog.tittle}
                    className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-start min-h-[250px] border-t-4 border-gradient-to-r from-green-300 to-orange-200"
                    style={{
                        borderTop: "5px solid",
                        borderImage: "linear-gradient(90deg, #61dfa6, #ff934f) 1",
                    }}
                    >
                        <div className="mb-4 text-5xl">
                            {/* <Image src={prog.icon} alt="" width={50} height={50}/> */}
                            <span>{prog.icon.includes(".png") ? <img src={prog.icon} alt="" className="w-12 h-12" /> : prog.icon}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-wondergreen mb-2">{prog.title}</h3>
                        <p className="text-lg text-gray-600">{prog.desc}</p>
                    </div>
                ))}

            </div>
            
        </div>
        </section>
    );
}
