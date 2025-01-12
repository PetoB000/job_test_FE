import { FC, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchGraphQL } from '../../services/graphql/client'
import { GET_CATEGORY } from '../../services/graphql/queries'
import { Category } from '../../services/graphql/types'
import ProductCard from '../../components/ProductCard/ProductCard'

interface CategoryResponse {
  data: {
    category: Category
  }
}

const CategoryPage: FC = () => {
  const navigate = useNavigate()
  const { categoryId } = useParams()
  const [category, setCategory] = useState<Category | null>(null)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetchGraphQL<CategoryResponse>(GET_CATEGORY, {
          id: categoryId
        })
        setCategory(response.data.category)
      } catch (error) {
        console.error('Failed to fetch category:', error)
      }
    }

    fetchCategory()
  }, [categoryId])

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`)
  }

  return (
    <div className="container mt-5 pt-5">
      <h1 className="mb-4 text-start">{category?.name.toLocaleUpperCase()}</h1>
      <div className="row row-cols-3 g-4 justify-content-evenly mb-5">
        {category?.products.map(product => (
          <div 
            className="col" 
            key={product.id} 
            onClick={() => handleProductClick(product.id)}
            style={{ cursor: 'pointer' }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}
export default CategoryPage