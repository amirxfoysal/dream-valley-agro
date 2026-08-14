import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';
import { UserAuthProvider } from './context/UserAuthContext.jsx';
import { SubcategoriesProvider } from './context/SubcategoriesContext.jsx';
import Layout from './components/Layout.jsx';
import RequireAdmin from './components/admin/RequireAdmin.jsx';
import RequireUser from './components/RequireUser.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Track from './pages/Track.jsx';
import Profile from './pages/Profile.jsx';
import Orders from './pages/Orders.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import AdminLogin from './pages/admin/Login.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminProducts from './pages/admin/Products.jsx';
import AdminTrees from './pages/admin/Trees.jsx';
import AdminCategories from './pages/admin/Categories.jsx';
import AdminCustomers from './pages/admin/Customers.jsx';
import AdminOrders from './pages/admin/Orders.jsx';
import AdminCourier from './pages/admin/Courier.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <SubcategoriesProvider>
        <CartProvider>
        <UserAuthProvider>
          <AdminAuthProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/track" element={<Track />} />
                  <Route
                    path="/checkout"
                    element={
                      <RequireUser>
                        <Checkout />
                      </RequireUser>
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/profile"
                    element={
                      <RequireUser>
                        <Profile />
                      </RequireUser>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <RequireUser>
                        <Orders />
                      </RequireUser>
                    }
                  />
                </Route>

                <Route path="/admin/login" element={<AdminLogin />} />

                <Route
                  path="/admin"
                  element={
                    <RequireAdmin>
                      <AdminLayout />
                    </RequireAdmin>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="trees" element={<AdminTrees />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="courier" element={<AdminCourier />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </AdminAuthProvider>
        </UserAuthProvider>
      </CartProvider>
      </SubcategoriesProvider>
    </ThemeProvider>
  );
}