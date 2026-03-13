import { useState, useEffect } from "react";

export default function MusicPlayer({ currentSong }) {

   const [overlayVisible, setOverlayVisible] = useState(true);

   // Reset overlay whenever the song changes
    useEffect(() => {
      setOverlayVisible(true);
    }, [currentSong]);
  
    const handleOverlayClick = () => {
      console.log("User clicked play overlay!");
      // send to backend
      // fetch("/api/track-played/", {
      //   method: "POST",
      //   body: JSON.stringify({ trackId: "3n3Ppam7vgaVa1iaRUc9Lp" }),
      //   headers: { "Content-Type": "application/json" },
      // });
      // hide overlay so user can click iframe
      setOverlayVisible(false);
    };
  return (
    <div className="bg-gray-100 rounded-xl p-4 text-center mt-6">

      <p className="font-semibold mb-2">Music Player</p>

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
            onClick={handleOverlayClick}
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

          <p className="mt-2 text-sm">
            🎵 Now playing: <strong>{currentSong.name}</strong> by {currentSong.artists}
          </p>
        </>
      ) : (
        <p className="text-gray-400 text-sm">No song selected</p>
      )}

    </div>
  );
}