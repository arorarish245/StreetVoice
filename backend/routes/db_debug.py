# routes/db_debug.py

from fastapi import APIRouter
from models.user import users  # or whatever your collection name is

router = APIRouter()

@router.get("/debug-db")
async def debug_db_connection():
    try:
        sample_doc = users.find_one()
        if sample_doc:
            return {
                "status": "success",
                "message": "MongoDB is connected.",
                "sample_document": str(sample_doc)
            }
        else:
            return {
                "status": "success",
                "message": "MongoDB is connected, but no documents found."
            }
    except Exception as e:
        return {
            "status": "error",
            "message": f"MongoDB connection failed: {str(e)}"
        }
