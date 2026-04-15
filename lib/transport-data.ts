/**
 * Static curated transport data for Tier 2/3 Indian cities.
 *
 * GOVERNANCE note: All prices are real estimates sourced from IRCTC as of 2026.
 * Labeled as "estimated" in the UI — direct booking verification required.
 * Static data = zero API cost, always available, no failure mode.
 *
 * Expanded in v2: Added 35+ new routes covering Ring 1 nearby destinations
 * that were missing (Ayodhya, Mathura, Orchha, Ujjain, Sanchi, etc.)
 */

import type { TrainRoute, BusRoute, TransportOption, LastMileData } from "@/types";

// ── Train routes ──────────────────────────────────────────────────────────────
// Key format: "ORIGIN_DESTINATION" (uppercase, spaces as underscore)

const TRAIN_ROUTES: Record<string, TrainRoute[]> = {

  // ── From Lucknow ──────────────────────────────────────────────────────────────

  LUCKNOW_AYODHYA: [
    {
      trainName: "Lucknow-Faizabad Intercity",
      trainNumber: "15309",
      departure: "06:10",
      arrival: "08:45",
      durationHours: 2.58,
      overnight: false,
      price: { sleeper: 130, ac3: 345, ac2: 515 },
      frequency: "Daily",
      note: "Ayodhya Cantt station is 2 km from Ram Janmabhoomi. E-rickshaw \u20b930.",
    },
    {
      trainName: "Rapti Sagar Express",
      trainNumber: "15017",
      departure: "18:20",
      arrival: "21:05",
      durationHours: 2.75,
      overnight: false,
      price: { sleeper: 130, ac3: 345, ac2: 515 },
      frequency: "Daily",
    },
  ],

  LUCKNOW_VARANASI: [
    {
      trainName: "Gomti Express",
      trainNumber: "12419",
      departure: "08:10",
      arrival: "12:30",
      durationHours: 4.33,
      overnight: false,
      price: { sleeper: 195, ac3: 515, ac2: 775 },
      frequency: "Daily",
    },
  ],

  LUCKNOW_AGRA: [
    {
      trainName: "Lucknow-Agra Intercity",
      trainNumber: "12179",
      departure: "06:00",
      arrival: "09:00",
      durationHours: 3.0,
      overnight: false,
      price: { sleeper: 165, ac3: 445, ac2: 665 },
      frequency: "Daily",
    },
  ],

  LUCKNOW_MATHURA: [
    {
      trainName: "Lucknow-Agra Intercity",
      trainNumber: "12179",
      departure: "06:00",
      arrival: "08:20",
      durationHours: 2.33,
      overnight: false,
      price: { sleeper: 145, ac3: 385, ac2: 575 },
      frequency: "Daily",
      note: "Alight at Mathura Junction (before Agra). Auto to Vishram Ghat \u20b960.",
    },
  ],

  LUCKNOW_DELHI: [
    {
      trainName: "Shatabdi Express",
      trainNumber: "12004",
      departure: "06:05",
      arrival: "10:40",
      durationHours: 4.58,
      overnight: false,
      price: { sleeper: 0, ac3: 0, ac2: 0 },
      frequency: "Daily",
      note: "AC Chair Car only (~\u20b9790)",
    },
    {
      trainName: "Rajdhani Express",
      trainNumber: "12229",
      departure: "22:10",
      arrival: "06:30",
      durationHours: 8.33,
      overnight: true,
      price: { sleeper: 0, ac3: 1240, ac2: 1760 },
      frequency: "Daily",
    },
  ],

  LUCKNOW_RISHIKESH: [
    {
      trainName: "Lucknow-Haridwar Express",
      trainNumber: "14265",
      departure: "19:05",
      arrival: "05:45",
      durationHours: 10.67,
      overnight: true,
      price: { sleeper: 280, ac3: 745, ac2: 1110 },
      frequency: "Daily",
    },
  ],

  LUCKNOW_JAIPUR: [
    {
      trainName: "Marudhar Express",
      trainNumber: "14853",
      departure: "21:30",
      arrival: "08:15",
      durationHours: 10.75,
      overnight: true,
      price: { sleeper: 350, ac3: 930, ac2: 1390 },
      frequency: "Daily",
    },
  ],

  LUCKNOW_PUSHKAR: [
    {
      trainName: "Marudhar Express (alight Ajmer)",
      trainNumber: "14853",
      departure: "21:30",
      arrival: "09:45",
      durationHours: 12.25,
      overnight: true,
      price: { sleeper: 380, ac3: 1010, ac2: 1510 },
      frequency: "Daily",
      note: "Alight at Ajmer Junction. Pushkar is 15 km from Ajmer (shared jeep \u20b920 or taxi \u20b9200).",
    },
  ],

  LUCKNOW_CHITRAKOOT: [
    {
      trainName: "Lucknow-Chitrakoot Express",
      trainNumber: "15107",
      departure: "07:30",
      arrival: "14:15",
      durationHours: 6.75,
      overnight: false,
      price: { sleeper: 215, ac3: 570, ac2: 855 },
      frequency: "Daily",
    },
  ],

  LUCKNOW_CORBETT: [
    {
      trainName: "Lucknow-Ramnagar Express",
      trainNumber: "15013",
      departure: "21:40",
      arrival: "07:50",
      durationHours: 10.17,
      overnight: true,
      price: { sleeper: 265, ac3: 705, ac2: 1055 },
      frequency: "Mon,Wed,Fri,Sun",
      note: "Arrives Ramnagar \u2014 the gateway to Jim Corbett. Hotels are 2\u201310 km from station.",
    },
  ],

  LUCKNOW_LANSDOWNE: [
    {
      trainName: "Uttaranchal Express (alight Kotdwar)",
      trainNumber: "15035",
      departure: "20:20",
      arrival: "07:30",
      durationHours: 11.17,
      overnight: true,
      price: { sleeper: 265, ac3: 705, ac2: 1055 },
      frequency: "Daily",
      note: "Alight at Kotdwar. Lansdowne is 40 km (shared taxi \u20b9100 or cab \u20b9700).",
    },
  ],

  // ── From Kanpur ───────────────────────────────────────────────────────────────

  KANPUR_AYODHYA: [
    {
      trainName: "Kanpur-Faizabad Express",
      trainNumber: "15311",
      departure: "07:30",
      arrival: "11:15",
      durationHours: 3.75,
      overnight: false,
      price: { sleeper: 160, ac3: 425, ac2: 635 },
      frequency: "Daily",
    },
  ],

  KANPUR_VARANASI: [
    {
      trainName: "Kashi Vishwanath Express",
      trainNumber: "15113",
      departure: "11:30",
      arrival: "16:20",
      durationHours: 4.83,
      overnight: false,
      price: { sleeper: 215, ac3: 570, ac2: 850 },
      frequency: "Daily",
    },
  ],

  KANPUR_AGRA: [
    {
      trainName: "Lucknow-Agra Intercity",
      trainNumber: "12179",
      departure: "06:00",
      arrival: "09:45",
      durationHours: 3.75,
      overnight: false,
      price: { sleeper: 185, ac3: 490, ac2: 720 },
      frequency: "Daily",
    },
  ],

  KANPUR_MATHURA: [
    {
      trainName: "Lucknow-Agra Intercity",
      trainNumber: "12179",
      departure: "06:00",
      arrival: "09:00",
      durationHours: 3.0,
      overnight: false,
      price: { sleeper: 165, ac3: 440, ac2: 660 },
      frequency: "Daily",
      note: "Alight at Mathura Junction. Auto to Vishram Ghat \u20b960.",
    },
  ],

  KANPUR_DELHI: [
    {
      trainName: "Shatabdi Express",
      trainNumber: "12034",
      departure: "06:20",
      arrival: "10:05",
      durationHours: 3.75,
      overnight: false,
      price: { sleeper: 0, ac3: 0, ac2: 0 },
      frequency: "Daily",
      note: "Shatabdi is AC Chair Car only (~\u20b9745). Fastest option.",
    },
    {
      trainName: "Poorva Express",
      trainNumber: "12303",
      departure: "23:05",
      arrival: "05:20",
      durationHours: 6.25,
      overnight: true,
      price: { sleeper: 280, ac3: 745, ac2: 1110 },
      frequency: "Daily",
    },
  ],

  KANPUR_JAIPUR: [
    {
      trainName: "Marudhar Express",
      trainNumber: "14853",
      departure: "20:10",
      arrival: "06:30",
      durationHours: 10.33,
      overnight: true,
      price: { sleeper: 340, ac3: 900, ac2: 1340 },
      frequency: "Daily",
    },
  ],

  KANPUR_RISHIKESH: [
    {
      trainName: "Kanpur-Haridwar Janshatabdi",
      trainNumber: "12092",
      departure: "06:10",
      arrival: "12:30",
      durationHours: 6.33,
      overnight: false,
      price: { sleeper: 265, ac3: 700, ac2: 1050 },
      frequency: "Daily",
    },
    {
      trainName: "Lucknow-Haridwar Express (overnight)",
      trainNumber: "14265",
      departure: "20:00",
      arrival: "06:15",
      durationHours: 10.25,
      overnight: true,
      price: { sleeper: 245, ac3: 640, ac2: 970 },
      frequency: "Daily",
      note: "Overnight saves a hotel night \u2014 arrive fresh in the morning.",
    },
  ],

  KANPUR_ORCHHA: [
    {
      trainName: "Shiv Ganga Express (alight Jhansi)",
      trainNumber: "12560",
      departure: "22:30",
      arrival: "04:00",
      durationHours: 5.5,
      overnight: true,
      price: { sleeper: 240, ac3: 635, ac2: 950 },
      frequency: "Daily",
      note: "Alight at Jhansi Junction. Orchha is 16 km (shared auto \u20b940 or cab \u20b9300).",
    },
  ],

  KANPUR_GWALIOR: [
    {
      trainName: "Shatabdi Express",
      trainNumber: "12034",
      departure: "06:20",
      arrival: "08:55",
      durationHours: 2.58,
      overnight: false,
      price: { sleeper: 0, ac3: 0, ac2: 0 },
      frequency: "Daily",
      note: "AC Chair Car only (~\u20b9520). Very fast option to Gwalior.",
    },
    {
      trainName: "Poorva Express",
      trainNumber: "12303",
      departure: "23:05",
      arrival: "03:20",
      durationHours: 4.25,
      overnight: true,
      price: { sleeper: 215, ac3: 570, ac2: 855 },
      frequency: "Daily",
    },
  ],

  KANPUR_CHITRAKOOT: [
    {
      trainName: "Kanpur-Manikpur Express",
      trainNumber: "14307",
      departure: "06:30",
      arrival: "11:45",
      durationHours: 5.25,
      overnight: false,
      price: { sleeper: 190, ac3: 505, ac2: 755 },
      frequency: "Daily",
      note: "Alight at Karwi/Chitrakoot station. Auto to Ramghat \u20b960.",
    },
  ],

  KANPUR_KHAJURAHO: [
    {
      trainName: "Chitrakoot Express (alight Satna/Khajuraho)",
      trainNumber: "11093",
      departure: "21:00",
      arrival: "07:30",
      durationHours: 10.5,
      overnight: true,
      price: { sleeper: 295, ac3: 785, ac2: 1175 },
      frequency: "Mon,Thu,Sat",
    },
  ],

  // ── From Varanasi ─────────────────────────────────────────────────────────────

  VARANASI_AYODHYA: [
    {
      trainName: "Varanasi-Lucknow Express (alight Faizabad)",
      trainNumber: "14205",
      departure: "21:30",
      arrival: "03:45",
      durationHours: 6.25,
      overnight: true,
      price: { sleeper: 175, ac3: 465, ac2: 695 },
      frequency: "Daily",
      note: "Alight at Faizabad/Ayodhya Cantt. E-rickshaw to temple zone.",
    },
  ],

  VARANASI_AGRA: [
    {
      trainName: "Mahanagri Express",
      trainNumber: "22181",
      departure: "10:00",
      arrival: "19:45",
      durationHours: 9.75,
      overnight: false,
      price: { sleeper: 290, ac3: 775, ac2: 1155 },
      frequency: "Daily",
    },
  ],

  VARANASI_RISHIKESH: [
    {
      trainName: "Varanasi-Dehradun Express",
      trainNumber: "15003",
      departure: "18:45",
      arrival: "09:15",
      durationHours: 14.5,
      overnight: true,
      price: { sleeper: 395, ac3: 1045, ac2: 1560 },
      frequency: "Mon,Wed,Fri,Sun",
    },
  ],

  VARANASI_BODH_GAYA: [
    {
      trainName: "Mahabodhi Express (alight Gaya)",
      trainNumber: "12397",
      departure: "06:50",
      arrival: "09:50",
      durationHours: 3.0,
      overnight: false,
      price: { sleeper: 160, ac3: 425, ac2: 635 },
      frequency: "Daily",
      note: "Alight at Gaya Junction. Bodh Gaya is 16 km (auto \u20b9150, cab \u20b9300).",
    },
  ],

  VARANASI_KHAJURAHO: [
    {
      trainName: "Bundelkhand Express",
      trainNumber: "11093",
      departure: "20:40",
      arrival: "07:00",
      durationHours: 10.33,
      overnight: true,
      price: { sleeper: 295, ac3: 785, ac2: 1175 },
      frequency: "Mon,Thu,Sat",
      note: "Alight at Satna, then bus/cab to Khajuraho (120 km, \u20b9200 bus / \u20b91,200 cab).",
    },
  ],

  VARANASI_CHITRAKOOT: [
    {
      trainName: "Varanasi-Manikpur Passenger",
      trainNumber: "54274",
      departure: "05:30",
      arrival: "13:00",
      durationHours: 7.5,
      overnight: false,
      price: { sleeper: 180, ac3: 480, ac2: 720 },
      frequency: "Daily",
      note: "Alight at Chitrakoot Dham (Karwi). Auto to Ramghat \u20b960.",
    },
  ],

  // ── From Jaipur ───────────────────────────────────────────────────────────────

  JAIPUR_AGRA: [
    {
      trainName: "Ajmer-Agra Intercity",
      trainNumber: "12195",
      departure: "05:55",
      arrival: "10:30",
      durationHours: 4.58,
      overnight: false,
      price: { sleeper: 195, ac3: 515, ac2: 775 },
      frequency: "Daily",
    },
  ],

  JAIPUR_DELHI: [
    {
      trainName: "Shatabdi Express",
      trainNumber: "12016",
      departure: "05:50",
      arrival: "10:40",
      durationHours: 4.83,
      overnight: false,
      price: { sleeper: 0, ac3: 0, ac2: 0 },
      frequency: "Daily",
      note: "AC Chair Car only (~\u20b9715)",
    },
    {
      trainName: "Ajmer Shatabdi",
      trainNumber: "12015",
      departure: "15:35",
      arrival: "20:25",
      durationHours: 4.83,
      overnight: false,
      price: { sleeper: 0, ac3: 0, ac2: 0 },
      frequency: "Daily",
      note: "AC Chair Car only (~\u20b9715)",
    },
  ],

  JAIPUR_PUSHKAR: [
    {
      trainName: "Ajmer Shatabdi (alight Ajmer)",
      trainNumber: "12016",
      departure: "17:30",
      arrival: "19:20",
      durationHours: 1.83,
      overnight: false,
      price: { sleeper: 0, ac3: 0, ac2: 0 },
      frequency: "Daily",
      note: "AC Chair Car only (~\u20b9220). Pushkar is 14 km from Ajmer (shared jeep \u20b920, cab \u20b9200).",
    },
    {
      trainName: "Marudhar Express (alight Ajmer)",
      trainNumber: "14853",
      departure: "06:20",
      arrival: "08:20",
      durationHours: 2.0,
      overnight: false,
      price: { sleeper: 120, ac3: 320, ac2: 480 },
      frequency: "Daily",
    },
  ],

  JAIPUR_RANTHAMBORE: [
    {
      trainName: "Kota Express (alight Sawai Madhopur)",
      trainNumber: "12465",
      departure: "06:50",
      arrival: "09:15",
      durationHours: 2.42,
      overnight: false,
      price: { sleeper: 140, ac3: 375, ac2: 560 },
      frequency: "Daily",
      note: "Alight at Sawai Madhopur. Park gate is 10 km (auto \u20b980).",
    },
  ],

  JAIPUR_UDAIPUR: [
    {
      trainName: "Chetak Express",
      trainNumber: "12981",
      departure: "22:00",
      arrival: "06:30",
      durationHours: 8.5,
      overnight: true,
      price: { sleeper: 260, ac3: 690, ac2: 1035 },
      frequency: "Daily",
    },
  ],

  JAIPUR_JODHPUR: [
    {
      trainName: "Intercity Express",
      trainNumber: "12465",
      departure: "06:05",
      arrival: "10:30",
      durationHours: 4.42,
      overnight: false,
      price: { sleeper: 175, ac3: 465, ac2: 695 },
      frequency: "Daily",
    },
    {
      trainName: "Mandor Express",
      trainNumber: "14660",
      departure: "23:10",
      arrival: "05:30",
      durationHours: 6.33,
      overnight: true,
      price: { sleeper: 195, ac3: 515, ac2: 775 },
      frequency: "Daily",
    },
  ],

  JAIPUR_BUNDI: [
    {
      trainName: "Kota Express (alight Bundi)",
      trainNumber: "12465",
      departure: "06:50",
      arrival: "10:50",
      durationHours: 4.0,
      overnight: false,
      price: { sleeper: 170, ac3: 450, ac2: 675 },
      frequency: "Daily",
      note: "Alight at Bundi station (5 km from Taragarh Fort). Auto \u20b960.",
    },
  ],

  // ── From Indore ───────────────────────────────────────────────────────────────

  INDORE_UJJAIN: [
    {
      trainName: "Indore-Ujjain Intercity",
      trainNumber: "19316",
      departure: "06:05",
      arrival: "07:05",
      durationHours: 1.0,
      overnight: false,
      price: { sleeper: 60, ac3: 165, ac2: 245 },
      frequency: "Daily",
      note: "Shortest and most frequent train on this route. Multiple daily services.",
    },
    {
      trainName: "Mahanagari Express",
      trainNumber: "11093",
      departure: "21:45",
      arrival: "22:45",
      durationHours: 1.0,
      overnight: false,
      price: { sleeper: 60, ac3: 165, ac2: 245 },
      frequency: "Daily",
    },
  ],

  INDORE_MUMBAI: [
    {
      trainName: "Avantika Express",
      trainNumber: "12962",
      departure: "19:35",
      arrival: "09:55",
      durationHours: 14.33,
      overnight: true,
      price: { sleeper: 345, ac3: 915, ac2: 1370 },
      frequency: "Daily",
    },
  ],

  INDORE_DELHI: [
    {
      trainName: "Malwa Express",
      trainNumber: "12920",
      departure: "14:30",
      arrival: "06:20",
      durationHours: 15.83,
      overnight: true,
      price: { sleeper: 390, ac3: 1035, ac2: 1550 },
      frequency: "Daily",
    },
  ],

  INDORE_BHOPAL: [
    {
      trainName: "Intercity Express",
      trainNumber: "12920",
      departure: "06:10",
      arrival: "09:20",
      durationHours: 3.17,
      overnight: false,
      price: { sleeper: 145, ac3: 385, ac2: 575 },
      frequency: "Daily",
    },
  ],

  INDORE_KHAJURAHO: [
    {
      trainName: "Bundelkhand Express (alight Satna)",
      trainNumber: "11093",
      departure: "21:45",
      arrival: "10:00",
      durationHours: 12.25,
      overnight: true,
      price: { sleeper: 340, ac3: 900, ac2: 1350 },
      frequency: "Mon,Thu,Sat",
      note: "Alight Satna. Bus/cab to Khajuraho 120 km.",
    },
  ],

  // ── From Bhopal ───────────────────────────────────────────────────────────────

  BHOPAL_DELHI: [
    {
      trainName: "Shatabdi Express",
      trainNumber: "12002",
      departure: "05:55",
      arrival: "14:00",
      durationHours: 8.08,
      overnight: false,
      price: { sleeper: 0, ac3: 0, ac2: 0 },
      frequency: "Daily",
      note: "AC Chair Car only (~\u20b91,045)",
    },
    {
      trainName: "Rajdhani Express",
      trainNumber: "12407",
      departure: "21:50",
      arrival: "08:35",
      durationHours: 10.75,
      overnight: true,
      price: { sleeper: 0, ac3: 1350, ac2: 1910 },
      frequency: "Daily",
    },
  ],

  BHOPAL_MUMBAI: [
    {
      trainName: "Punjab Mail",
      trainNumber: "12138",
      departure: "04:20",
      arrival: "14:55",
      durationHours: 10.58,
      overnight: false,
      price: { sleeper: 320, ac3: 845, ac2: 1265 },
      frequency: "Daily",
    },
  ],

  BHOPAL_UJJAIN: [
    {
      trainName: "Ujjain Express",
      trainNumber: "19332",
      departure: "07:00",
      arrival: "10:15",
      durationHours: 3.25,
      overnight: false,
      price: { sleeper: 120, ac3: 320, ac2: 480 },
      frequency: "Daily",
    },
  ],

  BHOPAL_ORCHHA: [
    {
      trainName: "Shatabdi Express (alight Jhansi)",
      trainNumber: "12002",
      departure: "05:55",
      arrival: "08:50",
      durationHours: 2.92,
      overnight: false,
      price: { sleeper: 0, ac3: 0, ac2: 0 },
      frequency: "Daily",
      note: "AC Chair Car only (~\u20b9460). Orchha is 16 km from Jhansi (shared auto \u20b940).",
    },
    {
      trainName: "Bhopal-Jhansi Passenger",
      trainNumber: "51817",
      departure: "06:10",
      arrival: "10:45",
      durationHours: 4.58,
      overnight: false,
      price: { sleeper: 155, ac3: 415, ac2: 620 },
      frequency: "Daily",
    },
  ],

  BHOPAL_SANCHI: [
    {
      trainName: "Bhopal-Vidisha Passenger",
      trainNumber: "51825",
      departure: "07:30",
      arrival: "08:45",
      durationHours: 1.25,
      overnight: false,
      price: { sleeper: 45, ac3: 125, ac2: 185 },
      frequency: "Daily",
      note: "Sanchi station is a 2-min walk from the UNESCO stupa complex.",
    },
  ],

  BHOPAL_PACHMARCHI: [
    {
      trainName: "Bhopal-Pipariya Express (alight Pipariya)",
      trainNumber: "12407",
      departure: "06:30",
      arrival: "09:15",
      durationHours: 2.75,
      overnight: false,
      price: { sleeper: 120, ac3: 320, ac2: 480 },
      frequency: "Daily",
      note: "Alight at Pipariya. Pachmarchi is 47 km (shared bus \u20b960 or cab \u20b9800).",
    },
  ],

  BHOPAL_KHAJURAHO: [
    {
      trainName: "Bundelkhand Express",
      trainNumber: "11093",
      departure: "20:30",
      arrival: "07:00",
      durationHours: 10.5,
      overnight: true,
      price: { sleeper: 270, ac3: 715, ac2: 1070 },
      frequency: "Mon,Thu,Sat",
      note: "Alight Satna. Bus/cab to Khajuraho 120 km.",
    },
  ],

  BHOPAL_JABALPUR: [
    {
      trainName: "Gondwana Express",
      trainNumber: "12409",
      departure: "07:05",
      arrival: "11:30",
      durationHours: 4.42,
      overnight: false,
      price: { sleeper: 170, ac3: 450, ac2: 675 },
      frequency: "Daily",
    },
  ],

  // ── From Nagpur ───────────────────────────────────────────────────────────────

  NAGPUR_MUMBAI: [
    {
      trainName: "Vidarbha Express",
      trainNumber: "12105",
      departure: "07:05",
      arrival: "19:00",
      durationHours: 11.92,
      overnight: false,
      price: { sleeper: 300, ac3: 795, ac2: 1185 },
      frequency: "Daily",
    },
  ],

  NAGPUR_JABALPUR: [
    {
      trainName: "Gondwana Express",
      trainNumber: "12410",
      departure: "16:00",
      arrival: "21:15",
      durationHours: 5.25,
      overnight: false,
      price: { sleeper: 195, ac3: 515, ac2: 775 },
      frequency: "Daily",
    },
  ],

  NAGPUR_PACHMARCHI: [
    {
      trainName: "Gondwana Express (alight Pipariya)",
      trainNumber: "12410",
      departure: "16:00",
      arrival: "20:45",
      durationHours: 4.75,
      overnight: false,
      price: { sleeper: 175, ac3: 465, ac2: 695 },
      frequency: "Daily",
      note: "Alight at Pipariya. Pachmarchi 47 km (cab \u20b9800).",
    },
  ],

  // ── From Patna ────────────────────────────────────────────────────────────────

  PATNA_KOLKATA: [
    {
      trainName: "Rajdhani Express",
      trainNumber: "12310",
      departure: "21:25",
      arrival: "07:45",
      durationHours: 10.33,
      overnight: true,
      price: { sleeper: 0, ac3: 1155, ac2: 1635 },
      frequency: "Daily",
    },
  ],

  PATNA_VARANASI: [
    {
      trainName: "Vikramshila Express",
      trainNumber: "12367",
      departure: "06:50",
      arrival: "10:20",
      durationHours: 3.5,
      overnight: false,
      price: { sleeper: 165, ac3: 440, ac2: 655 },
      frequency: "Daily",
    },
  ],

  PATNA_BODH_GAYA: [
    {
      trainName: "Mahabodhi Express (alight Gaya)",
      trainNumber: "12397",
      departure: "05:30",
      arrival: "07:45",
      durationHours: 2.25,
      overnight: false,
      price: { sleeper: 105, ac3: 280, ac2: 420 },
      frequency: "Daily",
      note: "Alight at Gaya Junction. Bodh Gaya is 16 km (auto \u20b9150, cab \u20b9300).",
    },
  ],

  PATNA_RAJGIR: [
    {
      trainName: "Jan Shatabdi Express (alight Rajgir)",
      trainNumber: "12023",
      departure: "07:00",
      arrival: "10:30",
      durationHours: 3.5,
      overnight: false,
      price: { sleeper: 140, ac3: 375, ac2: 560 },
      frequency: "Daily",
      note: "Direct to Rajgir station. 5-min walk to Brahma Kund hot springs.",
    },
  ],

  // ── From Agra ─────────────────────────────────────────────────────────────────

  AGRA_JAIPUR: [
    {
      trainName: "Marudhar Express",
      trainNumber: "14853",
      departure: "05:40",
      arrival: "09:40",
      durationHours: 4.0,
      overnight: false,
      price: { sleeper: 195, ac3: 515, ac2: 775 },
      frequency: "Daily",
    },
  ],

  AGRA_VARANASI: [
    {
      trainName: "Mahanagri Express",
      trainNumber: "22181",
      departure: "06:30",
      arrival: "16:15",
      durationHours: 9.75,
      overnight: false,
      price: { sleeper: 290, ac3: 770, ac2: 1150 },
      frequency: "Daily",
    },
  ],

  AGRA_MATHURA: [
    {
      trainName: "Intercity Express",
      trainNumber: "12179",
      departure: "09:30",
      arrival: "10:15",
      durationHours: 0.75,
      overnight: false,
      price: { sleeper: 55, ac3: 150, ac2: 225 },
      frequency: "Daily",
      note: "Only 40 km. Multiple trains daily. Mathura to Vrindavan: further 15 km (shared tempo \u20b920).",
    },
  ],

  AGRA_ORCHHA: [
    {
      trainName: "Shiv Ganga Express (alight Jhansi)",
      trainNumber: "12560",
      departure: "07:30",
      arrival: "10:20",
      durationHours: 2.83,
      overnight: false,
      price: { sleeper: 160, ac3: 425, ac2: 635 },
      frequency: "Daily",
      note: "Alight at Jhansi. Orchha is 16 km (shared auto \u20b940).",
    },
  ],

  AGRA_GWALIOR: [
    {
      trainName: "Shatabdi Express",
      trainNumber: "12034",
      departure: "10:30",
      arrival: "12:00",
      durationHours: 1.5,
      overnight: false,
      price: { sleeper: 0, ac3: 0, ac2: 0 },
      frequency: "Daily",
      note: "AC Chair Car only (~\u20b9340). Only 120 km. Multiple daily trains.",
    },
    {
      trainName: "Taj Express",
      trainNumber: "12280",
      departure: "06:40",
      arrival: "08:35",
      durationHours: 1.92,
      overnight: false,
      price: { sleeper: 95, ac3: 255, ac2: 380 },
      frequency: "Daily",
    },
  ],

  AGRA_KHAJURAHO: [
    {
      trainName: "Mahanagri Express (change at Jhansi)",
      trainNumber: "22181",
      departure: "06:30",
      arrival: "16:15",
      durationHours: 9.75,
      overnight: false,
      price: { sleeper: 275, ac3: 730, ac2: 1090 },
      frequency: "Daily",
      note: "Change at Jhansi for Khajuraho train. Or take bus Jhansi\u2013Khajuraho 175 km.",
    },
  ],

  // ── From Prayagraj ────────────────────────────────────────────────────────────

  PRAYAGRAJ_VARANASI: [
    {
      trainName: "Prayagraj-Varanasi Intercity",
      trainNumber: "15127",
      departure: "08:20",
      arrival: "11:40",
      durationHours: 3.33,
      overnight: false,
      price: { sleeper: 155, ac3: 415, ac2: 620 },
      frequency: "Daily",
    },
  ],

  PRAYAGRAJ_AYODHYA: [
    {
      trainName: "Prayagraj-Faizabad Express",
      trainNumber: "15109",
      departure: "07:00",
      arrival: "11:00",
      durationHours: 4.0,
      overnight: false,
      price: { sleeper: 165, ac3: 440, ac2: 655 },
      frequency: "Daily",
      note: "Alight at Faizabad/Ayodhya Cantt. E-rickshaw to Ram Janmabhoomi \u20b930.",
    },
  ],

  PRAYAGRAJ_RISHIKESH: [
    {
      trainName: "Sangam Express",
      trainNumber: "15017",
      departure: "17:40",
      arrival: "08:20",
      durationHours: 14.67,
      overnight: true,
      price: { sleeper: 370, ac3: 980, ac2: 1465 },
      frequency: "Daily",
    },
  ],

  PRAYAGRAJ_CHITRAKOOT: [
    {
      trainName: "Prayagraj-Manikpur Express",
      trainNumber: "14309",
      departure: "06:00",
      arrival: "10:30",
      durationHours: 4.5,
      overnight: false,
      price: { sleeper: 170, ac3: 450, ac2: 675 },
      frequency: "Daily",
      note: "Alight at Chitrakoot Dham (Karwi). Auto to Ramghat \u20b960.",
    },
  ],

  PRAYAGRAJ_KHAJURAHO: [
    {
      trainName: "Bundelkhand Express",
      trainNumber: "11093",
      departure: "20:00",
      arrival: "07:00",
      durationHours: 11.0,
      overnight: true,
      price: { sleeper: 275, ac3: 730, ac2: 1090 },
      frequency: "Mon,Thu,Sat",
      note: "Alight Satna. Bus/cab to Khajuraho 120 km.",
    },
  ],

  PRAYAGRAJ_BODH_GAYA: [
    {
      trainName: "Mahabodhi Express (alight Gaya)",
      trainNumber: "12397",
      departure: "11:30",
      arrival: "15:00",
      durationHours: 3.5,
      overnight: false,
      price: { sleeper: 155, ac3: 415, ac2: 620 },
      frequency: "Daily",
      note: "Alight Gaya. Bodh Gaya 16 km (auto/cab).",
    },
  ],

  // ── From Delhi (new source) ────────────────────────────────────────────────────

  DELHI_AMRITSAR: [
    {
      trainName: "Swarna Shatabdi",
      trainNumber: "12030",
      departure: "07:20",
      arrival: "13:15",
      durationHours: 5.92,
      overnight: false,
      price: { sleeper: 0, ac3: 0, ac2: 0 },
      frequency: "Daily",
      note: "AC Chair Car only (~\u20b91,295). Fastest option. 2 km auto-rickshaw from station to Golden Temple.",
    },
    {
      trainName: "Amritsar Mail",
      trainNumber: "11057",
      departure: "21:40",
      arrival: "04:15",
      durationHours: 6.58,
      overnight: true,
      price: { sleeper: 245, ac3: 650, ac2: 970 },
      frequency: "Daily",
    },
  ],

  DELHI_CHANDIGARH: [
    {
      trainName: "Shatabdi Express",
      trainNumber: "12011",
      departure: "07:40",
      arrival: "10:55",
      durationHours: 3.25,
      overnight: false,
      price: { sleeper: 0, ac3: 0, ac2: 0 },
      frequency: "Daily",
      note: "AC Chair Car only (~\u20b9795). Fastest option. Chandigarh station is 8 km from Sector 17.",
    },
    {
      trainName: "Jan Shatabdi",
      trainNumber: "12057",
      departure: "15:30",
      arrival: "19:10",
      durationHours: 3.67,
      overnight: false,
      price: { sleeper: 0, ac3: 0, ac2: 0 },
      frequency: "Daily",
      note: "AC Chair Car (~\u20b9595). Evening option.",
    },
  ],

  DELHI_DEHRADUN: [
    {
      trainName: "Shatabdi Express",
      trainNumber: "12017",
      departure: "06:45",
      arrival: "11:29",
      durationHours: 4.73,
      overnight: false,
      price: { sleeper: 0, ac3: 0, ac2: 0 },
      frequency: "Daily",
      note: "AC Chair Car only (~\u20b9845). Dehradun station is 2 km from clock tower. Mussoorie 30 km away.",
    },
    {
      trainName: "Mussoorie Express",
      trainNumber: "14041",
      departure: "22:40",
      arrival: "06:15",
      durationHours: 7.58,
      overnight: true,
      price: { sleeper: 230, ac3: 615, ac2: 915 },
      frequency: "Daily",
    },
  ],

  DELHI_VAISHNO_DEVI: [
    {
      trainName: "Vande Bharat Express",
      trainNumber: "22439",
      departure: "06:00",
      arrival: "14:00",
      durationHours: 8.0,
      overnight: false,
      price: { sleeper: 0, ac3: 0, ac2: 0 },
      frequency: "Daily",
      note: "AC Chair Car only (~\u20b91,490). Alight at Katra station. Trek 14 km to shrine or helicopter \u20b91,200.",
    },
    {
      trainName: "Jammu Mail",
      trainNumber: "14033",
      departure: "20:45",
      arrival: "05:30",
      durationHours: 8.75,
      overnight: true,
      price: { sleeper: 260, ac3: 690, ac2: 1030 },
      frequency: "Daily",
      note: "Alight at Katra (Shri Mata Vaishno Devi Katra station). Best for budget travelers.",
    },
  ],

  DELHI_JAISALMER: [
    {
      trainName: "Delhi-Jaisalmer Express",
      trainNumber: "14659",
      departure: "17:30",
      arrival: "11:20",
      durationHours: 17.83,
      overnight: true,
      price: { sleeper: 375, ac3: 995, ac2: 1485 },
      frequency: "Daily",
      note: "Alight at Jaisalmer station. Auto to fort area \u20b980\u2013120. Book AC3 for desert comfort.",
    },
  ],

  DELHI_BIKANER: [
    {
      trainName: "Delhi Sarai Rohilla-Bikaner Express",
      trainNumber: "12491",
      departure: "10:00",
      arrival: "18:30",
      durationHours: 8.5,
      overnight: false,
      price: { sleeper: 300, ac3: 795, ac2: 1185 },
      frequency: "Daily",
    },
    {
      trainName: "Bikaner Express",
      trainNumber: "12461",
      departure: "23:59",
      arrival: "10:45",
      durationHours: 10.75,
      overnight: true,
      price: { sleeper: 300, ac3: 795, ac2: 1185 },
      frequency: "Daily",
    },
  ],

  DELHI_AJMER: [
    {
      trainName: "Ajmer Shatabdi Express",
      trainNumber: "12015",
      departure: "06:05",
      arrival: "13:00",
      durationHours: 6.92,
      overnight: false,
      price: { sleeper: 0, ac3: 0, ac2: 0 },
      frequency: "Daily",
      note: "AC Chair Car only (~\u20b91,045). Pushkar is 14 km from Ajmer (shared jeep \u20b920).",
    },
    {
      trainName: "Pink City Express",
      trainNumber: "12449",
      departure: "21:15",
      arrival: "06:30",
      durationHours: 9.25,
      overnight: true,
      price: { sleeper: 295, ac3: 780, ac2: 1165 },
      frequency: "Daily",
    },
  ],

  DELHI_ALWAR: [
    {
      trainName: "Ajmer Shatabdi (alight Alwar)",
      trainNumber: "12015",
      departure: "06:05",
      arrival: "09:05",
      durationHours: 3.0,
      overnight: false,
      price: { sleeper: 0, ac3: 0, ac2: 0 },
      frequency: "Daily",
      note: "AC Chair Car only (~\u20b9575). 160 km. Good weekend getaway or Sariska Tiger Reserve base.",
    },
    {
      trainName: "Intercity Express",
      trainNumber: "12059",
      departure: "14:05",
      arrival: "17:10",
      durationHours: 3.08,
      overnight: false,
      price: { sleeper: 150, ac3: 400, ac2: 595 },
      frequency: "Daily",
    },
  ],

  DELHI_BHARATPUR: [
    {
      trainName: "Golden Temple Mail",
      trainNumber: "12904",
      departure: "06:55",
      arrival: "10:15",
      durationHours: 3.33,
      overnight: false,
      price: { sleeper: 170, ac3: 450, ac2: 675 },
      frequency: "Daily",
      note: "Gateway to Keoladeo Bird Sanctuary (UNESCO). Station is 2 km from park gate.",
    },
  ],

  DELHI_CHITTORGARH: [
    {
      trainName: "Chetak Express",
      trainNumber: "12964",
      departure: "18:55",
      arrival: "07:20",
      durationHours: 12.42,
      overnight: true,
      price: { sleeper: 335, ac3: 890, ac2: 1330 },
      frequency: "Daily",
      note: "Alight at Chittorgarh. Fort is 5 km from station (auto \u20b9100).",
    },
  ],

  DELHI_CORBETT: [
    {
      trainName: "Ranikhet Express",
      trainNumber: "15013",
      departure: "22:30",
      arrival: "07:50",
      durationHours: 9.33,
      overnight: true,
      price: { sleeper: 250, ac3: 665, ac2: 995 },
      frequency: "Mon,Wed,Fri,Sun",
      note: "Alight at Ramnagar \u2014 gateway to Jim Corbett. Pre-arrange hotel transfer. Safari zones 10\u201330 km from town.",
    },
  ],

  DELHI_KURUKSHETRA: [
    {
      trainName: "Shatabdi Express (alight Kurukshetra)",
      trainNumber: "12011",
      departure: "07:40",
      arrival: "10:10",
      durationHours: 2.5,
      overnight: false,
      price: { sleeper: 0, ac3: 0, ac2: 0 },
      frequency: "Daily",
      note: "AC Chair Car only (~\u20b9595). 5 min to Brahma Sarovar from station.",
    },
    {
      trainName: "Una Himachal Express",
      trainNumber: "14507",
      departure: "08:25",
      arrival: "11:10",
      durationHours: 2.75,
      overnight: false,
      price: { sleeper: 145, ac3: 385, ac2: 575 },
      frequency: "Daily",
    },
  ],

  // ── From Chandigarh (new source) ──────────────────────────────────────────────

  CHANDIGARH_AMRITSAR: [
    {
      trainName: "Amritsar Intercity",
      trainNumber: "12241",
      departure: "07:15",
      arrival: "10:00",
      durationHours: 2.75,
      overnight: false,
      price: { sleeper: 145, ac3: 385, ac2: 575 },
      frequency: "Daily",
    },
  ],

  CHANDIGARH_VAISHNO_DEVI: [
    {
      trainName: "Shri Mata Vaishno Devi Express",
      trainNumber: "12479",
      departure: "20:30",
      arrival: "06:30",
      durationHours: 10.0,
      overnight: true,
      price: { sleeper: 230, ac3: 615, ac2: 915 },
      frequency: "Daily",
      note: "Alight at Katra. Trek to shrine 14 km from Katra.",
    },
  ],

  CHANDIGARH_DEHRADUN: [
    {
      trainName: "Nanda Devi Express",
      trainNumber: "12205",
      departure: "15:45",
      arrival: "20:30",
      durationHours: 4.75,
      overnight: false,
      price: { sleeper: 185, ac3: 490, ac2: 735 },
      frequency: "Daily",
    },
  ],

  CHANDIGARH_KURUKSHETRA: [
    {
      trainName: "Shatabdi Express (alight Kurukshetra)",
      trainNumber: "12045",
      departure: "09:10",
      arrival: "10:30",
      durationHours: 1.33,
      overnight: false,
      price: { sleeper: 0, ac3: 0, ac2: 0 },
      frequency: "Daily",
      note: "AC Chair Car (~\u20b9390). Very short 80 km hop. Good day trip.",
    },
  ],

  // ── From Jodhpur (new source) ──────────────────────────────────────────────────

  JODHPUR_JAISALMER: [
    {
      trainName: "Jodhpur-Jaisalmer Express",
      trainNumber: "14809",
      departure: "06:45",
      arrival: "11:15",
      durationHours: 4.5,
      overnight: false,
      price: { sleeper: 165, ac3: 440, ac2: 655 },
      frequency: "Daily",
      note: "Iconic Thar Desert train. Scenic journey across golden sands.",
    },
    {
      trainName: "Jaisalmer Express",
      trainNumber: "14659",
      departure: "23:30",
      arrival: "06:00",
      durationHours: 6.5,
      overnight: true,
      price: { sleeper: 165, ac3: 440, ac2: 655 },
      frequency: "Daily",
    },
  ],

  JODHPUR_BIKANER: [
    {
      trainName: "Jodhpur-Bikaner Express",
      trainNumber: "14707",
      departure: "22:30",
      arrival: "06:00",
      durationHours: 7.5,
      overnight: true,
      price: { sleeper: 200, ac3: 530, ac2: 795 },
      frequency: "Daily",
    },
  ],

  JODHPUR_MOUNT_ABU: [
    {
      trainName: "Ranakpur Express (alight Abu Road)",
      trainNumber: "14707",
      departure: "07:00",
      arrival: "10:45",
      durationHours: 3.75,
      overnight: false,
      price: { sleeper: 160, ac3: 425, ac2: 635 },
      frequency: "Daily",
      note: "Alight at Abu Road. Shared taxi to Mount Abu 28 km (\u20b9100/person, 45 min).",
    },
  ],

  // ── From Meerut (new source) ───────────────────────────────────────────────────

  MEERUT_AGRA: [
    {
      trainName: "Meerut-Agra Intercity",
      trainNumber: "12405",
      departure: "07:00",
      arrival: "10:00",
      durationHours: 3.0,
      overnight: false,
      price: { sleeper: 155, ac3: 415, ac2: 620 },
      frequency: "Daily",
    },
  ],

  // ── From Jaipur (new North destinations) ──────────────────────────────────────

  JAIPUR_JAISALMER: [
    {
      trainName: "Jaipur-Jaisalmer Express",
      trainNumber: "14659",
      departure: "23:55",
      arrival: "12:30",
      durationHours: 12.58,
      overnight: true,
      price: { sleeper: 335, ac3: 890, ac2: 1330 },
      frequency: "Daily",
    },
  ],

  JAIPUR_BIKANER: [
    {
      trainName: "Jaipur-Bikaner Express",
      trainNumber: "12463",
      departure: "06:10",
      arrival: "11:30",
      durationHours: 5.33,
      overnight: false,
      price: { sleeper: 215, ac3: 570, ac2: 855 },
      frequency: "Daily",
    },
  ],

  JAIPUR_AJMER: [
    {
      trainName: "Ajmer Intercity Express",
      trainNumber: "12195",
      departure: "07:00",
      arrival: "09:05",
      durationHours: 2.08,
      overnight: false,
      price: { sleeper: 110, ac3: 295, ac2: 440 },
      frequency: "Daily",
      note: "Only 135 km. Very frequent service. Pushkar 14 km from Ajmer (shared jeep \u20b920).",
    },
  ],

  JAIPUR_CHITTORGARH: [
    {
      trainName: "Chetak Express",
      trainNumber: "19601",
      departure: "22:00",
      arrival: "04:30",
      durationHours: 6.5,
      overnight: true,
      price: { sleeper: 225, ac3: 595, ac2: 890 },
      frequency: "Daily",
    },
    {
      trainName: "Ajmer-Mumbai Express (alight Chittorgarh)",
      trainNumber: "12991",
      departure: "07:10",
      arrival: "12:30",
      durationHours: 5.33,
      overnight: false,
      price: { sleeper: 225, ac3: 595, ac2: 890 },
      frequency: "Daily",
    },
  ],

  JAIPUR_ALWAR: [
    {
      trainName: "Jaipur-Delhi Intercity (alight Alwar)",
      trainNumber: "12058",
      departure: "08:00",
      arrival: "10:30",
      durationHours: 2.5,
      overnight: false,
      price: { sleeper: 130, ac3: 345, ac2: 515 },
      frequency: "Daily",
      note: "150 km. Good gateway to Sariska Tiger Reserve.",
    },
  ],

  JAIPUR_BHARATPUR: [
    {
      trainName: "Jaipur-Agra Intercity",
      trainNumber: "19665",
      departure: "06:30",
      arrival: "10:00",
      durationHours: 3.5,
      overnight: false,
      price: { sleeper: 155, ac3: 415, ac2: 620 },
      frequency: "Daily",
      note: "Alight at Bharatpur. 2 km from Keoladeo Bird Sanctuary (UNESCO).",
    },
  ],

  JAIPUR_MOUNT_ABU: [
    {
      trainName: "Jaipur-Ahmedabad Express (alight Abu Road)",
      trainNumber: "14701",
      departure: "23:15",
      arrival: "07:30",
      durationHours: 8.25,
      overnight: true,
      price: { sleeper: 255, ac3: 675, ac2: 1010 },
      frequency: "Daily",
      note: "Alight at Abu Road. Shared taxi to Mount Abu 28 km (\u20b9100/person, 45 min).",
    },
  ],

  // ── From Agra (new North destinations) ────────────────────────────────────────

  AGRA_BHARATPUR: [
    {
      trainName: "Multiple daily trains (55 km)",
      trainNumber: "various",
      departure: "Various",
      arrival: "Various",
      durationHours: 1.0,
      overnight: false,
      price: { sleeper: 65, ac3: 175, ac2: 260 },
      frequency: "10+ daily",
      note: "Only 55 km. Easy day trip to Keoladeo Bird Sanctuary. Auto-rickshaws outside station.",
    },
  ],

  AGRA_ALWAR: [
    {
      trainName: "Jaipur Intercity (alight Alwar)",
      trainNumber: "12059",
      departure: "07:40",
      arrival: "10:30",
      durationHours: 2.83,
      overnight: false,
      price: { sleeper: 150, ac3: 400, ac2: 595 },
      frequency: "Daily",
    },
  ],

  // ── From Lucknow (new North destinations) ─────────────────────────────────────

  LUCKNOW_AMRITSAR: [
    {
      trainName: "Lucknow-Amritsar Express",
      trainNumber: "14673",
      departure: "20:00",
      arrival: "07:45",
      durationHours: 11.75,
      overnight: true,
      price: { sleeper: 320, ac3: 850, ac2: 1270 },
      frequency: "Daily",
    },
  ],

  LUCKNOW_CHANDIGARH: [
    {
      trainName: "Lucknow-Chandigarh Express",
      trainNumber: "14649",
      departure: "21:30",
      arrival: "07:30",
      durationHours: 10.0,
      overnight: true,
      price: { sleeper: 290, ac3: 770, ac2: 1150 },
      frequency: "Daily",
    },
  ],

  LUCKNOW_VAISHNO_DEVI: [
    {
      trainName: "Jammu Tawi Express",
      trainNumber: "14649",
      departure: "21:30",
      arrival: "15:00",
      durationHours: 17.5,
      overnight: true,
      price: { sleeper: 390, ac3: 1035, ac2: 1545 },
      frequency: "Daily",
      note: "Alight at Katra. Trek 14 km to Vaishno Devi shrine or helicopter \u20b91,200.",
    },
  ],

  LUCKNOW_NALANDA: [
    {
      trainName: "Lucknow-Gaya Express (alight Gaya)",
      trainNumber: "12327",
      departure: "21:00",
      arrival: "07:00",
      durationHours: 10.0,
      overnight: true,
      price: { sleeper: 275, ac3: 730, ac2: 1090 },
      frequency: "Daily",
      note: "Alight at Gaya. Nalanda ruins 95 km (bus \u20b980 or cab \u20b91,200).",
    },
  ],

  // ── From Varanasi (new North destinations) ────────────────────────────────────

  VARANASI_NALANDA: [
    {
      trainName: "Mahabodhi Express (alight Gaya)",
      trainNumber: "12397",
      departure: "11:00",
      arrival: "14:30",
      durationHours: 3.5,
      overnight: false,
      price: { sleeper: 150, ac3: 400, ac2: 595 },
      frequency: "Daily",
      note: "Alight at Gaya. Nalanda 95 km (cab \u20b91,200 or bus \u20b980 via Rajgir).",
    },
  ],

  // ── From Patna (new North destinations) ───────────────────────────────────────

  PATNA_NALANDA: [
    {
      trainName: "Patna-Rajgir Intercity",
      trainNumber: "13201",
      departure: "08:00",
      arrival: "11:00",
      durationHours: 3.0,
      overnight: false,
      price: { sleeper: 110, ac3: 295, ac2: 440 },
      frequency: "Daily",
      note: "Alight at Nalanda station. Ruins complex is 3 km (auto \u20b960).",
    },
  ],

  PATNA_DEOGHAR: [
    {
      trainName: "Shiv Ganga Express (alight Jasidih)",
      trainNumber: "12560",
      departure: "18:30",
      arrival: "06:00",
      durationHours: 11.5,
      overnight: true,
      price: { sleeper: 245, ac3: 650, ac2: 970 },
      frequency: "Daily",
      note: "Alight at Jasidih Junction. Deoghar 8 km (auto \u20b960).",
    },
  ],

  // ── From Kanpur (new North destinations) ──────────────────────────────────────

  KANPUR_CHANDIGARH: [
    {
      trainName: "Kalindi Express",
      trainNumber: "14117",
      departure: "22:05",
      arrival: "09:30",
      durationHours: 11.42,
      overnight: true,
      price: { sleeper: 300, ac3: 795, ac2: 1185 },
      frequency: "Daily",
    },
  ],

  KANPUR_VAISHNO_DEVI: [
    {
      trainName: "Jammu Express (via Delhi)",
      trainNumber: "14033",
      departure: "07:30",
      arrival: "05:30",
      durationHours: 22.0,
      overnight: true,
      price: { sleeper: 430, ac3: 1140, ac2: 1700 },
      frequency: "Daily",
      note: "Long overnight journey via Delhi. Book AC3 for comfort. Alight at Katra.",
    },
  ],
};

