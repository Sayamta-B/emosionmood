import React, { useState } from "react";
import { MoreVertical } from "lucide-react";

export default function PostCard({ post }) {
  const [currentTrackUrl, setCurrentTrackUrl] = useState(null);

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
        <div className="mt-3">
          <iframe
            src={`https://open.spotify.com/embed/track/${currentTrackUrl}`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="encrypted-media"
            allowTransparency="true"
            title="Spotify Player"
          ></iframe>
        </div>
      )}

    </div>
  );
}
