import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { getCookie, checkFavorite, toggleFavorite } from "../utils";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [currentTrackUrl, setCurrentTrackUrl] = useState(null);
  const [favoriteStatus, setFavoriteStatus] = useState({}); // trackId → bool

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch("http://localhost:8000/spotify/favorites/", {
          credentials: "include",
        });
        const data = await res.json();
        setFavorites(data);

        // fetch favorite status for each track
        const status = {};
        for (const track of data) {
          const favRes = await fetch(`http://localhost:8000/spotify/is_favorite/${track.spotify_id}/`, {
            credentials: "include",
          });
          const favData = await favRes.json();
          status[track.spotify_id] = favData.is_favorite;
        }
        setFavoriteStatus(status);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      }
    };

    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (spotify_id) => {
    try {
      await toggleFavorite(spotify_id);
      const fav = await checkFavorite(spotify_id);
      setFavoriteStatus((prev) => ({ ...prev, [spotify_id]: fav }));
      if (!fav) setFavorites((prev) => prev.filter(t => t.spotify_id !== spotify_id));
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  return (
    <div className="relative min-h-screen pb-24 p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Your Favorite Songs</h1>

      {favorites.length > 0 ? (
        <div className="flex flex-col space-y-2">
          {favorites.map((track) => (
            <div
              key={track.spotify_id}
              onClick={() => setCurrentTrackUrl(track.spotify_id)}
              className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition flex justify-between items-center border"
            >
              <div className="flex items-center space-x-3">
                <img
                  width="25"
                  height="25"
                  src="https://img.icons8.com/ios-filled/50/play--v1.png"
                  alt="play button"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">{track.name}</span>
                  <span className="text-xs text-gray-500">
                    {track.artists?.join(", ") || "Unknown artist"}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorite(track.spotify_id);
                }}
              >
                <Heart
                  size={20}
                  color={favoriteStatus[track.spotify_id] ? "red" : "gray"}
                  fill={favoriteStatus[track.spotify_id] ? "red" : "none"}
                />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No favorite songs yet</p>
      )}

      {/* Fixed Spotify Player */}
      {currentTrackUrl && (
        <div className="fixed bottom-0 left-70 w-270 bg-white shadow-inner z-50 p-2 overflow-y-auto p-5 space-y-5">
          <iframe
            src={`https://open.spotify.com/embed/track/${currentTrackUrl}`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="encrypted-media"
            title="Spotify Player"
          />
        </div>
      )}
    </div>
  );
}