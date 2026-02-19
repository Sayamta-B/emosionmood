import { useState } from "react";

function App() {
  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + "=")) {
          cookieValue = cookie.substring(name.length + 1);
        }
      }
    }
    return cookieValue;
  };

  const onLogout = async () => {
  const csrfToken = getCookie("csrftoken"); // reuse your CSRF function

  await fetch("http://127.0.0.1:8000/api/logout/", {
    method: "POST",                // ✅ important
    credentials: "include",
    headers: {
      "X-CSRFToken": csrfToken,    // required for POST in Django
    },
  });
  alert("Logged out!");
};


  const handleSubmit = async (e) => {
    e.preventDefault();// Prevent page reload

    try {
      // Step 1: Get CSRF cookie
      await fetch("http://127.0.0.1:8000/api/csrf/", {
        credentials: "include",
      });

      const csrfToken = getCookie("csrftoken");

      // Step 2: Send login request
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login successful!");
      } else {
        alert(data.error);
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  

  return (
    <div>
      <h2>Login Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />
        <br /><br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <br /><br />
        <button type="submit">Login</button>
        <button type="button" onClick={onLogout}>Logout</button>
      </form>
    </div>
  );
}

export default App;
