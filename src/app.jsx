import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, MotionConfig, useScroll, useTransform, useSpring, useReducedMotion, useMotionValueEvent, useAnimationFrame, useInView } from 'framer-motion';
import { ArrowUpRight, ArrowDown, ArrowRight, Play, X, Menu, Mail, MapPin, Download, Pause, Search, Plus, Minus, ChevronLeft, ChevronRight, ExternalLink, Network, Database, Globe, CheckCircle2, Phone, Linkedin, Github } from 'lucide-react';
import archive from './data/projects.json';
import brands from './data/brands.json';
import './styles.css';

const MotionContext = createContext(true);
const EASE = [0.22, 1, 0.36, 1];
const categories = ['Semua', 'Networking', 'Data Analytics', 'Web Development', 'IT Operations', 'WordPress'];
const featured = ['Sales Data Center', 'Stock Opname & Consignment App', 'Office Network Infrastructure']
  .map(key => archive.find(p => p.title === key))
  .filter(Boolean);

const experiences = [
  {
    date: '2023 · SEKARANG',
    title: 'IT Support & Data Entry',
    place: 'CV. ALAM ORGANIK MAKMUR',
    text: 'Menangani dukungan teknis untuk perangkat komputer, laptop, printer, dan konektivitas jaringan kantor. Membantu pemeliharaan infrastruktur IT serta mengelola dan memvalidasi database penjualan. Menyusun laporan penjualan regional, memperbarui data leads, dan mendukung administrasi operasional menggunakan Accurate agar data bisnis selalu akurat.'
  },
  {
    date: 'AKADEMIK',
    title: 'S1 Sistem Informasi',
    place: 'Pendidikan Tinggi',
    text: 'Fokus pada analisis sistem informasi, pemodelan proses bisnis, basis data relasional (SQL/MySQL), dan pengembangan aplikasi berorientasi data untuk mendukung pengambilan keputusan operasional.'
  },
  {
    date: 'FONDASI',
    title: 'Teknik Komputer dan Jaringan',
    place: 'SMK TKJ',
    text: 'Mempelajari dasar infrastruktur jaringan komputer, routing, switching, subnetting, perakitan perangkat keras, instalasi sistem operasi, dan troubleshooting konektivitas LAN/WAN.'
  },
  {
    date: 'EKSPLORASI',
    title: 'Network & System R&D',
    place: 'Independent Technical Work',
    text: 'Mengeksplorasi arsitektur jaringan MikroTik (PCC load balancing, QoS, Netwatch), pengembangan web dengan Laravel 10 dan Supabase, visualisasi BI dengan Looker Studio, serta evaluasi forecasting time-series.'
  }
];

const technicalMilestones = [
  { year: '2024', title: 'Network Infrastructure & Dual-ISP PCC', event: 'MikroTik RB4011, QoS bandwidth management, & Netwatch failover' },
  { year: '2024', title: 'Centralized Sales Data Center & CRM', event: 'Laravel 10, MySQL, & stock movement reconciliation' },
  { year: '2024', title: 'Consignment & Stock Opname Optimization', event: 'Serverless Edge API & database region co-location (latency 850ms → 42ms)' },
  { year: '2023', title: 'Dashboard CRM & Sales BI Analytics', event: 'Looker Studio multi-channel data blending & customer analytics' },
  { year: '2023', title: 'Enterprise IT Support & Workstation Operations', event: 'Troubleshooting hardware, LAN/WLAN, file-sharing, & Accurate workflow' },
  { year: '2023 – Sekarang', title: 'WordPress Custom Themes & Website Management', event: 'Custom themes untuk aomsport.com & lindennutrition.id, serta maintenance scienceinsport.id' },
];

const processSteps = [
  ['01', 'UNDERSTAND', 'Pahami kebutuhan pengguna, alur kerja operasional, dan batasan infrastruktur yang ada.'],
  ['02', 'INVESTIGATE', 'Kumpulkan data, analisis log dan metrik, periksa gejala teknis, dan isolasi akar masalah.'],
  ['03', 'DESIGN', 'Pilih solusi yang andal, aman, dan proporsional terhadap kebutuhan serta sumber daya tim.'],
  ['04', 'IMPLEMENT', 'Konfigurasi perangkat, bangun aplikasi, lakukan pengujian menyeluruh, dan dokumentasikan alur sistem.'],
  ['05', 'IMPROVE', 'Evaluasi performa berkala bersama pengguna, pantau stabilitas, dan lakukan optimasi berkelanjutan.']
];

function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const enabled = useContext(MotionContext);
  const Component = motion[as];
  return <Component className={className} initial={enabled ? { opacity: 0, y: 32 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.12 }} transition={{ duration: enabled ? 0.75 : 0, delay, ease: EASE }}>{children}</Component>;
}