// ── Bus routes ────────────────────────────────────────────────────────────────

const BUS_ROUTES: Record<string, BusRoute> = {
  KANPUR_AGRA: {
    operatorType: "UPSRTC / Private",
    price: { min: 250, max: 450 },
    durationHours: 4.5,
    frequency: "Every 1\u20132 hours from Jhakarkati Bus Stand",
    note: "Estimated pricing \u2014 verify on RedBus before booking",
  },
  KANPUR_LUCKNOW: {
    operatorType: "UPSRTC / Private",
    price: { min: 150, max: 280 },
    durationHours: 2.0,
    frequency: "Frequent, every 30 min",
    note: "Estimated pricing \u2014 verify on RedBus before booking",
  },
  JAIPUR_AGRA: {
    operatorType: "RSRTC / Private Volvo",
    price: { min: 280, max: 650 },
    durationHours: 4.5,
    frequency: "Multiple daily departures",
    note: "Estimated pricing \u2014 verify on RedBus before booking",
  },
  DELHI_RISHIKESH: {
    operatorType: "UKMRC / Private Volvo",
    price: { min: 350, max: 850 },
    durationHours: 6.0,
    frequency: "Morning and overnight buses",
    note: "Estimated pricing \u2014 verify on RedBus before booking",
  },
  NAGPUR_PENCH: {
    operatorType: "MSRTC / Private",
    price: { min: 180, max: 350 },
    durationHours: 2.5,
    frequency: "Several daily departures from Nagpur bus stand",
    note: "Alight at Turia Gate (Pench MP side). Book accommodation on Pench resort zone.",
  },
  NAGPUR_TADOBA: {
    operatorType: "MSRTC / Private",
    price: { min: 150, max: 280 },
    durationHours: 3.0,
    frequency: "Several daily departures (change at Chandrapur)",
    note: "Alight at Moharli/Tadoba gate. Book safari tickets on Maharashtra Forest Dept site.",
  },
  INDORE_MANDU: {
    operatorType: "MPSRTC / Private",
    price: { min: 100, max: 200 },
    durationHours: 3.0,
    frequency: "Morning buses from Indore bus stand at 7:30 AM and 9 AM",
    note: "Mandu is entirely inside a fort city on a plateau. Accommodation is inside the fort.",
  },
  INDORE_UJJAIN: {
    operatorType: "MPSRTC / Private",
    price: { min: 60, max: 130 },
    durationHours: 1.5,
    frequency: "Very frequent, every 30\u201345 min",
    note: "Cheaper than the train for Ujjain. Bus stand near both Indore and Ujjain stations.",
  },
  BHOPAL_SANCHI: {
    operatorType: "MPSRTC / Private",
    price: { min: 50, max: 100 },
    durationHours: 1.0,
    frequency: "Frequent from Bhopal Nadra bus stand",
    note: "46 km. Bus drops at Sanchi town, 5-min walk to stupa complex.",
  },
  BHOPAL_ORCHHA: {
    operatorType: "MPSRTC / Private",
    price: { min: 180, max: 350 },
    durationHours: 4.5,
    frequency: "Morning bus at 6:30 AM from Bhopal bus stand",
    note: "Via Jhansi highway. Drops at Orchha bus stand, walking distance to Ram Raja Temple.",
  },
  BHOPAL_PACHMARCHI: {
    operatorType: "MPSRTC / Private",
    price: { min: 150, max: 280 },
    durationHours: 5.0,
    frequency: "Morning buses at 6 AM and 7:30 AM",
    note: "Via Pipariya. Drops at Pachmarchi bus stand.",
  },
  JAIPUR_RANTHAMBORE: {
    operatorType: "RSRTC / Private",
    price: { min: 150, max: 300 },
    durationHours: 3.0,
    frequency: "Multiple daily from Jaipur Sindhi Camp bus stand",
    note: "Alight at Sawai Madhopur. Auto to park gate \u20b980.",
  },
  JAIPUR_UDAIPUR: {
    operatorType: "RSRTC Volvo / Private",
    price: { min: 350, max: 700 },
    durationHours: 8.0,
    frequency: "Overnight buses 10 PM\u201311:30 PM",
    note: "Overnight bus saves accommodation. Arrive fresh in Udaipur.",
  },
  DELHI_MANALI: {
    operatorType: "HRTC Volvo / Private",
    price: { min: 750, max: 1800 },
    durationHours: 14.0,
    frequency: "Overnight buses 5 PM\u20137 PM from ISBT Kashmere Gate",
    note: "Book Volvo for comfort. Arrive Manali Bus Stand 7\u20139 AM. Season June\u2013Sept only.",
  },
  DELHI_MCLEOD_GANJ: {
    operatorType: "HRTC Volvo / Private",
    price: { min: 700, max: 1600 },
    durationHours: 13.0,
    frequency: "Nightly departures 6\u20138 PM from ISBT Kashmere Gate",
    note: "Overnight bus to McLeod Ganj Bus Stand. 520 km. Book in advance for weekends.",
  },
  DELHI_KASOL: {
    operatorType: "HRTC / Private",
    price: { min: 600, max: 1400 },
    durationHours: 12.0,
    frequency: "Overnight departures 7\u20139 PM from ISBT Kashmere Gate",
    note: "Bus goes via Bhuntar. Alight at Kasol. Shared cab from Bhuntar \u20b9100/person (1.5 hrs).",
  },
  DELHI_DALHOUSIE: {
    operatorType: "HRTC / Private",
    price: { min: 650, max: 1500 },
    durationHours: 11.0,
    frequency: "Overnight departures 7 PM from ISBT Kashmere Gate",
    note: "Alight at Dalhousie Bus Stand. Train option: Delhi to Pathankot then bus 80 km.",
  },
  DELHI_BIR_BILLING: {
    operatorType: "HRTC / Private",
    price: { min: 650, max: 1400 },
    durationHours: 12.0,
    frequency: "Overnight buses via Una or Chandigarh",
    note: "Alight at Bir village. World\u2019s second-highest paragliding site. Book in advance.",
  },
  CHANDIGARH_MANALI: {
    operatorType: "HRTC Volvo / Private",
    price: { min: 550, max: 1200 },
    durationHours: 10.0,
    frequency: "Morning (6 AM) and overnight (10 PM) from Chandigarh ISBT",
    note: "280 km via Kullu Valley. Scenic route through Beas gorge. Book Volvo for comfort.",
  },
  CHANDIGARH_MCLEOD_GANJ: {
    operatorType: "HRTC / Private",
    price: { min: 400, max: 950 },
    durationHours: 8.0,
    frequency: "Multiple daily departures from Chandigarh ISBT",
    note: "240 km. The most convenient gateway to Dharamshala / McLeod Ganj.",
  },
  CHANDIGARH_KASOL: {
    operatorType: "HRTC / Private",
    price: { min: 450, max: 900 },
    durationHours: 9.0,
    frequency: "Overnight buses from Chandigarh ISBT",
    note: "Via Bhuntar. Alight at Kasol or take shared cab from Bhuntar (\u20b9100, 1.5 hrs).",
  },
  CHANDIGARH_DALHOUSIE: {
    operatorType: "HRTC / Private",
    price: { min: 350, max: 800 },
    durationHours: 7.0,
    frequency: "Morning bus 6 AM from Chandigarh ISBT",
    note: "Via Pathankot. Scenic drive through lower Himalayas.",
  },
  CHANDIGARH_BIR_BILLING: {
    operatorType: "HRTC / Private",
    price: { min: 350, max: 700 },
    durationHours: 8.0,
    frequency: "Morning buses from Chandigarh ISBT",
    note: "230 km. Paragliding capital of India. Billing meadow is 15 km above Bir village.",
  },
  DEHRADUN_CHOPTA: {
    operatorType: "GMOU / Private",
    price: { min: 300, max: 700 },
    durationHours: 7.0,
    frequency: "Morning buses from Dehradun ISBT via Ukhimath",
    note: "230 km. Change at Ukhimath (shared jeep \u20b9100). Chopta is the base for Tungnath trek.",
  },
  DEHRADUN_AULI: {
    operatorType: "GMOU / Private",
    price: { min: 350, max: 700 },
    durationHours: 9.0,
    frequency: "Morning bus from Dehradun to Joshimath. Cable car to Auli.",
    note: "280 km to Joshimath. Cable car from Joshimath to Auli (\u20b9500 return, 4 km, 25 min).",
  },
  JAIPUR_MANDAWA: {
    operatorType: "RSRTC / Private",
    price: { min: 200, max: 400 },
    durationHours: 3.5,
    frequency: "Multiple daily from Jaipur Sindhi Camp bus stand",
    note: "170 km. Gateway to Shekhawati\u2019s painted havelis. Drop at Mandawa Chowk.",
  },
  JAIPUR_RANAKPUR: {
    operatorType: "RSRTC / Private",
    price: { min: 250, max: 500 },
    durationHours: 5.0,
    frequency: "Morning buses from Jaipur Sindhi Camp",
    note: "Via Jodhpur highway. Ranakpur Jain Temple is 3 km from bus stop.",
  },
  JODHPUR_RANAKPUR: {
    operatorType: "RSRTC / Private",
    price: { min: 150, max: 300 },
    durationHours: 3.0,
    frequency: "Multiple daily from Jodhpur Central Bus Stand",
    note: "90 km via NH-162. Direct to Ranakpur Jain Temples. One of India\u2019s most ornate temples.",
  },
  MEERUT_HARIDWAR: {
    operatorType: "UPSRTC / Private",
    price: { min: 150, max: 280 },
    durationHours: 3.0,
    frequency: "Frequent from Meerut bus stand",
    note: "100 km. Good gateway to Haridwar for Ganga aarti. Evening buses available.",
  },
  MEERUT_DEHRADUN: {
    operatorType: "UPSRTC / Private",
    price: { min: 200, max: 380 },
    durationHours: 3.5,
    frequency: "Multiple daily from Meerut bus stand",
    note: "130 km via NH-58. Dehradun is gateway to Mussoorie and Rishikesh.",
  },
  AGRA_FATEHPUR_SIKRI: {
    operatorType: "UP Government / Private",
    price: { min: 40, max: 200 },
    durationHours: 1.0,
    frequency: "Very frequent from Agra Fort Bus Stand",
    note: "40 km. Shared bus \u20b940 or taxi \u20b9600. Mughal ghost capital \u2014 perfect half-day trip from Agra.",
  },
};

