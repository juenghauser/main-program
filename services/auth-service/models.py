"""
====================================================================================
models.py - Database Models for Auth Service (SortedShelf)
====================================================================================

Course: CS361
Author: Justin Enghauser

Purpose:
  - Defines SQLAlchemy ORM models for user authentication
  - Provides password hashing and verification logic

Major Components:
  - User model: Represents users in the authentication system
    - id: Primary key
    - username: Unique username
    - password_hash: Hashed password
    - set_password: Hash and set password
    - check_password: Verify password

Security:
  - Uses bcrypt for secure password hashing
  - No plaintext passwords stored

Usage:
  - Imported by app.py and routes.py for DB operations

====================================================================================
"""
""" from app import db"""
from flask_sqlalchemy import SQLAlchemy
from passlib.hash import bcrypt

from app import db  # Use relative import if app.py defines db
# If db is initialized in app.py and imported here, this ensures correct context
# If not, fallback to initializing db here:
# db = SQLAlchemy()

class User(db.Model):
    """
    User model for authentication and user management.
    Attributes:
        id (int): Primary key
        username (str): Unique username
        password_hash (str): Hashed password
    Methods:
        set_password(password): Hash and set password
        check_password(password): Verify password
    """
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        """
        Hash and set the user's password using bcrypt.
        
        Parameters:
            password (str): Plain text password to hash and store
        
        Usage:
            user = User(username="john")
            user.set_password("secret123")
        """
        self.password_hash = bcrypt.hash(password)

    def check_password(self, password):
        """
        Verify if provided password matches stored hash.
        
        Parameters:
            password (str): Plain text password to verify
        
        Returns:
            bool: True if password matches, False otherwise
        
        Usage:
            if user.check_password("secret123"):
                # Password is correct
                pass
        """
        return bcrypt.verify(password, self.password_hash)