function MediaImage({ src, alt, className = '', priority = false, ...props }) {
  const [state, setState] = useState('loading');
  const imgRef = useRef(null);
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && (img.naturalWidth > 0 || img.naturalHeight > 0)) {
      setState('loaded');
    }
  }, [src]);
  return <span className={`media-image ${state} ${className}`}>
    {state === 'error' && <span className="image-fallback"><span className="display">Y.</span><span>Pratinjau tidak tersedia</span></span>}
    <img ref={imgRef} src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} width="960" height="600" onLoad={() => setState('loaded')} onError={() => setState('error')} {...props} />
  </span>;
}

function Magnetic({ children, className = '', ...props }) {
  const enabled = useContext(MotionContext);
  const x = useSpring(0, { stiffness: 220, damping: 20 });
  const y = useSpring(0, { stiffness: 220, damping: 20 });
  return <motion.a className={className} style={{ x, y }} onPointerMove={e => {
    if (!enabled || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.12); y.set((e.clientY - r.top - r.height / 2) * 0.2);
  }} onPointerLeave={() => { x.set(0); y.set(0); }} {...props}>{children}</motion.a>;
}

function Header({ enabled, onToggle }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: '-15% 0px -65% 0px' });
    document.querySelectorAll('main > section[id]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, []);
  return <header className="site-header">
    <a className="wordmark" href="#home" aria-label="Yanuar Ramadhian Sutiyono, beranda">YANUAR<span>®</span></a>
    <nav className="desktop-nav" aria-label="Navigasi utama">{[['portfolio', 'Karya & Proyek'], ['milestones', 'Milestones'], ['breakdown', 'Problem Solving'], ['about', 'Tentang'], ['experience', 'Pengalaman'], ['contact', 'Kontak']].map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>{label}</a>)}</nav>
    <div className="header-actions"><button className="motion-toggle" onClick={onToggle} aria-label={enabled ? 'Jeda animasi' : 'Aktifkan animasi'} aria-pressed={!enabled}>{enabled ? <Pause size={13} /> : <Play size={13} />}<span>Motion {enabled ? 'on' : 'off'}</span></button><a className="header-contact" href="https://wa.me/6285624208986" target="_blank" rel="noopener noreferrer">Let’s talk <ArrowUpRight size={16} /></a><button className="menu-toggle icon-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Tutup menu' : 'Buka menu'}>{open ? <X /> : <Menu />}</button></div>
    <AnimatePresence>{open && <motion.nav id="mobile-menu" className="mobile-menu" aria-label="Navigasi mobile" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>{[['home', 'Beranda'], ['portfolio', 'Karya & Proyek'], ['milestones', 'Milestones'], ['breakdown', 'Problem Solving'], ['about', 'Tentang'], ['experience', 'Pengalaman'], ['contact', 'Kontak']].map(([id, label], i) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}><span>0{i + 1}</span>{label}<ArrowUpRight size={18} /></a>)}</motion.nav>}</AnimatePresence>
  </header>;
}

function Hero({ onProject }) {
  const ref = useRef(null);
  const enabled = useContext(MotionContext);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 85]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -55]);
  return <section id="home" className="hero" ref={ref}>
    <div className="hero-top"><span>IT SUPPORT / DATA ANALYST<br/><span className="muted">NETWORKING · DATA · WEB DEVELOPMENT</span></span><span className="availability"><i />OPEN TO PROFESSIONAL OPPORTUNITIES</span></div>
    <motion.div className="hero-title display" aria-hidden="true" style={enabled ? { y: titleY } : {}} initial={enabled ? { clipPath: 'inset(0 0 100% 0)' } : false} animate={{ clipPath: 'inset(0 0 0% 0)' }} transition={{ duration: 1.4, ease: EASE }}>PORTFOLIO</motion.div>
    <motion.div className="hero-portrait" style={enabled ? { y: portraitY, scale: portraitScale } : {}} initial={enabled ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.2 }}><img src="./Asset/img/yanuar.jpeg" alt="Yanuar Ramadhian Sutiyono — IT Support & Data Analyst" width="864" height="1184" fetchPriority="high" /></motion.div>
    <motion.div className="hero-intro" style={enabled ? { y: copyY } : {}} initial={enabled ? { opacity: 0, x: -35 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.35, ease: EASE }}>
      <p className="handwriting">Hello, I’m</p><h1 className="display">YANUAR<span>.</span></h1><p className="hero-role">IT SUPPORT &<br />DATA ANALYST</p><p className="hero-description">Membangun infrastruktur yang stabil, mengolah data menjadi insight, dan mengembangkan aplikasi web yang membantu operasional bisnis.</p>
      <Magnetic href="#portfolio" className="primary-link">EXPLORE MY WORK <ArrowDown size={17}/></Magnetic>
      <span className="hero-location"><MapPin size={12} /> INDONESIA</span>
    </motion.div>
    <motion.div className="hero-side" initial={enabled ? { opacity: 0, x: 30 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.55, ease: EASE }}>
      <div className="hero-manifesto"><span className="crosshair" aria-hidden="true">✳</span><p>Technology should work.<br />Data should make sense.</p></div>
      <div className="hero-stats">
        <div><span className="display" style={{ fontSize: '38px' }}>IT</span><p>INFRASTRUCTURE<br/>& OPERATIONS</p></div>
        <div><span className="display" style={{ fontSize: '38px' }}>DATA</span><p>REPORTING, SQL<br/>& BI ANALYTICS</p></div>
        <div className="hero-award-stat"><span className="display" style={{ fontSize: '38px' }}>WEB</span><a href="#portfolio" aria-label="Lihat karya aplikasi Yanuar">APPLICATIONS<ArrowUpRight size={12}/></a></div>
        <a href="mailto:ramadhian1999@gmail.com?subject=Permintaan%20CV%20Yanuar%20Ramadhian%20Sutiyono" aria-label="Permintaan CV Yanuar"><Download size={16}/><span>REQUEST CV</span></a>
      </div>
    </motion.div>
    <div className="hero-bottom"><button className="reel-button" onClick={() => onProject(featured[0])}><span className="play-circle"><CheckCircle2 size={12} /></span>FEATURED SYSTEM<span className="muted">SALES DATA CENTER</span></button><span className="hero-scroll">SCROLL TO DISCOVER <ArrowDown size={13}/></span><span className="edition">VERIFIED WORK / 2023–2026</span></div>
  </section>;
}

