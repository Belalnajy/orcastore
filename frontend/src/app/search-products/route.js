import { productAPI } from "@/services/apiClient";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  if (!q || q.length < 2) {
    return new Response(JSON.stringify([]), { status: 200 });
  }
  try {
    const products = await productAPI.getProducts();
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase())
    );
    return new Response(JSON.stringify(filtered), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify([]), { status: 500 });
  }
}
