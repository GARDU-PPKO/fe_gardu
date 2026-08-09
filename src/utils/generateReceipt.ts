export const downloadReceipt = (data: {
  ticketNumber: string;
  customerName: string;
  whatsapp: string;
  packageName: string;
  date: string;
  session: string;
  participants: number;
  totalPrice: number;
  logoSrc: string;
  addOns?: { name: string; price: number }[];
}) => {
  const isCamping = data.packageName.toLowerCase().includes("camping");
  const addOnsList = data.addOns || [];
  
  const canvas = document.createElement("canvas");
  canvas.width = 850;
  // Increase height dynamically based on add-ons and extra notes
  canvas.height = 1100 + (addOnsList.length * 62) + (isCamping ? 60 : 0);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Top header banner
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, "#182cc1");
  gradient.addColorStop(1, "#091540");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, 160);

  // Load Logo
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = data.logoSrc;

  const drawContent = () => {
    // Draw Logo if loaded
    try {
      ctx.drawImage(img, 45, 30, 100, 100);
    } catch (e) {
      console.error("Failed to draw logo on canvas", e);
    }

    // Header Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("DESA WISATA GETAS", 165, 75);

    ctx.font = "16px sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.fillText("Kec. Singorojo, Kab. Kendal · Jawa Tengah", 165, 110);

    // Card Body Container
    ctx.fillStyle = "#f8faff";
    ctx.strokeStyle = "#c5d0ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Adjust inner rect height
    ctx.roundRect(45, 190, 760, 850 + (addOnsList.length * 62) + (isCamping ? 60 : 0) - (isCamping ? 0 : 0), 20);
    ctx.fill();
    ctx.stroke();

    // Badge Title
    ctx.fillStyle = "#182cc1";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("BUKTI PEMESANAN & E-TIKET", 80, 235);

    // Reference Code
    ctx.fillStyle = "#3d518c";
    ctx.font = "14px sans-serif";
    ctx.fillText("Kode Referensi", 80, 270);
    ctx.fillStyle = "#182cc1";
    ctx.font = "900 38px sans-serif";
    ctx.fillText(data.ticketNumber, 80, 315);

    // Status Pill Box
    ctx.fillStyle = "#e8edff";
    ctx.beginPath();
    ctx.roundRect(520, 260, 250, 50, 25);
    ctx.fill();
    ctx.fillStyle = "#182cc1";
    ctx.font = "bold 15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✓ BUKTI TERUNGGAH", 645, 291);
    ctx.textAlign = "left";

    // Divider
    ctx.strokeStyle = "#c5d0ff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(80, 345);
    ctx.lineTo(770, 345);
    ctx.stroke();

    // Rows Data
    const items = [
      { label: "Nama Pemesan", val: data.customerName || "—" },
      { label: "No. WhatsApp", val: data.whatsapp || "—" },
      { label: "Paket Wisata", val: data.packageName || "—" },
      { label: "Tanggal Kunjungan", val: data.date || "—" },
      { label: "Sesi Waktu", val: data.session || "—" },
      { label: "Jumlah Peserta", val: `${data.participants} Orang` },
      ...addOnsList.map(a => ({ label: `+ Add-On: ${a.name}`, val: a.price === 0 ? "Gratis" : `Rp ${a.price.toLocaleString("id-ID")}` })),
      { label: "Total Dibayar", val: `Rp ${data.totalPrice.toLocaleString("id-ID")}` },
    ];

    let startY = 395;
    items.forEach((item, index) => {
      ctx.fillStyle = "#3d518c";
      ctx.font = item.label.startsWith("+") ? "15px sans-serif" : "17px sans-serif";
      ctx.fillText(item.label, 80, startY);

      const isTotal = item.label === "Total Dibayar";
      ctx.fillStyle = isTotal ? "#182cc1" : "#091540";
      ctx.font = isTotal ? "900 24px sans-serif" : "bold 19px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(item.val, 770, startY);
      ctx.textAlign = "left";

      if (index < items.length - 1) {
        ctx.strokeStyle = "#e8edff";
        ctx.beginPath();
        ctx.moveTo(80, startY + 18);
        ctx.lineTo(770, startY + 18);
        ctx.stroke();
      }

      startY += 62;
    });

    // Notes Box
    const notesBoxHeight = isCamping ? 220 : 150;
    
    ctx.fillStyle = "#eef2ff";
    ctx.strokeStyle = "#c5d0ff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(80, startY + 10, 690, notesBoxHeight, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#182cc1";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("📌 Catatan Penting:", 105, startY + 45);

    ctx.fillStyle = "#3d518c";
    ctx.font = "14px sans-serif";
    ctx.fillText("1. Bukti ini resmi diterbitkan oleh Desa Wisata Getas.", 105, startY + 75);
    ctx.fillText("2. Tunjukkan bukti / e-tiket ini kepada petugas saat tiba di lokasi.", 105, startY + 100);
    ctx.fillText("3. Admin akan mengirimkan konfirmasi WhatsApp lanjutan setelah verifikasi.", 105, startY + 125);

    if (isCamping) {
      ctx.fillStyle = "#9a3412"; // orange-800 equivalent
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("⚠️ PERATURAN CAMPING:", 105, startY + 155);
      ctx.font = "14px sans-serif";
      ctx.fillText("• Check-in mulai 13.00, Check-out maksimal 11.00", 105, startY + 175);
      ctx.fillText("• Jam malam mulai 22.00 WIB, Pembatalan maksimal 8 jam sebelum acara", 105, startY + 195);
    }

    // Footer Timestamp
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`Dicetak otomatis pada: ${new Date().toLocaleString("id-ID")}`, canvas.width / 2, canvas.height - 30);
    ctx.textAlign = "left";

    // Download Link
    const link = document.createElement("a");
    link.download = `Bukti-Pemesanan-${data.ticketNumber}.png`;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (img.complete) {
    drawContent();
  } else {
    img.onload = drawContent;
    img.onerror = drawContent;
  }
};
