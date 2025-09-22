import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import MasterOPDModal from "../master opd/opd";



export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);
 
      
    const { token, logout } = useAuth();
      const navigate = useNavigate();

      
  

  const handleLogout = () => {
    navigate("/login", { state: { message: "Logout berhasil" } });
    logout();

    window.location.reload();
  };

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Header */}
      <header className="bg-[#0B1838] text-white flex items-center justify-between pt-5 pb-5 px-5 shadow-md relative">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-white/10 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo & Title */}
          <div className="flex items-center space-x-2">
            <img
              src="assets/logo/palembang.png"
              alt="Logo"
              className="h-8 w-8 object-contain"
            />
            <div className="leading-tight">
              <p className="text-sm font-bold">PENYURATAN</p>
              <p className="text-xs text-gray-300">Diskominfos Kota Palembang</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-red-500 font-bold">
              A
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-gray-300">kominfo@palembang.go.id</p>
            </div>
          </div>

          {/* Dropdown Menu dengan animasi */}
          <div
            className={`absolute right-0 top-12 bg-white text-black rounded shadow-md w-40 transform transition-all duration-200 origin-top ${
              dropdownOpen
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }`}
          >
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded rounded-lg"
            > 
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-72 h-full bg-[#0B1838] text-white z-50 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 pt-4">
        <div className="flex items-center space-x-2 ">
            <img
              src="assets/logo/palembang.png"
              alt="Logo"
              className="h-8 w-8 object-contain"
            />
            <div className="leading-tight">
              <p className="text-sm font-bold">PENYURATAN</p>
              <p className="text-xs text-gray-300">Diskominfos Kota Palembang</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-white/10 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-4">
          <button onClick={() => setIsModalOpen(true)} className="w-full text-left px-4 py-2 hover:bg-white/10">
            Master OPD
          </button>
        </nav>

      </aside>
      <MasterOPDModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

   
    </>
  );
}
