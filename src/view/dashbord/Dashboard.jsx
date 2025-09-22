import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import Header from "../../components/header/header";
import AddLetterModal from "../../components/add surat/add";
import DetailLetterModal from "../../components/detail/detail";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Alert, AlertDescription } from "../../components/ui/alert"; 

function Dashboard() {
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message || "");
  const { token } = useAuth();
  const navigate = useNavigate();

  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedLetterId, setSelectedLetterId] = useState(null);

  // 🔑 Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Cek token
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } 
  }, [token, navigate]);

  // Fetch data surat dengan pagination
  const fetchLetters = async () => {
    try {
      setLoading(true);
      const storedToken = localStorage.getItem("token");
      const response = await fetch(
        `https://diskominfo.palembang.go.id/docs-monitoring/letter?page=${page}&perPage=10`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data surat");
      }
   

      const data = await response.json();
      // console.log(data)
      setLetters(data.data || []);
      setTotalPages(data.pages || 1);
    } catch (error) {
      // console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLetters(page);
    }
  }, [page, token]);

  // logging message dipisah
  useEffect(() => {
    if (message) {
      console.log(message + " login dashboard");
    }
  }, [message]);

  useEffect(() => {
    if (location.state?.message) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveNewLetter = (newLetter) => {
    setLetters((prev) => [newLetter, ...prev]);
  };

  return (
    <div>
      <Header />

      <div className="p-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Info */}
          <div className="lg:col-span-2">
            <div className="mt-10 mb-10">
              <h1 className="text-3xl font-bold text-[#0b1a3d]">
                Aplikasi Penyuratan E-Gov
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Pencatatan seluruh surat masuk kepada E-Gov Diskominfo Kota
                Palembang
              </p>
            </div>

            {/* Overview + Stats */}
            <div className="mt-4 flex items-center gap-4">
              <button className="bg-[#0b1a3d] text-white px-4 py-2 rounded-lg">
                Overview
              </button>
              <div className="border rounded-md px-4 py-2 flex gap-3 items-center">
                <span className="text-xs text-[#0B1838]">Total Surat Masuk</span>
                <span className="text-2xl font-bold text-[#0B1838]">
                  {letters.length}
                </span>
              </div>
              <div className="border rounded-md px-4 py-2 flex gap-3 items-center">
                <span className="text-xs text-[#0B1838]">Total Surat Keluar</span>
                <span className="text-2xl font-bold text-[#0B1838]">0</span>
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="bg-[#0B1838] text-white rounded-lg p-6 flex relative">
            <div className="pl-10 ">
              <img
                src="assets/logo/komdigi.png"
                alt="KOMINFO"
                className="w-20 mb-2"
              />
              <span className="text-lg font-bold">KOMINFO</span>
            </div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="absolute bottom-15 right-4 bg-white text-black px-4 py-2 rounded-lg shadow"
            >
              <button>+ Tambah Surat</button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">Surat Terbaru</h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="overflow-x-auto border-1  rounded-lg">
                <table className="min-w-full   overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr className="border-b">
                      <th className="px-4 py-2 ">No</th>
                      <th className="px-4 py-2 ">OPD</th>
                      <th className="px-4 py-2 ">Tanggal</th>
                      <th className="px-4 py-2 ">Keterangan</th>
                      <th className="px-4 py-2 ">Status</th>
                      <th className="px-4 py-2 ">Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {letters.map((letter, index) => (
                      <tr key={letter.id} className="text-sm">
                        <td className="flex justify-center py-2 ">
                          {(page - 1) * 10 + index + 1}
                        </td>
                        <td className="px-4 py-2 border-l">
                          {letter.sender?.name}
                        </td>
                        <td className="px-4 py-2 ">
                          {new Date(letter.receivedDate).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-4 py-2 ">{letter.description}</td>
                        <td className="px-4 py-2 flex justify-center ">
                          {letter.status?.name === "Diterima" && (
                            <span className="text-green-500 font-medium">
                              {letter.status.name}
                            </span>
                          )}
                          {letter.status?.name === "Ditolak" && (
                            <span className="text-red-500 font-medium">
                              {letter.status.name}
                            </span>
                          )}
                          {letter.status?.name === "Proses" && (
                            <span className="text-yellow-500 font-medium">
                              {letter.status.name}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 ">
                          <div className=" flex justify-center">
                            <button
                              className="px-3 py-1 border rounded hover:bg-gray-100"
                              onClick={() => {
                                setSelectedLetterId(letter.id);
                                setIsDetailOpen(true);
                              }}
                            >
                              Detail
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center mt-4 space-x-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 border rounded ${
                      page === i + 1 ? "bg-gray-300 font-bold" : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        <AddLetterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveNewLetter}
        />

        <DetailLetterModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          letterId={selectedLetterId}
        />
      </div>

      <div className="">
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
              <Alert className="bg-green-500 text-white shadow-lg border-none">
                <AlertDescription className="text-center text-white font-semibold">
                  {message}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Dashboard;
