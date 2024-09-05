export default function Header() {
  return (
    <>
      <header className="flex items-center justify-between  bg-[#1f316e] px-4 py-3 text-white sm:px-6 lg:px-8 mb-1">
        <div className="flex items-center">
          <img
            alt="NIELIT Logo"
            className="h-8 w-auto"
            src="https://www.itvoice.in/wp-content/uploads/2013/12/NIELIT-Logo.png"
          />
          <div className="ml-4 text-lg font-bold">
            National Institute of Electronics and Information Technology
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="mr-4 text-sm">
            Ministry of Electronics and Information Technology
            <br />
            Government of India
          </div>
          <img
            alt="Indian Emblem"
            className="h-8 w-auto"
            src="https://imgs.search.brave.com/5pd2BEDPcnDaUv_M-HSA9QSwyQthxDYGJeZ-Qo4Hokw/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9zZWVr/bG9nby5jb20vaW1h/Z2VzL0UvRW1ibGVt/X29mX0luZGlhLWxv/Z28tRTRDNkMwRkY2/Mi1zZWVrbG9nby5j/b20ucG5n"
          />
        </div>
      </header>
    </>
  );
}
