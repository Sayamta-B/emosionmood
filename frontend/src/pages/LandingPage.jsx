
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 to-blue-500 text-white">
      
      {/* Header */}
      <header className="flex justify-between items-center px-10 py-6">
        <h1 className="text-2xl font-bold">Emosion</h1>
        <nav className="space-x-6">
          <a href="#" className="my-navbar-btns" style={{color: "white"}}>Home</a>
          <a href="#features" className="my-navbar-btns" style={{color: "white"}}>Features</a>
          <a href="/login" className="my-navbar-btns" style={{color: "white"}}>Login</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center min-h-[80vh] px-6 text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/features/header.jpg')" }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-800/80 to-gray-500/60"></div>

        {/* Content */}
        <div className="relative max-w-3xl z-10 text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Turn Your Photos Into Feelings & Music
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Emosion is a CNN-powered journaling platform that detects emotions
            from images and recommends music based on the detected mood.
          </p>

          <button
            onClick={() => (window.location.href = "register/")}
            className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Get Started
          </button>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="bg-white text-gray-800 py-20 px-6">
        <h3 className="text-3xl font-bold text-center mb-14">
          How Emosion Works
        </h3>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">

          {[
            {
              title: "Upload Photo",
              desc: "Share an image or moment you want to reflect on.",
              img: "/features/photo-emosion.png",
            },
            {
              title: "Mood Detection",
              desc: "A CNN model analyzes emotions from facial expressions.",
              img: "/features/home-emosion.png",
            },
            {
              title: "Music Recommendation",
              desc: "Songs and playlists are suggested based on detected mood.",
              img: "/features/song-emosion.png",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="
                relative h-120 rounded-xl overflow-hidden
                bg-cover bg-center group
              "
              style={{ backgroundImage: `url('${item.img}')` }}
            >
              {/* Gradient overlay (VISIBLE by default) */}
              <div
                className="
                  absolute inset-0
                  bg-gradient-to-t from-gray-700/80 
                  group-hover:opacity-0
                  transition-opacity duration-500
                "
              />

              {/* Text (VISIBLE by default, moves DOWN on hover) */}
              <div
                className="
                  absolute inset-0
                  flex flex-col items-center justify-center
                  text-white text-center px-6
                  transition-all duration-500
                  group-hover:translate-y-10
                  group-hover:opacity-0
                "
              >
                <h4 className="text-xl font-semibold mb-2">
                  {item.title}
                </h4>
                <p className="text-sm opacity-90">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}

        </div>
      </section>


      {/* Footer */}
      <footer className="text-center py-6 text-sm opacity-80 bg-white text-gray-600">
        © 2025 Emosion | CNN-Based Mood Detection and Music Recommendation System
      </footer>

    </div>
  );
}