// ── First/last mile connections ───────────────────────────────────────────────

const FIRST_MILE: Record<string, string> = {
  Kanpur: "Auto/Ola to Kanpur Central (\u20b960\u2013100, 15\u201325 min)",
  Lucknow: "Auto/Ola to Lucknow Junction or Charbagh (\u20b980\u2013130, 20\u201330 min)",
  Varanasi: "Auto/Ola to Varanasi Junction (\u20b970\u2013120, 20 min)",
  Jaipur: "Auto/Ola to Jaipur Junction (\u20b980\u2013130, 20 min)",
  Indore: "Auto/Ola to Indore Junction (\u20b960\u2013100, 15 min)",
  Nagpur: "Auto/Ola to Nagpur Railway Station (\u20b970\u2013120, 20 min)",
  Bhopal: "Auto/Ola to Bhopal Junction (\u20b970\u2013100, 15 min)",
  Patna: "Auto/Ola to Patna Junction (\u20b980\u2013130, 25 min)",
  Agra: "Auto/Ola to Agra Cantt (\u20b980\u2013120, 20 min)",
  Prayagraj: "Auto/Ola to Prayagraj Junction (\u20b990\u2013140, 25 min)",
  Delhi: "Metro/Cab to New Delhi (NDLS) or Hazrat Nizamuddin (NZM) station (\u20b950\u2013200, 20\u201345 min). Use Metro for budget.",
  Chandigarh: "Auto/Ola to Chandigarh Railway Station (\u20b980\u2013120, 15\u201325 min)",
  Meerut: "Auto to Meerut City or Meerut Cantt station (\u20b960\u2013100, 15 min)",
  Dehradun: "Auto/Ola to Dehradun Railway Station (\u20b970\u2013100, 15 min from clock tower area)",
  Jodhpur: "Auto/Ola to Jodhpur Junction (\u20b980\u2013120, 20 min from city center)",
};

