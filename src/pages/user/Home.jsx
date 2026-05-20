import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Play, Plus, ChevronRight, Check, Menu, Search } from "lucide-react";

const NAV_LINKS = ["Home", "Browse", "Watchlist", "My Profile"];

const GENRES = ["All", "Action", "Thriller", "Drama", "Comedy", "Sci-Fi", "Horror", "Romance", "Animation"];

const MOVIES = [
  {
    id: 1,
    title: "Dark Meridian",
    rating: 8.7,
    year: 2024,
    duration: "2h 4m",
    genre: "Thriller",
    bg: "from-red-900 via-red-800 to-zinc-900",
    badge: "🏆",
  },
  {
    id: 2,
    title: "The Watcher",
    rating: 8.5,
    year: 2024,
    duration: "2h 12m",
    genre: "Horror",
    bg: "from-zinc-800 via-zinc-700 to-zinc-900",
  },
  {
    id: 3,
    title: "Harry Potter",
    rating: 8.5,
    year: 2024,
    duration: "2h 30m",
    genre: "Drama",
    bg: "from-blue-950 via-indigo-900 to-zinc-900",
  },
  {
    id: 4,
    title: "GodZilla VS Kong",
    rating: 8.5,
    year: 2021,
    duration: "2h 30m",
    genre: "Action",
    bg: "from-teal-950 via-cyan-900 to-zinc-900",
  },
];

const CONTINUE = [
  {
    id: 1,
    title: "GodZilla VS Kong",
    genre: "Action",
    year: 2021,
    lang: "English",
    progress: 72,
    remaining: "50 min remaining",
    bg: "from-teal-950 to-zinc-900",
  },
  {
    id: 2,
    title: "The Watcher",
    genre: "Horror",
    year: 2024,
    lang: "English",
    progress: 60,
    remaining: "45 min remaining",
    bg: "from-zinc-800 to-zinc-900",
  },
];

const PLANS = [
  {
    name: "Basic",
    price: "4.99",
    label: "Get Started",
    popular: false,
    features: ["30 day access", "HD quality", "1 device at a time", "Full movie library", "Watch history"],
  },
  {
    name: "Standard",
    price: "9.99",
    label: "Subscribe Now",
    popular: true,
    features: ["30 day access", "Full HD + 4K", "2 devices at a time", "Full movie library", "Watchlist & Reviews"],
  },
  {
    name: "Premium",
    price: "14.99",
    label: "Go Premium",
    popular: false,
    features: ["30 day access", "4K Ultra HD", "4 devices at a time", "Full movie library", "Early access releases"],
  },
];

function StarRating({ rating }) {
  return (
    <span className="flex items-center gap-1 text-yellow-400 font-semibold text-sm">
      <Star size={12} fill="currentColor" />
      {rating}
    </span>
  );
}

