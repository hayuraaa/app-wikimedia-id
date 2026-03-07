"use client";

import Link from "next/link";

const SECTIONS = [
  {
    num: "1",
    title: "Konten Yang Tersedia",
    content: `Anda mengakui bahwa Wikimedia Indonesia tidak membuat pernyataan atau jaminan apa pun tentang materi data dan informasi, seperti berkas data, teks, perangkat lunak komputer, kode, musik, berkas audio atau suara lain, foto, video, atau gambar lainnya (secara kolektif, "Konten") yang dapat Anda akses sebagai bagian dari, atau melalui penggunaan Anda, Layanan. Dalam keadaan apa pun Wikimedia Indonesia tidak bertanggung jawab atas Konten apa pun termasuk, namun tidak terbatas pada: Konten apa pun yang melanggar, kesalahan atau kelalaian apa pun dalam Konten, atau atas kerugian atau kerusakan apa pun yang terjadi sebagai akibat dari penggunaan Konten yang dipublikasikan, dikirim, ditautkan dari, atau dapat diakses melalui atau disediakan melalui Layanan.

Anda memahami bahwa dengan menggunakan Layanan, Anda mungkin akan menemukan Konten yang menyinggung, tidak senonoh, atau tidak menyenangkan.

Anda setuju bahwa Anda sepenuhnya bertanggung jawab untuk penggunaan kembali Konten yang tersedia melalui Layanan, termasuk memberikan atribusi yang tepat. Anda harus meninjau ketentuan lisensi yang berlaku sebelum Anda menggunakan Konten sehingga Anda tahu apa yang dapat dan tidak dapat Anda lakukan.

Lisensi: Konten yang dimiliki Wikimedia Indonesia menggunakan lisensi CC-BY 4.0 kecuali dinyatakan lain. Jika Anda menemukan konten melalui tautan di situs web kami, pastikan untuk memeriksa persyaratan lisensi sebelum menggunakannya. Lihat halaman Kebijakan CC untuk informasi lebih lanjut.`,
  },
  {
    num: "2",
    title: "Larangan",
    content: "",
    subsections: [
      {
        num: "2.1",
        title: "Melanggar hukum dan hak",
        content: `Anda tidak boleh (a) menggunakan konten dan layanan apa pun untuk tujuan ilegal apa pun atau melanggar hukum adat, nasional, atau internasional, (b) melanggar atau mendorong orang lain untuk melanggar hak atau kewajiban apa pun kepada pihak ketiga, termasuk dengan melanggar, menyalahgunakan, atau melanggar kekayaan intelektual, kerahasiaan, atau hak privasi.`,
      },
      {
        num: "2.2",
        title: "Permohonan",
        content: `Anda tidak boleh menggunakan konten, layanan, atau informasi apa pun yang disediakan melalui situs web untuk transmisi materi iklan atau promosi, termasuk surel sampah, spam, surat berantai, skema piramida, atau bentuk lain dari ajakan yang tidak diminta atau tidak diinginkan.`,
      },
      {
        num: "2.3",
        title: "Gangguan",
        content: `Anda tidak boleh menggunakan Layanan dengan cara apa pun yang dapat menonaktifkan, membebani, merusak, atau merusak Layanan, atau mengganggu penggunaan dan kesenangan pihak lain dari Layanan; termasuk dengan (a) mengunggah atau menyebarkan virus, adware, spyware, worm atau kode berbahaya lainnya, atau (b) mengganggu jaringan peralatan, atau server yang terhubung atau digunakan untuk menyediakan Layanan apa pun, atau melanggar segala peraturan, kebijakan, atau prosedur jaringan, peralatan, atau server apa pun.`,
      },
      {
        num: "2.4",
        title: "Akses tidak sah",
        content: `Anda tidak boleh berusaha mendapatkan akses tidak sah ke Layanan, atau sistem komputer atau jaringan yang terhubung ke Layanan, melalui peretasan penambangan kata sandi atau cara lain apa pun.`,
      },
    ],
  },
  {
    num: "3",
    title: "Tautan ke Situs Lainnya",
    content: `Layanan kami dapat menghadirkan tautan atau pranala ke situs web pihak ketiga atau ke layanan yang tidak dimiliki ataupun dikuasai oleh Wikimedia Indonesia.

Wikimedia Indonesia tidak memiliki kuasa atas dan tidak memiliki tanggungjawab akan konten, kebijakan privasi, maupun aktivitas dari situs web pihak ketiga manapun atau layanan lainnya. Anda menyadari dan menyetujui bahwa Wikimedia Indonesia tidak akan bertanggungjawab secara langsung ataupun tidak langsung atas segala kerusakan atau kehilangan yang disebabkan atau dicurigai disebabkan atau berhubungan dengan penggunaan konten, layanan, atau hal apapun yang tersedia melalui situs web dan layanan di luar Wikimedia Indonesia.`,
  },
  {
    num: "4",
    title: "Penolakan Jaminan",
    emphasis: true,
    content: `Sejauh diizinkan oleh undang-undang yang berlaku, Wikimedia Indonesia tidak membuat pernyataan atau jaminan dalam bentuk apapun tentang Layanan (termasuk semua konten yang tersedia melalui Layanan) baik secara tersurat, tersirat, formal, atau lainnya. Wikimedia Indonesia tidak menjamin bahwa fungsi Layanan tidak akan terganggu atau akan bebas dari kesalahan atau cacat apapun. Wikimedia Indonesia tidak memberikan jaminan bahwa Layanan yang diberikan bebas dari virus atau komponen berbahaya lainnya.`,
  },
  {
    num: "5",
    title: "Pembatasan Tanggung Jawab",
    emphasis: true,
    content: `Sejauh diizinkan oleh undang-undang yang berlaku, Wikimedia Indonesia tidak bertanggungjawab kepada Anda untuk segala bentuk kerugian baik secara langsung ataupun tidak langsung yang muncul dalam hubungannya dengan penggunaan Layanan ataupun penggunaan konten melalui Layanan.`,
  },
  {
    num: "6",
    title: "Ganti Rugi",
    emphasis: true,
    content: `Sejauh diizinkan oleh hukum, Anda setuju untuk mengganti kerugian dan membebaskan Wikimedia Indonesia, karyawan, pejabat, direktur, afiliasi, dan agen dari dan terhadap setiap dan semua klaim, kerugian, kerusakan, dan biaya, termasuk biaya pengacara yang wajar, yang dihasilkan secara langsung atau tidak langsung dari atau yang timbul dari (a) pelanggaran Anda terhadap Syarat Penggunaan, (b) penggunaan Anda atas Layanan ini, dan/atau (c) Konten yang Anda sediakan di Layanan.`,
  },
  {
    num: "7",
    title: "Kebijakan Privasi",
    content: `Wikimedia Indonesia berkomitmen untuk secara bertanggung jawab menangani informasi dan data yang kami kumpulkan melalui layanan kami sesuai dengan Kebijakan Privasi. Harap tinjau Kebijakan Privasi sehingga Anda tahu bagaimana kami mengumpulkan dan menggunakan informasi pribadi Anda.`,
  },
  {
    num: "8",
    title: "Kebijakan Merek Dagang",
    content: `Nama, logo, ikon, dan merek dagang Wikimedia Indonesia lainnya hanya dapat digunakan sesuai dengan Kebijakan Merek Dagang kami. Harap tinjau Kebijakan Merek Dagang sehingga Anda memahami bagaimana merek dagang Wikimedia Indonesia dapat digunakan.`,
  },
  {
    num: "9",
    title: "Keluhan Hak Cipta",
    content: `Wikimedia Indonesia menghormati hak cipta, dan kami melarang pengguna Layanan mengirimkan, mengunggah, mempublikasikan, atau mentransmisikan konten apa pun pada Layanan yang melanggar hak kepemilikan orang lain.

Untuk melaporkan konten yang diduga melanggar hak cipta yang terdapat di situs web yang dimiliki atau dikontrol oleh Wikimedia Indonesia, kirimkan keluhan Anda melalui surel ke: info@wikimedia.or.id.`,
  },
  {
    num: "10",
    title: "Penghentian Layanan",
    content: `Wikimedia Indonesia dapat memodifikasi atau menghentikan pengoperasian, atau akses ke semua atau sebagian dari Layanan kapan saja karena alasan apa pun. Selain itu, akses individu Anda, dan penggunaan layanan dapat diakhiri oleh Wikimedia Indonesia kapan saja dan karena alasan apa pun.

Oleh Anda: Jika Anda ingin mengakhiri perjanjian ini, Anda dapat segera berhenti mengakses atau berhenti menggunakan layanan kapan saja.

Keberlanjutan: Penolakan jaminan, pembatasan tanggung jawab, dan yurisdiksi serta ketentuan hukum yang berlaku akan tetap berlaku setelah pemberhentian. Lisensi tetap berlaku untuk konten Anda yang tidak terpengaruh oleh penghentian Ketentuan dan akan terus berlaku tunduk pada ketentuan lisensi yang berlaku.`,
  },
  {
    num: "11",
    title: "Jurisdiksi",
    content: `Segala Syarat Penggunaan ini akan diatur dan ditafsirkan sesuai dengan hukum yang berlaku di Indonesia, tanpa memperhatikan pertentangan ketentuan hukumnya. Segala persoalan legal hanya akan dilakukan dan/atau diselesaikan di pengadilan di Jakarta, Indonesia.`,
  },
  {
    num: "12",
    title: "Perubahan Syarat dan Ketentuan",
    content: `Dari waktu ke waktu, Wikimedia Indonesia dapat mengubah, menghapus, atau menambah Syarat Penggunaan, dan berhak untuk melakukannya dibawah kebijakan yang ditentukan sendiri. Perubahan Syarat Penggunaan akan diumumkan apabila ada yang diperbaharui dengan menunjukkan tanggal revisi.

Jika perubahan dirasakan penting, maka upaya yang wajar akan dilakukan untuk memperlihatkan perubahan penting tersebut dengan menonjol pada laman web yang relevan. Semua Persyaratan baru dan/atau yang direvisi berlaku segera dan berlaku untuk penggunaan Anda atas Layanan sejak tanggal tersebut. Apabila terjadi perubahan yang sangat penting yang dianggap mengubah kebijakan umum secara signifikan, maka akan diberikan pemberitahuan 30 hari sebelum Syarat Penggunaan yang baru efektif diberlakukan.

Penggunaan Layanan Anda yang berkelanjutan setelah Syarat Penggunaan yang baru dan/atau revisi efektif terjadi menunjukkan bahwa Anda telah membaca, memahami, dan menyetujui Syarat Penggunaan tersebut.`,
  },
  {
    num: "13",
    title: "Hubungi Kami",
    content: `Apabila Anda memiliki pertanyaan mengenai Syarat Penggunaan ini, silakan menghubungi kami melalui info@wikimedia.or.id.`,
  },
];

