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
    profile_url: "",
  });
  const [selectedFile, setSelectedFile] = useState(null); // optional file
  const [previewUrl, setPreviewUrl] = useState(""); // preview image

  useEffect(() => {
    async function fetchUser() {
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
            profile_url: data.profile_url || "uploads/defaultProfile.jpg",
          });
          setPreviewUrl(
            data.profile_url
              ? `http://localhost:8000/media/${data.profile_url}`
              : "http://localhost:8000/media/uploads/defaultProfile.jpg"
          );
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = new FormData();
      for (const key of ["username", "email", "first_name", "last_name", "profile_url"]) {
        dataToSend.append(key, formData[key]);
      }
      if (selectedFile) dataToSend.append("profile_url", selectedFile);

      const res = await fetch("http://localhost:8000/users/update/", {
        method: "PATCH",
        credentials: "include",
        headers: { "X-CSRFToken": csrfToken },
        body: dataToSend,
      });

      if (res.ok) {
        alert("Profile updated!");
        navigate("/profile");
      } else {
        const err = await res.json();
        console.error(err);
        alert("Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <img src={previewUrl} alt="Profile Preview" className="w-24 h-24 rounded-full mb-2" />

        <input type="file" accept="image/*" onChange={handleFileChange} />

        <input
          name="profile_url"
          value={formData.profile_url}
          onChange={handleChange}
          placeholder="Profile URL"
          className="border p-2 rounded"
        />

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

        <div className="flex gap-2 mt-2">
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
            Save
          </button>
          <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={() => navigate("/profile")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}