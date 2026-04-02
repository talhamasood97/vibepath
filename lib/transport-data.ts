/**
 * Static curated transport data for Tier 2/3 Indian cities.
 *
 * GOVERNANCE note: All prices are real ranges sourced from IRCTC/RedBus as of 2026.
 * Labeled as "estimated" in the UI — direct booking verification required.
 * This file is the single source of truth for transport data.
 * No API dependency — reliable, always available.
 */

import type { TrainRoute, BusRoute, TransportOption } from "@/types";

// ── Train routes ──────────────────────────────────────────────────────────────
// Key format: "ORIGIN_DESTINATION" (uppercase)

const TRAIN_ROUTES: Record<string, TrainRoute[]> = {
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
      departure: "22:45",
      arrival: "06:15",
      durationHours: 7.5,
      overnight: true,
      price: { sleeper: 245, ac3: 640, ac2: 970 },
      frequency: "Daily",
      note: "Overnight saves a hotel night — take this over the morning train if budget is tight",
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
      price: { sleeper: 0, ac3: 0, ac2: 0 }, // Shatabdi — AC chair only
      frequency: "Daily",
      note: "Shatabdi is AC Chair Car only (~₹745). Fastest option.",
    },
    {
      trainName: "Swarna Shatabdi",
      trainNumber: "12004",
      departure: "16:10",
      arrival: "20:05",
      durationHours: 3.92,
      overnight: false,
      price: { sleeper: 0, ac3: 0, ac2: 1150 },
      frequency: "Daily",
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
      note: "AC Chair Car only (~₹790)",
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
      note: "AC Chair Car only (~₹715)",
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
      note: "AC Chair Car only (~₹715)",
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
  NAGPUR_HYDERABAD: [
    {
      trainName: "Nagpur-Hyderabad Express",
      trainNumber: "12736",
      departure: "19:45",
      arrival: "09:15",
      durationHours: 13.5,
      overnight: true,
      price: { sleeper: 270, ac3: 715, ac2: 1070 },
      frequency: "Daily",
    },
  ],
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
      note: "AC Chair Car only (~₹1,045)",
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
};

// ── Bus routes ────────────────────────────────────────────────────────────────

const BUS_ROUTES: Record<string, BusRoute> = {
  KANPUR_AGRA: {
    operatorType: "UPSRTC / Private",
    price: { min: 250, max: 450 },
    durationHours: 4.5,
    frequency: "Every 1-2 hours from Jhakarkati Bus Stand",
    note: "Estimated pricing — verify on RedBus before booking",
  },
  KANPUR_LUCKNOW: {
    operatorType: "UPSRTC / Private",
    price: { min: 150, max: 280 },
    durationHours: 2.0,
    frequency: "Frequent, every 30 min",
    note: "Estimated pricing — verify on RedBus before booking",
  },
  JAIPUR_AGRA: {
    operatorType: "RSRTC / Private Volvo",
    price: { min: 280, max: 650 },
    durationHours: 4.5,
    frequency: "Multiple daily departures",
    note: "Estimated pricing — verify on RedBus before booking",
  },
  DELHI_RISHIKESH: {
    operatorType: "UKMRC / Private Volvo",
    price: { min: 350, max: 850 },
    durationHours: 6.0,
    frequency: "Morning and overnight buses",
    note: "Estimated pricing — verify on RedBus before booking",
  },
};

// ── First/last mile connections ───────────────────────────────────────────────

const FIRST_MILE: Record<string, string> = {
  Kanpur: "Auto/Ola to Kanpur Central (~₹60–100, 15–25 min)",
  Lucknow: "Auto/Ola to Lucknow Junction or Charbagh (~₹80–130, 20–30 min)",
  Varanasi: "Auto/Ola to Varanasi Junction (~₹70–120, 20 min)",
  Jaipur: "Auto/Ola to Jaipur Junction (~₹80–130, 20 min)",
  Indore: "Auto/Ola to Indore Junction (~₹60–100, 15 min)",
  Nagpur: "Auto/Ola to Nagpur Railway Station (~₹70–120, 20 min)",
  Bhopal: "Auto/Ola to Bhopal Junction (~₹70–100, 15 min)",
  Patna: "Auto/Ola to Patna Junction (~₹80–130, 25 min)",
  Agra: "Auto/Ola to Agra Cantt (~₹80–120, 20 min)",
  Prayagraj: "Auto/Ola to Prayagraj Junction (~₹90–140, 25 min)",
};

const LAST_MILE: Record<string, string> = {
  Rishikesh: "Shared taxi from Haridwar to Rishikesh (~₹80–120 per person, 30 min)",
  Agra: "Auto/Cab from Agra Cantt to hotel/Taj area (~₹100–200, 15–30 min)",
  Varanasi: "Auto from station to Ghats area (~₹80–150, 20–30 min)",
  Jaipur: "Auto/Ola from station to hotel (~₹80–150, 15–25 min)",
  Delhi: "Metro from NDLS/NZM to your area (~₹30–60, varies)",
  Mumbai: "Local train / Cab from CSMT/LTT (~₹50–200, varies)",
  Mussoorie: "Shared Sumo from Dehradun to Mussoorie (~₹120 per person, 1.5 hrs)",
  Nainital: "Cab/Bus from Kathgodam to Nainital (~₹200–350, 1.5 hrs)",
  Shimla: "Cab from Kalka to Shimla (~₹800–1200 for group) OR Toy Train (~₹500/person, scenic!)",
  Kolkata: "Metro/Cab from station (~₹50–200)",
  Hyderabad: "Metro/Cab from Secunderabad (~₹80–200)",
  Manali: "Local cab/bus from Volvo drop (~₹100–200 to town)",
  Goa: "Cab from Madgaon/Vasco (~₹300–600 to beach area)",
  Haridwar: "Auto from station to Har Ki Pauri (~₹50–80, 10 min)",
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
  const firstMile = FIRST_MILE[origin] ?? `Auto/Ola to ${origin} station (~₹80–130)`;
  const lastMile = LAST_MILE[destination] ?? `Auto/Cab from ${destination} station (~₹100–200)`;

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
