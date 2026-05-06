"use client";

import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: "wikipedia",
    question: "Anda suka menulis dan membaca sumber terpercaya?",
    body: "Menulis bukan sekadar menyusun kata dan kalimat, tetapi juga membangun kepercayaan pembaca melalui sumber-sumber yang terpercaya. Informasi dari berbagai sumber dirangkai menjadi sebuah kesatuan artikel ensiklopedia yang koheren, deskriptif, faktual, dan netral. Jika Anda suka membebaskan pengetahuan dengan cara ini, Wikipedia, ensiklopedia bebas dari Wikimedia, adalah proyek yang cocok untuk Anda!",
    project: "Wikipedia",
    desc: "Menulis dan menyunting artikel ensiklopedia. Tersedia dalam bahasa Indonesia dan sejumlah bahasa daerah.",
    url: "https://id.wikipedia.org",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Wikipedia_logo_v3.svg",
    color: "#3366cc",
    colorLight: "rgba(51,102,204,0.08)",
    colorBorder: "rgba(51,102,204,0.2)",
  },
  {
    id: "wiktionary",
    question: "Anda gemar menjelajahi kekayaan bahasa melalui kamus?",
    body: "Bahasa menunjukkan bangsa—begitulah kata pepatah. Bahasa adalah cerminan budaya dan jati diri suatu masyarakat. Dengan menggali makna dari kata, frasa, dan idiom, Anda turut menjaga keberlangsungan suatu bahasa agar terus dipelajari dan dituturkan. Proyek kamus bebas Wiktionary cocok untuk Anda! Terlebih, Indonesia sebagai negara yang memiliki ratusan bahasa daerah menyediakan ladang leksikografi yang luas untuk dieksplorasi melalui Wiktionary.",
    project: "Wiktionary",
    desc: "Mendokumentasikan bahasa melalui kamus.",
    url: "https://id.wiktionary.org",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Wiktionary-logo.svg",
    color: "#00aabb",
    colorLight: "rgba(0,170,187,0.08)",
    colorBorder: "rgba(0,170,187,0.2)",
  },
  {
    id: "wikibooks",
    question: "Anda ingin menulis karangan yang lebih bebas?",
    body: "Menulis untuk ensiklopedia atau kamus memiliki banyak aturan dan batasan yang cukup kaku, beberapa orang mungkin lebih suka format tulisan yang lebih luwes seperti menulis sebuah buku. Buku ibarat jendela ilmu yang membuka wawasan luas. Ketika buku dapat diakses secara bebas, semakin banyak orang yang bisa menikmati berbagai bacaan tanpa hambatan. Proyek Wikibooks cocok untuk Anda yang gemar menulis buku. Di Wikibooks, Anda bisa menulis buku pelajaran, buku cerita rakyat, kumpulan resep, panduan, atau banyak topik lainnya. Yuk susun buku digital pertamamu di Wikibooks!",
    project: "Wikibooks",
    desc: "Menyusun buku secara kolaboratif.",
    url: "https://id.wikibooks.org",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Wikibooks-logo.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original",
    color: "#cc3333",
    colorLight: "rgba(204,51,51,0.08)",
    colorBorder: "rgba(204,51,51,0.2)",
  },
  {
    id: "wikiquote",
    question: "Anda bersemangat mendengar kata-kata mutiara?",
    body: "Kata-kata yang indah atau yang membakar semangat seringkali menjadi penguat di saat-saat yang dibutuhkan. Jika Anda suka mencatat kutipan dan ungkapan dari orang-orang terkemuka dan mengapa mereka penting, proyek Wikiquote cocok untuk Anda! Wikiquote mengumpulkan kutipan dari tokoh dan karya terkenal, serta ungkapan-ungkapan populer dalam suatu bahasa.",
    project: "Wikiquote",
    desc: "Mengumpulkan kutipan tokoh dan karya inspiratif.",
    url: "https://id.wikiquote.org",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Wikiquote-logo.svg",
    color: "#cc8800",
    colorLight: "rgba(204,136,0,0.08)",
    colorBorder: "rgba(204,136,0,0.2)",
  },
  {
    id: "commons",
    question: "Anda hobi mengambil foto, video, atau bentuk media lainnya?",
    body: "Pengetahuan tidak terbatas pada susunan kata-kata saja. Pengetahuan juga bisa berupa foto, video, gambar, grafis, atau rekaman suara. Setiap hasil dokumentasi yang penting dari Anda bisa jadi sumber pengetahuan lintas generasi. Apalagi, ketika itu bisa digunakan secara bebas oleh siapa saja. Proyek Wikimedia Commons cocok untuk insan kreatif seperti Anda. Jika Anda adalah seorang fotografer, Anda bisa menyumbangkan foto flora dan fauna, pawai kebudayaan, kegiatan sains, atau foto penting lainnya. Apabila Anda seorang desainer grafis, Anda juga bisa menyumbangkan ilustrasi ilmiah atau infografis. Selalu ada cara untuk menyumbang lewat Wikimedia Commons!",
    project: "Wikimedia Commons",
    desc: "Gudang bagi karya multimedia Anda agar bisa bermanfaat secara luas, termasuk di Wikipedia dan proyek lainnya.",
    url: "https://commons.wikimedia.org",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Commons-logo.svg",
    color: "#0066cc",
    colorLight: "rgba(0,102,204,0.08)",
    colorBorder: "rgba(0,102,204,0.2)",
  },
  {
    id: "data-teknologi",
    question: "Anda tertarik pada data dan teknologi?",
    body: "Data sistematis membantu informasi lebih mudah dipahami dan dimanfaatkan kembali untuk berbagai keperluan. Di era digital, pengelolaan data menjadi landasan penting bagi ekosistem pengetahuan terbuka. Jika Anda suka bekerja dengan data dan pemanfaatannya, proyek-proyek ini cocok untuk Anda: Wikidata memungkinkan Anda menyusun data terstruktur yang dipakai lintas proyek Wikimedia. Wikifunctions memberi ruang untuk berkolaborasi membuat fungsi kode yang mendukung pengetahuan global.",
    project: "Wikidata & Wikifunctions",
    desc: "Wikidata: menyusun data terstruktur lintas proyek Wikimedia. Wikifunctions: berkolaborasi membuat fungsi kode yang mendukung pengetahuan global.",
    url: "https://www.wikidata.org",
    urlSecondary: "https://www.wikifunctions.org",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Wikidata-logo.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original",
    color: "#006699",
    colorLight: "rgba(0,102,153,0.08)",
    colorBorder: "rgba(0,102,153,0.2)",
  },
  {
    id: "wikisource",
    question: "Anda peduli dengan arsip, naskah, dan dunia perpustakaan?",
    body: "Dokumen dan manuskrip menyimpan jejak sejarah yang berharga. Kelestariannya menjadi kunci bagi generasi masa kini dan mendatang untuk memahami untaian sejarah umat manusia. Oleh karena itu, pelestarian dokumen dan naskah bersejarah menjadi sangat penting, terlebih di era digital ini. Proyek Wikisource cocok untuk Anda yang peduli dengan keterbukaan perpustakaan arsip dan naskah lama.",
    project: "Wikisource",
    desc: "Mengajak Anda menjaga dokumen berlisensi bebas agar bisa diakses oleh siapa saja.",
    url: "https://id.wikisource.org",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Wikisource-logo.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original",
    color: "#993322",
    colorLight: "rgba(153,51,34,0.08)",
    colorBorder: "rgba(153,51,34,0.2)",
  },
  {
    id: "wikivoyage",
    question: "Anda gemar pelesiran dan berbagi kiat perjalanan?",
    body: "Setiap perjalanan wisata Anda menyimpan pengalaman unik yang bisa menjadi panduan berharga bagi orang lain. Anda diajak untuk menuliskan pengetahuan tentang perjalanan Anda secara aktual dan berbagi kiat-kiat yang relevan, seperti moda angkutan, harga karcis masuk, atau makanan wajib coba di suatu tempat wisata. Proyek Wikivoyage cocok untuk Anda yang suka bepergian dan mencatat kiat-kiat selama perjalanan.",
    project: "Wikivoyage",
    desc: "Tempat berbagi panduan perjalanan yang jujur.",
    url: "https://id.wikivoyage.org",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Wikivoyage-logo.svg",
    color: "#3d8040",
    colorLight: "rgba(61,128,64,0.08)",
    colorBorder: "rgba(61,128,64,0.2)",
  },
  {
    id: "wikispecies",
    question: "Atau Anda suka riset sains dan biologi?",
    body: "Kehidupan di bumi tidak lepas dari keanekaragaman hayati. Spesies yang berhasil didokumentasikan para ahli dapat memetakan kekayaan alam kita. Kontribusi seputar taksonomi, nama umum, dan informasi lain terkait suatu spesies dibutuhkan dalam proyek ini. Jika Anda memiliki latar belakang keilmuan biologi seperti di atas, proyek Wikispecies cocok untuk Anda!",
    project: "Wikispecies",
    desc: "Berfokus pada pendokumentasian semua bentuk kehidupan, mulai dari flora, fauna, hingga mikroorganisme.",
    url: "https://species.wikimedia.org",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/df/Wikispecies-logo.svg",
    color: "#558b2f",
    colorLight: "rgba(85,139,47,0.08)",
    colorBorder: "rgba(85,139,47,0.2)",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MenjadiSukarelawanClient() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        padding: "48px 24px 40px", position: "relative", overflow: "hidden",
        backgroundImage: "url('/banner/Mosaik_Budaya_1.png')",
        backgroundSize: "cover", backgroundPosition: "center",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,20,45,0.92) 0%, rgba(10,30,65,0.84) 40%, rgba(15,40,80,0.76) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "360px", height: "360px", borderRadius: "50%", background: "radial-gradient(circle, rgba(12,87,168,0.20) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
            <Link href="/" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontFamily: "var(--font-sans)", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
              Beranda
            </Link>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-sans)" }}>/</span>
            <span style={{ fontSize: "11px", color: "#3b8ed4", fontFamily: "var(--font-sans)" }}>Menjadi Sukarelawan Wikimedia</span>
          </div>

          <div>
            <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", margin: "6px 0 8px", lineHeight: "1.2" }}>
              Menjadi Sukarelawan Wikimedia
            </h1>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans)", margin: 0 }}>
              Temukan proyek Wikimedia yang paling sesuai dengan minat dan kegemaran Anda.
            </p>
          </div>
        </div>
      </section>

      {/* ── INTRO ────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8f7f5", padding: "52px 24px 0", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="sukarelawan-intro" style={{ display: "grid", gridTemplateColumns: "1fr 500px", gap: "40px", alignItems: "start" }}>

            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <p style={{ fontSize: "16px", color: "#3a3a3a", lineHeight: "1.9", fontFamily: "var(--font-sans)", margin: 0 }}>
                  Wikimedia adalah sebuah komunitas global yang bergotong-royong untuk membangun sumber daya pengetahuan bebas yang dapat diakses oleh siapa saja. Proyek-proyeknya hidup dan terus berkembang berkat kontribusi bersama para sukarelawan yang terus mengalir. Selanjutnya giliran Anda untuk ikut ambil bagian dalam gerakan membebaskan pengetahuan ini!
                </p>
                <p style={{ fontSize: "16px", color: "#3a3a3a", lineHeight: "1.9", fontFamily: "var(--font-sans)", margin: 0 }}>
                  Gerakan Wikimedia terbuka bagi siapa saja. Gerakan ini tumbuh dari kontribusi orang-orang dengan beragam minat dan latar belakang, entah itu ilmuwan, pelajar, seniman, ataupun pustakawan. Anda tidak harus menjadi ahli di bidang tertentu untuk mulai berkontribusi, cukup dengan kemauan untuk berbagi dan berkolaborasi. Beberapa orang membuat suntingan pertama mereka dari topik yang mereka suka, seperti klub sepak bola, pemeran idola, kota kelahiran, atau makanan kesukaan. Apa pun kegemaran Anda, selalu ada ruang berbagi pengetahuan dalam gerakan Wikimedia!
                </p>
              </div>
            </div>

            <div style={{ position: "sticky", top: "88px" }}>
              <div style={{ borderRadius: "6px", overflow: "hidden", border: "none", boxShadow: "none" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/9/94/1._Menjadi_Sukarelawan_Wikimedia.jpg"
                  alt="Ilustrasi Menjadi Sukarelawan Wikimedia"
                  style={{ 
                    width: "100%", 
                    display: "block",
                    mixBlendMode: "multiply",  // ← tambahkan ini
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROYEK ───────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8f7f5", padding: "48px 24px 72px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: "12px", marginBottom: "24px", borderBottom: "3px solid #0d0d0d" }}>
            <div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", marginTop: "4px", marginBottom: 0 }}>Proyek Wikimedia</h2>
            </div>
            <span style={{ fontSize: "11px", color: "#6b6966", fontFamily: "var(--font-sans)" }}>{SECTIONS.length} proyek tersedia</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {SECTIONS.map((s) => (
              <div
                key={s.id}
                id={s.id}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e2dd",
                  borderLeft: `4px solid ${s.color}`,
                  borderRadius: "4px",
                  padding: "28px 32px",
                  scrollMarginTop: "100px",
                }}
              >
                {/* Header: icon + label + pertanyaan */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "16px" }}>

                  {/* ── Logo — clickable ── */}
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Kunjungi ${s.project}`}
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "4px",
                      backgroundColor: s.colorLight,
                      border: `1px solid ${s.colorBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "box-shadow 0.2s, border-color 0.2s",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${s.colorBorder}`;
                      e.currentTarget.style.borderColor = s.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = s.colorBorder;
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.logo} alt={s.project} style={{ width: "28px", height: "28px", objectFit: "contain" }} />
                  </a>

                  <div>
                    <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: s.color, fontFamily: "var(--font-sans)", display: "block", marginBottom: "4px" }}>
                      ◆ {s.project}
                    </span>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0d0d0d", fontFamily: "var(--font-serif)", margin: 0, lineHeight: "1.4" }}>
                      {s.question}
                    </h2>
                  </div>
                </div>

                {/* Body */}
                <p style={{ fontSize: "14px", color: "#3a3a3a", lineHeight: "1.85", fontFamily: "var(--font-sans)", margin: "0 0 16px" }}>
                  {s.body}
                </p>

                {/* ── Highlight — nama proyek sebagai link + desc ── */}
                <div style={{ backgroundColor: "#f8f7f5", border: "1px solid #ede9e4", borderLeft: `3px solid ${s.color}`, borderRadius: "3px", padding: "12px 16px" }}>
                  <p style={{ fontSize: "13px", color: "#5c5a57", lineHeight: "1.65", fontFamily: "var(--font-sans)", margin: 0 }}>

                    {/* Kasus khusus: Wikidata & Wikifunctions — dua link terpisah */}
                    {s.id === "data-teknologi" ? (
                      <>
                        <a
                          href="https://www.wikidata.org"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: s.color, fontWeight: "700", textDecoration: "none" }}
                          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                        >
                          Wikidata
                        </a>
                        {": menyusun data terstruktur lintas proyek Wikimedia. "}
                        <a
                          href="https://www.wikifunctions.org"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: s.color, fontWeight: "700", textDecoration: "none" }}
                          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                        >
                          Wikifunctions
                        </a>
                        {": berkolaborasi membuat fungsi kode yang mendukung pengetahuan global."}
                      </>
                    ) : (
                      <>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: s.color, fontWeight: "700", textDecoration: "none" }}
                          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                        >
                          {s.project}
                        </a>
                        {", "}{s.desc}
                      </>
                    )}

                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#0d0d0d", padding: "64px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(12,87,168,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center" as const, position: "relative", zIndex: 1 }}>
          <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#e05070", fontFamily: "var(--font-sans)" }}>◆ Mulai Berkontribusi</span>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: "700", color: "#fff", fontFamily: "var(--font-serif)", margin: "10px 0 14px", lineHeight: "1.2" }}>
            Setiap Kontribusi Memiliki Dampak Nyata
          </h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sans)", lineHeight: "1.7", marginBottom: "28px" }}>
            Anda tidak hanya mengembangkan diri sesuai minat, tetapi juga menjadi bagian dari gerakan global yang percaya bahwa pengetahuan sepantasnya terbuka dan dapat diakses oleh semua orang. Yuk, mulai langkah kecil Anda hari ini!
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" as const }}>
            <Link href="/menjadi-anggota"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 28px", backgroundColor: "#0C57A8", color: "#fff", textDecoration: "none", borderRadius: "3px", fontSize: "13px", fontWeight: "700", fontFamily: "var(--font-sans)", letterSpacing: "0.04em", transition: "background 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0a4a8f")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0C57A8")}>
              Menjadi Anggota
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <a href="https://id.wikipedia.org/wiki/Wikipedia:Menyunting" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 28px", backgroundColor: "transparent", color: "#fff", textDecoration: "none", borderRadius: "3px", fontSize: "13px", fontWeight: "700", fontFamily: "var(--font-sans)", letterSpacing: "0.04em", border: "1px solid rgba(255,255,255,0.2)", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.backgroundColor = "transparent"; }}>
              Mulai Menyunting
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 1000px) {
          .sukarelawan-intro { grid-template-columns: 1fr !important; }
          .sukarelawan-intro > div:last-child { position: static !important; }
        }
      `}</style>
    </>
  );
}