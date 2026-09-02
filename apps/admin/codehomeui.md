<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Bandung Heritage | Modern Travel</title>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<!-- Google Fonts: Outfit -->
<link href="https://fonts.googleapis.com" rel="preconnect">
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet">
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Tailwind Config -->
<script id="tailwind-config">
  tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        "colors": {
                "bandung-putih": "#FFFFFF",
                "on-surface-variant": "#3f4a3e",
                "background": "#fcf9f8",
                "surface-container-high": "#eae7e7",
                "on-primary-container": "#a1ffad",
                "on-primary": "#ffffff",
                "outline": "#6f7a6d",
                "bandung-biru": "#005CB9",
                "surface-dim": "#dcd9d9",
                "secondary-container": "#fecb00",
                "surface": "#fcf9f8",
                "surface-container-lowest": "#ffffff",
                "tertiary-fixed": "#d7e3ff",
                "surface-container": "#f0eded",
                "inverse-on-surface": "#f3f0ef",
                "bandung-kuning": "#FFCC00",
                "surface-bright": "#fcf9f8",
                "tertiary-fixed-dim": "#aac7ff",
                "on-tertiary-fixed": "#001b3e",
                "secondary-fixed-dim": "#f1c100",
                "inverse-surface": "#313030",
                "surface-tint": "#006e2d",
                "error-container": "#ffdad6",
                "inverse-primary": "#77dc88",
                "error": "#ba1a1a",
                "on-secondary": "#ffffff",
                "primary-container": "#007a33",
                "on-error": "#ffffff",
                "secondary-fixed": "#ffe08b",
                "on-primary-fixed": "#002109",
                "on-surface": "#1c1b1b",
                "outline-variant": "#becabb",
                "on-tertiary-container": "#e2eaff",
                "on-primary-fixed-variant": "#005320",
                "tertiary-container": "#1e68c5",
                "primary": "#005e26",
                "on-background": "#1c1b1b",
                "bandung-hijau": "#007A33",
                "surface-container-low": "#f6f3f2",
                "surface-container-highest": "#e5e2e1",
                "secondary": "#745b00",
                "bandung-hitam": "#1A1A1A",
                "on-tertiary-fixed-variant": "#00458e",
                "tertiary": "#0050a2",
                "on-secondary-container": "#6e5700",
                "surface-variant": "#e5e2e1",
                "on-tertiary": "#ffffff",
                "on-error-container": "#93000a",
                "primary-fixed": "#93f9a2",
                "primary-fixed-dim": "#77dc88",
                "on-secondary-fixed": "#241a00",
                "on-secondary-fixed-variant": "#584400"
        },
        "borderRadius": {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
        },
        "spacing": {
                "section-gap-lg": "100px",
                "section-gap-md": "64px",
                "margin-desktop": "40px",
                "margin-mobile": "16px",
                "gutter": "24px",
                "container-max": "1280px",
                "unit": "8px"
        },
        "fontFamily": {
                "body-lg": [
                        "Outfit"
                ],
                "body-sm": [
                        "Outfit"
                ],
                "display-lg": [
                        "Outfit"
                ],
                "headline-sm": [
                        "Outfit"
                ],
                "label-sm": [
                        "Outfit"
                ],
                "body-md": [
                        "Outfit"
                ],
                "label-caps": [
                        "Outfit"
                ],
                "headline-lg": [
                        "Outfit"
                ],
                "display-lg-mobile": [
                        "Outfit"
                ],
                "headline-md": [
                        "Outfit"
                ]
        },
        "fontSize": {
                "body-lg": [
                        "20px",
                        {
                                "lineHeight": "32px",
                                "fontWeight": "500"
                        }
                ],
                "body-sm": [
                        "14px",
                        {
                                "lineHeight": "20px",
                                "fontWeight": "400"
                        }
                ],
                "display-lg": [
                        "72px",
                        {
                                "lineHeight": "80px",
                                "letterSpacing": "-0.02em",
                                "fontWeight": "800"
                        }
                ],
                "headline-sm": [
                        "24px",
                        {
                                "lineHeight": "32px",
                                "fontWeight": "700"
                        }
                ],
                "label-sm": [
                        "11px",
                        {
                                "lineHeight": "14px",
                                "fontWeight": "600"
                        }
                ],
                "body-md": [
                        "16px",
                        {
                                "lineHeight": "24px",
                                "fontWeight": "400"
                        }
                ],
                "label-caps": [
                        "12px",
                        {
                                "lineHeight": "16px",
                                "letterSpacing": "0.1em",
                                "fontWeight": "700"
                        }
                ],
                "headline-lg": [
                        "48px",
                        {
                                "lineHeight": "56px",
                                "fontWeight": "800"
                        }
                ],
                "display-lg-mobile": [
                        "48px",
                        {
                                "lineHeight": "52px",
                                "letterSpacing": "-0.02em",
                                "fontWeight": "800"
                        }
                ],
                "headline-md": [
                        "32px",
                        {
                                "lineHeight": "40px",
                                "fontWeight": "700"
                        }
                ]
        }
},
    },
  }