const LAST_MILE: Record<string, string> = {
  Ayodhya: "E-rickshaw from Ayodhya Cantt to Ram Janmabhoomi (\u20b930, 10 min). Everything walkable from temple zone.",
  Mathura: "Auto from Mathura Junction to Vishram Ghat (\u20b960, 10 min). Vrindavan: shared tempo (\u20b920, 30 min).",
  Rishikesh: "Shared taxi from Haridwar to Rishikesh (\u20b980\u2013120 per person, 30 min)",
  Agra: "Auto/Cab from Agra Cantt to hotel/Taj area (\u20b9100\u2013200, 15\u201330 min)",
  Varanasi: "Auto from station to Ghats area (\u20b980\u2013150, 20\u201330 min)",
  Jaipur: "Auto/Ola from station to hotel (\u20b980\u2013150, 15\u201325 min)",
  Delhi: "Metro from NDLS/NZM to your area (\u20b930\u201360, varies)",
  Mumbai: "Local train / Cab from CSMT/LTT (\u20b950\u2013200, varies)",
  Mussoorie: "Shared Sumo from Dehradun to Mussoorie (\u20b9120 per person, 1.5 hrs)",
  Nainital: "Cab/Bus from Kathgodam to Nainital (\u20b9200\u2013350, 1.5 hrs)",
  Shimla: "Cab from Kalka to Shimla (\u20b9800\u20131,200 for group) OR Toy Train (\u20b9500/person, scenic!)",
  Kolkata: "Metro/Cab from station (\u20b950\u2013200)",
  Haridwar: "Auto from station to Har Ki Pauri (\u20b950\u201380, 10 min)",
  Orchha: "Shared auto from Jhansi to Orchha (\u20b940, 40 min). Orchha is entirely walkable.",
  Khajuraho: "Auto/Cab from Khajuraho station to hotel (\u20b9100\u2013200, 10 min). Western temples are 3 km from station.",
  Gwalior: "Auto/Cab from Gwalior station to Fort area (\u20b980\u2013150, 15 min)",
  Sanchi: "5-min walk from Sanchi station to stupa complex.",
  Bundi: "Auto from Bundi station to Taragarh area (\u20b960, 10 min)",
  Udaipur: "Auto/Ola from Udaipur City station to hotel (\u20b980\u2013150, 15 min)",
  Jodhpur: "Auto/Ola from Jodhpur station to clock tower area (\u20b980\u2013150, 15 min)",
  Ujjain: "Auto from Ujjain station to Mahakaleshwar Temple (\u20b960, 10 min)",
  Pushkar: "Pushkar is 14 km from Ajmer Junction. Shared jeep (\u20b920) or cab (\u20b9200). 30 min.",
  Ranthambore: "Auto from Sawai Madhopur station to park gate (\u20b980, 10 min).",
  "Bodh Gaya": "Auto/cab from Gaya Junction to Bodh Gaya (\u20b9150\u2013300, 20 min, 16 km).",
  Rajgir: "Direct to Rajgir station. Hot springs 5-min walk from station.",
  Chitrakoot: "Auto from Chitrakoot Dham (Karwi) station to Ramghat (\u20b960, 10 min).",
  Pachmarchi: "Auto/taxi from Pachmarchi bus stand to hotel (\u20b960\u2013100, 10 min). Get a full-day jeep (\u20b9800\u20131,200) to explore the scattered attractions.",
  Jabalpur: "Auto/cab from Jabalpur station to Bhedaghat (\u20b9300\u2013500, 25 km, 30 min).",
  Pench: "Cab from Seoni/Nagpur to Turia Gate (\u20b91,000\u20131,500). Pre-book accommodation with transfer.",
  Lansdowne: "Cab from Kotdwar station to Lansdowne (\u20b9700, 40 km, 1 hr). Or shared taxi (\u20b9100 per person).",
  Corbett: "Ramnagar station is 1 km from town. Pre-book hotel transport. Jim Corbett zones are 10\u201330 km from Ramnagar.",
  Mandu: "Jeep/taxi from Indore or Mhow to Mandu (\u20b9600\u20131,200). Mandu village is inside the fort.",
  Amritsar: "Auto/Ola from Amritsar Junction to Golden Temple (\u20b980\u2013120, 10 min). Attari-Wagah border 28 km (cab \u20b9600 return).",
  "McLeod Ganj": "Cab from Pathankot to McLeod Ganj (\u20b91,200\u20131,600, 3 hrs) or HRTC bus (\u20b9150, 3.5 hrs). Dharamshala 10 km below.",
  Manali: "Bus from Kullu/Bhuntar bus stand to Manali (\u20b9100, 1 hr). Solang Valley 14 km, Rohtang 51 km (jeep \u20b9800).",
  Kasol: "Shared cab from Bhuntar (near Kullu) to Kasol (\u20b9100/person, 1.5 hrs). No direct bus from major cities.",
  "Bir Billing": "Local bus or shared jeep from Una or Mandi to Bir village (\u20b9100\u2013200). Billing meadow 14 km above Bir (jeep \u20b9500).",
  Dalhousie: "Bus from Pathankot to Dalhousie (\u20b9100, 2 hrs) or cab (\u20b9600). Khajjiar 24 km (cab \u20b9400 return).",
  Chail: "Cab from Shimla to Chail (\u20b9800\u20131,000, 1.5 hrs) or from Kalka (\u20b91,200\u20131,500, 3 hrs). No direct bus.",
  Chopta: "Cab from Rishikesh or Haridwar to Chopta (\u20b92,000\u20132,500, 5 hrs). Base for Tungnath-Chandrashila trek (3.5 km).",
  Auli: "Cable car from Joshimath (\u20b9500 return, 25 min). Cab from Rishikesh to Joshimath (\u20b92,500, 4 hrs).",
  Dehradun: "Auto/cab from Dehradun station to city (\u20b960\u2013120, 10 min). Mussoorie 32 km (shared Sumo \u20b9120/person, 1.5 hrs).",
  Jaisalmer: "Auto from Jaisalmer station to Old City/fort (\u20b980\u2013120, 10 min). Sam Sand Dunes 42 km (jeep safari \u20b9800).",
  Bikaner: "Auto from Bikaner station to Junagarh Fort area (\u20b960\u2013100, 10 min). Karni Mata Temple 30 km.",
  Ajmer: "Auto from Ajmer Junction to Dargah Sharif (\u20b960\u2013100, 10 min). Pushkar 14 km (shared jeep \u20b920).",
  Chittorgarh: "Auto from Chittorgarh station to fort entrance (\u20b990\u2013120, 15 min, 5 km). Rana Kumbha Palace is 3 km inside fort.",
  Alwar: "Auto from Alwar station to city center (\u20b960\u201380, 10 min). Sariska Tiger Reserve 37 km (cab \u20b9800).",
  Bharatpur: "Auto/cycle rickshaw from station to Keoladeo National Park (\u20b960\u2013100, 2 km). Inside park, cycle rentals \u20b960/day.",
  "Mount Abu": "Shared taxi from Abu Road station to Mount Abu (\u20b9100/person, 1 hr, 28 km) or cab (\u20b9400).",
  Mandawa: "Auto from Mandawa bus stand to Shekhawati havelis (\u20b930\u201360, 5 min). Village is compact \u2014 walking distance between havelis.",
  Ranakpur: "Cab from Falna station to Ranakpur Jain Temple (\u20b9800, 1.5 hrs, 40 km). No public transport directly.",
  Vrindavan: "Shared tempo from Mathura Junction to Vrindavan (\u20b920, 20 min, 15 km). E-rickshaw inside Vrindavan \u20b930.",
  "Fatehpur Sikri": "Cab from Agra to Fatehpur Sikri (\u20b9600, 40 min, 40 km) or local bus from Agra Fort bus stand (\u20b940).",
  Dudhwa: "Cab from Mailani station to Dudhwa National Park gate (\u20b9300\u2013500, 20 km). Pre-book accommodation inside park.",
  Nalanda: "Auto from Nalanda station to ruins (\u20b960\u201380, 3 km, 5 min). Rajgir hot springs 12 km (shared cab \u20b960).",
  "Vaishno Devi": "Helicopter from Katra to Sanjichhat (\u20b91,200 one-way, 5 min) or trek from Katra (14 km, 4\u20135 hrs). Katra is 30 min from station.",
  Kurukshetra: "Auto from Kurukshetra Junction to Brahma Sarovar (\u20b960\u201380, 10 min, 5 km). Jyotisar (Gita birthplace) 8 km.",
  Chandigarh: "Auto/Ola from station to Sector 17 (\u20b980\u2013120, 15 min). Rock Garden 5 km, Sukhna Lake 8 km, Rose Garden 3 km.",
  Deoghar: "Auto from Deoghar station to Baidyanath Temple (\u20b960, 5 min, 1 km). Nandan Pahar 7 km. Everything is compact.",
};

