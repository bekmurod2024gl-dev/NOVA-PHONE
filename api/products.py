import sys
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

backend_path = Path(__file__).resolve().parents[1] / "backend"
sys.path.insert(0, str(backend_path))

from app.seed import catalog


class ProductPayload(BaseModel):
    name: str
    brand: str
    category: str
    price: float
    stock: int
    image: str
    description: str


app = FastAPI(title="NOVA-PHONE Products API")
products = [
    {"id": index, **item}
    for index, item in enumerate(catalog, start=1)
]


@app.get("/")
def list_products() -> list[dict[str, Any]]:
    return products


@app.get("/{product_id}")
def get_product(product_id: int) -> dict[str, Any]:
    for product in products:
        if product["id"] == product_id:
            return product
    raise HTTPException(status_code=404, detail="Mahsulot topilmadi")


@app.post("/", status_code=201)
def create_product(payload: ProductPayload) -> dict[str, Any]:
    product = {"id": max((item["id"] for item in products), default=0) + 1, **payload.model_dump()}
    products.append(product)
    return product


@app.put("/{product_id}")
def update_product(product_id: int, payload: ProductPayload) -> dict[str, Any]:
    for index, product in enumerate(products):
        if product["id"] == product_id:
            updated = {"id": product_id, **payload.model_dump()}
            products[index] = updated
            return updated
    raise HTTPException(status_code=404, detail="Mahsulot topilmadi")


@app.delete("/{product_id}")
def delete_product(product_id: int) -> dict[str, bool]:
    for index, product in enumerate(products):
        if product["id"] == product_id:
            products.pop(index)
            return {"success": True}
    raise HTTPException(status_code=404, detail="Mahsulot topilmadi")