</script>
<style>
        body {
            font-family: 'Outfit', sans-serif;
            background-color: #ffffff; /* surface-container-lowest */
            color: #1c1b1b; /* on-surface */
        }
        .scrim-bottom {
            background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%);
        }
        .scrim-full {
            background: rgba(0,0,0,0.4);
        }
    </style>
</head>
<body class="antialiased">
<!-- Header / TopNavBar -->
<header class="absolute top-0 w-full z-50 bg-transparent border-b border-white/20">
<div class="flex justify-between items-center px-gutter py-6 max-w-container-max mx-auto">
<a class="font-headline-md text-headline-md font-bold text-white tracking-widest uppercase text-xl" href="#">B. Heritage</a>
<nav class="hidden md:flex space-x-12 items-center">
<a class="text-white font-bold text-label-caps uppercase tracking-widest hover:text-bandung-kuning transition-colors" href="#">Destinations</a>
<a class="text-white/80 font-bold text-label-caps uppercase tracking-widest hover:text-white transition-colors" href="#">Events</a>
<a class="text-white/80 font-bold text-label-caps uppercase tracking-widest hover:text-white transition-colors" href="#">News</a>
<a class="text-white/80 font-bold text-label-caps uppercase tracking-widest hover:text-white transition-colors" href="#">Gallery</a>
</nav>
<div class="flex items-center space-x-8">
<button class="text-white hover:text-bandung-kuning transition-colors">
<span class="material-symbols-outlined" data-icon="search">search</span>
</button>
<a class="hidden md:inline-flex bg-white text-on-surface font-bold py-3 px-8 text-label-caps uppercase tracking-widest hover:bg-bandung-hijau hover:text-white transition-colors" href="#">Plan Trip</a>
</div>
</div>
</header>
<!-- Hero Section -->
<section class="relative h-[900px] md:h-screen w-full flex items-center justify-center pt-20">
<div class="absolute inset-0 z-0">
<div class="bg-cover bg-center w-full h-full" data-alt="A sweeping, majestic high-resolution photograph of Bandung city landscape blending lush green mountains with modern and colonial architecture during golden hour. Soft, warm sunlight illuminates the urban heritage setting. The mood is inviting and premium." style="background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuCi-cYAMuGcDi6UB0SDXdjFibf5BDzTv2OQnbBN4XNMA6ixkPkvcD6wXvwgZNO5UYJL7HLaxCUdB_o8r6ihK1tz39GPwtzJuFgogFLgvH20IhCmEQLTxxbh7IHoyhQTFg4byoCQigfv9dbXQquWM6XFMZrAinNSD_Y1ydZxaAMVvq00P7tAakhI4KOWz8ysYee18OMyc01nWSbiTEncIzNVA7u1VYz8kXxA-xCQhZokYZ7tjEO6yADVlw&quot;);"></div>
<div class="absolute inset-0 scrim-full"></div>
</div>
<div class="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center mt-20">
<h1 class="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-8 uppercase tracking-widest">
                Jelajahi Bandung
            </h1>
