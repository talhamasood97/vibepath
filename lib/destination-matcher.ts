/**
 * Destination matcher — origin-first catalog with 33 destinations.
 *
 * Key changes from v1:
 * 1. Origin-first design: destinations are mapped from each origin outward in rings
 *    Ring 1 (0-3h): quick getaways  Ring 2 (3-6h): sweet spot  Ring 3 (6-10h): overnight viable
 * 2. 5-factor scoring engine (VibeDepth, TripFit, Freshness, RouteQuality, Seasonal)
 * 3. Diversity-aware top-3 selection (no more 3 cards from the same state)
 * 4. Discovery tags boost offbeat and hidden-gem destinations over always showing iconic ones
 *
 * GOVERNANCE: Static data, zero API cost, deterministic.
 */

import type { Destination, Vibe, TripInput, TransportOption } from "@/types";
import { TRAIN_ROUTES, BUS_ROUTES, getTransportOptions } from "./transport-data";
import { scoreDestination, selectDiverseTop3, type ScoredDestination } from "./destination-scorer";

// ── Destination catalogue ─────────────────────────────────────────────────────
// Ordered roughly by geography. Each destination has vibeStrength scores
// that reflect how DEEPLY it matches each vibe (not just yes/no).

const DESTINATIONS: Destination[] = [

  // ── Spiritual cluster ────────────────────────────────────────────────────────

  {
    name: "Ayodhya",
    state: "Uttar Pradesh",
    tagline: "Ram Janmabhoomi, ghats on the Saryu, and a city reborn",
    vibes: ["spiritual", "historical"],
    primaryVibe: "spiritual",
    vibeStrength: { spiritual: 0.98, historical: 0.80 },
    discovery: "popular",
    bestMonths: [10, 11, 12, 1, 2, 3],
    distanceKm: 135,
    typicalStayNights: 1,
    accommodation: {
      hostel: { min: 400, max: 800 },
      budget: { min: 800, max: 1500 },
      midrange: { min: 1500, max: 3000 },
    },
    food: { dailyBudget: 200, dailyMidrange: 400 },
    mustDo: [
      "Ram Janmabhoomi darshan (book slot online for fast-track)",
      "Saryu Aarti at Ram Ki Paidi ghat (6:30 PM)",
      "Hanuman Garhi Temple (ancient hilltop fort-temple)",
      "Kanak Bhawan (gifted to Sita by Kaikeyi — stunning golden interior)",
      "Guptar Ghat at sunrise (hidden gem — no crowds)",
    ],
    avgActivityCost: 300,
  },

  {
    name: "Varanasi",
    state: "Uttar Pradesh",
    tagline: "Ganga Aarti, ancient ghats, and the soul of India",
    vibes: ["spiritual", "historical", "city"],
    primaryVibe: "spiritual",
    vibeStrength: { spiritual: 0.97, historical: 0.75, city: 0.60 },
    discovery: "iconic",
    bestMonths: [10, 11, 12, 1, 2, 3],
    distanceKm: 350,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 300, max: 700 },
      budget: { min: 700, max: 1500 },
      midrange: { min: 1500, max: 3000 },
    },
    food: { dailyBudget: 250, dailyMidrange: 500 },
    mustDo: [
      "Evening Ganga Aarti at Dashashwamedh Ghat (6:30 PM sharp)",
      "Sunrise boat ride on the Ganga (negotiate \u20b9200\u2013350)",
      "Kashi Vishwanath Temple (6\u20138 AM to avoid queues)",
      "Sarnath day trip \u2014 where Buddha gave his first sermon (12 km, \u20b920 auto)",
      "Litti chokha and Blue Lassi (Vishwanath Gali lane)",
    ],
    avgActivityCost: 800,
  },

  {
    name: "Haridwar",
    state: "Uttarakhand",
    tagline: "Ganga Aarti, Har Ki Pauri, and gateway to the Himalayas",
    vibes: ["spiritual", "relaxing", "mountains"],
    primaryVibe: "spiritual",
    vibeStrength: { spiritual: 0.90, relaxing: 0.65, mountains: 0.45 },
    discovery: "popular",
    bestMonths: [2, 3, 4, 9, 10, 11],
    distanceKm: 480,
    typicalStayNights: 1,
    accommodation: {
      hostel: { min: 300, max: 600 },
      budget: { min: 600, max: 1200 },
      midrange: { min: 1200, max: 2400 },
    },
    food: { dailyBudget: 250, dailyMidrange: 500 },
    mustDo: [
      "Ganga Aarti at Har Ki Pauri (evening)",
      "Chandi Devi Temple via ropeway (\u20b9169)",
      "Mansa Devi Temple",
      "Rajaji National Park half-day safari",
      "Haridwar to Rishikesh shared taxi (30 min, \u20b980)",
    ],
    avgActivityCost: 500,
  },

  {
    name: "Rishikesh",
    state: "Uttarakhand",
    tagline: "Adventure capital of India \u2014 rafting, yoga, Himalayan vibes",
    vibes: ["adventure", "spiritual", "mountains", "relaxing"],
    primaryVibe: "adventure",
    vibeStrength: { adventure: 0.92, spiritual: 0.80, mountains: 0.75, relaxing: 0.70 },
    discovery: "iconic",
    bestMonths: [2, 3, 4, 9, 10, 11],
    distanceKm: 500,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 350, max: 700 },
      budget: { min: 700, max: 1400 },
      midrange: { min: 1400, max: 2800 },
    },
    food: { dailyBudget: 300, dailyMidrange: 600 },
    mustDo: [
      "White water rafting Shivpuri\u2013Rishikesh (16 km, \u20b9600\u2013900)",
      "Beatles Ashram ruins (entry \u20b9150 \u2014 surreal jungle atmosphere)",
      "Triveni Ghat aarti at 6 PM",
      "Neer Garh Waterfall trek (1.5 km, free)",
      "Yoga class on the Ganga bank",
    ],
    avgActivityCost: 1200,
  },

  {
    name: "Mathura",
    state: "Uttar Pradesh",
    tagline: "Krishna\u2019s birthplace \u2014 ghats, temples, and legendary peda",
    vibes: ["spiritual", "historical"],
    primaryVibe: "spiritual",
    vibeStrength: { spiritual: 0.95, historical: 0.70 },
    discovery: "popular",
    bestMonths: [10, 11, 12, 1, 2, 8],
    distanceKm: 70,
    typicalStayNights: 1,
    accommodation: {
      hostel: { min: 350, max: 700 },
      budget: { min: 700, max: 1400 },
      midrange: { min: 1400, max: 2800 },
    },
    food: { dailyBudget: 200, dailyMidrange: 400 },
    mustDo: [
      "Krishna Janmabhoomi Temple complex",
      "Vishram Ghat at dawn (where Krishna rested after killing Kansa)",
      "Vrindavan ISKCON Temple (15 km from Mathura)",
      "Prem Mandir (stunning marble temple, lit up at night)",
      "Brijwasi Sweets \u2014 buy authentic Mathura peda",
    ],
    avgActivityCost: 400,
  },

  {
    name: "Pushkar",
    state: "Rajasthan",
    tagline: "Brahma\u2019s lake, malpua, desert sunsets and the world\u2019s most famous camel fair",
    vibes: ["spiritual", "relaxing"],
    primaryVibe: "spiritual",
    vibeStrength: { spiritual: 0.85, relaxing: 0.80 },
    discovery: "popular",
    bestMonths: [10, 11, 12, 1, 2],
    distanceKm: 150,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 350, max: 700 },
      budget: { min: 700, max: 1500 },
      midrange: { min: 1500, max: 3000 },
    },
    food: { dailyBudget: 250, dailyMidrange: 500 },
    mustDo: [
      "Brahma Temple (one of only 3 in the world)",
      "Savitri Mata hilltop at sunrise (cable car \u20b9108 or 45-min trek)",
      "Pushkar Lake sunset from quiet northern ghats",
      "Malpua at Om Shiv Cafe \u2014 the signature dessert",
      "Camel Fair (November, Kartik Purnima)",
    ],
    avgActivityCost: 500,
  },

  {
    name: "Ujjain",
    state: "Madhya Pradesh",
    tagline: "Mahakaleshwar, the Shipra, and India\u2019s ancient meridian city",
    vibes: ["spiritual", "historical"],
    primaryVibe: "spiritual",
    vibeStrength: { spiritual: 0.97, historical: 0.75 },
    discovery: "popular",
    bestMonths: [10, 11, 12, 1, 2, 3],
    distanceKm: 55,
    typicalStayNights: 1,
    accommodation: {
      hostel: { min: 350, max: 700 },
      budget: { min: 700, max: 1400 },
      midrange: { min: 1400, max: 2800 },
    },
    food: { dailyBudget: 200, dailyMidrange: 400 },
    mustDo: [
      "Mahakaleshwar Bhasma Aarti (4 AM, pre-book on mahakaleshwar.org)",
      "Kal Bhairav Temple \u2014 the deity that drinks alcohol",
      "Ram Ghat dusk aarti",
      "Vedh Shala (Jantar Mantar of Ujjain)",
      "Dal moth and namkeen from Freeganj market",
    ],
    avgActivityCost: 350,
  },

  {
    name: "Bodh Gaya",
    state: "Bihar",
    tagline: "Where the Buddha attained enlightenment under the Bodhi Tree",
    vibes: ["spiritual", "historical"],
    primaryVibe: "spiritual",
    vibeStrength: { spiritual: 0.99, historical: 0.80 },
    discovery: "popular",
    bestMonths: [10, 11, 12, 1, 2],
    distanceKm: 110,
    typicalStayNights: 1,
    accommodation: {
      hostel: { min: 300, max: 600 },
      budget: { min: 600, max: 1200 },
      midrange: { min: 1200, max: 2500 },
    },
    food: { dailyBudget: 200, dailyMidrange: 400 },
    mustDo: [
      "Mahabodhi Temple darshan at dawn (free, monks chanting)",
      "Meditate under the Bodhi Tree (5 PM \u2014 communal chanting)",
      "Monastery circuit (Tibetan, Japanese, Thai, Chinese monasteries in 1 km)",
      "Muchalinda Lake (Buddha statue in the lotus pond)",
      "Thupka at Tibetan restaurant row",
    ],
    avgActivityCost: 300,
  },

  {
    name: "Rajgir",
    state: "Bihar",
    tagline: "Ancient seat of Magadha \u2014 hot springs, Buddhist ruins, Vishwa Shanti Stupa",
    vibes: ["spiritual", "historical"],
    primaryVibe: "spiritual",
    vibeStrength: { spiritual: 0.80, historical: 0.85 },
    discovery: "offbeat",
    bestMonths: [10, 11, 12, 1, 2, 3],
    distanceKm: 100,
    typicalStayNights: 1,
    accommodation: {
      hostel: { min: 300, max: 600 },
      budget: { min: 600, max: 1200 },
      midrange: { min: 1200, max: 2500 },
    },
    food: { dailyBudget: 180, dailyMidrange: 350 },
    mustDo: [
      "Vishwa Shanti Stupa via ropeway (panoramic Rajgir valley view)",
      "Brahma Kund hot springs dip",
      "Bimbisara\u2019s Prison ruins (King who patronised the Buddha)",
      "Nalanda ruins (12 km, shared jeep \u20b920)",
      "Ghora Katora Lake walk",
    ],
    avgActivityCost: 350,
  },

  {
    name: "Chitrakoot",
    state: "Uttar Pradesh / Madhya Pradesh",
    tagline: "Where Ram spent 11.5 years of exile \u2014 sacred and serenely beautiful",
    vibes: ["spiritual", "relaxing", "adventure"],
    primaryVibe: "spiritual",
    vibeStrength: { spiritual: 0.92, relaxing: 0.75, adventure: 0.55 },
    discovery: "offbeat",
    bestMonths: [10, 11, 12, 1, 2, 3],
    distanceKm: 230,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 300, max: 600 },
      budget: { min: 600, max: 1200 },
      midrange: { min: 1200, max: 2500 },
    },
    food: { dailyBudget: 180, dailyMidrange: 350 },
    mustDo: [
      "Ramghat aarti on the Mandakini (evening)",
      "Kamadgiri parikrama (5 km sacred hill walk)",
      "Hanuman Dhara waterfall trek",
      "Gupt Godavari caves (natural caves with underground stream)",
      "Sphatik Shila (where Ram wrote Sita\u2019s name on a rock, sacred spot)",
    ],
    avgActivityCost: 400,
  },

  // ── Historical cluster ────────────────────────────────────────────────────────

  {
    name: "Agra",
    state: "Uttar Pradesh",
    tagline: "The Taj, Agra Fort, and Mughal history in 24 hours",
    vibes: ["historical", "city"],
    primaryVibe: "historical",
    vibeStrength: { historical: 0.95, city: 0.65 },
    discovery: "iconic",
    bestMonths: [10, 11, 12, 1, 2],
    distanceKm: 320,
    typicalStayNights: 1,
    accommodation: {
      hostel: { min: 400, max: 800 },
      budget: { min: 800, max: 1600 },
      midrange: { min: 1600, max: 3200 },
    },
    food: { dailyBudget: 250, dailyMidrange: 500 },
    mustDo: [
      "Taj Mahal at sunrise (\u20b950 entry + \u20b9200 inner mausoleum, skip 10 AM\u20132 PM crowds)",
      "Agra Fort (\u20b940 entry)",
      "Mehtab Bagh sunset \u2014 best Taj view across the Yamuna (\u20b930 entry)",
      "Kinari Bazaar for marble inlay and petha",
      "Bedai and jalebi at Paliwal Restaurant (breakfast)",
    ],
    avgActivityCost: 1800,
  },

  {
    name: "Jaipur",
    state: "Rajasthan",
    tagline: "Pink City \u2014 forts, palaces, bazaars and dal baati churma",
    vibes: ["historical", "city", "relaxing"],
    primaryVibe: "historical",
    vibeStrength: { historical: 0.90, city: 0.80, relaxing: 0.60 },
    discovery: "iconic",
    bestMonths: [10, 11, 12, 1, 2],
    distanceKm: 420,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 400, max: 900 },
      budget: { min: 900, max: 1800 },
      midrange: { min: 1800, max: 3500 },
    },
    food: { dailyBudget: 300, dailyMidrange: 600 },
    mustDo: [
      "Amber Fort (8\u201310 AM before tour buses)",
      "Hawa Mahal (exterior photo from Wind View Cafe rooftop)",
      "Jantar Mantar (\u20b950 entry)",
      "Pyaaz kachori at Rawat Misthan Bhandar (9 AM)",
      "Johari Bazaar block print shopping",
    ],
    avgActivityCost: 1500,
  },

  {
    name: "Orchha",
    state: "Madhya Pradesh",
    tagline: "Medieval Bundela capital \u2014 palaces, temples, and ghats on the Betwa",
    vibes: ["historical", "relaxing"],
    primaryVibe: "historical",
    vibeStrength: { historical: 0.95, relaxing: 0.85 },
    discovery: "offbeat",
    bestMonths: [10, 11, 12, 1, 2, 3],
    distanceKm: 250,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 350, max: 700 },
      budget: { min: 700, max: 1400 },
      midrange: { min: 1400, max: 2800 },
    },
    food: { dailyBudget: 200, dailyMidrange: 400 },
    mustDo: [
      "Jehangir Mahal \u2014 stunning Mughal-Rajput palace (\u20b925)",
      "Chaturbhuj Temple at sunrise (architecturally more impressive than Ram Raja)",
      "Ram Raja Temple aarti (only temple where Ram is worshipped as king with armed guards)",
      "Betwa river cenotaphs (14 royal chhatris, almost no tourists)",
      "Orchha Wildlife Sanctuary birdwatching (200+ species, dawn walk)",
    ],
    avgActivityCost: 400,
  },

  {
    name: "Khajuraho",
    state: "Madhya Pradesh",
    tagline: "UNESCO temples with the world\u2019s most extraordinary erotic sculpture",
    vibes: ["historical"],
    primaryVibe: "historical",
    vibeStrength: { historical: 0.97 },
    discovery: "popular",
    bestMonths: [10, 11, 12, 1, 2],
    distanceKm: 500,
    typicalStayNights: 1,
    accommodation: {
      hostel: { min: 400, max: 800 },
      budget: { min: 800, max: 1500 },
      midrange: { min: 1500, max: 3000 },
    },
    food: { dailyBudget: 250, dailyMidrange: 500 },
    mustDo: [
      "Western Temple Group at sunrise (Kandariya Mahadeva, entry \u20b940)",
      "Eastern Temple Group (Parsvanath Temple, Brahma Temple \u2014 less crowded)",
      "Sound and Light Show at western group (evening, \u20b9250)",
      "Archaeological Museum (\u20b915, excellent context)",
      "Chandela Narsimha Temple village walk",
    ],
    avgActivityCost: 500,
  },

  {
    name: "Gwalior",
    state: "Madhya Pradesh",
    tagline: "The fort that Babur called \u2018the pearl among fortresses\u2019",
    vibes: ["historical"],
    primaryVibe: "historical",
    vibeStrength: { historical: 0.92 },
    discovery: "offbeat",
    bestMonths: [10, 11, 12, 1, 2, 3],
    distanceKm: 120,
    typicalStayNights: 1,
    accommodation: {
      hostel: { min: 350, max: 700 },
      budget: { min: 700, max: 1400 },
      midrange: { min: 1400, max: 2800 },
    },
    food: { dailyBudget: 220, dailyMidrange: 440 },
    mustDo: [
      "Gwalior Fort \u2014 Man Singh Palace interior and Jain rock sculptures",
      "Jai Vilas Palace museum (Scindia family palace, entry \u20b9150)",
      "Tansen\u2019s tomb (the greatest musician in Akbar\u2019s court)",
      "Gujari Mahal Archaeological Museum",
      "Gwalior Light and Sound Show at the fort (evening)",
    ],
    avgActivityCost: 500,
  },

  {
    name: "Sanchi",
    state: "Madhya Pradesh",
    tagline: "2,300-year-old Buddhist stupas on a hill \u2014 Ashoka\u2019s gift to the world",
    vibes: ["historical", "relaxing"],
    primaryVibe: "historical",
    vibeStrength: { historical: 0.93, relaxing: 0.70 },
    discovery: "offbeat",
    bestMonths: [10, 11, 12, 1, 2, 3],
    distanceKm: 45,
    typicalStayNights: 1,
    accommodation: {
      hostel: { min: 300, max: 600 },
      budget: { min: 600, max: 1200 },
      midrange: { min: 1200, max: 2500 },
    },
    food: { dailyBudget: 180, dailyMidrange: 350 },
    mustDo: [
      "Great Stupa of Ashoka (UNESCO, \u20b940 entry)",
      "Toranas (gateway carvings) \u2014 finest stone carving in ancient India",
      "Sanchi Museum (original relics and sculptures)",
      "Sunrise over the plains from the stupa hill",
      "Vidisha town (6 km) \u2014 ancient trading city with Heliodorus Pillar",
    ],
    avgActivityCost: 300,
  },

  {
    name: "Bundi",
    state: "Rajasthan",
    tagline: "The painter\u2019s Rajasthan \u2014 blue city, stepwells, and Taragarh Fort",
    vibes: ["historical", "relaxing"],
    primaryVibe: "historical",
    vibeStrength: { historical: 0.90, relaxing: 0.85 },
    discovery: "hidden-gem",
    bestMonths: [10, 11, 12, 1, 2],
    distanceKm: 210,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 350, max: 700 },
      budget: { min: 700, max: 1400 },
      midrange: { min: 1400, max: 2800 },
    },
    food: { dailyBudget: 220, dailyMidrange: 440 },
    mustDo: [
      "Taragarh Fort (free, but worth the climb for the view)",
      "Raniji Ki Baori stepwell (one of India\u2019s most beautiful stepwells)",
      "Bundi Palace \u2014 the mural paintings of the Bundi School",
      "Nawal Sagar lake and Varaha temple reflection at dawn",
      "Blue old-city walk \u2014 Bundi is painted blue like Jodhpur but without the crowds",
    ],
    avgActivityCost: 400,
  },

  {
    name: "Udaipur",
    state: "Rajasthan",
    tagline: "City of Lakes \u2014 palaces on water, sunsets over Pichola",
    vibes: ["historical", "relaxing", "city"],
    primaryVibe: "historical",
    vibeStrength: { historical: 0.88, relaxing: 0.90, city: 0.70 },
    discovery: "popular",
    bestMonths: [10, 11, 12, 1, 2],
    distanceKm: 600,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 500, max: 900 },
      budget: { min: 900, max: 1800 },
      midrange: { min: 1800, max: 4000 },
    },
    food: { dailyBudget: 300, dailyMidrange: 600 },
    mustDo: [
      "City Palace (\u20b9300 entry, sprawling palace complex)",
      "Lake Pichola boat ride at sunset (\u20b9400 RTDC boat)",
      "Jagdish Temple (free, morning puja is beautiful)",
      "Fateh Sagar Lake evening walk",
      "Saheliyon ki Bari (garden built for royal ladies)",
    ],
    avgActivityCost: 1200,
  },

  {
    name: "Jodhpur",
    state: "Rajasthan",
    tagline: "Blue City beneath the Mehrangarh \u2014 fort, bazaars, and mirchi vada",
    vibes: ["historical", "city"],
    primaryVibe: "historical",
    vibeStrength: { historical: 0.92, city: 0.75 },
    discovery: "popular",
    bestMonths: [10, 11, 12, 1, 2],
    distanceKm: 500,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 450, max: 850 },
      budget: { min: 850, max: 1700 },
      midrange: { min: 1700, max: 3500 },
    },
    food: { dailyBudget: 280, dailyMidrange: 560 },
    mustDo: [
      "Mehrangarh Fort (\u20b9100 Indians, the finest fort in Rajasthan)",
      "Jaswant Thada cenotaph (marble mausoleum, sunset views)",
      "Clock Tower bazaar walk (mirchi vada and pyaaz kachori)",
      "Blue city rooftop view from near Chamunda Mata Temple",
      "Umaid Bhawan Palace museum (\u20b930 entry)",
    ],
    avgActivityCost: 800,
  },

  {
    name: "Mandu",
    state: "Madhya Pradesh",
    tagline: "Ruined sultanate city on a plateau \u2014 Baz Bahadur, Roopmati, and monsoon magic",
    vibes: ["historical", "relaxing"],
    primaryVibe: "historical",
    vibeStrength: { historical: 0.88, relaxing: 0.80 },
    discovery: "hidden-gem",
    bestMonths: [7, 8, 9, 10, 11, 12],
    distanceKm: 100,
    typicalStayNights: 1,
    accommodation: {
      hostel: { min: 300, max: 600 },
      budget: { min: 600, max: 1200 },
      midrange: { min: 1200, max: 2500 },
    },
    food: { dailyBudget: 180, dailyMidrange: 360 },
    mustDo: [
      "Jahaz Mahal (Ship Palace \u2014 surrounded by water in monsoon)",
      "Roopmati Pavilion at sunset (legendary queen\u2019s view of Narmada)",
      "Hindola Mahal (Swing Palace \u2014 medieval earthquake-resistant architecture)",
      "Hoshang Shah\u2019s Tomb (Afghanistan-influenced, influenced Taj Mahal design)",
      "Baz Bahadur Palace (where the sultan wooed Roopmati)",
    ],
    avgActivityCost: 350,
  },

  // ── Mountains/Relaxing cluster ────────────────────────────────────────────────

  {
    name: "Mussoorie",
    state: "Uttarakhand",
    tagline: "Queen of Hills \u2014 colonial charm, pine forests, Himalayan views",
    vibes: ["mountains", "relaxing", "adventure"],
    primaryVibe: "mountains",
    vibeStrength: { mountains: 0.85, relaxing: 0.80, adventure: 0.55 },
    discovery: "popular",
    bestMonths: [4, 5, 6, 9, 10],
    distanceKm: 550,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 500, max: 900 },
      budget: { min: 900, max: 2000 },
      midrange: { min: 2000, max: 4000 },
    },
    food: { dailyBudget: 350, dailyMidrange: 700 },
    mustDo: [
      "Mall Road walk (especially at night)",
      "Kempty Falls (\u20b950 entry)",
      "Camelback Road sunrise trek",
      "Gun Hill ropeway (\u20b9150)",
      "Cloud End forest walk (7 km from Mall Road, completely peaceful)",
    ],
    avgActivityCost: 600,
  },

  {
    name: "Nainital",
    state: "Uttarakhand",
    tagline: "Lake city in the Kumaon Hills \u2014 boating, malls, and mountain air",
    vibes: ["mountains", "relaxing", "adventure"],
    primaryVibe: "mountains",
    vibeStrength: { mountains: 0.88, relaxing: 0.82, adventure: 0.55 },
    discovery: "popular",
    bestMonths: [3, 4, 5, 9, 10, 11],
    distanceKm: 480,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 450, max: 850 },
      budget: { min: 850, max: 1800 },
      midrange: { min: 1800, max: 3600 },
    },
    food: { dailyBudget: 300, dailyMidrange: 600 },
    mustDo: [
      "Naini Lake boating (\u20b9200/hr)",
      "Snow View Point ropeway (\u20b9100)",
      "Naina Devi Temple (lakeside temple)",
      "Tiffin Top trek (45 min for Himalayan panorama)",
      "Mall Road evening walk",
    ],
    avgActivityCost: 700,
  },

  {
    name: "Shimla",
    state: "Himachal Pradesh",
    tagline: "Colonial hill station \u2014 Mall Road, toy train, and snow views",
    vibes: ["mountains", "relaxing", "historical"],
    primaryVibe: "mountains",
    vibeStrength: { mountains: 0.85, relaxing: 0.80, historical: 0.55 },
    discovery: "popular",
    bestMonths: [3, 4, 5, 10, 11, 12, 1],
    distanceKm: 700,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 500, max: 900 },
      budget: { min: 900, max: 2000 },
      midrange: { min: 2000, max: 4500 },
    },
    food: { dailyBudget: 350, dailyMidrange: 700 },
    mustDo: [
      "Mall Road walk",
      "Jakhu Temple and Hanuman statue (ropeway or hike)",
      "Christ Church (colonial Gothic, Viceregal Lodge)",
      "Kufri day trip (\u20b9500\u2013800)",
      "Kalka-Shimla Toy Train (\u20b9500/person, UNESCO heritage)",
    ],
    avgActivityCost: 900,
  },

  {
    name: "Lansdowne",
    state: "Uttarakhand",
    tagline: "Quiet Garhwal hill station \u2014 pine forests, no crowds, pure mountain air",
    vibes: ["mountains", "relaxing"],
    primaryVibe: "relaxing",
    vibeStrength: { mountains: 0.80, relaxing: 0.95 },
    discovery: "hidden-gem",
    bestMonths: [3, 4, 5, 9, 10, 11],
    distanceKm: 580,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 400, max: 800 },
      budget: { min: 800, max: 1600 },
      midrange: { min: 1600, max: 3200 },
    },
    food: { dailyBudget: 280, dailyMidrange: 560 },
    mustDo: [
      "Tip 'N' Top viewpoint (360\u00b0 Himalayan panorama, free)",
      "Tarkeshwar Mahadev Temple (ancient forest temple, 38 km)",
      "Bhulla Tal (small lake with paddle boats)",
      "Garhwali Rifles War Museum (regimental history)",
      "Sunset from St. Mary\u2019s Church grounds",
    ],
    avgActivityCost: 400,
  },

  {
    name: "Pachmarhi",
    state: "Madhya Pradesh",
    tagline: "Satpura\u2019s only hill station \u2014 waterfalls, caves, forest walks",
    vibes: ["mountains", "adventure", "relaxing"],
    primaryVibe: "mountains",
    vibeStrength: { mountains: 0.82, adventure: 0.75, relaxing: 0.70 },
    discovery: "offbeat",
    bestMonths: [10, 11, 12, 1, 2, 3, 4, 5],
    distanceKm: 320,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 400, max: 800 },
      budget: { min: 800, max: 1600 },
      midrange: { min: 1600, max: 3500 },
    },
    food: { dailyBudget: 250, dailyMidrange: 500 },
    mustDo: [
      "Bee Falls and Apsara Vihar (morning, before day-trippers)",
      "Jata Shankar Cave gorge walk",
      "Dhoopgarh \u2014 highest point in MP, sunrise is unreal",
      "Gupt Mahadev Cave (you squeeze through a rock to enter)",
      "Satpura National Park jeep safari (booked via MP tourism)",
    ],
    avgActivityCost: 900,
  },

  // ── Adventure/Nature cluster ──────────────────────────────────────────────────

  {
    name: "Ranthambore",
    state: "Rajasthan",
    tagline: "India\u2019s most photogenic tiger reserve \u2014 UNESCO fort inside the jungle",
    vibes: ["adventure", "relaxing"],
    primaryVibe: "adventure",
    vibeStrength: { adventure: 0.90, relaxing: 0.70 },
    discovery: "popular",
    bestMonths: [10, 11, 12, 1, 2, 3, 4, 5, 6],
    distanceKm: 180,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 600, max: 1000 },
      budget: { min: 1000, max: 2000 },
      midrange: { min: 2000, max: 5000 },
    },
    food: { dailyBudget: 350, dailyMidrange: 700 },
    mustDo: [
      "Morning tiger safari Zone 1\u20135 (gypsy jeep, \u20b91,500\u20132,500)",
      "Evening safari Zone 1\u20135 (canter, \u20b9700\u2013900 shared)",
      "Ranthambore Fort inside the reserve (UNESCO, 10th century)",
      "Padam Lake watch (flamingos and waterbirds at the forest lake)",
      "Book 2 safaris for best sighting probability",
    ],
    avgActivityCost: 3000,
  },

  {
    name: "Pench",
    state: "Madhya Pradesh / Maharashtra",
    tagline: "Kipling\u2019s Jungle Book forest \u2014 tiger, leopard, wild dog, and teak",
    vibes: ["adventure", "relaxing"],
    primaryVibe: "adventure",
    vibeStrength: { adventure: 0.88, relaxing: 0.72 },
    discovery: "offbeat",
    bestMonths: [10, 11, 12, 1, 2, 3, 4, 5],
    distanceKm: 90,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 500, max: 900 },
      budget: { min: 900, max: 1800 },
      midrange: { min: 1800, max: 4000 },
    },
    food: { dailyBudget: 280, dailyMidrange: 560 },
    mustDo: [
      "Morning jeep safari (Turia gate, MP side)",
      "Evening safari for big cats at Rukhad gate",
      "Penchi river boat safari (winter, crocodiles and birds)",
      "Village walk near Turia for tribal Gond culture",
      "Night sky gazing \u2014 zero light pollution inside the buffer zone",
    ],
    avgActivityCost: 2500,
  },

  {
    name: "Jabalpur",
    state: "Madhya Pradesh",
    tagline: "Marble Rocks of Bhedaghat \u2014 the Narmada between 100-foot white cliffs",
    vibes: ["adventure", "relaxing", "historical"],
    primaryVibe: "relaxing",
    vibeStrength: { adventure: 0.70, relaxing: 0.85, historical: 0.55 },
    discovery: "offbeat",
    bestMonths: [10, 11, 12, 1, 2, 3],
    distanceKm: 280,
    typicalStayNights: 1,
    accommodation: {
      hostel: { min: 350, max: 700 },
      budget: { min: 700, max: 1400 },
      midrange: { min: 1400, max: 2800 },
    },
    food: { dailyBudget: 220, dailyMidrange: 440 },
    mustDo: [
      "Bhedaghat marble rocks boat ride (evening for the best light, \u20b9150)",
      "Dhuandhar Falls (Narmada plunges into the gorge \u2014 spectacular)",
      "Chausath Yogini Temple (circular 10th-century tantric temple)",
      "Madan Mahal Fort ruins (hilltop, panoramic city view)",
      "Bedaghat ropeway (\u20b9100 return)",
    ],
    avgActivityCost: 600,
  },

  // ── City cluster ──────────────────────────────────────────────────────────────

  {
    name: "Delhi",
    state: "Delhi",
    tagline: "History, street food, and the chaos that makes you feel alive",
    vibes: ["historical", "city", "relaxing"],
    primaryVibe: "city",
    vibeStrength: { historical: 0.88, city: 0.92, relaxing: 0.50 },
    discovery: "iconic",
    bestMonths: [10, 11, 12, 1, 2, 3],
    distanceKm: 450,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 500, max: 1000 },
      budget: { min: 1000, max: 2000 },
      midrange: { min: 2000, max: 4500 },
    },
    food: { dailyBudget: 350, dailyMidrange: 700 },
    mustDo: [
      "Paranthe Wali Gali \u2014 200-year-old lane of stuffed paranthas (Chandni Chowk)",
      "Humayun\u2019s Tomb (\u20b935) and Lodhi Art District murals (free)",
      "Chandni Chowk food walk (10 AM\u20131 PM)",
      "Qutub Minar (\u20b940, 8 AM for empty foreground shots)",
      "Agrasen Ki Baoli stepwell (free, hidden in Connaught Place)",
    ],
    avgActivityCost: 500,
  },

  {
    name: "Mumbai",
    state: "Maharashtra",
    tagline: "Maximum city \u2014 Gateway, Bollywood, and the best street food",
    vibes: ["city", "beach", "relaxing"],
    primaryVibe: "city",
    vibeStrength: { city: 0.93, beach: 0.70, relaxing: 0.50 },
    discovery: "iconic",
    bestMonths: [10, 11, 12, 1, 2],
    distanceKm: 1300,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 600, max: 1200 },
      budget: { min: 1200, max: 2500 },
      midrange: { min: 2500, max: 5000 },
    },
    food: { dailyBudget: 400, dailyMidrange: 800 },
    mustDo: [
      "Gateway of India + Elephanta Caves ferry (\u20b9200 return)",
      "Marine Drive at sunset",
      "Vada pav at Ashok Vada Pav, Dadar (the original)",
      "Bandra-Worli Sea Link walk",
      "Dharavi walk tour (\u20b9700)",
    ],
    avgActivityCost: 1200,
  },

  {
    name: "Kolkata",
    state: "West Bengal",
    tagline: "City of Joy \u2014 colonial grandeur, art, and unmatched street food",
    vibes: ["city", "historical", "relaxing"],
    primaryVibe: "city",
    vibeStrength: { city: 0.90, historical: 0.80, relaxing: 0.60 },
    discovery: "popular",
    bestMonths: [10, 11, 12, 1, 2],
    distanceKm: 900,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 400, max: 800 },
      budget: { min: 800, max: 1600 },
      midrange: { min: 1600, max: 3200 },
    },
    food: { dailyBudget: 300, dailyMidrange: 600 },
    mustDo: [
      "Victoria Memorial (\u20b930)",
      "Howrah Bridge walk at sunset",
      "Kumartuli pottery studios (clay idol makers)",
      "Park Street food walk \u2014 kathi rolls, phuchka",
      "College Street book market",
    ],
    avgActivityCost: 500,
  },
];

