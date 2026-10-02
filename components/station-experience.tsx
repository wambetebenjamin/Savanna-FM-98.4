'use client';

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import ImmersiveRadioEnvironment from './immersive-radio-environment';
import { LiquidMorph, MorphingSignal } from './morphing-radio-graphics';
import { AnimatedFlipbook, CinematicMotionLayer } from './cinematic-motion-layer';
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Facebook,
  Headphones,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Mic,
  Minus,
  Music2,
  Pause,
  Play,
  Radio,
  Send,
  Sparkles,
  Ticket,
  TrendingDown,
  TrendingUp,
  Volume2,
  VolumeX,
  X,
  Youtube,
} from 'lucide-react';
import {
  chartTracks,
  defaultNowPlaying,
  events,
  news,
  podcasts,
  presenters,
  schedule,
  type NewsItem,
  type PodcastEpisode,
  type ScheduleItem,
} from '../lib/content';

type NowPlaying = typeof defaultNowPlaying;
type RequestState = 'idle' | 'sending' | 'sent' | 'error';

const navigation = [
  { label: 'Shows', href: '#shows' },
  { label: 'Presenters', href: '#presenters' },
  { label: 'News', href: '#news' },
  { label: 'Podcasts', href: '#podcasts' },
  { label: 'Events', href: '#events' },
  { label: 'Advertise', href: '#advertise' },
];

const waveformHeights = Array.from({ length: 52 }, (_, index) => 18 + ((index * 29 + 7) % 82));
const miniWaveHeights = Array.from({ length: 28 }, (_, index) => 20 + ((index * 17 + 13) % 78));

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children, number }: { children: React.ReactNode; number?: string }) {
  return (
    <p className="eyebrow">
      {number && <span className="eyebrow__number">{number}</span>}
      {children}
    </p>
  );
}

function Waveform({ compact = false, animated = false }: { compact?: boolean; animated?: boolean }) {
  const bars = compact ? miniWaveHeights : waveformHeights;
  return (
    <span className={`waveform ${compact ? 'waveform--compact' : ''} ${animated ? 'waveform--animated' : ''}`} aria-hidden="true">
      {bars.map((height, index) => (
        <i key={index} style={{ '--bar-height': `${height}%`, '--bar-delay': `${(index % 11) * -0.11}s` } as React.CSSProperties} />
      ))}
    </span>
  );
}

function AnimatedCount({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / 1400, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * eased));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [value]);
  return <span>{count.toLocaleString('en-KE')}</span>;
}

function TrackArtwork({ tone, label }: { tone: string; label: string }) {
  return (
    <div className={`track-art track-art--${tone}`} aria-hidden="true">
      <span className="track-art__sun" />
      <span className="track-art__type">{label}</span>
      <Music2 size={19} strokeWidth={1.6} />
    </div>
  );
}

function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  return (
    <article className="news-card">
      <a className={`news-card__image news-card__image--${item.tone}`} href="#newsletter" aria-label={`Read: ${item.title}`}>
        <Image src={item.image} alt="" fill sizes="(max-width: 700px) 75vw, 315px" loading="lazy" />
        <span className="news-card__category">{item.label}</span>
        <span className="news-card__number">0{index + 1}</span>
        <span className="news-card__open"><ArrowUpRight size={17} /></span>
      </a>
      <div className="news-card__body">
        <p className="news-card__meta">{item.date} <span /> {item.readTime}</p>
        <h3><a href="#newsletter">{item.title}</a></h3>
        <p className="news-card__summary">{item.summary}</p>
      </div>
    </article>
  );
}

function EpisodeCard({
  episode,
  onPlay,
  isActive,
}: {
  episode: PodcastEpisode;
  onPlay: (episode: PodcastEpisode) => void;
  isActive: boolean;
}) {
  return (
    <article className={`episode-card ${isActive ? 'episode-card--active' : ''}`}>
      <div className={`episode-card__art episode-card__art--${episode.artwork}`}>
        <div className="episode-card__art-ring" />
        <span className="episode-card__episode">{episode.episode}</span>
        <div className="episode-card__art-title">SAVANNA<br /><em>sounds</em></div>
        <Waveform compact animated={isActive} />
        <button className="episode-card__play" type="button" onClick={() => onPlay(episode)} aria-label={`${isActive ? 'Pause' : 'Play'} ${episode.title}`}>
          {isActive ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
        </button>
      </div>
      <div className="episode-card__copy">
        <p className="episode-card__show">{episode.show}</p>
        <h3>{episode.title}</h3>
        <div className="episode-card__meta"><span>{episode.date}</span><span>{episode.duration}</span></div>
      </div>
    </article>
  );
}

function AppLogo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#home" className={`brand ${compact ? 'brand--compact' : ''}`} aria-label="Savanna FM home">
      <span className="brand__mark" aria-hidden="true"><span /><span /><span /><span /></span>
      <span className="brand__word">SAVANNA<span className="brand__frequency">FM 98.4</span></span>
    </a>
  );
}

