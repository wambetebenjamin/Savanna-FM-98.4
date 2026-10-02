'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ArrowUpRight,
  ChevronRight,
  Facebook,
  Heart,
  History,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Pause,
  Play,
  Radio,
  Volume2,
  X,
  Youtube,
} from 'lucide-react';
import { chartTracks, defaultNowPlaying, events, news, podcasts, presenters, schedule } from '../lib/content';

const genres = ['Kenyan Music', 'Amapiano', 'Hip Hop', 'Soul and R&B', 'Talk', 'News', 'Gospel'];
const quickLinks = [
  { label: 'Listen Live', href: '#listen' },
  { label: 'Recently Played', href: '#recent' },
  { label: 'Programs', href: '#programs' },
  { label: 'Presenters', href: '#presenters' },
  { label: 'Latest Stories', href: '#stories' },
  { label: 'Podcasts', href: '#podcasts' },
];
const playedTimes = ['3 minutes ago', '9 minutes ago', '16 minutes ago', '22 minutes ago', '31 minutes ago', '38 minutes ago'];

function StationMark() {
  return (
    <span className="directory-mark" aria-hidden="true">
      <span /><span /><span /><span />
    </span>
  );
}

export default function StationDirectoryExperience() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [volume, setVolume] = useState(0.78);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const streamUrl = process.env.NEXT_PUBLIC_STREAM_URL || '';

  useEffect(() => {
    setFavorite(window.localStorage.getItem('savannaFavorite') === 'true');
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const toggleFavorite = () => {
    const next = !favorite;
    setFavorite(next);
    window.localStorage.setItem('savannaFavorite', String(next));
    setNotice(next ? 'Savanna FM is now in your favorites.' : 'Savanna FM was removed from your favorites.');
  };

  const toggleLive = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    if (!streamUrl) {
      setNotice('The live stream is ready for the station audio link.');
      return;
    }
    try {
      audio.src = streamUrl;
      audio.volume = volume;
      await audio.play();
      setPlaying(true);
      setNotice('');
    } catch {
      setNotice('The live stream could not connect. Please try again.');
    }
  };

  return (
    <main className="directory-site">
      <audio ref={audioRef} preload="none" onPause={() => setPlaying(false)} onPlaying={() => setPlaying(true)} />

      <header className="directory-header">
        <div className="directory-wrap directory-header__inner">
          <a className="directory-brand" href="#top" aria-label="Savanna FM home">
            <StationMark />
            <span><strong>SAVANNA</strong><small>FM 98.4</small></span>
          </a>
          <nav className={menuOpen ? 'directory-nav directory-nav--open' : 'directory-nav'} aria-label="Main navigation">
            <a href="#listen" onClick={() => setMenuOpen(false)}>Listen</a>
            <a href="#recent" onClick={() => setMenuOpen(false)}>Recently Played</a>
            <a href="#programs" onClick={() => setMenuOpen(false)}>Programs</a>
            <a href="#stories" onClick={() => setMenuOpen(false)}>Stories</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </nav>
          <div className="directory-header__tools">
            <button type="button" onClick={toggleFavorite} className={favorite ? 'directory-tool directory-tool--active' : 'directory-tool'}>
              <Heart size={16} fill={favorite ? 'currentColor' : 'none'} /><span>Favorites</span>
            </button>
            <a className="directory-tool" href="#recent"><History size={16} /><span>Recent</span></a>
            <button className="directory-menu" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <section className="directory-signal" id="top" aria-label="Station status">
        <div className="directory-wrap directory-signal__inner">
          <span><b>●</b> LIVE IN NAIROBI</span>
          <p>🎵 Kenyan music&nbsp;&nbsp; ✦ &nbsp;&nbsp;Real talk&nbsp;&nbsp; ✦ &nbsp;&nbsp;City stories&nbsp;&nbsp; ✦ &nbsp;&nbsp;Good energy</p>
          <strong>98.4 FM</strong>
        </div>
      </section>

      <div className="directory-wrap directory-layout">
        <aside className="directory-sidebar directory-sidebar--left" aria-label="Browse Savanna FM">
          <section className="directory-side-card">
            <h2><span>🔥</span> Genres</h2>
            <div className="directory-chip-list">
              {genres.map((genre) => <a href="#stories" key={genre}>{genre}<ChevronRight size={13} /></a>)}
            </div>
          </section>
          <section className="directory-side-card">
            <h2><span>📻</span> Explore</h2>
            <div className="directory-chip-list">
              {quickLinks.map((link) => <a href={link.href} key={link.href}>{link.label}<ChevronRight size={13} /></a>)}
            </div>
          </section>
          <section className="directory-side-card directory-location-card">
            <h2><span>📍</span> Broadcasting from</h2>
            <strong>Nairobi, Kenya</strong>
            <p>Reaching East Africa and listeners everywhere.</p>
          </section>
        </aside>

        <div className="directory-main-column">
          <section className="station-profile" id="listen">
            <div className="station-profile__identity">
              <div className="station-profile__logo"><StationMark /><span>98.4</span></div>
              <div>
                <span className="station-profile__verified">✓ KENYA RADIO</span>
                <h1>Savanna FM</h1>
                <p>98.4 FM&nbsp;&nbsp;•&nbsp;&nbsp; Nairobi</p>
              </div>
            </div>
            <div className="station-profile__actions">
              <button className={favorite ? 'station-like station-like--active' : 'station-like'} type="button" onClick={toggleFavorite}>
                <Heart size={18} fill={favorite ? 'currentColor' : 'none'} /> {favorite ? 'Saved' : 'Like station'}
              </button>
              <a href="https://wa.me/254112272061" target="_blank" rel="noreferrer">Web <ArrowUpRight size={15} /></a>
            </div>

            <div className="station-player">
              <button className="station-player__button" type="button" onClick={toggleLive} aria-label={playing ? 'Pause live radio' : 'Play live radio'}>
                {playing ? <Pause size={25} fill="currentColor" /> : <Play size={25} fill="currentColor" />}
              </button>
              <div className="station-player__copy">
                <span><i /> LIVE NOW</span>
                <strong>{defaultNowPlaying.title}</strong>
                <small>{defaultNowPlaying.artist} on Savanna FM</small>
              </div>
              <div className={playing ? 'station-equalizer station-equalizer--playing' : 'station-equalizer'} aria-hidden="true">
                {Array.from({ length: 18 }, (_, index) => <i key={index} style={{ height: `${8 + (index * 13) % 28}px` }} />)}
              </div>
              <label className="station-volume">
                <Volume2 size={17} />
                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => setVolume(Number(event.target.value))} aria-label="Volume" />
              </label>
            </div>
            {notice && <div className="directory-notice" role="status">📢 {notice}</div>}
          </section>

          <section className="now-playing-card" aria-labelledby="now-playing-title">
            <div className="directory-section-head">
              <div><span>🎵 ON AIR</span><h2 id="now-playing-title">Now Playing</h2></div>
              <span className="live-badge">LIVE</span>
            </div>
            <div className="now-playing-card__content">
              <div className="now-playing-card__art">
                <Image src="/images/voice-red-dress.jpg" alt="Savanna FM live studio" fill sizes="170px" />
              </div>
              <div className="now-playing-card__track">
                <span>THE SOUND OF RIGHT NOW</span>
                <h3>{defaultNowPlaying.title}</h3>
                <p>{defaultNowPlaying.artist}</p>
                <button type="button" onClick={toggleLive}>{playing ? <Pause size={16} /> : <Play size={16} />} {playing ? 'Pause radio' : 'Listen live'}</button>
              </div>
            </div>
          </section>

          <section className="directory-content-card" id="recent">
            <div className="directory-section-head">
              <div><span>🕘 PLAY HISTORY</span><h2>Recently Played</h2></div>
              <a href="#listen">Listen live <ArrowUpRight size={15} /></a>
            </div>
            <div className="recent-list">
              {chartTracks.slice(0, 6).map((track, index) => (
                <article className="recent-track" key={track.rank}>
                  <span className={`recent-track__art recent-track__art--${track.art}`}><Radio size={18} /></span>
                  <div><strong>{track.title}</strong><small>{track.artist}</small></div>
                  <time>{playedTimes[index]}</time>
                  <button type="button" onClick={toggleLive} aria-label={`Play ${track.title}`}><Play size={15} fill="currentColor" /></button>
                </article>
              ))}
            </div>
          </section>

          <section className="directory-content-card station-about">
            <div className="directory-section-head"><div><span>📡 ABOUT THE STATION</span><h2>Profile</h2></div></div>
            <p>Savanna FM is Nairobi’s home for Kenyan music, global sounds, honest conversation and the stories shaping East Africa. We bring the city together through live radio, culture, news and unforgettable voices.</p>
            <div className="station-slogan"><span>💬</span><div><small>OUR SLOGAN</small><strong>The heartbeat of East Africa.</strong></div></div>
          </section>

          <section className="directory-content-card" id="stories">
            <div className="directory-section-head">
              <div><span>📰 FROM THE NEWSROOM</span><h2>Latest Stories</h2></div>
              <a href="#stories">View all <ArrowUpRight size={15} /></a>
            </div>
            <div className="directory-story-grid">
              {news.map((item) => (
                <article className="directory-story" key={item.id}>
                  <div className="directory-story__image"><Image src={item.image} alt="" fill sizes="(max-width: 700px) 50vw, 220px" /></div>
                  <div><span>{item.label}</span><h3>{item.title}</h3><small>{item.date}&nbsp;&nbsp;•&nbsp;&nbsp;{item.readTime}</small></div>
                </article>
              ))}
            </div>
          </section>

          <section className="directory-content-card" id="podcasts">
            <div className="directory-section-head">
              <div><span>🎧 LISTEN ANYTIME</span><h2>Latest Podcasts</h2></div>
            </div>
            <div className="directory-podcast-list">
              {podcasts.slice(0, 4).map((episode) => (
                <article key={episode.id}>
                  <button type="button" onClick={() => setNotice('This episode will be available in the Savanna archive soon.')}><Play size={15} fill="currentColor" /></button>
                  <div><span>{episode.show}</span><strong>{episode.title}</strong><small>{episode.date}&nbsp;&nbsp;•&nbsp;&nbsp;{episode.duration}</small></div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="directory-sidebar directory-sidebar--right">
          <section className="directory-side-card" id="programs">
            <h2><span>🎙️</span> Main Programs</h2>
            <div className="program-list">
              {schedule.map((show) => (
                <article key={show.id}><span>{show.time}</span><strong>{show.name}</strong><small>{show.host}</small></article>
              ))}
            </div>
          </section>
          <section className="directory-side-card" id="presenters">
            <h2><span>👥</span> Main Presenters</h2>
            <div className="presenter-mini-list">
              {presenters.map((presenter) => (
                <article key={presenter.id}>
                  <span><Image src={presenter.image} alt="" fill sizes="42px" /></span>
                  <div><strong>{presenter.name}</strong><small>{presenter.show}</small></div>
                </article>
              ))}
            </div>
          </section>
          <section className="directory-side-card">
            <h2><span>🎟️</span> Coming Up</h2>
            <div className="event-mini-list">
              {events.map((event) => <article key={event.id}><time><b>{event.day}</b>{event.month}</time><div><strong>{event.title}</strong><small>{event.place}</small></div></article>)}
            </div>
          </section>
          <section className="directory-side-card directory-contact" id="contact">
            <h2><span>☎️</span> Contact</h2>
            <p><MapPin size={15} /> Nairobi, Kenya</p>
            <a href="tel:+254112272061"><span>📞</span> +254 112 272 061</a>
            <a href="mailto:hello@savannafm.co.ke"><Mail size={15} /> hello@savannafm.co.ke</a>
            <div className="directory-socials">
              <a href="https://www.instagram.com/" aria-label="Instagram"><Instagram size={16} /></a>
              <a href="https://www.facebook.com/" aria-label="Facebook"><Facebook size={16} /></a>
              <a href="https://www.youtube.com/" aria-label="YouTube"><Youtube size={17} /></a>
            </div>
          </section>
        </aside>
      </div>

      <footer className="directory-footer">
        <div className="directory-wrap">
          <div className="directory-brand"><StationMark /><span><strong>SAVANNA</strong><small>FM 98.4</small></span></div>
          <p>Your city. Your sound. Your station.</p>
          <span>© 2026 Savanna FM 98.4</span>
        </div>
      </footer>
    </main>
  );
}
