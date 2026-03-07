import CreateForm from "../components/CreateForm";
import CreateMusic from "../components/CreateMusic";

function Create(){
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
            setSongs(recos);
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
            body: formData
        });

        const data = await res.json();

        setImageUrl(data.image_url ?? null);
        setDetectedMood(data.mood ?? null);
        setDetectedConfidence(data.confidence ?? null);
        const recos= data.recommendations;
        setSongs(recos);
        setRecommendedSongs(recos.slice(0, 5));

        return data.mood ?? null;
    };

    const handleNext = async () => {
        if (!mood && !file) return alert("Please select a mood or upload an image!");
        if (!selectedSongs.length) return alert("Please select at least one song!");
        if (!userId) return alert("User ID missing!");

        try {
            const res = await fetch("http://localhost:8000/posts/create_post/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // matches DRF
            },
            body: JSON.stringify({
                user_id: userId, // <-- use userId from context
                image: imageUrl || null,
                songs: selectedSongs.map(s => ({
                spotify_id: s.spotify_id,
                name: s.name,
                artists: s.artists,
                album: s.album?.name ?? "",
                image_url: s.album_cover,
                duration_ms: s.duration_ms,
                genre: s.genre
                }))
            })
            });

            const data = await res.json();

            if (!data.post_id) return alert("hihihiFailed to create post!");

            // ⭐ SAVE MOOD INTO DATABASE
            await fetch("http://127.0.0.1:8000/api/save_mood/", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: userId,
                post_id: data.post_id,
                mood: detectedMood,
                confidence: detectedConfidence
            })});

            setPostId(data.post_id);
            navigate("/home");
        } catch (err) {
            console.error(err);
            alert("Failed to create post");
        }
        };



    return(
        <>
            <CreateForm/>
            <CreateMusic/>
        </>
    );
}
export default Create;