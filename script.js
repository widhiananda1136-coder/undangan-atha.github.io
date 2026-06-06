document.addEventListener("DOMContentLoaded", () => {
  // --- KODE BUKA UNDANGAN & SALIN REKENING (TETAP SAMA) ---
  const cover = document.getElementById("cover");
  const openBtn = document.getElementById("openBtn");
  const bgm = document.getElementById("bgm");
  const body = document.body;

  openBtn.addEventListener("click", () => {
    cover.style.top = "-100vh";
    cover.style.opacity = "0";
    body.classList.remove("locked");
    if (bgm) {
      bgm.volume = 0.6;
      bgm.play().catch((err) => console.log("Audio autoplay diblokir:", err));
    }
    setTimeout(() => { cover.style.display = "none"; }, 1000);
  });

  const copyBtn = document.getElementById("copyBtn");
  const rekNo = document.getElementById("rekNo").innerText;
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(rekNo).then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = "✅ Berhasil Disalin!";
      copyBtn.style.background = "rgba(255, 255, 255, 0.4)"; 
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.style.background = "rgba(255,255,255,0.15)";
      }, 2500);
    });
  });

  // --- KODE BARU: INTEGRASI GOOGLE SHEETS ---

  // GANTI URL DI BAWAH INI DENGAN URL APLIKASI WEB DARI TAHAP 1
  const scriptURL = 'https://script.google.com/macros/s/AKfycbzPBbD7tlCgi7MMpo29jwkOob0ubgjnneyL9Z2ExpvmUJc8GqMCs0pINxuyhm4PxzgV/exec'; 
  
  const sendBtn = document.getElementById("sendBtn");
  const nameInput = document.getElementById("nameInput");
  const msgInput = document.getElementById("msgInput");
  const commentsList = document.getElementById("commentsList");

  // Fungsi untuk merender komentar ke HTML
  const renderComments = (data) => {
    commentsList.innerHTML = ""; // Bersihkan list
    // Dibalik agar komentar terbaru ada di atas
    data.reverse().forEach(item => {
      const commentDiv = document.createElement("div");
      commentDiv.classList.add("comment-item");
      
      const strong = document.createElement("strong");
      strong.innerText = item.nama;
      
      const p = document.createElement("p");
      p.innerText = item.ucapan;
      
      commentDiv.appendChild(strong);
      commentDiv.appendChild(p);
      commentsList.appendChild(commentDiv);
    });
  };

  // 1. Ambil data saat web pertama kali dibuka
  fetch(scriptURL)
    .then(response => response.json())
    .then(data => renderComments(data))
    .catch(error => console.error('Gagal memuat ucapan:', error));

  // 2. Kirim data saat tombol ditekan
  sendBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const msg = msgInput.value.trim();

    if (name === "" || msg === "") {
      alert("Mohon lengkapi nama dan ucapan doa terlebih dahulu.");
      return;
    }

    // Ubah teks tombol untuk loading
    const originalBtnText = sendBtn.innerHTML;
    sendBtn.innerHTML = "⏳ Sedang mengirim...";
    sendBtn.disabled = true;

    // Siapkan data untuk dikirim ke Google Sheets
    const formData = new FormData();
    formData.append('nama', name);
    formData.append('ucapan', msg);

    fetch(scriptURL, { method: 'POST', body: formData })
      .then(response => response.json())
      .then(result => {
        if (result.status === "success") {
          // Tambahkan komentar ke UI secara langsung (tanpa harus memuat ulang web)
          const commentDiv = document.createElement("div");
          commentDiv.classList.add("comment-item");
          
          const strong = document.createElement("strong");
          strong.innerText = name;
          const p = document.createElement("p");
          p.innerText = msg;
          
          commentDiv.appendChild(strong);
          commentDiv.appendChild(p);
          commentsList.prepend(commentDiv); // Taruh di paling atas

          // Bersihkan form
          nameInput.value = "";
          msgInput.value = "";
        }
      })
      .catch(error => {
        alert("Maaf, terjadi kesalahan saat mengirim ucapan.");
        console.error('Error!', error.message);
      })
      .finally(() => {
        // Kembalikan tombol seperti semula
        sendBtn.innerHTML = originalBtnText;
        sendBtn.disabled = false;
      });
  });
});
