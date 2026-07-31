from pydantic import BaseModel


class ProductBase(BaseModel):
    name: str
    brand: str
    category: str
    price: float
    stock: int
    image: str
    description: str


class ProductCreate(ProductBase):
    pass


class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True