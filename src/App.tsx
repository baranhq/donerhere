import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import ContactUs from "./pages/ContactUs";
import Feedback from "./pages/Feedback";
import Locations from "./pages/Locations";
import OurStory from "./pages/OurStory";
import Menu from "./pages/Menu";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/our-story" element={<OurStory />} />
      </Routes>
      <Footer></Footer>
    </BrowserRouter>
  );
}

export default App;
