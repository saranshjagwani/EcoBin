import Navbar from "@/components/ui/Navbar"
import Filter from "./FilterPage"
import ProductCard from "./ProductCard"
import Track from "./Track"
import Footer from "@/ecomovetest/Footer"

const MainPage = () => {
  return (
    <div>
        <Navbar/>
        <div className="mt-20">
        <Filter />
        </div>
        <ProductCard/>
        <Track/>
        <Footer/>
    </div>
  )
}

export default MainPage