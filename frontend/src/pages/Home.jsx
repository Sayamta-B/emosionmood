import { useEffect, useState } from "react";
import SidebarRight from "../components/SidebarRight";
import PostCard from "../components/PostCard";

function Home(){
    const [posts, setPosts] = useState([]);
    const [selectedMood, setSelectedMood] = useState("all");

    
    
    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetch("http://localhost:8000/posts/get_posts/", {
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            const data = await res.json();
            setPosts(data);
        };

        fetchPosts();
    }, []);
    
    
    const filteredPosts = posts.filter(post => {
        if (selectedMood === "all") return true;

        const mood = post.tracks[0]?.mood?.toLowerCase();
        return mood === selectedMood;
    });

    const handleDelete = (postId) => {
        setPosts(posts.filter(p => p.id !== postId));
    };

    const handleBookmarkToggle = (postId, isBookmarked) => {
        setPosts(posts.map(p => p.id === postId ? { ...p, bookmark: isBookmarked } : p));
    };

    return(
        <div className="flex h-screen relative">
            <main className="flex-1 overflow-y-auto p-5 space-y-5">
                <div className="flex space-x-2 mb-4">
                {["all", "happy", "sad", "angry", "neutral", "surprise"].map((mood) => (
                    <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={`px-3 py-1 rounded-full text-sm border 
                        ${selectedMood === mood ? "bg-black text-white" : "bg-gray-100"}`}
                    >
                    {mood}
                    </button>
                ))}
                </div>

                {filteredPosts.length > 0 ? (
                [...filteredPosts]
                    .sort((a, b) => b.bookmark - a.bookmark)
                    .map(post => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onDelete={handleDelete}
                        onBookmarkToggle={handleBookmarkToggle}
                    />
                    ))
                ) : (
                <p className="text-gray-500">No posts to display</p>
                )}
                </main>
            <SidebarRight />
        </div>
    );
}
export default Home;