function ProjectCard({ project, index, onOpen }) {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  return <motion.article ref={ref} className="project-card" layout initial={enabled ? { opacity: 0, y: 32 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.08 }} transition={{ duration: enabled ? 0.6 : 0, delay: (index % 3) * 0.06, ease: EASE }} exit={{ opacity: 0, scale: 0.96 }}>
    <button className="project-open" onClick={() => onOpen(project)} aria-label={`Lihat studi kasus ${project.title}`}><motion.div className="project-picture" style={enabled ? { y } : {}}><MediaImage src={project.image} alt={project.title}/></motion.div><span className="project-type">{project.scope || project.category}</span><span className="project-hover"><ArrowUpRight size={22}/></span><span className="project-frame" aria-hidden="true" /></button>
    <button className="project-caption" onClick={() => onOpen(project)}><span className="project-number display">{String(index + 1).padStart(2, '0')}</span><span><h3>{project.title}</h3><span className="project-category">{project.category}{project.year ? ` / ${project.year}` : ''}</span></span><ArrowUpRight size={20}/></button>
  </motion.article>;
}

function BrandStrip() {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const loopWidth = useRef(0);
  const inView = useInView(ref);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    if (!ref.current || showAll) return;
    const update = () => { loopWidth.current = ref.current?.querySelector('.brand-set')?.getBoundingClientRect().width || 0; };
    const observer = new ResizeObserver(update);
    observer.observe(ref.current); update();
    return () => observer.disconnect();
  }, [showAll]);
  useAnimationFrame((time, delta) => {
    if (!enabled || paused || interacting || !inView || showAll || !ref.current || !loopWidth.current) return;
    const el = ref.current;
    el.scrollLeft += Math.min(delta, 40) * 0.038;
    if (el.scrollLeft >= loopWidth.current) el.scrollLeft -= loopWidth.current;
  });
  const move = direction => { setPaused(true); ref.current?.scrollBy({ left: direction * ref.current.clientWidth * .7, behavior: enabled ? 'smooth' : 'instant' }); };
  return <Reveal className="brand-section"><div className="brand-heading"><p>TECHNOLOGIES & TOOLS<br/><strong>CORE TECHNICAL ECOSYSTEM.</strong></p><div><button className="brand-all" onClick={() => setShowAll(v => !v)} aria-expanded={showAll} aria-controls="brand-collection">{showAll ? 'TAMPILKAN DERET' : `LIHAT SEMUA (${brands.length})`}{showAll ? <Minus size={14}/> : <Plus size={14}/>}</button>{!showAll && <><button className="icon-button brand-pause" aria-label={paused ? 'Putar animasi logo' : 'Jeda animasi logo'} aria-pressed={paused} onClick={() => setPaused(v => !v)}>{paused ? <Play size={13}/> : <Pause size={13}/>}</button><button className="icon-button" onClick={() => move(-1)} aria-label="Logo sebelumnya"><ChevronLeft size={17}/></button><button className="icon-button" onClick={() => move(1)} aria-label="Logo selanjutnya"><ChevronRight size={17}/></button></>}</div></div><div id="brand-collection" className={showAll ? 'brand-full-grid' : 'brand-viewport'} ref={ref} onPointerEnter={e => { if(e.pointerType==='mouse') setInteracting(true); }} onPointerLeave={() => setInteracting(false)} onPointerDown={() => setPaused(true)} onFocusCapture={() => setInteracting(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setInteracting(false); }} tabIndex={showAll ? undefined : 0} role={showAll ? 'list' : 'region'} aria-label="Daftar teknologi dan platform pendukung sistem">
      {showAll ? brands.map(b => <div className="brand-logo" key={b.file} role="listitem"><img src={`./Asset/svg/brand/${b.file}`} alt={b.name} title={b.name} width="150" height="60" loading="lazy"/><span>{b.name}</span></div>) : <div className="brand-rail">{[0,1].map(copy => <div className="brand-set" key={copy} aria-hidden={copy === 1 ? true : undefined}>{brands.map(b => <div className="brand-logo" key={b.file}><img src={`./Asset/svg/brand/${b.file}`} alt={copy ? '' : b.name} title={b.name} width="150" height="60" loading="lazy" draggable="false"/></div>)}</div>)}</div>}
    </div></Reveal>;
}

