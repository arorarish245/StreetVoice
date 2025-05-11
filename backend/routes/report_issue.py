from fastapi import APIRouter, File, UploadFile, Form
from fastapi import Depends
from config.cloudinary_config import cloudinary
from PIL import Image
from dependencies import get_current_user_email
from io import BytesIO
from pymongo import MongoClient
from datetime import datetime
import os

router = APIRouter()

# MongoDB setup
MONGODB_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGODB_URI)
db = client["StreetVoice"]
issues_collection = db["reported_issues"]

# Function to compress image
def compress_image(upload_file: UploadFile, quality: int = 70):
    image = Image.open(upload_file.file)
    image = image.convert("RGB")  # Ensure it's in RGB
    buffer = BytesIO()
    image.save(buffer, format="JPEG", quality=quality)
    buffer.seek(0)
    return buffer

@router.post("/report-issue")
async def report_issue(
    image: UploadFile = File(...),
    location: str = Form(...),
    description: str = Form(...),
    tags: str = Form(...),
    current_user_id: str = Depends(get_current_user_email)
):
    try:
        compressed_file = compress_image(image, quality=70)

        result = cloudinary.uploader.upload(
            compressed_file,
            transformation=[
                {"width": 800, "crop": "scale"},
                {"quality": "auto"},
                {"fetch_format": "auto"},
            ]
        )
        image_url = result["secure_url"]

    except Exception as e:
        return {"message": f"Error uploading image to Cloudinary: {str(e)}"}

    try:
        issue = {
            "image_url": image_url,
            "location": location,
            "description": description,
            "tags": tags,
            "reported_at": datetime.utcnow(),
            "user_id": current_user_id 
        }
        issues_collection.insert_one(issue)
    except Exception as e:
        return {"message": f"Error saving issue to MongoDB: {str(e)}"}

    return {"message": "Issue reported successfully", "image_url": image_url}