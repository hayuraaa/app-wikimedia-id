"use client";

import Link from "next/link";

const SECTIONS = [
  {
    num: "1",
    title: "Pembukaan",
    content: `Kebijakan privasi ini menjelaskan pengumpulan, penggunaan, pemrosesan, pengalihan, dan pengungkapan informasi pribadi oleh situs Wikimedia Indonesia.

Kecuali dinyatakan lain pada situs web atau layanan yang diselenggarakan oleh Wikimedia Indonesia, Kebijakan privasi ini berlaku untuk penggunaan Anda atas semua konten dalam situs web yang dijalankan Wikimedia Indonesia. Kebijakan privasi ini juga berlaku untuk semua produk, informasi, dan layanan yang disediakan melalui situs web.

Dengan mengakses atau menggunakan salah satu layanan, Anda menerima dan menyetujui praktik yang dijelaskan dalam kebijakan privasi ini.`,
  },
  {
    num: "2",
    title: "Prinsip Kami",
    content: `Wikimedia Indonesia telah merancang kebijakan ini untuk konsisten dengan prinsip-prinsip berikut:

Kebijakan privasi harus dapat dibaca dan mudah ditemukan. Pengumpulan, penyimpanan, dan pemrosesan data harus disederhanakan semaksimal mungkin untuk meningkatkan keamanan, memastikan konsistensi, dan membuat praktik mudah bagi pengguna untuk dipahami. Praktik data harus selalu memenuhi harapan pengguna yang wajar.`,
  },
  {
    num: "3",
    title: "Informasi Pribadi",
    content: `Dalam kebijakan ini, "informasi pribadi" berarti informasi yang memungkinkan seseorang untuk mengidentifikasi Anda, termasuk nama Anda, alamat surel, alamat IP, atau informasi lain yang membuat seseorang dapat menyimpulkan identitas Anda.

Wikimedia Indonesia mengumpulkan dan menggunakan informasi pribadi dengan cara-cara berikut:

Analisis situs web untuk pelaporan: Saat Anda mengunjungi situs web kami dan menggunakan layanan kami, Wikimedia Indonesia mengumpulkan beberapa informasi tentang aktivitas Anda melalui alat seperti Google Analytics. Jenis informasi yang kami kumpulkan berfokus pada informasi umum seperti negara atau kota tempat Anda berada, halaman yang dikunjungi, waktu yang dihabiskan di halaman, peta panas aktivitas pengunjung di situs, informasi tentang peramban yang Anda gunakan, dll.

Perhatikan bahwa Anda dapat mempelajari tentang praktik Google sehubungan dengan layanan analitiknya dan cara menyisihnya dengan mengunduh tambahan Google Analytics, tersedia di https://tools.google.com/dlpage/gaoptout.

Informasi dari Cookie: Kami dan penyedia layanan kami dapat mengumpulkan informasi menggunakan cookie atau teknologi serupa. Cookie adalah potongan informasi yang disimpan oleh browser Anda di cakram keras atau memori komputer Anda. Cookie dapat memungkinkan kami mempersonalisasi pengalaman Anda di situs web, mempertahankan sesi terus-menerus, secara pasif mengumpulkan informasi demografis tentang komputer Anda, dan kegiatan lainnya.

Analisis surel: Ketika Anda menerima komunikasi dari Wikimedia Indonesia setelah mendaftar untuk buletin atau nawala, kami menggunakan analitik untuk melacak apakah Anda membuka surat, mengeklik tautan, atau tidak berinteraksi dengan apa yang kami kirim. Anda dapat memilih keluar dari pelacakan ini dengan mengirimkan surel ke info@wikimedia.or.id.

Informasi lain yang disediakan secara sukarela: Ketika Anda memberikan umpan balik atau menyerahkan informasi pribadi ke Wikimedia Indonesia, kami akan mengumpulkan informasi yang diberikan sesuai dengan kepentingannya yang sah.`,
  },
  {
    num: "4",
    title: "Penyimpanan Informasi Pribadi",
    content: `Sebagian besar informasi pribadi yang dikumpulkan dan digunakan sebagaimana dijelaskan dalam Bagian 3 di atas dikumpulkan dan disimpan dalam basis data pusat yang disediakan oleh penyedia layanan pihak ketiga. Wikimedia Indonesia mengumpulkan data ini sesuai dengan kepentingannya yang sah dalam memiliki informasi yang disimpan di satu lokasi untuk meminimalkan kompleksitas, meningkatkan konsistensi dalam praktik internal, lebih memahami komunitas pendukung, pegawai, dan sukarelawan, dan meningkatkan keamanan data.`,
  },
  {
    num: "5",
    title: "Pengungkapan Informasi Pribadi Anda",
    content: `Wikimedia Indonesia menghargai privasi Anda dan berkomitmen melindungi data pribadi Anda. Wikimedia Indonesia tidak mengungkapkan informasi pribadi kepada pihak ketiga kecuali sebagaimana ditentukan di tempat lain dalam kebijakan ini dan dalam contoh berikut: Wikimedia Indonesia dapat berbagi informasi pribadi dengan kontraktor dan penyedia layanan kami untuk melakukan kegiatan yang dijelaskan dalam Bagian 3.

Kami dapat mengungkapkan informasi pribadi Anda kepada pihak ketiga dengan iktikad baik bahwa pengungkapan tersebut diperlukan untuk (a) mengambil tindakan terkait dugaan kegiatan ilegal; (b) menegakkan atau menerapkan kebijakan privasi ini; (c) menegakkan kode etik dan kebijakan yang terkandung dan dimasukkan di dalamnya; atau (d) mematuhi proses hukum, seperti surat perintah penggeledahan, panggilan pengadilan, undang-undang, atau perintah pengadilan.`,
  },
  {
    num: "6",
    title: "Keamanan Informasi Pribadi Anda",
    content: `Wikimedia Indonesia telah menerapkan tindakan-tindakan untuk menjamin keamanan fisik, teknis, dan pengaturan yang wajar terkait dengan informasi pribadi terhadap penghancuran yang tidak disengaja atau melanggar hukum, atau kehilangan yang tidak disengaja, perubahan, pengungkapan atau akses yang tidak sah, sesuai dengan hukum yang berlaku.

Namun, tidak ada situs web yang dapat sepenuhnya menghilangkan risiko keamanan. Pihak ketiga dapat menghindari tindakan keamanan kami untuk memotong atau mengakses transmisi atau komunikasi pribadi secara melanggar hukum. Jika ada pelanggaran data yang terjadi, kami akan memposting pemberitahuan yang cukup menonjol ke situs web dan mematuhi semua persyaratan privasi data yang berlaku lainnya.`,
  },
  {
    num: "7",
    title: "Penyedia Layanan Pihak Ketiga",
    content: `Wikimedia Indonesia menggunakan penyedia layanan pihak ketiga sehubungan dengan Layanan, termasuk layanan hosting situs web, manajemen basis data, dan berbagai hal lain. Beberapa dari penyedia layanan ini dapat menempatkan sesi cookie di komputer Anda, dan mereka dapat mengumpulkan dan menyimpan informasi pribadi Anda atas nama kami sesuai dengan praktik dan tujuan data yang dijelaskan di atas dalam Bagian 3.`,
  },
  {
    num: "8",
    title: "Situs Pihak Ketiga",
    content: `Layanan dapat menyediakan tautan ke berbagai situs web pihak ketiga. Anda harus berkonsultasi dengan kebijakan privasi masing-masing dari situs web pihak ketiga ini. Kebijakan privasi ini tidak berlaku untuk aktivitas di situs web pihak ketiga dan kami tidak dapat mengontrol aktivitas yang terjadi di situs web lainnya.`,
  },
  {
    num: "9",
    title: "Mentransfer Data ke Negara Lain",
    content: `Jika Anda mengakses atau menggunakan Layanan di wilayah dengan undang-undang yang mengatur pengumpulan, pemrosesan, transfer, dan penggunaan data, harap perhatikan bahwa ketika kami menggunakan dan membagikan data Anda sebagaimana ditentukan dalam kebijakan ini, kami dapat mentransfer informasi Anda ke penerima di negara selain dari negara tempat informasi dikumpulkan. Negara-negara tersebut mungkin tidak memiliki undang-undang perlindungan data yang sama dengan negara tempat Anda pertama kali memberikan informasi.`,
  },
  {
    num: "10",
    title: "Perubahan Kebijakan Privasi ini",
    content: `Kami terkadang memperbarui kebijakan privasi ini. Ketika kami melakukannya, kami akan memberi Anda pemberitahuan tentang pembaruan tersebut minimal melalui pemberitahuan yang cukup menonjol di situs web dan layanan, dan akan merevisi tanggal efektif. Kami mendorong Anda untuk secara berkala meninjau kebijakan privasi ini untuk tetap mendapat informasi tentang bagaimana kami melindungi, menggunakan, memproses, dan mentransfer informasi pribadi yang kami kumpulkan.`,
  },
];

