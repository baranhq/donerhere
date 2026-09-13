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
import Productss from "./pages/Products";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar></Navbar>
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/locations" element={<Locations />} />
            <Route
              path="/menu"
              element={<Navigate to="/menu/doner-wraps" replace />}
            />
            <Route path="/menu/:category" element={<Menu />} />
            <Route path="/products" element={<Productss />} />
          </Routes>
        </div>
        <Footer></Footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