function Portfolio({ onProject }) {
  const [category, setCategory] = useState('Semua');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [limit, setLimit] = useState(9);
  const results = archive.filter(p => {
    const matchesCat = category === 'Semua' || p.category === category || (Array.isArray(p.categories) && p.categories.includes(category));
    const searchTarget = `${p.title} ${p.category} ${p.role} ${p.scope || ''} ${p.description} ${p.tech?.join(' ') || ''}`.toLowerCase();
    return matchesCat && searchTarget.includes(query.toLowerCase());
  });
  const projects = expanded || category !== 'Semua' || query ? results.slice(0, limit) : featured;
  return <section id="portfolio" className="portfolio section-wrap">
    <Reveal className="section-heading"><div><span className="eyebrow">01 / SELECTED WORK & PROJECTS</span><h2>SISTEM, DATA & APLIKASI<span className="accent">.</span></h2></div><button className="text-link" onClick={() => { if (expanded) { setExpanded(false); setCategory('Semua'); setQuery(''); } else { setExpanded(true); setLimit(9); } }}>{expanded ? 'PROYEK PILIHAN' : 'SEMUA PROYEK'}<ArrowRight size={21}/></button></Reveal>
    <Reveal className="portfolio-toolbar">
      <div className="filters" role="group" aria-label="Kategori karya">
        {categories.map(c => <button key={c} className={category === c ? 'selected' : ''} aria-pressed={category === c} onClick={() => { setCategory(c); setExpanded(true); setLimit(9); }}>{c}{c === category && <motion.span className="filter-line" layoutId="filter-line"/>}</button>)}
      </div>
      <label className="search-box"><Search size={15}/><span>Cari</span><input aria-label="Cari karya" type="search" placeholder="Proyek, teknologi…" value={query} onChange={e => { setQuery(e.target.value); setExpanded(true); setLimit(9); }}/></label>
    </Reveal>
    <motion.div className="project-grid" layout><AnimatePresence mode="popLayout">{projects.map((p, i) => <ProjectCard key={p.category + p.title} project={p} index={i} onOpen={onProject}/>)}</AnimatePresence></motion.div>
    {projects.length === 0 && <div className="empty-state"><p>Tidak ada proyek untuk “{query}”.</p><button className="text-link" onClick={() => { setQuery(''); setCategory('Semua'); }}>Reset pencarian <X size={15}/></button></div>}
    {expanded && results.length > limit && <div className="load-more"><button className="outline-button" onClick={() => setLimit(v => v + 9)}>Tampilkan proyek lainnya <Plus size={16}/></button><span>{projects.length} dari {results.length} proyek</span></div>}
    <BrandStrip/>
  </section>;
}

function Awards({ onProject }) {
  const [expanded, setExpanded] = useState(false);
  return <section id="milestones" className={`recognition section-wrap ${expanded ? 'awards-expanded' : ''}`}>
    <Reveal className="recognition-intro">
      <span className="eyebrow">CAREER HIGHLIGHTS & MILESTONES</span>
      <h2 className="display">THE EXPERIENCE.<br/><span className="accent">THE CAPABILITIES.</span></h2>
      <div className="award-total">
        <Network size={42} style={{ color: '#ef4151' }} />
        <span className="display" style={{ fontSize: '75px' }}>SYS</span>
        <Database size={42} style={{ color: '#ef4151' }} />
        <span className="award-total-label">VERIFIED PRACTICES</span>
      </div>
      <p>Infrastruktur yang dikonfigurasi dengan standar keandalan tinggi.<br/>Data operasional yang divalidasi untuk mendukung keputusan bisnis yang tepat.</p>
      <button className="text-link award-proof" onClick={() => onProject(featured[0])}>LIHAT DOKUMENTASI SISTEM<ArrowUpRight size={18}/></button>
    </Reveal>
    <div className="recognition-list">
      <div className="recognition-list-head"><span>TECHNICAL MILESTONES</span><span>2023 – SEKARANG</span></div>
      <ol id="recognition-list">{technicalMilestones.map((item, i) => <Reveal as="li" className={`recognition-row ${i > 2 ? 'additional-award' : ''}`} key={item.title} delay={i * .045}>
        <span className="award-index">0{i + 1}</span>
        <div><h3>{item.title}</h3><p>{item.event}</p></div>
        <span className="award-year display">{item.year}</span>
      </Reveal>)}</ol>
      <button className="award-expand" aria-expanded={expanded} aria-controls="recognition-list" onClick={() => setExpanded(v => !v)}>{expanded ? 'Ringkas milestones' : 'Lihat milestones lainnya'}{expanded ? <Minus size={16}/> : <Plus size={16}/>}</button>
    </div>
  </section>;
}