<p class="font-body-lg text-body-lg text-white/90 mb-16 max-w-3xl tracking-wide">
                Where tradition meets innovation. Experience the perfect blend of rich cultural heritage and vibrant modern lifestyle in the heart of West Java.
            </p>
<!-- Discovery Bar -->
<div class="bg-white w-full max-w-3xl p-1 flex items-center rounded-DEFAULT shadow-lg">
<div class="flex-grow px-6 flex items-center border-r border-outline-variant/30 py-4">
<span class="material-symbols-outlined text-bandung-hijau mr-4" data-icon="location_on">location_on</span>
<input class="w-full bg-transparent border-none text-on-surface placeholder:text-on-surface-variant/70 focus:ring-0 font-body-md text-body-md uppercase tracking-wider" placeholder="Where do you want to go?" type="text">
</div>
<div class="px-6 hidden sm:flex items-center border-r border-outline-variant/30 py-4">
<span class="material-symbols-outlined text-bandung-hijau mr-4" data-icon="calendar_today">calendar_today</span>
<input class="w-24 bg-transparent border-none text-on-surface placeholder:text-on-surface-variant/70 focus:ring-0 font-body-md text-body-md uppercase tracking-wider" placeholder="Dates" type="text">
</div>
<button class="bg-bandung-hijau text-white px-10 py-5 font-bold hover:bg-bandung-biru hover:text-white transition-colors flex items-center text-label-caps uppercase tracking-widest rounded-r-DEFAULT">
                    Explore
                </button>
</div>
</div>
</section>
<!-- Calendar of Events Section -->
<section class="py-[100px] px-gutter max-w-container-max mx-auto">
<div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 border-b border-outline-variant/30 pb-8">
<div>
<span class="font-label-caps text-label-caps text-bandung-hijau uppercase tracking-widest mb-4 block">Upcoming Highlights</span>
<h2 class="font-headline-lg text-headline-lg text-on-surface uppercase tracking-widest">Calendar 2027</h2>
</div>
<a class="mt-8 md:mt-0 text-bandung-hijau font-bold flex items-center hover:text-bandung-biru transition-colors text-label-caps uppercase tracking-widest" href="#">
                View All Events <span class="material-symbols-outlined ml-4" data-icon="arrow_forward">arrow_forward</span>
