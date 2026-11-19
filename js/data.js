/* ===== Site configuration & content data ===== */
window.SITE = {
  name: 'Ardan Tools',
  tagline: 'Fast · Free · Private',
  year: 2026,
  // Put your address here so the Contact form can open the visitor's email app.
  contactEmail: 'hello@example.com'
};

window.CATEGORIES = {
  image: {
    key: 'image', name: 'Image', title: 'Image Utilities', navLabel: 'Image Tools',
    desc: 'Fast, high-quality image converters, compressors, and resizers that run entirely in your browser.',
    icon: 'image'
  },
  video: {
    key: 'video', name: 'Video', title: 'Video Utilities', navLabel: 'Video Tools',
    desc: 'Auto video cutter, speech narration trimmer, and client-side video utilities with zero file size limits.',
    icon: 'video'
  },
  pdf: {
    key: 'pdf', name: 'PDF', title: 'PDF Utilities', navLabel: 'PDF Tools',
    desc: 'Compress, merge, and convert PDF documents privately in browser memory, with no uploads.',
    icon: 'file'
  },
  text: {
    key: 'text', name: 'Text', title: 'Text Utilities', navLabel: 'Text Tools',
    desc: 'Count, convert, and format text instantly. Word counters, case converters, and Markdown editors.',
    icon: 'type'
  },
  developer: {
    key: 'developer', name: 'Developer', title: 'Developer Utilities', navLabel: 'Developer Tools',
    desc: 'Formatters, encoders, converters, and generators for everyday development work, all offline-capable.',
    icon: 'code'
  }
};

/* Advertisement slots. Replace these with your own sponsors/affiliate links. */
window.ADS = {
  privacy: {
    tag: 'Privacy Recommended', title: 'Your Privacy Partner Here', sub: 'Encrypted email, storage & VPN',
    text: 'Promote a privacy-focused product to people who care about keeping their data safe.',
    cta: 'Explore Partner', href: '/contact', color: 'linear-gradient(135deg,#6d4aff,#a78bfa)', icon: 'shield'
  },
  developer: {
    tag: 'Developer Recommended', title: 'Your Developer Platform Here', sub: 'Hosting, CDN & serverless',
    text: 'Reach developers who format JSON, hash strings, and minify code every day.',
    cta: 'Try Partner', href: '/contact', color: 'linear-gradient(135deg,#f97316,#fb923c)', icon: 'cloud'
  },
  creative: {
    tag: 'Creative Recommended', title: 'Vector & Design Assets', sub: 'High-resolution curated creative libraries',
    text: 'Royalty-free vector graphics, icons, and SVG illustrations for designers and creators.',
    cta: 'Discover Assets', href: '/contact', color: 'linear-gradient(135deg,#0ea5e9,#22d3ee)', icon: 'sparkles'
  }
};

window.POPULAR = ['pdf-to-word', 'file-translator', 'hd-photo-enhancer', 'pdf-compressor', 'qr-code-generator', 'jpg-to-pdf', 'video-to-mp3', 'auto-video-editor', 'word-counter', 'json-formatter'];

