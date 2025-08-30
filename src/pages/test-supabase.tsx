// pages/test-supabase.tsx
import { useEffect, useState } from 'react'
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../productService'

type Product = {
  id: number
  name: string
  price: number
  quantity: number
}

export default function TestSupabase() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [errMsg, setErrMsg] = useState<string | null>(null)

  const loadProducts = async () => {
    try {
      setLoading(true)
      setErrMsg(null)
      const data = await fetchProducts()
      setProducts(data)
    } catch (err: any) {
      setErrMsg(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async () => {
    try {
      setLoading(true)
      setErrMsg(null)
      await addProduct({ name: 'Test Product', price: 100, quantity: 1 })
      await loadProducts()
    } catch (err: any) {
      setErrMsg(err.message || 'Insert failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    try {
      setLoading(true)
      setErrMsg(null)
      await deleteProduct(id)
      await loadProducts()
    } catch (err: any) {
      setErrMsg(err.message || 'Delete failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h2>Supabase Products</h2>
      <button onClick={handleAddProduct}>➕ Add Test Product</button>
      {loading && <p>Loading...</p>}
      {errMsg && <p style={{ color: 'red' }}>Error: {errMsg}</p>}

      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} — {p.price} — {p.quantity}{' '}
            <button onClick={() => handleDeleteProduct(p.id)}>🗑 Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
