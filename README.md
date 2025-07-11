# Premium Clothing Brand E-commerce Website

A modern, responsive e-commerce website built with Next.js and Django, featuring a full shopping experience with product browsing, cart management, wishlist, and secure payment processing.

## Tech Stack

### Frontend
- Next.js 14
- TailwindCSS
- React Context API
- Lucide Icons
- Framer Motion
- React Hot Toast

### Backend
- Django 5.2
- Django REST Framework
- SQLite
- Paymob Payment Gateway
- JWT Authentication

## Features

### Frontend Features
- Fully responsive design with dark/light mode support
- Modern and clean UI/UX
- Product catalog with categories
- Shopping cart with quantity management
- Wishlist functionality
- Product quick view
- Product detail pages
- Search and filtering capabilities
- Checkout process
- Payment integration

### Backend Features
- RESTful API endpoints
- JWT authentication
- Product management
- Cart operations
- Wishlist management
- Order processing
- Payment integration with Paymob
- Secure API endpoints
- Documentation via DRF API docs

## Project Structure

### Frontend (`frontend/`)
- `src/`
  - `app/` - Next.js pages and routes
  - `components/` - Reusable React components
  - `contexts/` - React Context providers
  - `services/` - API client and utilities
  - `utils/` - Helper functions and configurations

### Backend (`backend/`)
- `store/` - Main Django app
  - `models.py` - Database models
  - `serializers.py` - API serializers
  - `views.py` - API views
  - `urls.py` - URL routing
- `ecommerce_project/` - Project configuration
  - `settings.py` - Django settings
  - `urls.py` - Root URL configuration

## Getting Started

### Prerequisites
- Node.js (for frontend)
- Python 3.8+ (for backend)
- SQLite (for database)
- Paymob API credentials (for payment processing)

### Installation

1. Clone the repository
2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

4. Configure environment variables:
- Add Paymob API credentials to backend settings
- Configure database settings if needed

### Running the Application

1. Start the backend server:
```bash
cd backend
python manage.py runserver
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

## Payment Integration
The website uses Paymob payment gateway with:
- Card payments via iframe integration
- Live payment simulation
- Secure transaction handling
- Order confirmation system

## Security Features
- JWT authentication for API endpoints
- CORS configuration for frontend-backend communication
- Secure cookie handling
- Input validation and sanitization
- Rate limiting for API endpoints

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
