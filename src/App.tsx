import { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import ProductPage from "./pages/ProductPage/ProductPage";
import { CartProvider } from "./context/CartContext";
import "./App.css";

const App: FC = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <Header />
        <div className="container-fluid">
          <Routes>
            <Route path="/" element={<CategoryPage />} />
            <Route path="/:category" element={<CategoryPage />} />
            <Route path="/product/:productId" element={<ProductPage />} />
          </Routes>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
