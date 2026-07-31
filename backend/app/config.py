import os

# Ishlab chiqarishda (production) buni albatta .env fayldan o'qish kerak!
# Hozircha oddiy default qiymat bilan, .env orqali override qilinadi.
SECRET_KEY = os.getenv("SECRET_KEY", "nova-phone-maxfiy-kalit-buni-almashtiring")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 kun