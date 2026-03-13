import React, { useState, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { getCookie } from "../utils";

export default function PostCard({ post }) {
  const [currentTrackUrl, setCurrentTrackUrl] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(true);

  useEffect(()=>{
    setOverlayVisible(true);
  }, [currentTrackUrl])

  const handleOverlayClick = async (trackId) => {
    console.log("User clicked play overlay!", trackId);

    try {
      const res = await fetch("http://localhost:8000/spotify/played/", {
        method: "POST",
        credentials: "include", // include cookies/session
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken") // if using CSRF protection
        },
        body: JSON.stringify({
          spotify_id: trackId,
        }),
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

    // hide overlay so user can interact with iframe
    setOverlayVisible(false);
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

      say heeeeeeee:`${overlayVisible}`
      {/* Spotify Player */}
      {currentTrackUrl && (
      <div style={{ position: "relative", width: "100%", height: "152px", borderRadius: "12px", overflow: "hidden" }}>        
        <div className="mt-3">
          <iframe
            src={`https://open.spotify.com/embed/track/${currentTrackUrl}`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="encrypted-media"
            title="Spotify Player"
            style={{position: "absolute", zIndex: 1}}
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
                // backgroundColor: "transparent", 
                backgroundColor: "rgba(255,0,0,0.3)", 
                zIndex: 2,
              }}
            />)}
            </div>
        </div>
      )}
    </div>
  );
}
