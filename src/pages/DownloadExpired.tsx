import { motion } from "framer-motion";
import { ShieldX, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const DownloadExpired = () => (
  <div className="min-h-screen bg-[#060d06] flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full text-center"
    >
      <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
        <ShieldX className="text-red-400" size={36} />
      </div>

      <h1 className="text-2xl font-bold text-white mb-2">Download Link Expired</h1>
      <p className="text-gray-400 mb-8">
        This download link has already been used or is no longer valid.
        Each link can only be used once for security purposes.
      </p>

      <div className="bg-[#0a1a0a] border border-emerald-500/10 rounded-xl p-5 mb-8 text-left">
        <h3 className="text-emerald-400 font-medium text-sm mb-3">Need a new download link?</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          Contact us and we'll generate a fresh download link for your license.
        </p>
        <a
          href="mailto:hello@gr8qm.com"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Mail size={14} /> hello@gr8qm.com
        </a>
      </div>

      <Link
        to="/devignfx"
        className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
      >
        Back to DevignFX
      </Link>
    </motion.div>
  </div>
);

export default DownloadExpired;
