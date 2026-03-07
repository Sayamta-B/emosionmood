import MusicPlayer from "./MusicPlayer";

export default function CreateMusic({
  mood,
  songs,
  selectedSongs,
  handleToggleSong,
  handleNext
}) {

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

        {songs.map((song) => {

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

      <MusicPlayer currentSong={currentSong} />

      <button
        onClick={handleNext}
        className="bg-blue-500 hover:bg-blue-600 text-black px-6 py-2 rounded-xl mt-6"
      >
        Next →
      </button>

    </div>
  );
}