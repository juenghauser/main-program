"""
====================================================================================
routes.py - API Endpoints for Collection Service (SortedShelf)
====================================================================================

Course: CS361
Author: Justin Enghauser

Purpose:
  - Provides RESTful API endpoints for collection management
  - Handles CRUD operations for user collections and media relationships
  - Integrates with media-service to fetch media details for collections
  - Supports user-specific collection organization with flexible metadata

Major Endpoints:
  - GET /api/collections: List user's collections
  - POST /api/collections: Create new collection
  - GET /api/collections/<id>: Get collection details
  - PUT /api/collection/<id>: Update collection
  - GET /api/collection/<id>/media: Get media in collection
  - POST /api/collection-media: Link media to collections

Security:
  - Input validation on all endpoints
  - SQLAlchemy ORM prevents SQL injection
  - User ID filtering ensures data isolation
  - Cross-service communication via HTTP requests

Usage:
  - Registered as blueprint in app.py
  - Consumed by React frontend via fetch API
  - Integrates with media-service for complete media information

====================================================================================
"""

from flask import Blueprint, request, jsonify
from app import db
from models import Collection, CollectionMedia

bp = Blueprint('routes', __name__)

@bp.route('/api/collection/<int:collection_id>', methods=['PUT'])
def update_collection(collection_id):
    """
    Update collection details (name and/or description).
    
    Updates an existing collection's metadata. Only provided fields are updated.
    
    Parameters:
        collection_id (int): ID of the collection to update
    
    Request Body (JSON):
        name (str): New collection name (optional)
        description (str): New collection description (optional)
    
    Returns:
        200: Success message
        400: No fields to update
        404: Collection not found
        500: Database error
    
    Usage:
        PUT /api/collection/123
        {"name": "Updated Name", "description": "New description"}
    """
    col = Collection.query.get(collection_id)
    if not col:
        return jsonify({'success': False, 'error': 'Collection not found'}), 404
    
    data = request.get_json()
    updated = False
    
    if 'name' in data:
        col.name = data['name']
        updated = True
    if 'description' in data:
        col.description = data['description']
        updated = True
    
    if not updated:
        return jsonify({'success': False, 'error': 'No fields to update'}), 400
    
    try:
        db.session.commit()
        return jsonify({'success': True, 'message': 'Collection updated'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@bp.route('/api/collection/<int:collection_id>/media', methods=['GET'])
def get_collection_media(collection_id):
    """
    Get all media items linked to a specific collection.
    
    Fetches collection-media relationships and retrieves full media details
    from the media-service via HTTP requests.
    
    Parameters:
        collection_id (int): ID of the collection
    
    Returns:
        200: JSON with 'media' array containing full media objects
        Includes 'warnings' array if some media items couldn't be fetched
    
    Usage:
        GET /api/collection/123/media
        Returns: {"success": true, "media": [...], "warnings": [...]}
    """
    from models import CollectionMedia
    
    # Get all media links for this collection
    links = CollectionMedia.query.filter_by(collection_id=collection_id).all()
    media_list = []
    errors = []
    
    if not links:
        return jsonify({'success': True, 'media': []}), 200
    
    # Fetch media details from media-service for each linked media item
    import requests
    for link in links:
        try:
            resp = requests.get(f'http://localhost:5002/api/media/{link.media_id}', timeout=2)
            if resp.status_code == 200:
                media = resp.json().get('media')
                if media:
                    media_list.append(media)
                else:
                    errors.append(f"No media found for media_id {link.media_id}")
            else:
                errors.append(f"Media-service returned status {resp.status_code} for media_id {link.media_id}")
        except Exception as e:
            errors.append(f"Exception for media_id {link.media_id}: {str(e)}")
    
    result = {'success': True, 'media': media_list}
    if errors:
        result['warnings'] = errors
    
    return jsonify(result), 200

@bp.route('/api/collection/<int:collection_id>', methods=['GET'])
def get_collection(collection_id):
    """
    Get details for a single collection by ID (legacy endpoint).
    
    Returns basic collection information without media details.
    Maintained for backward compatibility.
    
    Parameters:
        collection_id (int): ID of the collection
    
    Returns:
        200: JSON with collection details
        404: Collection not found
    
    Usage:
        GET /api/collection/123
        Returns: {"success": true, "collection": {"id": 123, "name": "...", ...}}
    """
    col = Collection.query.get(collection_id)
    if not col:
        return jsonify({'success': False, 'error': 'Collection not found'}), 404
    
    result = {
        'id': col.id,
        'name': col.name,
        'description': col.description,
        'date_added': col.date_added.isoformat() if hasattr(col, 'date_added') and col.date_added else None
    }
    return jsonify({'success': True, 'collection': result}), 200

@bp.route('/api/collections/<int:collection_id>', methods=['GET'])
def get_collection_new(collection_id):
    """
    Get details for a single collection by ID (React frontend endpoint).
    
    Returns basic collection information without media details.
    Uses RESTful convention preferred by React frontend.
    
    Parameters:
        collection_id (int): ID of the collection
    
    Returns:
        200: JSON with collection details
        404: Collection not found
    
    Usage:
        GET /api/collections/123
        Returns: {"success": true, "collection": {"id": 123, "name": "...", ...}}
    """
    col = Collection.query.get(collection_id)
    if not col:
        return jsonify({'success': False, 'error': 'Collection not found'}), 404
    
    result = {
        'id': col.id,
        'name': col.name,
        'description': col.description,
        'date_added': col.date_added.isoformat() if hasattr(col, 'date_added') and col.date_added else None
    }
    return jsonify({'success': True, 'collection': result}), 200

@bp.route('/api/collections', methods=['GET'])
def list_collections():
    """
    List all collections for a specific user.
    
    Returns user-specific collections with basic information.
    Used by frontend to display collection lists and navigation.
    
    Query Parameters:
        user_id (int): ID of the user whose collections to retrieve (required)
    
    Returns:
        200: JSON with 'collections' array
        400: Missing user_id parameter
    
    Usage:
        GET /api/collections?user_id=123
        Returns: {"success": true, "collections": [...]}
    """
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'error': 'user_id required'}), 400
    
    collections = Collection.query.filter_by(user_id=user_id).all()
    result = [
        {
            'id': col.id,
            'name': col.name,
            'description': col.description,
            'date_added': col.date_added.isoformat() if col.date_added else None
        } for col in collections
    ]
    return jsonify({'success': True, 'collections': result}), 200