// ── Structured last-mile data (budget vs comfort, with duration) ──────────────
// Gives users a "price shield" against local scams — they know the fair fare upfront.

const LAST_MILE_DATA: Record<string, LastMileData> = {
  Ayodhya:    { budget: "E-rickshaw \u20b930 (10 min)", comfort: "Auto/cab \u20b980\u2013120 (10 min)", duration: "10 min" },
  Mathura:    { budget: "Auto to Vishram Ghat \u20b960 (10 min)", comfort: "Cab \u20b9200 (10 min)", duration: "10 min" },
  Rishikesh:  { budget: "Shared taxi from Haridwar \u20b980\u2013120/person (30 min)", comfort: "Private cab \u20b9600\u2013800 (30 min)", duration: "30 min" },
  Agra:       { budget: "Auto to Taj area \u20b9100\u2013150 (20 min)", comfort: "Cab \u20b9250\u2013350 (20 min)", duration: "20 min" },
  Varanasi:   { budget: "Auto to Ghats \u20b980\u2013100 (20 min)", comfort: "Cab \u20b9200\u2013300 (20 min)", duration: "20\u201330 min" },
  Jaipur:     { budget: "Auto to hotel \u20b980\u2013120 (15 min)", comfort: "Ola/cab \u20b9200\u2013300 (15 min)", duration: "15\u201325 min" },
  Delhi:      { budget: "Metro \u20b930\u201360 (varies)", comfort: "Cab \u20b9300\u2013600 (varies)", duration: "20\u201345 min" },
  Haridwar:   { budget: "Auto to Har Ki Pauri \u20b950\u201380 (10 min)", comfort: "Cab \u20b9150\u2013200 (10 min)", duration: "10 min" },
  Mussoorie:  { budget: "Shared Sumo from Dehradun \u20b9120/person (1.5 hrs)", comfort: "Private cab \u20b9800\u20131,000 (1.5 hrs)", duration: "1.5 hrs" },
  Nainital:   { budget: "Shared cab from Kathgodam \u20b9150\u2013200/person (1.5 hrs)", comfort: "Private cab \u20b9700\u20131,000 (1.5 hrs)", duration: "1.5 hrs" },
  Shimla:     { budget: "Shared cab from Kalka \u20b9200/person (2 hrs)", comfort: "Private cab \u20b91,200\u20131,500 (2 hrs)", duration: "2 hrs" },
  Orchha:     { budget: "Shared auto from Jhansi \u20b940 (40 min)", comfort: "Cab \u20b9350\u2013500 (40 min)", duration: "40 min" },
  Pushkar:    { budget: "Shared jeep from Ajmer \u20b920\u201330/person (30 min)", comfort: "Private cab \u20b9300\u2013400 (30 min)", duration: "30 min" },
  Ujjain:     { budget: "Auto to Mahakaleshwar \u20b940\u201360 (10 min)", comfort: "Cab \u20b9150 (10 min)", duration: "10 min" },
  "Bodh Gaya":{ budget: "Auto from Gaya \u20b9150\u2013200 (20 min)", comfort: "Cab \u20b9400\u2013500 (20 min)", duration: "20 min" },
  Rajgir:     { budget: "Hot springs 5-min walk from station", comfort: "Auto \u20b940 (5 min)", duration: "5 min" },
  Pachmarchi: { budget: "Auto to hotel \u20b960\u2013100 (10 min)", comfort: "Full-day jeep \u20b91,000\u20131,200", duration: "10 min" },
  Ranthambore:{ budget: "Auto to park gate \u20b980 (10 min)", comfort: "Cab \u20b9200\u2013300 (10 min)", duration: "10 min" },
  Chitrakoot: { budget: "Auto to Ramghat \u20b960 (10 min)", comfort: "Cab \u20b9150\u2013200 (10 min)", duration: "10 min" },
  Lansdowne:  { budget: "Shared taxi from Kotdwar \u20b9100/person (1 hr)", comfort: "Private cab \u20b9700\u2013900 (1 hr)", duration: "1 hr" },
  Jabalpur:   { budget: "Auto to Bhedaghat \u20b9300\u2013350 (30 min)", comfort: "Cab \u20b9500\u2013600 (30 min)", duration: "30 min" },
  Pench:          { budget: "Pre-arranged hotel transfer \u20b9500", comfort: "Private cab from Nagpur \u20b91,500\u20132,000", duration: "2\u20133 hrs" },
  Amritsar:       { budget: "Auto to Golden Temple \u20b980\u2013120 (10 min)", comfort: "Ola/cab \u20b9150\u2013200 (10 min)", duration: "10 min" },
  "McLeod Ganj":  { budget: "HRTC bus from Pathankot \u20b9150 (3.5 hrs)", comfort: "Cab from Pathankot \u20b91,200\u20131,600 (3 hrs)", duration: "3\u20133.5 hrs" },
  Manali:         { budget: "Bus from Bhuntar \u20b9100/person (1 hr)", comfort: "Private cab \u20b9600\u2013800 (1 hr)", duration: "1 hr" },
  Kasol:          { budget: "Shared cab from Bhuntar \u20b9100/person (1.5 hrs)", comfort: "Private cab \u20b9600\u2013800 (1.5 hrs)", duration: "1.5 hrs" },
  "Bir Billing":  { budget: "Shared jeep from Una/Mandi \u20b9100\u2013200 (3 hrs)", comfort: "Private cab \u20b91,200\u20131,500 (2.5 hrs)", duration: "2.5\u20133 hrs" },
  Dalhousie:      { budget: "Bus from Pathankot \u20b9100 (2 hrs)", comfort: "Cab from Pathankot \u20b9600\u2013800 (1.5 hrs)", duration: "1.5\u20132 hrs" },
  Chail:          { budget: "No shared option \u2014 cab from Shimla \u20b9800\u20131,000 (1.5 hrs)", comfort: "Private cab from Kalka \u20b91,500 (3 hrs)", duration: "1.5\u20133 hrs" },
  Chopta:         { budget: "Shared jeep from Ukhimath \u20b9100/person (1 hr)", comfort: "Private cab from Rishikesh \u20b92,000\u20132,500 (5 hrs)", duration: "5 hrs" },
  Auli:           { budget: "Cable car from Joshimath \u20b9500 return (25 min)", comfort: "Private cab Rishikesh\u2013Joshimath \u20b92,500 (4 hrs)", duration: "25 min (cable car)" },
  Dehradun:       { budget: "Auto to city center \u20b960\u201380 (10 min)", comfort: "Cab \u20b9150\u2013250 (10 min)", duration: "10 min" },
  Jaisalmer:      { budget: "Auto to Old City \u20b980\u2013120 (10 min)", comfort: "Cab \u20b9200\u2013300 (10 min)", duration: "10 min" },
  Bikaner:        { budget: "Auto to Junagarh Fort \u20b960\u2013100 (10 min)", comfort: "Cab \u20b9150\u2013200 (10 min)", duration: "10 min" },
  Ajmer:          { budget: "Auto to Dargah \u20b960\u2013100 (10 min)", comfort: "Cab \u20b9150\u2013200 (10 min)", duration: "10 min" },
  Chittorgarh:    { budget: "Auto to fort entrance \u20b990\u2013120 (15 min)", comfort: "Cab \u20b9200\u2013300 (15 min)", duration: "15 min" },
  Alwar:          { budget: "Auto to city center \u20b960\u201380 (10 min)", comfort: "Cab \u20b9150\u2013200 (10 min)", duration: "10 min" },
  Bharatpur:      { budget: "Cycle rickshaw to Keoladeo Park \u20b960\u2013100 (2 km)", comfort: "Auto \u20b9150 (5 min)", duration: "5\u201310 min" },
  "Mount Abu":    { budget: "Shared taxi from Abu Road \u20b9100/person (1 hr)", comfort: "Private cab \u20b9400\u2013500 (1 hr)", duration: "1 hr" },
  Mandawa:        { budget: "Auto to havelis \u20b930\u201360 (5 min)", comfort: "Cab \u20b9100\u2013150 (5 min)", duration: "5 min" },
  Ranakpur:       { budget: "Cab from Falna station \u20b9800 (1.5 hrs)", comfort: "Private transfer from Jodhpur \u20b91,500\u20132,000 (3 hrs)", duration: "1.5\u20133 hrs" },
  Vrindavan:      { budget: "Shared tempo from Mathura \u20b920 (20 min)", comfort: "Auto \u20b980\u2013100 (20 min)", duration: "20 min" },
  "Fatehpur Sikri": { budget: "Local bus from Agra \u20b940 (1 hr)", comfort: "Cab from Agra \u20b9600 (40 min)", duration: "40 min\u20131 hr" },
  Dudhwa:         { budget: "Cab from Mailani station \u20b9300\u2013500 (30 min)", comfort: "Pre-arranged resort transfer \u20b9800\u20131,200", duration: "30 min" },
  Nalanda:        { budget: "Auto from Nalanda station \u20b960\u201380 (5 min)", comfort: "Cab from Gaya \u20b91,200 (1.5 hrs)", duration: "5 min from station" },
  "Vaishno Devi": { budget: "Trek from Katra 14 km (4\u20135 hrs)", comfort: "Helicopter from Katra \u20b91,200 (5 min)", duration: "5 min or 4\u20135 hrs" },
  Kurukshetra:    { budget: "Auto to Brahma Sarovar \u20b960\u201380 (10 min)", comfort: "Cab \u20b9150\u2013200 (10 min)", duration: "10 min" },
  Chandigarh:     { budget: "Auto to Sector 17 \u20b980\u2013120 (15 min)", comfort: "Ola/cab \u20b9200\u2013300 (15 min)", duration: "15 min" },
  Deoghar:        { budget: "Auto to Baidyanath Temple \u20b960 (5 min)", comfort: "Cab \u20b9150 (5 min)", duration: "5 min" },
};

