import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate,useLocation  } from "react-router-dom";
import { Alert, AlertDescription } from "../../components/ui/alert"; 

function Login() {
  const location = useLocation(); // ⬅️ ambil location dari router
  const message = location.state?.message; // ⬅️ ambil pesan logout
  const { token } = useAuth();
    // console.log(token)
    // console.log(message + "logout")

    const tes = localStorage.getItem("token")
    // console.log(tes + "hs")

  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth(); // ambil fungsi login dari context
  const navigate = useNavigate();



  const apiUrl = import.meta.env.VITE_API_URL_PROD;

  const handleLogin = async () => {
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // console.log("Login sukses:", data);
        // console.log("Isi response:", data);
        // console.log("Token:", data.data?.token);

        const token = data.data?.token;
        if (token) {
            login(token);
 
        }
        navigate("/dashboard", { state: { message: "✅ Login berhasil" } });
        window.location.reload();
        
      } else {
        // console.error("Login gagal:", data.message || "Unknown error");
    // Kirim pesan gagal ke Notif Center
        navigate("/login", { state: { message: data.message || "Login gagal" } });
      }
    } catch (error) {
      // console.error("Error:", error);
      alert("Gagal menghubungi server.");
    }

    
  };



  return (
<div className="w-full h-screen bg-[#0B1838] flex justify-center items-center px-4">
     <div className="flex flex-col md:flex-row w-full max-w-[740px] md:h-[370px] rounded-xl overflow-hidden">
    {/* Kiri */}
    <div className="bg-[#25335A] flex justify-center items-center p-6 md:w-[370px] md:h-[370px]">
      <div className="flex flex-col items-center">
        <motion.img
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          width={120}
          className="md:w-[150px]"
          src="assets/logo/komdigi.png"
          alt=""
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center font-semibold text-white mt-2 text-lg md:text-base"
        >
          KOMINFO
        </motion.div>
      </div>
    </div>

    {/* Kanan */}
    <div className="bg-[#F5F5F5] flex-1 p-6 md:w-[370px] md:h-[370px]">
      <div className="flex items-center justify-center mb-6">
        <motion.img
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          src="assets/logo/palembang.png"
          alt="palembang"
          className="w-8 md:w-6 h-auto mr-3"
        />
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="text-base md:text-sm font-bold text-[#1C2C5B]"
          >
            PENYURATAN
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="text-xs text-[#1C2C5B]"
          >
            Diskominfo Kota Palembang
          </motion.p>
        </div>
      </div>

      {/* Email */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <label className="block font-semibold text-xs text-[#1C2C5B] mb-1">
          Email
        </label>
        <input
          type="email"
          placeholder="Masukkan Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-[#1C2C5B] focus:outline-none"
        />
      </motion.div>

      {/* Password */}
      <motion.div
        className="mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.4 }}
      >
        <label className="block font-semibold text-xs text-[#1C2C5B] mb-1">
          Password
        </label>
        <input
          type="password"
          placeholder="Masukkan Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-[#1C2C5B] focus:outline-none"
        />
      </motion.div>

      {/* Toggle */}
      <motion.div
        className="flex items-center justify-between mt-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.4 }}
      >
        <label className="flex items-center space-x-2 text-sm text-[#1C2C5B]">
          <span>Simpan informasi masuk</span>
        </label>
        <button
          onClick={() => setRemember(!remember)}
          className={`w-10 h-6 flex items-center rounded-full p-1 border-2 border-[#1C2C5B] transition-colors duration-300 ${
            remember ? "bg-[#1C2C5B]" : "bg-white"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full transform transition-transform duration-300 ${
              remember ? "translate-x-4 bg-white" : "bg-[#1C2C5B]"
            }`}
          />
        </button>
      </motion.div>

      {/* Tombol MASUK */}
      <motion.button
        onClick={handleLogin}
        className="w-full bg-[#1C2C5B] text-white font-bold py-3 rounded-xl cursor-pointer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.4 }}
      >
        MASUK
      </motion.button>
    </div>
  </div>

      {/* 🔔 Notif Center */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 w-[350px]"
          >
            <Alert className="bg-red-500 text-white shadow-lg border-none">
              <AlertDescription className="text-center text-white font-semibold">
                {message}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
      {/* <div>{message}</div> */}
    </div>
  );
}

export default Login;
