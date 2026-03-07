export default function MusicPlayer({ currentSong }) {

  return (
    <div className="bg-gray-100 rounded-xl p-4 text-center mt-6">

      <p className="font-semibold mb-2">Music Player</p>

      {currentSong ? (
        <>
          <iframe
            title="Spotify Player"
            src={`https://open.spotify.com/embed/track/${currentSong.spotify_id}`}
            height="80"
            width="100%"
            frameBorder="0"
            allow="encrypted-media"
          />

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