import { useEffect, useState } from "react";
import SidebarRight from "../components/SidebarRight";
import PostCard from "../components/PostCard";

function Home(){
    const [posts, setPosts] = useState([]);
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

    const handleDelete = (postId) => {
        setPosts(posts.filter(p => p.id !== postId));
    };

    const handleBookmarkToggle = (postId, isBookmarked) => {
        setPosts(posts.map(p => p.id === postId ? { ...p, bookmark: isBookmarked } : p));
    };

    return(
        <div className="flex h-screen relative">
            <main className="flex-1 overflow-y-auto p-5 space-y-5">
                {posts.length > 0 ? (
                    [...posts]
                    .sort((a, b) => b.bookmark - a.bookmark) // bookmarked first
                    .map(post => 
                        <PostCard 
                        key={post.id} 
                        post={post} 
                        onDelete={handleDelete}
                        onBookmarkToggle={handleBookmarkToggle} 
                        />
                    )
                ) : (
                    <p className="text-gray-500">No posts to display</p>
                )}
                </main>
            <SidebarRight />
        </div>
    );
}
export default Home;