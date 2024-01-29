# Chat It
![Screenshot 2024-01-30 011142](https://github.com/raghav1482/Chatit/assets/98442936/b42d2995-bd7c-4e71-a573-76ae92c4dc10)

Chat It is a feature-rich chat application that provides a dynamic and interactive platform for real-time communication. Leveraging a robust technology stack, including Express, MongoDB, React, and Socket.io, the application offers a seamless chat experience with advanced features such as group chat, group administration, password encryption, JWT authentication, and cloud-based profile photo management through Cloudinary.
### Backend Technologies:
1. **Express.js:** A Node.js web application framework used for building the server-side application.

2. **MongoDB:** A NoSQL database used for storing chat messages and user data.

3. **bcrypt:** A library for password hashing and encryption.

4. **JSON Web Tokens (JWT):** Used for secure user authentication.

5. **Socket.io:** Enables real-time bidirectional event-based communication between clients and the server.

### Frontend Technologies:
1. **React:** A JavaScript library for building user interfaces.

2. **Material-UI (MUI):** A React UI framework that provides pre-designed components for a consistent and modern look.

3. **Toastify:** A library for displaying notifications in the application.

### Cloud Services:
1. **Cloudinary:** A cloud-based image and video management service used for storing and managing user profile photos.

### Development and Build Tools:
1. **Node.js:** A JavaScript runtime for executing server-side code.

2. **npm:** The package manager for JavaScript used for installing and managing project dependencies.

### Version Control:
1. **Git:** A distributed version control system for tracking changes in source code.

### OTHERS:
1. WEBRTC - for one to one Video calls
   
These technologies collectively contribute to the functionality and design of your Chat It application.

## Features

1. **Real-time Chat:** Utilizes Socket.io for seamless real-time communication between users.

2. **Video Call:** One on one Video calling functionality

3. **Group Chat:** Enables users to participate in group conversations.

4. **Group Admin:** Empowers administrators with additional control and management capabilities within group chats.

5. **Password Encryption:** Implements bcrypt for secure password hashing and storage.

6. **JWT Authentication:** Uses JSON Web Tokens for user authentication, providing a secure and efficient login system.

7. **Change Profile Photo:** Integrates Cloudinary to allow users to easily change and update their profile photos.

8. **Frontend with React:** Utilizes React for a dynamic and responsive user interface.

9. **Notification System:** Implements Toastify for a user-friendly notification system.

10. **Material-UI (MUI):** Enhances the application's UI with the Material-UI component library.

## Setup

### Prerequisites

- Node.js and npm installed
- MongoDB installed and running
- Cloudinary account for profile photo storage

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/raghav1482/chat-it.git
   cd chat-it
   ```

2. Install dependencies:

   ```bash
   cd mychatserver && npm install
   cd ../mychatapp && npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the `server` directory and configure the following:

   ```env
   PORT=3001
   DATABASE=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLD_NAME=your_cloudinary_cloud_name
   CLD_KEY=your_cloudinary_api_key
   CLD_SECRET=your_cloudinary_api_secret
   ```

4. Run the application:

   ```bash
   # Start the server
   cd mychatserver && nodemon index

   # Start the client
   cd ../mychatapp && npm start
   ```

Visit `http://localhost:3000` in your browser to access the application.


## License

This project is licensed under the [MIT License](LICENSE).

```

Remember to replace placeholders like `your-username`, `your_mongodb_connection_string`, `your_jwt_secret`, `your_cloudinary_cloud_name`, `your_cloudinary_api_key`, and `your_cloudinary_api_secret` with your actual information. Additionally, you might want to create `CONTRIBUTING.md` and `LICENSE` files if you haven't already and include them in your repository.
