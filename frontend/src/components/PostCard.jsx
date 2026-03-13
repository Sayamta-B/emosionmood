import React, { useState, useEffect } from "react";
import { MoreVertical, Heart } from "lucide-react";
import { getCookie, checkFavorite, toggleFavorite } from "../utils";

export default function PostCard({ post }) {
  const [currentTrackUrl, setCurrentTrackUrl] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [isFavorite, setIsFavorite] = useState(null);

  useEffect(() => {
    setOverlayVisible(true);

    if (!currentTrackUrl) return;

    const fetchFavorite = async () => {
      try {
        const fav = await checkFavorite(currentTrackUrl);
        setIsFavorite(fav);
      } catch (err) {
        console.error("Failed to fetch favorite status:", err);
      }
    };
    fetchFavorite();
  }, [currentTrackUrl]);

  const handleOverlayClick = async (trackId) => {
    console.log("User clicked play overlay!", trackId);

    try {
      const res = await fetch("http://localhost:8000/spotify/played/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({ spotify_id: trackId }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Listening history updated:", data);
      } else {
        console.warn("Failed to update listening history:", data);
      }
    } catch (err) {
      console.error("Error updating listening history:", err);
    }

    setOverlayVisible(false);
  };

  const handleToggleFavorite = async () => {
    if (!currentTrackUrl) return;

    try {
      await toggleFavorite(currentTrackUrl);
      const fav = await checkFavorite(currentTrackUrl);
      setIsFavorite(fav);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 w-5/5 mx-auto mb-6">

      {/* User Info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="font-semibold">{post.user?.username}</span>
        </div>
        <MoreVertical size={18} className="text-gray-600" />
      </div>

      {/* Post Image */}
      {post.image_path && (
        <img
          src={post.image_path}
          alt="post"
          className="w-full h-64 object-cover rounded-xl mb-3"
        />
      )}

      {/* Tracks List */}
      {post.tracks?.length > 0 && (
        <div className="mt-3">
          <p className="font-semibold mb-2 text-sm text-gray-700">Songs:</p>
          <div className="flex flex-col space-y-1">
            {post.tracks.map((track) => {
              const artistsArray = Array.isArray(track.artists) ? track.artists : [];
              return (
                <button
                  key={track.id}
                  onClick={() => setCurrentTrackUrl(track.spotify_id)}
                  className="text-grey-600 text-sm text-left hover:underline"
                >
                  {track.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Spotify Player */}
      {currentTrackUrl && (
        <div style={{ position: "relative", width: "100%", height: "152px", borderRadius: "12px", overflow: "hidden" }}>
          <div>
            <iframe
              src={`https://open.spotify.com/embed/track/${currentTrackUrl}`}
              width="100%"
              height="80"
              frameBorder="0"
              allow="encrypted-media"
              title="Spotify Player"
              style={{ position: "absolute", zIndex: 1 }}
            ></iframe>
            
            {overlayVisible && (
              <div
                id="overlay_play"
                onClick={() => handleOverlayClick(currentTrackUrl)}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 520,
                  width: "10%",
                  height: "60%",
                  cursor: "pointer",
                  backgroundColor: "transparent",
                  zIndex: 2,
                }}
              />
            )}

            {/* Favorite Heart Button */}
            <button
              onClick={handleToggleFavorite}
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                zIndex: 3,
                padding: 0,
              }}
            >
              <Heart
                size={24}
                color={isFavorite ? "red" : "white"}
                fill={isFavorite ? "red" : "white"}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}