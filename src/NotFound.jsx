function NotFound() {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50 text-red-700">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-4">Halaman tidak ditemukan</p>
        <a href="/login" className="text-blue-600 underline">
          Kembali ke Login
        </a>
      </div>
    );
  }
  
  export default NotFound;
  