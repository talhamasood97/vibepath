/**
 * Local Intelligence — curated hyper-specific local data per destination.
 *
 * This is what makes Musafir's narrative feel like a friend who's BEEN there,
 * not a generic travel brochure. Each entry contains:
 * - Specific restaurants/dhabas with what to order and expected cost
 * - Honest tourist-trap warnings
 * - Hidden gems most visitors miss
 * - Timing intelligence (when crowds hit, when to avoid)
 * - Local transport hacks
 * - What to know before you go
 *
 * This data is injected into Groq prompts so the LLM narrative references
 * real, specific places — not invented ones. Static = zero cost, zero hallucination.
 */

import type { LocalIntelligence } from "@/types";

const LOCAL_INTEL: Record<string, LocalIntelligence> = {

  Ayodhya: {
    destination: "Ayodhya",
    mustEat: [
      {
        name: "Sai Ki Rasoi",
        area: "Near Ram Janmabhoomi Gate 2",
        knownFor: "Free prasad thali — dal, sabzi, roti, rice. Run by a trust.",
        price: "Free (donation-based)",
        tip: "Go before 12 PM. After noon the line stretches 45 mins. Genuinely delicious.",
      },
      {
        name: "Kanak Bhawan Prasad Stalls",
        area: "Kanak Bhawan Temple road",
        knownFor: "Panjeeri and ladoo prasad. Traditional Ayodhya sweets.",
        price: "\u20b950\u2013150",
      },
      {
        name: "Ram Ki Paidi Chai Stalls",
        area: "Along the ghats",
        knownFor: "Kulhad chai with jalebi. Best at sunrise.",
        price: "\u20b910\u201320",
        tip: "Any stall with a clay kulhad is the real deal. Avoid packaged tea here.",
      },
    ],
    streetFood: [
      { name: "Malai Paan", area: "Sugriv Kila road", price: "\u20b930\u201350" },
      { name: "Chaat & Tamatar Chaat", area: "Hanuman Garhi lane", price: "\u20b920\u201340" },
      { name: "Khoya Jalebi", area: "Naya Ghat market", price: "\u20b940\u201360" },
    ],
    shopping: [
      {
        what: "Ram Darbar wooden carvings and idols",
        where: "Hanuman Garhi market lane",
        priceRange: "\u20b9200\u20131,500",
        tip: "First quote is 3x the fair price. Bargain confidently to 40% of opening price.",
      },
      {
        what: "Tulsi mala and rudraksh",
        where: "Shops near Kanak Bhawan",
        priceRange: "\u20b950\u2013500",
        tip: "Authentic rudraksh from certified shops only. Ask for a certificate.",
      },
    ],
    hiddenGems: [
      {
        name: "Guptar Ghat",
        what: "Quiet riverside ghat, believed to be where Ram took jal samadhi (water liberation)",
        why: "Zero tourist crowds. Stunning sunrise. Deeply spiritual without the chaos of main ghats.",
        bestTime: "Sunrise (5:30\u20136:30 AM) or 4\u20135 PM",
      },
      {
        name: "Nageshwarnath Temple",
        what: "One of Ayodhya\u2019s oldest Shiva temples, inside the old fort ruins",
        why: "Most pilgrims miss this. Incredibly serene. The ruins around it are photogenic.",
        bestTime: "Early morning",
      },
      {
        name: "Treta Ke Thakur",
        what: "Temple built at the site where Ram performed Ashwamedha yajna",
        why: "Less known than Ram Janmabhoomi but historically just as significant. Almost never crowded.",
      },
    ],
    avoid: [
      "Self-appointed \u2018guides\u2019 at Ram Janmabhoomi entrance. Entry is free, no guide needed. They\u2019ll demand \u20b9500+.",
      "Overpriced restaurants on the main Ram Path road. Walk one lane off the main road and prices halve.",
      "Prasad sellers outside temples claiming it\u2019s official. Buy from temple-run shops only.",
    ],
    timingTips: [
      {
        activity: "Ram Janmabhoomi darshan",
        bestTime: "6\u20137 AM or after 7 PM",
        avoidTime: "10 AM\u20134 PM (2\u20133 hour queue in peak season)",
        tip: "No phones or bags allowed inside. Lockers available at gate (\u20b910). Dress code: cover shoulders and legs.",
      },
      {
        activity: "Saryu Aarti",
        bestTime: "6:30 PM (Ram Ki Paidi ghat)",
        tip: "Arrive 30 mins early for a good spot near the water. Smaller but beautiful like Varanasi\u2019s aarti.",
      },
      {
        activity: "Hanuman Garhi",
        bestTime: "Early morning or post-sunset",
        avoidTime: "Saturdays and Tuesdays \u2014 extremely crowded, 1+ hour queue",
      },
    ],
    localTransport: "E-rickshaw is king. \u20b910\u201320 per ride anywhere in the temple zone. No Uber/Ola. Shared e-rickshaws go everywhere for \u20b910. For a full-day auto: \u20b9600\u2013800.",
    knowBeforeYouGo: [
      "Dry city \u2014 no alcohol available anywhere in Ayodhya",
      "Dress modestly at all temples (no shorts, cover shoulders)",
      "Most temples close 12\u20132 PM for afternoon break",
      "Ram Janmabhoomi has airport-level security. Budget 45 mins for queue + entry",
      "Best visited Oct\u2013Feb. Summer (Apr\u2013Jun) is extremely hot and crowded post-inauguration",
    ],
    stayAreas: [
      { area: "Ram Path area", why: "Walking distance to Ram Janmabhoomi. Budget hotels \u20b9800\u20131,500/night", bestFor: "value, balanced" },
      { area: "Civil Lines", why: "Quieter, better mid-range options. 10-min e-rickshaw to temples", bestFor: "balanced, comfort" },
    ],
  },

  Varanasi: {
    destination: "Varanasi",
    mustEat: [
      {
        name: "Kashi Chat Bhandar",
        area: "Godaulia Chowk",
        knownFor: "The original tamatar chaat and dahi puri. Varanasi institution since 1920s.",
        price: "\u20b930\u201370",
        tip: "Always a queue. Worth every minute. Go before 12 PM to avoid the longest waits.",
      },
      {
        name: "Deena Chat Bhandar",
        area: "Vishwanath Gali (lane near Kashi Vishwanath)",
        knownFor: "Matar chaat, aloo tikki. Tiny stall, massive flavour.",
        price: "\u20b920\u201350",
      },
      {
        name: "Baati Chokha \u2014 Shree Cafe",
        area: "Assi Ghat",
        knownFor: "Proper litti chokha with ghee. Authentic Bihari-UP cuisine, not tourist-ified.",
        price: "\u20b9120\u2013200",
        tip: "Sit at Assi Ghat, order litti chokha, watch sunset. That\u2019s the scene.",
      },
    ],
    streetFood: [
      { name: "Malaiyyo (winter only, Nov\u2013Feb)", area: "Near Godaulia Chowk mornings", price: "\u20b920\u201340", tip: "A frothy, saffron-topped milk foam dessert. Only exists in cold months. Do not miss." },
      { name: "Lassi at Blue Lassi", area: "Vishwanath Gali lane", price: "\u20b980\u2013150", tip: "The OG. 1925. Thick curd lassi with toppings. Queue expected." },
      { name: "Banarasi Paan", area: "Any paan shop near ghats", price: "\u20b930\u201380" },
    ],
    shopping: [
      { what: "Banarasi silk sarees", where: "Vishwanath Gali, Thatheri Bazaar", priceRange: "\u20b9800\u201315,000+", tip: "Fixed price shops are honest (look for Government Silk Factory outlets). Bargaining in small lanes is expected." },
      { what: "Brass and copper utensils", where: "Thatheri Bazaar (Vishwakarma lane)", priceRange: "\u20b9300\u20135,000", tip: "This is the UNESCO-listed craft area. Buy here, not at tourist shops." },
      { what: "Rudraksh malas and spiritual items", where: "Gali near Kashi Vishwanath", priceRange: "\u20b950\u20132,000" },
    ],
    hiddenGems: [
      {
        name: "Scindia Ghat at sunrise",
        what: "A half-sunken Shiva temple, leaning dramatically into the Ganga. Otherworldly.",
        why: "99% of tourists miss this. It\u2019s 10 min walk north of Manikarnika Ghat.",
        bestTime: "Sunrise",
      },
      {
        name: "Banaras Hindu University campus",
        what: "One of Asia\u2019s largest universities. Vishwanath Temple inside campus, no crowds.",
        why: "The campus Vishwanath Temple is larger and more accessible than the main one. Free. Peaceful.",
        bestTime: "Morning",
      },
      {
        name: "Sarnath",
        what: "Where Buddha gave his first sermon. Buddhist ruins, Dhamek Stupa, museum.",
        why: "Only 12 km from Varanasi, shared auto costs \u20b920. Shockingly few tourists despite UNESCO status.",
        bestTime: "Morning (10 AM\u201312 PM)",
      },
    ],
    avoid: [
      "Boat rides quoted at \u20b9500+ for a ghat tour. Fair price is \u20b9150\u2013250 per hour for a shared boat. Negotiate hard.",
      "The \u2018silk factory\u2019 touts near ghats who take you to overpriced shops on commission. Refuse politely.",
      "Manikarnika Ghat photography \u2014 do not photograph the burning ghats. Deeply disrespectful and locals will react.",
    ],
    timingTips: [
      {
        activity: "Dashashwamedh Ghat Aarti",
        bestTime: "6:30\u20137:15 PM (punctual)",
        tip: "Arrive by 6 PM for a riverfront spot. The boat viewing (shared boat \u20b9150\u2013200) gives a better angle than the crowded bank.",
      },
      {
        activity: "Sunrise boat ride",
        bestTime: "5:30\u20136:30 AM",
        tip: "The golden light on 84 ghats is surreal. Negotiate \u20b9200\u2013350 for a 1-hour row, not the tourist price of \u20b9700.",
      },
      {
        activity: "Kashi Vishwanath Temple",
        bestTime: "6\u20138 AM",
        avoidTime: "11 AM\u20133 PM (2+ hour queues, extreme heat in summer)",
        tip: "Security check is thorough. No phones inside main sanctum. Use cloak room (\u20b910).",
      },
    ],
    localTransport: "Autos and e-rickshaws everywhere, \u20b920\u201360 per ride. The main ghat area is pedestrian-only \u2014 you\u2019ll walk a lot. Wear comfortable sandals. Shared autos to Sarnath leave from Godaulia Chowk (\u20b920).",
    knowBeforeYouGo: [
      "Varanasi lanes are extremely narrow. Large bags are a liability. Leave luggage at hotel.",
      "Cows everywhere on the lanes. Normal. Don\u2019t panic.",
      "Best months: Oct\u2013Mar. Monsoon (Jul\u2013Sep) has Ganga flooding some ghats. Summer is brutal.",
      "Prepare for sensory overload on day 1. By day 2, you\u2019ll be in love with the chaos.",
    ],
    stayAreas: [
      { area: "Near Assi Ghat", why: "Quieter, good cafes, away from the most tourist-heavy area. Budget to mid-range options.", bestFor: "value, balanced" },
      { area: "Godaulia / Central ghats area", why: "Walking distance to everything. Narrow lanes but maximum authenticity.", bestFor: "value" },
      { area: "Bhelupur / Lanka (BHU area)", why: "Cleaner, calmer. 15 min rickshaw to ghats.", bestFor: "comfort, balanced" },
    ],
  },

  Rishikesh: {
    destination: "Rishikesh",
    mustEat: [
      {
        name: "Chotiwala Restaurant",
        area: "Swarg Ashram (near Ram Jhula)",
        knownFor: "The OG Rishikesh thali. Chawal, dal, sabzi, roti, sweet. Iconic since 1958.",
        price: "\u20b9120\u2013220",
        tip: "The twin restaurants face each other and are rivals. Both are good. Ignore touts.",
      },
      {
        name: "Little Buddha Cafe",
        area: "Lakshman Jhula side",
        knownFor: "Rooftop Ganga views, Israeli and Indian veg food. Famous banana pancakes.",
        price: "\u20b9150\u2013350",
        tip: "Go for sunset with a lemon ginger honey tea. The view is worth it.",
      },
      {
        name: "Madras Cafe",
        area: "Near Lakshman Jhula",
        knownFor: "South Indian breakfast in the Himalayas. Dosa, idli \u2014 shockingly authentic.",
        price: "\u20b980\u2013180",
      },
    ],
    streetFood: [
      { name: "Aloo puri from pushcarts", area: "Ram Jhula and Swarg Ashram area", price: "\u20b930\u201360" },
      { name: "Fresh momos", area: "Near taxi stand, Rishikesh main market", price: "\u20b940\u201370" },
      { name: "Maggi stalls at riverside", area: "Below most cafes on the ghat", price: "\u20b940\u201360", tip: "Maggi on the Ganga banks hits different at 7 AM." },
    ],
    shopping: [
      { what: "Yoga and meditation accessories", where: "Swarg Ashram lane", priceRange: "\u20b9100\u20132,000", tip: "Lots of identical shops. Compare prices across 3 shops before buying." },
      { what: "Rudraksh and crystals", where: "Near Parmarth Niketan", priceRange: "\u20b950\u20135,000" },
      { what: "Handmade hemp bags and clothing", where: "Lakshman Jhula market", priceRange: "\u20b9200\u2013800" },
    ],
    hiddenGems: [
      {
        name: "Neer Garh Waterfall",
        what: "A 1.5 km forest trek from Lakshman Jhula to a beautiful waterfall",
        why: "Most tourists do rafting and skip this. The trek is easy, the waterfall is stunning, and in season (Jul\u2013Sep) it\u2019s roaring.",
        bestTime: "Morning 8\u201311 AM",
      },
      {
        name: "Beatles Ashram (Chaurasi Kutia)",
        what: "Maharishi Mahesh Yogi\u2019s ashram where the Beatles wrote the White Album in 1968. Now a ruins-meets-art space.",
        why: "Incredible wall murals, jungle-covered meditation pods, surreal atmosphere. Entry \u20b9150.",
        bestTime: "Late afternoon light is magical",
      },
      {
        name: "Triveni Ghat after aarti",
        what: "Rishikesh\u2019s best aarti (often overshadowed by Haridwar hype). More intimate.",
        why: "After the 6 PM aarti, you can do a floating diya (\u20b910) \u2014 genuinely moving experience.",
        bestTime: "6 PM sharp",
      },
    ],
    avoid: [
      "Rafting operators near bridge who quote \u20b93,000+ for a 16 km stretch. Standard market rate is \u20b9600\u2013900. Book through your hotel or a licensed operator.",
      "Plastic bottled water everywhere. Refill from water ATMs at \u20b95/litre \u2014 save money and the Ganga.",
      "Bungee jumping from unofficial operators. Only use Jumpin Heights or similar certified operators.",
    ],
    timingTips: [
      {
        activity: "White water rafting",
        bestTime: "Oct\u2013May (Sep\u2013Jun is the season). Morning departures (9\u201311 AM)",
        avoidTime: "Monsoon (Jul\u2013Aug) \u2014 river levels are dangerous",
        tip: "16 km stretch (Shivpuri to Rishikesh) is the best value and most fun.",
      },
      {
        activity: "Lakshman Jhula crossing",
        bestTime: "Early morning 6\u20138 AM or evening 5\u20137 PM",
        avoidTime: "Midday \u2014 bridge is extremely crowded and wobbles dramatically",
      },
    ],
    localTransport: "Everything between Ram Jhula and Lakshman Jhula is walkable (2 km). Shared autos run \u20b910\u201320. Bikes on rent: \u20b9300\u2013500/day (great for exploring Neelkanth road, Beatles Ashram).",
    knowBeforeYouGo: [
      "Vegetarian city \u2014 no meat or eggs served in most restaurants",
      "No alcohol sold in Rishikesh (dry zone along the Ganga)",
      "Yoga class options are everywhere. Prices: \u20b9150\u2013500/session. Quality varies wildly. Ask for 1 free trial class first.",
      "Best months: Feb\u2013Jun, Sep\u2013Nov. Monsoon makes roads dangerous and rafting is off.",
    ],
    stayAreas: [
      { area: "Lakshman Jhula area", why: "Backpacker heaven. Cheap hostels, good cafes. Lively at night.", bestFor: "value" },
      { area: "Swarg Ashram / Ram Jhula", why: "More spiritual, peaceful. Ganga views. Good mid-range options.", bestFor: "balanced" },
      { area: "Tapovan / Jonk area", why: "Quieter, resort-type stays. Short cab to main area.", bestFor: "comfort" },
    ],
  },

  Agra: {
    destination: "Agra",
    mustEat: [
      {
        name: "Joney\u2019s Place",
        area: "Taj Ganj (behind the Taj, western side)",
        knownFor: "The banana lassi and fruit salad. Budget traveller institution since the 80s.",
        price: "\u20b950\u2013120",
        tip: "Walk 10 min south of the main tourist road. The overpriced restaurants on the main road are not worth it.",
      },
      {
        name: "Mama Chicken (veg side)",
        area: "Taj Ganj",
        knownFor: "Dal makhani, paneer, fresh rotis. Agra\u2019s favourite budget thali.",
        price: "\u20b980\u2013180",
      },
      {
        name: "Paliwal Restaurant",
        area: "Near Agra Cantt station",
        knownFor: "Bedai and jalebi for breakfast. Agra\u2019s iconic morning ritual.",
        price: "\u20b930\u201360",
        tip: "Bedai is a spiced puri. With jalebi, it\u2019s the authentic Agra breakfast. Nowhere else does it like this.",
      },
    ],
    streetFood: [
      { name: "Petha", area: "Kinari Bazaar (buy from shops in the bazaar, not tourist stalls)", price: "\u20b9100\u2013300/kg", tip: "Angoori petha (grape-shaped) and pan petha (paan-flavoured) are the two varieties to try." },
      { name: "Agra ka dalmoth", area: "Any grocery or traditional shop in the bazaar", price: "\u20b9100\u2013250/kg" },
    ],
    shopping: [
      { what: "Marble inlay (pietra dura) items", where: "Kinari Bazaar and shops in Taj Ganj", priceRange: "\u20b9500\u201310,000+", tip: "Real marble vs fake: put a cold item to your cheek \u2014 marble stays cold. Cheap ones are resin. The craft is genuine here; support real artisans." },
      { what: "Leather shoes and mojari", where: "Sanjay Place market", priceRange: "\u20b9300\u20131,500" },
    ],
    hiddenGems: [
      {
        name: "Mehtab Bagh at sunset",
        what: "A garden directly across the Yamuna from the Taj. The best free Taj Mahal view.",
        why: "Entry \u20b9300. You get a symmetrical, straight-on Taj view at sunset across the river. Almost no crowds vs the Taj itself.",
        bestTime: "4:30\u20136 PM",
      },
      {
        name: "Itimad-ud-Daulah (Baby Taj)",
        what: "The mausoleum that inspired the Taj. Smaller, more intricate marble work, built 12 years before the Taj.",
        why: "Most tourists skip it. You\u2019ll have it almost to yourself. Entry \u20b9310.",
        bestTime: "Morning",
      },
      {
        name: "Agra Fort inner chambers",
        what: "Most visitors walk through quickly. The Musamman Burj (octagonal tower) is where Shah Jahan was imprisoned and died looking at the Taj.",
        why: "The most emotional spot in Agra. Deeply moving if you know the story.",
      },
    ],
    avoid: [
      "Guides at Taj Mahal eastern gate who aren\u2019t wearing official ASI badges. They\u2019ll overcharge and give wrong info.",
      "Sunrise Taj visit if you\u2019re not a morning person \u2014 the light is actually better in the final 2 hours before sunset.",
      "Restaurants directly facing the Taj. They\u2019re overpriced by 3x. Walk one lane back.",
    ],
    timingTips: [
      {
        activity: "Taj Mahal entry",
        bestTime: "First 30 mins after opening (6 AM) or 1 hour before closing",
        avoidTime: "10 AM\u20132 PM (maximum crowds, harsh light for photos)",
        tip: "Entry: \u20b91,100 for foreigners. Indians: \u20b950 + \u20b9200 for main mausoleum entry. Friday closed.",
      },
    ],
    localTransport: "Tuk-tuks and e-rickshaws everywhere. \u20b950\u2013150 per ride. Prepaid taxis from Agra Cantt station to Taj: \u20b9300\u2013400. Walking inside Taj Ganj area is easy.",
    knowBeforeYouGo: [
      "Taj Mahal closed on Fridays",
      "No food, drinks, or tripods allowed inside the Taj complex",
      "The Taj looks different at every time of day \u2014 sunrise is pink, sunset is golden, midday is harsh white",
      "Agra is a good 1-night destination. 2 nights if you\u2019re doing Fatehpur Sikri (45 km away, \u20b9600 cab round trip)",
    ],
    stayAreas: [
      { area: "Taj Ganj", why: "Cheapest area, walking distance to Taj. Backpacker vibe.", bestFor: "value" },
      { area: "Near Agra Cantt station", why: "Better hotels, easier transport. 10-15 min cab to Taj.", bestFor: "balanced, comfort" },
    ],
  },

  Jaipur: {
    destination: "Jaipur",
    mustEat: [
      {
        name: "Laxmi Misthan Bhandar (LMB)",
        area: "Johari Bazaar",
        knownFor: "The gold standard Jaipur thali. Dal baati churma, ghewar, traditional Rajasthani sweets. Since 1954.",
        price: "\u20b9250\u2013500",
        tip: "Busy at lunch. Come at 11:30 AM to beat the queue. The ghee on everything is not optional.",
      },
      {
        name: "Rawat Misthan Bhandar",
        area: "Station Road (multiple outlets)",
        knownFor: "Pyaaz kachori for breakfast. Jaipur\u2019s most iconic street food. Crispy, spiced, perfect.",
        price: "\u20b920\u201340",
        tip: "Go to the Station Road original at 9 AM. The kachoris are gone by noon.",
      },
      {
        name: "Tapri Central",
        area: "C-Scheme",
        knownFor: "Rajasthani-style chai and snacks in a garden setup. Great vibe.",
        price: "\u20b960\u2013150",
        tip: "Evening spot. Go after Fort visits for a relaxed chai break.",
      },
    ],
    streetFood: [
      { name: "Pyaaz kachori", area: "Any Rawat outlet or old city stalls", price: "\u20b915\u201330" },
      { name: "Ghewar (seasonal, Aug\u2013Oct)", area: "Johari Bazaar sweets shops", price: "\u20b950\u2013200" },
      { name: "Gatte ki sabzi with missi roti", area: "Old city dhabas", price: "\u20b960\u2013100" },
    ],
    shopping: [
      { what: "Blue pottery", where: "Kripal Kumbh in Bani Park", priceRange: "\u20b9200\u20133,000", tip: "This is the real workshop. Buy direct from the artisan, not touristy Johari Bazaar." },
      { what: "Block-print fabric and suits", where: "Bapu Bazaar", priceRange: "\u20b9200\u20132,500", tip: "Compare across at least 5 shops. Quality varies. Run your thumb across the print \u2014 good block print has slight texture." },
      { what: "Jewellery (kundan, meenakari)", where: "Johari Bazaar", priceRange: "\u20b9500\u201350,000+", tip: "Get a GST bill for anything over \u20b92,000. No bill = no authenticity guarantee." },
    ],
    hiddenGems: [
      {
        name: "Panna Mian Ka Kund (stepwell)",
        what: "An 18th-century stepwell hidden inside a residential alley. Geometric perfection.",
        why: "Almost unknown to tourists. 5-min walk from Amber Fort road. Free, no entry fee.",
        bestTime: "Morning, when light falls into the well",
      },
      {
        name: "Galtaji Temple (Monkey Temple)",
        what: "Ancient temple complex with natural spring-fed kunds, 11 km east of city",
        why: "Hundreds of monkeys, sunrise views over Jaipur, almost no foreign tourists. Trek up for panoramic view.",
        bestTime: "Early morning 7\u20139 AM",
      },
      {
        name: "Amer village walk",
        what: "The village at the base of Amber Fort, below the tourist circuit",
        why: "Real Rajasthani life. Chai stalls, artisans, no tourist pricing. Takes 30 mins to walk through.",
      },
    ],
    avoid: [
      "Elephant rides at Amber Fort. Banned in 2022 but some operators still try. They\u2019re not legal and the animals are mistreated.",
      "\u2018Government-approved\u2019 emporiums near Hawa Mahal. They\u2019re not government-run. Prices are 4x bazaar rates.",
      "Jeep safaris to Amber Fort. The walk up is free, scenic, and takes 15 mins. Save the \u20b9500.",
    ],
    timingTips: [
      {
        activity: "Amber Fort",
        bestTime: "8\u201310 AM (before tour buses arrive)",
        avoidTime: "11 AM\u20132 PM (most crowded, maximum heat)",
        tip: "Entry: \u20b9100 Indians. Light and Sound show in the evening (\u20b9295) is worth it.",
      },
      {
        activity: "Hawa Mahal",
        bestTime: "8\u20139 AM for photos (facing shot from across the road)",
        tip: "Best exterior photo from the rooftop of the Wind View Cafe across the street (\u20b950 chai minimum order).",
      },
    ],
    localTransport: "Ola/Uber works well. Autos for old city (\u20b950\u2013120). The old city is best explored on foot or cycle rickshaw (\u20b9100\u2013200/hour).",
    knowBeforeYouGo: [
      "Composite ticket for 5 forts/monuments valid for 2 days: \u20b9300 Indians. Best value if seeing Amber + Nahargarh + Jantar Mantar.",
      "Best months: Oct\u2013Feb. March onwards gets hot fast. Summer (Apr\u2013Jun) is 40\u201345\u00b0C.",
      "Carry cash for old city markets. Many bazaar stalls don\u2019t accept UPI.",
    ],
    stayAreas: [
      { area: "MI Road / C-Scheme", why: "Central location, good mid-range hotels, easy Uber access.", bestFor: "balanced, comfort" },
      { area: "Old City / Johari Bazaar area", why: "Walking distance to bazaars. Heritage havelis converted to guesthouses.", bestFor: "value, balanced" },
    ],
  },

  Mathura: {
    destination: "Mathura",
    mustEat: [
      {
        name: "Brijwasi Sweets (Original)",
        area: "Near Krishna Janmabhoomi",
        knownFor: "Pedas \u2014 Mathura\u2019s 200-year-old signature sweet. Milk-based, soft, aromatic.",
        price: "\u20b9200\u2013400/kg",
        tip: "The original outlet has a gold star on the box. Beware of copies with similar names. Buy here, not at station stalls.",
      },
      {
        name: "Shri Ram Meva Wale",
        area: "Holi Gate chowk",
        knownFor: "Dry fruits and kesar peda combined. The best combo peda you\u2019ll eat.",
        price: "\u20b9300\u2013600/kg",
      },
    ],
    streetFood: [
      { name: "Chaat at Vrindavan road stalls", area: "Near ISKCON temple gate", price: "\u20b920\u201350" },
      { name: "Rabri and jalebi", area: "Old city area near Dwarkadhish temple", price: "\u20b930\u201370" },
    ],
    shopping: [
      { what: "Mathura peda (sweets)", where: "Brijwasi, Madanlal, Vishwanath Sweets", priceRange: "\u20b9200\u2013600/kg", tip: "Best bought on departure. Pack in the box they provide \u2014 stays fresh 2\u20133 days." },
    ],
    hiddenGems: [
      {
        name: "Vishram Ghat at dawn",
        what: "The most sacred ghat in Mathura. Where Krishna rested after killing Kansa.",
        why: "Pre-6 AM, it\u2019s just devotees bathing, priests chanting, and absolute peace. By 9 AM it\u2019s crowded.",
        bestTime: "5:30\u20136:30 AM",
      },
      {
        name: "Kans Qila (Kansa\u2019s Fort ruins)",
        what: "Archaeological ruins of the fort where Kansa ruled. Overlooking the Yamuna.",
        why: "Almost no tourists. The view of the river from the ruins is excellent. Entry free.",
      },
    ],
    avoid: [
      "Auto drivers who offer to take you on a \u201880 temple tour\u2019. They earn commission from shops. Only go to temples you actually want to see.",
    ],
    timingTips: [
      {
        activity: "Krishna Janmabhoomi darshan",
        bestTime: "6\u20138 AM",
        avoidTime: "Janmashtami (August) \u2014 millions of pilgrims, genuine crowd crush",
        tip: "Security is strict. No bags or electronics inside.",
      },
    ],
    localTransport: "Tempo (shared minivan) covers most routes for \u20b910\u201320. E-rickshaws everywhere. Mathura to Vrindavan: \u20b930\u201350 shared tempo.",
    knowBeforeYouGo: [
      "Mathura and Vrindavan are 15 km apart. Both are day trips from each other.",
      "Dress modestly. This is the most sacred Krishna pilgrimage city.",
      "Holi here (Phalguna, Feb\u2013Mar) is the most famous in India. Book 3+ months ahead if visiting during Holi.",
    ],
    stayAreas: [
      { area: "Near Vishram Ghat", why: "Walking distance to main temples. Basic guesthouses.", bestFor: "value" },
      { area: "Vrindavan (if combining)", why: "More peaceful, better mid-range options, ashram stays available.", bestFor: "balanced, comfort" },
    ],
  },

  Orchha: {
    destination: "Orchha",
    mustEat: [
      {
        name: "Betwa Retreat Restaurant",
        area: "Near Betwa river, main road",
        knownFor: "MP-style dal bafla (Bundelkhandi version of dal baati), proper home cooking.",
        price: "\u20b9150\u2013300",
      },
      {
        name: "Local dhabas near Ram Raja Temple",
        area: "Temple square",
        knownFor: "Poha and jalebi for breakfast. Simple, fresh, exactly what you need before a full day of exploration.",
        price: "\u20b920\u201360",
      },
    ],
    streetFood: [
      { name: "Bhutte (roasted corn) stalls", area: "By the Betwa river", price: "\u20b915\u201325" },
    ],
    shopping: [
      { what: "Chanderi sarees and stoles (from Chanderi, 60 km away)", where: "Small textile shops near main market", priceRange: "\u20b9400\u20134,000" },
    ],
    hiddenGems: [
      {
        name: "Chaturbhuj Temple at sunrise",
        what: "A massive 16th-century temple that looks like a Rajput fort. Intricate carved interior.",
        why: "Most visitors rush to Ram Raja Temple and skip this. Chaturbhuj is architecturally more impressive and almost always empty.",
        bestTime: "7\u20138 AM before tour groups arrive",
      },
      {
        name: "Cenotaphs (Chhatris) on Betwa bank",
        what: "14 ornate royal cenotaphs on the banks of the Betwa river. Built for Orchha\u2019s rulers.",
        why: "The setting is extraordinary \u2014 medieval stone pavilions reflected in the river with vultures circling. Almost no visitors ever.",
        bestTime: "Late afternoon (4\u20136 PM) for best light",
      },
      {
        name: "Orchha Wildlife Sanctuary walk",
        what: "A forest walk along the Betwa through the bird sanctuary",
        why: "Orchha is a famous birding destination. 200+ species. Vultures, kingfishers, Indian skimmer on the river.",
        bestTime: "Early morning 6\u20138 AM",
      },
    ],
    avoid: [
      "MP Tourism hotel near fort: overpriced for what it is. Better private guesthouses exist at half the price.",
      "Horse rides to the fort. The walk (15 mins) is more rewarding and free.",
    ],
    timingTips: [
      {
        activity: "Jehangir Mahal",
        bestTime: "Early morning or late afternoon (stunning light on the sandstone)",
        tip: "Entry: \u20b925. Composite ticket for all Orchha monuments: \u20b9250. The palace interior is enormous \u2014 budget 2 hours.",
      },
      {
        activity: "Ram Raja Temple",
        bestTime: "Aarti times: 8 AM, 12 PM, 8 PM",
        tip: "The only temple in India where Ram is worshipped as a king (not a deity). Armed guards stand outside \u2014 that\u2019s the tradition.",
      },
    ],
    localTransport: "Orchha village is tiny \u2014 everything is walkable or a short cycle ride. Hire a cycle (\u20b950/day) to cover the fort, temples, and cenotaphs.",
    knowBeforeYouGo: [
      "Orchha is only 16 km from Jhansi (the nearest railway station). Shared autos to Jhansi: \u20b940.",
      "Extremely low-key, peaceful destination. 1 full day is enough, 2 nights ideal.",
      "Best months: Oct\u2013Mar. Summer is hot. Monsoon makes the Betwa rise dramatically but the scenery is lush.",
    ],
    stayAreas: [
      { area: "Ram Raja Temple area / village center", why: "Walking distance to everything. Local guesthouses with character.", bestFor: "value, balanced" },
    ],
  },

  Ujjain: {
    destination: "Ujjain",
    mustEat: [
      {
        name: "Shri Ram Namkeen Wale",
        area: "Near Mahakaleshwar Temple, Freeganj road",
        knownFor: "Dal moth, chakli, and khasta namkeen. MP\u2019s finest savoury snacks.",
        price: "\u20b9100\u2013300/kg",
        tip: "Best place to buy for the journey back. Stays fresh for a week.",
      },
      {
        name: "Mahakal corridor dhabas",
        area: "New Mahakal corridor (behind the temple)",
        knownFor: "Poha, jalebi, and kadhi-rice. Ujjain-style breakfast.",
        price: "\u20b930\u201370",
      },
    ],
    streetFood: [
      { name: "Johri ki dahi vada", area: "Near Ram Ghat", price: "\u20b920\u201340", tip: "Ujjain\u2019s street food claim to fame. Served cold with tamarind chutney." },
      { name: "Sabudana khichdi", area: "Near ghats during fasting days (Mondays, Ekadashi)", price: "\u20b920\u201350" },
    ],
    shopping: [
      { what: "Mahakal prasad (sindoor, holy ash, rudraksh)", where: "Temple-run counters only", priceRange: "\u20b950\u2013500", tip: "Only buy prasad from INSIDE the temple complex. Outside sellers sell counterfeits." },
    ],
    hiddenGems: [
      {
        name: "Kal Bhairav Temple",
        what: "One of the eight Bhairavas of Shiva. The deity here drinks alcohol \u2014 devotees offer whiskey.",
        why: "One of the most unique religious experiences in India. The deity\u2019s mouth literally consumes the liquor. Unexplained, uncontested.",
        bestTime: "Evening",
      },
      {
        name: "Ram Ghat at dusk",
        what: "The main ghat on the Shipra river. The daily aarti at 7 PM is small but deeply authentic.",
        why: "Unlike the commercialised Varanasi aarti, this feels genuinely devotional. Stand on the ghats as the sky turns orange and the lamps light up.",
        bestTime: "6:30\u20137:30 PM",
      },
    ],
    avoid: [
      "Mahakaleshwar darshan without booking online. Walk-in queue on normal days: 4\u20136 hours. Book on the MP tourism portal for \u20b9250 fast-track.",
    ],
    timingTips: [
      {
        activity: "Mahakaleshwar Bhasma Aarti",
        bestTime: "4 AM (extremely early, deeply powerful experience)",
        tip: "Pre-booking mandatory. Available on mahakaleshwar.org or MP Tourism app. Only ~500 spots. Book 2 weeks ahead.",
      },
    ],
    localTransport: "E-rickshaws: \u20b910\u201330. City is manageable. From Indore: trains take 50 mins (\u20b960\u2013180), buses take 1.5 hours.",
    knowBeforeYouGo: [
      "Ujjain is only 55 km from Indore \u2014 ideal as a 1-night spiritual getaway",
      "Kumbh Mela happens here every 12 years (next: 2028). Simhastha Kumbh: stay away if you don\u2019t like massive crowds",
      "Dress code applies at Mahakaleshwar \u2014 traditional Indian attire preferred for Bhasma Aarti",
    ],
    stayAreas: [
      { area: "Near Ram Ghat / Mahakal area", why: "Walking distance to both main attractions.", bestFor: "value, balanced" },
    ],
  },

  Pushkar: {
    destination: "Pushkar",
    mustEat: [
      {
        name: "Om Shiv Cafe",
        area: "Main bazaar road",
        knownFor: "Malpua \u2014 Pushkar\u2019s signature sweet. A thick, syrup-soaked pancake. Absolutely divine.",
        price: "\u20b940\u201380",
        tip: "Have it warm, just out of the oil. With rabri. That\u2019s the combination.",
      },
      {
        name: "Honey Dew Cafe",
        area: "Near Pushkar Lake",
        knownFor: "Rooftop Brahma Temple views, fresh juices, Israeli-influenced menu.",
        price: "\u20b9100\u2013250",
      },
    ],
    streetFood: [
      { name: "Malpua from roadside stalls", area: "Main bazaar, multiple stalls", price: "\u20b930\u201360" },
      { name: "Lassi with rose petals", area: "Near Brahma Ghat", price: "\u20b960\u2013100" },
    ],
    shopping: [
      { what: "Tie-dye and embroidered textiles", where: "Main bazaar", priceRange: "\u20b9200\u20132,000" },
      { what: "Camel leather goods", where: "Pushkar Camel Fair ground shops", priceRange: "\u20b9300\u20132,000", tip: "Best quality during and just after the Camel Fair (November)." },
    ],
    hiddenGems: [
      {
        name: "Savitri Mata Temple (hilltop)",
        what: "A 2 km hike up to a temple with a 360-degree panoramic view of Pushkar lake and desert",
        why: "Cable car available (\u20b9108 return) or 45-min trek. The sunrise/sunset view is extraordinary.",
        bestTime: "Sunrise or 1 hour before sunset",
      },
      {
        name: "Pushkar Lake at dusk (non-touristy ghat)",
        what: "Skip the main Brahma Ghat (crowded, pushy priests). Walk north to the quieter ghats.",
        why: "You can sit by the lake in peace. No one will demand a puja payment. Sacred and serene.",
        bestTime: "5:30\u20136:30 PM",
      },
    ],
    avoid: [
      "Priests at main ghats who offer a \u2018free\u2019 puja then demand \u20b92,000+. It\u2019s a well-known scam. Politely decline any unsolicited puja offer.",
      "Camel rides quoted at \u20b91,500. Fair rate: \u20b9300\u2013500 for a 30-min ride.",
    ],
    timingTips: [
      {
        activity: "Brahma Temple (one of only 3 in the world)",
        bestTime: "Early morning 7\u20139 AM",
        avoidTime: "Pushkar Camel Fair week (Nov) \u2014 temple is extremely crowded but the Fair itself is spectacular",
      },
    ],
    localTransport: "Pushkar is walkable (2 km across). Bicycles rent for \u20b9100/day. From Ajmer: 15 km, shared jeep \u20b920, taxi \u20b9200.",
    knowBeforeYouGo: [
      "One of the world\u2019s few Brahma temples \u2014 remove shoes and cover head inside",
      "No alcohol or meat in the entire town (strict enforcement)",
      "Pushkar Camel Fair (Kartik Purnima, Oct\u2013Nov) is one of the world\u2019s largest livestock fairs. Incredible if you can book accommodation 3+ months ahead.",
      "Aggressive puja tout at lakeside is Pushkar\u2019s biggest annoyance. Just say \u201cno thank you\u201d and walk away firmly.",
    ],
    stayAreas: [
      { area: "Main bazaar area", why: "Center of the action. Budget guesthouses everywhere.", bestFor: "value" },
      { area: "Near Pushkar Lake (south side)", why: "Quieter, more atmosphere. Lake-view rooms.", bestFor: "balanced, comfort" },
    ],
  },

  Bodh_Gaya: {
    destination: "Bodh Gaya",
    mustEat: [
      {
        name: "Mohammed Restaurant",
        area: "Main road near Mahabodhi Temple",
        knownFor: "The only proper non-veg eatery near the temples. Mixed Indian menu.",
        price: "\u20b9100\u2013200",
      },
      {
        name: "Tibetan restaurant row",
        area: "Near the Thai and Tibetan monasteries",
        knownFor: "Thupka (Tibetan noodle soup), momos, butter tea. Authentic refugee community cooking.",
        price: "\u20b980\u2013180",
        tip: "The Tibetan settlement has 3-4 small restaurants that are genuinely good and cheap.",
      },
    ],
    streetFood: [
      { name: "Sattu paratha", area: "Small dhabas near Bihar State Tourism office", price: "\u20b930\u201360", tip: "Sattu (roasted gram flour) is Bihar\u2019s superfood. The paratha version is filling and energising." },
    ],
    shopping: [
      { what: "Tibetan Buddhist items (singing bowls, thangkas, prayer flags)", where: "Shops near Mahabodhi Temple", priceRange: "\u20b9200\u201310,000+" },
    ],
    hiddenGems: [
      {
        name: "Meditation under the Bodhi Tree",
        what: "The actual Peepal tree (5th generation descendant) under which the Buddha attained enlightenment",
        why: "You can meditate here for free. In the evening, monks from 15 countries chant together. The collective energy is indescribable.",
        bestTime: "5 PM\u20137 PM, after the day crowds thin out",
      },
      {
        name: "Muchalinda Lake",
        what: "A small meditation pond behind Mahabodhi Temple with the famous Buddha statue in the middle of the lake",
        why: "Quiet, beautiful, almost no visitors after 4 PM.",
      },
    ],
    avoid: [
      "Touts offering \u2018special private meditation sessions\u2019 inside the temple for money. Temple meditation is free and open.",
    ],
    timingTips: [
      {
        activity: "Mahabodhi Temple darshan",
        bestTime: "Early morning 5\u20137 AM (monks are doing kora/circumambulation)",
        avoidTime: "Buddha Purnima (May) \u2014 lakhs of pilgrims, temple is overwhelmed",
        tip: "Entry free for Indians. The atmosphere at dawn with chanting monks is transformative.",
      },
    ],
    localTransport: "Bodh Gaya is small \u2014 cycle-rickshaws and e-rickshaws everywhere. Gaya city (nearest railway station) is 16 km away. Shared auto: \u20b930.",
    knowBeforeYouGo: [
      "Remove shoes everywhere inside the Mahabodhi complex",
      "Bodh Gaya is one of the 4 most sacred Buddhist sites on Earth. Treat it with corresponding respect.",
      "Best months: Oct\u2013Feb. November\u2013January sees international Buddhist delegations from Japan, Korea, Sri Lanka, Thailand.",
    ],
    stayAreas: [
      { area: "Main Bodh Gaya village (near temple)", why: "Walking distance to everything. Budget guesthouses and monastery guesthouses.", bestFor: "value, balanced" },
    ],
  },

  Rajgir: {
    destination: "Rajgir",
    mustEat: [
      {
        name: "Bihar Tourism Restaurant",
        area: "Near the ropeway",
        knownFor: "Litti chokha, sattu drinks, standard Bihar thali.",
        price: "\u20b9100\u2013200",
      },
    ],
    streetFood: [
      { name: "Litti chokha from roadside stalls", area: "Near bus stand", price: "\u20b930\u201370" },
    ],
    shopping: [],
    hiddenGems: [
      {
        name: "Bimbisara\u2019s Prison",
        what: "Archaeological ruins where King Bimbisara (Buddha\u2019s patron) was imprisoned by his own son",
        why: "One of the most historically significant and completely uncrowded sites in Bihar. Free entry. You\u2019ll have it to yourself.",
      },
    ],
    avoid: [
      "Rope-way on crowded weekends \u2014 queue can be 2+ hours. Go on weekday.",
    ],
    timingTips: [
      { activity: "Vishwa Shanti Stupa (Peace Pagoda)", bestTime: "Morning for the ropeway + views", tip: "Take the ropeway up (\u20b960), walk down through the forest. The panoramic view of Rajgir valley is excellent." },
    ],
    localTransport: "Very small town. Shared autos \u20b910\u201320. From Nalanda (ruins): 12 km shared jeep \u20b920.",
    knowBeforeYouGo: [
      "Rajgir hot springs are within the town \u2014 a dip in Brahma Kund is traditional",
      "Combine with Nalanda (12 km) for a full historical day trip from Patna",
    ],
    stayAreas: [
      { area: "Near Rajgir bus stand / Bihar Tourism hotel area", why: "Compact town, all options within 1 km.", bestFor: "value, balanced" },
    ],
  },

  Pachmarhi: {
    destination: "Pachmarhi",
    mustEat: [
      { name: "MP Tourism Café", area: "Near bus stand", knownFor: "MP thali and fresh forest mushrooms in season", price: "\u20b9120\u2013250" },
    ],
    streetFood: [
      { name: "Chaat at evening market", area: "Main bazaar", price: "\u20b920\u201350" },
    ],
    shopping: [
      { what: "Tribal jewellery and bamboo crafts", where: "Tribal craft market near bus stand", priceRange: "\u20b9100\u20131,000" },
    ],
    hiddenGems: [
      {
        name: "Jata Shankar Caves",
        what: "Natural rock formations inside a gorge that resemble Shiva\u2019s matted locks. A cave Shiva temple.",
        why: "Less visited than Bee Falls but more atmospheric. The gorge walk is stunning.",
        bestTime: "Morning",
      },
      {
        name: "Handi Khoh viewpoint",
        what: "A 300-foot deep gorge in dense forest. Dramatic and savage.",
        why: "Often skipped by day-trippers. 30-min walk from road. The silence and scale are extraordinary.",
      },
    ],
    avoid: [
      "MP Tourism jeep tours that rush through all sites in 4 hours. Hire a jeep independently and set your own pace (\u20b9800\u20131,200 for a full day).",
    ],
    timingTips: [
      { activity: "Bee Falls / Apsara Vihar", bestTime: "Morning 8\u201310 AM before day-trippers from Pipariya arrive", tip: "Entry fees apply for each waterfall area (\u20b920\u201350). Carry footwear you can get wet." },
    ],
    localTransport: "Jeep hire is the only way around Pachmarhi \u2014 attractions are spread 5\u201315 km apart. Negotiate for a full-day jeep (\u20b9800\u20131,200 for 6\u20138 sites).",
    knowBeforeYouGo: [
      "Only hill station in Madhya Pradesh. Altitude: 1,067m. Significantly cooler than Bhopal/Nagpur.",
      "Entry gate fee for Satpura National Park: \u20b950. Required before entering the main areas.",
      "Best months: Oct\u2013Jun. Avoid monsoon (Jul\u2013Sep) \u2014 many sites closed due to waterlogging.",
    ],
    stayAreas: [
      { area: "Main Pachmarhi town", why: "All hotels within walking distance of bus stand. Easy to get jeeps.", bestFor: "value, balanced, comfort" },
    ],
  },

  Ranthambore: {
    destination: "Ranthambore",
    mustEat: [
      { name: "Aman-i-Khas dining or Sher Bagh", area: "Resort area", knownFor: "Camp-style dinner under the stars. Rajasthani cuisine with forest ambience.", price: "\u20b91,500\u20133,000 (resort dining)" },
      { name: "Local dhabas on Ranthambore road", area: "Near park gate", knownFor: "Dal baati churma and laal maas. Basic but authentic.", price: "\u20b9100\u2013200" },
    ],
    streetFood: [],
    shopping: [
      { what: "Tiger-themed art prints and postcards", where: "Shops near Zone 1 gate", priceRange: "\u20b950\u2013500" },
    ],
    hiddenGems: [
      {
        name: "Ranthambore Fort",
        what: "A UNESCO-listed fort INSIDE the tiger reserve. Dating back to the 10th century.",
        why: "You can see the fort on your safari drive. It\u2019s haunting \u2014 ancient ruins surrounded by jungle with possible wildlife nearby.",
        bestTime: "Zone 4-5 safari which passes near the fort",
      },
    ],
    avoid: [
      "Zone booking without research. Zones 1-5 are the core zones with higher tiger sighting probability. Zones 6-10 are buffer zones \u2014 cheaper but much lower sighting chances.",
      "Buying safari tickets from touts near the gate. Book on rajasthan.gov.in/forest officially.",
    ],
    timingTips: [
      { activity: "Tiger safari", bestTime: "Morning safari (6 AM, Oct\u2013Mar) has highest sighting probability", tip: "Canters (shared) are cheaper (\u20b9700\u2013900) but gypsies (private jeep, \u20b91,500\u20132,500) give better access and are worth the upgrade." },
    ],
    localTransport: "Sawai Madhopur town is 12 km from the park gate. Autos available. Book accommodation near the gate zone to save on daily transport.",
    knowBeforeYouGo: [
      "Tiger sighting is never guaranteed. Probability in core zones: ~70-80% per safari in peak season (Nov\u2013Mar).",
      "Safari slots must be booked online in advance. Very popular on weekends \u2014 book 2+ weeks ahead.",
      "Park closed during monsoon (Jul\u2013Sep 30). Open Oct 1 onwards.",
    ],
    stayAreas: [
      { area: "Near Zone 1-3 gate area", why: "Most convenient for multiple safaris. Budget to luxury options.", bestFor: "value, balanced, comfort" },
    ],
  },

  Delhi: {
    destination: "Delhi",
    mustEat: [
      {
        name: "Paranthe Wali Gali",
        area: "Chandni Chowk, Old Delhi",
        knownFor: "200-year-old lane with shops serving 50+ varieties of stuffed paranthas. With all the chutneys.",
        price: "\u20b9120\u2013250",
        tip: "Go to the oldest shops (Gaya Prasad, Kanhaiyalal). Reach before noon or expect a queue.",
      },
      {
        name: "Karim\u2019s",
        area: "Gali Kababian, near Jama Masjid, Old Delhi",
        knownFor: "Mughal cuisine since 1913. Nihari, mutton korma, seekh kebabs. The real deal.",
        price: "\u20b9200\u2013400",
        tip: "Open for lunch from 12 PM. Go for the nihari if it\u2019s a Saturday \u2014 slow-cooked overnight.",
      },
      {
        name: "Sita Ram Diwan Chand",
        area: "Paharganj / Chuna Mandi",
        knownFor: "The best chole bhature in Delhi. Since 1950s. Cash only, closes by 1 PM.",
        price: "\u20b960\u2013120",
        tip: "This is a morning food. They sell out by 1 PM. Don\u2019t eat at 8 PM and expect it to still be there.",
      },
    ],
    streetFood: [
      { name: "Chole kulche from carts", area: "Near Jama Masjid, Connaught Place periphery", price: "\u20b930\u201360" },
      { name: "Daulat ki chaat (winter only, Nov\u2013Feb)", area: "Old Delhi mornings only", price: "\u20b920\u201340", tip: "A cloud-like milk foam dessert. Evaporates in sunlight. Only exists in cold months." },
    ],
    shopping: [
      { what: "Everything at Sarojini Nagar market", where: "South Delhi", priceRange: "\u20b9100\u20131,000", tip: "Export overruns and branded surplus. Come with patience and low expectations \u2014 then be pleasantly surprised." },
      { what: "Dilli Haat crafts from all states", where: "INA, South Delhi (entry \u20b9100)", priceRange: "\u20b9200\u201310,000+", tip: "Fixed price, authentic crafts. Worth the entry fee just to browse." },
    ],
    hiddenGems: [
      {
        name: "Lodhi Art District (outdoor murals)",
        what: "A full residential area in South Delhi converted into an outdoor art gallery. 50+ murals by international artists.",
        why: "Free, walkable, extraordinary. Most visitors to Delhi completely miss this.",
        bestTime: "Morning or golden hour",
      },
      {
        name: "Agrasen Ki Baoli (stepwell)",
        what: "A 60-step ancient stepwell in the middle of Connaught Place. UNESCO listed.",
        why: "Free entry. Eerie, beautiful, and somehow sitting between office buildings. Takes 20 mins, worth every minute.",
        bestTime: "Weekday morning",
      },
    ],
    avoid: [
      "Auto-rickshaws that \u2018don\u2019t use meters\u2019 near tourist spots. Use Ola/Uber always \u2014 autos are a scam for tourists in Delhi.",
      "Tourist traps near India Gate selling overpriced souvenirs. Same items available at Dilli Haat for fair prices.",
    ],
    timingTips: [
      { activity: "Chandni Chowk food walk", bestTime: "10 AM\u20131 PM (before afternoon heat and crowds)", tip: "Walk from Red Fort end towards Fatehpuri Mosque. Every 20 metres is a different speciality." },
      { activity: "Qutub Minar", bestTime: "8\u2013930 AM for empty foreground shots", tip: "Entry \u20b940 Indians. The light at opening time on the red sandstone is unbeatable." },
    ],
    localTransport: "Delhi Metro is the answer to everything. Day pass: \u20b9100. Ola/Uber for late nights and luggage. Auto only if you love negotiating.",
    knowBeforeYouGo: [
      "Delhi is vast \u2014 pick 1 zone per day (Old Delhi, Central Delhi, South Delhi, Lutyens\u2019 zone). Don\u2019t try to cover everything in 2 days.",
      "Best months: Oct\u2013Feb. Summer (Apr\u2013Jun) is brutal (40\u201345\u00b0C). Monsoon is actually beautiful but humid.",
      "Pollution peaks Nov\u2013Dec. Carry a mask if sensitive to air quality.",
    ],
    stayAreas: [
      { area: "Paharganj (near New Delhi station)", why: "Budget central. Close to metro. Backpacker vibe.", bestFor: "value" },
      { area: "Karol Bagh", why: "Good mid-range options, market access, well-connected metro.", bestFor: "balanced" },
      { area: "Connaught Place / South Delhi", why: "Best location, premium hotels, quieter nights.", bestFor: "comfort" },
    ],
  },

};

// ── Lookup function ───────────────────────────────────────────────────────────

export function getLocalIntelligence(destination: string): LocalIntelligence | null {
  // Normalize key (handle spaces and special chars)
  const key = destination.replace(/\s+/g, "_").replace(/-/g, "_");
  return LOCAL_INTEL[key] ?? LOCAL_INTEL[destination] ?? null;
}

export { LOCAL_INTEL };
