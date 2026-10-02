import scheduleData from "../data/schedule.json";
import newsData from "../data/news.json";
import podcastData from "../data/podcasts.json";

export type ScheduleItem = {
  id: string;
  time: string;
  name: string;
  host: string;
  days: string;
  description: string;
  tag: string;
  image: string;
  tone: string;
};

export type NewsItem = {
  id: string;
  category: string;
  label: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  image: string;
  tone: string;
};

export type PodcastEpisode = {
  id: string;
  show: string;
  title: string;
  date: string;
  duration: string;
  episode: string;
  audioUrl: string | null;
  artwork: string;
};

export const schedule = scheduleData as ScheduleItem[];
export const news = newsData as NewsItem[];
export const podcasts = podcastData as PodcastEpisode[];

export const presenters = [
  {
    id: "amani",
    name: "Amani Wanjiku",
    show: "Wake Up Nairobi",
    days: "MON TO FRI",
    time: "06:00 TO 10:00",
    image: "/images/voice-headwrap.jpg",
    imageAlt: "Singer at a microphone in a Pexels studio portrait",
    specialty: "THE EARLY RISER",
    instagram: "https://www.instagram.com/",
  },
  {
    id: "nia",
    name: "Nia Wambui",
    show: "The Midday Mix",
    days: "MON TO FRI",
    time: "10:00 TO 14:00",
    image: "/images/voice-studio-female.jpg",
    imageAlt: "Podcast host wearing headphones in a recording studio",
    specialty: "THE TASTE-MAKER",
    instagram: "https://www.instagram.com/",
  },
  {
    id: "musa",
    name: "Musa K.",
    show: "The Evening Rush",
    days: "MON TO FRI",
    time: "16:00 TO 20:00",
    image: "/images/voice-studio-male.jpg",
    imageAlt: "Podcast host speaking into a studio microphone",
    specialty: "THE CITY INSIDER",
    instagram: "https://www.instagram.com/",
  },
  {
    id: "soko",
    name: "DJ Soko",
    show: "After Hours",
    days: "EVERY NIGHT",
    time: "20:00 TO 00:00",
    image: "/images/voice-red-dress.jpg",
    imageAlt: "Performer singing into a vintage microphone",
    specialty: "THE NIGHT OWL",
    instagram: "https://www.instagram.com/",
  },
  {
    id: "otieno",
    name: "Otieno Biko",
    show: "The Round Up",
    days: "SATURDAY",
    time: "12:00 TO 15:00",
    image: "/images/voice-studio-male.jpg",
    imageAlt: "Host recording a podcast in a sound-treated studio",
    specialty: "THE BIG DEBATER",
    instagram: "https://www.instagram.com/",
  },
  {
    id: "zuri",
    name: "Zuri M.",
    show: "Weekend Lounge",
    days: "SAT TO SUN",
    time: "15:00 TO 19:00",
    image: "/images/voice-headwrap.jpg",
    imageAlt: "Vocalist performing in a studio with a microphone",
    specialty: "THE GOOD-VIBE CURATOR",
    instagram: "https://www.instagram.com/",
  },
];

export const chartTracks = [
  { rank: "01", artist: "Bien", title: "Ma Cherie", weeks: 4, trend: "up", art: "sunset", rotation: "NEW ENTRY" },
  { rank: "02", artist: "Njerae", title: "Aki Sioni", weeks: 6, trend: "up", art: "violet", rotation: "+3" },
  { rank: "03", artist: "Wakadinali", title: "Extra Pressure", weeks: 8, trend: "same", art: "red", rotation: "STEADY" },
  { rank: "04", artist: "Bensoul", title: "Nairobi", weeks: 3, trend: "up", art: "blue", rotation: "+2" },
  { rank: "05", artist: "Nikita Kering'", title: "Ex", weeks: 5, trend: "down", art: "pink", rotation: "−1" },
  { rank: "06", artist: "Sauti Sol", title: "Suzanna", weeks: 10, trend: "same", art: "gold", rotation: "STEADY" },
  { rank: "07", artist: "Karun", title: "Glow Up", weeks: 2, trend: "up", art: "green", rotation: "NEW" },
  { rank: "08", artist: "Mutoriah", title: "Kiss Me", weeks: 7, trend: "down", art: "lilac", rotation: "−2" },
  { rank: "09", artist: "Xenia Manasseh", title: "Love / Hate", weeks: 4, trend: "up", art: "orange", rotation: "+1" },
  { rank: "10", artist: "Muthaka", title: "Pole Pole", weeks: 1, trend: "up", art: "silver", rotation: "NEW" },
];

export const events = [
  {
    id: "sunset-sessions",
    day: "18",
    month: "OCT",
    label: "LIVE MUSIC · NAIROBI",
    title: "Sunset Sessions",
    place: "The Riverfront, Nairobi",
    time: "GATES 4:00 PM",
    image: "/images/nairobi-crowd.jpg",
    imageAlt: "Crowd gathered for a live music performance",
  },
  {
    id: "city-sounds",
    day: "31",
    month: "OCT",
    label: "HALLOWEEN · ALL NIGHT",
    title: "City Sounds: After Dark",
    place: "Msa Road Warehouse, Nairobi",
    time: "GATES 8:00 PM",
    image: "/images/voice-red-dress.jpg",
    imageAlt: "Singer performing under dramatic studio lighting",
  },
  {
    id: "savanna-picnic",
    day: "14",
    month: "NOV",
    label: "COMMUNITY · FAMILY FRIENDLY",
    title: "The Savanna Picnic",
    place: "Karura Forest, Nairobi",
    time: "GATES 11:00 AM",
    image: "/images/voice-headwrap.jpg",
    imageAlt: "Vocalist with a microphone at a performance",
  },
];

export const defaultNowPlaying = {
  title: "Nairobi Nights",
  artist: "Savanna Selecta",
  show: "The Midday Mix",
  presenter: "Nia Wambui",
  artwork: "/images/voice-red-dress.jpg",
  source: "station-default",
};
