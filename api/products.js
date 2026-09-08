const products = [
  [1, "iPhone 15 Pro", "Apple", 12500000, "/images/iphone15pro.jpeg"],
  [2, "iPhone 15", "Apple", 9800000, "/images/15.jpeg"],
  [3, "iPhone 14 Pro Max", "Apple", 11900000, "/images/14promax.jpeg"],
  [4, "iPhone 13", "Apple", 7500000, "/images/13.jpeg"],
  [5, "Samsung Galaxy S24 Ultra", "Samsung", 14500000, "/images/samsung.jpeg"],
  [6, "Samsung Galaxy S24+", "Samsung", 11200000, "/images/24+.jpeg"],
  [7, "Samsung Galaxy A55", "Samsung", 4600000, "/images/a55.jpeg"],
  [8, "Samsung Z Flip5", "Samsung", 9500000, "/images/flip.jpeg"],
  [9, "Xiaomi 14 Ultra", "Xiaomi", 10500000, "/images/ultra.jpeg"],
  [10, "Redmi Note 13 Pro+", "Xiaomi", 4400000, "/images/note13.jpeg"],
  [11, "Poco F6 Pro", "Xiaomi", 5800000, "/images/pocco.jpeg"],
  [12, "Redmi 13C", "Xiaomi", 1600000, "/images/redmic.jpeg"],
  [13, "Google Pixel 8 Pro", "Google", 10200000, "/images/google7.jpeg"],
  [14, "Google Pixel 8", "Google", 7800000, "/images/google.jpeg"],
  [15, "Google Pixel 7a", "Google", 4900000, "/images/google7.jpeg"],
  [16, "Google Pixel Fold", "Google", 15500000, "/images/fold.jpeg"],
].map(([id, name, brand, price, image]) => ({
  id,
  name,
  brand,
  category: "Smartphone",
  price,
  stock: 10,
  image,
  description: `${brand} ${name} smartfoni`,
}));

export default function handler(request, response) {
  if (request.method === "GET") {
    return response.status(200).json(products);
  }

  if (request.method === "POST") {
    const product = { id: products.length + 1, ...request.body };
    products.push(product);
    return response.status(201).json(product);
  }

  const productId = Number(request.query?.id);
  const index = products.findIndex((product) => product.id === productId);

  if (index < 0) {
    return response.status(404).json({ detail: "Mahsulot topilmadi" });
  }

  if (request.method === "PUT") {
    products[index] = { id: productId, ...request.body };
    return response.status(200).json(products[index]);
  }

  if (request.method === "DELETE") {
    products.splice(index, 1);
    return response.status(200).json({ success: true });
  }

  response.setHeader("Allow", "GET, POST, PUT, DELETE");
  return response.status(405).json({ detail: "Method Not Allowed" });
}
