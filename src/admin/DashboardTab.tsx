import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaUser, FaCartPlus } from "react-icons/fa";
import { AiFillShopping, AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { collection, query, onSnapshot, orderBy, doc, deleteDoc } from "firebase/firestore";
import { fireDB } from "@/firebase/FirebaseConfig";
import { toast } from "react-toastify";

function DashboardTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products from Firestore
  const getProductData = () => {
    setLoading(true);
    const q = query(
      collection(fireDB, "products"),
      orderBy("time", "desc") // Retrieve products in descending order
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsArray = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProducts(productsArray);
      setLoading(false);
    });

    return () => unsubscribe();
  };

  // Delete product from Firestore
  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(fireDB, "products", id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  useEffect(() => {
    getProductData();
  }, []);

  return (
    <div className="container mx-auto">
      <div className="tab container mx-auto">
        <Tabs defaultIndex={0}>
          <TabList className="md:flex md:space-x-8 grid grid-cols-2 text-center gap-4 md:justify-center mb-10">
            <Tab>
              <button
                type="button"
                className="font-medium border-b-2 hover:shadow-purple-700 border-purple-500 text-purple-500 rounded-lg text-xl shadow-md hover:shadow-lg px-5 py-1.5 bg-white"
              >
                <div className="flex gap-2 items-center">
                  <MdOutlineProductionQuantityLimits />
                  Products
                </div>
              </button>
            </Tab>
            <Tab>
              <button
                type="button"
                className="font-medium border-b-2 border-pink-500 text-pink-500 hover:shadow-pink-700 rounded-lg text-xl shadow-md hover:shadow-lg px-5 py-1.5 bg-white"
              >
                <div className="flex gap-2 items-center">
                  <AiFillShopping /> Order
                </div>
              </button>
            </Tab>
            <Tab>
              <button
                type="button"
                className="font-medium border-b-2 border-green-500 text-green-500 hover:shadow-green-700 rounded-lg text-xl shadow-md hover:shadow-lg px-5 py-1.5 bg-white"
              >
                <div className="flex gap-2 items-center">
                  <FaUser /> Users
                </div>
              </button>
            </Tab>
          </TabList>

          {/* Product Tab */}
          <TabPanel>
            <div className="px-4 md:px-0 mb-16">
              <h1 className="text-center mb-5 text-3xl font-semibold underline text-gray-800">
                Product Details
              </h1>
              <div className="flex justify-end">
                <Link to={"/addproduct"}>
                  <button
                    type="button"
                    className="focus:outline-none bg-pink-600 text-white hover:bg-pink-700 outline-0 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 shadow-lg"
                  >
                    <div className="flex gap-2 items-center">
                      Add Product <FaCartPlus size={20} />
                    </div>
                  </button>
                </Link>
              </div>
              {loading ? (
                <div className="text-center text-gray-700">Loading...</div>
              ) : (
                <div className="relative overflow-x-auto shadow-lg rounded-lg bg-white">
                  <table className="w-full text-sm text-left text-gray-700">
                    <thead className="text-xs text-gray-800 uppercase bg-gray-100">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          S.No
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Image
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Title
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3">
                          AlternativeOf
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-100">
                          <td className="px-6 py-4">{index + 1}</td>
                          <td className="px-6 py-4">
                            <img
                              className="w-16 rounded-md"
                              src={item.imageUrl}
                              alt="Product"
                            />
                          </td>
                          <td className="px-6 py-4">{item.title}</td>
                          <td className="px-6 py-4">₹{item.price}</td>
                          <td className="px-6 py-4">{item.alternativefor}</td>
                          <td className="px-6 py-4">
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => deleteProduct(item.id)}
                            >
                              <AiFillDelete size={20} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabPanel>

          {/* Other Tabs */}
          <TabPanel>
            <h1 className="text-center text-xl text-gray-700">
              Order Details Coming Soon
            </h1>
          </TabPanel>
          <TabPanel>
            <h1 className="text-center text-xl text-gray-700">
              User Details Coming Soon
            </h1>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}

export default DashboardTab;