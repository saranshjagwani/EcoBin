import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, fireDB } from "@/firebase/FirebaseConfig";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import Loader from "@/load/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    let formValid = true;
    const newErrors = { name: "", email: "", password: "" };

    if (!name.trim()) {
      newErrors.name = "Name is required.";
      formValid = false;
    }
    if (!email.trim()) {
      newErrors.email = "Email is required.";
      formValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
      formValid = false;
    }
    if (!password.trim()) {
      newErrors.password = "Password is required.";
      formValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
      formValid = false;
    }

    setErrors(newErrors);
    return formValid;
  };

  const signup = async () => {
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const users = await createUserWithEmailAndPassword(auth, email, password);

      const user = {
        name: name,
        uid: users.user.uid,
        email: users.user.email,
        time: Timestamp.now(),
      };
      const userRef = collection(fireDB, "users");
      await addDoc(userRef, user);

      toast.success("Signup Successful!");
      setName("");
      setEmail("");
      setPassword("");
      setErrors({ name: "", email: "", password: "" });
      setLoading(false);

      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Signup Failed! Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <ToastContainer />
      {loading && <Loader />}
      <div className="bg-gray-800 px-10 py-10 rounded-xl">
        <div>
          <h1 className="text-center text-white text-xl mb-4 font-bold">Signup</h1>
        </div>
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            className="bg-gray-600 mb-2 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
            placeholder="Name"
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
        </div>

        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            className="bg-gray-600 mb-2 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
            placeholder="Email"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>

        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-600 mb-2 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
            placeholder="Password"
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
        </div>

        <div className="flex justify-center mb-3">
          <button
            onClick={signup}
            className="bg-red-500 w-full text-white font-bold px-2 py-2 rounded-lg"
            disabled={loading}
          >
            Signup
          </button>
        </div>
        <div>
          <h2 className="text-white">
            Have an account?{" "}
            <Link className="text-red-500 font-bold" to={"/login"}>
              Login
            </Link>
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Signup;
