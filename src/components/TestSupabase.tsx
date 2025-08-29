import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

type Product = {
  id: number
  name: string
  price: number
}

export default function TestSupabase() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch products from Supabase
  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.from('products').select('*')
    if (error) setError(error.message)
    else if (data) setProducts(data as Product[])
    setLoading(false)
  }

  // Insert a sample product
  const addProduct = async () => {
    const { error } = await supabase.from('products').insert([
      { name: 'Test Product', price: 100 },
    ])
    if (error) setError(error.message)
    else fetchProducts()
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h2>Supabase Products</h2>
      <button onClick={addProduct}>➕ Add Test Product</button>
      <button onClick={fetchProducts} style={{ marginLeft: '10px' }}>
        🔄 Refresh
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - PKR {p.price}
          </li>
        ))}
      </ul>
    </div>
  )
}
