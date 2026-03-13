import { useEffect, useState } from "react";
import SidebarRight from "../components/SidebarRight";
import PostCard from "../components/Postcard";

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
    return(
        <div className="flex h-screen relative">
            <main className="flex-1 overflow-y-auto p-5 space-y-5">
                {posts.length > 0 ? (
                posts.map(post => <PostCard key={post.id} post={post} />)
                ) : (
                <p className="text-gray-500">No posts to display</p>
                )}
            </main>
            <SidebarRight />
        </div>
    );
}
export default Home;