import React, { useState, useEffect } from "react";
import { MoreVertical, Heart, Bookmark, Trash2 } from "lucide-react";
import { getCookie, checkFavorite, toggleFavorite } from "../utils";


export default function PostCard({ post, onDelete, onBookmarkToggle}) {
  const [currentTrackUrl, setCurrentTrackUrl] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [isFavorite, setIsFavorite] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const moodColors = {
    angry: "rgba(255, 99, 132, 0.25)",     // soft red
    sad: "rgba(100, 149, 237, 0.25)",      // pastel blue
    neutral: "rgba(200, 200, 200, 0.25)",  // light gray
    happy: "rgba(255, 223, 128, 0.25)",    // soft yellow
    surprise: "rgba(186, 104, 200, 0.25)", // pastel purple
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`http://localhost:8000/posts/${post.id}/delete/`, {
        method: "DELETE",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
        credentials: "include",
      });

      if (res.ok) {
        onDelete?.(post.id);
        console.log("Post deleted");
      } else {
        console.warn("Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleBookmark = async () => {
    try {
      const res = await fetch(`http://localhost:8000/posts/${post.id}/bookmark/`, {
        method: "POST",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        onBookmarkToggle?.(post.id, data.bookmark); // update parent state
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
    }
  };

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
    <div
      className="rounded-2xl shadow-sm p-4 w-5/5 mx-auto mb-6"
      style={{
        backgroundColor: moodColors[post.tracks[0]?.mood?.toLowerCase()] || "white",
      }}
    >

      {/* User Info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3" onClick={async()=>window.location.href="/profile"}>
          <img
            src={post.user.profile_url 
              ? `http://localhost:8000/media/uploads/${post.user.profile_url}` 
              : 'http://localhost:8000/media/uploads/defaultProfile.jpg'}
              alt="Profile"
            className="w-12 h-12 rounded-full object-cover border"
          />
          <span className="font-semibold">{post.user?.username}</span>
        </div>

        <div className="relative">
          <div className="flex space-x-3">
            <p className="text-xs text-gray-600 capitalize mb-2">
              {post.tracks[0]?.mood}
            </p>
            <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
              <Trash2 size={18} />
            </button>
            <button onClick={handleBookmark} className="hover:text-yellow-500">
              <Bookmark
                size={18}
                color={post.bookmark ? "yellow" : "gray"}
                fill={post.bookmark ? "yellow" : "none"}
              />
            </button>
          </div>
        </div>
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
          
          <div className="flex flex-col space-y-2">
            {post.tracks.map((track) => {
              const artistsArray = Array.isArray(track.artists) ? track.artists : [];

              return (
                <div
                  key={track.id}
                  onClick={() => setCurrentTrackUrl(track.spotify_id)}
                  className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                >
                  <div className="flex pb-10">
                    <span className="pr-10 center">
                      <img width="25" height="25" src="https://img.icons8.com/ios-filled/50/play--v1.png" alt="play--v1"/>
                    </span>
                    <div className="flex flex-col">
                      {/* Song name */}
                      <span className="text-sm font-medium text-gray-800">
                        {track.name}
                      </span>

                      {/* Artists */}
                      <span className="text-xs text-gray-500">
                        {artistsArray.join(", ") || "Unknown artist"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Spotify Player */}
      {currentTrackUrl && (
        <div style={{ position: "relative", width: "100%", height: "80px", borderRadius: "12px", overflow: "hidden" }}>
          <div>
            <iframe
              src={`https://open.spotify.com/embed/track/${currentTrackUrl}`}
              width="100%"
              height="80"
              frameBorder="0"
              allow="encrypted-media"
              title="Spotify Player"
              style={{ position: "absolute", zIndex: 1, display: "block" }}
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