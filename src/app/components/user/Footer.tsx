import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-4">
              Fitarena
            </h3>
            <p className="text-gray-400 mb-6">
              Your premium platform for sports bookings, trainers, and game hosting.
            </p>
          </div>

          {[
            {
              title: "Quick Links",
              links: [
                { name: "Home", href: "/" },
                { name: "Stadiums", href: "/stadiums" },
                { name: "Trainers", href: "/trainers" },
                { name: "Host Game", href: "/host" }
              ]
            },
            // Add other footer columns...
          ].map((column, index) => (
            <div key={index}>
              <h4 className="font-bold text-lg mb-4">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link, i) => (
                  <li key={i}>
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-green-400 transition"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© {currentYear} Fitarena. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}