"""
====================================================================================
models.py - Database Models for Collection Service (SortedShelf)
====================================================================================

Course: CS361
Author: Justin Enghauser

Purpose:
  - Defines SQLAlchemy ORM models for user collections and media relationships
  - Supports many-to-many relationships between collections and media items
  - Provides user-specific collection management functionality

Major Components:
  - Collection model: Named collections owned by users
  - CollectionMedia model: Many-to-many relationship table with additional metadata

Security:
  - All operations use SQLAlchemy ORM to prevent SQL injection
  - User ID filtering ensures data isolation between users

Usage:
  - Imported by app.py and routes.py for database operations
  - Models support JSON serialization for API responses

====================================================================================
"""

from datetime import datetime
from app import db

class Collection(db.Model):
    """
    Collection model for storing named user collections.
    
    Represents organized groups of media items that users can create
    to categorize their media library (e.g., "Favorites", "To Read", etc.).
    
    Attributes:
        id (int): Primary key, auto-generated
        user_id (int): Foreign key to user who owns this collection
        name (str): Display name of the collection (required)
        description (str): Optional description of the collection's purpose
        date_added (datetime): When the collection was created
    
    Methods:
        to_dict(): Returns dictionary representation for JSON serialization
    """
    __tablename__ = 'collection'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    date_added = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self):
        """
        Convert Collection object to dictionary for JSON serialization.
        
        Returns:
            dict: Dictionary containing collection attributes
        
        Usage:
            collection_dict = collection.to_dict()
            return jsonify(collection_dict)
        """
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'description': self.description,
            'date_added': self.date_added.isoformat() if self.date_added else None
        }

class CollectionMedia(db.Model):
    """
    Many-to-many relationship table linking collections to media items.
    
    Allows media items from the media-service to be organized into
    user-defined collections with additional metadata like ratings.
    
    Attributes:
        id (int): Primary key, auto-generated
        collection_id (int): Foreign key to Collection table
        media_id (int): Foreign key to media item (from media-service)
        user_id (int): Foreign key to user who created this relationship
        date_added (str): String timestamp when media was added to collection
        rating (int): Optional user rating for this media in this collection
    
    Methods:
        to_dict(): Returns dictionary representation for JSON serialization
    """
    __tablename__ = 'collection_media'
    id = db.Column(db.Integer, primary_key=True)
    collection_id = db.Column(db.Integer, db.ForeignKey('collection.id'), nullable=False)
    media_id = db.Column(db.Integer, nullable=False)  # References media-service media.id
    user_id = db.Column(db.Integer, nullable=False)
    date_added = db.Column(db.String(20), default=lambda: datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'))
    rating = db.Column(db.Integer)

    def to_dict(self):
        """
        Convert CollectionMedia object to dictionary for JSON serialization.
        
        Returns:
            dict: Dictionary containing relationship attributes
        
        Usage:
            link_dict = collection_media.to_dict()
            return jsonify(link_dict)
        """
        return {
            'id': self.id,
            'collection_id': self.collection_id,
            'media_id': self.media_id,
            'user_id': self.user_id,
            'date_added': self.date_added,
            'rating': self.rating
        }
