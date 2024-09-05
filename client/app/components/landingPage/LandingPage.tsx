import Link from "next/link";
import "./LandingPage.css";
import Header from "../header/Header";

export default function Component() {
  return (
    <>
      <Header />

      <section className="relative h-[500px] w-full overflow-hidden">
        <img
          alt="NIELIT Hero Image"
          className="h-full w-full object-cover object-center"
          src="https://cdn.dribbble.com/users/1716121/screenshots/15653259/media/5afe252670ab7aef9f5b89d31c912da4.png?resize=1000x750&vertical=center"
        />
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold">
              Welcome to NIELIT Corporate Certificate Database
            </h1>

            <div className="mt-6 flex justify-center space-x-4">
              <Link
                className="inline-flex items-center rounded-md bg-[#4b36bd] px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                href="../login"
              >
                Click to Move
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#1f316e] text-white px-4 py-6 sm:px-6 lg:px-8 mt-1">
        <div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
          <div className=" md:mb-0">
            <h3 className="text-lg font-bold">NIELIT Delhi</h3>
            <p className="text-sm">
              2nd Floor, Parsvnath Metro Mall,
              <br />
              Inderlok, Delhi - 110052
            </p>
            <p className="text-sm">
              Phone: +91-11-23644149, +91-11-23644149
              <br />
              Fax: +91-11-23644149
            </p>
          </div>
          <div className="flex space-x-4">
            <a className="text-gray-400 hover:text-white" href="https://www.facebook.com/NIELITIndia/">
              <FacebookIcon className="h-6 w-6" />
            </a>
            <a className="text-gray-400 hover:text-white" href="https://x.com/nielitindia">
              <TwitterIcon className="h-6 w-6" />
            </a>
            <a className="text-gray-400 hover:text-white" href="https://in.linkedin.com/in/nielit-india-b28425167?original_referer=https%3A%2F%2Fsearch.brave.com%2F">
              <LinkedinIcon className="h-6 w-6" />
            </a>
            <a className="text-gray-400 hover:text-white" href="https://www.youtube.com/NIELITIndia">
              <YoutubeIcon className="h-6 w-6" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-2-2h-2v8H8v-8H6v-4h2V8a4 4 0 0 1 4-4h4z" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}
