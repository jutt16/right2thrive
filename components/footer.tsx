import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, Mail, Phone } from "lucide-react";
import { SiTiktok } from "react-icons/si"; // TikTok icon

export default function Footer() {
  return (
    <footer className="border-t bg-[#00990d] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="mb-4 flex items-center space-x-2">
              <Image
                src="/right2thrive-logo.jpg"
                alt="Right2Thrive UK Logo"
                width={60}
                height={60}
                className="rounded-full"
              />
              <span className="text-lg font-bold">Right2Thrive UK</span>
            </Link>
            <p className="text-sm text-gray-300">Together We Thrive</p>
            <br />
            <p className="text-sm text-gray-300">
              Together, we can create a safe, supportive environment where every
              young person and family has the opportunity to heal, grow, and
              thrive.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link
                href="https://www.instagram.com/right2thriveuk/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-5 w-5 text-white hover:text-orange-400" />
              </Link>
              <Link
                href="https://twitter.com/@Right2ThriveUK"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-5 w-5 text-white hover:text-orange-400" />
              </Link>
              <Link href="mailto:hello@right2thriveuk.com">
                <Mail className="h-5 w-5 text-white hover:text-orange-400" />
              </Link>
              <Link
                href="https://www.tiktok.com/@right2thrive?lang=en"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiTiktok className="h-5 w-5 text-white hover:text-orange-400" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-orange-400">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/cultural-activities"
                  className="hover:text-orange-400"
                >
                  Wellbeing Activities
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-orange-400">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/wellbeing-hub" className="hover:text-orange-400">
                  Wellbeing Hub
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-orange-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/wellbeing-team" className="hover:text-orange-400">
                  Wellbeing Team
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/data-retention-policy"
                  className="hover:text-orange-400"
                >
                  Data Retention & Deletion Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/sar-policy"
                  className="hover:text-orange-400"
                >
                  Subject Access Requests Policy
                </Link>
              </li>
              <li>
                <a
                  href="/app-release.apk"
                  download
                  className="hover:text-orange-400 font-semibold"
                >
                  Download App
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/wellbeing-hub/resources"
                  className="hover:text-orange-400"
                >
                  Mental Health Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/wellbeing-hub/support"
                  className="hover:text-orange-400"
                >
                  Support Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>hello@right2thriveuk.com</span>
              </li>
              {/* <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+44 123 456 7890</span>
              </li> */}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-300">
          <p>
            &copy; {new Date().getFullYear()} Right2Thrive UK. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
