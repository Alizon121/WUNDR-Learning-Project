export default function ImpactStats() {
    return (
    <section className="w-full py-16 text-wondergreen">
        <div className="max-w-7xl mx-auto flex flex-col item-center">
            <h2 className="text-5xl font-bold mb-4 text-center">
                Empowering Families Through Connection
            </h2>
            <div className="flex justify-center w-full mt-2">
                <p className="text-xl mb-10 text-gray-600 max-w-5xl text-center">
                    We believe that learning flourishes when children and families come together.
                    WonderHood connects homeschoolers through real experiences, new friendships, and joyful discovery.
                </p>
            </div>

            <div className="grid grid-cols-4 md:grid-colors-4 gap-16 max-w-5xl mx-auto mt-10 divide-x divide-wondergreen/20">
                {/* 1 */}
                <div className="flex flex-col items-center">
                    <span className="text-5xl font-bold text-wondergreen">23+</span>
                    <span className="mt-3 text-wonderorange text-xl text-center">Families Connected</span>
                </div>

                {/* 2 */}
                <div className="flex flex-col items-center px-6">
                    <span className="text-5xl font-bold text-wondergreen">10+</span>
                    <span className="mt-3 text-wonderorange text-xl text-center">Programs</span>
                </div>

                {/* 3 */}
                <div className="flex flex-col items-center">
                    <span className="text-5xl font-bold text-wondergreen">100+</span>
                    <span className="mt-3 text-wonderorange text-xl text-center">Learning Experiences</span>
                </div>

                {/* 4 */}
                <div className="flex flex-col items-center">
                    <span className="text-5xl font-bold text-wondergreen">100%</span>
                    <span className="mt-3 text-wonderorange text-xl text-center">Parent Satisfaction</span>
                </div>

            </div>

        </div>

    </section>

    )

}