@bp.route('/api/collections', methods=['POST'])
def add_collection():
    """
    Create a new collection for a user.
    
    Creates a new named collection that can be used to organize media items.
    
    Request Body (JSON):
        user_id (int): ID of the user creating the collection (required)
        name (str): Name of the collection (required)
        description (str): Optional description of the collection
    
    Returns:
        201: Success with new collection ID
        400: Missing required fields or invalid user_id
        500: Database error
    
    Usage:
        POST /api/collections
        {"user_id": 123, "name": "Favorites", "description": "My favorite books"}
    """
    data = request.get_json()
    user_id = data.get('user_id') if data else None
    name = data.get('name') if data else None
    
    if not user_id or not name:
        return jsonify({'success': False, 'error': 'user_id and name required'}), 400
    
    try:
        # Validate user_id is integer
        try:
            user_id_int = int(user_id)
        except (ValueError, TypeError):
            return jsonify({'success': False, 'error': 'user_id must be an integer'}), 400
        
        col = Collection(
            user_id=user_id_int,
            name=name,
            description=data.get('description')
        )
        db.session.add(col)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Collection added', 'id': col.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@bp.route('/api/collection', methods=['POST'])
def add_collection_media():
    """
    Add a media item to a collection (legacy endpoint).
    
    Creates a relationship between a media item and a collection.
    Supports optional metadata like rating and custom date.
    
    Request Body (JSON):
        user_id (int): ID of the user creating the relationship (required)
        collection_id (int): ID of the collection (required)
        media_id (int): ID of the media item from media-service (required)
        date_added (str): Custom date string (optional)
        rating (int): User rating for this media in this collection (optional)
    
    Returns:
        201: Success with new relationship ID
        400: Missing required fields
        500: Database error
    
    Usage:
        POST /api/collection
        {"user_id": 123, "collection_id": 456, "media_id": 789, "rating": 5}
    """
    data = request.get_json()
    
    if not data or not data.get('user_id') or not data.get('collection_id') or not data.get('media_id'):
        return jsonify({'success': False, 'error': 'user_id, collection_id, and media_id required'}), 400
    
    try:
        link = CollectionMedia(
            user_id=data['user_id'],
            collection_id=data['collection_id'],
            media_id=data['media_id'],
            date_added=data.get('date_added'),
            rating=data.get('rating')
        )
        db.session.add(link)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Media added to collection', 'id': link.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@bp.route('/api/collection-media/<int:media_id>', methods=['GET'])
def get_media_collections(media_id):
    """
    Get all collections that contain a specific media item.
    
    Useful for displaying which collections a media item belongs to
    and for managing media-collection relationships.
    
    Parameters:
        media_id (int): ID of the media item
    
    Returns:
        200: JSON with 'collections' array containing collection details
    
    Usage:
        GET /api/collection-media/789
        Returns: {"success": true, "collections": [...]}
    """
    from models import Collection, CollectionMedia
    
    links = CollectionMedia.query.filter_by(media_id=media_id).all()
    collection_ids = [link.collection_id for link in links]
    collections = Collection.query.filter(Collection.id.in_(collection_ids)).all()
    
    result = [
        {'id': c.id, 'name': c.name, 'description': c.description} for c in collections
    ]
    return jsonify({'success': True, 'collections': result})

@bp.route('/api/collection-media', methods=['POST', 'OPTIONS'])
def link_media_to_collections():
    """
    Link a media item to one or more collections.
    
    Allows bulk linking of a single media item to multiple collections.
    Includes CORS preflight handling for browser requests.
    
    Request Body (JSON):
        user_id (int): ID of the user creating the relationships (required)
        media_id (int): ID of the media item to link (required)
        collection_ids (list[int]): List of collection IDs to link to (required)
    
    Returns:
        200: CORS preflight response (OPTIONS)
        201: Success message (POST)
        400: Missing required fields
        500: Database error
    
    Usage:
        POST /api/collection-media
        {"user_id": 123, "media_id": 789, "collection_ids": [456, 678]}
    """
    if request.method == 'OPTIONS':
        # Handle CORS preflight request
        return '', 200

    data = request.get_json()
    user_id = data.get('user_id')
    media_id = data.get('media_id')
    collection_ids = data.get('collection_ids', [])

    if not user_id or not media_id or not collection_ids:
        return jsonify({'error': 'user_id, media_id, and collection_ids required'}), 400

    from models import CollectionMedia
    try:
        # Create relationship for each collection
        for col_id in collection_ids:
            if isinstance(col_id, int):
                mapping = CollectionMedia(
                    collection_id=col_id, 
                    media_id=media_id, 
                    user_id=user_id
                )
                db.session.add(mapping)
        
        db.session.commit()
        return jsonify({'success': True}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500