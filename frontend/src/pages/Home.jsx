import { useEffect, useState } from "react";
import SidebarRight from "../components/SidebarRight";
import PostCard from "../components/Postcard";
import { useLogin } from "../context/LoginState";
import { getCookie } from "../utils";

function Home(){
    // const [posts, setPosts] = useState([]);
    // useEffect(async()=>{
    //     const csrfToken=getCookie("csrftoken");
    //     const res= await fetch("http://localhost:8000/posts/view_posts",
    //         {
    //             headers:{"Content-Type":"application/json", "X-CSRFToken":csrfToken},
    //             credentials: "include"
    //         }
    //     )
    //     const posts=res.json('posts');
    // })
    return(
        <div className="flex h-screen relative">
            <main className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* {posts.length > 0 ? (
                posts.map(post => <PostCard key={post.id} post={post} />)
                ) : (
                <p className="text-gray-500">No posts to display</p>
                )} */}
                just wait
            </main>
            <SidebarRight />
        </div>
    );
}