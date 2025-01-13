import { FC } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import CategoryPage from './pages/CategoryPage/CategoryPage'
import ProductPage from './pages/ProductPage/ProductPage'
import { CartProvider } from './context/CartContext'
import './App.css'

const App: FC = () => {
  return (
    <HashRouter>
      <CartProvider>
        <Header />
        <div className="container-fluid">
          <Routes>
            <Route index element={<CategoryPage />} />
            <Route path="/:category" element={<CategoryPage />} />
            <Route path="product/:productId" element={<ProductPage />} />
          </Routes>
        </div>
      </CartProvider>
    </HashRouter>
  )
}

export default App