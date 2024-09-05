import Link from "next/link";

import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Navigator from "../components/Navigator/Navigator";

export default function login() {
  // Admin and Operator logo placeholder URLs
  const adminLogoUrl =
    "https://imgs.search.brave.com/Go0JZlJxM7fo_PcSyJUZRZddZaHVc6UMFdCmOH3Moug/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jZG4x/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvYnVzaW5lc3Mt/bWFuYWdlbWVudC0x/NTYvNTAvNS02NC5w/bmc";
  const operatorLogoUrl =
    "https://img.icons8.com/ios-filled/50/000000/admin-settings-male.png";
  return (
    <>
      <Header />
      <Navigator />

      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        {/* Admin Login Section */}
        <div className="bg-white shadow-md rounded-lg p-6 m-4 w-full max-w-md">
          <div className="flex justify-center mb-4">
            <img src={adminLogoUrl} alt="Admin Logo" className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>
          <p className="text-gray-600 text-center mb-4">
            Please enter your admin credentials to access the admin dashboard.
          </p>
          <form className="space-y-4">
            <Link
              href="/login/admin"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Admin Section
            </Link>
          </form>
        </div>

        {/* Operator Login Section */}
        <div className="bg-white shadow-md rounded-lg p-6 m-4 w-full max-w-md">
          <div className="flex justify-center mb-4">
            <img
              src={operatorLogoUrl}
              alt="Operator Logo"
              className="w-12 h-12"
            />
          </div>
          <h2 className="text-2xl font-bold text-center mb-4">
            Operator Login
          </h2>
          <p className="text-gray-600 text-center mb-4">
            Please enter your operator credentials to access the system.
          </p>
          <form className="space-y-4">
            <Link
              href="/login/operator"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Operator Section
            </Link>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
