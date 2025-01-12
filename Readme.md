# Real-Time Chat Application 💬

A real-time chat application built using **Node.js**, **React**, and **Socket.IO** to facilitate seamless communication between users. This project demonstrates a full-stack approach with a responsive design, ensuring an optimal user experience across both desktop and mobile platforms. Whether you're chatting with friends or collaborating with teammates, this app offers instant and smooth messaging.

---

## 🚀 Tech Stack

### Backend:
- **Node.js**: The runtime environment for server-side logic and handling real-time connections.
- **Express.js**: Framework to set up RESTful APIs and server structure.
- **Socket.IO**: Enables real-time, WebSocket-based communication for instant messaging.

### Frontend:
- **React**: A dynamic, component-based framework for building the interactive user interface.
- **CSS**: Used for styling the application and ensuring responsiveness across different screen sizes.

### Additional Tools:
- **npm**: For managing project dependencies and packages.

---

## 🛠 Installation Instructions

To get started with the chat application, follow these steps:

### 1. Clone the Repository
Clone the repository to your local machine:
```bash
git clone <repository_url>
cd <repository_name>
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install the backend dependencies:
```bash
npm install
```

Start the backend server:
```bash
node server.js
```

### 3. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install the frontend dependencies:
```bash
npm install
```

Start the React development server:
```bash
npm start
```

---

## 📝 Configuration

Before running the app, make sure you create a `.env` file in the root directory of your project. The file should contain the following environment variables:

```
MONGO_URI=<your_mongo_database_uri>
JWT_SECRET=<your_jwt_secret_key>
PORT=<your_server_port>
```

### Example `.env` file:
```
MONGO_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=yourSecretKeyHere
PORT=5000
```

---

## 📱 Responsive Design

This chat application is designed to be responsive, offering a smooth user experience on both **desktop** and **mobile** devices. Whether you're at your desk or on the go, you can stay connected and engaged in conversations seamlessly.









