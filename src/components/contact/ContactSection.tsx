import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  MessageCircle,
  MapPin,
  MessageSquare,
  Clock,
  Send,
  Sparkles,
  ArrowUp,
  RotateCw,
  Heart,
  Camera,
  Lock,
} from "lucide-react";
import { profileData } from "../../data/bonkuData";
import { ContactSauceCanvas } from "./ContactSauceCanvas";

const inquiryTopics = [
  {
    id: "abon",
    label: "Pesan Abon Ayam",
    subject: "Saya mau pesan Abon Ayam Pouch 100g",
    message:
      "Halo BonKu! Saya mau pesan Abon Ayam Pouch 100g. Berapa jumlah yang tersedia?",
  },
  {
    id: "roti",
    label: "Pesan Roti Isi Abon",
    subject: "Saya mau pesan Roti Isi Abon",
    message:
      "Halo BonKu! Saya mau pesan Roti Isi Abon. Berapa pcs yang tersedia?",
  },
  {
    id: "grosir",
    label: "Pesanan Banyak / Reseller",
    subject: "Tanya pesanan jumlah banyak",
    message:
      "Halo BonKu! Saya mau tanya harga untuk pesanan jumlah banyak / reseller. Boleh info skema promonya?",
  },
];

interface ContactSectionProps {
  onOpenAdmin?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenAdmin }) => {
  const [selectedTopic, setSelectedTopic] = useState(inquiryTopics[0]);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [submarineClicks, setSubmarineClicks] = useState<number>(0);
  const [showHeart, setShowHeart] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setCurrentTime(new Intl.DateTimeFormat("id-ID", options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmarineClick = () => {
    setSubmarineClicks((prev) => prev + 1);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1200);
  };

  const orderLink = profileData.contact.orderFormUrl
    ? profileData.contact.orderFormUrl
    : `https://wa.me/${profileData.contact.whatsapp.replace(/\D/g, "").replace(/^0/, "62")}?text=${encodeURIComponent(
        selectedTopic.message,
      )}`;

  return (
    <section
      id="contact"
      className="relative z-20 -mt-1 w-full bg-[#8a3410] select-none py-24 overflow-hidden text-[#2a1710]"
    >
      <ContactSauceCanvas />

      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
        className="absolute top-12 sm:top-20 right-4 sm:right-24 z-30 cursor-pointer group scale-75 sm:scale-100 origin-top-right"
        onClick={handleSubmarineClick}
        title="Klik kapal selam!"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [-4, 4, -4],
          }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
        >
          <motion.div
            animate={{
              rotateY: submarineClicks * 360,
              scale: showHeart ? 1.2 : 1,
            }}
            transition={{ duration: 0.7, type: "spring", stiffness: 200 }}
            className="relative"
          >
            <svg
              width="68"
              height="68"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-xl"
            >
              <path
                d="M26 12 L26 20 L32 20"
                stroke="#2a1710"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <ellipse
                cx="32"
                cy="34"
                rx="24"
                ry="14"
                fill="#fde047"
                stroke="#2a1710"
                strokeWidth="2.5"
              />
              <path
                d="M24 20 C24 17 38 17 38 20 L38 24 L24 24 Z"
                fill="#facc15"
                stroke="#2a1710"
                strokeWidth="2"
              />
              <circle
                cx="24"
                cy="34"
                r="4"
                fill="#f6a83c"
                stroke="#2a1710"
                strokeWidth="1.8"
              />
              <circle
                cx="34"
                cy="34"
                r="4"
                fill="#f6a83c"
                stroke="#2a1710"
                strokeWidth="1.8"
              />
              <circle
                cx="44"
                cy="34"
                r="4"
                fill="#f6a83c"
                stroke="#2a1710"
                strokeWidth="1.8"
              />
              <path
                d="M7 28 L11 34 L7 40"
                stroke="#2a1710"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>

            <AnimatePresence>
              {showHeart && (
                <motion.div
                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                  animate={{ opacity: 1, y: -28, scale: 1.2 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-rose-400 pointer-events-none"
                >
                  <Heart className="w-5 h-5 fill-rose-400 stroke-rose-600" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-12 space-y-6 sm:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.55,
            type: "spring",
            stiffness: 220,
            damping: 24,
          }}
          className="p-5 sm:p-12 rounded-3xl sm:rounded-[36px] bg-[#fffdf5] border-2 sm:border-3 border-[#2a1710] shadow-[6px_6px_0px_#2a1710] sm:shadow-[10px_10px_0px_#2a1710] space-y-5 sm:space-y-8"
        >
          {/* header */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
              <div className="flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-[#fde047] text-[#2a1710] text-xs font-mono font-black border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710] sm:shadow-[3px_3px_0px_#2a1710] w-fit">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>KONTAK</span>
              </div>

              <div className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl bg-[#dcfce7] border-2 border-[#2a1710] text-[10px] sm:text-xs font-mono font-black text-[#15803d] shadow-[2px_2px_0px_#2a1710]">
                STATUS: OPEN PO
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#2a1710] tracking-tight leading-[1.08]">
                Pesan BonKu Sekarang
              </h2>
              <p className="text-xs sm:text-base text-[#334155] font-medium leading-relaxed max-w-2xl">
                Pilih produk yang mau dipesan, lalu langsung kirim pesanan lewat
                WhatsApp. Untuk pesanan dalam jumlah banyak, tanyakan dulu promo
                yang tersedia.
              </p>
            </div>
          </div>

          {/* bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 items-stretch">
            {/* email and topic station */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="md:col-span-7 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#fdf3e3] border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] sm:shadow-[4px_4px_0px_#2a1710] flex flex-col justify-between space-y-4 sm:space-y-5"
            >
              <div className="space-y-2.5 sm:space-y-3">
                <div className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#475569]">
                  Pilih Produk yang Mau Dipesan
                </div>

                {/* topic buttons */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {inquiryTopics.map((topic) => {
                    const isSelected = selectedTopic.id === topic.id;
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => setSelectedTopic(topic)}
                        className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-mono font-bold border-2 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#b2430f] text-white border-[#2a1710] shadow-[2px_2px_0px_#2a1710]"
                            : "bg-[#fffdf5] text-[#2a1710] border-[#2a1710] shadow-[1.5px_1.5px_0px_#2a1710] hover:bg-[#fde047]"
                        }`}
                      >
                        {topic.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* tombol pemesanan */}
                            <div className="space-y-2 pt-2 border-t-2 border-[#2a1710]/10">
                              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 w-full">
                                <a
                                  href={orderLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#4ade80] hover:bg-[#22c55e] text-[#2a1710] font-mono font-black text-xs sm:text-sm transition-all cursor-pointer border-2 border-[#2a1710] shadow-[2.5px_2.5px_0px_#2a1710] sm:shadow-[3px_3px_0px_#2a1710] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#2a1710] flex-1 whitespace-nowrap"
                                >
                                  <Send className="w-4 h-4 shrink-0" />
                                  <span>
                                    {profileData.contact.orderFormUrl
                                      ? "Isi Form Pemesanan"
                                      : "Pesan via WhatsApp"}
                                  </span>
                                </a>

                                <a
                                  href={profileData.contact.whatsappLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl bg-[#fffdf5] hover:bg-[#fde047] text-[#2a1710] font-mono font-bold text-xs sm:text-sm transition-all cursor-pointer border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710] flex-1 whitespace-nowrap"
                                  title="Chat WhatsApp BonKu"
                                >
                                  <MessageCircle className="w-4 h-4 text-[#15803d] shrink-0" />
                                  <span>{profileData.contact.whatsapp}</span>
                                </a>
                              </div>
                            </div>
            </motion.div>

            {/* flip card tile for status and secret note */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.22 }}
              style={{ perspective: "800px" }}
              className="md:col-span-5 min-h-55"
            >
              <motion.div
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{
                  duration: 0.6,
                  type: "spring",
                  stiffness: 180,
                  damping: 20,
                }}
                className="relative w-full h-full"
              >
                {/* status, clock and socials */}
                <div
                  style={{ backfaceVisibility: "hidden" }}
                  className="w-full h-full p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#fdf3e3] border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] sm:shadow-[4px_4px_0px_#2a1710] flex flex-col justify-between space-y-3.5 sm:space-y-4"
                >
                  <div className="space-y-2.5 sm:space-y-3">
                    <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-[#fffdf5] border-2 border-[#2a1710]">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#334155]">
                        <Clock className="w-4 h-4 text-[#b2430f]" />
                        <span>Waktu Lokal (WIB)</span>
                      </div>
                      <span className="text-sm font-mono font-black text-[#2a1710] tabular-nums">
                        {currentTime || "16:00:00"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-[#334155] px-1">
                      <MapPin className="w-4 h-4 text-[#ef4444] shrink-0" />
                      <span>{profileData.contact.location}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t-2 border-[#2a1710]/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#475569]">
                        Sosial &amp; Info
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsFlipped(true)}
                        className="inline-flex items-center gap-1 py-1.5 text-[10px] sm:text-[11px] font-mono font-bold text-[#b2430f] hover:text-[#2a1710] cursor-pointer"
                      >
                        <span>Pesan Rahasia</span>
                        <RotateCw className="w-3 h-3" />
                      </button>
                    </div>

                    {profileData.contact.instagram && (
                    <a
                                          href={profileData.contact.instagram}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#fffdf5] hover:bg-[#fde047] text-[#2a1710] font-mono font-bold text-[11px] sm:text-xs transition-all border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#2a1710] flex items-center justify-between group"
                                        >
                                          <div className="flex items-center gap-1.5">
                                            <Camera className="w-3.5 h-3.5 text-[#db2777]" />
                                            <span>Instagram</span>
                                          </div>
                                          <ExternalLink className="w-3 h-3 text-[#475569] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </a>
                    )}
                  </div>
                </div>

                {/* kartu pesan rahasia */}
                <div
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                  className="absolute inset-0 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#fde047] border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] sm:shadow-[4px_4px_0px_#2a1710] flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-black text-[#2a1710] uppercase flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#b2430f]" />
                        <span>Pesan Rahasia dari Dapur BonKu</span>
                      </span>
                    </div>
                    <p className="text-xs font-medium text-[#1e293b] leading-relaxed">
                      Terima kasih sudah mampir ke halaman BonKu! Abon ini
                      dimasak sendiri di rumah dengan bumbu rempah alami, tanpa
                      pengawet sintetis berbahaya. Kalau cocok, ceritakan ke
                      teman sekelas — mulut ke mulut itu promosi paling ampuh
                      buat UMKM mahasiswa.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsFlipped(false)}
                    className="w-full py-2 px-3 rounded-xl bg-[#fffdf5] hover:bg-[#fdf3e3] text-[#2a1710] text-xs font-mono font-black border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Kembali ke Info Pesanan</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* footer dock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="p-4 sm:p-6 rounded-2xl sm:rounded-[28px] bg-[#fffdf5] border-2 sm:border-3 border-[#2a1710] shadow-[4px_4px_0px_#2a1710] sm:shadow-[6px_6px_0px_#2a1710] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[11px] sm:text-xs font-mono font-bold text-[#334155]"
        >
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-[#2a1710] text-center sm:text-left">
            <div className="flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f59e0b] shrink-0" />
              <span>
                &copy; {new Date().getFullYear()} {profileData.name}
              </span>
              <span className="hidden sm:inline text-[#475569]">•</span>
            </div>
            <span className="text-[10px] sm:text-xs text-[#475569] sm:text-[#2a1710] font-normal sm:font-bold">
              Abon Ayam Rumahan • UMKM Mahasiswa
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="px-3 py-1.5 rounded-xl bg-[#faeee0] hover:bg-[#fde047] text-[#2a1710] border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710] transition-all cursor-pointer flex items-center justify-center gap-1.5 font-mono font-bold text-xs"
              title="Akses Dashboard Pengelola BonKu"
            >
              <Lock className="w-3.5 h-3.5 text-[#b2430f]" />
              <span>Area Admin</span>
            </button>
            <button
              type="button"
              onClick={scrollToTop}
              className="px-4 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-[#fdf3e3] hover:bg-[#fde047] text-[#2a1710] border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710] transition-all cursor-pointer flex items-center justify-center gap-1.5 font-mono font-bold text-xs"
            >
              <span>Ke Atas</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
