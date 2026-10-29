import CartNotice from "./components/CartNotice";
import Account from "./pages/Account";
import Cart from "./pages/Cart";
import Employee from "./pages/Employee";
import Licenses from "./pages/Licenses";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import ContactUs from "./pages/ContactUs";
import Feedback from "./pages/Feedback";
import Locations from "./pages/Locations";
import Menu from "./pages/Menu";
import Footer from "./components/Footer";
import { Navigate } from "react-router";
import ProductPage from "./pages/ProductPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full flex flex-col">
        <Navbar></Navbar>
        <CartNotice />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/account" element={<Account />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/licenses" element={<Licenses />} />
            <Route
              path="*"
              element={
                <main className="page">
                  <h1>Page not found</h1>
                  <a href="/">Return home</a>
                </main>
              }
            />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/locations" element={<Locations />} />
            <Route
              path="/menu"
              element={<Navigate to="/menu/doner-wraps" replace />}
            />
            <Route path="/menu/:category" element={<Menu />} />
            <Route path="/product/:product/:size" element={<ProductPage />} />
          </Routes>
        </div>
        <Footer></Footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