export default function StationExperience() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const newsRailRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(0.78);
  const [muted, setMuted] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying>(defaultNowPlaying);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(schedule);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(news);
  const [podcastItems, setPodcastItems] = useState<PodcastEpisode[]>(podcasts);
  const [activeEpisode, setActiveEpisode] = useState<string | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestState, setRequestState] = useState<RequestState>('idle');
  const [requestSong, setRequestSong] = useState('');
  const [requestArtist, setRequestArtist] = useState('');
  const [requestName, setRequestName] = useState('');
  const [dedication, setDedication] = useState('');
  const [toast, setToast] = useState('');
  const [newsletterState, setNewsletterState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const streamUrl = process.env.NEXT_PUBLIC_STREAM_URL || '';
  const whatsappBase = 'https://wa.me/254112272061';

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3600);
  }, []);

  useEffect(() => {
    let active = true;
    const loadMetadata = async () => {
      try {
        const response = await fetch('/api/now-playing', { cache: 'no-store' });
        if (!response.ok) return;
        const data = await response.json();
        if (active && data?.title) setNowPlaying((current) => ({ ...current, ...data }));
      } catch {
        // The designed fallback keeps the player useful while stream metadata is offline.
      }
    };
    loadMetadata();
    const interval = window.setInterval(loadMetadata, 45_000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let active = true;
    const loadStationContent = async () => {
      const [scheduleResponse, newsResponse, podcastResponse] = await Promise.allSettled([
        fetch('/api/schedule', { cache: 'no-store' }),
        fetch('/api/news'),
        fetch('/api/podcasts'),
      ]);
      if (!active) return;
      const readArray = async <T,>(result: PromiseSettledResult<Response>) => {
        if (result.status !== 'fulfilled' || !result.value.ok) return null;
        try {
          const data = await result.value.json();
          return Array.isArray(data) ? data as T[] : null;
        } catch {
          return null;
        }
      };
      const [nextSchedule, nextNews, nextPodcasts] = await Promise.all([
        readArray<ScheduleItem>(scheduleResponse),
        readArray<NewsItem>(newsResponse),
        readArray<PodcastEpisode>(podcastResponse),
      ]);
      if (!active) return;
      if (nextSchedule?.length) setScheduleItems(nextSchedule);
      if (nextNews?.length) setNewsItems(nextNews);
      if (nextPodcasts?.length) setPodcastItems(nextPodcasts);
    };
    void loadStationContent();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);

  useEffect(() => {
    if (!requestOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setRequestOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [requestOpen]);

  const startAudio = useCallback(async (url: string, label: string) => {
    const audio = audioRef.current;
    if (!audio || !url) return false;
    try {
      setLoading(true);
      audio.pause();
      audio.src = url;
      audio.load();
      audio.volume = volume;
      audio.muted = muted;
      await audio.play();
      setPlaying(true);
      setActiveEpisode(label.startsWith('episode:') ? label.replace('episode:', '') : null);
      setLoading(false);
      return true;
    } catch {
      setPlaying(false);
      setLoading(false);
      showToast('We could not connect to the audio. Please try again in a moment.');
      return false;
    }
  }, [muted, showToast, volume]);

  const toggleLive = async () => {
    const audio = audioRef.current;
    if (playing && audio) {
      audio.pause();
      setPlaying(false);
      setActiveEpisode(null);
      return;
    }
    if (!streamUrl) {
      showToast('Live audio is ready to connect. Add NEXT_PUBLIC_STREAM_URL to your environment to go on air.');
      return;
    }
    setActiveEpisode(null);
    await startAudio(streamUrl, 'live');
  };

  const playEpisode = async (episode: PodcastEpisode) => {
    if (!episode.audioUrl) {
      showToast('This episode is queued for the archive. Add its audio URL in data/podcasts.json to enable playback.');
      return;
    }
    if (activeEpisode === episode.id && playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }
    setNowPlaying({
      title: episode.title,
      artist: episode.show,
      show: episode.show,
      presenter: 'Savanna FM',
      artwork: `/images/voice-red-dress.jpg`,
      source: 'podcast',
    });
    await startAudio(episode.audioUrl, `episode:${episode.id}`);
  };

  const changeNewsRail = (direction: 'left' | 'right') => {
    if (!newsRailRef.current) return;
    newsRailRef.current.scrollBy({ left: direction === 'left' ? -370 : 370, behavior: 'smooth' });
  };

  const handleRequestSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!requestSong.trim()) return;
    setRequestState('sending');
    const message = `Hello! I'd like to request ${requestSong.trim()}${requestArtist.trim() ? ` by ${requestArtist.trim()}` : ''} on Savanna FM 98.4.${requestName.trim() ? ` This is ${requestName.trim()}.` : ''}${dedication.trim() ? ` Dedication: ${dedication.trim()}` : ''}`;
    const whatsappUrl = `${whatsappBase}?text=${encodeURIComponent(message)}`;
    // Open a user-initiated tab before the API call so the manual WhatsApp hand-off is not blocked.
    const whatsappTab = window.open('about:blank', '_blank');
    if (whatsappTab) whatsappTab.opener = null;
    try {
      const response = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ song: requestSong, artist: requestArtist, name: requestName, dedication }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (whatsappTab) whatsappTab.location.href = whatsappUrl;
        else window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        setRequestState('sent');
        showToast('WhatsApp is opening so you can send your request directly.');
        return;
      }
      if (result.whatsappSent) {
        whatsappTab?.close();
        setRequestState('sent');
        showToast('Your song request is on its way.');
      } else {
        if (whatsappTab) whatsappTab.location.href = whatsappUrl;
        else window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        setRequestState('sent');
        showToast('Saved for the team. Finish by sending your WhatsApp message.');
      }
    } catch {
      if (whatsappTab) whatsappTab.location.href = whatsappUrl;
      else window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setRequestState('sent');
      showToast('WhatsApp is opening so your request reaches the studio.');
    }
  };

  const handleNewsletter = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterState('sending');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const result = await response.json();
      if (!response.ok) {
        setNewsletterState('idle');
        showToast(result.error || 'Newsletter signup is not connected yet.');
        return;
      }
      setNewsletterState('done');
      showToast('You are on the list. See you in your inbox.');
    } catch {
      setNewsletterState('idle');
      showToast('Newsletter signup is temporarily unavailable. Email hello@savannafm.co.ke.');
    }
  };

  const resetRequest = () => {
    setRequestOpen(false);
    setRequestState('idle');
    setRequestSong('');
    setRequestArtist('');
    setRequestName('');
    setDedication('');
  };

  return (
    <main>
      <CinematicMotionLayer />
      <audio
        ref={audioRef}
        preload="none"
        onPlaying={() => { setPlaying(true); setLoading(false); }}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setActiveEpisode(null); }}
        onError={() => { setPlaying(false); setLoading(false); }}
      />

      <header className="site-header">
        <div className="site-header__inner">
          <AppLogo />
          <nav className={`main-nav ${mobileMenuOpen ? 'main-nav--open' : ''}`} aria-label="Main navigation">
            <a className="main-nav__home" href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
            {navigation.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>{item.label}</a>
            ))}
          </nav>
          <div className="site-header__actions">
            <button className="header-live" type="button" onClick={toggleLive}>
              <span className="header-live__dot" />
              <span>Listen live</span>
              <ArrowUpRight size={15} />
            </button>
            <button
              className="menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </header>

      <section className="hero hero--immersive" id="home">
        <LiquidMorph tone="cream" className="liquid-morph--hero" />
        <ImmersiveRadioEnvironment variant="studio" />
        <div className="hero__texture" aria-hidden="true" />
        <div className="hero__wave-field" aria-hidden="true"><Waveform animated /></div>
        <div className="hero__rings" aria-hidden="true"><span /><span /><span /></div>
        <div className="hero__inner page-shell">
          <div className="hero__copy">
            <div className="hero__topline">
              <span className="live-pill"><i /> ON AIR · NAIROBI</span>
              <span className="hero__coords">1°17′S&nbsp;&nbsp; 36°49′E</span>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            >
              THE HEARTBEAT<br />
              OF <span>EAST AFRICA.</span>
            </motion.h1>
            <p className="hero__intro">Your city. Your sound. Your station.<br /><strong>Savanna FM 98.4</strong>, live from Nairobi.</p>
            <div className="hero__buttons">
              <button className="button button--orange button--hero" type="button" onClick={toggleLive}>
                {playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
                {playing ? 'Pause the live show' : 'Listen now'}
                <span className="button__arrow"><ArrowUpRight size={17} /></span>
              </button>
              <a href="#shows" className="button button--text">Explore the shows <ArrowDownRight size={17} /></a>
            </div>
            <div className="hero__listenership">
              <div className="listener-stack" aria-hidden="true">
                <span>W</span><span>K</span><span>N</span><span>+</span>
              </div>
              <div>
                <strong><AnimatedCount value={12847} /> listening now</strong>
                <span>Across Nairobi & everywhere</span>
              </div>
              <span className="hero__listen-wave"><Waveform compact animated /></span>
            </div>
          </div>

          <div className="hero-visual" aria-label="Savanna FM on air presenter">
            <AnimatedFlipbook />
            <div className="hero-visual__sun" />
            <div className="hero-visual__frame">
              <Image src="/images/voice-red-dress.jpg" alt="Performer at a microphone in a Pexels studio photograph" fill sizes="(max-width: 700px) 78vw, (max-width: 960px) 40vw, 38vw" priority />
              <div className="hero-visual__shade" />
              <span className="hero-visual__caption">SOUND OF HERE <span>↗</span></span>
            </div>
            <div className="hero-visual__stamp"><span>98.4</span><small>NAIROBI<br />FM</small></div>
            <div className="hero-now-card">
              <span className="hero-now-card__dot" />
              <div className="hero-now-card__copy"><span>RIGHT NOW · LIVE</span><strong>{nowPlaying.show || 'The Midday Mix'}</strong><small>with {nowPlaying.presenter || 'Nia Wambui'}</small></div>
              <button type="button" onClick={toggleLive} aria-label={playing ? 'Pause live stream' : 'Play live stream'}>
                {playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
              </button>
            </div>
            <span className="hero-visual__vertical">ALL THE WAY LIVE · 98.4 FM</span>
          </div>

          <a className="hero__scroll" href="#shows"><span>SCROLL TO TUNE IN</span><ArrowDown size={15} /></a>
          <span className="hero__edition">VOL. 01 &nbsp; / &nbsp; LIVE FROM NAIROBI</span>
        </div>
      </section>

      <section className="frequency-strip" aria-label="What Savanna FM plays">
        <div className="frequency-strip__inner">
          <span className="frequency-strip__label"><Radio size={17} /> THE FREQUENCY</span>
          <div className="frequency-strip__list">
            <span>KENYAN MUSIC</span><span>REAL TALK</span><span>GLOBAL SOUNDS</span><span>CITY STORIES</span><span>GOOD ENERGY</span>
          </div>
          <span className="frequency-strip__right">98.4 FM <span>↗</span></span>
        </div>
      </section>

      <section className="section section--shows page-shell" id="shows">
        <Reveal>
          <div className="section-heading section-heading--split">
            <div>
              <Eyebrow number="01">ON THE FREQUENCY</Eyebrow>
              <h2>Find your<br /><em>frequency.</em></h2>
            </div>
            <div className="section-heading__aside">
              <p>Whatever the hour, there is a voice, a beat, and a whole lot of Nairobi waiting for you.</p>
              <a className="text-link" href="#presenters">Meet the voices <ArrowUpRight size={16} /></a>
            </div>
          </div>
        </Reveal>
        <div className="show-grid">
          {scheduleItems.map((show, index) => (
            <Reveal key={show.id} delay={index * 0.07}>
              <article className={`show-card show-card--${show.tone}`}>
                <Image className="show-card__image" src={show.image} alt="" fill sizes="(max-width: 700px) 50vw, (max-width: 960px) 47vw, 25vw" loading="lazy" />
                <div className="show-card__gradient" />
                <div className="show-card__top"><span className="show-card__tag">{show.tag}</span><span className="show-card__index">0{index + 1}</span></div>
                <div className="show-card__glass">
                  <span className="show-card__time"><Clock3 size={13} /> {show.time}</span>
                  <h3>{show.name}</h3>
                  <p>{show.description}</p>
                  <div className="show-card__bottom"><span>{show.days} <i /> {show.host}</span><span className="show-card__arrow"><ArrowUpRight size={17} /></span></div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="schedule-note"><span className="schedule-note__dot" /> Nairobi time · EAT (UTC+3) <span className="schedule-note__line" /> <span>Missed a show? Catch it in Podcasts.</span><a href="#podcasts">Go to replay <ArrowRight size={14} /></a></div>
      </section>

      <section className="section section--presenters" id="presenters">
        <div className="page-shell">
          <Reveal>
            <div className="section-heading section-heading--split section-heading--presenters">
              <div>
                <Eyebrow number="02">THE PEOPLE BEHIND THE MIC</Eyebrow>
                <h2>Voices that<br /><em>feel like home.</em></h2>
              </div>
              <div className="section-heading__aside">
                <p>Big personalities. Bigger playlists. Meet the people bringing Nairobi into every room.</p>
                <a className="text-link" href="#shows">See the schedule <ArrowUpRight size={16} /></a>
              </div>
            </div>
          </Reveal>
          <div className="presenter-grid">
            {presenters.map((presenter, index) => (
              <Reveal key={presenter.id} delay={(index % 3) * 0.06}>
                <article className={`presenter-card presenter-card--${index + 1}`}>
                  <div className="presenter-card__visual">
                    <Image src={presenter.image} alt={presenter.imageAlt} fill sizes="(max-width: 700px) 50vw, (max-width: 960px) 33vw, 30vw" loading="lazy" />
                    <div className="presenter-card__scrim" />
                    <span className="presenter-card__label">{presenter.specialty}</span>
                    <span className="presenter-card__number">0{index + 1}</span>
                    <div className="presenter-card__reveal">
                      <span>ON AIR</span><strong>{presenter.days}</strong><b>{presenter.time}</b>
                      <span className="presenter-card__reveal-line" />
                      <small>{presenter.show}</small>
                    </div>
                    <a href={presenter.instagram} target="_blank" rel="noreferrer" className="presenter-card__social" aria-label={`Follow ${presenter.name} on Instagram`}><Instagram size={16} /></a>
                  </div>
                  <div className="presenter-card__details"><div><h3>{presenter.name}</h3><p>{presenter.show}</p></div><span className="presenter-card__arrow"><ArrowUpRight size={18} /></span></div>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="presenter-footnote">THE VOICES OF YOUR CITY, EVERY DAY.</div>
        </div>
      </section>

      <section className="section section--news page-shell" id="news">
        <Reveal>
          <div className="section-heading section-heading--split">
            <div>
              <Eyebrow number="03">THE LATEST FREQUENCY</Eyebrow>
              <h2>More than<br /><em>just the music.</em></h2>
            </div>
            <div className="section-heading__aside">
              <p>Local voices, culture, sport and the stories moving East Africa right now.</p>
              <div className="rail-controls">
                <button type="button" onClick={() => changeNewsRail('left')} aria-label="Scroll news left"><ChevronLeft size={18} /></button>
                <button type="button" onClick={() => changeNewsRail('right')} aria-label="Scroll news right"><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>
        </Reveal>
        <div className="news-rail" ref={newsRailRef}>
          {newsItems.map((item, index) => <NewsCard key={item.id} item={item} index={index} />)}
          <a className="news-card news-card--more" href="#newsletter"><span className="news-card--more__circle"><ArrowUpRight size={26} /></span><span>ALL THE<br />STORIES.</span><small>Follow the frequency</small></a>
        </div>
        <div className="section-bottom-link"><span>STAY CURIOUS. STAY CONNECTED.</span><a className="text-link" href="#social">Find us on socials <ArrowUpRight size={16} /></a></div>
      </section>

      <section className="section section--podcasts section--webgl section--morphing" id="podcasts">
        <LiquidMorph tone="sage" className="liquid-morph--section" />
        <ImmersiveRadioEnvironment variant="archive" />
        <div className="page-shell">
          <Reveal>
            <div className="section-heading section-heading--split">
              <div>
                <Eyebrow number="04">SOUND THAT STAYS WITH YOU</Eyebrow>
                <h2>On demand.<br /><em>On your time.</em></h2>
              </div>
              <div className="section-heading__aside">
                <p>Conversations worth replaying, mixes worth keeping, and the shows you missed.</p>
                <a className="text-link" href="#podcasts">Explore the archive <ArrowUpRight size={16} /></a>
              </div>
            </div>
          </Reveal>
          <div className="episode-grid">
            {podcastItems.map((episode, index) => (
              <Reveal key={episode.id} delay={(index % 3) * 0.06}>
                <EpisodeCard episode={episode} onPlay={playEpisode} isActive={activeEpisode === episode.id && playing} />
              </Reveal>
            ))}
          </div>
          <div className="podcast-cta"><span><Headphones size={16} /> FROM THE STUDIO TO YOUR POCKET</span><a href="#newsletter">Never miss an episode <ArrowRight size={16} /></a></div>
        </div>
      </section>

      <section className="section section--charts section--morphing page-shell" id="charts">
        <LiquidMorph tone="cream" className="liquid-morph--section liquid-morph--reverse" />
        <Reveal>
          <div className="section-heading section-heading--split">
            <div>
              <Eyebrow number="05">THE SOUND OF RIGHT NOW</Eyebrow>
              <h2>Ten tracks.<br /><em>One heartbeat.</em></h2>
            </div>
            <div className="section-heading__aside">
              <p>The tracks we cannot stop playing, selected by our music team and the people who listen.</p>
              <span className="chart-date"><span className="chart-date__dot" /> WEEK 40 <i /> OCT 2026</span>
            </div>
          </div>
        </Reveal>
        <div className="chart-layout">
          <div className="chart-list" role="list" aria-label="This week's top 10 in Kenya">
            {chartTracks.map((track, index) => (
              <motion.div className="chart-row" key={track.rank} role="listitem" initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.035 }}>
                <span className={`chart-row__rank ${index < 3 ? 'chart-row__rank--top' : ''}`}>{track.rank}</span>
                <TrackArtwork tone={track.art} label={track.artist.split(' ').map((part) => part[0]).join('').slice(0, 2)} />
                <span className="chart-row__song"><strong>{track.title}</strong><small>{track.artist}</small></span>
                <span className="chart-row__weeks">{track.weeks} <small>WKS</small></span>
                <span className={`chart-row__trend chart-row__trend--${track.trend}`} aria-label={track.trend === 'up' ? 'Trending up' : track.trend === 'down' ? 'Trending down' : 'No change'}>
                  {track.trend === 'up' ? <TrendingUp size={17} /> : track.trend === 'down' ? <TrendingDown size={17} /> : <Minus size={16} />}
                  <small>{track.rotation}</small>
                </span>
              </motion.div>
            ))}
          </div>
          <aside className="chart-feature">
            <div className="chart-feature__art"><Image src="/images/nairobi-crowd.jpg" alt="Audience lights at a live performance" fill sizes="(max-width: 700px) 100vw, 40vw" loading="lazy" /><div className="chart-feature__overlay" /><div className="chart-feature__circle">THE<br /><strong>10</strong><br />RIGHT<br />NOW</div><Waveform compact animated /></div>
            <div className="chart-feature__copy"><span>THE SAVANNA TOP 10</span><h3>Kenya, this one’s<br /><em>for you.</em></h3><p>A weekly snapshot of the sounds shaping the scene. What’s your number one?</p><button className="text-link" type="button" onClick={() => setRequestOpen(true)}>Make a song request <ArrowUpRight size={16} /></button></div>
            <div className="chart-feature__foot"><span>CURATED IN NAIROBI</span><span>98.4 FM</span></div>
          </aside>
        </div>
      </section>

      <section className="section section--events" id="events">
        <div className="page-shell">
          <Reveal>
            <div className="section-heading section-heading--split">
              <div>
                <Eyebrow number="06">MEET US OUT THERE</Eyebrow>
                <h2>Good sound.<br /><em>Better company.</em></h2>
              </div>
              <div className="section-heading__aside">
                <p>From the airwaves to the dance floor. Pull up and be part of the story.</p>
                <a className="text-link" href="#advertise">Partner on an event <ArrowUpRight size={16} /></a>
              </div>
            </div>
          </Reveal>
          <div className="event-grid">
            {events.map((event, index) => (
              <Reveal key={event.id} delay={index * 0.07}>
                <article className="event-card">
                  <div className="event-card__image"><Image src={event.image} alt={event.imageAlt} fill sizes="(max-width: 700px) 50vw, 33vw" loading="lazy" /><div className="event-card__shade" /><span className="event-card__date"><strong>{event.day}</strong><small>{event.month}</small></span><span className="event-card__tag"><CalendarDays size={13} /> {event.label}</span></div>
                  <div className="event-card__copy"><div><span className="event-card__time"><Clock3 size={13} /> {event.time}</span><h3>{event.title}</h3><p><MapPin size={13} /> {event.place}</p></div><a href={`mailto:events@savannafm.co.ke?subject=${encodeURIComponent(`Tickets for ${event.title}`)}`} className="event-card__ticket" aria-label={`Get tickets for ${event.title}`}><Ticket size={14} /><span>Get tickets</span><ArrowUpRight size={13} /></a></div>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="events-note">WE’LL SAVE YOU A SPOT.</div>
        </div>
      </section>

      <section className="advertise advertise--webgl section--morphing" id="advertise">
        <LiquidMorph tone="forest" className="liquid-morph--advertise" />
        <ImmersiveRadioEnvironment variant="signal" />
        <div className="advertise__noise" aria-hidden="true" />
        <div className="page-shell advertise__inner">
          <Reveal className="advertise__copy">
            <Eyebrow number="07">GOOD BRANDS. GOOD ENERGY.</Eyebrow>
            <h2>Your brand,<br />in the <em>right frequency.</em></h2>
            <p>Bring your business into the conversation. Radio, digital and live events that make a connection that travels.</p>
            <div className="advertise__buttons">
              <a className="button button--light" href="/savanna-media-kit.txt" download><span>Download rate card</span><ArrowDown size={16} /></a>
              <a className="button button--outline" href={`${whatsappBase}?text=${encodeURIComponent('Hello! I would like to advertise with Savanna FM 98.4.')}`} target="_blank" rel="noreferrer"><span>Talk to our team</span><ArrowUpRight size={16} /></a>
            </div>
            <span className="advertise__contact"><Mail size={13} /> partnerships@savannafm.co.ke</span>
          </Reveal>
          <div className="advertise__graphic" aria-hidden="true">
            <div className="advertise__orbit advertise__orbit--one" /><div className="advertise__orbit advertise__orbit--two" />
            <div className="advertise__disc"><span>YOUR<br /><strong>BRAND</strong><br />HERE</span></div>
            <div className="advertise__graphic-label">REACH<br />THE WHOLE<br />CITY.</div>
            <div className="advertise__graphic-small">98.4<br />FM</div>
          </div>
        </div>
      </section>

      <section className="section section--social page-shell" id="social">
        <Reveal>
          <div className="section-heading section-heading--split">
            <div>
              <Eyebrow number="08">OUT IN THE WORLD</Eyebrow>
              <h2>Join the<br /><em>conversation.</em></h2>
            </div>
            <div className="section-heading__aside"><p>From the booth to the timeline. Tag your moment with <strong>#SavannaOnAir</strong>.</p><a className="text-link" href="https://www.instagram.com/" target="_blank" rel="noreferrer">Follow along <ArrowUpRight size={16} /></a></div>
          </div>
        </Reveal>
        <div className="social-layout">
          <div className="social-feed-card">
            <div className="social-feed-card__head"><div className="social-platform"><span className="social-platform__icon"><span>𝕏</span></span><div><strong>THE SAVANNA FEED</strong><small>THE LATEST FROM THE STUDIO</small></div></div><a href="https://x.com/" target="_blank" rel="noreferrer" aria-label="Open X"><ArrowUpRight size={16} /></a></div>
            <div className="social-feed-card__quote"><span className="social-feed-card__quote-mark">“</span><p>What’s the one song that takes you straight back home? Nairobi, we’re taking your requests all afternoon. Send them in 🎙️</p><strong>@SAVANNAFM984</strong></div>
            <div className="social-feed-card__footer"><span><span className="social-feed-card__live-dot" /> LIVE FROM THE BOOTH</span><a href="https://x.com/" target="_blank" rel="noreferrer">JOIN THE CHAT <ArrowUpRight size={13} /></a></div>
          </div>
          <div className="instagram-wall">
            <div className="instagram-wall__head"><div><Instagram size={16} /><strong>FROM THE FREQUENCY</strong></div><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">@SAVANNAFM984 <ArrowUpRight size={13} /></a></div>
            <div className="instagram-wall__grid">
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="instagram-tile instagram-tile--one"><Image src="/images/voice-red-dress.jpg" alt="Artist recording a vocal take" fill sizes="(max-width: 700px) 50vw, 22vw" loading="lazy" /><span>IN THE STUDIO <ArrowUpRight size={12} /></span></a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="instagram-tile instagram-tile--two"><Image src="/images/nairobi-crowd.jpg" alt="Live music crowd" fill sizes="(max-width: 700px) 50vw, 22vw" loading="lazy" /><span>OUT THERE <ArrowUpRight size={12} /></span></a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="instagram-tile instagram-tile--three"><Image src="/images/voice-studio-female.jpg" alt="Host in the recording booth" fill sizes="(max-width: 700px) 50vw, 22vw" loading="lazy" /><span>ON AIR <ArrowUpRight size={12} /></span></a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="instagram-tile instagram-tile--four"><Image src="/images/voice-headwrap.jpg" alt="Vocalist on the microphone" fill sizes="(max-width: 700px) 50vw, 22vw" loading="lazy" /><span>THE VOICES <ArrowUpRight size={12} /></span></a>
            </div>
          </div>
        </div>
      </section>

      <section className="newsletter" id="newsletter">
        <div className="page-shell newsletter__inner">
          <div className="newsletter__copy"><span className="newsletter__icon"><Sparkles size={17} /></span><div><span className="eyebrow">THE WEEKLY FREQUENCY</span><h2>Good music. <em>In your inbox.</em></h2><p>Our playlist, new stories, and things to do around the city. No noise.</p></div></div>
          <form className="newsletter__form" onSubmit={handleNewsletter}>
            <label className="sr-only" htmlFor="newsletter-email">Your email address</label>
            <input id="newsletter-email" type="email" placeholder="Your email address" value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} required disabled={newsletterState !== 'idle'} />
            <button type="submit" disabled={newsletterState !== 'idle'}>{newsletterState === 'done' ? <><Check size={16} /> You’re on the list</> : newsletterState === 'sending' ? 'Joining…' : <>Sign me up <ArrowUpRight size={16} /></>}</button>
            <small>By signing up, you agree to receive the Savanna FM weekly playlist.</small>
          </form>
        </div>
      </section>

      <footer className="site-footer">
        <div className="page-shell">
          <div className="site-footer__main">
            <div className="site-footer__brand"><AppLogo /><p>THE SOUND OF HERE.<br />LIVE FROM NAIROBI.</p><span className="footer-frequency">98.4<span> FM</span></span></div>
            <div className="site-footer__column"><span className="site-footer__label">TUNE IN</span><a href="#shows">Shows & schedule</a><a href="#podcasts">Podcasts</a><button type="button" onClick={toggleLive}>Listen live <ArrowUpRight size={13} /></button></div>
            <div className="site-footer__column"><span className="site-footer__label">SAY HELLO</span><a href="mailto:hello@savannafm.co.ke">hello@savannafm.co.ke</a><a href="mailto:partnerships@savannafm.co.ke">Advertise with us</a><a href="tel:+254112272061">+254 112 272 061</a></div>
            <div className="site-footer__column site-footer__social"><span className="site-footer__label">FIND YOUR PEOPLE</span><div><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={16} /></a><a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={16} /></a><a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube size={17} /></a><a href="https://x.com/" target="_blank" rel="noreferrer" aria-label="X"><span>𝕏</span></a></div><span className="site-footer__location"><MapPin size={13} /> NAIROBI, KENYA</span></div>
          </div>
          <div className="site-footer__bottom"><span>© 2026 SAVANNA FM 98.4 · ALL RIGHTS RESERVED</span><span>MADE FOR THE FREQUENCY OF HERE</span><a href="#home">BACK TO TOP <ArrowUpRight size={13} /></a></div>
        </div>
      </footer>

      <a className="whatsapp-float" href={`${whatsappBase}?text=${encodeURIComponent('Hello! I want to make a song request on Savanna FM 98.4')}`} target="_blank" rel="noreferrer" aria-label="Request a song or dedicate to someone on WhatsApp">
        <span className="whatsapp-float__tooltip">Request a song or dedicate to someone 🎵</span><MessageCircleIcon /><span className="whatsapp-float__pulse" />
      </a>

      <aside className={`player-bar ${playing ? 'player-bar--playing' : ''}`} aria-label="Savanna FM live player">
        <div className="player-bar__inner">
          <div className="player-track">
            <div className="player-track__art"><Image src={nowPlaying.artwork || '/images/voice-red-dress.jpg'} alt="" fill sizes="46px" /><span><Music2 size={13} /></span></div>
            <div className="player-track__copy"><span className="player-kicker">{activeEpisode ? 'NOW PLAYING · PODCAST' : 'SAVANNA FM · 98.4'}</span><strong>{nowPlaying.title}</strong><small>{nowPlaying.artist}</small></div>
          </div>
          <div className="player-controls">
            <button className="player-main-button" type="button" onClick={toggleLive} aria-label={playing ? 'Pause stream' : 'Play stream'}>
              {loading ? <span className="player-spinner" /> : playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
            </button>
            <div className="player-controls__meta"><div className="player-status"><span className={playing ? 'player-status__dot player-status__dot--live' : 'player-status__dot'} />{playing ? 'LIVE ON AIR' : 'READY WHEN YOU ARE'}</div><MorphingSignal /></div>
          </div>
          <div className="player-volume"><button type="button" aria-label={muted ? 'Unmute' : 'Mute'} onClick={() => setMuted((state) => !state)}>{muted || volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}</button><input aria-label="Volume" type="range" min="0" max="1" step="0.01" value={muted ? 0 : volume} onChange={(event) => { setVolume(Number(event.target.value)); setMuted(false); }} style={{ '--volume-fill': `${(muted ? 0 : volume) * 100}%` } as React.CSSProperties} /></div>
          <button className="player-request" type="button" onClick={() => { setRequestOpen(true); setRequestState('idle'); }}><span className="player-request__icon"><Mic size={15} /></span><span>Request a song</span><ArrowUpRight size={15} /></button>
        </div>
      </aside>

      <AnimatePresence>
        {requestOpen && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) resetRequest(); }}>
            <motion.div className="request-modal" role="dialog" aria-modal="true" aria-labelledby="request-title" initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }} transition={{ duration: 0.22 }}>
              <button className="request-modal__close" type="button" onClick={resetRequest} aria-label="Close request form"><X size={19} /></button>
              <span className="request-modal__eyebrow"><span className="on air-dot" /> DIRECT TO THE STUDIO</span>
              <h2 id="request-title">Make it<br /><em>your song.</em></h2>
              <p>Tell us what you want to hear, who it’s for, and we’ll pass it on to the team.</p>
              {requestState === 'sent' ? (
                <div className="request-success"><span><Check size={20} /></span><strong>That’s a good choice.</strong><p>Your WhatsApp message is ready. Send it to put your request on the air.</p><button className="button button--orange" type="button" onClick={resetRequest}>Back to the station <ArrowRight size={16} /></button></div>
              ) : (
                <form className="request-form" onSubmit={handleRequestSubmit}>
                  <label>SONG TITLE<input value={requestSong} onChange={(event) => setRequestSong(event.target.value)} placeholder="What should we play?" required /></label>
                  <div className="request-form__row"><label>ARTIST<input value={requestArtist} onChange={(event) => setRequestArtist(event.target.value)} placeholder="Artist name" /></label><label>YOUR NAME<input value={requestName} onChange={(event) => setRequestName(event.target.value)} placeholder="First name" /></label></div>
                  <label>DEDICATE IT TO <span>(OPTIONAL)</span><input value={dedication} onChange={(event) => setDedication(event.target.value)} placeholder="Someone special, maybe?" /></label>
                  <button className="button button--orange request-submit" type="submit" disabled={requestState === 'sending'}>{requestState === 'sending' ? 'Sending your request…' : 'Send with WhatsApp'} {requestState === 'sending' ? <span className="player-spinner" /> : <Send size={16} />}</button>
                  <small>We’ll open WhatsApp to send your message to the studio.</small>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <motion.div className="toast" role="status" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}><span className="toast__icon"><Radio size={15} /></span>{toast}<button type="button" onClick={() => setToast('')} aria-label="Dismiss message"><X size={15} /></button></motion.div>}
      </AnimatePresence>
    </main>
  );
}

function MessageCircleIcon() {
  return <span className="whatsapp-brand-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M20.1 11.8a8 8 0 0 1-11.9 7L4 20l1.2-4a8 8 0 1 1 14.9-4.2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 8.5c.2-.5.4-.5.7-.5h.4c.2 0 .3.1.4.4l.7 1.7c.1.2.1.4-.1.6l-.5.6c-.2.2-.2.4 0 .7.5.9 1.2 1.6 2.1 2.1.3.2.5.2.7 0l.7-.8c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.2.4.4 0 .3-.2 1.1-.6 1.4-.4.4-1 .7-1.7.7-.4 0-.9-.1-1.5-.3-2.4-.9-4-2.7-4.6-3.6-.6-.9-1-1.7-1-2.4 0-.7.3-1.3.7-1.7Z" fill="currentColor"/></svg></span>;
}
