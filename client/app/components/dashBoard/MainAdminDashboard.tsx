"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/drop-down";



import AdminDashboardForm from "./AdminDashboardForm";
import AdminDashboardForm2 from "./AdminDashboardForm2";
import AdminDashboardForm3 from "./AdminDashboardForm3";
import AdminDashboardForm4 from "./AdminDashboardForm4";
import Footer from "../footer/Footer";


export default function Component() {
  const [activeTab, setActiveTab] = useState("dashboard");
  

  const handleLogout = () => {
    
    setTimeout(() => {
      // Redirect to the logout page or perform logout action
      window.location.href = "/login/admin";
    }, 1000); // Adjust the timeout duration as needed
  };
  return (
    <>
      <header className="bg-[#1f316e]  text-white py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img
              alt="Header Logo"
              className="mx-auto h-12 w-auto"
              src="https://www.itvoice.in/wp-content/uploads/2013/12/NIELIT-Logo.png"
            />
          </div>
          <span className="text-lg font-medium">
            National Institute of Electronics and Information Technology Delhi
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <img
              alt="logo"
              className="rounded-full"
              height="40"
              src="https://imgs.search.brave.com/Q7PYThaDi13HjjC4tlw4GO7M9LQ85X3GRpiA2_9aa9U/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9jZG4y/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvdXNlci0yMy81/MTIvVXNlcl9BZG1p/bmlzdHJhdG9yXzMu/cG5n"
              style={{
                aspectRatio: "40/40",
                objectFit: "cover",
              }}
              width="40"
            />
            <span className="font-medium">Admin</span>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen w-full">
        <div className="hidden w-64 shrink-0 border-r bg-gray-100 dark:border-gray-800 dark:bg-gray-950 md:block">
          <div className="flex h-16 items-center justify-between px-6">
            <Link
              href="#"
              className="flex items-center gap-2 font-semibold"
              prefetch={false}
            >
              <Package2Icon className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </Link>
          </div>



          <nav className="flex flex-col gap-1 px-4 py-6">
            <Button
              variant="ghost"
              size="sm"
              className={`justify-start gap-2 text-left ${
                activeTab === "dashboard" ? "font-bold bg-gray-200" : ""
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChartIcon className="h-4 w-4" />
              Candidate Report
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`justify-start gap-2 text-left ${
                activeTab === "dashboard2" ? "font-bold bg-gray-200" : ""
              }`}
              onClick={() => setActiveTab("dashboard2")}
            >
              <BarChartIcon className="h-4 w-4" />
              Batch Report
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`justify-start gap-2 text-left ${
                activeTab === "dashboard3" ? "font-bold bg-gray-200" : ""
              }`}
              onClick={() => setActiveTab("dashboard3")}
            >
              <BarChartIcon className="h-4 w-4" />
              Batch-Wise Certificate Rep
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`justify-start gap-2 text-left ${
                activeTab === "dashboard4" ? "font-bold bg-gray-200" : ""
              }`}
              onClick={() => setActiveTab("dashboard4")}
            >
              <BarChartIcon className="h-4 w-4" />
              Batch MasterData Report
            </Button>
          </nav>
        </div>

        <div className="flex-1">
          <header className="flex h-16 items-center justify-between border-b bg-white px-4 dark:border-gray-800 dark:bg-gray-950 md:px-6">
            <h1 className="text-lg font-bold">Admin Portal</h1>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <LogOutIcon className="h-5 w-5 mr-2  text-black  bg-[#ebebf9]" />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>NIELIT Admin</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem>
                    
                    <Button
                      onClick={handleLogout}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-300"
                    >
                      Logout
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-6">
            {activeTab === "dashboard" && (
              <AdminDashboardForm login="operator" />
            )}
            {activeTab === "dashboard2" && (
              <AdminDashboardForm2 login="operator" />
            )}
            {activeTab === "dashboard3" && (
              <AdminDashboardForm3 login="operator" />
            )}
            {activeTab === "dashboard4" && (
              <AdminDashboardForm4 login="operator" />
            )}
          </main>
        </div>
      </div>

      <div>
        <Footer></Footer>
      </div>
    </>
  );
}

function BarChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}





function Package2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
}





function LogOutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}
