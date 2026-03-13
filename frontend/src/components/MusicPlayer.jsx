import { useState, useEffect } from "react";
import { getCookie } from "../utils";

export default function MusicPlayer({ currentSong }) {

   const [overlayVisible, setOverlayVisible] = useState(true);

   // Reset overlay whenever the song changes
    useEffect(() => {
      setOverlayVisible(true);
    }, [currentSong]);
  
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
    <div className="bg-gray-100 rounded-xl p-3 text-center mt-6">
      {currentSong ? (
        <>
        <div style={{ position: "relative", width: "100%", height: "82px", borderRadius: "12px", overflow: "hidden" }}>
          <iframe
            title="Spotify Player"
            src={`https://open.spotify.com/embed/track/${currentSong.spotify_id}`}
            height="80"
            width="100%"
            frameBorder="0"
            allow="encrypted-media"
          />

          {overlayVisible && (
          <div
            id="overlay_play"
            onClick={() => handleOverlayClick(currentSong.spotify_id)}
            style={{
              position: "absolute",
              top: 0,
              left: 280,
              width: "30%",
              height: "100%",
              cursor: "pointer",
              // backgroundColor: "transparent", 
              backgroundColor: "rgba(255,0,0,0.3)", 
              zIndex: 2,
            }}
          />)}
        </div>
        </>
      ) : (
        <p className="text-gray-400 text-sm">No song selected</p>
      )}

    </div>
  );
}