</a>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-16">
<!-- Event Card 1 -->
<div class="group cursor-pointer flex flex-col">
<div class="w-full h-80 relative mb-8 overflow-hidden rounded-lg">
<img class="object-cover w-full h-full transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" data-alt="A vibrant, high-energy photo of a cultural festival in Bandung with colorful traditional costumes, dynamic lighting, and a modern stage setup. The aesthetic is lively and premium." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZi7EGPW9NT_lWPtHVastJlZNiRPjlARKsxosVL2uwCwCtvwLoenvNkKCxxVPxV1PzyZDS9xtN84YEtOdlL4BjeaPTnZ4Mh9cGNWFglIVRaO18Po5Ksh9zZT82NxjC4UVZ0rT0hpLhYheZZmOLDPnBvhMNLmKXLxeKEfNvNpwquXgRUv1nezO9Pspv-Q81jvvUUzGV6AGhGRbTPPm7fX9sGoIW5Twvspi-8MGaSpcMxSMKsbPpI1Pesw">
</div>
<div class="flex-1 flex flex-col justify-between">
<div>
<div class="flex items-center space-x-4 mb-4">
<span class="border border-bandung-hijau text-bandung-hijau px-3 py-1 font-label-caps text-[10px] tracking-widest rounded-DEFAULT">CULTURE</span>
<span class="text-on-surface-variant font-label-caps tracking-widest">OCT 15 - 20, 2027</span>
</div>
<h3 class="font-headline-md text-headline-md text-on-surface mb-4 uppercase tracking-wider group-hover:text-bandung-hijau transition-colors">Bandung Art Festival</h3>
<p class="text-on-surface-variant font-body-md line-clamp-2 leading-relaxed tracking-wide">A week-long celebration of local arts, crafts, and contemporary performances across the city.</p>
</div>
</div>
</div>
<!-- Event Card 2 -->
<div class="group cursor-pointer flex flex-col">
<div class="w-full h-80 relative mb-8 overflow-hidden rounded-lg">
<img class="object-cover w-full h-full transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" data-alt="A sleek, modern photograph of an international conference setting in Bandung. High-tech lighting, sophisticated delegates, and contemporary architecture. Premium travel aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7gf7W0vVY89G2JjfX--86RCAse1suMGypBFZ_SzskUmKo_onxkX_gI2NgQc_VMYFg9wMyXmee26PsYL55u8FjOf7OZqx1fSsCIXv7Lz73vc2D_sTPbY7ZP9AbuV7YQi8aZcWz5-XF7qKWgK303GVmtxlSsXXu8bdlS0NVbFflCxO2MNmxvA61QZpxSmfJ2ShkUj5NDjlOmaiHUBJ5vwnkdwf9FNA0jyTQpKF46ujqG47745QTq_Jwtw">
</div>
<div class="flex-1 flex flex-col justify-between">
<div>
<div class="flex items-center space-x-4 mb-4">
<span class="border border-bandung-hijau text-bandung-hijau px-3 py-1 font-label-caps text-[10px] tracking-widest rounded-DEFAULT">BUSINESS</span>
<span class="text-on-surface-variant font-label-caps tracking-widest">NOV 05 - 08, 2027</span>
</div>
<h3 class="font-headline-md text-headline-md text-on-surface mb-4 uppercase tracking-wider group-hover:text-bandung-hijau transition-colors">Global Tech Summit</h3>
<p class="text-on-surface-variant font-body-md line-clamp-2 leading-relaxed tracking-wide">Bringing together innovators and leaders for a forward-thinking conference in the mountains.</p>
</div>
</div>
</div>
</div>
</section>
<!-- Recommended Destinations Bento Grid -->
<section class="py-[100px] px-gutter max-w-container-max mx-auto bg-surface-container-lowest">
<div class="text-center mb-20 border-b border-outline-variant/30 pb-8">
<span class="font-label-caps text-label-caps text-bandung-hijau uppercase tracking-widest mb-4 block">Eksplorasi</span>
<h2 class="font-headline-lg text-headline-lg text-on-surface uppercase tracking-widest">Destinasi</h2>
</div>
<div class="grid grid-cols-1 md:grid-cols-4 grid-rows-[auto_auto] gap-8 md:h-[800px]">
<!-- Main Large Card -->
<div class="md:col-span-2 md:row-span-2 relative overflow-hidden group cursor-pointer h-[400px] md:h-auto rounded-lg">
<img class="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" data-alt="A stunning, wide-angle architectural shot of Gedung Sate in Bandung, framed against a clear blue sky. The historic building is sharply detailed, reflecting urban heritage style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwa_B54cQdzXwkzavShk3TH9Nvs-YcQkSphddgA2rKMgdLOriKeqVNqlSLdpzEyml3guqqhvaLnngYeTUCM-XyQzGAKKkBTKfW93UFH83aBa_5JFbPtq_7x5LEUrL5UjNUuH2Q_olvLrDQRMgWxfCjvhrIQiOTR8oAtOiAhZebVYH_4dhQe4GLNAfCmesid_N6D32W5dOl2pA3pCSV1TMIaNtGks62_6AuqXho3NqH7lVVunfL4rnRRg">
<div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>
<div class="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/80 to-transparent">
<span class="border border-bandung-kuning text-bandung-kuning px-4 py-2 font-label-caps text-[10px] mb-4 inline-block tracking-widest rounded-DEFAULT">IKON KOTA</span>
<h3 class="font-headline-lg text-headline-lg text-white uppercase tracking-widest">Gedung Sate</h3>
</div>
</div>
<!-- Top Right Card -->
<div class="md:col-span-2 relative overflow-hidden group cursor-pointer h-[350px] md:h-auto rounded-lg">
<img class="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" data-alt="A picturesque view of Alun-Alun Bandung, the city square, featuring lush green synthetic grass and the Grand Mosque in the background. Sunny, inviting, and clean." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8BMwVed8tbNIeCwhRtbMFCTehLGFujV-vV-nxUSu7KewvC3MwDd99GilEHwmBlLivxwuo0Tj6DUxUYPsEpgYqOJRtTiN8yX_UBLI2uY3ZJQ3VQhevLNSs9dh3sEumLn6LEsRvKSLm8l6v5hHtjyOOfPnFGurDv5oHFBfKQsVj1j0jjuxS1u68Kpr376yAddmSyX0bBMyMfYCa7VkfjhKfTrGbVgc2S3x1Q0hzS0JRbTA5DdDDjfpZUQ">
<div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>
<div class="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/80 to-transparent">
<span class="border border-bandung-kuning text-bandung-kuning px-4 py-2 font-label-caps text-[10px] mb-4 inline-block tracking-widest rounded-DEFAULT">ALAM &amp; REKREASI</span>
<h3 class="font-headline-md text-headline-md text-white uppercase tracking-widest">Alun-Alun</h3>
</div>
</div>
<!-- Bottom Right Small Cards -->
<div class="md:col-span-1 relative overflow-hidden group cursor-pointer h-[350px] md:h-auto rounded-lg">
<img class="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" data-alt="A lively street photography shot of Jalan Braga in Bandung, showcasing colonial-era buildings, vintage lamps, and stylish pedestrians. Rich textures and warm tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDD0O59m2dy_0AlbRNh9p_-VG0d0CeRspguSvv_VPTMuyF35ZqK7Pj-g9XQi7Rzl2_v6WO0nUAfSQoYPzRge7trqgn3CSupf_Z1nvM8jmJRV49I4mHFEr9_gsIhV3dy8dmkpw22NiiFVhhXy1FLEfFwq58n5te03cLG_WAWRCxRbw7rLkYH7YT0sgB1hxfXQk0C8HHbvhtUqwOyIt7XYDseiBCwMlpwtcndGTiTggFVjRgg3Go6cAprbQ">
<div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>
<div class="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black/80 to-transparent">
<span class="border border-bandung-kuning text-bandung-kuning px-3 py-1 font-label-caps text-[10px] mb-3 inline-block tracking-widest rounded-DEFAULT">WARISAN</span>
<h3 class="font-body-lg text-body-lg font-bold text-white uppercase tracking-wider">Jalan Braga</h3>
</div>
</div>
<div class="md:col-span-1 relative overflow-hidden bg-bandung-hijau group cursor-pointer flex flex-col items-center justify-center p-8 text-center h-[350px] md:h-auto hover:bg-bandung-hitam transition-colors duration-500 rounded-lg">
<h3 class="font-headline-md text-headline-md text-white mb-6 uppercase tracking-widest">50+<br>Destinasi</h3>
<span class="text-white font-label-caps text-label-caps flex items-center uppercase tracking-widest border-b border-white pb-1">
                    Jelajahi <span class="material-symbols-outlined ml-3 text-sm" data-icon="arrow_forward">arrow_forward</span>