function MovieCard({ movie }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative rounded-xl overflow-hidden cursor-pointer group flex-shrink-0 w-40 sm:w-44"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`bg-gradient-to-b ${movie.bg} h-60 w-full flex items-end p-3 transition-transform duration-300 group-hover:scale-105`}>
        <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300`} />
        {hovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-yellow-400/90 flex items-center justify-center shadow-lg">
              <Play size={20} fill="black" color="black" />
            </div>
          </div>
        )}
      </div>
      <div className="bg-zinc-900 p-2.5">
        <p className="text-white font-semibold text-sm truncate">{movie.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <StarRating rating={movie.rating} />
          <span className="text-zinc-500 text-xs">{movie.year}</span>
          <span className="text-zinc-500 text-xs">•</span>
          <span className="text-zinc-500 text-xs">{movie.duration}</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeGenre, setActiveGenre] = useState("All");
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-[68px] flex items-center justify-between">

          <Link to="/" className="text-yellow-400 font-black text-2xl tracking-tighter">BBFLIX</Link>

          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link}
                to={link === "Home" ? "/" : `/${link.toLowerCase().replace(" ", "")}`}
                className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                  link === "Home" ? "text-white" : "text-zinc-500 hover:text-white"
                }`}
              >
                {link}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 gap-2.5 w-52">
              <Search size={13} className="text-zinc-500 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search Movies"
                className="bg-transparent text-sm text-white placeholder-zinc-600 outline-none w-full"
              />
            </div>
            <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center text-black font-black text-sm ring-2 ring-yellow-400/20">
              N
            </div>
            <button className="md:hidden text-zinc-400 p-1" onClick={() => setMobileMenu(!mobileMenu)}>
              <Menu size={22} />
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="md:hidden bg-zinc-950 border-t border-white/5 px-6 py-5 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link key={link} to={`/${link.toLowerCase().replace(" ", "")}`}
                className="text-sm text-zinc-400 hover:text-white transition-colors">
                {link}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative h-[calc(100vh-68px)] flex items-center overflow-hidden">
        {/* layered bg */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />
        <div className="absolute right-0 top-0 w-2/3 h-full bg-gradient-to-l from-red-950/50 via-zinc-900/40 to-transparent" />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.04] select-none pointer-events-none hidden sm:block">
          <span className="text-[12rem] md:text-[22rem] font-black text-white leading-none">SM</span>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full py-20 md:py-28">
          <div className="max-w-lg">

            <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-2 mb-10">
              <Star size={11} fill="#facc15" className="text-yellow-400" />
              <span className="text-yellow-400 text-[11px] font-bold tracking-[0.15em] uppercase">#1 Trending This Week</span>
            </div>

            <h1 className="font-black uppercase leading-[0.9] tracking-tight mb-8">
              <span className="text-yellow-400 text-6xl md:text-8xl block">Spider_Man</span>
              <span className="text-white text-4xl md:text-5xl block mt-2">No Way Home</span>
            </h1>

            <div className="flex items-center flex-wrap gap-x-3 gap-y-2 mb-6">
              <StarRating rating={8.7} />
              <span className="w-px h-3 bg-zinc-700" />
              <span className="text-zinc-400 text-sm">2026</span>
              <span className="w-px h-3 bg-zinc-700" />
              <span className="text-zinc-400 text-sm">English</span>
              <span className="w-px h-3 bg-zinc-700" />
              <span className="text-zinc-400 text-sm">2h 30m</span>
              <span className="bg-yellow-400/15 text-yellow-400 text-xs px-3 py-1 rounded-full font-semibold border border-yellow-400/20">
                Thriller
              </span>
            </div>

            <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-sm">
              Following the reveal of his identity, Peter turns to Doctor Strange for help, causing a multiverse rift that brings in classic villains.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <button className="flex items-center gap-2.5 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-bold px-8 py-4 rounded-xl transition-all duration-200 text-sm">
                <Play size={15} fill="black" />
                Watch Now
              </button>
              <button className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 active:scale-95 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-sm border border-white/10">
                Trailer
              </button>
              <button className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 flex items-center justify-center transition-all duration-200">
                <Plus size={20} />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── Browse by Genre ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black uppercase tracking-wide">
            Browse by <span className="text-yellow-400">Genre</span>
          </h2>
          <button className="flex items-center gap-1.5 text-yellow-400 text-sm font-medium hover:text-yellow-300 transition-colors">
            See all <ChevronRight size={15} />
          </button>
        </div>

        {/* Genre pills */}
        <div className="flex items-center gap-3 flex-wrap mb-8">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGenre(g)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                activeGenre === g
                  ? "bg-yellow-400 text-black border-yellow-400"
                  : "bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Movie cards row */}
        <div className="flex gap-5 overflow-x-auto pb-3 -mx-6 px-6 md:-mx-12 md:px-12"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {MOVIES.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

      </section>

      {/* ── Continue Watching ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">

        <h2 className="text-2xl font-black uppercase tracking-wide mb-8">
          Continue <span className="text-yellow-400">Watching</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {CONTINUE.map((item) => (
            <div key={item.id}
              className="group bg-zinc-900/60 border border-white/5 hover:border-yellow-400/20 rounded-2xl p-6 flex gap-6 cursor-pointer transition-all duration-300 hover:bg-zinc-900">
              <div className={`bg-gradient-to-br ${item.bg} w-32 h-[72px] rounded-xl flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}>
                <Play size={18} fill="white" className="text-white opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate mb-1">{item.title}</p>
                <p className="text-zinc-600 text-xs">{item.genre} • {item.year} • {item.lang}</p>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-zinc-600 mb-1.5">
                    <span>{item.progress}% watched</span>
                    <span>{item.remaining}</span>
                  </div>
                  <div className="h-[3px] bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ── Choose Your Plan ── */}
      <section className="bg-zinc-900/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase tracking-wide mb-4">
              Choose Your <span className="text-yellow-400">Plan</span>
            </h2>
            <p className="text-zinc-500 text-sm">Unlimited movies, no ads. Cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PLANS.map((plan) => (
              <div key={plan.name}
                className={`relative rounded-2xl p-6 md:p-8 flex flex-col border transition-all duration-300 ${
                  plan.popular
                    ? "bg-zinc-900 border-yellow-400/50 ring-1 ring-yellow-400/10"
                    : "bg-zinc-900/50 border-white/5 hover:border-white/10"
                }`}>

                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="bg-yellow-400 text-black text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}

                <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.15em] mb-4">{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-5xl font-black text-white">${plan.price}</span>
                  <span className="text-zinc-600 text-sm">/month</span>
                </div>

                <ul className="flex flex-col gap-4 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-zinc-300">
                      <div className="w-5 h-5 rounded-full bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-yellow-400" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 ${
                  plan.popular
                    ? "bg-yellow-400 hover:bg-yellow-300 text-black"
                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                }`}>
                  {plan.label}
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16 grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 md:col-span-1">
            <p className="text-yellow-400 font-black text-2xl mb-6 tracking-tight">BBFLIX</p>
            <p className="text-zinc-600 text-xs leading-relaxed max-w-[200px]">
              Your premium destination for cinematic experiences. Stream thousands of movies in stunning quality.
            </p>
          </div>
          {[
            { heading: "Browse", links: ["Top Rated", "By Genre", "By Language"] },
            { heading: "Account", links: ["My Profile", "Watchlist", "Watch History", "Subscription"] },
            { heading: "Support", links: ["Help Center", "Contact Us", "Privacy Policy", "Terms of Use"] },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <p className="text-zinc-300 text-xs font-bold mb-6 uppercase tracking-[0.12em]">{heading}</p>
              {links.map((l) => (
                <p key={l} className="text-zinc-600 text-sm mb-4 hover:text-zinc-300 cursor-pointer transition-colors">{l}</p>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 max-w-7xl mx-auto px-6 md:px-12 py-6">
          <p className="text-zinc-700 text-xs">© 2026 BBFLIX. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}