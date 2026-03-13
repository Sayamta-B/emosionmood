import CreateForm from "../components/CreateForm";
import CreateMusic from "../components/CreateMusic";
import { getCookie } from "../utils"
import { useContext, useState, useEffect } from "react";
import CreateInfoContext from "../context/CreateInfoContext";

function Create(){
    const csrfToken= getCookie('csrftoken');
    const {
        mood, setMood,
        file, setFile,
        imageUrl, setImageUrl,
        songs, setSongs,
        selectedSongs, setSelectedSongs,
        recommendedSongs, setRecommendedSongs,
        manualMood, setManualMood
    } = useContext(CreateInfoContext);
    const [detectedMood, setDetectedMood] = useState(null);
    const [detectedConfidence, setDetectedConfidence] = useState(null);


    useEffect(() => {
        const detectMood = async () => {
            if (!file && !manualMood) return;

            const detected = manualMood || (await getMoodFromFile(file));
            if (!detected) return;

            setMood(detected);

            const recos = await fetchRecommendations(detected);
            setSongs(recos); // for refresh function in future
            setRecommendedSongs(recos.slice(0, 5));
        };
        detectMood();
    }, [file, manualMood]);


    const getMoodFromFile = async (file) => {
        if (!file) return null;

        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("http://localhost:8000/mood/predict/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrfToken
            },
            body: formData
        });

        const data = await res.json();
        console.log("predict response:", data);

        setImageUrl(data.image_url ?? null);
        setDetectedMood(data.mood ?? null);
        setDetectedConfidence(data.confidence ?? null);
        return data.mood ?? null;
    };

    const fetchRecommendations = async (current_mood) => {
        try {
        const res = await fetch(
            `http://localhost:8000/spotify/get_recommendation/?mood=${current_mood}`,
            { credentials: "include" }
        );

        const data = await res.json();
        return data.recommendations ?? [];
        } catch (err) {
        console.error("Recommendation fetch failed:", err);
        return [];
        }
    };

    
      // ----------------- Next Button -----------------
    const handleNext = async () => {
        if (!mood && !file) 
            return alert("Please select a mood or upload an image!");
        if (!selectedSongs.length) 
            return alert("Please select at least one song!");

        try {
            const res = await fetch("http://localhost:8000/posts/create_post/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 
                    "X-CSRFToken": csrfToken
                },
                credentials: "include",
                body: JSON.stringify({
                    image: imageUrl || null,
                    songs: selectedSongs.map(s => ({
                        spotify_id: s.spotify_id,
                        name: s.name,
                        artists: s.artists,
                        album: s.album ?? "",
                        mood : s.mood,
                    }))
                })
            });
            const data = await res.json();
            alert("hello");
            if (!data.post_id) 
                return alert("Failed to create post!");
            console.log(data.saved_tracks);


            // SAVE MOOD INTO DATABASE
            await fetch("http://localhost:8000/mood/save_mood/", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken
                },
                body: JSON.stringify({
                    post_id: data.post_id,
                    mood: detectedMood,
                    confidence: detectedConfidence
            })});

            window.location.href="/home";
        } catch (err) {
            console.error(err);
            alert("Failed to create post");
        }
    };


    return(
        <div className="flex min-h-screen bg-gray-50 p-6 gap-6">
            <CreateForm 
                file={file} 
                setFile={setFile} 
                manualMood={manualMood} 
                setManualMood={setManualMood} 
            />
                <CreateMusic
                    mood={mood}
                    recommendedSongs={recommendedSongs}
                    setRecommendedSongs={setRecommendedSongs}
                    selectedSongs={selectedSongs}
                    setSelectedSongs={setSelectedSongs}
                    handleNext={handleNext}
                />
        </div>
    );
}
export default Create;