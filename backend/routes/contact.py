from fastapi import APIRouter
from pydantic import BaseModel, EmailStr

router = APIRouter()

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str

@router.post("/contact")
async def receive_contact(form: ContactForm):
    print(f"Message received from {form.name} <{form.email}>: {form.message}")
    return {"message": "Your message has been received."}
