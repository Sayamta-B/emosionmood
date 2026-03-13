export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let cookie of cookies) {
            const [key, value] = cookie.trim().split("=");
            if (key === name) {
                cookieValue = decodeURIComponent(value);
                break;
            }
        }
    }
    return cookieValue;
}

export async function checkFavorite(spotifyId) {
  try {
    const res = await fetch(`http://localhost:8000/spotify/is_favorite/${spotifyId}/`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch favorite status");
    const data = await res.json();
    return data.is_favorite; // true or false
  } catch (err) {
    console.error(err);
    return false; // fallback
  }
}

export async function toggleFavorite(spotify_id){
    const res = await fetch(`http://localhost:8000/spotify/toggle_favorite/`, {
      "method":"POST",
      headers:{
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken")
     },
      credentials: "include",
      body: JSON.stringify({ spotify_id })
    });
    if (!res.ok) throw new Error("Failed to toggle favorite");

    return res.json();
}