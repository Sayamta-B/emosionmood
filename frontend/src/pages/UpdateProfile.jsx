import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils";

export default function UpdateProfile() {
  const navigate = useNavigate();
  const csrfToken = getCookie("csrftoken");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // 🔹 Fetch current user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/users/me/", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();

          setFormData({
            username: data.username || "",
            email: data.email || "",
            first_name: data.first_name || "",
            last_name: data.last_name || "",
          });

          // ✅ Set existing profile image preview
          if (data.profile_url) {
            setPreviewUrl(`http://localhost:8000${data.profile_url}`);
          } else {
            setPreviewUrl("http://localhost:8000/media/uploads/defaultProfile.jpg");
          }
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  // 🔹 Handle text input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 🔹 Handle file selection + preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = new FormData();

      dataToSend.append("username", formData.username);
      dataToSend.append("email", formData.email);
      dataToSend.append("first_name", formData.first_name);
      dataToSend.append("last_name", formData.last_name);

      // ✅ Only send file if selected
      if (selectedFile) {
        dataToSend.append("profile_url", selectedFile);
      }

      const res = await fetch("http://localhost:8000/users/update/", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "X-CSRFToken": csrfToken,
        },
        body: dataToSend,
      });

      if (res.ok) {
        alert("Profile updated successfully!");
        navigate("/profile");
      } else {
        const err = await res.json();
        console.error("Update error:", err);
        alert(JSON.stringify(err));
      }
    } catch (err) {
      console.error("Request error:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Update Profile</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* ✅ Profile Image Preview */}
        <img
          src={previewUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border self-center"
        />

        {/* File Input */}
        <input type="file" accept="image/*" onChange={handleFileChange} />

        {/* Text Inputs */}
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          className="border p-2 rounded"
        />

        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2 rounded"
        />

        <input
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="First Name"
          className="border p-2 rounded"
        />

        <input
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          className="border p-2 rounded"
        />

        {/* Buttons */}
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Save
          </button>

          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}