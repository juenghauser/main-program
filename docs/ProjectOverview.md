# Media Catalog App — IDE/LLM Integration Spec

## 1. Project Overview  
Build a microservice-based web app to catalog users’ electronic and physical media (books, games, movies, TV shows).  
- **Backend**: Python (Flask) microservices  
- **Data**: MySQL (or SQLite for dev)  
- **Frontend**: Plain HTML/CSS/JavaScript (no React)  
- **No Docker**: Run each service in its own Python virtualenv; serve static files via simple HTTP server.

## 2. Quality Attributes  
1. **Usability** – Fast, intuitive forms and pages.  
2. **Security** – HTTPS, JWT auth, salted password hashing.  
3. **Modifiability** – Simple config-driven UI and service components.

## 3. Full Product Backlog (26 User Stories)  

1. **User story 1 name:** *Secure Login*  
   **User story 1 "As a..." format:** *As a user, I want to log in securely so that my collection and reviews remain private.*  
   **Storyline:** *Enable users to authenticate and gain access to their personal data.*

2. **User story 2 name:** *Secure Logout*  
   **User story 2 "As a..." format:** *As a user, I want to log out so that no one else can access my account when I’m done.*  
   **Storyline:** *Allow users to end their session and protect their privacy.*

3. **User story 3 name:** *Manual Media Creation*  
   **User story 3 "As a..." format:** *As a user, I want to manually input title, type, publish date, cover image URL and at least one metadata field so that I can ensure core details are captured.*  
   **Storyline:** *Let users add any media item by filling out a simple form.*

4. **User story 4 name:** *Save to Collection*  
   **User story 4 "As a..." format:** *As a user, I want to save a media item to my personal collection so that I can browse it later.*  
   **Storyline:** *Persist newly added items under each user’s account.*

5. **User story 5 name:** *View Full Catalog*  
   **User story 5 "As a..." format:** *As a user, I want to view a list of all my saved media items so that I can see my entire catalog at a glance.*  
   **Storyline:** *Display every saved item in an organized list view.*

6. **User story 6 name:** *Pagination for Large Lists*  
   **User story 6 "As a..." format:** *As a user, I want the collection list to show 20 items per page with next/previous controls so that I can browse large libraries easily.*  
   **Storyline:** *Break long catalogs into manageable pages.*

7. **User story 7 name:** *Search by Title*  
   **User story 7 "As a..." format:** *As a user, I want to search my collection by full or partial title so that I can find items even if I don’t remember the exact name.*  
   **Storyline:** *Provide a search box to quickly locate items by title.*

8. **User story 8 name:** *Filter by Media Type*  
   **User story 8 "As a..." format:** *As a user, I want to filter my collection by one or more media types so that I can view mixed selections (e.g., books + games).*  
   **Storyline:** *Let users narrow their view to specific media categories.*

9. **User story 9 name:** *Sort by Date Added*  
   **User story 9 "As a..." format:** *As a user, I want to sort my list by date added so that I can see my most recent entries first.*  
   **Storyline:** *Order items chronologically to highlight new additions.*

10. **User story 10 name:** *Sort by Rating*  
    **User story 10 "As a..." format:** *As a user, I want to sort my list by rating so that I can find my top-rated items quickly.*  
    **Storyline:** *Arrange items from highest to lowest user rating.*

11. **User story 11 name:** *Detail Page with Metadata*  
    **User story 11 "As a..." format:** *As a user, I want the detail page to show author (for books), director (for movies), platform (for games), runtime (for TV), etc. so that I see all relevant fields at a glance.*  
    **Storyline:** *Show a full breakdown of every relevant field per item.*

12. **User story 12 name:** *Edit Media Details*  
    **User story 12 "As a..." format:** *As a user, I want to edit the metadata of an existing item so that I can correct mistakes.*  
    **Storyline:** *Allow users to update any saved item’s information.*

13. **User story 13 name:** *Delete Media Item*  
    **User story 13 "As a..." format:** *As a user, I want to remove an item from my collection so that I can keep it up to date.*  
    **Storyline:** *Provide a way to permanently delete items from a user’s catalog.*

14. **User story 14 name:** *Mark as Completed*  
    **User story 14 "As a..." format:** *As a user, I want to mark an item as completed (read/played/watched) so that I can track what I’ve finished.*  
    **Storyline:** *Enable users to flag items they’ve finished.*

15. **User story 15 name:** *Add to Favorites*  
    **User story 15 "As a..." format:** *As a user, I want to mark an item as a favorite so that I can quickly access it later.*  
    **Storyline:** *Let users bookmark favorite items for fast retrieval.*

16. **User story 16 name:** *Rate an Item*  
    **User story 16 "As a..." format:** *As a user, I want to rate media items on a 1–5 scale so that I can record my opinion.*  
    **Storyline:** *Allow users to assign a numeric rating to each item.*

17. **User story 17 name:** *Write a Review*  
    **User story 17 "As a..." format:** *As a user, I want to write a text review for an item so that I can elaborate on my thoughts.*  
    **Storyline:** *Provide a text area for users to leave detailed feedback.*

18. **User story 18 name:** *Edit My Review*  
    **User story 18 "As a..." format:** *As a user, I want to update my review so that I can keep my feedback current.*  
    **Storyline:** *Enable users to revise their own reviews after posting.*

