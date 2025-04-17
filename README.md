# BookExplorer

BookExplorer is a full-stack web application that allows users to explore, rate, and manage their book collections. The application consists of a Django REST API backend and a React frontend.

## Getting Started

### Backend Setup

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
