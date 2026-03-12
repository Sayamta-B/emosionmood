import { useState } from "react";
import CreateInfoContext from "./CreateInfoContext";

export default function CreateInfoProvider({ children }) {
    const [userId, setUserId] = useState("");
    const [postId, setPostId] = useState("");
    const [mood, setMood] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [songs, setSongs] = useState([]);
    const [selectedSongs, setSelectedSongs] = useState([]);
    const [recommendedSongs, setRecommendedSongs] = useState([]);
    const [file, setFile] = useState(null);
    const [manualMood, setManualMood] = useState("");
    
    return (
        <CreateInfoContext.Provider
            value={{
                userId, setUserId,
                postId, setPostId,
                mood, setMood,
                imageUrl, setImageUrl,
                songs, setSongs,
                selectedSongs, setSelectedSongs,
                recommendedSongs, setRecommendedSongs,
                file, setFile,
                manualMood, setManualMood
            }}
        >
            {children}
        </CreateInfoContext.Provider>
    );
}