</span>
</div>
</div>
</section>
<!-- News & Articles -->
<section class="py-[100px] px-gutter max-w-container-max mx-auto">
<div class="text-center mb-20 border-b border-outline-variant/30 pb-8">
<span class="font-label-caps text-label-caps text-bandung-hijau uppercase tracking-widest mb-4 block">Update Terkini</span>
<h2 class="font-headline-lg text-headline-lg text-on-surface uppercase tracking-widest">Artikel</h2>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-12">
<!-- Article 1 -->
<div class="group cursor-pointer">
<div class="relative w-full h-80 overflow-hidden mb-6 rounded-lg">
<img class="w-full h-full object-cover transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" data-alt="A mouth-watering close-up of traditional Indonesian pastries and cakes displayed beautifully in a vintage bakery on Jalan Braga, Bandung. Warm, appetizing lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYjCgFvyXW9-d8iTiA6oDPnjPZmsc5m6a4Ll2oLZVOYPwa0Ke5sXg2oyBpmBqOXrbPoi08Kq6nQovV-MjH0geIgJt96JtCB3W5Hm3I6UXjbglLWztjPb7NOlx08431EN3EgYb3tq6l4v27Xyg3XA7B1kVH9-vFXh13sc7o4b9nGs_D6c-GP1dm9x1AN4o4nUfd8287y1uA4f3Wts4U4NMxdJpnSYV71CkxJVK7PV1-gJcbZL9SM0ys9g">
</div>
<span class="text-bandung-biru font-label-caps text-[10px] uppercase tracking-widest mb-3 block">KULINER LOKAL</span>
<h3 class="font-headline-md text-headline-md text-on-surface group-hover:text-bandung-hijau transition-colors mb-6 tracking-wide leading-tight">5 Kafe Legendaris di Jalan Braga</h3>
<div class="flex items-center text-on-surface-variant border-t border-outline-variant/30 pt-4">
<span class="font-label-caps text-xs tracking-widest">27 AGUSTUS 2026</span>
</div>
</div>
<!-- Article 2 -->
<div class="group cursor-pointer">
<div class="relative w-full h-80 overflow-hidden mb-6 rounded-lg">
<img class="w-full h-full object-cover transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" data-alt="A colorful, dynamic shot of Bandros (Bandung Tour on Bus) vehicles lined up, featuring vintage designs in bright colors like red, yellow, and blue. Cheerful and tourist-friendly." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhlZokWqOpAyJw8qmFtVFisRYC642mU48OVryjH89BTd54r-mnruzwMywH_DhielMljONo-KniAWm98UhMmmbPzyosKJqzlXLR4v-qW5Zu82ERi0tkXcvC-Q0l4W-fqMqwkYMijoURCtus4zlmXvpiZIzc41BR2GjI4vJaor1koEtcC9jbeeCkaZJ6s62ykz2ZH5_iCfWv5hzcmA_-luuh_NZggaPc8ZHfWrmmYiMbkIl7rca-HOh0yg">
</div>
<span class="text-bandung-biru font-label-caps text-[10px] uppercase tracking-widest mb-3 block">TIPS LIBURAN</span>
<h3 class="font-headline-md text-headline-md text-on-surface group-hover:text-bandung-hijau transition-colors mb-6 tracking-wide leading-tight">Panduan Wisata Keluarga Akhir Pekan</h3>
<div class="flex items-center text-on-surface-variant border-t border-outline-variant/30 pt-4">
<span class="font-label-caps text-xs tracking-widest">27 AGUSTUS 2026</span>
</div>
</div>
<!-- Article 3 -->
<div class="group cursor-pointer">
<div class="relative w-full h-80 overflow-hidden mb-6 rounded-lg">
<img class="w-full h-full object-cover transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" data-alt="An elegant, modern photograph of Bandung city streets preparing for a major event, with clean roads, banners, and heritage buildings in the background. Professional and civic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuuKsuQhAeWKROmh6uQdFMHwXnGKiLppMqB-Zf5P-AgfOAbW0F7sbq8NMyd02TpFcW6ZoUPh9ty4D6nj8lUOIiQrt7YeFty4eo2arkstpLVvNG6tBl7tNW6R79Txi2iRa0V8yqCajGdiI9P6eNFHFxV_ZQPy5SHTX3835OU7rW4hZ5HTX3835OU7rW4hZ5ZbVDYpGhMxnbwfYvVwdHMV_nN4eaQBWnTCE82M78l9WoRX4Djq2LttZlAKmO1vBgKJFiI1HLYw">
</div>
<span class="text-bandung-biru font-label-caps text-[10px] uppercase tracking-widest mb-3 block">TOURISM UPDATE</span>
<h3 class="font-headline-md text-headline-md text-on-surface group-hover:text-bandung-hijau transition-colors mb-6 tracking-wide leading-tight">Persiapan Konferensi Internasional 2027</h3>
<div class="flex items-center text-on-surface-variant border-t border-outline-variant/30 pt-4">
<span class="font-label-caps text-xs tracking-widest">25 AGUSTUS 2026</span>
</div>
</div>
</div>
</section>
<!-- Footer -->
<footer class="bg-surface border-t border-outline-variant/30 w-full py-[100px]">
<div class="grid grid-cols-1 md:grid-cols-4 gap-16 px-gutter max-w-container-max mx-auto">
<!-- Brand Column -->
<div class="md:col-span-1">
<a class="font-headline-md text-headline-md font-bold text-bandung-hijau uppercase tracking-widest mb-8 block" href="#">B. Heritage</a>
<p class="font-body-md text-body-md text-on-surface-variant mb-12 tracking-wide leading-relaxed">Urban Heritage meets Modern Travel. Discover the soul of West Java.</p>
<p class="font-label-caps text-label-caps text-on-surface-variant text-xs tracking-widest uppercase">© 2024 Bandung Tourism Board.</p>
</div>
<!-- Links Column 1 -->
<div>
<h4 class="font-bold text-on-surface mb-8 font-label-caps uppercase tracking-widest text-sm border-b border-outline-variant/30 pb-4">Explore</h4>
<ul class="space-y-6">
<li class=""><a class="text-on-surface-variant font-body-md tracking-wide hover:text-bandung-hijau transition-colors" href="#">Destinations</a></li>
<li class=""><a class="text-on-surface-variant font-body-md tracking-wide hover:text-bandung-hijau transition-colors" href="#">Calendar of Events</a></li>
<li class=""><a class="text-on-surface-variant font-body-md tracking-wide hover:text-bandung-hijau transition-colors" href="#">Travel Guides</a></li>
</ul>
</div>
<!-- Links Column 2 -->
<div>
<h4 class="font-bold text-on-surface mb-8 font-label-caps uppercase tracking-widest text-sm border-b border-outline-variant/30 pb-4">Company</h4>
<ul class="space-y-6">
<li class=""><a class="text-on-surface-variant font-body-md tracking-wide hover:text-bandung-hijau transition-colors" href="#">About Us</a></li>
<li class=""><a class="text-on-surface-variant font-body-md tracking-wide hover:text-bandung-hijau transition-colors" href="#">Contact Support</a></li>
<li class=""><a class="text-on-surface-variant font-body-md tracking-wide hover:text-bandung-hijau transition-colors" href="#">Investor Relations</a></li>
</ul>
</div>
<!-- Links Column 3 -->
<div>
<h4 class="font-bold text-on-surface mb-8 font-label-caps uppercase tracking-widest text-sm border-b border-outline-variant/30 pb-4">Legal</h4>
<ul class="space-y-6">
<li class=""><a class="text-on-surface-variant font-body-md tracking-wide hover:text-bandung-hijau transition-colors" href="#">Terms of Service</a></li>
<li class=""><a class="text-on-surface-variant font-body-md tracking-wide hover:text-bandung-hijau transition-colors" href="#">Privacy Policy</a></li>
<li class=""><a class="text-on-surface-variant font-body-md tracking-wide hover:text-bandung-hijau transition-colors" href="#">Sustainability</a></li>
</ul>
</div>
</div>
</footer>


</body></html>