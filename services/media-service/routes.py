"""
====================================================================================
routes.py - API Endpoints for Media Service (SortedShelf)
====================================================================================

Course: CS361
Author: Justin Enghauser

Purpose:
  - Provides RESTful API endpoints for media catalog management
  - Handles CRUD operations for media items and metadata
  - Supports user-specific media collections with flexible metadata storage
  - Integrates with frontend and other microservices

Major Endpoints:
  - GET /api/media: List all media items
  - POST /api/media: Create new media item with metadata
  - GET /api/media/<id>: Get specific media item details
  - PATCH /api/media/<id>: Update media item and metadata
  - GET /api/media/<id>/metadata: Get metadata for media item

Security:
  - Input validation on all endpoints
  - SQLAlchemy ORM prevents SQL injection
  - User ID filtering ensures data isolation

Usage:
  - Registered as blueprint in app.py
  - Consumed by React frontend via fetch API
  - Used by collection-service for media linking

====================================================================================
"""

from flask import Blueprint, request, jsonify

from app import db
from models import Media, MediaMetadata

bp = Blueprint('routes', __name__)

@bp.route('/api/media/<int:media_id>', methods=['GET', 'PATCH'])
def get_or_update_media(media_id):
    """
    Handle GET and PATCH requests for individual media items.
    
    GET: Retrieve details for a single media item by ID
    PATCH: Update media item fields and replace all metadata
    
    Parameters:
        media_id (int): ID of the media item
    
    GET Returns:
        200: JSON with media details
        404: Media not found
    
    PATCH Body:
        title (str): New title (optional)
        creator (str): New creator (optional)
        year (int): New year (optional)
        type (str): New media type (optional)
        status (str): New status (optional)
        publish_date (str): New publish date (optional)
        cover_url (str): New cover URL (optional)
        metadata (list): Array of {name, value} objects to replace existing metadata
    
    PATCH Returns:
        200: Updated media details
        404: Media not found
        500: Database error
    
    Usage:
        GET /api/media/123
        PATCH /api/media/123 with JSON body
    """
    from models import Media, MediaMetadata
    media = Media.query.get(media_id)
    if not media:
        return jsonify({'success': False, 'error': 'Media not found'}), 404
    
    if request.method == 'GET':
        return jsonify({'success': True, 'media': media.to_dict()}), 200
    
    # PATCH logic - update media fields and metadata
    data = request.get_json()
    
    # Update only fields present in request
    for field in ['title', 'creator', 'year', 'type', 'status', 'publish_date', 'cover_url']:
        if field in data:
            setattr(media, field, data[field])
    
    # Metadata update - replace all existing metadata
    if 'metadata' in data and isinstance(data['metadata'], list):
        # Remove old metadata entries
        MediaMetadata.query.filter_by(media_id=media_id).delete()
        
        # Add new metadata entries
        for md in data['metadata']:
            if 'name' in md and 'value' in md:
                new_md = MediaMetadata(media_id=media_id, name=md['name'], value=md['value'])
                db.session.add(new_md)
    
    try:
        db.session.commit()
        return jsonify({'success': True, 'media': media.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@bp.route('/api/media', methods=['POST'])
def add_media():
    """
    Create a new media item in the catalog.
    
    Supports flexible metadata storage for different media types
    and handles both dictionary and list-based metadata formats.

    Request Body (JSON):
        title (str): Title of the media item (required)
        creator (str): Creator/author/artist (required)
        type (str): Type of media (book, movie, music, etc.) (required)
        user_id (int): ID of the user creating the item (required)
        year (int): Year of release/creation (optional)
        publish_date (str): Date of publication (optional)
        cover_url (str): URL to cover image (optional)
        status (str): Status (Not Started, In Progress, Completed) (optional, default: 'Not Started')
        metadata (dict or list): Additional metadata (optional)
            - Dict format: {"isbn": "123", "genre": "fiction"}
            - List format: [{"name": "isbn", "value": "123"}, {"name": "genre", "value": "fiction"}]

    Returns:
        201: Success with new media item ID and date_added
        400: Missing required fields or invalid data
        500: Database error

    Usage:
        POST /api/media
        Content-Type: application/json
        {
            "title": "The Great Gatsby",
            "creator": "F. Scott Fitzgerald",
            "type": "book",
            "user_id": 1,
            "year": 1925,
            "metadata": {"isbn": "978-0-7432-7356-5", "genre": "classic"}
        }
    """
    data = request.get_json()
    print('DEBUG: Incoming request data:', data)

    # Extract and validate required fields
    title = data.get('title')
    creator = data.get('creator')
    year = data.get('year')
    media_type = data.get('type')
    user_id = data.get('user_id')
    print(f'DEBUG: user_id value: {user_id} (type: {type(user_id)})')
    
    # Extract optional fields with defaults
    status = data.get('status', 'Not Started')
    publish_date = data.get('publish_date')
    cover_url = data.get('cover_url')

    # Validate required fields and collect missing ones
    missing = []
    if not title:
        missing.append('title')
    if not creator:
        missing.append('creator')
    if not media_type:
        missing.append('type')
    if not user_id:
        missing.append('user_id')
    
    if missing:
        return jsonify({'error': f"Missing required fields: {', '.join(missing)}"}), 400

    try:
        # Create new media item
        item = Media(
            user_id=user_id,
            title=title,
            creator=creator,
            year=year,
            type=media_type,
            publish_date=publish_date,
            cover_url=cover_url,
            status=status
        )
        db.session.add(item)
        db.session.flush()  # Ensure item.id is available for metadata foreign keys

        # Process metadata - supports both dict and list formats
        metadata = data.get('metadata')
        print(f'DEBUG: Parsed metadata: {metadata}')
        
        from models import MediaMetadata
        metadata_entries = []
        
        if metadata:
            if isinstance(metadata, dict):
                # Convert dict to list of {name, value} pairs, skip None values
                for k, v in metadata.items():
                    if v is not None:
                        metadata_entries.append({'name': k, 'value': v})
            elif isinstance(metadata, list):
                # Only include entries with both name and value present
                metadata_entries = [entry for entry in metadata if entry.get('name') is not None and entry.get('value') is not None]

        # Save each valid metadata entry to database
        for entry in metadata_entries:
            name = entry.get('name')
            value = entry.get('value')
            print(f'DEBUG: Processing metadata entry: name={name}, value={value}')
            
            try:
                meta = MediaMetadata(media_id=item.id, name=name, value=value)
                db.session.add(meta)
                print(f'DEBUG: Added MediaMetadata: media_id={item.id}, name={name}, value={value}')
            except Exception as meta_err:
                print(f'ERROR: Failed to add MediaMetadata: {meta_err}')

        print('DEBUG: Attempting to commit session...')
        
        try:
            db.session.commit()
            print('DEBUG: Commit successful.')
            return jsonify({
                'success': True, 
                'id': item.id, 
                'date_added': item.date_added.isoformat() if hasattr(item, 'date_added') else None
            }), 201
        except Exception as commit_err:
            db.session.rollback()
            print(f'ERROR: Commit failed: {commit_err}')
            return jsonify({'error': f'Commit failed: {commit_err}'}), 500
            
    except Exception as e:
        db.session.rollback()
        print(f'ERROR: Unexpected exception: {e}')
        return jsonify({'error': str(e)}), 500

@bp.route('/api/media', methods=['GET'])
def list_media():
    """
    Retrieve all media items in the catalog.
    
    Returns a list of all media items with basic information.
    Note: This endpoint currently returns all media regardless of user.
    Consider adding user filtering for production use.

    Query Parameters:
        user_id (int): Filter by user ID (optional, not currently implemented)

    Returns:
        200: JSON object with 'media' array containing media items
        Each media item includes: id, title, creator, year, type, publish_date, description

    Usage:
        GET /api/media
        Returns: {"media": [{"id": 1, "title": "Book Title", ...}, ...]}
    """
    items = Media.query.all()
    
    # Build list of dictionaries for each media item
    result = [
        {
            'id': media.id,
            'title': media.title,
            'creator': media.creator,
            'year': media.year,
            'type': media.type,
            'publish_date': media.publish_date,
            'description': getattr(media, 'description', None)
        } for media in items
    ]
    
    return jsonify({'media': result})

@bp.route('/api/media/<int:media_id>/metadata', methods=['GET'])
def get_media_metadata(media_id):
    """
    Retrieve all metadata for a specific media item.
    
    Returns flexible metadata stored as name/value pairs for the given media item.
    Useful for displaying additional information specific to media type.

    Parameters:
        media_id (int): ID of the media item

    Returns:
        200: JSON with 'metadata' array of {name, value} objects
        404: Media not found (implicitly - no explicit check)

    Usage:
        GET /api/media/123/metadata
        Returns: {"success": true, "metadata": [{"name": "isbn", "value": "123"}, ...]}
    """
    from models import MediaMetadata
    
    metadata = MediaMetadata.query.filter_by(media_id=media_id).all()
    
    result = [
        {'name': m.name, 'value': m.value} for m in metadata
    ]
    
    return jsonify({'success': True, 'metadata': result})
