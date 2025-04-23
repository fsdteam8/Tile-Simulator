import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react"
import Image from "next/image"
import Hideon from "../../../../provider/Hideon"

export default function Footer() {
  return (
    <Hideon routes={["/admin-dashboard"]}>
    <footer className="bg-black text-white pt-10 md:pt-12 lg:pt-14 xl:pt-16 2xl:pt-20 pb-[60px] md:pb-[90px] lg:pb-[120px] xl:pb-[150px] 2xl:pb-[175px]">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-[80px] lg:gap-[120px] xl:gap-[160px] 2xl:gap-[200px]">
          {/* Left Column */}
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <div className="">
              <Image src="/assets/logo.png" alt="logo" width={48} height={48} />
            </div>
            <p className=" text-gray-300">
              We&apos;re a cement tile company with a passion for color, stocking hundreds of cement tiles at our warehouse 
              in New Jersey with fast shipping nationwide! Let&apos;s help you create a space you&apos;ll love!
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="p-2 rounded-full border border-white hover:bg-white hover:text-black transition-colors"
              >
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="p-2 rounded-full border border-white hover:bg-white hover:text-black transition-colors"
              >
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="p-2 rounded-full border border-white hover:bg-white hover:text-black transition-colors"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="p-2 rounded-full border border-white hover:bg-white hover:text-black transition-colors"
              >
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-2 lg:col-span-1 space-y-6">
            <h3 className="text-2xl font-bold">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-1"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div>
                  <p>18000 Commerce Parkway</p>
                  <p>Mt Laurel, NJ 08054</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <svg
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
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <p>856-988-1802</p>
              </div>
              <div className="flex items-center space-x-3">
                <svg
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
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <p>olesya@lilitile.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </Hideon>
  )
}

