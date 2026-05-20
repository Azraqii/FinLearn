export const topics = [
  {
    slug: 'budgeting',
    title: 'Budgeting',
    icon: 'BG',
    description: 'Cara mengatur pengeluaran dengan metode 50/30/20 yang disesuaikan untuk pelajar dan mahasiswa.',
    shortLabel: 'Budgeting',
  },
  {
    slug: 'inflasi',
    title: 'Inflasi',
    icon: 'IF',
    description: 'Apa itu inflasi, penyebabnya, dan dampaknya terhadap daya beli uang kamu.',
    shortLabel: 'Inflasi',
  },
  {
    slug: 'compound-interest',
    title: 'Compound Interest',
    icon: 'CI',
    description: 'Bagaimana bunga majemuk bekerja dan kenapa waktu menjadi faktor penting dalam investasi.',
    shortLabel: 'Compound',
  },
]

export const articles = {
  budgeting: {
    slug: 'budgeting',
    title: 'Budgeting: Mengatur Uang Supaya Tidak Habis Tanpa Sadar',
    illustration: 'BG',
    readingTime: '5 menit baca',
    summary:
      'Budgeting membantu kamu memberi tugas pada setiap rupiah: untuk kebutuhan, keinginan, tabungan, atau tujuan masa depan.',
    sections: [
      {
        heading: 'Apa itu budgeting?',
        paragraphs: [
          'Budgeting adalah proses membuat rencana penggunaan uang sebelum uang tersebut benar-benar keluar. Untuk pelajar dan mahasiswa, budgeting biasanya dimulai dari uang saku, beasiswa, penghasilan freelance, atau dukungan keluarga.',
          'Tujuan budgeting bukan membuat hidup terlalu ketat, melainkan membantu kamu sadar ke mana uang pergi. Dengan mencatat pemasukan dan pengeluaran, kamu bisa membedakan mana biaya penting, mana pengeluaran yang hanya terasa kecil tetapi sering berulang.',
          'Dalam praktiknya, budgeting juga membantu kamu menyiapkan dana untuk kebutuhan yang tidak muncul setiap hari, seperti buku, transportasi tambahan, biaya organisasi, servis laptop, atau dana darurat kecil.',
        ],
      },
      {
        heading: 'Metode 50/30/20 sebagai titik awal',
        paragraphs: [
          'Metode 50/30/20 membagi uang menjadi tiga kelompok: 50% untuk kebutuhan, 30% untuk keinginan, dan 20% untuk tabungan, investasi, atau pelunasan utang. Untuk mahasiswa, angka ini boleh disesuaikan karena biaya kos, transportasi, dan makan setiap orang berbeda.',
          'Kebutuhan mencakup hal yang wajib agar aktivitas utama tetap berjalan, seperti makan, transportasi, paket data untuk kuliah, alat tulis, atau biaya kos. Keinginan mencakup hal yang meningkatkan kenyamanan tetapi masih bisa ditunda, seperti nongkrong, upgrade gadget, langganan hiburan, atau belanja impulsif.',
          'Bagian 20% idealnya dipakai untuk membangun kebiasaan finansial sehat: menabung lebih dulu, membuat dana darurat, atau belajar investasi pada instrumen yang legal dan sesuai profil risiko.',
        ],
      },
      {
        heading: 'Contoh nyata untuk mahasiswa',
        paragraphs: [
          'Misalnya kamu menerima Rp2.000.000 per bulan. Dengan pendekatan 50/30/20, batas awalnya adalah Rp1.000.000 untuk kebutuhan, Rp600.000 untuk keinginan, dan Rp400.000 untuk tabungan atau tujuan masa depan.',
          'Jika kebutuhanmu ternyata Rp1.300.000 karena kos dan transportasi, bukan berarti budgeting gagal. Kamu bisa menyesuaikan komposisi menjadi lebih realistis, misalnya menekan pos keinginan lebih dulu agar tabungan tetap ada walaupun kecil.',
          'Kunci budgeting adalah evaluasi berkala. Coba catat pengeluaran selama 7 hari, cari pola bocor kecil seperti jajan impulsif atau biaya admin yang tidak disadari, lalu perbaiki anggaran bulan berikutnya.',
        ],
      },
      {
        heading: 'Fakta menarik',
        paragraphs: [
          'Budgeting yang baik biasanya bukan yang paling rumit, tetapi yang paling konsisten dipakai. Untuk pemula, catatan sederhana di notes, spreadsheet, atau aplikasi keuangan sudah cukup selama kamu rutin mengecek hasilnya.',
        ],
      },
    ],
    tips: [
      'Catat pengeluaran kecil selama minimal 7 hari.',
      'Pisahkan kebutuhan dan keinginan sebelum membeli.',
      'Gunakan rekening atau dompet digital terpisah untuk tabungan.',
      'Evaluasi budget setiap akhir minggu, bukan hanya akhir bulan.',
    ],
    sources: [
      {
        name: 'OJK - Buku Saku Cerdas Mengelola Keuangan',
        url: 'https://ojk.go.id/id/berita-dan-kegiatan/info-terkini/Documents/Pages/Buku-Saku-Cerdas-Mengelola-Keuangan/Buku%20Saku%20Cerdas%20Mengelola%20Keuangan.pdf',
      },
      {
        name: 'Manulife Indonesia - Metode Budgeting 50/30/20',
        url: 'https://www.manulife.co.id/id/artikel/metode-budgeting-50-30-20-untuk-pengelolaan-keuangan.html',
      },
    ],
  },
  inflasi: {
    slug: 'inflasi',
    title: 'Inflasi: Kenapa Harga Naik dan Uang Terasa Berkurang?',
    illustration: 'IF',
    readingTime: '6 menit baca',
    summary:
      'Inflasi menjelaskan kenaikan harga secara umum dan terus-menerus, sehingga uang yang sama bisa membeli lebih sedikit barang dari waktu ke waktu.',
    sections: [
      {
        heading: 'Definisi inflasi',
        paragraphs: [
          'Bank Indonesia menjelaskan inflasi sebagai kenaikan harga barang dan jasa secara umum dan terus-menerus dalam periode tertentu. Artinya, satu atau dua barang yang naik belum tentu disebut inflasi jika tidak mencerminkan kenaikan harga secara luas.',
          'Inflasi biasanya diukur melalui Indeks Harga Konsumen atau IHK. IHK memantau perubahan harga dari keranjang barang dan jasa yang umum dikonsumsi masyarakat, seperti makanan, transportasi, perumahan, pendidikan, dan kebutuhan lain.',
          'Data BPS terbaru saat materi ini disusun menunjukkan inflasi tahunan Indonesia pada April 2026 sebesar 2,42% year-on-year dengan IHK 111,09. Angka ini berada di dalam sasaran inflasi 2026 Bank Indonesia, yaitu 2,5% ± 1%.',
        ],
      },
      {
        heading: 'Penyebab inflasi',
        paragraphs: [
          'Inflasi dapat terjadi karena permintaan meningkat lebih cepat daripada ketersediaan barang dan jasa. Contohnya, saat permintaan tiket, makanan, atau transportasi naik tajam pada periode tertentu, harga dapat ikut terdorong naik.',
          'Inflasi juga bisa muncul karena biaya produksi naik. Jika harga energi, bahan baku, sewa tempat, atau upah meningkat, produsen dapat menaikkan harga jual agar biaya tetap tertutup.',
          'Di Indonesia, inflasi juga sering dipengaruhi oleh harga pangan bergejolak dan distribusi antarwilayah. Karena itu, pengendalian inflasi membutuhkan koordinasi antara pemerintah pusat, daerah, dan Bank Indonesia.',
        ],
      },
      {
        heading: 'Dampak inflasi terhadap uang kamu',
        paragraphs: [
          'Dampak paling terasa dari inflasi adalah turunnya daya beli. Jika uang saku tetap sama tetapi harga makan, transportasi, dan kebutuhan kuliah naik, maka ruang belanja kamu menjadi lebih sempit.',
          'Inflasi juga memengaruhi target keuangan. Dana untuk membeli laptop, membayar kos, mengikuti sertifikasi, atau menyiapkan dana darurat perlu dihitung dengan mempertimbangkan kemungkinan kenaikan harga di masa depan.',
          'Namun inflasi yang terkendali tidak selalu buruk. Dalam perekonomian, inflasi rendah dan stabil dapat menjadi sinyal aktivitas ekonomi tetap berjalan. Masalah muncul ketika inflasi terlalu tinggi, tidak stabil, atau pendapatan tidak ikut menyesuaikan.',
        ],
      },
      {
        heading: 'Cara melindungi uang dari inflasi',
        paragraphs: [
          'Langkah pertama adalah membuat anggaran yang realistis dan memperbarui asumsi harga secara berkala. Jangan memakai harga semester lalu jika biaya makan, transportasi, atau kebutuhan kuliah sudah berubah.',
          'Langkah kedua adalah membangun dana darurat agar kenaikan harga atau kebutuhan mendadak tidak langsung berubah menjadi utang konsumtif. Untuk mahasiswa, dana darurat bisa dimulai dari target kecil yang konsisten.',
          'Langkah ketiga adalah belajar instrumen simpanan atau investasi yang legal, mudah dipahami, dan sesuai jangka waktu. Tujuannya bukan mengejar return tinggi secara asal, tetapi menjaga nilai uang dengan risiko yang dapat kamu pahami.',
        ],
      },
    ],
    tips: [
      'Bandingkan harga kebutuhan rutin setiap bulan.',
      'Naikkan target dana darurat saat biaya hidup meningkat.',
      'Hindari menaruh semua uang jangka panjang hanya dalam bentuk kas.',
      'Pelajari risiko sebelum memilih produk investasi.',
    ],
    sources: [
      {
        name: 'Bank Indonesia - Inflasi',
        url: 'https://www.bi.go.id/id/fungsi-utama/moneter/inflasi/Default.aspx',
      },
      {
        name: 'BPS - Inflasi y-on-y April 2026 sebesar 2,42%',
        url: 'https://www.bps.go.id/id/pressrelease/2026/05/04/2570/inflasi-year-on-year--y-on-y--pada-april-2026-sebesar-2-42-persen-.html',
      },
      {
        name: 'Bank Indonesia - Target Inflasi 2026',
        url: 'https://www.bi.go.id/id/statistik/indikator/target-inflasi.aspx',
      },
    ],
  },
  'compound-interest': {
    slug: 'compound-interest',
    title: 'Compound Interest: Efek Bola Salju dalam Keuangan',
    illustration: 'CI',
    readingTime: '6 menit baca',
    summary:
      'Compound interest atau bunga majemuk membuat uang bertumbuh karena bunga berikutnya dihitung dari pokok plus bunga sebelumnya.',
    sections: [
      {
        heading: 'Definisi bunga majemuk',
        paragraphs: [
          'OJK Pedia menjelaskan bunga majemuk sebagai bunga yang dihitung atas jumlah pokok ditambah bunga yang sudah diperoleh sebelumnya. Sederhananya, kamu memperoleh bunga dari bunga.',
          'Konsep ini berbeda dari bunga sederhana. Pada bunga sederhana, bunga hanya dihitung dari modal awal. Pada bunga majemuk, nilai dasar perhitungan ikut bertambah setiap periode karena bunga sebelumnya masuk ke saldo.',
          'Dalam investasi, compound interest dapat membantu pertumbuhan jangka panjang. Namun prinsip yang sama juga bisa bekerja melawan kamu pada utang berbunga tinggi, karena bunga dapat menumpuk jika tidak dikelola.',
        ],
      },
      {
        heading: 'Rumus compound interest',
        paragraphs: [
          'Rumus umum bunga majemuk adalah A = P(1 + r/n)^(nt). A adalah nilai akhir, P adalah modal awal, r adalah suku bunga tahunan dalam bentuk desimal, n adalah frekuensi bunga ditambahkan dalam satu tahun, dan t adalah jangka waktu dalam tahun.',
          'Jika modal awal Rp1.000.000 ditempatkan dengan asumsi bunga 6% per tahun dan bunga dihitung bulanan selama 5 tahun, maka nilai akhirnya sekitar Rp1.348.850 sebelum pajak, biaya, atau risiko lain.',
          'Perhitungan di dunia nyata dapat berbeda karena investasi memiliki risiko, biaya transaksi, pajak, dan return yang tidak selalu tetap setiap tahun.',
        ],
      },
      {
        heading: 'Kenapa mulai lebih awal penting?',
        paragraphs: [
          'Semakin panjang waktu yang tersedia, semakin banyak periode compounding yang terjadi. Itu sebabnya memulai lebih awal sering kali lebih kuat daripada menunda sambil menunggu punya modal besar.',
          'Misalnya dua orang sama-sama ingin membangun dana masa depan. Orang pertama mulai dengan nominal kecil tetapi konsisten sejak kuliah. Orang kedua mulai lebih besar setelah bekerja, tetapi terlambat beberapa tahun. Dalam banyak skenario, waktu tambahan dapat memberi keunggulan besar pada orang pertama.',
          'Pelajaran utamanya bukan harus langsung berinvestasi besar, tetapi mulai membangun kebiasaan menyisihkan uang, memahami risiko, dan memilih instrumen yang legal serta sesuai tujuan.',
        ],
      },
      {
        heading: 'Fakta menarik',
        paragraphs: [
          'Compound interest sering terasa lambat di awal karena saldo masih kecil. Efeknya menjadi lebih terlihat ketika waktu, konsistensi, dan tingkat return mulai bekerja bersama dalam periode yang panjang.',
        ],
      },
    ],
    tips: [
      'Mulai dari nominal kecil yang konsisten.',
      'Gunakan kalkulator untuk membandingkan skenario waktu dan bunga.',
      'Jangan mengejar return tinggi tanpa memahami risiko.',
      'Pisahkan uang kebutuhan jangka pendek dari uang tujuan jangka panjang.',
    ],
    sources: [
      {
        name: 'OJK Pedia - Bunga Majemuk',
        url: 'https://ojk.go.id/id/ojk-pedia/default.aspx?a=wgr91',
      },
      {
        name: 'Consumer Financial Protection Bureau - How compound interest works',
        url: 'https://www.consumerfinance.gov/ask-cfpb/how-does-compound-interest-work-en-1683/',
      },
      {
        name: 'Investor.gov - Compound Interest Calculator',
        url: 'https://www.investor.gov/tools/calculators/compound-interest-calculator',
      },
    ],
  },
}

export function getTopicBySlug(slug) {
  return topics.find((topic) => topic.slug === slug)
}

export function getArticleBySlug(slug) {
  return articles[slug]
}
