import { motion } from 'framer-motion'
import { FiTwitter, FiFacebook, FiInstagram, FiLinkedin } from 'react-icons/fi'
import Link from 'next/link'

const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { name: "Home", href: "/" },
      { name: "Stadiums", href: "user/stadium" },
      { name: "Trainers", href: "user/trainers" },
      { name: "Host Game", href: "user/host" },
      { name: "Pricing", href: "/pricing" }
    ]
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "Press", href: "/press" },
      { name: "Contact", href: "/contact" }
    ]
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" }
    ]
  }
]

const socialIcons = [
  { icon: <FiTwitter />, href: "#" },
  { icon: <FiFacebook />, href: "#" },
  { icon: <FiInstagram />, href: "#" },
  { icon: <FiLinkedin />, href: "#" }
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-4">
              Fitarena
            </h3>
            <p className="text-gray-400 mb-6">
              Your premium platform for sports bookings, trainers, and game hosting.
            </p>
            <div className="flex space-x-4">
              {socialIcons.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition text-gray-300 hover:text-white"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link Columns */}
          {footerLinks.map((column, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-bold text-lg mb-4">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link, i) => (
                  <motion.li 
                    key={i}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-green-400 transition flex items-center"
                    >
                      <span className="w-1 h-1 bg-green-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition"></span>
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400"
        >
          <p>© {new Date().getFullYear()} Fitarena. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}