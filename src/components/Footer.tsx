export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black py-12">
      <div className="mx-auto max-w-5xl px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <div>&copy; {new Date().getFullYear()} Aetheris Vision LLC. All rights reserved.</div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-center gap-4">
          <span>Veteran-Owned Small Business (VOSB)</span>
          <span className="hidden sm:inline text-white/10">|</span>
          <a
            href="mailto:contact@aetherisvision.com"
            className="hover:text-gray-300 transition"
          >
            contact@aetherisvision.com
          </a>
        </div>
      </div>
    </footer>
  );
}
