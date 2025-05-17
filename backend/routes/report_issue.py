from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi import Depends, Query
from config.cloudinary_config import cloudinary
from datetime import datetime, timedelta
from bson import ObjectId, Regex
from PIL import Image
from dependencies import get_current_user_email, get_current_user
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
            "user_id": current_user_id,
            "status": "submitted"  
        }
        issues_collection.insert_one(issue)
    except Exception as e:
        return {"message": f"Error saving issue to MongoDB: {str(e)}"}

    return {"message": "Issue reported successfully", "image_url": image_url}

@router.get("/my-reports")
def get_user_reports(current_user_email: str = Depends(get_current_user_email)):
    try:
        raw_reports = issues_collection.find(
            {"user_id": current_user_email},
            {
                "image_url": 1,
                "location": 1,
                "tags": 1,
                "reported_at": 1,
                "status": 1
            }
        )

        reports = []
        for report in raw_reports:
            report["_id"] = str(report["_id"])  # Convert ObjectId to string
            reports.append(report)

        return {"reports": reports}
    except Exception as e:
        return {"message": f"Error fetching reports: {str(e)}"}

@router.delete("/delete-report/{report_id}")
def delete_report(report_id: str, current_user_email: str = Depends(get_current_user_email)):
    try:
        print("Received request to delete report:", report_id)
        obj_id = ObjectId(report_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid report ID format")

    print("User attempting delete:", current_user_email)
    report = issues_collection.find_one({"_id": obj_id})
    if report:
        print("Found report:", report)
    else:
        print("Report not found in DB.")

    result = issues_collection.delete_one({
        "_id": obj_id,
        "user_id": current_user_email
    })

    print("Deleted count:", result.deleted_count)

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Report not found or not authorized")

    return {"message": "Report deleted successfully"}


@router.get("/all-reports")
def get_all_reports(
    current_user: dict = Depends(get_current_user),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query(None),
    status: str = Query(None),
    tag: str = Query(None),
    date: str = Query(None)  # single date filter in ISO format, e.g., '2025-05-17'
):
    if current_user.get("role") != "Admin":
        raise HTTPException(status_code=403, detail="Not authorized to access all reports")

    try:
        skip = (page - 1) * limit
        filter_query = {}

        # Search filter
        if search:
            regex = {"$regex": search, "$options": "i"}
            filter_query["$or"] = [
                {"tags": regex},
                {"location": regex}
            ]

        # Status filter
        if status and status.lower() != "all":
            filter_query["status"] = status

        # Tag filter
        if tag and tag.lower() != "all":
            filter_query["tags"] = {"$regex": tag, "$options": "i"}

        # Single date filter (fetch reports where reported_at is on this date)
        if date:
            date_obj = datetime.fromisoformat(date)
            next_day = date_obj + timedelta(days=1)
            filter_query["reported_at"] = {
                "$gte": date_obj,
                "$lt": next_day
            }

        raw_reports_cursor = issues_collection.find(
            filter_query,
            {
                "image_url": 1,
                "location": 1,
                "tags": 1,
                "reported_at": 1,
                "status": 1,
                "user_id": 1
            }
        ).sort("reported_at", -1).skip(skip).limit(limit)

        reports = []
        for report in raw_reports_cursor:
            report["_id"] = str(report["_id"])
            reports.append(report)

        total_count = issues_collection.count_documents(filter_query)

        return {
            "reports": reports,
            "page": page,
            "limit": limit,
            "total_count": total_count
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching reports: {str(e)}")