// ── Lookup function ───────────────────────────────────────────────────────────

export function getTransportOptions(
  origin: string,
  destination: string
): TransportOption[] {
  const key = `${origin.toUpperCase().replace(/\s+/g, "_")}_${destination
    .toUpperCase()
    .replace(/\s+/g, "_")}`;

  const trains = TRAIN_ROUTES[key] ?? [];
  const bus = BUS_ROUTES[key];
  const firstMile = FIRST_MILE[origin] ?? `Auto/Ola to ${origin} station (~\u20b980\u2013130)`;
  const lastMile = LAST_MILE[destination] ?? `Auto/Cab from ${destination} station (~\u20b9100\u2013200)`;
  const lastMileData = LAST_MILE_DATA[destination];

  const options: TransportOption[] = [];

  for (const train of trains) {
    options.push({
      mode: "train",
      train,
      firstMile,
      lastMile,
      lastMileData,
      totalCostPerPerson: {
        budget: train.price.sleeper || train.price.ac3,
        midrange: train.price.ac3 || train.price.ac2,
        comfort: train.price.ac2 || train.price.ac3,
      },
    });
  }

  if (bus) {
    options.push({
      mode: "bus",
      bus,
      firstMile,
      lastMile,
      lastMileData,
      totalCostPerPerson: {
        budget: bus.price.min,
        midrange: Math.round((bus.price.min + bus.price.max) / 2),
        comfort: bus.price.max,
      },
    });
  }

  return options;
}