19. **User story 19 name:** *Delete My Review*  
    **User story 19 "As a..." format:** *As a user, I want to remove my review so that I can correct or retract it.*  
    **Storyline:** *Let users delete their reviews if they change their mind.*

20. **User story 20 name:** *Export Collection to CSV*  
    **User story 20 "As a..." format:** *As a user, I want to export my collection as UTF-8 CSV with columns [ID, title, type, publish date, rating] so that I can back up or share my core data.*  
    **Storyline:** *Generate a downloadable CSV backup of all my items.*

21. **User story 21 name:** *Import Collection from CSV*  
    **User story 21 "As a..." format:** *As a user, I want to import my collection from a UTF-8 CSV file with columns [ID, title, type, publish date, rating] so that I can quickly add multiple items.*  
    **Storyline:** *Upload a CSV to bulk-add items into my catalog.*

22. **User story 22 name:** *Lookup Book by Goodreads ID*  
    **User story 22 "As a..." format:** *As a user, I want to look up a book by its Goodreads ID so that I can auto-populate bibliographic details.*  
    **Storyline:** *Fetch book metadata automatically from Goodreads.* *(Phase 2)*

23. **User story 23 name:** *Lookup Movie/TV by IMDb ID*  
    **User story 23 "As a..." format:** *As a user, I want to look up a movie or TV show by its IMDb ID so that I can auto-populate cinematic details.*  
    **Storyline:** *Retrieve movie/TV metadata from IMDb.* *(Phase 2)*

24. **User story 24 name:** *Lookup Game by Steam ID*  
    **User story 24 "As a..." format:** *As a user, I want to look up a game by its Steam ID so that I can auto-populate gaming details.*  
    **Storyline:** *Pull game details from the Steam API.* *(Phase 2)*

25. **User story 25 name:** *View Aggregate Rating*  
    **User story 25 "As a..." format:** *As a user, I want to see the average rating across all users so that I understand overall sentiment.*  
    **Storyline:** *Display community average scores for each item.* *(Phase 2)*

26. **User story 26 name:** *View Other Users’ Reviews*  
    **User story 26 "As a..." format:** *As a user, I want to read reviews written by others so that I can discover different perspectives.*  
    **Storyline:** *List peer-written reviews alongside my own.* *(Phase 2)*

---

## 4. Sprint 1 Backlog & Acceptance Criteria

**Sprint Goal:**  
Enable secure login/logout, manual media entry via form, and paginated catalog browsing—fully functional, accessible, and configuration-driven.

### 4.1 Secure Login  
- **Functional**  
  - _Given_ valid credentials _when_ I click “Log in” _then_ I’m redirected to `/add-collection.html`.  
  - _Given_ invalid credentials _when_ I click “Log in” _then_ I see an inline “Invalid credentials” message.  
- **Non-functional (Security)**  
  - All login requests must use HTTPS; passwords stored with salted hashing.

### 4.2 Manual Media Creation  
- **Functional**  
  - _Given_ all required fields filled _when_ I click “Save” _then_ the item appears in my catalog.  
  - _Given_ any required field empty _when_ I click “Save” _then_ I see an inline validation error specifying that field.  
- **Non-functional (Usability)**  
  - The “Add Media” page must fully render within 2 s and use a consistent layout on desktop/mobile.

### 4.3 View Full Catalog  
- **Functional**  
  - _Given_ I’m authenticated _when_ I open `/add-collection.html` _then_ I see up to 20 items with Next/Prev controls.  
  - _Given_ more items exist _when_ I click “Next” _then_ the next 20 items load.  
- **Non-functional (Modifiability)**  
  - Catalog page columns (title, type, date, rating) must come from a simple JSON config so new fields can be added by editing that file only.

---

## 5. Architecture & Tech Stack

### 5.1 Microservices  
- **Auth Service** (`services/auth-service/`)  
- **Media Service** (`services/media-service/`)  
- **Catalog Service** (`services/catalog-service/`)  

Each service has:  
- `venv/` and `requirements.txt`  
- `config.py` (loads `.env`)  
- `app.py` (Flask factory)  
- `models.py` (SQLAlchemy)  
- `routes.py` (endpoints for Sprint 1)

### 5.2 Frontend (Plain HTML/JS)  
`frontend/` contains:  
- `index.html`, `media-add.html`, `add-collection.html`  
- `assets/css/styles.css`  
- `assets/js/common.js`, `auth.js`, `media.js`, `catalog.js`  
- Served via `python -m http.server 3000` (or similar)

## 6. Local Setup (No Docker)

1. **Database**: MySQL (run `mysql -u root -p < init.sql`) or SQLite (auto-create).  
2. **Environment**: Fill `.env` with DB and service URLs.  
3. **Start Services**: Activate each `venv` and run `flask run --port=5001|5002|5003`.  
4. **Serve Frontend**: `cd frontend && python -m http.server 3000`.  
5. **Test Flow**: Visit `http://localhost:3000/index.html`, then `/media-add.html`, `/add-collection.html`.

> _Feed this spec into your IDE’s LLM plugin (e.g. Copilot) to scaffold code, route handlers, and static pages for a no-Docker, no-React CS-level sprint._
