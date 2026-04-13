# 🎧 Emosion

### CNN-Based Mood Detection & Music Recommendation System

![Python](https://img.shields.io/badge/Python-3.x-blue)
![Django](https://img.shields.io/badge/Django-Backend-green)
![React](https://img.shields.io/badge/React-Frontend-blue)

---

## 📌 About the Project

**Emosion** is a full-stack web application that detects a user’s mood from facial images and recommends music accordingly. It combines **deep learning**, **computer vision**, and **modern web technologies** to create an interactive platform for mood-based content creation and music discovery.

---

## ✨ Features

### 👤 User

* Register & login
* Upload image for mood detection
* Create posts with music recommendations
* Play songs via Spotify embed
* Add songs to favorites
* Bookmark & delete posts
* View mood statistics dashboard
* Manage profile

### 🛠️ Admin

* Add / update / delete songs
* Manage song database
* View song details

---

## ⚙️ Tech Stack

| Layer       | Technology                    |
| ----------- | ----------------------------- |
| Frontend    | React, Vite                   |
| Backend     | Django, Django REST Framework |
| Database    | SQLite                        |
| ML Model    | CNN (PyTorch)    |
| CV Library  | OpenCV (Haar Cascade)         |
| Integration | Spotify Embed API             |

---

## 🧠 How It Works

```mermaid
graph TD
A[User Uploads Image] --> B[Face Detection (Haar Cascade)]
B --> C[Preprocessing (48x48 Grayscale)]
C --> D[CNN Model]
D --> E[Mood Prediction]
E --> F[Music Recommendation]
F --> G[Post Creation]
```

---

## 🤖 Machine Learning Model

### 📥 Input

* Grayscale image: **48 × 48**

### 📤 Output

* Mood: **Happy | Sad | Neutral | Surprise**

### 🧱 Architecture

* 4 Convolutional Layers (ReLU + MaxPooling)
* Flatten Layer
* Fully Connected Layers
* Softmax Output

---

## 👁️ Face Detection

* Haar Cascade Classifier (Viola–Jones algorithm)
* Detects and crops the largest face
* Reduces noise and improves prediction accuracy

---

## 🚀 Getting Started

### 🔧 Prerequisites

* Python 3.x
* Node.js & npm
* Git

---

### 📥 Installation

#### 1. Clone the repo

```bash
git clone https://github.com/your-username/emosion.git
cd emosion
```

#### 2. Backend setup

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

#### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📂 Project Structure

```
Emosion/
│── backend/        # Django APIs
│── frontend/       # React UI
│── model/          # CNN
│── db.sqlite3
```

---

## 📊 Non-Functional Requirements

* ⚡ Fast performance
* 🔒 Secure user data & privacy
* 📈 Scalable architecture
* 🛠️ Maintainable and modular design
* 🎯 User-friendly interface

---

## 🔮 Future Scope

* Real-time webcam emotion detection
* Advanced recommendation system (AI-based)
* More emotion classes
* Mobile app (Flutter/React Native)
* Multi-platform music integration

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

## 👨‍💻 Author

Sayamta
