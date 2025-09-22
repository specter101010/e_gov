import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// set worker tanpa CDN
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export default function DocumentViewerModal({ isOpen, onClose, fileUrl }) {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [numPages, setNumPages] = useState(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setProgress(0);

      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Gagal download file");

      const reader = response.body.getReader();
      const contentLength = +response.headers.get("Content-Length");
      let receivedLength = 0;
      let chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedLength += value.length;
        setProgress(Math.round((receivedLength / contentLength) * 100));
      }

      const blob = new Blob(chunks);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileUrl.split("/").pop();
      link.click();
    } catch (err) {
      alert("Download gagal: " + err.message);
    } finally {
      setDownloading(false);
      setProgress(0);
    }
  };

  const cleanUrl = (url) => {
    const u = new URL(url);
    const params = new URLSearchParams(u.search);

    // ambil hanya object_name
    const objectName = params.get("object_name");

    return `${u.origin}${u.pathname}?object_name=${objectName}`;
  };

  const renderPreview = () => {
    const cleanFileUrl = cleanUrl(fileUrl);

    if (cleanFileUrl.endsWith(".pdf")) {
      return (
        <div className="max-h-[500px] overflow-y-auto border">
          <Document
            file={fileUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={<p className="text-center">Memuat PDF...</p>}
            error={<p className="text-center">Gagal memuat PDF 😢</p>}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            ))}
          </Document>
        </div>
      );
    } else if (cleanFileUrl.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return (
        <img
          src={fileUrl}
          alt="Preview"
          className="max-h-[500px] mx-auto"
        />
      );
    } else if (cleanFileUrl.match(/\.(doc|docx|xls|xlsx)$/i)) {
      return (
        <iframe
          src={`https://docs.google.com/viewer?url=${fileUrl}&embedded=true`}
          className="w-full h-[500px]"
          title="Docs Preview"
        />
      );
    } else {
      return (
        <p className="text-center">
          Preview tidak tersedia, silakan download.
        </p>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full sm:w-3/4 max-w-3xl rounded-lg shadow-lg p-4 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-4 text-[#0B1838]">
          Dokumen Pendukung
        </h2>

        <div className="mb-4">{renderPreview()}</div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {downloading ? `Mengunduh... ${progress}%` : "Download"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}