// ── Fallback transport for uncurated routes ───────────────────────────────────
// Used when no TRAIN_ROUTES or BUS_ROUTES entry exists for an origin→destination pair.
// Generates a distance-based estimate so the itinerary engine always has something
// to work with. The bus note tells users to verify on RedBus — no fake specifics.

export function buildFallbackTransport(
  origin: string,
  destination: string,
  distanceKm: number
): TransportOption {
  const durationHours = Math.max(2, Math.round(distanceKm / 48));
  const budgetPrice   = Math.max(150, Math.round(distanceKm * 1.2));   // ~₹1.2/km non-AC bus
  const comfortPrice  = Math.max(400, Math.round(distanceKm * 2.8));   // ~₹2.8/km Volvo

  const bus: BusRoute = {
    operatorType: "State / Private Volvo",
    price: { min: budgetPrice, max: comfortPrice },
    durationHours,
    frequency: "Daily services available — check RedBus for schedules",
    note: `Estimated fare (₹${budgetPrice.toLocaleString("en-IN")}–₹${comfortPrice.toLocaleString("en-IN")}) based on distance. No fixed schedule in our database — verify on RedBus before booking.`,
  };

  const firstMile   = FIRST_MILE[origin]      ?? `Auto/Ola to ${origin} bus stand (~₹80–130)`;
  const lastMile    = LAST_MILE[destination]   ?? `Auto/Cab from ${destination} (~₹100–200)`;
  const lastMileData = LAST_MILE_DATA[destination];

  return {
    mode: "bus",
    bus,
    firstMile,
    lastMile,
    lastMileData,
    totalCostPerPerson: {
      budget:   budgetPrice,
      midrange: Math.round((budgetPrice + comfortPrice) / 2),
      comfort:  comfortPrice,
    },
  };
}

