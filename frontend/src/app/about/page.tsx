export default function AboutPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16 text-wondergreen">
      <h1 className="text-4xl font-bold text-center mb-4">
        WonderHood: More Than Just Homeschooling
      </h1>
      <p className="text-lg text-center text-gray-600 mb-6">
        Creating joyful connections and real-life adventures for homeschool families in Colorado.
      </p>
      <p>
        WonderHood began with a small group of Colorado families who wanted more than just lessons at home — we wanted real friendships, hands-on adventures, and a supportive community for our kids! Now, we organize clubs, outdoor meetups, and creative projects for homeschoolers of all backgrounds.
      </p>

      {/* Why We Do */}
      <div className="mb-10">
          <h2 className="text-2xl font-bold mb-2 mt-8">Why We Do It ?</h2>
          <p>
            At Wonderhood, we believe every child deserves the chance to discover their unique talents, develop life skills, and connect with others in a supportive, inspiring environment.
          </p>
          <p>
            Our programs help kids not just learn, but grow as individuals—exploring arts, sciences, teamwork, leadership, and cultural experiences that go far beyond what's possible in traditional homeschooling.
          </p>
          <p>
            We want every child to have access to friendships, group activities, mentorship, and opportunities to shine—no matter where or how they learn.
          </p>
          <p>
            Over time, we plan to open workshops and summer camps, and to offer support not just for children, but for their families too.
          </p>
          <p>
            By connecting families, building community, and creating real opportunities, Wonderhood aims to fill the gaps in home education—and add even more to children's lives.
          </p>
        </div>


      {/* Membership */}
      <div className="mb-10 bg-[#F7FAED] rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-2">How to Join</h2>
        <p>
          Membership is <span className="font-semibold text-wondergreen">free</span> for all homeschool families with kids ages <span className="font-semibold">10–18</span>.<br />
          Just sign up form for your child and join any club, or contact us with questions — you're always welcome!
        </p>
        <div className="mt-2">
          <a
            href="mailto:wonderhood.project@gmail.com"
            className="underline text-wonderleaf hover:text-wonderorange font-semibold"
          >
            wonderhood.project@gmail.com
          </a>
        </div>
      </div>

      {/* Volunteer & Support */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-2">Get Involved</h2>
        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          <li>
            <span className="font-semibold text-wondergreen">Volunteer:</span> Help organize events or lead a club.
          </li>
          <li>
            <span className="font-semibold text-wondergreen">Partner:</span> Community orgs, let's create together!
          </li>
          <li>
            <span className="font-semibold text-wondergreen">Donate:</span> Your support makes our programs possible and is tax-deductible. <a href="/support" className="underline">Support WonderHood</a>
          </li>
        </ul>
      </div>

      {/* Contact */}
      <div className="mt-8 text-center text-gray-500">
        Questions? Email us at <a href="mailto:wonderhood.project@gmail.com" className="underline">wonderhood.project@gmail.com</a> or follow us on social media!
      </div>
    </section>
  );
}
