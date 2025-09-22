import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "../../components/ui/alert";

export default function EditLetterModal({ isOpen, onClose, letterData, onSuccess }) {
  const [formData, setFormData] = useState({ ...letterData, file: null });
  const [senders, setSenders] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");

  

  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem("token");
      fetch("https://diskominfo.palembang.go.id/docs-monitoring/letter-sender", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((result) => {
          if (Array.isArray(result.data)) {
            setSenders(result.data);
          }
        });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("letterNumber", formData.letterNumber);
    data.append("typeId", formData.typeId);
    data.append("receivedDate", formData.receivedDate);
    data.append("senderId", formData.senderId);
    data.append("subject", formData.subject);
    data.append("description", formData.description);
    if (formData.file) {
      data.append("file", formData.file);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://diskominfo.palembang.go.id/docs-monitoring/letter-update/${formData.id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        }
      );
      if (!response.ok) throw new Error("Gagal update surat");

      if (onSuccess) {
        onSuccess("Surat berhasil diupdate ✅");
      }

      setMessage("Surat berhasil diupdate ✅");
      setShowSuccess(true);

      onClose(); // tutup modal edit

      setTimeout(() => {
        setShowSuccess(false);
        setMessage("");
      }, 3000);
    } catch (err) {
      setMessage(err.message);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setMessage("");
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Edit */}
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
        <div className="bg-white w-full h-full sm:h-auto sm:w-3/4 sm:max-w-3xl p-4 sm:p-8 relative sm:rounded-lg rounded-none overflow-y-auto">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-black"
            onClick={onClose}
          >
            &times;
          </button>
          <h2 className="text-[#0B1838] text-lg font-bold mb-4 text-center">
            EDIT SURAT
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Nomor Surat*</label>
                <input
                  type="text"
                  name="letterNumber"
                  value={formData.letterNumber || ""}
                  onChange={handleChange}
                  required
                  className="border rounded px-3 py-2 w-full"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tipe Surat*</label>
                <select
                  name="typeId"
                  value={formData.typeId || ""}
                  onChange={handleChange}
                  required
                  className="border rounded px-3 py-2 w-full"
                >
                  <option value="">Jenis Surat</option>
                  <option value="1">Surat Masuk</option>
                  <option value="2">Surat Keluar</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Tanggal*</label>
                <input
                  type="date"
                  name="receivedDate"
                  value={formData.receivedDate?.slice(0, 10) || ""}
                  onChange={handleChange}
                  required
                  className="border rounded px-3 py-2 w-full"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Pengirim*</label>
                <select
                  name="senderId"
                  value={formData.senderId || ""}
                  onChange={handleChange}
                  required
                  className="border rounded px-3 py-2 w-full"
                >
                  {senders.map((sender) => (
                    <option key={sender.id} value={sender.id}>
                      {sender.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Subjek Surat*</label>
              <input
                type="text"
                name="subject"
                value={formData.subject || ""}
                onChange={handleChange}
                required
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Keterangan*</label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                required
                className="border rounded px-3 py-2 w-full h-24"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Upload Dokumen</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={handleFileChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-600 text-white h-10 px-4 rounded font-semibold hover:bg-green-700"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Notifikasi Success / Error */}
      <AnimatePresence>
        {showSuccess && (
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
    </>
  );
}