function Breakdown() {
  const ref = useRef(null);
  const enabled = useContext(MotionContext);
  const [manual, setManual] = useState(false);
  const [cut, setCut] = useState(50);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  useMotionValueEvent(scrollYProgress, 'change', v => { if (!manual && enabled) setCut(Math.round(90 - v * 80)); });
  const titleX = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return <section id="breakdown" className="breakdown section-wrap" ref={ref} aria-labelledby="breakdown-title">
    <Reveal className="breakdown-copy">
      <span className="eyebrow">A LOOK UNDER THE SURFACE / PROBLEM SOLVING</span>
      <motion.h2 id="breakdown-title" className="display" style={enabled ? { x: titleX } : {}}>FROM PROBLEM.<br/><span className="accent">TO SOLUTION.</span></motion.h2>
      <p>Tantangan teknis nyata dalam operasional. Lihat bagaimana investigasi sistematis, isolasi protokol, dan optimasi arsitektur cloud/jaringan mengubah kendala menjadi sistem yang stabil.</p>
      <span className="breakdown-credit">LATENCY & SMB TROUBLESHOOTING / 2024<br/>ROOT CAUSE ANALYSIS · NETWORK PROTOCOL AUDIT · ARCHITECTURE RESOLUTION</span>
    </Reveal>
    <Reveal className="comparison">
      <div className="comparison-stage" style={{'--cut': `${enabled || manual ? cut : 50}%`}}>
        <MediaImage src="./Asset/img/breakdown/problem-state.svg" alt="Diagram diagnosis masalah: Latensi multi-region dan kegagalan protokol SMB"/>
        <div className="comparison-final">
          <MediaImage src="./Asset/img/breakdown/solution-state.svg" alt="Diagram solusi: Co-location region Singapore dan perbaikan firewall SMB"/>
        </div>
        <span className="comparison-label raw-label">PROBLEM / DIAGNOSIS</span>
        <span className="comparison-label final-label">SOLUTION / RESOLUTION</span>
        <div className="comparison-divider"><span><ChevronLeft size={14}/><ChevronRight size={14}/></span></div>
        <input aria-label="Perbandingan masalah dan solusi teknis" aria-valuetext={`${cut}% diagnosis, ${100-cut}% solusi`} type="range" min="0" max="100" value={cut} onChange={e => { setManual(true); setCut(Number(e.target.value)); }}/>
      </div>
      <div className="comparison-caption"><span>GESER UNTUK MELIHAT PERBANDINGAN INVESTIGASI</span><span>DRAG / SCROLL</span></div>
    </Reveal>
  </section>;
}

