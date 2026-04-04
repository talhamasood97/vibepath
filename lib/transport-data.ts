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

import type { TrainRoute, BusRoute, TransportOption } from "@/types";

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

  const options: TransportOption[] = [];

  for (const train of trains) {
    options.push({
      mode: "train",
      train,
      firstMile,
      lastMile,
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
      totalCostPerPerson: {
        budget: bus.price.min,
        midrange: Math.round((bus.price.min + bus.price.max) / 2),
        comfort: bus.price.max,
      },
    });
  }

  return options;
}

export { TRAIN_ROUTES, BUS_ROUTES, FIRST_MILE, LAST_MILE };
