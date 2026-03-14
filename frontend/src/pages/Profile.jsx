import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalPosts: 0,
    bookmarkedPosts: 0,
    moods: {}, // { happy: 3, neutral: 2, sad: 1 }
    favoriteTracks: {}, // { "Song A": 10, "Song B": 5 }
    listeningHistory: {}, // { "Song A": 5, "Song B": 2 }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Current user
        const resUser = await fetch("http://localhost:8000/users/me/", {
          credentials: "include",
        });
        if (resUser.ok) {
          const userData = await resUser.json();
          console.log("User data:", userData);   // 👈 add this
          console.log("Date joined:", userData.date_joined); // 👈 add this
          setUser(userData);
        }

        // Posts stats
        const resPosts = await fetch("http://localhost:8000/posts/get_posts/", {
          credentials: "include",
        });
        const posts = resPosts.ok ? await resPosts.json() : [];
        const bookmarked = Array.isArray(posts) ? posts.filter(p => p.bookmark).length : 0;

        // Mood stats
        const resMoods = await fetch("http://localhost:8000/mood/get_moods/", {
          credentials: "include",
        });
        const moodsData = await resMoods.json();
        const moodCount = moodsData?.mood_counts
          ? moodsData.mood_counts
          : {}; // ensure it's an object

        // Favorite tracks stats
        const resFav = await fetch("http://localhost:8000/spotify/favorites/", {
          credentials: "include",
        });
        const favData = await resFav.json();
        let favCount = {};
          if (Array.isArray(favData)) {
            favData.forEach(f => {
              if (f.name) {
                favCount[f.name] = (favCount[f.name] || 0) + 1;
              }
            });
          }

        // Listening history stats
        const resHist = await fetch("http://localhost:8000/spotify/history/", {
          credentials: "include",
        });
        const histData = await resHist.json();

        let listenCount = {};
        if (Array.isArray(histData)) {
          histData.forEach(h => {
            if (h.name) {
              listenCount[h.name] = (listenCount[h.name] || 0) + (h.count || 0);
            }
          });
        }

        setStats({
          totalPosts: Array.isArray(posts) ? posts.length : 0,
          bookmarkedPosts: bookmarked,
          moods: moodCount,
          favoriteTracks: favCount,
          listeningHistory: listenCount,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchData();
  }, []);

  if (!user) return <p>Loading profile...</p>;

  // Prepare chart data
  const moodChartData = {
    labels: Object.keys(stats.moods),
    datasets: [
      {
        label: "Mood Count",
        data: Object.values(stats.moods),
        backgroundColor: ["#facc15", "#6b7280", "#4f83c7", "#22c55e", "#ef4444"],
      },
    ],
  };

  const listenChartData = {
    labels: Object.keys(stats.listeningHistory),
    datasets: [
      {
        label: "Listen Count",
        data: Object.values(stats.listeningHistory),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Profile Info */}
      <div className="flex items-center space-x-4">
        <img
           src={user.profile_url 
            ? `http://localhost:8000/media/uploads/${user.profile_url}` 
            : 'http://localhost:8000/media/uploads/defaultProfile.jpg'}
            alt="Profile"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <p className="text-gray-500">{user.email}</p>
          <p className="text-gray-400 text-sm">
            Joined: {new Date(user.date_joined).toLocaleDateString()}
          </p>
          {/* Navigate to UpdateProfile.jsx */}
          <button
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
            onClick={() => navigate("/profile/update", { state: { user } })}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Posts Summary */}
        <div className="bg-white shadow rounded p-4 flex flex-col items-center justify-center">
          <h3 className="font-semibold mb-2">Posts</h3>
          <p className="text-xl font-bold">{stats.totalPosts}</p>
          <p className="text-gray-500">Bookmarked: {stats.bookmarkedPosts}</p>
        </div>

        {/* Favorite Tracks Summary */}
        <div className="bg-white shadow rounded p-4 flex flex-col items-center justify-center">
          <h3 className="font-semibold mb-2">Favorite Tracks</h3>
          <p className="text-xl font-bold">{Object.keys(stats.favoriteTracks).length}</p>
        </div>

        {/* Mood Distribution */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="font-semibold mb-2">Mood Distribution (For photo Upload)</h3>
          <Pie data={moodChartData} />
        </div>

        {/* Listening History */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="font-semibold mb-2">Listening History</h3>
          <Bar data={listenChartData} options={{ indexAxis: "y" }} />
        </div>
      </div>
    </div>
  );
}