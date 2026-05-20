export const questionsByTopic = {
  budgeting: [
    {
      id: 'budgeting-1',
      question: 'Apa tujuan utama budgeting?',
      options: [
        'Menghabiskan uang sebelum akhir bulan',
        'Membuat rencana penggunaan uang sebelum dibelanjakan',
        'Menghindari semua pengeluaran hiburan',
        'Menyimpan seluruh uang tanpa membeli kebutuhan',
      ],
      correctAnswer: 'Membuat rencana penggunaan uang sebelum dibelanjakan',
    },
    {
      id: 'budgeting-2',
      question: 'Dalam metode 50/30/20, bagian 50% biasanya digunakan untuk apa?',
      options: ['Keinginan', 'Kebutuhan', 'Spekulasi aset', 'Hadiah untuk teman'],
      correctAnswer: 'Kebutuhan',
    },
    {
      id: 'budgeting-3',
      question: 'Mana contoh yang paling tepat sebagai kebutuhan mahasiswa?',
      options: ['Nongkrong impulsif', 'Langganan hiburan premium', 'Transportasi ke kampus', 'Upgrade gadget karena tren'],
      correctAnswer: 'Transportasi ke kampus',
    },
    {
      id: 'budgeting-4',
      question: 'Apa langkah awal yang realistis untuk memperbaiki budget?',
      options: [
        'Mencatat pengeluaran rutin selama beberapa hari',
        'Mengabaikan pengeluaran kecil',
        'Menambah utang konsumtif',
        'Membeli semua barang saat diskon',
      ],
      correctAnswer: 'Mencatat pengeluaran rutin selama beberapa hari',
    },
    {
      id: 'budgeting-5',
      question: 'Jika kebutuhan melebihi 50% dari uang bulanan, apa respons yang paling sehat?',
      options: [
        'Menganggap budgeting gagal total',
        'Menyesuaikan komposisi dan menekan pos keinginan lebih dulu',
        'Menghapus semua tabungan selamanya',
        'Tidak perlu mencatat lagi',
      ],
      correctAnswer: 'Menyesuaikan komposisi dan menekan pos keinginan lebih dulu',
    },
  ],
  inflasi: [
    {
      id: 'inflasi-1',
      question: 'Inflasi secara umum berarti apa?',
      options: [
        'Harga satu barang turun sekali',
        'Kenaikan harga barang dan jasa secara umum dan terus-menerus',
        'Nilai uang selalu naik',
        'Pendapatan semua orang naik bersamaan',
      ],
      correctAnswer: 'Kenaikan harga barang dan jasa secara umum dan terus-menerus',
    },
    {
      id: 'inflasi-2',
      question: 'Apa dampak inflasi yang paling langsung terhadap uang?',
      options: ['Daya beli turun', 'Semua harga menjadi nol', 'Tabungan otomatis bertambah', 'Utang langsung hilang'],
      correctAnswer: 'Daya beli turun',
    },
    {
      id: 'inflasi-3',
      question: 'Indeks apa yang umum digunakan untuk memantau perubahan harga konsumen?',
      options: ['IHK', 'IPK', 'ISBN', 'HTML'],
      correctAnswer: 'IHK',
    },
    {
      id: 'inflasi-4',
      question: 'Mana contoh penyebab inflasi dari sisi biaya produksi?',
      options: [
        'Biaya energi dan bahan baku naik',
        'Mahasiswa menabung lebih banyak',
        'Harga semua barang turun',
        'Permintaan selalu lebih rendah dari pasokan',
      ],
      correctAnswer: 'Biaya energi dan bahan baku naik',
    },
    {
      id: 'inflasi-5',
      question: 'Cara paling sehat menghadapi inflasi untuk pemula adalah...',
      options: [
        'Tidak pernah memperbarui budget',
        'Membangun dana darurat dan mengevaluasi harga kebutuhan rutin',
        'Menyimpan semua uang di satu tempat tanpa belajar risiko',
        'Berutang untuk semua keinginan',
      ],
      correctAnswer: 'Membangun dana darurat dan mengevaluasi harga kebutuhan rutin',
    },
  ],
  'compound-interest': [
    {
      id: 'compound-1',
      question: 'Apa arti compound interest?',
      options: [
        'Bunga yang hanya dihitung dari modal awal',
        'Bunga yang dihitung dari pokok dan bunga sebelumnya',
        'Bunga yang selalu bernilai nol',
        'Bunga yang hanya berlaku satu hari',
      ],
      correctAnswer: 'Bunga yang dihitung dari pokok dan bunga sebelumnya',
    },
    {
      id: 'compound-2',
      question: 'Dalam rumus A = P(1 + r/n)^(nt), P berarti...',
      options: ['Nilai akhir', 'Modal awal', 'Frekuensi bunga', 'Jangka waktu'],
      correctAnswer: 'Modal awal',
    },
    {
      id: 'compound-3',
      question: 'Mengapa mulai lebih awal penting dalam compound interest?',
      options: [
        'Karena memberi lebih banyak periode pertumbuhan',
        'Karena menghilangkan semua risiko',
        'Karena menjamin untung setiap bulan',
        'Karena tidak perlu menabung lagi',
      ],
      correctAnswer: 'Karena memberi lebih banyak periode pertumbuhan',
    },
    {
      id: 'compound-4',
      question: 'Apa risiko salah memahami compound interest pada utang?',
      options: [
        'Bunga dapat menumpuk jika utang tidak dikelola',
        'Utang otomatis lunas',
        'Pokok pinjaman langsung hilang',
        'Tidak ada dampak pada pembayaran',
      ],
      correctAnswer: 'Bunga dapat menumpuk jika utang tidak dikelola',
    },
    {
      id: 'compound-5',
      question: 'Apa kebiasaan terbaik untuk memanfaatkan compound interest secara sehat?',
      options: [
        'Konsisten menyisihkan uang dan memahami risiko instrumen',
        'Mengejar return tertinggi tanpa riset',
        'Menggunakan dana makan untuk spekulasi',
        'Menunda belajar sampai punya uang besar',
      ],
      correctAnswer: 'Konsisten menyisihkan uang dan memahami risiko instrumen',
    },
  ],
}

export function getQuestionsByTopic(topic) {
  return questionsByTopic[topic] || []
}