function About() {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 75%'] });
  return <section id="about" className="about section-wrap" ref={ref}>
    <Reveal className="about-lead">
      <div>
        <span className="eyebrow">02 / BEHIND THE SYSTEMS</span>
        <h2 className="display">BUKAN SEKADAR TEKNIS.<br/>TAPI SOLUSI <span className="accent">OPERASIONAL.</span></h2>
      </div>
      <p>Saya Yanuar Ramadhian Sutiyono, profesional IT dengan latar belakang Teknik Komputer dan Jaringan serta pendidikan S1 Sistem Informasi. Berfokus pada pemeliharaan infrastruktur komputer dan jaringan, pengelolaan database penjualan, validasi data, serta pengembangan aplikasi web.</p>
    </Reveal>
    <div className="studio-grid">
      <Reveal className="education-panel">
        <h3 className="panel-heading">EDUCATION & SKILLS</h3>
        <p className="eyebrow accent">PENDIDIKAN</p>
        <div className="education-row">
          <strong>S1 Sistem Informasi</strong>
          <span>Sarjana</span>
          <p>Pemodelan proses bisnis, basis data relasional (SQL/MySQL), rekayasa perangkat lunak, dan analisis data sistem.</p>
        </div>
        <div className="education-row">
          <strong>SMK Teknik Komputer dan Jaringan</strong>
          <span>TKJ</span>
          <p>Dasar infrastruktur jaringan, IP addressing, routing, switching, perakitan hardware, dan administrasi sistem operasi.</p>
        </div>
        <div className="education-row">
          <strong>Applied Practical Learning</strong>
          <p>MikroTik RouterOS · Looker Studio BI · Laravel 10 Stack</p>
        </div>
        <p className="eyebrow accent skills-heading">TECHNICAL TOOLKIT</p>
        <div className="skill-tags">
          {['MikroTik RouterOS', 'Network Troubleshooting', 'PCC Load Balancing', 'Firewall & NAT', 'QoS Management', 'SQL & MySQL', 'Looker Studio', 'Sales Reporting', 'Data Validation', 'Laravel 10', 'PHP', 'React', 'Supabase', 'WordPress', 'XAMPP', 'Accurate Accounting'].map(s => <span key={s}>{s}</span>)}
        </div>
        <div className="software-row">
          {[['mikrotik', 'MikroTik RouterOS'], ['laravel', 'Laravel 10'], ['mysql', 'MySQL Database'], ['looker', 'Looker Studio BI'], ['react', 'React JS'], ['wp', 'WordPress']].map(([file, name]) => <img key={file} src={`./Asset/svg/${file}.svg`} alt={name} title={name} loading="lazy" width="28" height="28"/>)}
        </div>
      </Reveal>
      <div className="process-panel">
        <Reveal><h3 className="panel-heading">A PRACTICAL APPROACH TO EVERY PROBLEM</h3></Reveal>
        <div className="process-list">
          <div className="process-track"><motion.div style={{ scaleY: enabled ? scrollYProgress : 1 }}/></div>
          {processSteps.map(([num, title, text], i) => <Reveal key={num} className="process-row" delay={i * 0.035}>
            <span className="process-num display">{num}</span>
            <span className="process-node"/>
            <div><h4>{title}</h4><p>{text}</p></div>
          </Reveal>)}
        </div>
      </div>
      <Reveal className="quote-panel">
        <span className="quote-mark display">“</span>
        <blockquote>Reliable systems.<br/>Meaningful data.<br/><em>Built to solve<br/>real problems.</em></blockquote>
        <span className="handwriting">Yanuar</span>
        <div className="quote-bottom">CONNECTING SYSTEMS.<br/>TURNING DATA INTO DECISIONS.<span className="quote-symbol" aria-hidden="true">✳</span></div>
      </Reveal>
    </div>
  </section>;
}

