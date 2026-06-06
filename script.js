document.addEventListener("DOMContentLoaded", () => {
  const cover = document.getElementById("cover");
  const openBtn = document.getElementById("openBtn");
  const bgm = document.getElementById("bgm");
  const body = document.body;

  // 1. Fungsi Buka Undangan & Play Audio
  openBtn.addEventListener("click", () => {
    // Animasi sampul naik ke atas
    cover.style.top = "-100vh";
    cover.style.opacity = "0";
    
    // Buka kunci scroll
    body.classList.remove("locked");

    // Play musik background
    // (Sebaiknya pastikan file mp3 sudah diclear noise dan di-normalize agar suaranya halus saat auto-play)
    if (bgm) {
      bgm.volume = 0.6; // Mengatur volume di 60% agar tidak mengagetkan
      bgm.play().catch((err) => {
        console.log("Browser memblokir autoplay audio:", err);
      });
    }

    // Hapus elemen cover dari DOM setelah animasi selesai
    setTimeout(() => {
      cover.style.display = "none";
    }, 1000);
  });

  // 2. Fungsi Salin Nomor Rekening
  const copyBtn = document.getElementById("copyBtn");
  const rekNo = document.getElementById("rekNo").innerText;

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(rekNo).then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = "✅ Berhasil Disalin!";
      copyBtn.style.background = "rgba(46, 204, 113, 0.4)"; // Ubah warna jadi hijau sementara
      
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.style.background = "rgba(255,255,255,0.2)";
      }, 2500);
    }).catch(err => {
      console.error('Gagal menyalin teks: ', err);
    });
  });

  // 3. Fungsi Simulasi Kirim Ucapan
  const sendBtn = document.getElementById("sendBtn");
  const nameInput = document.getElementById("nameInput");
  const msgInput = document.getElementById("msgInput");
  const commentsList = document.getElementById("commentsList");

  sendBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const msg = msgInput.value.trim();

    if (name === "" || msg === "") {
      alert("Mohon lengkapi nama dan ucapan doa terlebih dahulu.");
      return;
    }

    // Membuat elemen div baru untuk komentar
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("comment-item");
    
    // Keamanan sederhana mencegah cross-site scripting (XSS)
    const safeName = document.createTextNode(name);
    const safeMsg = document.createTextNode(msg);

    const strong = document.createElement("strong");
    strong.appendChild(safeName);
    
    const p = document.createElement("p");
    p.appendChild(safeMsg);

    commentDiv.appendChild(strong);
    commentDiv.appendChild(p);

    // Tambahkan komentar ke urutan paling atas
    commentsList.prepend(commentDiv);

    // Kosongkan form setelah mengirim
    nameInput.value = "";
    msgInput.value = "";
  });
});
