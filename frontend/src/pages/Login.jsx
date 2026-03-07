import { useContext } from "react";
import LoginContext from "../context/LoginContext";
import { Link } from "react-router-dom";
import { getCookie } from "../utils";

function Login(){
    const {form, setForm} =useContext(LoginContext);
    const onHandleChange = (e) =>{
        setForm({ 
            ...form, 
            [e.target.name]: e.target.value 
        });
    }

    const onHandleSubmit= async(e)=>{
        e.preventDefault();
        try {
            const csrfToken = getCookie("csrftoken");

            const res = await fetch("http://localhost:8000/users/login/", {
                method: "POST",
                credentials: "include", // allow session cookies
                headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Logged in successfully!");
                window.location.href = "/";
            } else {
                alert(data.error || "Invalid email or password!");
            }
        } catch (err) {
        console.error(err);
        alert("Something went wrong!");
        }
    }

      return (
        <div className="flex items-center justify-center" style={{height: "100vh"}}>
        <div className="flex flex-col items-center justify-center">
        <form
            onSubmit={onHandleSubmit}
            className="bg-white p-6 rounded-lg shadow-md w-80 flex flex-col gap-3"
            >
            <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

            <input
            name="email"
            type="email"
            value={form.email}
            placeholder="Email"
            className="border p-2 w-full rounded"
            onChange={onHandleChange}
            required
            />

            <input
            name="password"
            type="password"
            value={form.password}
            placeholder="Password"
            className="border p-2 w-full rounded"
            onChange={onHandleChange}
            required
            />

            <button
            type="submit"
            className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-600 transition"
            >
            Login
            </button>

            <p className="text-sm text-gray-600 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
                Register
            </Link>
            </p>
        </form>
        </div>
        </div>
    );
}

export default Login;