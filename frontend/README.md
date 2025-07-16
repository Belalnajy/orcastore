# ORCA - Premium E-commerce Clothing Store

A modern, full-stack e-commerce platform built for a premium clothing brand. This project showcases a complete shopping experience from product browsing to checkout, along with a comprehensive admin panel for store management.

**Live Demo:** https://orcastore.vercel.app/

---

## ✨ Key Features

### 🛍️ Customer-Facing Store

- **Modern & Responsive Design:** A clean, intuitive, and fully responsive UI built with Tailwind CSS.
- **Product Catalog:** Browse all products with search and filtering capabilities.
- **Detailed Product Pages:** View product details, multiple images with a zoom/lightbox gallery, and stock status.
- **Shopping Cart:** Add/remove items and view a summary before checkout.
- **Wishlist:** Save favorite products for later.
- **Share Functionality:** Easily share products with others via a native share dialog or by copying the link.
- **User Authentication:** Secure user registration and login.

### ⚙️ Admin Dashboard

- **Analytics Dashboard:** An overview of sales, orders, and key metrics.
- **Product Management:** Full CRUD (Create, Read, Update, Delete) functionality for products.
- **Order Management:** View and manage customer orders.
- **User Management:** View and manage registered users.

---

## 🛠️ Tech Stack

This project is built with a modern, robust, and scalable tech stack:

- **Frontend:**

  - **Framework:** [Next.js](https://nextjs.org/) 14+ (with App Router)
  - **UI Library:** [React](https://reactjs.org/)
  - **Styling:** [Tailwind CSS](https://tailwindcss.com/)
  - **Animations:** [Framer Motion](https://www.framer.com/motion/)
  - **Icons:** [Lucide React](https://lucide.dev/)
  - **Notifications:** [React Hot Toast](https://react-hot-toast.com/)
  - **Image Carousel:** [Swiper.js](https://swiperjs.com/)
  - **Email Service:** [Email.js](https://www.emailjs.com/)

- **Backend:**
  - **Runtime:** [Node.js](https://nodejs.org/)
  - **Framework:** [Express.js](https://expressjs.com/)
  - **Database:** (MongoDB)
  - **Authentication:** JSON Web Tokens (JWT)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm / yarn / pnpm

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/Belalnajy/orcastore.git
    ```

2.  **Navigate to the frontend directory and install dependencies:**

    ```sh
    cd orcastore/frontend
    npm install
    ```

3.  **Navigate to the backend directory and install dependencies:**

    ```sh
    cd ../nodejs-backend
    npm install
    ```

4.  **Set up environment variables:**

    - Create a `.env` file in the `frontend` directory and add your environment variables (e.g., `NEXT_PUBLIC_API_URL`).
    - Create a `.env` file in the `nodejs-backend` directory and add your environment variables (e.g., `DATABASE_URL`, `JWT_SECRET`).

5.  **Run the development servers:**
    - For the frontend:
    ```sh
    npm run dev
    ```
    - For the backend:
    ```sh
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.
