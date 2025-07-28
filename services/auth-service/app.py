"""
====================================================================================
app.py - Flask Application Factory for Auth Service (SortedShelf)
====================================================================================

Course: CS361
Author: Justin Enghauser

Purpose:
  - Initializes Flask app, loads configuration, and sets up extensions
  - Registers routes and models for authentication microservice
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

Usage:
  - Entry point for running the auth microservice
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
    Application factory function for the Auth Service.
    - Loads configuration from config.py
    - Initializes database and migration extensions
    - Enables CORS for API access from frontend
    - Registers routes and models
    Returns:
        Flask app instance
    """
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)  # Enable CORS for the app
    from routes import bp as routes_bp  # Register API routes
    app.register_blueprint(routes_bp)
    import models  # ensures User model is registered with SQLAlchemy
    return app

# Allow running the service directly for development
if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=app.config.get('PORT', 5001), debug=True)