/* Tools — in the same order as the home page grid (Top 4 Featured Tools) */
window.TOOLS = [
  {
    slug: 'file-translator', name: 'File & PDF Translator (Dokumen, PDF & Subtitle)', cat: 'pdf', label: 'PDF & Document', icon: 'globe', ad: 'privacy',
    desc: 'Translate PDF documents with 100% layout and image preservation, text files, Markdown, subtitles (SRT/VTT), and JSON automatically between 20+ languages.',
    intro: 'Translate PDF documents directly with full visual layout, pictures, and page preservation, as well as TXT, Markdown (.md), Subtitles (.srt, .vtt), and JSON files between over 20 languages.',
    keywords: 'pdf translate translite translator file dokumen subtitle srt vtt language penerjemah',
    formats: ['PDF (.pdf)', 'Plain Text (.txt)', 'Markdown (.md)', 'Subtitles (.srt, .vtt)', 'JSON (.json)', 'CSV / Code'],
    related: ['word-counter', 'case-converter', 'markdown-to-html'],
    howto: [
      ['Upload PDF or File', 'Drag & drop any PDF document, text, subtitle, or data file, or paste your text directly.'],
      ['Select Languages', 'Choose your source and target languages (Indonesian, English, Japanese, Arabic, etc.).'],
      ['Translate & Export', 'Auto-translates on upload, then download the result as a translated PDF or text file.']
    ],
    features: ['Automatic PDF text extraction and instant translation page by page', 'Export translated results directly back to PDF format (.pdf) or text (.txt)', 'Direct drag & drop for PDF, TXT, MD, SRT, VTT, JSON, and CSV files', 'Over 20 global languages with auto-detect support', 'Smart Subtitle Mode: preserves SRT/VTT timestamps while translating dialogue', 'Automatic chunking for long documents with real-time progress indicator', 'Side-by-side original and translated preview'],
    privacy: 'Your files are processed directly in your browser using local PDF.js and WebAssembly. Translations use secure HTTPS requests without storing your files.',
    uses: ['Translating foreign language PDF eBooks, reports, research papers, and guides.', 'Translating movie and video subtitle files (.srt, .vtt) without breaking timecodes.', 'Localizing README files, software documentation, and Markdown guides.', 'Translating business letters, articles, essays, and notes to other languages.'],
    faq: [
      ['Can it translate PDF documents automatically?', 'Yes! When you upload a PDF, the tool automatically extracts text from all pages and translates it directly.'],
      ['Can I download the translated result as a PDF?', 'Yes, you can download the translation as a new PDF document or as a plain text file.'],
      ['Will subtitle timestamps be preserved?', 'Yes! When translating .srt or .vtt files, the timing markers and line indices remain completely intact.'],
      ['Is there a file size limit?', 'Documents are automatically chunked into manageable paragraphs so even long essays or full subtitles translate smoothly.']
    ]
  },
  {
    slug: 'hd-photo-enhancer', name: 'HD Photo Enhancer (Pembuat Foto HD & 4K)', cat: 'image', label: 'Ultra HD 4K', icon: 'sparkles', ad: 'creative',
    desc: 'Enhance blurry photos to Ultra HD, upscale resolution up to 4x, unblur facial details, and restore colors in your browser.',
    intro: 'Transform low-resolution, blurry, or old photos into crystal-clear High Definition (Full HD & 4K). Unblur edges, boost clarity, denoise, and upscale up to 4x with an interactive before/after split slider.',
    keywords: 'hd photo enhancer pembuat foto hd jernih unblur upscale 4k resolution super resolution gambar penjernih',
    formats: ['JPEG (.jpg, .jpeg)', 'PNG (.png)', 'WebP (.webp)', 'HEIC', 'BMP'],
    related: ['image-compressor', 'image-resizer', 'png-to-jpg'],
    howto: [
      ['Upload Photo', 'Drag & drop any low-res or blurry photo (.jpg, .png, .webp).'],
      ['Choose Preset or Scale', 'Select Auto HD, Face Portrait, Landscape 4K, or customize sliders.'],
      ['Compare & Download', 'Swipe the Before/After slider to see the HD difference, then download as PNG or JPG.']
    ],
    features: ['Multi-scale upscaling (2x Full HD, 4x Ultra HD 4K, 1x Clarity Only)', 'Smart Unsharp Mask algorithm to restore blurry details, hair, eyes, and edges', 'Adaptive Micro-Contrast & Clarity enhancement for punchy depth', 'Noise & JPEG compression artifact suppression', 'Intelligent Vibrance and color restoration without oversaturating skin tones', 'Interactive Before / After comparison slider in real-time', 'One-click presets: Auto HD, Portrait/Face, Landscape 4K, Document Text', '100% private in-browser canvas processing (no photos sent to any server)'],
    privacy: 'Your photos never leave your device. All upscaling, sharpening, and color enhancements run 100% client-side in your browser using HTML5 Canvas.',
    uses: ['Making old or blurry smartphone photos crisp and clear in HD.', 'Enhancing anime, wallpapers, and digital art to 4K resolution.', 'Sharpening profile pictures, portraits, and product photos for social media & eCommerce.', 'Unblurring text and details on scanned documents and receipts.'],
    faq: [
      ['How does the HD Photo Enhancer work?', 'It combines stepped multi-pass bicubic upsampling, unsharp mask kernel sharpening, micro-contrast enhancement, and noise filtering directly in your browser memory.'],
      ['What resolution can I achieve?', 'You can upscale 2x (Full HD) or 4x (Ultra HD / 4K), significantly increasing pixel dimensions and fine edge clarity.'],
      ['Are my photos private?', 'Yes! Zero server uploads. Everything is processed directly on your laptop/phone GPU and CPU.']
    ]
  },
  {
    slug: 'pdf-compressor', name: 'PDF Compressor', cat: 'pdf', label: 'Size Reduction', icon: 'minimize', ad: 'privacy',
    desc: 'Reduce PDF file sizes in browser memory with no file size limits, even down to a target like under 2 MB.',
    intro: 'Reduce PDF file sizes directly in browser memory without any MB limit. Compress any size PDF down to custom targets like 2 MB, 5 MB, or maximum compression. Your documents never touch a server.',
    keywords: 'pdf compress reduce size shrink smaller no limit unlimited mb tanpa batas',
    formats: ['PDF (.pdf, v1.3–2.0)'],
    accept: 'application/pdf,.pdf', maxFiles: 1,
    dropTitle: 'Drop your PDF document here to compress',
    dropSub: 'Tanpa batasan ukuran file (Unlimited MB) · 100% diproses privat di browser',
    related: ['merge-pdf', 'split-pdf', 'pdf-to-jpg'],
    howto: [
      ['Upload PDF', 'Drop your document into the compressor (no file size limit).'],
      ['Set a Target', 'Keep Target Size at 2 MB (or pick 500 KB–50 MB, or type any target), or choose a preset level.'],
      ['Download', 'Save the smaller PDF to your device.']
    ],
    features: ['Unlimited file size: compress large PDFs of any size without restriction', 'Target Size mode: set a limit (e.g. 2 MB) and get the best quality that fits', 'Optimizes embedded images and PDF object structures', 'Shows original vs. compressed file size', 'Lossless, Recommended, and Extreme presets', 'Private handling with no server storage'],
    privacy: 'Zero data retention: your PDF is processed in browser memory and discarded when you close the tab.',
    uses: ['Compressing large scanned legal documents, binders, and contracts.', 'Shrinking resumes and portfolios for job portals with strict 2MB limits.', 'Reducing eBook and high-res presentation sizes for mobile and email.'],
    faq: [
      ['Apakah ada batasan maksimal ukuran file PDF?', 'Tidak ada batasan maksimal MB (Unlimited MB). Anda dapat mengompres file PDF ukuran berapa pun (50MB, 100MB, 500MB+) secara gratis dan aman langsung di browser.'],
      ['Are my confidential contracts safe?', 'Yes. Processing is 100% local in your browser and nothing is uploaded or stored permanently.'],
      ['Can it compress my PDF to under 2 MB?', 'Yes. Target Size mode tries lossless optimization first, then automatically lowers resolution and quality step by step until the file fits under your limit, keeping the highest quality that fits.'],
      ['Will compression make text unreadable?', 'No. Lossless mode keeps text as vector data. The stronger modes render pages at a print-friendly resolution so text stays clear.']
    ]
  },
  {
    slug: 'qr-code-generator', name: 'QR Code Generator', cat: 'image', label: 'Instant Generator', icon: 'qr', ad: 'creative',
    desc: 'Create customizable high-res QR codes for URLs, text, contacts, or Wi-Fi.',
    intro: 'Create customizable high-resolution QR codes for URLs, text, contacts, or Wi-Fi.',
    keywords: 'qr code generator url wifi link barcode',
    formats: ['PNG', 'SVG'],
    related: ['jpg-to-png', 'image-resizer', 'json-formatter'],
    howto: [
      ['Choose Type', 'Pick URL, Plain Text, Wi-Fi, or Email.'],
      ['Enter Details', 'Type a link, message, or network credentials.'],
      ['Customize & Download', 'Pick colors and error correction, then download as PNG or SVG.']
    ],
    features: ['Live preview while you type', 'Presets for URL, text, Wi-Fi, and email', 'Custom foreground and background color pickers', 'PNG and SVG download options', 'Four error-correction levels (L, M, Q, H)'],
    privacy: 'Codes are created locally using the browser canvas. Text and Wi-Fi passwords are never transmitted.',
    uses: ['Restaurant menus and tabletop scan-to-order codes.', 'Wi-Fi guest access codes for offices, cafes, and homes.', 'Scannable links on business cards, flyers, and event badges.'],
    faq: [
      ['Do the QR codes expire?', 'No. They are static codes that contain your raw text or URL, so they work forever.'],
      ['Can I use them commercially?', 'Yes. They are free for personal and commercial use with no licensing fees.'],
      ['Is SVG supported?', 'Yes. Download a vector SVG for high-quality printing on posters, flyers, or merchandise.']
    ]
  },
  {
    slug: 'auto-video-editor', name: 'Pemotong Video Narasi Otomatis (Auto Video Editor AI)', cat: 'video', label: 'AI Narasi & Cut', icon: 'video', ad: 'creative',
    desc: 'Potong otomatis bagian video yang tidak sesuai narasi, jeda hening (dead air), salah bicara, dan retake langsung di browser tanpa batasan ukuran file (Unlimited GB).',
    intro: 'Edit dan potong video secara otomatis berdasarkan naskah narasi dan deteksi suara bicara 100% lokal di browser Anda. Deteksi jeda hening / dead air, eliminasi bagian salah bicara / blooper, preview pemotongan mulus dengan fitur Auto-Skip real-time, dan ekspor langsung tanpa batasan ukuran file.',
    keywords: 'pemotong video otomatis auto video editor potong video narasi speech cut silence remover jump cut video cutter tanpa batas ukuran no limit online',
    formats: ['MP4 (.mp4)', 'WebM (.webm)', 'MOV (.mov)', 'MKV (.mkv)', 'AVI (.avi)', 'M4V (.m4v)'],
    related: ['hd-photo-enhancer', 'file-translator', 'word-counter'],
    howto: [
      ['Unggah Video Bebas Ukuran', 'Pilih atau drag video format apa pun tanpa batasan MB/GB (500MB, 2GB, 5GB+). Video langsung dibaca dari disk lokal tanpa upload server.'],
      ['Atur Naskah & Sensitivitas Suara', 'Tempel naskah narasi Anda (opsional) atau sesuaikan ambang hening (silence threshold), lalu klik "Analisis Suara & Narasi".'],
      ['Pratinjau Auto-Skip & Unduh', 'Putar video untuk mendengar hasil potongan yang otomatis melompati bagian hening/salah, lalu unduh video hasil edit atau salin script FFmpeg Lossless.']
    ],
    features: [
      'Tanpa Batasan Ukuran File (Unlimited GB): 100% diproses di browser lokal Anda tanpa upload server (Zero Server Uploads)',
      'Deteksi Narasi & Suara Bicara Pintar: Memisahkan suara aktif vs jeda nafas, jeda mikir (dead air), dan hening secara akurat',
      'Pencocokan Naskah Narasi (Script Alignment): Tempel naskah teks pembicara untuk otomatis membuang bagian di luar narasi & salah take',
      'Interactive Waveform & Segmen Visual: Warna hijau [KEEP] untuk narasi aktif dan merah [CUT] untuk jeda/salah bicara yang bisa di-toggle 1-klik',
      'Player Auto-Skip Real-time: Pemutar video pintar yang otomatis melompati potongan yang dibuang saat diputar',
      '3 Pilihan Ekspor Fleksibel: Unduh video hasil potong langsung di browser (.webm/.mp4), 1-klik perintah FFmpeg Lossless 0-detik tanpa re-encode, serta timecodes CapCut / Premiere'
    ],
    privacy: 'Privasi 100% Terjamin. Video berukuran besar Anda tidak pernah dikirim ke internet. Pemindaian audio, pemotongan, dan rendering sepenuhnya berjalan di hardware lokal Anda.',
    uses: [
      'Merapikan rekaman video YouTube, TikTok, dan Reels dari jeda kosong membosankan agar engagement meningkat.',
      'Memotong rekaman kursus online, webinar, presentasi, dan podcast tanpa perlu membuang jeda secara manual satu per satu.',
      'Memotong otomatis video voiceover atau video tutorial agar pas 100% sesuai naskah narasi yang disiapkan.',
      'Membuat rough cut kilat untuk editor video sebelum diimpor ke Adobe Premiere Pro, CapCut, atau DaVinci Resolve.'
    ],
    faq: [
      ['Apakah benar tidak ada batasan ukuran video (Unlimited)?', 'Ya, benar! Berkat teknologi HTML5 File Streaming & Web Audio API, file video 500MB, 2GB, hingga 10GB+ dapat dibuka langsung secara lokal tanpa membebani server dan tanpa biaya apa pun.'],
      ['Bagaimana cara kerja pemotongan berdasarkan narasi?', 'Sistem membaca spektrum gelombang suara pembicara dan mencocokkan intensitas energi vokal dengan naskah narasi. Jeda hening panjang, keraguan (filler), atau kalimat gagal take otomatis ditandai merah [CUT].'],
      ['Apakah saya bisa membatalkan atau mengubah potongan?', 'Bisa! Anda cukup mengklik segmen mana saja di timeline interaktif atau daftar segmen untuk mengubah statusnya antara [KEEP] (simpan) atau [CUT] (potong).'],
      ['Bagaimana cara menyimpan video berukuran sangat besar?', 'Untuk video gigabyte besar, Anda bisa mengunduh rekaman browser langsung ATAU menyalin 1 baris perintah FFmpeg Lossless yang kami buatkan otomatis untuk memotong video dalam 2 detik tanpa penurunan kualitas sama sekali!']
    ]
  },
  {
    slug: 'video-to-mp3', name: 'Video to Audio & MP3 Extractor (Ekstrak Audio Video)', cat: 'video', label: 'Audio Extractor', icon: 'music', ad: 'privacy',
    desc: 'Ambil dan ekstrak suara, lagu, narasi, atau musik latar dari video ke format WAV & MP3 studio 100% lokal di browser tanpa batas ukuran file.',
    intro: 'Ekstrak trek suara atau instrumen musik dari berbagai format video (MP4, MKV, WebM, MOV, AVI) ke file audio beresolusi tinggi (WAV / MP3). Bebas ukuran file, bebas kuota upload, dan diproses seketika di perangkat Anda.',
    keywords: 'video to mp3 convert video to audio ekstrak lagu suara musik wav m4a opus unlimited gratis',
    formats: ['MP4 (.mp4)', 'WebM (.webm)', 'MOV (.mov)', 'MKV (.mkv)', 'AVI (.avi)', 'M4V (.m4v)'],
    accept: 'video/*,.mp4,.webm,.mkv,.mov,.avi,.m4v,.flv', maxFiles: 1,
    dropTitle: 'Tarik & lepas file video di sini untuk diekstrak suaranya',
    dropSub: 'Mendukung MP4, MKV, WebM, MOV · Ekstrak ke format WAV & MP3 · Unlimited MB & 100% Privat',
    related: ['auto-video-editor', 'file-translator', 'hd-photo-enhancer'],
    howto: [
      ['Pilih Video', 'Tarik atau pilih file video format apa saja tanpa batasan ukuran MB/GB.'],
      ['Atur Format & Channel', 'Pilih format audio (WAV Studio / MP3), Sample Rate (48kHz / 44.1kHz), dan Channel (Stereo / Mono).'],
      ['Dengarkan & Unduh', 'Putar audio hasil ekstraksi langsung di pemutar browser lalu klik Unduh Audio.']
    ],
    features: [
      'Ekstrak audio dari semua format video (MP4, WebM, MOV, MKV, AVI)',
      'Pilihan format WAV (Studio Uncompressed 16-bit PCM) dan MP3 / WebM Audio',
      'Pilihan Sample Rate: 48,000 Hz (Standar Video/Film) atau 44,100 Hz (CD Audio)',
      'Pilihan Channel: Stereo (2 channel) atau Mono (1 channel)',
      'Audio player bawaan untuk mendengarkan hasil langsung sebelum diunduh',
      '100% Client-Side: File video tidak pernah diunggah ke server (Zero Server Uploads)'
    ],
    privacy: 'Privasi mutlak terjamin. File video dibaca dan diproses sepenuhnya di memori komputer/HP Anda menggunakan Web Audio API.',
    uses: [
      'Mengambil lagu latar belakang atau sound effect dari video klip YouTube/TikTok/Reels.',
      'Mengekstrak rekaman ceramah, rapat Zoom, atau materi kuliah menjadi audio podcast yang hemat ruang.',
      'Menyimpan narasi suara pembicara dari video untuk diedit kembali di software audio.'
    ],
    faq: [
      ['Apakah ada batas durasi atau ukuran file video?', 'Tidak ada batasan ukuran file video (Unlimited MB/GB). Video besar sekalipun tetap bisa diproses di browser Anda.'],
      ['Format audio apa yang paling bagus?', 'Format WAV memberikan kualitas suara murni studio (Lossless PCM 16-bit) tanpa kompresi, sangat cocok untuk pemutar musik, HP, dan editing.'],
      ['Apakah perlu koneksi internet untuk mengekstrak?', 'Hanya saat pertama membuka halaman web. Setelah halaman terbuka (atau di-install via PWA), proses ekstraksi berjalan 100% offline tanpa internet!']
    ]
  },
  {
    slug: 'word-counter', name: 'Word Counter', cat: 'text', label: 'Instant Analysis', icon: 'type', ad: 'privacy',
    desc: 'Count words, characters, sentences, paragraphs, and reading time in real time.',
    intro: 'Count words, characters, sentences, paragraphs, and estimated reading time in real time as you type.',
    keywords: 'words characters count essay reading time letters',
    formats: ['Plain Text (.txt)', 'Markdown (.md)', 'Clipboard Pastes', 'Rich Unicode'],
    related: ['json-formatter', 'image-compressor', 'case-converter'],
    howto: [
      ['Enter or Paste Text', 'Type directly in the editor or paste any text from your clipboard.'],
      ['View Live Stats', 'Words, characters, sentences, and reading time update instantly as you type.'],
      ['Copy or Clear', 'Copy your text to the clipboard or clear the editor to start fresh.']
    ],
    features: ['Real-time counting as you type', 'Character count excluding whitespace', 'Sentence and paragraph breakdown', 'Reading and speaking time estimates', 'One-click copy and clear controls'],
    privacy: 'Your text never leaves your device. All analysis runs 100% client-side, with zero server transmission.',
    uses: ['Students checking essays and college application word limits.', 'Authors and bloggers estimating article reading times.', 'Marketers checking Twitter/X posts, meta descriptions, and ad copy against character limits.'],
    faq: [
      ['Is my text uploaded or stored anywhere?', 'No. Counting happens locally in your browser. Nothing is logged, saved, or sent to any server.'],
      ['How is reading time calculated?', 'Reading time uses an average adult reading speed of 200 words per minute. Speaking time uses 130 words per minute.'],
      ['Is there a length limit?', 'There is no artificial limit. You can paste very long documents; the only limit is your browser\'s memory.'],
      ['Can I check social media character limits?', 'Yes. It shows total characters and characters without spaces, so you can check limits like Twitter/X (280 characters).']
    ]
  },
  {
    slug: 'json-formatter', name: 'JSON Formatter & Validator', cat: 'developer', label: 'Secure Parser', icon: 'braces', ad: 'developer',
    desc: 'Prettify, validate, minify, and inspect JSON data offline.',
    intro: 'Prettify, validate, minify, and inspect JSON data instantly, with precise error messages and no data leaving your browser.',
    keywords: 'json prettify validate minify beautify lint api',
    formats: ['JSON (.json)', 'GeoJSON', 'JSON Lines (single objects)', 'Plain Text'],
    related: ['base64-encode-decode', 'csv-to-json', 'hash-uuid-generator'],
    howto: [
      ['Input JSON', 'Paste raw or minified JSON into the input panel.'],
      ['Format & Validate', 'Click Format to indent and structure it, or Minify to compact it.'],
      ['Inspect or Copy', 'Review the output, then copy it or download it as a .json file.']
    ],
    features: ['Indentation choices: 2 spaces, 4 spaces, or tabs', 'Strict validation with descriptive error messages', 'One-click minification to reduce payload size', 'Sample loader for quick testing', 'Copy output or download as .json', 'Native JSON parsing with no eval or remote calls'],
    privacy: 'Parsing uses your browser\'s native JSON methods. There is no telemetry on your data and nothing is transmitted.',
    uses: ['Inspecting REST and GraphQL API responses.', 'Debugging config files such as package.json, tsconfig.json, and settings.json.', 'Minifying JSON before sending HTTP requests.'],
    faq: [
      ['Is my sensitive data safe?', 'Yes. Processing stays inside your browser. Nothing is transmitted or logged.'],
      ['How are syntax errors shown?', 'The exact parser error message is displayed, along with the line and column when available, so you can quickly find issues like missing quotes or trailing commas.'],
      ['Can it handle large API responses?', 'Yes. Native parsing comfortably handles several megabytes of JSON.']
    ]
  },
  {
    slug: 'heic-to-jpg', name: 'HEIC to JPG Converter', cat: 'image', label: 'Apple Photos', icon: 'camera', ad: 'creative',
    desc: 'Convert Apple HEIC/HEIF photos to standard JPG directly in your browser.',
    intro: 'Convert Apple HEIC and HEIF photos to high-quality JPG right in your browser. No uploads, no waiting.',
    keywords: 'heic heif iphone apple photo jpg convert',
    formats: ['Apple HEIC (.heic)', 'HEIF (.heif)'],
    accept: '.heic,.heif,image/heic,image/heif', maxMB: 30, maxFiles: 25,
    dropTitle: 'Drop one or multiple Apple HEIC photos here',
    dropSub: 'Supports iPhone/iPad .heic & .heif photos up to 30MB each · In-browser conversion',
    related: ['jpg-to-png', 'png-to-jpg', 'image-compressor'],
    howto: [
      ['Select HEIC File', 'Drag and drop, or select one or more .heic/.heif photos.'],
      ['Adjust Quality', 'Fine-tune the output JPG quality with the slider.'],
      ['Download JPG', 'Download individual JPGs or all files as a ZIP archive.']
    ],
    features: ['Converts Apple HEIC and HEIF photos to standard JPG', 'Batch processing of multiple photos at once', 'High-fidelity rendering with quality control', 'Individual or ZIP downloads', 'Client-side processing for photo privacy'],
    privacy: 'Your photos are decoded locally in your browser. Nothing is uploaded or stored.',
    uses: ['Uploading iPhone photos to portals that reject HEIC.', 'Sending pictures to Windows or Android users who can\'t open .heic files.', 'Preparing camera photos for CMS, blog publishing, or printing.'],
    faq: [
      ['Why convert HEIC to JPG?', 'HEIC is Apple\'s efficient photo format, but many websites, government portals, Windows PCs, and Android devices still require JPG.'],
      ['Do my personal photos get sent to a server?', 'No. Conversion uses client-side decoding inside your browser.'],
      ['Can I convert multiple iPhone photos at once?', 'Yes. Convert up to 25 photos at once and download them all in a single ZIP.']
    ]
  },
  {
    slug: 'image-compressor', name: 'Image Compressor', cat: 'image', label: 'Smart Compression', icon: 'minimize', ad: 'creative',
    desc: 'Reduce JPG, PNG, and WebP file sizes without visible quality loss.',
    intro: 'Compress JPG, PNG, and WebP images to reduce file size without visible quality loss.',
    keywords: 'compress image reduce size jpg png webp optimize shrink',
    formats: ['JPEG (.jpg, .jpeg)', 'PNG (.png)', 'WebP (.webp)'],
    accept: 'image/jpeg,image/png,image/webp', maxMB: 25, maxFiles: 50,
    dropTitle: 'Drop one or multiple images to compress',
    dropSub: 'JPG, PNG & WebP up to 25MB each · Batch compression & ZIP export',
    related: ['image-resizer', 'jpg-to-png', 'png-to-jpg'],
    howto: [
      ['Upload Images', 'Drop JPG, PNG, or WebP files into the compressor.'],
      ['Set Compression Level', 'Adjust the quality slider to balance file size and visual fidelity.'],
      ['Download', 'Save each optimized image individually or all as a ZIP.']
    ],
    features: ['Compresses JPG, PNG, and WebP files', 'Batch processing with multi-file dropzone and ZIP export', 'Real-time size comparison with savings percentage', 'Adjustable compression slider', 'Preserves aspect ratio and visual fidelity'],
    privacy: 'Compression runs inside your browser using the HTML5 Canvas API. Your images are never uploaded.',
    uses: ['Web developers optimizing site images for Core Web Vitals and search rankings.', 'Fitting photos under email attachment limits such as 25MB.', 'Reducing file sizes for Discord, Slack, and WhatsApp uploads.'],
    faq: [
      ['How much size reduction can I expect?', 'Typically 40% to 80%, depending on how the original was compressed and what the image contains.'],
      ['Does compression blur my pictures?', 'No. Re-encoding strips redundant metadata and high-frequency noise while keeping edges and colors sharp.'],
      ['Are my photos uploaded to a third-party server?', 'No. All compression happens in client-side HTML5 Canvas memory.']
    ]
  },
  {
    slug: 'image-resizer', name: 'Image Resizer', cat: 'image', label: 'Precision Scaling', icon: 'resize', ad: 'creative',
    desc: 'Resize JPG, PNG, and WebP by exact pixels, percentage, or aspect ratio.',
    intro: 'Resize JPG, PNG, and WebP images by exact pixels, percentage, or aspect ratio, instantly and privately.',
    keywords: 'resize image scale dimensions width height pixels percentage',
    formats: ['JPEG (.jpg, .jpeg)', 'PNG (.png)', 'WebP (.webp)'],
    accept: 'image/jpeg,image/png,image/webp', maxMB: 25, maxFiles: 50,
    dropTitle: 'Drop one or multiple images to resize',
    dropSub: 'JPG, PNG & WebP up to 25MB each · Batch resizing & ZIP export',
    related: ['image-compressor', 'jpg-to-png', 'png-to-jpg'],
    howto: [
      ['Select Image', 'Drop one or more images into the resizer.'],
      ['Specify Dimensions', 'Enter a width and height, or choose a scaling percentage.'],
      ['Download', 'Save the resized images individually or as a ZIP.']
    ],
    features: ['Resize by exact pixels or percentage', 'Aspect ratio lock to prevent distortion', 'Multi-file batch queue with ZIP download', 'JPG, PNG, and WebP support', 'Fast in-browser processing with no upload delay'],
    privacy: 'Resizing is executed 100% on your device.',
    uses: ['Scaling images for Instagram, YouTube banners, and Twitter/X.', 'Downscaling large 4K/8K camera photos for faster web loading.', 'Fitting photos to passport or document portal upload specifications.'],
    faq: [
      ['Will resizing stretch my image?', 'No. The aspect ratio lock is on by default, so the height follows the width automatically.'],
      ['Can I upscale small images?', 'Yes, though extreme upscaling may look soft because no new detail can be created.'],
      ['Can I resize multiple images at once?', 'Yes. The batch processor applies the same target dimensions to every queued image.']
    ]
  },
  {
    slug: 'jpg-to-png', name: 'JPG to PNG Converter', cat: 'image', label: 'Lossless Output', icon: 'layers', ad: 'creative',
    desc: 'Convert JPG/JPEG pictures to lossless PNG with transparency support.',
    intro: 'Convert JPG and JPEG pictures to lossless PNG with transparency support.',
    keywords: 'jpg jpeg png convert lossless transparency',
    formats: ['JPEG (.jpg, .jpeg)'],
    accept: 'image/jpeg,.jpg,.jpeg', maxMB: 25, maxFiles: 25,
    dropTitle: 'Drop one or multiple JPG images here',
    dropSub: 'Batch processing up to 25 files · ZIP download',
    related: ['png-to-jpg', 'image-compressor', 'image-resizer'],
    howto: [
      ['Upload JPG', 'Choose or drag one or more JPG/JPEG files.'],
      ['Convert', 'Click "Convert All" to render each file as a lossless PNG.'],
      ['Save File', 'Download individual PNGs or all files as a ZIP.']
    ],
    features: ['Converts JPG/JPEG to lossless PNG', 'Batch queue of up to 25 files with ZIP export', 'High-definition pixel preservation', 'Instant browser download with no server latency'],
    privacy: 'Conversion happens inside your browser canvas. Files never leave your device.',
    uses: ['Converting photos to a lossless format for design work in Photoshop or Figma.', 'Preparing logos and artwork that require the PNG format.', 'Avoiding compression artifacts when editing photos repeatedly.'],
    faq: [
      ['Does converting JPG to PNG improve quality?', 'No. It can\'t restore detail that JPEG already discarded, but it stops further generation loss by creating a lossless copy.'],
      ['Can I convert multiple files at once?', 'Yes. Batch processing handles up to 25 files with a single ZIP download.']
    ]
  },
  {
    slug: 'png-to-jpg', name: 'PNG to JPG Converter', cat: 'image', label: 'Web Optimizer', icon: 'image', ad: 'creative',
    desc: 'Convert PNG to lightweight JPG with a custom background color for transparency.',
    intro: 'Convert PNG images to lightweight JPG with a custom background color for transparent areas.',
    keywords: 'png jpg jpeg convert background transparency smaller',
    formats: ['PNG (.png)'],
    accept: 'image/png,.png', maxMB: 25, maxFiles: 25,
    dropTitle: 'Drop one or multiple PNG images here',
    dropSub: 'Batch processing · In-browser · ZIP download',
    related: ['jpg-to-png', 'image-compressor', 'image-resizer'],
    howto: [
      ['Upload PNG', 'Drag and drop your PNG images.'],
      ['Configure Output', 'Select the JPG quality and the background color for transparent areas.'],
      ['Download JPG', 'Download files individually or as a ZIP.']
    ],
    features: ['Converts PNG to standard JPG', 'Batch queue with "Download All as ZIP"', 'Clean white (or custom) fill for transparent areas', 'Quality slider to control file size', 'Rapid client-side rendering'],
    privacy: 'No server uploads. Your images are rendered inside your browser.',
    uses: ['Turning heavy screenshots and PNG graphics into lightweight JPGs for email.', 'Uploading images to portals and forms that reject PNG.', 'Reducing storage used by large uncompressed PNG libraries.'],
    faq: [
      ['What happens to transparent PNG areas?', 'JPG doesn\'t support transparency, so transparent pixels are filled with a solid background color: white by default, or any color you choose.'],
      ['Will the JPG be smaller than the PNG?', 'Usually yes. For photos, JPGs are typically 50% to 80% smaller.']
    ]
  },
  {
    slug: 'pdf-to-jpg', name: 'PDF to JPG Converter', cat: 'pdf', label: 'Page Extraction', icon: 'fileImage', ad: 'privacy',
    desc: 'Convert PDF pages to high-resolution JPG images client-side, with no file limits.',
    intro: 'Convert PDF pages to high-resolution JPG images client-side, with no file limits.',
    keywords: 'pdf jpg image convert pages extract unlimited',
    formats: ['PDF (.pdf)'],
    accept: 'application/pdf,.pdf', maxFiles: 1,
    dropTitle: 'Drop your PDF document here to extract JPG pages',
    dropSub: 'Tanpa batasan ukuran file (Unlimited MB) · Rendered locally',
    related: ['jpg-to-pdf', 'merge-pdf', 'pdf-compressor', 'jpg-to-png'],
    howto: [
      ['Upload PDF', 'Select or drop your PDF file.'],
      ['Preview Pages', 'Browse thumbnails of every extracted page.'],
      ['Download JPGs', 'Save single pages or all of them at once as a ZIP.']
    ],
    features: ['Renders every page to JPG', 'Page preview before download', 'Individual or batch ZIP download', 'Selectable resolution (DPI) for sharp text'],
    privacy: 'PDFs are rendered locally via the browser canvas. Nothing is uploaded.',
    uses: ['Extracting presentation slides for social media.', 'Converting invoices, receipts, and certificates to images.', 'Inserting PDF pages into Word documents or web galleries.'],
    faq: [
      ['Does it work with multi-page PDFs?', 'Yes. Each page becomes a separate image, downloadable individually or as a ZIP.'],
      ['Will small text be readable?', 'Yes. Pages are rendered at high DPI so small fonts and tables stay crisp.']
    ]
  },
  {
    slug: 'jpg-to-pdf', name: 'JPG to PDF Converter (Foto ke PDF)', cat: 'pdf', label: 'Image to PDF', icon: 'fileImage', ad: 'privacy',
    desc: 'Ubah dan gabungkan foto JPG, JPEG, PNG, dan WebP menjadi satu dokumen PDF rapi langsung di browser tanpa batas ukuran.',
    intro: 'Konversi satu atau banyak foto / gambar (JPG, PNG, WebP) menjadi file dokumen PDF berkualitas tinggi. Atur urutan halaman, ukuran kertas (Fit / A4 / Letter), margin, dan orientasi secara instan dan 100% privat.',
    keywords: 'jpg to pdf foto ke pdf gambar ke pdf image to pdf convert jpeg png webp combine doc unlimited gratis',
    formats: ['JPG, JPEG, PNG, WebP, BMP'],
    accept: 'image/jpeg,image/png,image/webp,image/bmp,.jpg,.jpeg,.png,.webp,.bmp', maxFiles: 100,
    dropTitle: 'Tarik & lepas foto / gambar di sini untuk dijadikan PDF',
    dropSub: 'Mendukung multi-file JPG, PNG, WebP · Atur urutan halaman · 100% In-Browser & Unlimited MB',
    related: ['pdf-to-word', 'pdf-to-jpg', 'merge-pdf', 'pdf-compressor', 'image-compressor'],
    howto: [
      ['Pilih Foto / Gambar', 'Tarik atau pilih satu atau beberapa file foto (JPG, PNG, WebP).'],
      ['Atur Urutan & Tata Letak', 'Geser urutan halaman, pilih ukuran kertas (Fit / A4 / Letter), orientasi, dan margin.'],
      ['Konversi & Unduh PDF', 'Klik Konversi ke PDF lalu simpan dokumen PDF Anda seketika.']
    ],
    features: [
      'Gabungkan banyak foto sekaligus menjadi satu dokumen PDF',
      'Pilihan ukuran halaman: Sesuai Gambar (Fit), A4, Letter, atau Legal',
      'Orientasi otomatis (Auto-rotate) atau sesuaikan manual Portrait/Landscape',
      'Pilihan margin halaman (Tanpa Margin, Tipis, Normal, Lebar)',
      'Thumbnail preview & fitur urutkan halaman (Move Up / Down)',
      '100% Client-Side: File tidak pernah diunggah ke server'
    ],
    privacy: 'Proses konversi foto ke PDF berjalan 100% di browser Anda menggunakan Canvas & PDF-Lib. Foto Anda tidak pernah dikirim ke internet atau server.',
    uses: [
      'Menggabungkan foto dokumen, KTP, ijazah, atau kwitansi menjadi satu berkas PDF resmi.',
      'Membuat e-book foto atau kompilasi album gambar siap cetak.',
      'Mengirimkan tugas sekolah atau berkas lamaran kerja yang mensyaratkan format PDF.'
    ],
    faq: [
      ['Apakah bisa menggabungkan banyak foto sekaligus?', 'Ya, Anda bisa memasukkan puluhan hingga ratusan foto sekaligus dan mengurutkannya sesuai keinginan.'],
      ['Apakah kualitas gambar akan menurun?', 'Anda bisa memilih tingkat kualitas dari Tinggi (92%) hingga Maksimum (100% tanpa kompresi).'],
      ['Apakah ukuran halaman bisa seragam A4?', 'Bisa. Tersedia pilihan ukuran A4, Letter, Legal, maupun ukuran asli foto (Fit).']
    ]
  },
  {
    slug: 'pdf-to-word', name: 'PDF to Word Converter (PDF ke DOCX)', cat: 'pdf', label: 'PDF to DOCX', icon: 'file', ad: 'privacy',
    desc: 'Konversi file PDF menjadi dokumen Microsoft Word (.docx) yang dapat diedit langsung di browser tanpa upload server & tanpa batas ukuran.',
    intro: 'Ubah file PDF Anda menjadi dokumen Microsoft Word (.docx) yang 100% dapat diedit. Mempertahankan paragraf rapi, judul (heading), pemisahan halaman, dan teks dengan aman langsung di memori perangkat Anda tanpa batasan ukuran file.',
    keywords: 'pdf to word pdf ke docx konversi pdf word docx convert editable edit ubah dokumen gratis tanpa batas unlimited',
    formats: ['PDF (.pdf) → Word (.docx)'],
    accept: 'application/pdf,.pdf', maxFiles: 1,
    dropTitle: 'Tarik & lepas file PDF di sini untuk diubah ke Word (.docx)',
    dropSub: '100% In-Browser · Tanpa Batas Ukuran (Unlimited MB) · Format .docx Dapat Diedit Penuh',
    related: ['pdf-to-jpg', 'jpg-to-pdf', 'merge-pdf', 'split-pdf', 'pdf-compressor', 'file-translator'],
    howto: [
      ['Unggah File PDF', 'Tarik atau pilih dokumen PDF dari perangkat Anda (bebas ukuran MB).'],
      ['Pilih Mode Tata Letak', 'Pilih mode "Paragraf Rapi & Heading" untuk hasil dokumen natural atau "Presisi Baris" untuk baris per baris.'],
      ['Unduh File Word (.docx)', 'Sistem memproses di browser dan langsung mengunduh dokumen Word (.docx) yang siap diedit di MS Word, Google Docs, atau LibreOffice.']
    ],
    features: [
      'Konversi 100% Client-Side: File PDF tidak pernah diunggah ke server, menjaga kerahasiaan 100%',
      'Format Output Standar .docx (OpenXML) kompatibel penuh dengan Microsoft Word, Google Docs, dan WPS Office',
      'Ekstraksi cerdas: Deteksi judul otomatis (Heading 1 & Heading 2) berdasarkan ukuran font',
      'Pengelompokan paragraf cerdas: Menggabungkan baris yang terputus menjadi kalimat & paragraf utuh',
      'Dukungan rentang halaman: Konversi semua halaman atau halaman tertentu (contoh: 1-5, 8)',
      'Tanpa batas ukuran file: Mampu mengonversi dokumen PDF besar ratusan halaman',
      'Pratinjau teks & statistik lengkap: Jumlah kata, karakter, halaman, dan ukuran dokumen',
      'Tombol Salin Semua Teks untuk menyalin isi teks secara instan'
    ],
    privacy: 'Kerahasiaan terjamin mutlak: Pemrosesan PDF dan pembentukan file DOCX berlangsung 100% di memori browser lokal Anda.',
    uses: [
      'Mengedit dokumen PDF tugas kuliah, skripsi, atau laporan kantor di Microsoft Word.',
      'Mengubah PDF scan formulir, surat resmi, atau kontrak kerja menjadi teks dokumen yang bisa diubah.',
      'Mengekstrak teks bab atau halaman tertentu dari eBook atau buku PDF tebal.',
      'Memperbaiki dokumen yang salah ketik tanpa perlu mengetik ulang dari awal.'
    ],
    faq: [
      ['Apakah file DOCX hasil konversi bisa dibuka di Microsoft Word dan Google Docs?', 'Ya! File hasil konversi berformat standar OpenXML .docx yang kompatibel penuh dengan MS Word (2007 hingga versi terbaru), Office 365, Google Docs, LibreOffice Writer, dan WPS Office.'],
      ['Apakah ada batasan jumlah halaman atau ukuran file?', 'Tidak ada batasan! Karena diproses langsung menggunakan CPU perangkat Anda (In-Browser), Anda bisa mengonversi file berapapun ukurannya tanpa biaya dan tanpa kuota.'],
      ['Apakah dokumen saya aman?', 'Sangat aman! Berbeda dengan situs konverter online lain yang mengunggah dokumen Anda ke server asing, Ardan Tools memproses file 100% di peramban (browser) Anda. Data Anda tidak pernah keluar dari komputer atau HP Anda.'],
      ['Bagaimana cara kerja deteksi paragrafnya?', 'Ardan Tools membaca posisi koordinat (X dan Y) serta ukuran font dari setiap kata dalam PDF, lalu merekonstruksi baris-baris teks menjadi paragraf mengalir dan heading dokumen yang rapi.']
    ]
  },
  {
    slug: 'merge-pdf', name: 'Merge PDF Files', cat: 'pdf', label: 'Multi-Document', icon: 'merge', ad: 'privacy',
    desc: 'Combine multiple PDF documents into one file in your browser.',
    intro: 'Combine multiple PDF documents into a single file right in your browser.',
    keywords: 'merge combine join pdf documents unlimited',
    formats: ['PDF (.pdf)'],
    accept: 'application/pdf,.pdf', maxFiles: 100,
    dropTitle: 'Drop your PDF files here to merge',
    dropSub: 'Gabungkan file PDF tanpa batasan ukuran (Unlimited MB) · Susun urutan sebelum digabung',
    related: ['split-pdf', 'pdf-compressor', 'pdf-to-jpg'],
    howto: [
      ['Add PDF Files', 'Drop the files you want to combine.'],
      ['Arrange Sequence', 'Drag to reorder the files into your desired page order.'],
      ['Merge & Download', 'Click Merge PDF, then download the result.']
    ],
    features: ['Combine two or more PDFs into one file', 'Visual drag-and-drop reordering', 'Fast client-side assembly', 'No file count limit and no watermarks'],
    privacy: 'Documents are merged on your own machine. Nothing is uploaded.',
    uses: ['Combining scanned receipts into a monthly expense report.', 'Joining cover letters, resumes, and references into one application packet.', 'Merging chapters and reports into a complete binder.'],
    faq: [
      ['Is there a limit on how many PDFs I can merge?', 'Only your computer\'s memory limits it.'],
      ['Does merging add a watermark?', 'No. There are no watermarks, logos, or restrictions.']
    ]
  },
  {
    slug: 'split-pdf', name: 'Split PDF', cat: 'pdf', label: 'Page Extractor', icon: 'scissors', ad: 'privacy',
    desc: 'Extract the pages you need, or split a PDF into separate files by page ranges.',
    intro: 'Pick only the important pages from a PDF and save them as a new file, or split a document into separate PDFs by page ranges.',
    keywords: 'split pdf extract pages separate cut remove pages select unlimited',
    formats: ['PDF (.pdf)'],
    accept: 'application/pdf,.pdf', maxFiles: 1,
    dropTitle: 'Drop your PDF here to split or extract pages',
    dropSub: 'Bagi atau ekstrak PDF tanpa batasan ukuran (Unlimited MB) · Preview halaman diproses di browser',
    related: ['merge-pdf', 'pdf-compressor', 'pdf-to-jpg'],
    howto: [
      ['Upload PDF', 'Drop your document; every page appears as a thumbnail.'],
      ['Pick Pages', 'Click the pages you need, or type ranges like 1-3, 5, 8-10.'],
      ['Extract & Download', 'Save the selected pages as one PDF, or split into separate files (ZIP).']
    ],
    features: ['Visual page picker with live thumbnails', 'Type page ranges like 1-3, 5, 8-', 'Three modes: extract selected, split by ranges, or every page separately', 'Select all, clear, and invert shortcuts', 'Keeps original quality: pages are copied, not re-rendered', 'Multiple files are bundled in one ZIP'],
    privacy: 'Your PDF is split inside your browser. Nothing is uploaded or stored.',
    uses: ['Pulling only the signed pages out of a long contract.', 'Extracting one chapter or a few slides to share with classmates.', 'Splitting a scanned stack of documents into separate files.'],
    faq: [
      ['Does splitting reduce quality?', 'No. Pages are copied exactly as they are, so text stays sharp and selectable.'],
      ['How do I write page ranges?', 'Use commas and dashes: "1-3, 5, 8-10". "8-" means page 8 to the end. In Split by Ranges mode, each comma group becomes its own PDF.'],
      ['Can I change the page order?', 'Pages are saved in the order you type them in the range box, so "5, 1-3" puts page 5 first. Clicking thumbnails keeps the original order.']
    ]
  },
  {
    slug: 'base64-encode-decode', name: 'Base64 Encoder & Decoder', cat: 'developer', label: 'Developer Utility', icon: 'binary', ad: 'developer',
    desc: 'Encode text and images to Base64, or decode Base64 back to text.',
    intro: 'Encode text and images to Base64, or decode Base64 data back to readable text, right in your browser.',
    keywords: 'base64 encode decode data uri url-safe',
    formats: ['Plain Text', 'Binary Data URIs', 'UTF-8 Strings'],
    related: ['json-formatter', 'csv-to-json', 'word-counter'],
    howto: [
      ['Select Mode', 'Choose Encode or Decode.'],
      ['Enter or Paste Input', 'Add raw text, a Base64 string, or upload a file.'],
      ['Copy Output', 'Copy the result with one click.']
    ],
    features: ['Two-way live Encode and Decode tabs', 'Full UTF-8, international character, and emoji support', 'URL-safe mode (swaps + and / for - and _)', 'File-to-Base64 Data URL generator', 'Instant clipboard copy and clear controls'],
    privacy: 'All transformations run client-side in browser memory.',
    uses: ['Creating data URIs for inline CSS/HTML images.', 'Encoding API credentials for Basic Auth headers.', 'Decoding obfuscated configuration strings and web tokens.'],
    faq: [
      ['Does it support emoji and foreign languages?', 'Yes. Text is converted to UTF-8 bytes before encoding, so every character round-trips correctly.'],
      ['Is my confidential data safe?', 'Yes. Processing happens in browser memory and nothing is sent to any server.'],
      ['What is URL-safe Base64?', 'A variant that replaces + and / with - and _ (and drops padding) so the string can be used safely in URLs and query parameters.']
    ]
  },
  {
    slug: 'csv-to-json', name: 'CSV to JSON Converter', cat: 'developer', label: 'Data Parser', icon: 'table', ad: 'developer',
    desc: 'Convert spreadsheet CSV into JSON arrays and JSON back to CSV.',
    intro: 'Convert spreadsheet-style CSV data into structured JSON arrays, and convert JSON back to CSV.',
    keywords: 'csv json convert tsv spreadsheet excel table',
    formats: ['CSV (.csv)', 'TSV (.tsv)', 'JSON (.json)'],
    related: ['json-formatter', 'base64-encode-decode', 'word-counter'],
    howto: [
      ['Select Direction', 'Choose CSV to JSON or JSON to CSV mode.'],
      ['Paste or Upload', 'Enter table data or upload a .csv/.json file.'],
      ['Convert & Download', 'Copy the result or download it as a file.']
    ],
    features: ['Bidirectional conversion (CSV ↔ JSON)', 'Flexible delimiters: comma, semicolon, tab, pipe', 'Automatic number and boolean parsing', 'Header row toggle and adjustable JSON indentation', 'File upload and one-click JSON/CSV download'],
    privacy: 'Data is converted in browser memory and never stored.',
    uses: ['Data analysts converting Excel or Google Sheets exports to JSON for database ingestion.', 'Frontend engineers seeding test databases from CSV files.', 'Converting JSON API payloads to CSV for Excel.'],
    faq: [
      ['What about quoted values that contain commas?', 'The parser follows RFC 4180, preserving quoted fields, embedded line breaks, and escaped quotes.'],
      ['Can it handle large CSV files?', 'Yes. Client-side processing handles standard datasets quickly with no upload limits.'],
      ['Does it support European semicolon CSVs?', 'Yes. Select the semicolon delimiter (or tab/pipe) from the dropdown.']
    ]
  },
  {
    slug: 'case-converter', name: 'Case Converter', cat: 'text', label: 'Text Manipulation', icon: 'case', ad: 'privacy',
    desc: 'Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more.',
    intro: 'Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and more.',
    keywords: 'case convert uppercase lowercase title camel snake kebab',
    formats: ['Plain Text', 'Clipboard Content'],
    related: ['word-counter', 'json-formatter', 'base64-encode-decode'],
    howto: [
      ['Enter Text', 'Type or paste text into the text area.'],
      ['Select Case Style', 'Click any casing button to transform the text.'],
      ['Copy Result', 'Copy the output to your clipboard.']
    ],
    features: ['Nine casing styles, from UPPERCASE to CONSTANT_CASE', 'Live word, character, and line counters', 'One-click copy and clear', 'Smart Title Case that skips short prepositions and conjunctions', 'Instant client-side transformation'],
    privacy: 'Transformations run entirely in your browser.',
    uses: ['Fixing text accidentally typed with Caps Lock on.', 'Formatting blog post headlines and article titles in Title Case.', 'Converting database column names into programming variables (camelCase or snake_case).'],
    faq: [
      ['What does Title Case do?', 'It capitalizes each word except short articles, prepositions, and conjunctions (like "a", "of", "and"), unless they start the title.'],
      ['Is this suitable for code variable naming?', 'Yes. camelCase, snake_case, kebab-case, and CONSTANT_CASE are built for developers.'],
      ['How does Sentence case work?', 'It lowercases the text and capitalizes only the first letter of each sentence.']
    ]
  },
  {
    slug: 'markdown-to-html', name: 'Markdown Editor & HTML Preview', cat: 'text', label: 'Live Split Preview', icon: 'markdown', ad: 'privacy',
    desc: 'Live split-view Markdown editor with HTML export and document stats.',
    intro: 'A live Markdown editor with split preview, HTML export, and document statistics.',
    keywords: 'markdown md html editor preview readme gfm',
    formats: ['Markdown (.md, .markdown)', 'Plain Text (.txt)', 'HTML5 Output'],
    related: ['word-counter', 'case-converter', 'css-html-minifier'],
    howto: [
      ['Write or Paste Markdown', 'Enter content in the left editor panel.'],
      ['Review Live Preview', 'The formatted preview or HTML code updates on the right.'],
      ['Export or Copy', 'Use Copy HTML or Download .html.']
    ],
    features: ['Real-time side-by-side editing and preview', 'Headings, code blocks, tables, blockquotes, lists, and links', 'Live word, character, and line counts', 'One-click copy of the HTML output', 'Export to a standalone .html document'],
    privacy: 'Your document stays in your browser and is never stored on any server.',
    uses: ['Technical writers previewing README files before publishing to GitHub.', 'Bloggers converting Markdown notes into HTML snippets for WordPress or Ghost.', 'Writing formatted notes and exporting them as standalone web documents.'],
    faq: [
      ['Does it support GitHub Flavored Markdown?', 'Yes. Tables, fenced code blocks, strikethrough, and task lists are supported.'],
      ['Is my document uploaded?', 'No. Parsing runs entirely in your local browser.'],
      ['Can I download a standalone HTML file?', 'Yes. The export produces a complete HTML5 file with clean built-in styling.']
    ]
  },
  {
    slug: 'hash-uuid-generator', name: 'Hash & UUID Generator', cat: 'developer', label: 'Crypto Utility', icon: 'hash', ad: 'developer',
    desc: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes and UUID v4 values.',
    intro: 'Generate cryptographic hashes (MD5, SHA-1, SHA-256, SHA-512) and random UUID v4 identifiers instantly.',
    keywords: 'hash md5 sha sha256 sha512 uuid guid generate checksum',
    formats: ['UUID v4', 'SHA-256', 'SHA-512', 'SHA-1', 'MD5'],
    related: ['base64-encode-decode', 'json-formatter', 'csv-to-json'],
    howto: [
      ['Select Mode', 'Choose the UUID generator or the hash calculator.'],
      ['Configure Options', 'Set the bulk count and formatting, or enter the text to hash.'],
      ['Copy Output', 'Copy individual values or the full list.']
    ],
    features: ['Cryptographically secure UUID v4 generation, single or bulk up to 50', 'Instant SHA-256, SHA-512, and SHA-1 hashing via the Web Crypto API', 'MD5 message digest calculation', 'Uppercase/lowercase formatting and optional hyphen removal', 'Hash text or any local file for checksums', 'One-click copy for single or all results'],
    privacy: 'Hashes and UUIDs are generated locally on your device.',
    uses: ['Generating primary keys and mock data UUIDs for database tables.', 'Verifying file integrity with MD5 and SHA-256 checksums.', 'Creating unique tracking tokens and session IDs without backend scripts.'],
    faq: [
      ['Are the UUIDs truly random?', 'Yes. They use the browser\'s cryptographically secure random generator and follow RFC 4122 version 4.'],
      ['Can I hash passwords securely here?', 'Calculations run locally without any network transmission. Note that for storing passwords, use a slow salted algorithm such as bcrypt or Argon2 rather than plain SHA or MD5.'],
      ['What is the difference between SHA-256 and MD5?', 'SHA-256 is a modern, collision-resistant hash recommended for security. MD5 is a fast 128-bit hash that is now mainly used for legacy file integrity checks.']
    ]
  },
  {
    slug: 'svg-to-png', name: 'SVG to PNG & JPG Converter', cat: 'image', label: 'Vector Raster', icon: 'pen', ad: 'creative',
    desc: 'Rasterize SVG vectors to PNG or JPG at up to 8x resolution.',
    intro: 'Convert SVG vector graphics to raster PNG or JPG images with up to 8x high-resolution scaling.',
    keywords: 'svg png jpg convert vector rasterize icon',
    formats: ['SVG (.svg)'],
    accept: 'image/svg+xml,.svg', maxMB: 10, maxFiles: 25,
    dropTitle: 'Drop SVG files here or browse',
    dropSub: '1 to 25 SVG files · Rendered locally',
    related: ['jpg-to-png', 'png-to-jpg', 'image-resizer'],
    howto: [
      ['Upload SVG Files', 'Drop one or more .svg files into the upload zone.'],
      ['Choose Scale & Format', 'Select a scale factor (e.g. 2x, 4x) and PNG or JPG output.'],
      ['Download Images', 'Download each file or all of them as one ZIP.']
    ],
    features: ['Sharp rasterization with 1x, 2x, 4x, and 8x multipliers', 'Lossless transparent PNG or compact JPEG export', 'Custom background color for JPEG export', 'Multi-file batch conversion with Download All as ZIP', '100% client-side Canvas rendering'],
    privacy: 'SVG files are parsed and rasterized locally in your browser memory.',
    uses: ['UI designers converting vector icons to PNG for app icons and favicons.', 'Preparing vector logos for presentations, Word documents, and email signatures.', 'Rasterizing complex SVG artwork at 4x or 8x for print-quality output.'],
    faq: [
      ['Will my converted PNG be blurry?', 'No. Choose 2x or 4x scale to produce high-DPI images without pixelation.'],
      ['Is alpha transparency preserved?', 'Yes. PNG export keeps transparent backgrounds.'],
      ['Can I convert multiple SVG icons at once?', 'Yes. Convert up to 25 SVGs and download them as one ZIP.']
    ]
  },
  {
    slug: 'css-html-minifier', name: 'CSS & HTML Minifier', cat: 'developer', label: 'Code Optimizer', icon: 'code', ad: 'developer',
    desc: 'Compress CSS and HTML by stripping whitespace, comments, and line breaks.',
    intro: 'Compress CSS and HTML code by removing unnecessary whitespace, comments, and line breaks, or beautify it back.',
    keywords: 'minify css html compress beautify format code',
    formats: ['CSS (.css)', 'HTML (.html, .htm)'],
    related: ['json-formatter', 'markdown-to-html', 'base64-encode-decode'],
    howto: [
      ['Paste Your Code', 'Paste CSS or HTML into the input panel.'],
      ['Select Action', 'Choose Minify to compress or Beautify to format.'],
      ['Copy or Download', 'Copy the result or download it as a file.']
    ],
    features: ['Dual-mode support for CSS and HTML', 'Minify removes comments, line breaks, and whitespace', 'Beautify applies consistent indentation', 'Real-time statistics for bytes saved and percentage reduction', 'One-click copy and file download'],
    privacy: 'Your code stays on your device. All processing happens client-side in browser memory.',
    uses: ['Webmasters reducing stylesheet sizes before production deployment.', 'Beautifying minified or obfuscated HTML for debugging.', 'Optimizing inline HTML email templates for faster delivery.'],
    faq: [
      ['Will minification break my CSS?', 'No. It removes only redundant spaces and comments and keeps every rule and selector intact.'],
      ['Is it safe for private code?', 'Yes. Processing runs in your browser with no network requests.'],
      ['How does minification improve SEO?', 'Smaller documents download and render faster, which can improve Core Web Vitals such as LCP and FCP.']
    ]
  },
  {
    slug: 'random-number-generator', name: 'Random Number Generator (RNG)', cat: 'developer', label: 'CSPRNG Randomizer', icon: 'dice', ad: 'developer',
    desc: 'Generate truly random numbers, roll virtual dice, flip coins, or pick random items with cryptographic entropy.',
    intro: 'Generate random numbers within any range, roll dice, flip coins, or pick raffle winners securely using the browser\'s Web Crypto API.',
    keywords: 'rng random number generator dice roll coin flip lucky draw picker lottery',
    formats: ['Integer Ranges', 'Decimals', 'Unique Sets', 'List / Raffle Picker', 'Dice & Coins'],
    related: ['hash-uuid-generator', 'word-counter', 'json-formatter'],
    howto: [
      ['Choose Mode', 'Select Random Numbers, Dice Roller, Coin Flipper, or List Randomizer.'],
      ['Set Range & Options', 'Specify the minimum, maximum, count, and duplicate rules.'],
      ['Generate & Copy', 'Click Generate to produce results and copy or download with one click.']
    ],
    features: ['Cryptographically secure random generation (Web Crypto API)', 'Custom minimum & maximum integer ranges', 'Batch generation up to 1,000 numbers at once', 'Unique numbers option (no duplicates)', 'Virtual dice roller (d4, d6, d8, d10, d12, d20, d100)', 'Coin flip simulator (Heads / Tails) with statistics', 'Random list / winner picker with shuffle', 'One-click copy and export to .txt'],
    privacy: 'All random numbers and items are generated 100% locally on your machine using your browser\'s Web Crypto API. No data is sent to any server.',
    uses: ['Picking giveaway winners, raffles, and lucky draw contests fairly.', 'Rolling virtual dice for tabletop RPGs (D&D) and board games.', 'Generating test datasets and sampling statistics for developers.', 'Making quick, unbiased decisions and coin tosses.'],
    faq: [
      ['Is this generator truly random?', 'Yes. It uses crypto.getRandomValues(), the modern standard for cryptographically secure pseudo-random number generation (CSPRNG).'],
      ['Can I generate numbers without duplicates?', 'Yes. Check "Unique Only" to ensure every generated number in the batch is distinct.'],
      ['Can I access this via /tools/rng?', 'Yes, /tools/rng and /tools/random-number-generator both open this tool directly.']
    ]
  }
];

