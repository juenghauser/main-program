"""
====================================================================================
config.py - Configuration for Auth Service (SortedShelf)
====================================================================================

Course: CS361
Author: Justin Enghauser

Purpose:
  - Loads environment variables from .env file
  - Sets Flask and SQLAlchemy configuration options
  - Used by app.py to configure the Flask app

Major Components:
  - Config class: Loads settings from environment variables or defaults
    - SECRET_KEY: Secret key for session and security
    - SQLALCHEMY_DATABASE_URI: Database connection URI
    - SQLALCHEMY_TRACK_MODIFICATIONS: Disable event system for performance

Security:
  - Secrets and DB credentials loaded from environment, not hardcoded

Usage:
  - Imported by app.py for Flask app configuration

====================================================================================
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """
    Configuration class for Flask app.
    Loads settings from environment variables or defaults.

    Attributes:
        SECRET_KEY (str): Secret key for session and security
        SQLALCHEMY_DATABASE_URI (str): Database connection URI
        SQLALCHEMY_TRACK_MODIFICATIONS (bool): Disable SQLAlchemy event system for performance
    """

    SECRET_KEY = os.getenv('SECRET_KEY', 'dev')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///auth.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Port configuration for auth service
    PORT = int(os.getenv('PORT', 5001))