// ── Route existence check ─────────────────────────────────────────────────────

function hasRoute(origin: string, destination: string): boolean {
  const key = `${origin.toUpperCase().replace(/\s+/g, "_")}_${destination
    .toUpperCase()
    .replace(/\s+/g, "_")}`;
  return key in TRAIN_ROUTES || key in BUS_ROUTES;
}

// ── Minimum trip cost estimate ────────────────────────────────────────────────

function estimateMinCost(
  origin: string,
  dest: Destination,
  nights: number
): number {
  const key = `${origin.toUpperCase().replace(/\s+/g, "_")}_${dest.name
    .toUpperCase()
    .replace(/\s+/g, "_")}`;

  const trains = TRAIN_ROUTES[key] ?? [];
  const cheapestTrain =
    trains.length > 0
      ? Math.min(...trains.map((t) => t.price.sleeper || t.price.ac3).filter((p) => p > 0))
      : 999999;
  const cheapestBus = BUS_ROUTES[key]?.price.min ?? 999999;
  const transportOneWay = Math.min(cheapestTrain, cheapestBus);

  if (transportOneWay === 999999) return 999999;

  const transport = transportOneWay * 2;
  const stay = dest.accommodation.hostel.min * nights;
  const food = dest.food.dailyBudget * (nights + 1);
  const activities = dest.avgActivityCost * 0.5;

  return transport + stay + food + activities;
}

