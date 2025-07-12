# Premium Clothing Brand E-commerce Website

A modern, responsive e-commerce website built with a powerful MERN-stack (MongoDB, Express.js, React/Next.js, Node.js). It features a full shopping experience, from browsing products to secure checkout, along with a comprehensive admin dashboard for managing the store.

## Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI/Animation**: [Framer Motion](https://www.framer.com/motion/), [Keen Slider](https://keen-slider.io/), [Lucide Icons](https://lucide.dev/)
- **State Management & Data Fetching**: [SWR](https://swr.vercel.app/)
- **Internationalization (i18n)**: [i18next](https://www.i18next.com/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **Utilities**: [js-cookie](https://github.com/js-cookie/js-cookie), [jwt-decode](https://github.com/auth0/jwt-decode)

### Backend
- **Framework**: [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)
- **Database/ORM**: [MongoDB](https://www.mongodb.com/) with [Prisma](https://www.prisma.io/)
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/), [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Image Management**: [Cloudinary](https://cloudinary.com/) for cloud-based image storage
- **File Uploads**: [Multer](https://github.com/expressjs/multer)
- **API Client**: [Axios](https://axios-http.com/)

## Features

### Customer-Facing Features
- **Fully Responsive Design**: Adapts beautifully to all screen sizes.
- **Product Catalog**: Browse products with categories, search, and filtering.
- **Shopping Cart & Wishlist**: Easily add, manage, and save items.
- **Internationalization**: Supports multiple languages.
- **Product Details**: View detailed product information and image galleries.
- **User Authentication**: Secure sign-up and login.

### Admin & Backend Features
- **RESTful API**: Well-structured API for all frontend operations.
- **Product Management**: Admins can create, update, and delete products.
- **Order Management**: (Coming Soon) Track and manage customer orders.
- **Image Uploads**: Seamless image uploads to Cloudinary.
- **Secure Endpoints**: JWT-based authentication to protect routes.

## Project Structure

```
/brand-website
├── /frontend/         # Next.js application
│   ├── /src/app
│   ├── /public
│   └── package.json
├── /nodejs-backend/   # Express.js application
│   ├── /src
│   │   ├── /config
│   │   ├── /controllers
│   │   ├── /models
│   │   ├── /routes
│   │   └── server.js
│   └── package.json
├── vercel.json        # Vercel deployment configuration
└── README.md
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/download/) (v18 or later recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) account and connection string.
- [Cloudinary](https://cloudinary.com/users/register/free) account for API credentials.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd brand-website
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    cd frontend
    npm install
    ```

3.  **Install Backend Dependencies:**
    ```bash
    cd ../nodejs-backend
    npm install
    ```

4.  **Configure Backend Environment Variables:**
    - Create a `.env` file in the `nodejs-backend` directory.
    - Add the following variables:
      ```
      DATABASE_URL="your_mongodb_connection_string"
      JWT_SECRET="your_jwt_secret_key"
      CLOUDINARY_CLOUD_NAME="your_cloudinary_name"
      CLOUDINARY_API_KEY="your_cloudinary_api_key"
      CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
      ```

### Running the Application

1.  **Start the Backend Server:**
    ```bash
    cd nodejs-backend
    npm run dev
    ```
    The backend will be running on `http://localhost:5000` (or your configured port).

2.  **Start the Frontend Development Server:**
    ```bash
    cd ../frontend
    npm run dev
    ```
    The frontend will be available at `http://localhost:3000`.

## Deployment

This project is configured for easy deployment on [Vercel](https://vercel.com/). The `vercel.json` file handles the monorepo setup, directing API traffic to the Node.js backend and serving the Next.js frontend.
