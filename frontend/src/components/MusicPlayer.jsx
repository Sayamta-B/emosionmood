import { useState, useEffect } from "react";
import { getCookie, checkFavorite, toggleFavorite } from "../utils";
import { Heart } from "lucide-react";

export default function MusicPlayer({ currentSong }) {

   const [overlayVisible, setOverlayVisible] = useState(true);
   const [isFavorite, setIsFavorite] = useState(null);

   // Reset overlay whenever the song changes
    useEffect(() => {
      setOverlayVisible(true);

      if (!currentSong) return; 

      const fetchFavorite = async () => {
        const fav = await checkFavorite(currentSong.spotify_id);
        setIsFavorite(fav);
      };
      fetchFavorite();
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

      const handleToggleFavorite = async () => {
        if (!currentSong) return;

        await toggleFavorite(currentSong.spotify_id); // call backend toggle
        const fav = await checkFavorite(currentSong.spotify_id); // refresh status
        setIsFavorite(fav); 
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
              backgroundColor: "transparent", 
              // backgroundColor: "rgba(255,0,0,0.3)", 
              zIndex: 2,
            }}
          />)}
          <button 
          onClick={handleToggleFavorite}
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            zIndex: 3, // above overlay
            padding: 0,
          }}>
            <Heart
              size={24}
              color={isFavorite ? "red" : "white"} // filled effect
              fill={isFavorite ? "red" : "white"}   // actually fills it
            />
          </button>
        </div>
        </>
      ) : (
        <p className="text-gray-400 text-sm">No song selected</p>
      )}

    </div>
  );
}