// ── Main matcher ──────────────────────────────────────────────────────────────

export function matchDestinations(input: TripInput): Destination[] {
  const { origin, vibe, budget, startDate, endDate } = input;
  const recentlyShown = input.recentlyShown ?? [];

  const nights = Math.max(
    1,
    Math.round(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const currentMonth = new Date(startDate).getMonth() + 1; // 1-12

  // Step 1: Hard filter — vibe match, route exists, budget feasible
  const candidates = DESTINATIONS.filter((dest) => {
    if (!dest.vibes.includes(vibe)) return false;
    if (!hasRoute(origin, dest.name)) return false;
    const minCost = estimateMinCost(origin, dest, nights);
    if (minCost > budget * 0.90) return false;
    return true;
  });

  if (candidates.length === 0) return [];

  // Step 2: Score each candidate
  const scoredList: ScoredDestination[] = candidates.map((dest) => {
    const transportOptions = getTransportOptions(origin, dest.name);
    const bestTransport: TransportOption | null =
      transportOptions.length > 0 ? transportOptions[0] : null;

    return scoreDestination(dest, vibe, bestTransport, nights, recentlyShown, currentMonth);
  });

  // Step 3: Diversity-aware top-3 selection
  const top3 = selectDiverseTop3(scoredList);

  return top3.map((s: ScoredDestination) => s.destination);
}

// ── Destination lookup by name ────────────────────────────────────────────────

export function findDestinationByName(name: string): Destination | null {
  const normalized = name.toLowerCase().trim();
  return (
    DESTINATIONS.find(
      (d) =>
        d.name.toLowerCase() === normalized ||
        d.name.toLowerCase().includes(normalized) ||
        normalized.includes(d.name.toLowerCase())
    ) ?? null
  );
}

// ── Alternative finder (used when a destination is not in the curated catalog) ─
// Returns top N destinations reachable from origin, no vibe filter.
// Sorted by: discovery tag (hidden-gem > offbeat > popular > iconic), then seasonal fit.

export function findAlternativesForOrigin(
  origin: string,
  startDate: string,
  count = 3
): Destination[] {
  const currentMonth = new Date(startDate).getMonth() + 1;
  const discoveryScore: Record<string, number> = {
    "hidden-gem": 4,
    offbeat: 3,
    popular: 2,
    iconic: 1,
  };

  return DESTINATIONS
    .filter((d) => hasRoute(origin, d.name))
    .sort((a, b) => {
      const seasonal =
        (b.bestMonths.includes(currentMonth) ? 1 : 0) -
        (a.bestMonths.includes(currentMonth) ? 1 : 0);
      if (seasonal !== 0) return seasonal;
      return (discoveryScore[b.discovery] ?? 0) - (discoveryScore[a.discovery] ?? 0);
    })
    .slice(0, count);
}

export { DESTINATIONS };