function renderContent(text: string) {
  return text.replace(
    /info@wikimedia\.or\.id/g,
    '<a href="mailto:info@wikimedia.or.id" style="color:#1e4d7b;font-weight:600;text-underline-offset:2px;">info@wikimedia.or.id</a>'
  );
}

export default function SyaratPenggunaanPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: "40px 24px 36px", position: "relative", overflow: "hidden", backgroundImage: "url('/banner/Mosaik_Budaya_1.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,20,45,0.92) 0%, rgba(10,30,65,0.84) 40%, rgba(15,40,80,0.76) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,26,42,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
            <Link href="/" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontFamily: "var(--font-sans)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
              Beranda
            </Link>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-sans)" }}>/</span>
            <span style={{ fontSize: "11px", color: "#e05070", fontFamily: "var(--font-sans)" }}>Syarat Penggunaan</span>
          </div>
          <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#e05070", fontFamily: "var(--font-sans)" }}>◆ Legal</span>
          <h1 style={{ fontSize: "clamp(1.7rem, 3vw, 2.4rem)", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", margin: "6px 0 10px", lineHeight: "1.2" }}>
            Syarat Penggunaan
          </h1>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans)", margin: 0 }}>
            Terakhir diperbarui: <strong style={{ color: "rgba(255,255,255,0.65)" }}>19 November 2018</strong>
          </p>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8f7f5", padding: "36px 24px 64px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="syarat-layout" style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "40px", alignItems: "start" }}>

            {/* ── TOC Sidebar ── */}
            <nav style={{ position: "sticky", top: "88px" }}>
              <p style={{ fontSize: "10px", fontWeight: "700", color: "#9a9690", fontFamily: "var(--font-sans)", letterSpacing: "0.1em", textTransform: "uppercase" as const, margin: "0 0 10px" }}>Daftar Isi</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {SECTIONS.map((s) => (
                  <a key={s.num} href={`#section-${s.num}`}
                    style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "7px 10px", borderRadius: "3px", textDecoration: "none", transition: "background 0.15s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#ede9e4"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}>
                    <span style={{ fontSize: "10px", fontWeight: "700", color: "#8b1a2a", fontFamily: "var(--font-sans)", flexShrink: 0, marginTop: "1px", minWidth: "18px" }}>{s.num}.</span>
                    <span style={{ fontSize: "12px", color: "#5c5a57", fontFamily: "var(--font-sans)", lineHeight: "1.4" }}>{s.title}</span>
                  </a>
                ))}
              </div>
            </nav>

            {/* ── Main Content ── */}
            <div style={{ display: "flex", flexDirection: "column" }}>

              {/* Intro box */}
              <div style={{ padding: "20px 24px", backgroundColor: "#fff", border: "1px solid #e5e2dd", borderLeft: "4px solid #1e4d7b", borderRadius: "4px", marginBottom: "12px" }}>
                <p style={{ fontSize: "13px", color: "#3a3a3a", lineHeight: "1.85", fontFamily: "var(--font-sans)", margin: "0 0 10px" }}>
                  Harap membaca dengan seksama Syarat Penggunaan (atau "Syarat", "Syarat dan Ketentuan") sebelum menggunakan situs web <strong>wikimedia.or.id</strong> ("Layanan") yang dioperasikan oleh Wikimedia Indonesia.
                </p>
                <p style={{ fontSize: "13px", color: "#3a3a3a", lineHeight: "1.85", fontFamily: "var(--font-sans)", margin: "0 0 10px" }}>
                  Dengan mengakses atau menggunakan Layanan, Anda mengakui bahwa Anda telah membaca, memahami, dan menyetujui untuk mematuhi Syarat Penggunaan ini. Syarat ini berlaku untuk semua pengunjung, pengguna, dan siapapun yang mengakses atau menggunakan Layanan.
                </p>
                <p style={{ fontSize: "13px", color: "#5c5a57", lineHeight: "1.85", fontFamily: "var(--font-sans)", margin: 0, fontStyle: "italic" }}>
                  Apabila Anda tidak menyetujui Syarat Penggunaan, Anda tidak diizinkan untuk menggunakan Layanan ini.
                </p>
              </div>

              {/* Sections */}
              {SECTIONS.map((s, i) => (
                <div
                  key={s.num}
                  id={`section-${s.num}`}
                  style={{
                    padding: "28px 32px",
                    backgroundColor: "#fff",
                    borderRadius: i === 0 ? "4px 4px 0 0" : i === SECTIONS.length - 1 ? "0 0 4px 4px" : "0",
                    borderTop: "1px solid #e5e2dd",
                    borderLeft: "1px solid #e5e2dd",
                    borderRight: "1px solid #e5e2dd",
                    borderBottom: i === SECTIONS.length - 1 ? "1px solid #e5e2dd" : "none",
                    scrollMarginTop: "100px",
                  }}
                >
                  {/* Header */}
                  <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "16px" }}>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#fff", backgroundColor: "#8b1a2a", borderRadius: "3px", padding: "3px 8px", fontFamily: "var(--font-sans)", flexShrink: 0, marginTop: "2px" }}>
                      {s.num}
                    </span>
                    <div>
                      <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", margin: 0, lineHeight: "1.4" }}>{s.title}</h2>
                      {(s as any).emphasis && (
                        <span style={{ fontSize: "10px", color: "#9a9690", fontFamily: "var(--font-sans)", fontStyle: "italic" }}>Dicetak tebal untuk menambah penekanan</span>
                      )}
                    </div>
                  </div>

                  {/* Subsections */}
                  {(s as any).subsections && (
                    <div style={{ paddingLeft: "36px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {(s as any).subsections.map((sub: any) => (
                        <div key={sub.num} style={{ padding: "14px 18px", backgroundColor: "#f8f7f5", border: "1px solid #ede9e4", borderLeft: "3px solid #8b1a2a", borderRadius: "3px" }}>
                          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                            <span style={{ fontSize: "10px", fontWeight: "700", color: "#8b1a2a", fontFamily: "var(--font-sans)", flexShrink: 0 }}>{sub.num}</span>
                            <h3 style={{ fontSize: "13px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-sans)", margin: 0 }}>{sub.title}</h3>
                          </div>
                          <p style={{ fontSize: "13px", color: "#3a3a3a", lineHeight: "1.85", fontFamily: "var(--font-sans)", margin: 0, paddingLeft: "22px" }}>{sub.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Content */}
                  {s.content && (
                    <div style={{ paddingLeft: "36px" }}>
                      {s.content.split("\n\n").map((para, j) => (
                        <p key={j} style={{ fontSize: "14px", color: "#3a3a3a", lineHeight: "1.85", fontFamily: "var(--font-sans)", margin: j > 0 ? "12px 0 0" : "0" }}
                          dangerouslySetInnerHTML={{ __html: renderContent(para) }} />
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Footer */}
              <div style={{ marginTop: "16px", padding: "16px 20px", backgroundColor: "#fff", border: "1px solid #e5e2dd", borderLeft: "4px solid #8b1a2a", borderRadius: "4px", display: "flex", alignItems: "center", gap: "12px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b1a2a" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <p style={{ fontSize: "13px", color: "#5c5a57", fontFamily: "var(--font-sans)", margin: 0 }}>
                  Terakhir diperbarui: <strong style={{ color: "#0d0d0d" }}>19 November 2018</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .syarat-layout { grid-template-columns: 1fr !important; }
          .syarat-layout > nav { position: static !important; display: none; }
        }
      `}</style>
    </>
  );
}