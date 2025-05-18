from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from models.suggestion import get_suggestion
from dependencies import get_current_user_email  

router = APIRouter()

class SuggestionRequest(BaseModel):
    tag: str
    location: str
    description: str

@router.post("/suggestion")
def get_suggestion_for_admin(
    request: SuggestionRequest,
    current_user_email: str = Depends(get_current_user_email)
):
    # Optional: You can restrict access here to admin users only
    # if current_user_email not in admin_list:
    #     raise HTTPException(status_code=403, detail="Not authorized")

    try:
        suggestion = get_suggestion(
            tag=request.tag,
            location=request.location,
            description=request.description
        )
        return {"suggestion": suggestion}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
