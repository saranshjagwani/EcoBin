import "./App.css";
import Login from "./auth/Login";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Signup from "./auth/Signup";
import ObjectDetectionpage from "./ecomovetest/ObjectDetectionpage"
import MainTest from "./ecomovetest/MainTest";
import MainPage from "./sellpage/MainPage";
import Cart from "./sellpage/Cart";
import Dashboard from "./admin/dashboard/Dashboard";
import AddProduct from "./pages/AddProduct";

import { store } from "@/redux/Store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { ProtectedRoutes, ProtectedRoutesForAdmin } from "./routes/routes";
import MyState from "@/Context/data/myState";
import ProductInfo from "./sellpage/ProductInfo";
import SearchPage from "./sellpage/SearchPage";
import OrderPage from "./pages/OrderPage";
import WasteCollection from "./pages/WasteCollection";

function App() {
  return (
    <Provider store={store}>
      <MyState>
        <Router>
          <Routes>
            <Route path="/" element={<ProtectedRoutes><MainTest /></ProtectedRoutes>} />
            <Route path="/login" element={<Login />} />
            <Route path="objdetect" element={<ProtectedRoutes><ObjectDetectionpage /></ProtectedRoutes>} />
            <Route path="/order" element={<ProtectedRoutes><OrderPage/></ProtectedRoutes>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/product" element={<ProtectedRoutes><MainPage/></ProtectedRoutes>} />
            <Route path="/productdetails" element={<ProtectedRoutes><ProductInfo/></ProtectedRoutes>} />
            <Route path="/cart" element={<ProtectedRoutes><Cart /></ProtectedRoutes>} />
            <Route path="/wastecollection" element={<ProtectedRoutes><WasteCollection /></ProtectedRoutes>} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoutesForAdmin>
                  <Dashboard />
                </ProtectedRoutesForAdmin>
              }
            />
            <Route
              path="/addproduct"
              element={
                <ProtectedRoutesForAdmin>
                  <AddProduct />
                </ProtectedRoutesForAdmin>
              }
              />
               <Route
              path="/addproduct"
              element={
                <ProtectedRoutesForAdmin>
                  <AddProduct />
                  </ProtectedRoutesForAdmin>
              }
              />
              <Route path="/product/:id" element={<ProtectedRoutes><ProductInfo /></ProtectedRoutes>} />
              <Route path="/searchpage" element={<ProtectedRoutes><SearchPage /></ProtectedRoutes>} />
          </Routes>
        </Router>
        <ToastContainer />
      </MyState>
    </Provider>
  );
}

export default App;

