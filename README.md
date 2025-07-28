# Media Catalog App

A microservice-based web app to catalog users’ electronic and physical media (books, games, movies, TV shows).

## Tech Stack
- Python (Flask) microservices: Auth, Media, Catalog
- MySQL (or SQLite for dev)
- Plain HTML/CSS/JavaScript frontend (no React)

## Local Setup
1. Fill `.env` in each service with DB and service URLs
2. If they aren't already created, navigate to each of the services directories
    python -m venv venv
    venv\Scripts\Activate
    pip install -r requirements.txt
    
3. Activate each service's `venv` and run Flask on the correct port. For the Auth Service, you must enable CORS:
   - **Auth Service:**
     ```
     cmd
     
     prompt auth-service:
     cd services\auth-service
     venv\Scripts\activate
     pip install flask-cors
     # In app.py, add:
     #   from flask_cors import CORS
     #   app = Flask(__name__)
     #   CORS(app)
     flask run --port=5001
     ```
   - **Media Service:**
     ```
     cmd
     
     prompt media-service:
     cd services\media-service
     venv\Scripts\activate
     flask run --port=5002
     ```
   - **Collection Service:**
     ```
     cmd
     
     prompt collection-service:
     cd services\collection-service
     venv\Scripts\activate
     flask run --port=5003
     ```
4. Serve frontend:
   ```cmd
   cd frontend
   python -m http.server 3000
   ```
5. Visit `http://localhost:3000/index.html`.

See `ProjectOverview.md` for full backlog and architecture.

## Documentation
- [DBCreation.md](docs/DBCreation.md): Database setup and migration instructions
- [ProjectOverview.md](docs/ProjectOverview.md): Project architecture and backlog

## Auth Service Dependencies
- Flask
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-CORS
- python-dotenv
- passlib  # Used for secure password hashing

