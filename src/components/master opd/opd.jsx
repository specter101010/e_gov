import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "../../components/ui/alert";

function MasterOPDModal({ isOpen, onClose }) {
  const [opdList, setOpdList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newOPDName, setNewOPDName] = useState("");
  const [saving, setSaving] = useState(false);
  const [notif, setNotif] = useState(""); // ✅ notif state

  useEffect(() => {
    if (isOpen) {
      fetchOPD();
    }
  }, [isOpen]);

  const fetchOPD = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://diskominfo.palembang.go.id/docs-monitoring/letter-sender",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Gagal mengambil data OPD");

      const result = await res.json();
      const dataArray = Array.isArray(result.data) ? result.data : [];
      setOpdList(dataArray);
    } catch (err) {
      console.error(err);
      setOpdList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOPD = async (e) => {
    e.preventDefault();
    if (!newOPDName.trim()) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://diskominfo.palembang.go.id/docs-monitoring/sender",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newOPDName }),
        }
      );

      if (!res.ok) throw new Error("Gagal menambah OPD");

      setNewOPDName("");
      setIsAddModalOpen(false);
      fetchOPD(); // refresh list

      // ✅ Tampilkan notif sukses
      setNotif("✅ Data OPD berhasil ditambahkan");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // ✅ auto hide notif setelah 2 detik
  useEffect(() => {
    if (notif) {
      const timer = setTimeout(() => setNotif(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [notif]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-3/4 max-w-3xl p-6 relative animate-fadeInUp">
        {/* Tombol Close */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">
          DATA ORGANISASI PERANGKAT DAERAH
        </h2>

        {/* ✅ Alert notif */}
        {notif && (
          <Alert className="bg-green-500 text-white shadow-lg border-none mb-3 animate-fadeIn">
            <AlertDescription className="text-center text-white font-semibold">
              {notif}
            </AlertDescription>
          </Alert>
        )}

        {/* Desktop Table */}
        <div className="hidden md:block overflow-y-auto max-h-[400px] border rounded">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2">No</th>
                <th className="px-3 py-2">OPD LIST</th>
                <th className="px-3 py-2">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    Memuat data...
                  </td>
                </tr>
              ) : opdList.length > 0 ? (
                opdList.map((opd, index) => (
                  <tr key={opd.id}>
                    <td className="border-t border-r px-3 py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border-t border-r px-3 py-2">{opd.name}</td>
                    <td className="border-t px-3 py-2 flex gap-2">
                      <button className="cursor-pointer w-20 bg-none text-[#0B1838] px-3 py-1 rounded-lg border border-[#0B1838]">
                        Edit
                      </button>
                      <button className="cursor-pointer w-20 bg-[#FF0000] text-white px-3 py-1 rounded-lg border border-[#0B1838]">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="block md:hidden space-y-4 max-h-[400px] overflow-y-auto">
          {loading ? (
            <p className="text-center py-4">Memuat data...</p>
          ) : opdList.length > 0 ? (
            opdList.map((opd, index) => (
              <div
                key={opd.id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm bg-gray-200 px-2 py-1 rounded-lg font-medium text-gray-700">
                    No {index + 1}
                  </span>
                </div>

                {/* Body */}
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-700">OPD</p>
                  <p className="text-base text-gray-900">{opd.name}</p>
                </div>

                {/* Footer (Action buttons) */}
                <div className="flex justify-end gap-2">
                  <button className="cursor-pointer flex-1 bg-none text-[#0B1838] px-3 py-2 rounded-lg border border-[#0B1838] text-sm font-medium">
                    Edit
                  </button>
                  <button className="cursor-pointer flex-1 bg-[#FF0000] text-white px-3 py-2 rounded-lg border border-[#0B1838] text-sm font-medium">
                    Hapus
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4">Tidak ada data</p>
          )}
        </div>

        {/* Tombol Tambah */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
          >
            TAMBAH
          </button>
        </div>
      </div>

      {/* Modal Tambah */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Tambah OPD</h2>
            <form onSubmit={handleAddOPD}>
              <input
                type="text"
                value={newOPDName}
                onChange={(e) => setNewOPDName(e.target.value)}
                placeholder="Masukkan Nama OPD"
                className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {saving ? "Menyimpan..." : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MasterOPDModal;
