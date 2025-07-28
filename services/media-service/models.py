"""
====================================================================================
models.py - Database Models for Media Service (SortedShelf)
====================================================================================

Course: CS361
Author: Justin Enghauser

Purpose:
  - Defines SQLAlchemy ORM models for media items and metadata
  - Provides user-specific media cataloging functionality
  - Supports flexible metadata storage for different media types

Major Components:
  - Media model: Core media item representation
  - MediaMetadata model: Flexible key-value metadata storage

Security:
  - All operations use SQLAlchemy ORM to prevent SQL injection
  - User ID filtering ensures data isolation between users

Usage:
  - Imported by app.py and routes.py for database operations
  - Models support JSON serialization via to_dict() methods

====================================================================================
"""

from app import db
from datetime import datetime

class Media(db.Model):
    """
    Media model for storing media catalog entries.
    
    Represents individual media items in a user's collection with
    comprehensive tracking information and status management.
    
    Attributes:
        id (int): Primary key, auto-generated
        user_id (int): Foreign key to user who owns this media
        title (str): Title of the media item (required)
        creator (str): Creator/author/artist (required)
        year (int): Year of release/creation (optional)
        type (str): Type of media (book, movie, music, etc.)
        publish_date (str): Date of publication in string format
        cover_url (str): URL to cover image for display
        status (str): Current status (Not Started, In Progress, Completed)
        date_added (datetime): When item was added to collection
    
    Methods:
        to_dict(): Returns dictionary representation for JSON serialization
    """
    __tablename__ = 'media'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    creator = db.Column(db.String(255), nullable=False)
    year = db.Column(db.Integer, nullable=True)
    type = db.Column(db.String(50), nullable=False)
    publish_date = db.Column(db.String(20))
    cover_url = db.Column(db.String(255))
    status = db.Column(db.String(20), nullable=False, default='Not Started')
    date_added = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self):
        """
        Convert Media object to dictionary for JSON serialization.
        
        Returns:
            dict: Dictionary containing all media attributes
        
        Usage:
            media_dict = media_item.to_dict()
            return jsonify(media_dict)
        """
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'creator': self.creator,
            'year': self.year,
            'type': self.type,
            'publish_date': self.publish_date,
            'cover_url': self.cover_url,
            'status': self.status,
            'date_added': self.date_added.isoformat() if self.date_added else None
        }

class MediaMetadata(db.Model):
    """
    MediaMetadata model for flexible name/value metadata pairs.
    
    Allows storage of additional metadata that varies by media type,
    such as ISBN for books, runtime for movies, genre, etc.
    
    Attributes:
        id (int): Primary key, auto-generated
        media_id (int): Foreign key to Media table
        name (str): Metadata field name (e.g., 'isbn', 'genre', 'runtime')
        value (str): Metadata field value (stored as text)
    
    Methods:
        to_dict(): Returns dictionary representation for JSON serialization
    """
    __tablename__ = 'media_metadata'
    id = db.Column(db.Integer, primary_key=True)
    media_id = db.Column(db.Integer, db.ForeignKey('media.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    value = db.Column(db.Text, nullable=False)

    def to_dict(self):
        """
        Convert MediaMetadata object to dictionary for JSON serialization.
        
        Returns:
            dict: Dictionary containing metadata attributes
        
        Usage:
            metadata_dict = metadata_item.to_dict()
            return jsonify(metadata_dict)
        """
        return {
            'id': self.id,
            'media_id': self.media_id,
            'name': self.name,
            'value': self.value
        }
