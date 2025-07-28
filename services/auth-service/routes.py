"""
====================================================================================
routes.py - API Endpoints for Auth Service (SortedShelf)
====================================================================================

Course: CS361
Author: Justin Enghauser

Purpose:
  - Provides user registration, login, logout, and user management endpoints
  - Handles input validation, password hashing, and error handling
  - All endpoints return JSON responses for frontend consumption

Major Endpoints:
  - /api/auth/register: Register new user
  - /api/auth/login: Authenticate user
  - /api/auth/logout: Placeholder for logout logic

Security:
  - Passwords are hashed with bcrypt before storage
  - Input validation and error handling for all endpoints

Usage:
  - Registered as blueprint in app.py
  - Consumed by frontend via fetch/POST requests

====================================================================================
"""

from flask import Blueprint, request, jsonify
from app import db
from models import User
from passlib.hash import bcrypt

bp = Blueprint('routes', __name__)

@bp.route('/api/auth/register', methods=['POST'])
def register():
    """
    Register a new user account.
    
    Creates a new user with hashed password and stores in database.
    Validates input and prevents duplicate usernames.
    
    Request Body (JSON):
        username (str): Unique username for the account (required)
        password (str): Plain text password to be hashed (required)
    
    Returns:
        201: Success with user ID
        400: Missing required fields
        409: Username already exists
        500: Database error
    
    Usage:
        POST /api/auth/register
        {"username": "john_doe", "password": "secret123"}
    """
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'success': False, 'error': 'Username and password required'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'success': False, 'error': 'Username already exists'}), 409
    
    try:
        hashed_pw = bcrypt.hash(data['password'])
        user = User(username=data['username'], password_hash=hashed_pw)
        db.session.add(user)
        db.session.commit()
        return jsonify({'success': True, 'message': 'User registered', 'id': user.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@bp.route('/api/auth/login', methods=['POST'])
def login():
    """
    Authenticate user credentials and return login result.
    
    Verifies username and password against stored hash.
    Returns user information on successful authentication.
    
    Request Body (JSON):
        username (str): Username to authenticate (required)
        password (str): Plain text password to verify (required)
    
    Returns:
        200: Success with user_id
        401: Invalid credentials
        400: Missing required fields (implicit from missing data)
    
    Usage:
        POST /api/auth/login
        {"username": "john_doe", "password": "secret123"}
    """
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()
    if user and bcrypt.verify(password, user.password_hash):
        return jsonify({'success': True, 'user_id': user.id, 'message': 'Login successful'}), 200
    
    return jsonify({'success': False, 'error': 'Invalid credentials'}), 401

@bp.route('/api/auth/logout', methods=['POST'])
def logout():
    """
    Handle user logout (placeholder implementation).
    
    Currently returns success response. In production, this would
    handle session invalidation, token blacklisting, etc.
    
    Returns:
        200: Success message
    
    Usage:
        POST /api/auth/logout
    """
    return jsonify({'success': True, 'message': 'Logout endpoint'}), 200

@bp.route('/api/users', methods=['GET'])
def get_users():
    """
    Retrieve all registered users (admin/management endpoint).
    
    Returns basic user information (ID and username only).
    Excludes sensitive data like password hashes.
    
    Returns:
        200: JSON with 'users' array containing user objects
    
    Usage:
        GET /api/users
        Returns: {"success": true, "users": [{"id": 1, "username": "john"}, ...]}
    """
    users = User.query.all()
    result = [
        {
            'id': user.id,
            'username': user.username
        } for user in users
    ]
    return jsonify({'success': True, 'users': result}), 200

@bp.route('/api/users', methods=['POST'])
def create_user():
    """
    Create a new user account (admin/management endpoint).
    
    Similar to register endpoint but intended for administrative use.
    Creates user with hashed password and validates input.
    
    Request Body (JSON):
        username (str): Unique username for the account (required)
        password (str): Plain text password to be hashed (required)
    
    Returns:
        201: Success with user ID
        400: Missing required fields
        409: Username already exists
        500: Database error
    
    Usage:
        POST /api/users
        {"username": "admin_user", "password": "admin_pass"}
    """
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'success': False, 'error': 'Username and password required'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'success': False, 'error': 'Username already exists'}), 409
    
    try:
        hashed_pw = bcrypt.hash(data['password'])
        user = User(username=data['username'], password_hash=hashed_pw)
        db.session.add(user)
        db.session.commit()
        return jsonify({'success': True, 'message': 'User created', 'id': user.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500