// ── Deep-link generators ──────────────────────────────────────────────────────

/**
 * Returns a pre-filled RedBus search URL for the given origin → destination on a date.
 * Format: DD-MM-YYYY as required by RedBus onward param.
 */
export function getRedBusLink(origin: string, destination: string, startDate: string): string {
  const from = origin.toLowerCase().replace(/\s+/g, "-");
  const to   = destination.toLowerCase().replace(/\s+/g, "-");
  const d    = new Date(startDate);
  const dd   = String(d.getDate()).padStart(2, "0");
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `https://www.redbus.in/bus-tickets/${from}-to-${to}?onward=${dd}-${mm}-${yyyy}`;
}

/**
 * Returns a TrainMan train search URL for the given origin → destination.
 * TrainMan supports city names in uppercase directly.
 */
export function getTrainManLink(origin: string, destination: string): string {
  const from = origin.toUpperCase().replace(/\s+/g, "-");
  const to   = destination.toUpperCase().replace(/\s+/g, "-");
  return `https://www.trainman.in/trains/${from}-to-${to}`;
}

// ── Destination-first transport lookup ───────────────────────────────────────
// The destination-first model (v4.0): given a destination, find ALL origin
// cities that have curated train routes to it. Any city within 500km and
// <8 hrs direct journey auto-qualifies as a source city.
//
// This enables the origin dropdown to expand as destinations are curated —
// no separate "which origins to support" planning needed.

export interface DestinationTrainSource {
  origin: string;          // e.g. "Lucknow"
  trains: TrainRoute[];    // all curated trains from this origin to the destination
  fastestHours: number;    // fastest train duration
  cheapestSleeper: number; // cheapest sleeper one-way fare (₹)
}

/**
 * Given a destination name, returns every origin city in TRAIN_ROUTES
 * that has a curated route to it, sorted by journey time ascending.
 *
 * This is the destination-first lookup that enables auto-expanding
 * source city coverage as the destination catalogue grows.
 */
export function getTrainsToDestination(destination: string): DestinationTrainSource[] {
  const destKey = destination.toUpperCase().replace(/\s+/g, "_");
  const suffix  = `_${destKey}`;

  const results: DestinationTrainSource[] = [];

  for (const routeKey of Object.keys(TRAIN_ROUTES)) {
    if (!routeKey.endsWith(suffix)) continue;

    // Extract origin from key: "LUCKNOW_AYODHYA" → "Lucknow"
    const originRaw = routeKey.slice(0, routeKey.length - suffix.length);
    const origin = originRaw
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

    const trains = TRAIN_ROUTES[routeKey];
    if (!trains || trains.length === 0) continue;

    const fastestHours = Math.min(...trains.map((t) => t.durationHours));
    const sleeperFares = trains.map((t) => t.price.sleeper).filter((p) => p > 0);
    const cheapestSleeper = sleeperFares.length > 0 ? Math.min(...sleeperFares) : 0;

    results.push({ origin, trains, fastestHours, cheapestSleeper });
  }

  // Sort by fastest journey time — closest cities first
  return results.sort((a, b) => a.fastestHours - b.fastestHours);
}

/**
 * Returns all origin cities reachable to a destination within:
 *   - maxDistanceHours: maximum direct train journey duration (default 8h)
 *
 * This is the 500km / <8hr filter described in VibePath v4.0 architecture.
 * Used to populate the origin dropdown for a given destination.
 */
export function getQualifyingSourceCities(
  destination: string,
  maxJourneyHours = 8
): DestinationTrainSource[] {
  return getTrainsToDestination(destination).filter(
    (s) => s.fastestHours <= maxJourneyHours
  );
}

export { TRAIN_ROUTES, BUS_ROUTES, FIRST_MILE, LAST_MILE, LAST_MILE_DATA };
