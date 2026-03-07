import { useContext } from "react";
import FormContext from "../context/FormContext";
import { getCookie } from "../utils";

function Form() {
    const { form, setForm } = useContext(FormContext);

    const onHandleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const onLogout = async () => {
        const csrfToken = getCookie("csrftoken");
        await fetch("http://localhost:8000/users/logout/", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
        });
        alert("Logged out!");
        window.location.href = "/";
    };

    const onHandleSubmit = async (e) => {
        e.preventDefault();

        await fetch("http://localhost:8000/users/get_csrf/", {
            credentials: "include",
        });

        const csrfToken = getCookie("csrftoken");

        const res = await fetch("http://localhost:8000/users/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({ email: form.email, password: form.password }),
        });

        const data = await res.json();
        if (res.ok) {
            alert("Logged in successfully!");
            window.location.href = "/form";
        } else {
            alert(data.error || "Login failed");
        }
    };

    return (
        <form className="flex flex-col gap-2" onSubmit={onHandleSubmit}>
            <input
                placeholder="email"
                type="text"
                name="email"
                onChange={onHandleChange}
                value={form.email}
            />
            <input
                type="password"
                placeholder="password"
                name="password"
                onChange={onHandleChange}
                value={form.password}
            />
            <input type="submit" value="Login" />
            <input type="button" value="Logout" onClick={onLogout} />
        </form>
    );
}

export default Form;