window.TOOL_MAP = {};
window.TOOLS.forEach(function (t) { window.TOOL_MAP[t.slug] = t; });
if (window.TOOL_MAP['random-number-generator']) {
  window.TOOL_MAP['rng'] = window.TOOL_MAP['random-number-generator'];
}
if (window.TOOL_MAP['file-translator']) {
  window.TOOL_MAP['translate-file'] = window.TOOL_MAP['file-translator'];
  window.TOOL_MAP['translite-file'] = window.TOOL_MAP['file-translator'];
  window.TOOL_MAP['translate'] = window.TOOL_MAP['file-translator'];
  window.TOOL_MAP['translate-pdf'] = window.TOOL_MAP['file-translator'];
  window.TOOL_MAP['pdf-translator'] = window.TOOL_MAP['file-translator'];
}
if (window.TOOL_MAP['hd-photo-enhancer']) {
  window.TOOL_MAP['pembuat-foto-hd'] = window.TOOL_MAP['hd-photo-enhancer'];
  window.TOOL_MAP['foto-hd'] = window.TOOL_MAP['hd-photo-enhancer'];
  window.TOOL_MAP['photo-hd'] = window.TOOL_MAP['hd-photo-enhancer'];
  window.TOOL_MAP['hd-photo'] = window.TOOL_MAP['hd-photo-enhancer'];
  window.TOOL_MAP['penjernih-foto'] = window.TOOL_MAP['hd-photo-enhancer'];
  window.TOOL_MAP['upscale-image'] = window.TOOL_MAP['hd-photo-enhancer'];
}
if (window.TOOL_MAP['pdf-to-word']) {
  window.TOOL_MAP['pdf-ke-word'] = window.TOOL_MAP['pdf-to-word'];
  window.TOOL_MAP['pdf-to-docx'] = window.TOOL_MAP['pdf-to-word'];
  window.TOOL_MAP['pdf-ke-docx'] = window.TOOL_MAP['pdf-to-word'];
  window.TOOL_MAP['pdf2word'] = window.TOOL_MAP['pdf-to-word'];
  window.TOOL_MAP['pdf2docx'] = window.TOOL_MAP['pdf-to-word'];
}