function Journey({ onProject }) {
  const [open, setOpen] = useState(0);
  return <section id="experience" className="journey section-wrap">
    <Reveal className="section-heading"><div><span className="eyebrow">03 / EXPERIENCE & FOUNDATION</span><h2>PENGALAMAN KERJA & RIWAYAT<span className="accent">.</span></h2></div><a className="text-link" href="mailto:ramadhian1999@gmail.com?subject=Permintaan%20CV%20Yanuar%20Ramadhian%20Sutiyono">HUBUNGI SAYA UNTUK CV<ArrowRight size={16}/></a></Reveal>
    <div className="journey-grid">
      <div className="experience-list">
        {experiences.map((job, i) => <Reveal className={`experience-row ${open === i ? 'is-open' : ''}`} key={job.title}>
          <button aria-expanded={open === i} aria-controls={`job-${i}`} onClick={() => setOpen(open === i ? null : i)}>
            <span className="experience-date">{job.date}</span>
            <span><h3>{job.title}</h3><span className="experience-place">{job.place}</span></span>
            {open === i ? <Minus size={18}/> : <Plus size={18}/>}
          </button>
          <AnimatePresence initial={false}>{open === i && <motion.div id={`job-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}><p>{job.text}</p></motion.div>}</AnimatePresence>
        </Reveal>)}
      </div>
      <Reveal className="awards-panel">
        <p className="eyebrow">SELECTED DELIVERABLES</p>
        <h3 className="display">PROJECT<br/><span className="accent">DELIVERABLES.</span></h3>
        <div className="award-list">
          {archive.map((proj, i) => <button key={proj.title} onClick={() => onProject(proj)}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            <span>{proj.title}<small>{proj.category} · {proj.scope || 'Work Project'}</small></span>
            <ArrowUpRight size={19}/>
          </button>)}
        </div>
      </Reveal>
    </div>
  </section>;
}

function Contact({ onProject }) {
  const [sent, setSent] = useState(false);
  const send = e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get('name') || '';
    const type = data.get('type') || '';
    const msg = data.get('message') || '';
    const waText = encodeURIComponent(`Halo Mas Yanuar, perkenalkan saya ${name}.\nKebutuhan: ${type}\n\nDetail:\n${msg}`);
    window.open(`https://wa.me/6285624208986?text=${waText}`, '_blank');
    setSent(true);
  };
  return <section id="contact" className="contact section-wrap">
    <div className="contact-grid">
      <Reveal className="contact-intro">
        <span className="eyebrow">04 / PROFESSIONAL INQUIRY</span>
        <h2 className="display">LET’S BUILD<br/>SOMETHING<br/><span className="accent">USEFUL.</span></h2>
        <p>Terbuka untuk peluang profesional, kolaborasi teknologi, dan proyek pengembangan sistem jaringan, data analytics, maupun aplikasi web.</p>
        <Magnetic href="https://wa.me/6285624208986" target="_blank" rel="noopener noreferrer" className="contact-cta"><span className="round-arrow"><ArrowUpRight size={21}/></span>HUBUNGI VIA WHATSAPP</Magnetic>
      </Reveal>
      <Reveal className="contact-links" delay={0.1}>
        <a href="mailto:ramadhian1999@gmail.com" title="Kirim email ke ramadhian1999@gmail.com"><Mail/><span><small>EMAIL</small>ramadhian1999@gmail.com</span><ArrowUpRight size={16}/></a>
        <a href="https://wa.me/6285624208986" target="_blank" rel="noopener noreferrer" title="Chat via WhatsApp"><Phone/><span><small>WHATSAPP</small>+62 856-2420-8986</span><ArrowUpRight size={16}/></a>
        <a href="https://id.linkedin.com/in/yanuar-ramadhian-sutiyono-89282218a" target="_blank" rel="noopener noreferrer" title="Buka profil LinkedIn"><Linkedin/><span><small>LINKEDIN</small>yanuar-ramadhian-sutiyono</span><ArrowUpRight size={16}/></a>
        <a href="https://github.com/yanuarRamadhian" target="_blank" rel="noopener noreferrer" title="Buka profil GitHub"><Github/><span><small>GITHUB</small>github.com/yanuarRamadhian</span><ArrowUpRight size={16}/></a>
        <div><MapPin/><span><small>LOKASI KERJA</small>Indonesia · Remote / On-Site</span></div>
      </Reveal>
      <Reveal className="contact-reel" delay={0.2}>
        <button onClick={() => onProject(featured[0])} aria-label="Lihat ringkasan arsitektur sistem">
          <div className="reel-screen">
            <span className="reel-screen-top">YANUAR®<span>SYSTEMS / DATA</span></span>
            <MediaImage src={featured[0]?.image || "./Asset/img/DATA ANALYST/sales datacenter/sales datacenter.png"} alt="Sales data center interface"/>
            <span className="reel-screen-title display">CONNECTING<br/><span>SYSTEMS.</span></span>
            <span className="play-circle"><CheckCircle2 size={18}/></span>
          </div>
          <span className="reel-caption">CLICK TO VIEW CENTRAL SYSTEM OVERVIEW.</span>
        </button>
      </Reveal>
    </div>
    <Reveal>
      <details className="project-brief">
        <summary>Kirim pesan / Permintaan diskusi proyek <Plus size={19}/></summary>
        <form onSubmit={send}>
          <label>Nama Anda<input name="name" required placeholder="Nama atau institusi / perusahaan" autoComplete="name" maxLength="100"/></label>
          <label>Kebutuhan teknis
            <select name="type">
              <option>Peluang Kerja / Full-Time IT Role</option>
              <option>IT Support & Network Setup (MikroTik)</option>
              <option>Database, SQL & Sales Reporting</option>
              <option>Business Intelligence / Dashboard (Looker Studio)</option>
              <option>Web Application Development (Laravel / React)</option>
              <option>WordPress Maintenance & Migration</option>
              <option>Diskusi Teknis / Kolaborasi Lainnya</option>
            </select>
          </label>
          <label className="brief-message">Detail kebutuhan atau pesan<textarea name="message" required rows="3" placeholder="Ceritakan latar belakang, kebutuhan sistem, atau peluang kerja yang relevan…" maxLength="3000"/></label>
          <button className="solid-button" type="submit">Kirim ke WhatsApp <ArrowUpRight size={18}/></button>
          <p className="form-note" role="status">{sent ? 'Percakapan WhatsApp telah dibuka di tab baru.' : 'Pesan akan diteruskan langsung ke WhatsApp Yanuar (+62 856-2420-8986).'}</p>
        </form>
      </details>
    </Reveal>
  </section>;
}

function ProjectDialog({ project, onClose }) {
  const ref = useRef(null);
  const enabled = useContext(MotionContext);
  const [shot, setShot] = useState(0);
  const gallery = project.gallery || [project.image];
  const activeImage = gallery[shot] || project.image;

  useEffect(() => {
    const previous = document.activeElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    const listener = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const nodes = [...ref.current.querySelectorAll('button, a[href], input, select, textarea')].filter(n => !n.disabled && n.getClientRects().length);
        const first = nodes[0]; const last = nodes.at(-1);
        if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', listener);
    return () => { document.body.style.overflow = old; window.removeEventListener('keydown', listener); previous?.focus(); };
  }, [onClose]);

  return <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div ref={ref} className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabIndex="-1" initial={enabled ? { y: 45, scale: 0.97 } : false} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
      <div className="dialog-heading"><span className="eyebrow">{project.scope || project.category} {project.year && ` / ${project.year}`}</span><button onClick={onClose} className="icon-button" aria-label="Tutup karya"><X/></button></div>
      <div className="dialog-media still">
        <MediaImage src={activeImage} alt={`${project.title} - Screenshot ${shot + 1}`} priority/>
      </div>
      {gallery.length > 1 && (
        <div className="render-controls">
          <div role="group" aria-label="Tangkapan layar proyek">
            {gallery.map((_, i) => (
              <button
                key={i}
                className={shot === i ? 'selected' : ''}
                onClick={() => setShot(i)}
                aria-pressed={shot === i}
              >
                SCREEN {i + 1}
              </button>
            ))}
          </div>
          <div className="shot-controls">
            <button className="icon-button" aria-label="Gambar sebelumnya" onClick={() => setShot((shot - 1 + gallery.length) % gallery.length)}>
              <ChevronLeft size={16}/>
            </button>
            <span>SCREEN {shot + 1} / {gallery.length}</span>
            <button className="icon-button" aria-label="Gambar selanjutnya" onClick={() => setShot((shot + 1) % gallery.length)}>
              <ChevronRight size={16}/>
            </button>
          </div>
        </div>
      )}
      <div className="dialog-description">
        <div>
          <h2 id="dialog-title">{project.title}</h2>
          {project.role && <span className="accent">{project.role}</span>}
          <p>{project.description}</p>
          {project.tech && <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>{project.tech.map(t => <span key={t} style={{ border: '1px solid #332427', padding: '4px 8px', fontSize: '10px', color: '#c2bdb9' }}>{t}</span>)}</div>}
          {project.links && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '18px' }}>
              {project.links.map(l => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="outline-button"
                  style={{ fontSize: '11px', padding: '8px 14px', gap: '8px' }}
                >
                  <span>{l.name}</span>
                  <span style={{ fontSize: '9px', color: '#ef4151', border: '1px solid #4a1a22', padding: '2px 6px', borderRadius: '2px' }}>{l.badge}</span>
                  <ExternalLink size={13}/>
                </a>
              ))}
            </div>
          )}
        </div>
        <button className="outline-button" onClick={onClose}>Tutup Detail <X size={15}/></button>
      </div>
      <p className="embed-note">Semua konfigurasi IP internal, kredensial, dan data sensitif telah disamarkan sesuai protokol keamanan informasi.</p>
    </motion.div>
  </motion.div>;
}

