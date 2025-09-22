import React, { useState, useEffect } from "react";
import Select from "react-select"; // ✅ import react-select

function AddLetterModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    letterNumber: "",
    typeId: "",
    receivedDate: new Date().toISOString().slice(0, 10),
    senderId: "",
    subject: "",
    description: "",
    file: null,
  });

  const [senders, setSenders] = useState([]);
  const [loadingSenders, setLoadingSenders] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoadingSenders(true);
      const token = localStorage.getItem("token");

      fetch("https://diskominfo.palembang.go.id/docs-monitoring/letter-sender", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Gagal mengambil data pengirim");
          return res.json();
        })
        .then((result) => {
          let senderList = [];
          if (Array.isArray(result)) {
            senderList = result;
          } else if (Array.isArray(result.data)) {
            senderList = result.data;
          }
          setSenders(
            senderList.map((s) => ({
              value: s.id,
              label: s.name,
            }))
          );
        })
        .catch((err) => {
          console.error(err);
          setSenders([]);
        })
        .finally(() => setLoadingSenders(false));
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

    if (!formData.file) {
      alert("File harus diupload dan maksimal 5MB");
      return;
    }
    if (formData.file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    const data = new FormData();
    data.append("letterNumber", formData.letterNumber);
    data.append("typeId", formData.typeId);
    data.append("receivedDate", formData.receivedDate);
    data.append("senderId", formData.senderId);
    data.append("subject", formData.subject);
    data.append("description", formData.description);
    data.append("file", formData.file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://diskominfo.palembang.go.id/docs-monitoring/letter-create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      if (!response.ok) {
        throw new Error("Gagal menyimpan surat");
      }

      const result = await response.json();
      alert("Surat berhasil disimpan");

      onSave(result);
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4 sm:p-0">
      <div className="bg-white w-full h-full sm:w-3/4 sm:max-w-3xl sm:h-auto sm:rounded-lg rounded-lg p-4 sm:p-8 relative overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-[#0B1838] text-lg font-bold mb-4 text-center">
          TAMBAH SURAT
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-[#0B1838]">
              <label className="block font-semibold mb-1">Nomor Surat*</label>
              <input
                type="text"
                name="letterNumber"
                value={formData.letterNumber}
                onChange={handleChange}
                placeholder="Masukkan Nomor Surat"
                required
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Tipe Surat*</label>
              <select
                name="typeId"
                value={formData.typeId}
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
                value={formData.receivedDate}
                onChange={handleChange}
                required
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Pengirim*</label>
              <Select
                options={senders}
                isLoading={loadingSenders}
                placeholder="Cari & Pilih Pengirim"
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    senderId: selected?.value || "",
                  }))
                }
                value={senders.find((s) => s.value === formData.senderId) || null}
                isClearable
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Subjek Surat*</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Masukkan Subjek Surat"
              required
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Keterangan*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Masukkan Keterangan...."
              required
              className="border rounded px-3 py-2 w-full h-24"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="w-full sm:w-auto">
              <label className="block font-semibold mb-1">Upload Dokumen*</label>
              <div className="flex items-center gap-4 border rounded-sm p-2">
                <span className="truncate text-sm">
                  {formData.file ? formData.file.name : "Maksimal ukuran file 5MB"}
                </span>

                <label className="flex items-center border rounded px-3 py-1 cursor-pointer bg-white hover:bg-gray-50">
                  <span className="text-gray-500 text-xs" id="fileLabel">
                    Pilih file
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={(e) => {
                      handleFileChange(e);
                      const fileName = e.target.files[0]?.name || "Pilih file";
                      document.getElementById("fileLabel").textContent = fileName;
                    }}
                    required
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white h-10 w-full sm:w-32 rounded font-semibold hover:bg-green-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddLetterModal;
