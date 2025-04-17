# BookExplorer

BookExplorer is a full-stack web application that allows users to explore, rate, and manage their book collections. The application consists of a Django REST API backend and a React frontend.

## Getting Started

### Backend Setup

1. Navigate to the beckend directory:
```bash
cd book_explorer
```

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Apply migrations:
```bash
python manage.py migrate
```

4. Run the development server:
```bash
python manage.py runserver
```

The API will be available at
http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd book-explorer-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at
http://localhost:3000

## Dependency Management
### Backend Dependencies
- Django 5.2
- Django REST Framework
- Django CORS Headers
- Simple JWT for authentication

Other dependencies are listed in
```bash
requirements.txt
```

### Frontend Dependencies
- React 19.1.0
- Material-UI 7.0.2
- Axios for API calls
- React Router for navigation
- Date-fns for date formatting

Dependencies are managed through
```bash
package.json
```

## Running Tests

### Backend Tests
Run Django tests:
```bash
python manage.py test
```

## Features Implementation
### Core Features
#### Authentication System

- JWT-based authentication

- User registration and login


#### Book Management

- Comprehensive book listing

- Detailed book views

- Search and filter functionality

- Rating system (1-10 scale)

#### Personal Features

- Reading list management

- Personal notes for books

### Design Choices
#### Backend Architecture

- Django REST Framework for robust API development

- Token-based authentication for security

- Modular app structure for scalability

#### Frontend Design

-  Material-UI for consistent, modern UI

- Component-based architecture

- Context API for state management

## Initial Data Seeding

The application comes pre-populated with sample data through Django migrations:

### Books
- 20 diverse books across different genres (Classic Literature, Modern Fiction, Fantasy/Sci-Fi, Contemporary Literature)
- Each book includes comprehensive details:
- 
  • Title and Author
  
  • Publication Date
  
  • ISBN
  
  • Genre
  
  • Short Description
  
  • Page Count
  
  • Detailed "About" Section

### Users
- Three sample user accounts 
- Each user has unique profile data and can be used for login without need for creating new user

### Book Notes
- Multiple reading notes distributed across three different books
- Notes created by different users

### Ratings
- Initial rating data for books
- Rating scale: 1-10
- Rating is added randomly for all books for all three users

