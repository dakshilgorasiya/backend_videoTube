# VideoTube

This is a backend project built with Node.js, designed to function as a YouTube-like platform while introducing unique features and improvements.

## Features
- **User Management**: Sign up, login, and manage user profiles.
- **Health Check API**: Monitor the application's health status.
- **Tweets (Short Posts)**: Users can share short updates.
- **Subscriptions**: Manage channel subscriptions.
- **Videos**: Upload, fetch, and manage video content.
- **Comments**: Add and manage comments on videos.
- **Likes**: Like and dislike videos.
- **Playlists**: Create and manage video playlists.
- **Dashboard**: Admin and user dashboards for analytics.

## Tech Stack
- **Node.js** (Backend runtime)
- **Express.js** (Framework for handling routes and middleware)
- **MongoDB** (Database for storing user data, videos, comments, etc.)
- **JWT** (Authentication mechanism)
- **Multer** (For handling file uploads)
- **Mongoose** (MongoDB ORM for schema handling)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and configure environment variables (e.g., database URL, JWT secret).
4. Start the development server:
   ```sh
   npm run dev
   ```
   
## Contribution
Feel free to contribute by opening issues or submitting pull requests.

## License
This project is licensed under the MIT License.

