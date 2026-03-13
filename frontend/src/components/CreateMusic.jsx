import MusicPlayer from "./MusicPlayer";
import { useState } from "react";

export default function CreateMusic({
  mood,
  recommendedSongs, setRecommendedSongs,
  selectedSongs, setSelectedSongs,
  handleNext
}) {


  const [overlayVisible, setOverlayVisible] = useState(true);

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

  // ----------------- Song Select / Deselect -----------------
  const handleToggleSong = (song) => {
    const exists = selectedSongs.some(s => s.spotify_id === song.spotify_id);

    const updated = exists
      ? selectedSongs.filter(s => s.spotify_id !== song.spotify_id)
      : [...selectedSongs, song];

    setSelectedSongs(updated);
    reorderRecommendations(updated);
  };


  const reorderRecommendations = (updatedSelected) => {
    const selectedIds = new Set(updatedSelected.map(s => s.spotify_id));

    const sortedSelected = updatedSelected.map(
      s => songs.find(x => x.spotify_id === s.spotify_id)
    );

    const unselected = songs.filter(s => !selectedIds.has(s.spotify_id));

    setRecommendedSongs([...sortedSelected, ...unselected]);
  };


  const currentSong = selectedSongs[selectedSongs.length - 1];
  

  return (
    <div className="w-2/5 flex flex-col justify-between bg-white shadow-md rounded-2xl p-6">

      {mood ? (
        <h2 className="text-2xl font-semibold text-blue-600 capitalize">
          Mood: {mood}
        </h2>
      ) : (
        <p className="text-gray-500">No mood detected yet.</p>
      )}

      <div className="max-h-[400px] overflow-y-auto space-y-2">

        {recommendedSongs.map((song) => {

          const isSelected = selectedSongs.some(
            s => s.spotify_id === song.spotify_id
          );

          return (
            <div
              key={song.spotify_id}
              className="flex justify-between items-center p-2 rounded-xl hover:bg-gray-100"
            >
              <div className="flex items-center space-x-3">

                <img
                  src={song.album_cover}
                  className="w-12 h-12 rounded-lg"
                />

                <div>
                  <p className="font-semibold">{song.name}</p>
                  <p className="text-sm text-gray-500">{song.artists}</p>
                </div>

              </div>

              <button
                onClick={() => handleToggleSong(song)}
                className={`px-4 py-1 rounded-lg ${
                  isSelected ? "bg-blue-500 text-black" : "bg-gray-200"
                }`}
              >
                {isSelected ? "Deselect" : "Select"}
              </button>

            </div>
          );
        })}

      </div>

      <MusicPlayer 
        currentSong={currentSong} 
      />
      <div style={{ position: "relative", width: "100%", height: "152px", borderRadius: "12px", overflow: "hidden" }}>
        <iframe
          src="https://open.spotify.com/embed/track/6i71yrjuQ9f1zUSVfEChem"
          width="100%"
          height="152"
          style={{ position: "relative", borderRadius: "12px", zIndex: 1 }}
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
        ></iframe>

        {overlayVisible && (
        <div
          id="overlay_play"
          onClick={handleOverlayClick}
          style={{
            position: "absolute",
            top: 0,
            left: 300,
            width: "30%",
            height: "100%",
            cursor: "pointer",
            // backgroundColor: "transparent", 
            backgroundColor: "rgba(255,0,0,0.3)", 
            zIndex: 2,
          }}
        />)}
      </div>

      <button
        onClick={handleNext}
        className="bg-blue-500 hover:bg-blue-600 text-black px-6 py-2 rounded-xl mt-6"
      >
        Next →
      </button>

    </div>
  );
}