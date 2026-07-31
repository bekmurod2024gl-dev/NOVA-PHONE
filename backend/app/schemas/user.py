from pydantic import BaseModel, EmailStr


# Ro'yxatdan o'tishda frontend yuboradigan ma'lumot
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


# Login qilishda frontend yuboradigan ma'lumot
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# Backend foydalanuvchi haqida qaytaradigan ma'lumot (parolsiz!)
class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    is_admin: bool

    class Config:
        from_attributes = True


# Login muvaffaqiyatli bo'lganda qaytariladigan token
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut