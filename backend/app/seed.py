from app.database import SessionLocal, Base, engine
from app.models.product import Product

catalog = [
    {"name": "iPhone 15 Pro", "brand": "Apple", "category": "Apple", "price": 12500000, "stock": 25, "image": "/images/iphone15pro.jpeg", "description": "Titan korpusli premium iPhone."},
    {"name": "iPhone 15", "brand": "Apple", "category": "Apple", "price": 9800000, "stock": 40, "image": "/images/15.jpeg", "description": "Dynamic Island bilan yangi avlod iPhone."},
    {"name": "iPhone 14 Pro Max", "brand": "Apple", "category": "Apple", "price": 11900000, "stock": 12, "image": "/images/14promax.jpeg", "description": "Katta ekran va kuchli kamera."},
    {"name": "iPhone 13", "brand": "Apple", "category": "Apple", "price": 7500000, "stock": 30, "image": "/images/13.jpeg", "description": "Eng ommabop Apple smartfoni."},

    {"name": "Samsung Galaxy S24 Ultra", "brand": "Samsung", "category": "Samsung", "price": 14500000, "stock": 18, "image": "/images/samsung.jpeg", "description": "Galaxy AI va S Pen bilan."},
    {"name": "Samsung Galaxy S24+", "brand": "Samsung", "category": "Samsung", "price": 11200000, "stock": 22, "image": "/images/24+.jpeg", "description": "Premium Samsung flagmani."},
    {"name": "Samsung Galaxy A55", "brand": "Samsung", "category": "Samsung", "price": 4600000, "stock": 65, "image": "/images/a55.jpeg", "description": "O'rta klassdagi kuchli telefon."},
    {"name": "Samsung Z Flip5", "brand": "Samsung", "category": "Samsung", "price": 9500000, "stock": 14, "image": "/images/flip.jpeg", "description": "Buklama Samsung telefoni."},

    {"name": "Xiaomi 14 Ultra", "brand": "Xiaomi", "category": "Xiaomi", "price": 10500000, "stock": 22, "image": "/images/ultra.jpeg", "description": "Leica kamerali Xiaomi."},
    {"name": "Redmi Note 13 Pro+", "brand": "Xiaomi", "category": "Xiaomi", "price": 4400000, "stock": 80, "image": "/images/note13.jpeg", "description": "200MP kamerali Redmi."},
    {"name": "Poco F6 Pro", "brand": "Xiaomi", "category": "Xiaomi", "price": 5800000, "stock": 35, "image": "/images/pocco.jpeg", "description": "Snapdragon protsessorli Poco."},
    {"name": "Redmi 13C", "brand": "Xiaomi", "category": "Xiaomi", "price": 1600000, "stock": 120, "image": "/images/redmic.jpeg", "description": "Hamyonbop Redmi telefoni."},

    {"name": "Google Pixel 8 Pro", "brand": "Google", "category": "Google", "price": 10200000, "stock": 14, "image": "/images/google7.jpeg", "description": "Toza Android tajribasi."},
    {"name": "Google Pixel 8", "brand": "Google", "category": "Google", "price": 7800000, "stock": 20, "image": "/images/google.jpeg", "description": "Google flagmani."},
    {"name": "Google Pixel 7a", "brand": "Google", "category": "Google", "price": 4900000, "stock": 28, "image": "/images/google7.jpeg", "description": "Pixel kamerasi bilan."},
    {"name": "Google Pixel Fold", "brand": "Google", "category": "Google", "price": 15500000, "stock": 5, "image": "/images/fold.jpeg", "description": "Buklama Pixel."},

    {"name": "OnePlus 12", "brand": "OnePlus", "category": "OnePlus", "price": 9200000, "stock": 16, "image": "/images/oneplus.jpeg", "description": "Flagman OnePlus."},
    {"name": "OnePlus 12R", "brand": "OnePlus", "category": "OnePlus", "price": 6200000, "stock": 24, "image": "/images/oneplusR.jpeg", "description": "Narx va sifat bo'yicha zo'r."},
    {"name": "OnePlus Nord 4", "brand": "OnePlus", "category": "OnePlus", "price": 4500000, "stock": 45, "image": "/images/nord4.jpeg", "description": "Metall korpusli zamonaviy OnePlus."},
    {"name": "OnePlus Nord CE 4", "brand": "OnePlus", "category": "OnePlus", "price": 3500000, "stock": 50, "image": "/images/CE.jpeg", "description": "100W tezkor quvvatlashga ega."},

    {"name": "Huawei Pura 70 Ultra", "brand": "Huawei", "category": "Huawei", "price": 13500000, "stock": 7, "image": "/images/huavie.jpeg", "description": "Professional kamerali Huawei."},
    {"name": "Huawei Mate 60 Pro", "brand": "Huawei", "category": "Huawei", "price": 11000000, "stock": 10, "image": "/images/mate.jpeg", "description": "Kirin protsessorli flagman."},
    {"name": "Huawei Nova 12 Pro", "brand": "Huawei", "category": "Huawei", "price": 5900000, "stock": 15, "image": "/images/huavienna.jpeg", "description": "Selfi kamerasi bilan mashhur."},
    {"name": "Huawei Mate X5", "brand": "Huawei", "category": "Huawei", "price": 19500000, "stock": 4, "image": "/images/x5.jpeg", "description": "Buklama premium telefon."},

    {"name": "Realme GT 6", "brand": "Realme", "category": "Realme", "price": 6400000, "stock": 33, "image": "/images/gt.jpeg", "description": "Kuchli Snapdragon protsessori."},
    {"name": "Realme 12 Pro Plus", "brand": "Realme", "category": "Realme", "price": 4300000, "stock": 55, "image": "/images/realme.jpeg", "description": "Periskop kamerali model."},
    {"name": "Realme C67", "brand": "Realme", "category": "Realme", "price": 2100000, "stock": 90, "image": "/images/c67.jpeg", "description": "108MP kamerali budjet telefon."},
    {"name": "Realme 12 5G", "brand": "Realme", "category": "Realme", "price": 2800000, "stock": 42, "image": "/images/5g.jpeg", "description": "5G qo'llab-quvvatlovchi model."},

    {"name": "Oppo Find X7 Ultra", "brand": "Oppo", "category": "Oppo", "price": 11500000, "stock": 9, "image": "/images/x7Ultra.jpeg", "description": "Premium Oppo flagmani."},
    {"name": "Oppo Reno 12 Pro", "brand": "Oppo", "category": "Oppo", "price": 5400000, "stock": 38, "image": "/images/30pro.jpeg", "description": "AI kamerali zamonaviy model."},
    {"name": "Oppo A78", "brand": "Oppo", "category": "Oppo", "price": 2300000, "stock": 75, "image": "/images/a78.jpeg", "description": "AMOLED displeyli telefon."},
    {"name": "Oppo Find N3 Flip", "brand": "Oppo", "category": "Oppo", "price": 9900000, "stock": 11, "image": "/images/n3.jpeg", "description": "Buklama Oppo telefoni."},

    {"name": "Vivo X100 Pro", "brand": "Vivo", "category": "Vivo", "price": 10800000, "stock": 11, "image": "/images/vivo.jpeg", "description": "Zeiss kamerali Vivo."},
    {"name": "Vivo V30 Pro", "brand": "Vivo", "category": "Vivo", "price": 5600000, "stock": 42, "image": "/images/30pro.jpeg", "description": "Aura Light chirog'iga ega portret ustasi."},
    {"name": "Vivo Y200 5G", "brand": "Vivo", "category": "Vivo", "price": 3100000, "stock": 60, "image": "/images/5g.jpeg", "description": "Chiroyli orqa panelli yupqa dizayn."},
    {"name": "Vivo T2x 5G", "brand": "Vivo", "category": "Vivo", "price": 1900000, "stock": 88, "image": "/images/t2x.jpeg", "description": "Hamyonbop va tezkor 5G smartfon."},
]


def run_seed():
    """Bazani 36 ta telefon bilan to'ldiradi. Ikkinchi marta ishga tushirilsa, qayta qo'shmaydi."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing_count = db.query(Product).count()
        if existing_count == 0:
            for item in catalog:
                db.add(Product(**item))
            db.commit()
            return {"success": True, "message": f"{len(catalog)} ta mahsulot bazaga qo'shildi!"}
        else:
            return {"success": False, "message": f"Bazada allaqachon {existing_count} ta mahsulot bor, seed o'tkazilmadi."}
    finally:
        db.close()


if __name__ == "__main__":
    result = run_seed()
    print(result["message"])