export default function KebijakanPrivasiPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: "40px 24px 36px", position: "relative", overflow: "hidden", backgroundImage: "url('/banner/Mosaik_Budaya_1.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,20,45,0.92) 0%, rgba(10,30,65,0.84) 40%, rgba(15,40,80,0.76) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "radial-gradient(circle, rgba(12,87,168,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
            <Link href="/" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontFamily: "var(--font-sans)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
              Beranda
            </Link>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-sans)" }}>/</span>
            <span style={{ fontSize: "11px", color: "#3b8ed4", fontFamily: "var(--font-sans)" }}>Kebijakan Privasi</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.7rem, 3vw, 2.4rem)", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", margin: "6px 0 10px", lineHeight: "1.2" }}>
            Kebijakan Privasi
          </h1>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans)", margin: 0, lineHeight: "1.6" }}>
            Berlaku efektif mulai <strong style={{ color: "rgba(255,255,255,0.65)" }}>19 November 2018</strong>
          </p>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8f7f5", padding: "36px 24px 64px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="privasi-layout" style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "40px", alignItems: "start" }}>

            {/* ── TOC Sidebar ── */}
            <nav style={{ position: "sticky", top: "88px" }}>
              <p style={{ fontSize: "10px", fontWeight: "700", color: "#6b6966", fontFamily: "var(--font-sans)", letterSpacing: "0.1em", textTransform: "uppercase" as const, margin: "0 0 10px" }}>Daftar Isi</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {SECTIONS.map((s) => (
                  <a key={s.num} href={`#section-${s.num}`}
                    style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "7px 10px", borderRadius: "3px", textDecoration: "none", transition: "background 0.15s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#ede9e4"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}>
                    <span style={{ fontSize: "10px", fontWeight: "700", color: "#0C57A8", fontFamily: "var(--font-sans)", flexShrink: 0, marginTop: "1px", minWidth: "14px" }}>{s.num}.</span>
                    <span style={{ fontSize: "12px", color: "#5c5a57", fontFamily: "var(--font-sans)", lineHeight: "1.4" }}>{s.title}</span>
                  </a>
                ))}
              </div>
            </nav>

            {/* ── Main Content ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
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
                  <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "14px" }}>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#fff", backgroundColor: "#0C57A8", borderRadius: "3px", padding: "3px 8px", fontFamily: "var(--font-sans)", flexShrink: 0, marginTop: "2px" }}>
                      {s.num}
                    </span>
                    <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", margin: 0, lineHeight: "1.4" }}>
                      {s.title}
                    </h2>
                  </div>
                  <div style={{ paddingLeft: "36px" }}>
                    {s.content.split("\n\n").map((para, j) => (
                      <p key={j} style={{ fontSize: "14px", color: "#3a3a3a", lineHeight: "1.85", fontFamily: "var(--font-sans)", margin: j > 0 ? "12px 0 0" : "0" }}
                        dangerouslySetInnerHTML={{
                          __html: para
                            .replace(/https:\/\/tools\.google\.com\/dlpage\/gaoptout/g, '<a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style="color:#1e4d7b;font-weight:600;text-underline-offset:2px;">https://tools.google.com/dlpage/gaoptout</a>')
                            .replace(/info@wikimedia\.or\.id/g, '<a href="mailto:info@wikimedia.or.id" style="color:#1e4d7b;font-weight:600;text-underline-offset:2px;">info@wikimedia.or.id</a>')
                        }}
                      />
                    ))}
                  </div>
                  {i < SECTIONS.length - 1 && (
                    <div style={{ marginTop: "16px", paddingLeft: "36px", borderTop: "1px solid #f0eeec", paddingTop: "0" }} />
                  )}
                </div>
              ))}

              {/* Effective date footer */}
              <div style={{ marginTop: "16px", padding: "16px 20px", backgroundColor: "#fff", border: "1px solid #e5e2dd", borderLeft: "4px solid #0C57A8", borderRadius: "4px", display: "flex", alignItems: "center", gap: "12px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0C57A8" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <p style={{ fontSize: "13px", color: "#5c5a57", fontFamily: "var(--font-sans)", margin: 0 }}>
                  Kebijakan privasi ini berlaku efektif mulai <strong style={{ color: "#0d0d0d" }}>19 November 2018</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .privasi-layout { grid-template-columns: 1fr !important; }
          .privasi-layout > nav { position: static !important; display: none; }
        }
      `}</style>
    </>
  );
}