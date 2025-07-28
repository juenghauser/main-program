"""
====================================================================================
app.py - Flask Application Factory for Media Service (SortedShelf)
====================================================================================

Course: CS361
Author: Justin Enghauser

Purpose:
  - Initializes Flask app, loads configuration, and sets up extensions
  - Registers routes and models for media microservice
  - Enables CORS for cross-origin requests from frontend
  - Used by Flask CLI and WSGI servers to create the app instance

Major Functions:
  - create_app: Application factory function
    - Loads config from config.py
    - Initializes database and migration extensions
    - Enables CORS for API access
    - Registers routes and models

Security:
  - Uses environment variables for secrets and DB config
  - CORS enabled for secure cross-origin API access
  - Restricted CORS origins for production security

Usage:
  - Entry point for running the media microservice
  - Used by development and production servers

====================================================================================
"""

from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

# Initialize SQLAlchemy and Flask-Migrate extensions
# These are used for database ORM and migrations
# They are attached to the app in create_app()
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    """
    Application factory function for the Media Service.
    
    Returns:
        Flask: Configured Flask application instance with database, CORS, and routes
    
    Usage:
        app = create_app()
        app.run()
    """
    app = Flask(__name__)
    
    # Load configuration from config.py
    app.config.from_object(Config)
    
    # Initialize database and migration extensions
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Enable CORS for frontend access (restricted to localhost:3000 for security)
    CORS(app, origins=["http://localhost:3000"])
    
    # Register API routes blueprint
    from routes import bp as routes_bp
    app.register_blueprint(routes_bp)
    
    # Import models to ensure they are registered with SQLAlchemy
    import models
    
    return app

# Allow running the service directly for development
if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=app.config.get('PORT', 5002), debug=True)

