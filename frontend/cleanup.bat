@echo off
REM Cleanup script for removing obsolete HTML files and directories
cd /d "%~dp0frontend"

del /q add-collection.html add-media.html add.html catalog.html collection-detail.html collections.html dashboard.html home.html login.html media-add.html media-detail.html media.html new-user.html reset-password.html settings.html users.html view_catalog.html view-catalog.html

REM Remove assets and archive directories recursively
rmdir /s /q assets
rmdir /s /q archive

echo Cleanup complete.