function App() {
  const reduced = useReducedMotion();
  const [motionOn, setMotionOn] = useState(() => { try { return localStorage.getItem('yanuar-motion') !== 'off'; } catch { return true; } });
  const enabled = motionOn && !reduced;
  const [project, setProject] = useState(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 28, restDelta: 0.001 });
  useEffect(() => { document.documentElement.dataset.motion = enabled ? 'on' : 'off'; }, [enabled]);
  const toggle = () => { setMotionOn(!motionOn); try { localStorage.setItem('yanuar-motion', motionOn ? 'off' : 'on'); } catch {} };
  const close = React.useCallback(() => setProject(null), []);
  return <MotionContext.Provider value={enabled}>
    <MotionConfig reducedMotion={enabled ? 'user' : 'always'} transition={{ ease: EASE }}>
      <a className="skip-link" href="#portfolio">Lewati ke karya</a>
      <motion.div className="reading-progress" style={{ scaleX: enabled ? progress : scrollYProgress }}/>
      <Header enabled={enabled} onToggle={toggle}/>
      <main>
        <Hero onProject={setProject}/>
        <Portfolio onProject={setProject}/>
        <Awards onProject={setProject}/>
        <Breakdown/>
        <About/>
        <Journey onProject={setProject}/>
        <Contact onProject={setProject}/>
      </main>
      <footer className="footer">
        <a className="wordmark" href="#home">YANUAR<span>®</span></a>
        <span>© {new Date().getFullYear()} YANUAR RAMADHIAN SUTIYONO. BUILT WITH PURPOSE.</span>
        <div>
          <a href="mailto:ramadhian1999@gmail.com" aria-label="Kirim Email ke Yanuar" title="Email: ramadhian1999@gmail.com"><Mail size={17}/></a>
          <a href="https://wa.me/6285624208986" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Yanuar" title="WhatsApp: +62 856-2420-8986"><Phone size={17}/></a>
          <a href="https://id.linkedin.com/in/yanuar-ramadhian-sutiyono-89282218a" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Yanuar" title="LinkedIn"><Linkedin size={17}/></a>
          <a href="https://github.com/yanuarRamadhian" target="_blank" rel="noopener noreferrer" aria-label="GitHub Yanuar" title="GitHub"><Github size={17}/></a>
          <a href="#home" aria-label="Kembali ke atas" title="Ke atas"><ArrowUpRight size={18}/></a>
        </div>
      </footer>
      <AnimatePresence>{project && <ProjectDialog key={project.title} project={project} onClose={close}/>}</AnimatePresence>
    </MotionConfig>
  </MotionContext.Provider>;
}

createRoot(document.getElementById('root')).render(<App/>);
