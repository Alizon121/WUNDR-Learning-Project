export default function OurPrograms() {

    const programs = [
        {
            icon: "/programsIcon/fishing.png",
            title: "Outdoor Discovery",
            desc: "Fishing adventures, map reading skills, and nature-based science exploration in Colorado's beautiful wilderness.",
        },
        {
            icon: "/programsIcon/tent.png", 
            title: "Survival & First Aid Skills",
            desc: "Essential life skills including knot tying, shelter building, emergency preparedness, and CPR certification.",
        },
        {
            icon: "/programsIcon/salad.png", 
            title: "Healthy Living & Cooking",
            desc: "Garden-to-table experiences, cooking workshops, nutrition education, and sustainable living practices.",
        },
        {
            icon: "/programsIcon/books.png", 
            title: "Book & Art Club",
            desc: "Literary discussions, creative writing, sculpting, painting, and artistic expression in a supportive community.",
        },
        {
            icon: "/programsIcon/laptop.png",
            title: "Tech Evenings",
            desc: "Coding workshops, robotics, and technology exploration through partnerships with regional tech organizations.",
        },
        {
            icon: "/programsIcon/ski.png", 
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
                <div className="mx-auto my-4 h-1 w-1/4 rounded-full bg-gradient-to-r from-wonderleaf to-wondergreen shadow-md mt-2" />
                <p className="text-[20px] text-gray-600 max-w-3xl text-center mb-10 mt-2">
                    Hands-on experiences that bring homeschool families together.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {programs.map((prog, inx)=> (
                        <div
                            key={prog.title}
                            className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-start min-h-[250px] relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-wondergreen to-wondersun" />
                            <div className="flex items-center gap-4 mb-4 mt-2 z-10">
                                <img src={prog.icon} alt="" className="w-12 h-12" />
                                <h3 className="text-[21px] font-bold text-wondergreen">{prog.title}</h3>
                            </div>
                            <p className="text-lg text-gray-600 ml-4">{prog.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
