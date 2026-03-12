import React, { useEffect, useState } from "react";

export default function SidebarRight() {
  const [spotifyConnected, setSpotifyConnected] = useState(false);


  return (
    <aside className="w-2/5 bg-white p-2 shadow-md flex flex-col h-screen">

      {(
        <iframe
          className="rounded-xl flex-1"
          src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M"
          width="100%"
          height="380"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify Player"
        ></iframe>
      )}
    </aside>
  );
}
