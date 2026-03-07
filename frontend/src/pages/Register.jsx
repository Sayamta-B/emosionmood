import { useContext } from "react";
import RegisterContext from "../context/RegisterContext";
import { getCookie } from "../utils";

function Register(){
    const { form, setForm } = useContext(RegisterContext);
    const onHandleChange = (e) => {
        setForm({ ...form, 
            [e.target.name]: e.target.value });
    };

    const onHandleSubmit= async(e)=>{
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
        alert("Passwords do not match!");
        return;
        }

        try {
            const csrfToken=getCookie('csrftoken');
            console.log(csrfToken);
            const res = await fetch("http://localhost:8000/users/register/", {
                method: "POST",
                headers: { "Content-Type": "application/json", "X-CSRFToken":csrfToken },
                credentials: "include", 
                body: JSON.stringify(form),
            });

            const data = await res.json();
            console.log("Backend response:", data);

            if (res.ok) {
                alert("Registered successfully!");
                window.location.href = "/login";
            } else {
                alert(data.detail || JSON.stringify(data));
            }
            } catch (err) {
            console.error(err);
            alert("Something went wrong!");
            }
    }
    return(
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <form
            onSubmit={onHandleSubmit}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm space-y-4"
        >
            <h2 className="text-3xl font-bold text-center text-gray-800">
            Register
            </h2>

            <input
            name="username"
            value={form.username}
            placeholder="Username"
            onChange={onHandleChange}
            required
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400"
            />

            <input
            name="email"
            type="email"
            value={form.email}
            placeholder="Email"
            onChange={onHandleChange}
            required
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400"
            />

            <input
            name="first_name"
            value={form.first_name}
            placeholder="First Name"
            onChange={onHandleChange}
            required
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400"
            />

            <input
            name="last_name"
            value={form.last_name}
            placeholder="Last Name"
            onChange={onHandleChange}
            required
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400"
            />

            <input
            name="password"
            type="password"
            value={form.password}
            placeholder="Password"
            onChange={onHandleChange}
            required
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400"
            />

            <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            placeholder="Confirm Password"
            onChange={onHandleChange}
            required
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400"
            />

            <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all"
            >
            Register
            </button>
        </form>
        </div>
    );
}
export default Register;