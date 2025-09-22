import EditLetterModal from "../edit surat/edit";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "../../components/ui/alert";
import DocumentViewerModal from "./DocumentViewerModal";

export default function DetailLetterModal({ isOpen, onClose, letterId }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [notif, setNotif] = useState("");

  const [viewerOpen, setViewerOpen] = useState(false);
const [selectedFileUrl, setSelectedFileUrl] = useState("");


  useEffect(() => {
    if (!letterId || !isOpen) return;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://diskominfo.palembang.go.id/docs-monitoring/letter/${letterId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setDetail(data.data);
      } catch (err) {
        console.error("Gagal ambil detail surat:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [letterId, isOpen]);

  // ✅ auto-hide notif setelah 1.5 detik
  useEffect(() => {
    if (notif) {
      const timer = setTimeout(() => setNotif(""), 1500);
      return () => clearTimeout(timer);
    }
  }, [notif]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4 sm:p-0">
        <div className="bg-white rounded-lg p-6 w-[500px] relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>

          {/* ✅ Alert Notif */}
          {notif && (
            <Alert className="bg-green-500 text-white shadow-lg border-none mb-4 animate-fadeIn">
              <AlertDescription className="text-center text-white font-semibold">
                {notif}
              </AlertDescription>
            </Alert>
          )}

          {loading ? (
            <p>Loading...</p>
          ) : detail ? (
            <>
              <h2 className="text-lg font-bold text-center mb-4">
                Detail Surat
              </h2>

              <table className="mt-10 text-sm w-full">
                <tbody>
                  <tr>
                    <td className="font-semibold p-2 w-40">Pengirim</td>
                    <td className="p-2">: {detail.sender?.name}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold p-2">Nomor Surat</td>
                    <td className="p-2">: {detail.letterNumber}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold p-2">Tanggal Surat</td>
                    <td className="p-2">
                      :{" "}
                      {new Date(detail.receivedDate).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold p-2">Jenis Surat</td>
                    <td className="p-2">: {detail.type?.name}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold p-2">Status</td>
                    <td className="p-2">: {detail.status?.name}</td>
                  </tr>
                </tbody>
              </table>

              <hr className="my-3" />

              <p className="font-bold mt-8 mb-2">Data Penyurat:</p>
              <div className="bg-[#0b1a3d] text-white p-3 rounded-md mb-8">
                <p className="text-sm mb-4">
                  <strong>Subjek:</strong> {detail.subject}
                </p>
                <p className="text-sm">
                  <strong>Deskripsi:</strong> {detail.description}
                </p>
              </div>

              {detail.files?.length > 0 && (
  <div className="mt-3 mb-10">
    <p className="font-bold">Dokumen Pendukung:</p>
    {detail.files.map((file) => (
      <button
        key={file.id}
        onClick={() => {
          setSelectedFileUrl(file.filePath);
          setViewerOpen(true);
        }}
        className="block text-blue-500 text-sm underline hover:text-blue-700"
      >
        Dokumen{" "}
        <span className="text-xs ml-2">
          ({new Date(detail.receivedDate).toLocaleDateString("id-ID")})
        </span>
      </button>
    ))}
  </div>
)}


              {/* Tombol Edit */}
              <div className="flex justify-end">
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="cursor-pointer w-24 bg-none text-[#0B1838] px-4 py-2 rounded-lg border border-[#0B1838]"
                >
                  Edit
                </button>
              </div>
            </>
          ) : (
            <p>Data tidak ditemukan.</p>
          )}
        </div>
      </div>


    {/* Modal DOC */}
      <DocumentViewerModal
      isOpen={viewerOpen}
      onClose={() => setViewerOpen(false)}
      fileUrl={selectedFileUrl}
    />


      {/* Modal Edit */}
      {isEditOpen && (
        <EditLetterModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          letterData={detail}
          onSuccess={(msg) => {
            setNotif(msg);
            setIsEditOpen(false);
          }}
        />
      )}
    </>
  );
}
