"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import Link from "next/link";
import axios from "axios"; // Import axios for HTTP requests
import Navigator from "../Navigator/Navigator";

export default function Component() {
  const [center, setCenter] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/api/auth/register", {
        center,
        email,
        password,
      });
      setMessage(response.data.message);
      setMessage("Registration Successful! Move to Login ");
      setError("");
    } catch (error) {
      
     
      if (error instanceof Error && (error as any).response && (error as any).response.data) {
     
        setError("Registration Failed: " + (error as any).response.data.message);
      } else {
        setError("Registration Failed: An unknown error occurred.");
      }
      
      setMessage("");
    }
    finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Header />
      <Navigator/>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            alt="Header Logo"
            className="mx-auto h-12 w-auto"
            src="https://www.itvoice.in/wp-content/uploads/2013/12/NIELIT-Logo.png"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register Admin
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="center">Choose Centre:</label>
                <select
                  name="center"
                  id="center"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  value={center}
                  onChange={(e) => setCenter(e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="nielit_karkardooma">NIELIT Karkardooma</option>
                  <option value="nielit_inderlok">NIELIT Inderlok</option>
                  <option value="nielit_janakpuri">NIELIT Janakpuri</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="mt-1">
                  <Input
                    autoComplete="email"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    id="email"
                    name="email"
                    placeholder="Enter User Name"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="mt-1">
                  <Input
                    autoComplete="current-password"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    id="password"
                    name="password"
                    placeholder="Password"
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
             
              
              {/* <div>
                <Button
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-green-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Sign Up"}
                </Button>
              </div> */}
              <div>
                <Button
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-green-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  type="submit"
                  disabled={loading}
                >
                 {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-3 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Registering ...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
              <p className=" text-center">
                
                <Link
                  href="/login/admin"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Already have an account? Login
                </Link>
              </p>
            </form>
            {message && (
              <div className="mt-4 text-center text-green-600">{message}</div>
            )}
             {error && <p className="mt-2 text-center text-red-600">{error}</p>}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
