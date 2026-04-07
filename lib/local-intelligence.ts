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
        activity: "Lakshman Jhula area",
        bestTime: "Early morning 6\u20138 AM or evening 5\u20137 PM",
        tip: "The original iron suspension bridge was closed in 2020 and demolished. The locality and cafes still exist. Use the new footbridge nearby or Ram Jhula (2 km south).",
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
        what: "A garden directly across the Yamuna from the Taj. The best Taj Mahal view for a fraction of the cost.",
        why: "Entry \u20b930 (Indians). You get a symmetrical, straight-on Taj view at sunset across the river. Almost no crowds vs the Taj itself.",
        bestTime: "4:30\u20136 PM",
      },
      {
        name: "Itimad-ud-Daulah (Baby Taj)",
        what: "The mausoleum that inspired the Taj. Smaller, more intricate marble work, built 12 years before the Taj.",
        why: "Most tourists skip it. You\u2019ll have it almost to yourself. Entry \u20b930 (Indians).",
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
      "Elephant rides at Amber Fort. Legally contested since 2019 with multiple court orders — avoid them regardless of current status. The animals are mistreated and the practice is ethically problematic.",
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
      "Buying safari tickets from touts near the gate. Book on rajasthanwildlife.in officially.",
    ],
    timingTips: [
      { activity: "Tiger safari", bestTime: "Morning safari (6 AM, Oct\u2013Mar) has highest sighting probability", tip: "Canters (shared) are cheaper (\u20b9700\u2013900) but gypsies (private jeep, \u20b91,500\u20132,500) give better access and are worth the upgrade." },
    ],
    localTransport: "Sawai Madhopur town is 12 km from the park gate. Autos available. Book accommodation near the gate zone to save on daily transport.",
    knowBeforeYouGo: [
      "Tiger sighting is never guaranteed. Probability in core zones: ~50-60% per safari in peak season (Nov\u2013Mar). Never let anyone promise you a sighting.",
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
        what: "A 60-step ancient stepwell in the middle of Connaught Place. ASI-protected monument.",
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
    localTransport: "Delhi Metro is the answer to everything. 1-day Tourist Card: \u20b9200 (unlimited rides). Ola/Uber for late nights and luggage. Auto only if you love negotiating.",
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

  // ── North India Expansion ─────────────────────────────────────────────────────

  Amritsar: {
    destination: "Amritsar",
    mustEat: [
      {
        name: "Kesar Da Dhaba",
        area: "Shastri Market, near Town Hall",
        knownFor: "Dal makhani slow-cooked since 1916 in a century-old cauldron. Arguably India\u2019s best.",
        price: "\u20b9150\u2013300",
        tip: "Order the dal makhani and paneer bhurji. The original location in Shastri Market only.",
      },
      {
        name: "Kulcha Land (Surjit Food Plaza)",
        area: "Lawrence Road",
        knownFor: "Amritsari kulcha \u2014 stuffed tandoor flatbread with chana, the definitive breakfast.",
        price: "\u20b980\u2013150",
        tip: "Two kulchas + chana + lassi. Eat by 9 AM before the lunch rush.",
      },
      {
        name: "Golden Temple Langar",
        area: "Inside Harmandir Sahib complex",
        knownFor: "Free community kitchen serving 100,000 meals daily. Dal, rice, roti, kheer. Open 24 hours.",
        price: "Free",
        tip: "Sit in the langar hall, not outside. The experience of eating shoulder-to-shoulder with pilgrims is the point.",
      },
    ],
    streetFood: [
      { name: "Amritsari fish fry", area: "Near Golden Temple and Hall Bazaar", price: "\u20b9100\u2013200", tip: "Fish tikka and amritsari macchi. The batter is carom-seed spiced." },
      { name: "Lassi at Gian da Dhaba", area: "Near Jallianwala Bagh", price: "\u20b960\u2013120", tip: "Thick, full-fat, topped with cream. A meal in a glass." },
      { name: "Pinni (winter only)", area: "Sweets shops in Hall Bazaar", price: "\u20b940\u201380 per piece" },
    ],
    shopping: [
      { what: "Phulkari embroidery (dupatta, suit sets)", where: "Hall Bazaar and Katra Jaimal Singh market", priceRange: "\u20b9500\u20135,000", tip: "Genuine phulkari has dense hand-embroidery on both sides. Machine copies look identical from one side only." },
      { what: "Walnuts and dry fruits (Kashmiri origin)", where: "Near Golden Temple, bazaar lanes", priceRange: "\u20b9300\u20131,000/kg" },
      { what: "Brass and copper religious items", where: "Inside Golden Temple complex", priceRange: "\u20b9200\u20132,000" },
    ],
    hiddenGems: [
      {
        name: "Golden Temple at 4 AM",
        what: "The sacred pool and marble glow under floodlights, almost zero crowds, morning kirtan resonating",
        why: "Most visitors come 9 AM\u20136 PM. The 4 AM atmosphere is transformative \u2014 monks bathing, kirtan live, the marble cool underfoot.",
        bestTime: "4:00\u20135:30 AM",
      },
      {
        name: "Partition Museum",
        what: "South Asia\u2019s first museum dedicated to the 1947 Partition",
        why: "Deeply moving oral histories, photographs, and objects. Entirely missed by most day-trippers. Arguably the most important museum in India.",
        bestTime: "Morning, allow 2 hours",
      },
      {
        name: "Wagah Border closing ceremony front row",
        what: "Arrive 2 hours before the 5 PM ceremony for a seat in the covered grandstand",
        why: "The bleating ceremony is theatrical and nationalistic. The front row gives you the best view of the synchronized drill. From the back it\u2019s a crowd.",
        bestTime: "Arrive 3 PM, ceremony 5 PM (winter 4 PM)",
      },
    ],
    avoid: [
      "Guides at Golden Temple who insist entry is paid. Entry is always free. No guide is needed.",
      "Restaurants immediately outside the Golden Temple gate. Walk 5 minutes to Hall Bazaar for 50% better food at 30% lower prices.",
      "Jallianwala Bagh souvenir shops inside the memorial. Buy nothing there.",
    ],
    timingTips: [
      {
        activity: "Golden Temple darshan",
        bestTime: "4\u20136 AM or after 9 PM",
        avoidTime: "10 AM\u20132 PM (peak crowd, 1+ hour queue for inner sanctum)",
        tip: "Remove shoes at the entrance. Wash feet in the foot bath. Cover head (cloth provided free). No photography of worshippers at prayer.",
      },
      {
        activity: "Wagah Border ceremony",
        bestTime: "5 PM (summer) / 4 PM (winter)",
        tip: "Private vehicles can\u2019t go beyond Attari. Take a cab to Wagah. Seats fill 2 hours early. VIP viewing available via Attari border authority for groups.",
      },
    ],
    localTransport: "Auto-rickshaws everywhere, \u20b950\u2013120 per ride. Cycle rickshaws in the old city lanes (narrow for autos). Golden Temple to Wagah Border: cab/auto \u20b9400\u2013600 return. Jallianwala Bagh: 5-min walk from Golden Temple.",
    knowBeforeYouGo: [
      "No alcohol served near Golden Temple precincts. Amritsar is generally liberal but respect sacred zones.",
      "Cover head and remove shoes at all gurudwaras. Free cloth for head available.",
      "Best months: Oct\u2013Mar. Summer (Apr\u2013Jun) is extremely hot, 40\u201345\u00b0C.",
      "Wagah Border is closed on Indian gazetted holidays. Check before planning.",
      "Amritsari kulcha tastes different here than anywhere else \u2014 the tandoor and the ghee is the secret.",
    ],
    stayAreas: [
      { area: "Near Golden Temple (Golden Temple Road)", why: "Walk to everything. Budget guesthouses and dharamshalas. Pure convenience.", bestFor: "value" },
      { area: "Hall Bazaar area", why: "Central location, near food and shopping. Mid-range hotels.", bestFor: "balanced" },
      { area: "GT Road / Heritage hotels", why: "Boutique heritage properties, quieter nights, 10-min cab to temple.", bestFor: "comfort" },
    ],
  },

  "McLeod Ganj": {
    destination: "McLeod Ganj",
    mustEat: [
      {
        name: "Jimmy\u2019s Kitchen",
        area: "Main square, McLeod Ganj",
        knownFor: "Tibetan thukpa, momos, and Israeli shakshuka. An institution since the 1980s.",
        price: "\u20b9150\u2013350",
        tip: "The beef thukpa is legendary. Vegetarians get the vegetable version which is almost as good.",
      },
      {
        name: "Woeser Tibetan Restaurant",
        area: "Temple Road, near Tsuglagkhang",
        knownFor: "Authentic home-style Tibetan food. Thenthuk (hand-pulled noodle soup), tingmo bread.",
        price: "\u20b9120\u2013280",
      },
      {
        name: "Nick\u2019s Italian Kitchen",
        area: "Bhagsu Road",
        knownFor: "The best pizza in a 500 km radius. Run by the same family for 30+ years.",
        price: "\u20b9200\u2013400",
        tip: "Go for dinner. The wood-fire oven and mountain air make it special.",
      },
    ],
    streetFood: [
      { name: "Steam momos", area: "Any roadside stall", price: "\u20b960\u2013100 for 8 pieces", tip: "Tibetan momos are thicker-skinned than the Indian version. Eat with the red chilli sauce." },
      { name: "Tsampa (roasted barley flour)", area: "Tibetan market near Tsuglagkhang", price: "\u20b930\u201350" },
      { name: "Butter tea (po cha)", area: "Tibetan tea stalls near the monastery", price: "\u20b920\u201340", tip: "Strong, salty, and an acquired taste. Try it once." },
    ],
    shopping: [
      { what: "Tibetan singing bowls and prayer flags", where: "Shops on Temple Road", priceRange: "\u20b9200\u20133,000", tip: "Genuine copper bowls have a warm, sustained resonance. Cheap ones ring briefly." },
      { what: "Thangka paintings (Tibetan Buddhist art)", where: "TIPA and shops near Tsuglagkhang", priceRange: "\u20b9500\u201320,000+", tip: "Ask if hand-painted or printed. Hand-painted takes months, printed takes minutes." },
      { what: "Woollen shawls and mufflers", where: "Kotwali Bazaar, lower Dharamsala", priceRange: "\u20b9300\u20132,500" },
    ],
    hiddenGems: [
      {
        name: "Triund sunrise camp",
        what: "Trek 9 km to Triund (2,875m) and camp overnight to watch the sun rise over the Kangra valley",
        why: "The Dhauladhar range appears at dawn. Guides available (\u20b91,500\u20132,000) but the trail is marked. Most trekkers do it as a 2D/1N.",
        bestTime: "Start at 6 AM, reach by noon, camp overnight",
      },
      {
        name: "Norbulingka Institute",
        what: "Tibetan arts and culture institute 6 km below McLeod Ganj in Sidhpur",
        why: "Beautiful Japanese-style garden, Tibetan crafts workshop, and a temple with original thangka paintings. Almost no tourists. Free entry.",
        bestTime: "Morning 9\u201311 AM",
      },
    ],
    avoid: [
      "Taxis in McLeod Ganj are expensive. Walk everywhere within town (it\u2019s small). Share a jeep for anything beyond.",
      "Trek to Triund without checking weather. Afternoon rain is common June\u2013Sep. Start very early.",
      "Buying trekking gear in McLeod Ganj \u2014 half of it is low quality despite high prices.",
    ],
    timingTips: [
      {
        activity: "Tsuglagkhang Temple",
        bestTime: "Early morning 7\u20139 AM when monks are in prayer",
        tip: "The Dalai Lama gives public teachings (free registration on his website). Check dates \u2014 teaching seasons are March\u2013April and October\u2013November.",
      },
      {
        activity: "Bhagsu Waterfall",
        bestTime: "June\u2013Sep (monsoon) for maximum water flow. Feb\u2013May for clear weather.",
        avoidTime: "Weekends and public holidays \u2014 extremely crowded.",
      },
    ],
    localTransport: "McLeod Ganj is walkable (2 km end to end). Shared jeeps to lower Dharamsala (\u20b930, 15 min). Cab within McLeod: \u20b9100\u2013150. For Triund and Bhagsu: walk or shared jeep (\u20b950\u201380).",
    knowBeforeYouGo: [
      "Cold at night even in summer (12\u201315\u00b0C). Pack a jacket always.",
      "Roads to McLeod Ganj from Pathankot are narrow and scenic but slow. Buses take 3\u20134 hrs.",
      "Best months: March\u2013June, September\u2013November. Monsoon (July\u2013August) brings heavy rain but also greenery.",
      "ATMs available in McLeod Ganj but can run out \u2014 carry cash from Dharamsala or Pathankot.",
    ],
    stayAreas: [
      { area: "Main McLeod Ganj market area", why: "Everything walkable. Lively cafes. Budget to mid-range.", bestFor: "value, balanced" },
      { area: "Bhagsu Road", why: "Quieter, more spacious guesthouses, near the waterfall.", bestFor: "balanced" },
      { area: "Dharamsala lower town", why: "Better roads, larger hotels, 15-min drive up to McLeod.", bestFor: "comfort" },
    ],
  },

  Manali: {
    destination: "Manali",
    mustEat: [
      {
        name: "Drifters\u2019 Inn (Old Manali)",
        area: "Old Manali village",
        knownFor: "The original backpacker café. Israeli breakfast, Himachali trout, homemade pasta. The vibe is the food.",
        price: "\u20b9200\u2013450",
        tip: "Sit on the wooden deck over the Manalsu stream. Order the apple pie.",
      },
      {
        name: "Johnson\u2019s Café",
        area: "Circuit House Road, Manali town",
        knownFor: "Continental and Indian food in a heritage setting. Known for trout dishes and great coffee.",
        price: "\u20b9250\u2013500",
      },
      {
        name: "Café 1947",
        area: "Old Manali",
        knownFor: "Named for independence. Israeli and world food. The roof deck has Rohtang-direction views.",
        price: "\u20b9200\u2013400",
        tip: "Best for a leisurely breakfast or evening dessert. Not the fastest service.",
      },
    ],
    streetFood: [
      { name: "Sidu (local bread with walnut and hemp paste)", area: "Old Manali bakeries", price: "\u20b940\u201380 per piece" },
      { name: "Grilled corn with butter and chilli (monsoon)", area: "Any roadside stall near Hadimba", price: "\u20b920\u201340" },
      { name: "Himachali siddu dhaam (thali)", area: "Local dhabas inside old Manali", price: "\u20b9120\u2013200", tip: "Authentic mountain meal: dham rice, rajma, curd, sweet kheer." },
    ],
    shopping: [
      { what: "Kullu shawls and caps", where: "Manali bazaar and Tibetan market", priceRange: "\u20b9400\u20133,500", tip: "Government Emporium near bus stand has fixed-price genuine Kullu weaves." },
      { what: "Himachali apple products (jam, juice, wine)", where: "Any market in Manali town", priceRange: "\u20b9100\u2013500" },
      { what: "Silver jewellery (Tibetan-style)", where: "Tibetan market near mall road", priceRange: "\u20b9200\u20132,000" },
    ],
    hiddenGems: [
      {
        name: "Jogini Falls trek",
        what: "3 km trek from Old Manali village to a hidden waterfall",
        why: "Almost no tourists take this route. The Jogini Temple en route is an ancient shrine. The waterfall has a natural pool.",
        bestTime: "June\u2013September for maximum flow. Morning 7\u20139 AM.",
      },
      {
        name: "Naggar Castle",
        what: "15th-century stone castle 22 km south of Manali on the opposite bank of the Beas",
        why: "Nicholas Roerich lived here. His art gallery is inside. The view from the castle grounds is the best in the Kullu valley. Almost no crowds.",
        bestTime: "Morning",
      },
    ],
    avoid: [
      "Rohtang Pass taxi mafia. Fixed government rates exist. Book via HRTC or through your hotel. Touts charge 3x.",
      "Hotels on Mall Road in high season (May\u2013June) \u2014 overpriced and noisy. Old Manali is calmer.",
      "ATM queues in Manali can be 45 minutes in peak season. Withdraw cash in Chandigarh or Mandi.",
    ],
    timingTips: [
      {
        activity: "Rohtang Pass",
        bestTime: "May\u2013June and September\u2013October (clear roads)",
        avoidTime: "July\u2013August (rain, mudslides). January\u2013April (closed by snow)",
        tip: "Permits are mandatory and limited. Book online at himachaleco.nic.in 3 days ahead. Taxis charge \u20b91,500\u20132,500 for the day.",
      },
      {
        activity: "Hadimba Temple",
        bestTime: "Early morning 7\u20139 AM",
        avoidTime: "10 AM\u20134 PM on weekends (extremely crowded)",
      },
    ],
    localTransport: "Manali town is walkable. Old Manali is 3 km from the bus stand (auto \u20b960\u2013100). Solang Valley: shared taxi \u20b9100/person or private cab \u20b9800\u20131,200. Bikes on rent in Old Manali: \u20b9400\u2013700/day (good for local area only).",
    knowBeforeYouGo: [
      "Altitude is 2,050m. Some people experience mild headaches on day 1. Rest and hydrate.",
      "Snow on Rohtang is tourist-managed. You\u2019ll be in a queue of hundreds. Manage expectations.",
      "Best months: March\u2013June and September\u2013November. Winter (Dec\u2013Feb) is for snowseekers only.",
      "Power cuts are frequent. Keep a powerbank charged.",
    ],
    stayAreas: [
      { area: "Old Manali village", why: "Backpacker heaven. Best cafes, stream views, chill vibe. Budget to mid-range.", bestFor: "value, balanced" },
      { area: "Manali Mall Road area", why: "Central, convenient, noisy on weekends. All hotel tiers.", bestFor: "balanced" },
      { area: "Aleo / Prini village", why: "Quieter end of town, river views. Resorts and mid-range hotels.", bestFor: "comfort" },
    ],
  },

  Kasol: {
    destination: "Kasol",
    mustEat: [
      {
        name: "Moon Dance Café",
        area: "Main road, Kasol",
        knownFor: "Himachali-Israeli fusion \u2014 shakshuka, hummus, Parvati river views. The quintessential Kasol experience.",
        price: "\u20b9180\u2013350",
        tip: "Arrive for breakfast. The morning light over the Parvati valley from the window seats is stunning.",
      },
      {
        name: "Evergreen Café",
        area: "Chalal village (15-min walk from Kasol)",
        knownFor: "Wood-fire oven pizza and pasta. Completely off-grid feeling on the river bank.",
        price: "\u20b9200\u2013400",
        tip: "Worth the 15-min walk to Chalal. Eat by the river.",
      },
    ],
    streetFood: [
      { name: "Israeli falafel wraps", area: "Multiple stalls near bridge", price: "\u20b9100\u2013180" },
      { name: "Chocolate brownie (magic cafes \u2014 ask carefully)", area: "Kasol lane shops", price: "\u20b960\u2013120", tip: "Kasol is known for this. Only relevant info: some cafes add cannabis. Be very explicit about what you want." },
    ],
    shopping: [
      { what: "Hemp products (bags, clothing, candles)", where: "Main market lane", priceRange: "\u20b9200\u20131,500" },
      { what: "Silver and stone jewellery", where: "Market stalls near bridge", priceRange: "\u20b9100\u20131,000" },
    ],
    hiddenGems: [
      {
        name: "Kheerganga trek hot spring",
        what: "13 km trek through forest and waterfalls to a natural hot spring pool at 2,960m",
        why: "Soaking in a hot spring at altitude with Himalayan peaks around you is genuinely special. The overnight camp under clear skies adds to it.",
        bestTime: "April\u2013June, September\u2013November",
      },
      {
        name: "Tosh village",
        what: "A remote Parvati valley village 20 km past Kasol, reachable by shared jeep",
        why: "Dramatically different landscape \u2014 terraced fields, stone houses, and views into the high Himalayas. Much less commercialised than Kasol.",
        bestTime: "Any clear day",
      },
    ],
    avoid: [
      "Driving to Kasol in a sedan car on a wet day \u2014 the road after Bhuntar is narrow and rough. SUVs handle it better.",
      "Assuming Kasol has ATMs \u2014 there is one but it frequently runs out. Carry cash from Bhuntar or Chandigarh.",
      "Kheerganga in monsoon (July\u2013August) \u2014 trail becomes slippery and dangerous. Stick to Apr\u2013Jun and Sep\u2013Nov.",
    ],
    timingTips: [
      {
        activity: "Kheerganga trek",
        bestTime: "April\u2013June and September\u2013November",
        avoidTime: "July\u2013August (slippery monsoon trail). December\u2013March (heavy snow)",
        tip: "Start by 7 AM from Barshaini (taxi from Kasol \u20b9200/person shared). Reach by 1\u20132 PM, soak, camp or return same day.",
      },
    ],
    localTransport: "Kasol is a 400m strip \u2014 entirely walkable. Shared jeeps to Bhuntar (\u20b950/person). Jeeps to Manikaran (\u20b950, 4 km). Jeeps to Barshaini (Kheerganga trailhead, \u20b9200, 14 km).",
    knowBeforeYouGo: [
      "Kasol is popular among Israeli backpackers. Hebrew menus common.",
      "Altitude is 1,580m. No acclimatisation needed but it gets cold at night.",
      "Dry toilets and basic infrastructure in some guesthouses. Check before booking.",
      "Best months: April\u2013June and September\u2013November.",
    ],
    stayAreas: [
      { area: "Kasol main village", why: "Maximum cafes and convenience. Budget guesthouses.", bestFor: "value" },
      { area: "Chalal village", why: "15 min walk from Kasol. More peaceful, riverside guesthouses.", bestFor: "balanced" },
    ],
  },

  "Bir Billing": {
    destination: "Bir Billing",
    mustEat: [
      {
        name: "Silver Linings Café",
        area: "Near Sherab Ling Monastery, Bir",
        knownFor: "The best café in Bir. Freshly baked bread, Tibetan dishes, post-flight recovery meals.",
        price: "\u20b9150\u2013300",
        tip: "Hang here after paragliding. The monastery views from the terrace are calming after the adrenaline.",
      },
      {
        name: "Himalayan Café",
        area: "Bir landing zone",
        knownFor: "Quick bites at the paragliding landing zone. Thukpa, momos, and chai.",
        price: "\u20b980\u2013200",
      },
    ],
    streetFood: [
      { name: "Tibetan steamed bread (tingmo)", area: "Monastery lane", price: "\u20b920\u201340" },
      { name: "Himachali dham (festive thali)", area: "Local dhabas on weekends", price: "\u20b9120\u2013200" },
    ],
    shopping: [
      { what: "Tibetan handcraft souvenirs from monastery shops", where: "Sherab Ling and Chokling monasteries", priceRange: "\u20b9100\u20131,000" },
    ],
    hiddenGems: [
      {
        name: "Billing meadow (landing site view)",
        what: "The 2,400m Billing plateau where paragliders launch is also a stunning meadow",
        why: "Even if you don\u2019t paraglide, hiring a cab to Billing for the view is worthwhile. 360\u00b0 Himalayas on a clear day.",
        bestTime: "Morning, before haze builds",
      },
    ],
    avoid: [
      "Paragliding operators who don\u2019t show you their certification. Insist on ACRO-certified pilots.",
      "Solo trekking beyond Billing without a guide. Bears and wildlife present.",
    ],
    timingTips: [
      {
        activity: "Paragliding",
        bestTime: "March\u2013May and September\u2013November (clearest skies, best thermals)",
        avoidTime: "Monsoon (July\u2013August) \u2014 no flights",
        tip: "Morning flights 7\u201311 AM have most stable thermals. Book 1 day ahead in season.",
      },
    ],
    localTransport: "Bir is a small village \u2014 walkable. Billing launch site: cab or shared jeep (\u20b9200\u2013300 return, 14 km, 45 min). Bus to Baijnath (8 km) for railway station.",
    knowBeforeYouGo: [
      "Bir sits at 1,400m. No altitude issues.",
      "Paragliding season: March\u2013June and September\u2013November. World Cup held here some years.",
      "Accommodation is basic (Bir is still developing tourist infrastructure). Book ahead in peak season.",
    ],
    stayAreas: [
      { area: "Bir village (Chowgan area)", why: "Near landing zone and monasteries. Budget guesthouses.", bestFor: "value, balanced" },
      { area: "Billing road homestays", why: "Quieter, mountain views, more space.", bestFor: "comfort" },
    ],
  },

  Dalhousie: {
    destination: "Dalhousie",
    mustEat: [
      {
        name: "Kwality Restaurant",
        area: "Subhash Chowk, Dalhousie",
        knownFor: "Himachali trout, rajma-chawal, hot chocolate. Classic hill station comfort food.",
        price: "\u20b9150\u2013300",
      },
      {
        name: "Café Dalhousie",
        area: "Gandhi Chowk",
        knownFor: "Maggi variations, omelettes, and the best views of Dhauladhar from a café deck.",
        price: "\u20b980\u2013200",
        tip: "Sunset here with ginger chai is the quintessential Dalhousie moment.",
      },
    ],
    streetFood: [
      { name: "Dalhousie patties (local version)", area: "Any bakery near Gandhi Chowk", price: "\u20b920\u201340" },
      { name: "Rajma-chawal from any local dhaba", area: "Subhash Chowk area", price: "\u20b960\u2013100" },
    ],
    shopping: [
      { what: "Himachali cap and woollens", where: "Gandhi Chowk market", priceRange: "\u20b9200\u20131,500" },
      { what: "Pine cone craft items (local)", where: "Roadside stalls on Khajjiar road", priceRange: "\u20b950\u2013300" },
    ],
    hiddenGems: [
      {
        name: "Khajjiar meadow early morning",
        what: "A 1 km lake inside a deodar forest in a flat green meadow at 1,920m",
        why: "Called India\u2019s mini-Switzerland. Arrive before 9 AM before the tourist buses. The morning mist over the meadow is magical.",
        bestTime: "7\u20139 AM",
      },
      {
        name: "Subhash Baoli",
        what: "A natural spring shaded by deodar trees where Subhash Chandra Bose recovered from illness in 1937",
        why: "Almost no visitors. A 20-min walk from Gandhi Chowk. The spring is clean and the forest is silent.",
        bestTime: "Morning",
      },
    ],
    avoid: [
      "Dainkund Peak road can be blocked by snow Nov\u2013Feb. Check before planning.",
      "Hotels on the main road can be noisy. Ask for a room facing the valley side.",
    ],
    timingTips: [
      {
        activity: "Khajjiar visit",
        bestTime: "Weekdays, morning 7\u201310 AM",
        avoidTime: "Weekends and public holidays (massive day-tripper crowd from Pathankot and Chandigarh)",
      },
    ],
    localTransport: "Dalhousie is spread across 5 hills. Auto-rickshaws connect the chowks (\u20b930\u201380). Khajjiar: taxi (\u20b9600\u2013800 return, 24 km). Dainkund Peak: cab (\u20b9400\u2013600 return). Chamba: taxi (\u20b9400, 56 km).",
    knowBeforeYouGo: [
      "Best months: March\u2013June and September\u2013November. Winter has snow (Dec\u2013Feb) \u2014 roads can be icy.",
      "No train station. Nearest: Pathankot (80 km). Shared taxis from Pathankot to Dalhousie \u20b9120\u2013150/person.",
      "Power cuts are common. Carry a powerbank.",
    ],
    stayAreas: [
      { area: "Gandhi Chowk area", why: "Central, views, restaurants nearby.", bestFor: "balanced" },
      { area: "Subhash Chowk / Thandi Sadak", why: "Slightly quieter, budget to mid-range.", bestFor: "value" },
    ],
  },

  Chail: {
    destination: "Chail",
    mustEat: [
      {
        name: "Chail Palace Restaurant",
        area: "Inside Chail Palace (HPTDC hotel)",
        knownFor: "Himachali dham thali, rajma, Mughlai dishes. Served in a heritage dining room.",
        price: "\u20b9300\u2013600",
        tip: "Even if you\u2019re not staying at the Palace, eat here once for the historic atmosphere.",
      },
      {
        name: "Eagle\u2019s Nest Café",
        area: "Near Sidh Baba Temple trailhead",
        knownFor: "Maggi, omelettes, and ginger tea. The only proper café on the forest walks.",
        price: "\u20b970\u2013150",
      },
    ],
    streetFood: [
      { name: "Himachali rajma-chawal from local dhabas", area: "Chail village centre", price: "\u20b960\u2013100" },
    ],
    shopping: [
      { what: "Local honey and pine nut products", where: "Roadside stalls near Chail", priceRange: "\u20b9150\u2013400" },
    ],
    hiddenGems: [
      {
        name: "World\u2019s highest cricket ground",
        what: "A functional cricket pitch at 2,250m altitude inside a deodar forest",
        why: "Built in 1893 for Maharaja Bhupinder Singh of Patiala. Still used. Completely surreal to find a manicured cricket pitch in a Himalayan forest.",
        bestTime: "Anytime when not in use",
      },
      {
        name: "Kali Tibba sunrise",
        what: "The highest point near Chail (2,250m), reachable by a 3 km forest walk",
        why: "On a clear morning, you can see Shimla in one direction and Kasauli in the other. Zero tourists.",
        bestTime: "Sunrise (5:30\u20136:30 AM)",
      },
    ],
    avoid: [
      "Chail on summer weekends is crowded with day-trippers from Shimla and Chandigarh. Visit on weekdays.",
      "The road to Chail from Shimla via Kufri is narrow and prone to traffic jams on holidays.",
    ],
    timingTips: [
      {
        activity: "Chail Wildlife Sanctuary walk",
        bestTime: "October\u2013November (best wildlife activity, pheasants active)",
        tip: "The sanctuary is 110 sq km. Take a guided walk (\u20b9300\u2013500) for better wildlife spotting.",
      },
    ],
    localTransport: "Chail is tiny \u2014 walkable. Shared jeeps from Kufri (\u20b960/person). Shimla is 45 km (cab \u20b9600\u2013800). Chail has only 1 petrol pump \u2014 fill up before you arrive.",
    knowBeforeYouGo: [
      "No ATM in Chail. Carry cash from Shimla or Solan.",
      "Best months: April\u2013June, September\u2013November. Snow in winter (Dec\u2013Feb) but roads are passable.",
      "Very limited accommodation. Book in advance.",
    ],
    stayAreas: [
      { area: "Chail village (near cricket ground)", why: "Walking distance to the main attractions.", bestFor: "value, balanced" },
      { area: "Chail Palace (HPTDC)", why: "Heritage experience, forest setting, overpriced but unique.", bestFor: "comfort" },
    ],
  },

  Corbett: {
    destination: "Corbett",
    mustEat: [
      {
        name: "Corbett Motel Restaurant",
        area: "Ramnagar main road",
        knownFor: "Reliable north Indian thali, fresh rotis, and Kumaoni specialities like bhatt ki dal.",
        price: "\u20b9200\u2013400",
        tip: "Most resort restaurants are overpriced. This motel restaurant is the best value in Ramnagar town.",
      },
      {
        name: "Aahaar Restaurant",
        area: "Ramnagar market",
        knownFor: "Local Kumaoni food \u2014 jhangora ki kheer, singal (buckwheat flatbread), and local vegetables.",
        price: "\u20b9150\u2013300",
      },
    ],
    streetFood: [
      { name: "Kumaoni aloo ke gutke (spiced potatoes)", area: "Any dhaba in Ramnagar", price: "\u20b960\u2013100" },
      { name: "Baal mithai (Kumaoni sweet)", area: "Sweet shops in Ramnagar", price: "\u20b980\u2013150/piece" },
    ],
    shopping: [
      { what: "Jim Corbett memorabilia and books (his original novels)", where: "Corbett Museum shop, Kaladhungi", priceRange: "\u20b9200\u20131,200" },
    ],
    hiddenGems: [
      {
        name: "Dhikala Forest Lodge",
        what: "The only accommodation inside the core zone of Corbett. Colonial-era buildings in the forest.",
        why: "Waking up inside a tiger reserve at dawn with no fence between you and the jungle is a rare experience in India. Must book months in advance.",
        bestTime: "October\u2013March",
      },
      {
        name: "Garjia Devi Temple",
        what: "A Shiva and Durga temple on a large boulder mid-river in the Kosi",
        why: "Visually stunning. The temple appears to float on the river. A 5-minute detour from the main road.",
        bestTime: "Sunrise",
      },
    ],
    avoid: [
      "Buying safaris from touts in Ramnagar. Book only via corbettonline.uk.gov.in. Offline touts charge 3x.",
      "Zone 6 (Jhirna) \u2014 tiger sightings are rare there. Choose Bijrani or Jhirna zone based on availability but prefer Bijrani.",
      "Visiting July\u2013September \u2014 the park is partially closed for monsoon. Dhikala zone is fully closed.",
    ],
    timingTips: [
      {
        activity: "Jeep safari",
        bestTime: "Morning safari (6:30\u20139:30 AM) is better than afternoon for tiger sightings",
        tip: "Book 60 days in advance for Dhikala. Bijrani is easier to get. Tiger sighting probability: 35\u201360% in morning safaris (Bijrani zone).",
      },
    ],
    localTransport: "Ramnagar station is 1 km from town. Autos \u20b950\u201380. Resorts in the safari zones are 10\u201330 km from Ramnagar \u2014 most offer pickups. Cabs available: \u20b9800\u20131,500 for Ramnagar\u2013resort transfer.",
    knowBeforeYouGo: [
      "The park is open November\u2013June. Dhikala zone closes in monsoon (July\u2013September). Bijrani and Jhirna stay open longer.",
      "Photography permit required inside the park (\u20b9200 camera fee per entry). Professional equipment needs prior permission.",
      "Tiger sightings are never guaranteed. Corbett has the highest density in India but it\u2019s still a wild forest.",
      "Elephant rides were banned from tourist activities. Only jeep and canter safaris.",
    ],
    stayAreas: [
      { area: "Ramnagar town", why: "Cheap, basic options. Good for single-night budget stays.", bestFor: "value" },
      { area: "Marchula / Corbett corridor (south of Ramnagar)", why: "River-facing resorts. Better wildlife experience. 20 km from Ramnagar.", bestFor: "balanced, comfort" },
    ],
  },

  Chopta: {
    destination: "Chopta",
    mustEat: [
      {
        name: "Local dhabas on the Chopta plateau",
        area: "Along the main Chopta\u2013Tungnath road",
        knownFor: "Maggi, chai, aloo paratha. Basic but warm. The mountain air makes everything taste better.",
        price: "\u20b940\u2013120",
        tip: "The dhaba near the Tungnath trailhead serves the best hot chai before the trek.",
      },
    ],
    streetFood: [
      { name: "Kumaoni aloo tamater (spiced potato-tomato)", area: "Trail dhabas", price: "\u20b960\u2013100" },
    ],
    shopping: [
      { what: "Rhododendron juice and jam (local produce)", where: "Village shops in Ukhimath", priceRange: "\u20b960\u2013150" },
    ],
    hiddenGems: [
      {
        name: "Deoria Tal at dawn",
        what: "A high-altitude lake (4 km trek from Sari village) that perfectly reflects the Chaukhamba and Kedarnath peaks",
        why: "The reflection of 7,000m peaks in still lake water at dawn is one of India\u2019s most photogenic moments. Almost no one from the plains knows about this.",
        bestTime: "Sunrise. Camp overnight at Deoria Tal to catch it.",
      },
    ],
    avoid: [
      "Attempting Chandrashila without proper shoes. The rocky trail above Tungnath needs proper grip.",
      "Chopta in winter (December\u2013February) without serious gear \u2014 deep snow, no dhabas open.",
    ],
    timingTips: [
      {
        activity: "Tungnath and Chandrashila",
        bestTime: "April\u2013June and September\u2013November",
        tip: "Start Tungnath trek by 7 AM. The 3.5 km takes 2 hrs. Add 45 min more for Chandrashila summit. Return by noon to avoid afternoon clouds obscuring the view.",
      },
    ],
    localTransport: "Chopta is 41 km from Ukhimath (shared jeep \u20b950\u2013100/person). Nearest town: Rudraprayag (70 km). No public transport inside Chopta \u2014 trek everything. Shared jeeps from Rishikesh to Ukhimath (\u20b9400/person, 5 hrs).",
    knowBeforeYouGo: [
      "Chopta sits at 2,680m. Acclimatise on day 1 before trekking.",
      "Snow from November onwards. The plateau is snowbound December\u2013March.",
      "Tungnath temple is open May\u2013November only (deity moves to Ukhimath in winter).",
      "No ATM at Chopta. Carry cash from Rudraprayag or Ukhimath.",
    ],
    stayAreas: [
      { area: "Chopta plateau (tent camps and basic lodges)", why: "The only option on the plateau. Book ahead in Oct\u2013Nov peak.", bestFor: "value, balanced" },
      { area: "Ukhimath (41 km below)", why: "Better facilities, lower altitude. Base for a 2-day Chopta trip.", bestFor: "comfort" },
    ],
  },

  Auli: {
    destination: "Auli",
    mustEat: [
      {
        name: "GMVN Tourist Rest House Restaurant",
        area: "Auli top, near ski slopes",
        knownFor: "Basic north Indian food with unbeatable Himalayan views. Dal, roti, rajma. The only option at altitude.",
        price: "\u20b9150\u2013300",
        tip: "Eat lunch here mid-ski day. The panoramic mountain dining is the experience.",
      },
      {
        name: "Local dhabas in Joshimath",
        area: "Joshimath market (14 km below Auli)",
        knownFor: "Garhwali food \u2014 mandua ki roti (millet bread), chainsoo (black lentil dal), kafuli (green vegetable curry).",
        price: "\u20b9100\u2013200",
      },
    ],
    streetFood: [
      { name: "Hot chai and Maggi at cable car base", area: "Joshimath ropeway station", price: "\u20b920\u201360" },
    ],
    shopping: [
      { what: "Woollen local handicrafts from Joshimath", where: "Joshimath market", priceRange: "\u20b9200\u20132,000" },
    ],
    hiddenGems: [
      {
        name: "Gorson Bugyal meadow at sunset",
        what: "An 8 km trek from Auli to a vast alpine meadow with direct views of Nanda Devi (7,816m)",
        why: "India\u2019s highest Himalayan meadow easily accessible from a tourist destination. The sunset light on snow peaks here is extraordinary.",
        bestTime: "Evening 4\u20136 PM (May\u2013October)",
      },
    ],
    avoid: [
      "Auli in January\u2013February without booking accommodation well ahead \u2014 it\u2019s peak ski season and fully booked.",
      "The artificial snow spectacle in lean-snow years can be disappointing. Check snowfall reports before a winter trip.",
    ],
    timingTips: [
      {
        activity: "Skiing",
        bestTime: "January\u2013March (natural snow). GMVN courses run here.",
        tip: "Beginner 7-day ski courses cost \u20b93,500\u20136,000 inclusive of equipment. Book via GMVN Dehradun office.",
      },
      {
        activity: "Gondola cable car",
        bestTime: "Weekday mornings for shortest queues",
        avoidTime: "Weekend afternoons (1-hour wait in peak season)",
      },
    ],
    localTransport: "Joshimath to Auli: gondola (\u20b9750 one-way) or cab (\u20b9300\u2013400, 14 km). Rishikesh to Joshimath: bus (\u20b9300, 7 hrs) or shared jeep (\u20b9400\u2013600, 5 hrs).",
    knowBeforeYouGo: [
      "Auli is at 2,520m. Altitude sickness possible. Rest day 1 in Joshimath (1,875m) before going up.",
      "Best months: January\u2013March (skiing), May\u2013June (trekking), September\u2013October (clear skies, autumn colour).",
      "Limited ATMs. Carry cash from Rishikesh or Haridwar.",
    ],
    stayAreas: [
      { area: "Auli top (GMVN Ski Resort)", why: "At the slopes. Only viable in ski season.", bestFor: "balanced, comfort" },
      { area: "Joshimath town", why: "More facilities, shops, food. Base for day trips up to Auli.", bestFor: "value" },
    ],
  },

  Dehradun: {
    destination: "Dehradun",
    mustEat: [
      {
        name: "Ellora Restaurant",
        area: "Rajpur Road",
        knownFor: "The original Dehradun restaurant institution. Continental breakfasts, Indian lunch/dinner.",
        price: "\u20b9200\u2013450",
      },
      {
        name: "Kumar Sweet House",
        area: "Paltan Bazaar",
        knownFor: "Dehradun\u2019s famous kaala jamun (dark, syrupy gulab jamun) and barfi. Local institution since 1960s.",
        price: "\u20b960\u2013150",
      },
      {
        name: "Tunday Kebabi (Dehradun branch)",
        area: "Rajpur Road",
        knownFor: "Galouti kebabs from the Lucknow original recipe. One of the few branches outside UP.",
        price: "\u20b9200\u2013400",
      },
    ],
    streetFood: [
      { name: "Tandoori momos", area: "Multiple stalls near Clock Tower", price: "\u20b950\u201380 for 6 pieces" },
      { name: "Crispy jalebi at Paltan Bazaar", area: "Paltan Bazaar morning stalls", price: "\u20b920\u201340" },
    ],
    shopping: [
      { what: "Basmati rice and Dehradun litchi (seasonal)", where: "Paltan Bazaar or Connaught Market", priceRange: "\u20b9100\u2013500/kg" },
      { what: "Woollen shawls and Garhwali craft", where: "Rajpur Road shops", priceRange: "\u20b9300\u20132,000" },
    ],
    hiddenGems: [
      {
        name: "Tapkeshwar Temple at dawn",
        what: "A Shiva temple inside a dripping limestone cave on the Tons river \u2014 the idol is naturally bathed by a spring",
        why: "Spiritually charged and completely unique. Early morning with the natural light filtering in is magical. Barely known outside Dehradun.",
        bestTime: "Dawn, 6\u20137 AM",
      },
    ],
    avoid: [
      "Dehradun traffic is notorious. Avoid city travel between 5\u20138 PM. Plan your FRI and Robber\u2019s Cave in the morning.",
      "Mussoorie on weekends: the 30-km drive can take 3 hours in traffic.",
    ],
    timingTips: [
      {
        activity: "Robber\u2019s Cave (Guchhupani)",
        bestTime: "Weekdays 8\u201311 AM",
        avoidTime: "Weekends: extremely crowded, the wading experience becomes unpleasant",
        tip: "Wear old clothes and waterproof sandals. The water is knee-deep in places and very cold.",
      },
    ],
    localTransport: "Auto-rickshaws and Ola/Uber available throughout. Station to Robber\u2019s Cave: cab \u20b9300\u2013400 (9 km). Station to FRI: \u20b9150\u2013200 (6 km). Mussoorie: shared jeep from Delhi Bus Stand (\u20b9120/person, 1.5 hrs).",
    knowBeforeYouGo: [
      "Dehradun is a city-gateway, not a destination in itself. Best used as base for Mussoorie and onwards.",
      "IMA (Indian Military Academy) and FRI are the two must-sees. Both architectural gems.",
      "Best months: March\u2013June, September\u2013November. Summer is warm (30\u201335\u00b0C) but pleasant by hill-station standards.",
    ],
    stayAreas: [
      { area: "Rajpur Road area", why: "Best facilities, walking distance to restaurants.", bestFor: "balanced, comfort" },
      { area: "Near Clock Tower / Paltan Bazaar", why: "Budget hotels, good street food access.", bestFor: "value" },
    ],
  },

  Jaisalmer: {
    destination: "Jaisalmer",
    mustEat: [
      {
        name: "Trio Restaurant",
        area: "Gandhi Chowk, near the fort",
        knownFor: "Best Rajasthani thali in Jaisalmer: dal baati churma, ker sangri, gatte ki sabzi. Since 1970.",
        price: "\u20b9250\u2013500",
        tip: "Go for dinner when the fort is illuminated behind you.",
      },
      {
        name: "Saffron Restaurant (Hotel Nachana Haveli)",
        area: "Gandhi Chowk",
        knownFor: "Laal maas (spicy mutton) and kadhi pakora. Rooftop with fort view.",
        price: "\u20b9300\u2013600",
      },
    ],
    streetFood: [
      { name: "Mirchi bada (chilli fritter)", area: "Sadar Bazaar near clock tower", price: "\u20b920\u201340" },
      { name: "Makhaniya lassi (saffron and cream)", area: "Any street stall near fort gates", price: "\u20b950\u2013100", tip: "Try the malai lassi which comes in a clay kulhad. The saffron version is Jaisalmer-specific." },
      { name: "Jaisalmeri dal (whole lentils with local spices)", area: "Fort area restaurants", price: "\u20b980\u2013150" },
    ],
    shopping: [
      { what: "Rajasthani mirror-work bags and purses", where: "Sadar Bazaar", priceRange: "\u20b9200\u20131,500", tip: "Bargain confidently. First price is 3x. Walk away and they\u2019ll follow with 40% discount." },
      { what: "Fossil wood items (genuine desert fossils)", where: "Fort lanes", priceRange: "\u20b9100\u20131,000" },
      { what: "Camel leather products", where: "Near Patwon Ki Haveli", priceRange: "\u20b9300\u20132,000" },
    ],
    hiddenGems: [
      {
        name: "Kuldhara abandoned village",
        what: "An 800-year-old Paliwal Brahmin settlement abandoned overnight in 1825 \u2014 250 years of mystery",
        why: "The stone houses stand perfectly intact. The silence is eerie. No one knows exactly why 84 villages were abandoned simultaneously.",
        bestTime: "Morning 7\u20139 AM",
      },
      {
        name: "Gadisar Lake at dawn",
        what: "A 14th-century reservoir built for the city\u2019s water supply, now a birding and boat lake",
        why: "Arrive at sunrise when hundreds of birds are active. The Tilon Ki Pol gateway creates a perfect reflection.",
        bestTime: "6\u20138 AM",
      },
    ],
    avoid: [
      "Desert camp touts on the road to Sam. Book directly with your hotel or a verified operator.",
      "Fort interior restaurants \u2014 most are overpriced and mediocre. Eat outside the fort.",
      "Camel safari operators near Sam who don\u2019t specify the route length. Get it in writing.",
    ],
    timingTips: [
      {
        activity: "Fort visit",
        bestTime: "Before 9 AM or after 4 PM",
        avoidTime: "10 AM\u20132 PM (tourist buses, maximum heat in winter is still 25\u00b0C+)",
        tip: "Entry to Sonar Fort is free. The inside is a living city \u2014 walk through without a guide first.",
      },
      {
        activity: "Sam Sand Dunes",
        bestTime: "Sunset (4:30\u20136:30 PM) and sunrise (6\u20137:30 AM)",
        tip: "Overnight desert camp gives you both. The silence after the tourist crowd leaves at 8 PM is extraordinary.",
      },
    ],
    localTransport: "Auto-rickshaws throughout, \u20b960\u2013150 per ride. Sam Sand Dunes (45 km): cab \u20b9600\u2013800 return. Khuri dunes (40 km, less crowded alternative): \u20b9500\u2013700 return. Bikes for rent near station: \u20b9400\u2013600/day.",
    knowBeforeYouGo: [
      "Best months: October\u2013March. Summer (April\u2013June) is 40\u201348\u00b0C in the desert.",
      "The fort has actual residents. Buy water and food from locals to support them.",
      "Desert nights are cold even in winter (5\u201310\u00b0C in December\u2013January). Pack layers.",
    ],
    stayAreas: [
      { area: "Inside Sonar Fort", why: "Most unique experience. Budget guesthouses in ancient haveli buildings.", bestFor: "value" },
      { area: "Sam road area (near fort, outside)", why: "Good mid-range and boutique options with fort views.", bestFor: "balanced" },
      { area: "Desert camps at Sam", why: "Full desert experience. Heritage tents.", bestFor: "comfort" },
    ],
  },

  Bikaner: {
    destination: "Bikaner",
    mustEat: [
      {
        name: "Laxmi Niwas Palace Dining",
        area: "Dr. Karni Singh Road",
        knownFor: "Rajasthani thali in a heritage palace. Dal baati churma, gatte ki sabzi, kheer.",
        price: "\u20b9400\u2013700",
        tip: "Heritage lunch is worth the splurge once. The palace dining hall is extraordinary.",
      },
      {
        name: "Bhairon Vilas",
        area: "Old city",
        knownFor: "Bikaner\u2019s best affordable Rajasthani thali with authentic spicing.",
        price: "\u20b9150\u2013300",
      },
    ],
    streetFood: [
      { name: "Bhujia (the original Bikaneri bhujia)", area: "Haldiram\u2019s original outlet, old city", price: "\u20b9200\u2013300/250g", tip: "This is where Haldirams started in 1937. The bhujia here is crispier than their other outlets." },
      { name: "Kachori with peas curry", area: "Old city morning stalls", price: "\u20b920\u201340" },
      { name: "Rabdi malpua", area: "Sweet shops near Junagarh", price: "\u20b930\u201060" },
    ],
    shopping: [
      { what: "Bikaneri bhujia and namkeen", where: "Old city shops near Junagarh Fort", priceRange: "\u20b9200\u2013600/kg" },
      { what: "Woollen durries and carpets", where: "Rajasthan Emporium", priceRange: "\u20b9500\u20135,000" },
      { what: "Camel leather goods", where: "Old city bazaar", priceRange: "\u20b9300\u20132,000" },
    ],
    hiddenGems: [
      {
        name: "Karni Mata Temple (Rat Temple)",
        what: "A temple where 25,000 sacred rats (kabbas) live and are fed by devotees",
        why: "Bizarre, unforgettable, and completely unique in the world. Seeing white rats (considered auspicious) is common. The temple architecture is also beautiful.",
        bestTime: "Early morning 6\u20138 AM when the rats are most active",
      },
      {
        name: "Junagarh Fort inner chambers",
        what: "The Karan Mahal, Anup Mahal, and Phool Mahal inside the fort are extraordinarily decorated",
        why: "Bikaner\u2019s fort is often skipped for Jodhpur and Jaisalmer. It\u2019s equally impressive and almost empty by comparison.",
        bestTime: "Morning 9\u201311 AM",
      },
    ],
    avoid: [
      "Rat temple without removing shoes \u2014 mandatory. The floor has rat droppings. Cloth for feet is provided.",
      "Camel Safari operators in town without fixed itineraries. Get the route and duration written.",
    ],
    timingTips: [
      {
        activity: "Junagarh Fort",
        bestTime: "9\u201311 AM (good light for photos, fewer crowds)",
        tip: "Hire the audio guide (\u20b9100) rather than a guide. The recorded commentary is accurate and self-paced.",
      },
    ],
    localTransport: "Autos everywhere, \u20b950\u2013120. Karni Mata Temple (30 km): cab \u20b9400\u2013600 return (worth hiring for the day). National Research Centre on Camel (8 km): auto \u20b9100 return.",
    knowBeforeYouGo: [
      "Best months: October\u2013March. Summer is very hot (40\u201345\u00b0C).",
      "Bikaner is often a day-stop between Jaipur and Jaisalmer. It deserves an overnight to do it justice.",
      "The Bikaner Camel Corps (1885) in the Indian Army is the only active camel corps in the world.",
    ],
    stayAreas: [
      { area: "Near Junagarh Fort", why: "Walking distance to main sights. Budget to mid-range.", bestFor: "value, balanced" },
      { area: "Heritage hotels on outskirts (Laxmi Niwas area)", why: "Authentic haveli experience.", bestFor: "comfort" },
    ],
  },

  Ajmer: {
    destination: "Ajmer",
    mustEat: [
      {
        name: "Honey Dew Restaurant",
        area: "Near Dargah Sharif",
        knownFor: "Ajmeri biryani, kebabs, and sweet dishes. Muslim cuisine at its best near the Dargah.",
        price: "\u20b9150\u2013300",
        tip: "Order the mutton biryani. Eat before the Thursday qawwali so you\u2019re not rushing.",
      },
      {
        name: "Sohan Halwa shops",
        area: "Near Dargah Sharif entrance",
        knownFor: "Ajmer\u2019s signature sticky sweet \u2014 pure ghee and sugar, unique texture.",
        price: "\u20b9200\u2013500/250g",
        tip: "Buy from shops that make it fresh (you\u2019ll see the pan). Pre-packaged versions are inferior.",
      },
    ],
    streetFood: [
      { name: "Malpua and rabdi", area: "Dargah bazaar street", price: "\u20b930\u201360" },
      { name: "Kalakand (milk cake)", area: "Old city sweet shops", price: "\u20b940\u201380 per piece" },
    ],
    shopping: [
      { what: "Qawwali cassettes and religious items", where: "Dargah bazaar", priceRange: "\u20b950\u2013500" },
      { what: "Ajmeri embroidery (gota patti)", where: "Market near Ana Sagar", priceRange: "\u20b9300\u20132,000" },
    ],
    hiddenGems: [
      {
        name: "Dargah Sharif Thursday night qawwali",
        what: "Weekly Thursday (Jumu\u2018ah eve) qawwali in the inner sanctum of Khwaja Sahib\u2019s dargah",
        why: "The hereditary qawwal families have been performing here for centuries. The voice quality and spiritual intensity is unlike anything you\u2019ll experience in a concert setting.",
        bestTime: "After Isha namaz (9\u201310 PM on Thursdays)",
      },
    ],
    avoid: [
      "Chaddar sellers near the Dargah entrance who claim to be official. Buy your own or donate directly inside.",
      "Fake guides at Taragarh Fort who overstate its history. The fort is worth visiting \u2014 just don\u2019t need a guide.",
    ],
    timingTips: [
      {
        activity: "Dargah Sharif darshan",
        bestTime: "Early morning 6\u20138 AM or Thursday evenings for qawwali",
        avoidTime: "Fridays after Jumu\u2018ah namaz (very crowded, entry restricted)",
        tip: "Non-Muslims are welcome. Cover head (caps available inside). The inner sanctum is crowded but manageable before 9 AM.",
      },
    ],
    localTransport: "Auto-rickshaws everywhere, \u20b940\u2013100. Pushkar (14 km): shared jeep \u20b920\u201330/person or auto \u20b9200. Taragarh Fort: auto to base + 30-min walk up.",
    knowBeforeYouGo: [
      "Ajmer is predominantly Muslim near the Dargah. Dress modestly and respectfully.",
      "Best months: October\u2013March. Urs festival (death anniversary of Khwaja Sahib) attracts millions \u2014 dates vary by Islamic calendar.",
      "Pushkar Camel Fair (November) makes Ajmer extremely busy as the base city.",
    ],
    stayAreas: [
      { area: "Near Dargah / Old city", why: "Walking distance to the main attraction.", bestFor: "value" },
      { area: "Station area / Civil Lines", why: "Better infrastructure, quieter nights.", bestFor: "balanced, comfort" },
    ],
  },

  Chittorgarh: {
    destination: "Chittorgarh",
    mustEat: [
      {
        name: "Padmini Restaurant",
        area: "Collectorate area, Chittorgarh town",
        knownFor: "Rajasthani thali with authentic Mewar spicing. Dal baati churma, laal maas.",
        price: "\u20b9200\u2013400",
        tip: "Best restaurant in town for local flavour.",
      },
    ],
    streetFood: [
      { name: "Mirchi vada", area: "Bus stand area", price: "\u20b915\u201330" },
      { name: "Pyaaz ki kachori", area: "Old city morning stalls", price: "\u20b920\u201340" },
    ],
    shopping: [
      { what: "Miniature Rajput paintings", where: "Fort souvenir shops", priceRange: "\u20b9100\u20131,000" },
    ],
    hiddenGems: [
      {
        name: "Vijay Stambha at golden hour",
        what: "The 15th-century 37m victory tower with intricate carvings on all 9 stories",
        why: "At sunset, the sandstone turns gold and the carvings cast dramatic shadows. You can climb to the top for the best fort panorama.",
        bestTime: "4:30\u20136 PM",
      },
      {
        name: "Kalika Mata Temple",
        what: "Originally a Sun Temple (8th century) converted to Durga worship, inside the fort",
        why: "The ancient stone carvings are extraordinary and it\u2019s always quiet. Most visitors rush past to Padmini Palace.",
        bestTime: "Morning",
      },
    ],
    avoid: [
      "The fort is 700 acres and walking is intense. Hire an auto inside the fort (\u20b9300\u2013500 for the full circuit) rather than walking everything.",
      "No food inside the fort. Carry water and snacks.",
    ],
    timingTips: [
      {
        activity: "Fort visit",
        bestTime: "8\u201310 AM (good light, before heat builds)",
        avoidTime: "Midday (the fort is entirely exposed, no shade, extreme heat in summer)",
        tip: "Light and sound show (7:30 PM Hindi, \u20b9100) provides excellent context for the Rani Padmini story.",
      },
    ],
    localTransport: "Autos from station to fort (\u20b980\u2013120). Auto inside the fort for full circuit (\u20b9300\u2013500, recommended). Kota to Chittorgarh: cab (\u20b9800\u20131,200, 90 km).",
    knowBeforeYouGo: [
      "Best months: October\u2013March. Summer is harsh.",
      "The fort is fully exposed \u2014 no shade inside. Carry sun protection.",
      "Chittorgarh is best as a day trip from Udaipur (115 km) or an overnight stop between Jaipur and Udaipur.",
    ],
    stayAreas: [
      { area: "Near fort road / Collectorate area", why: "Convenient for fort access. Limited but adequate budget hotels.", bestFor: "value, balanced" },
    ],
  },

  Alwar: {
    destination: "Alwar",
    mustEat: [
      {
        name: "Hotel Aravali Restaurant",
        area: "Near bus stand",
        knownFor: "Alwari mawa kachori and the famous Alwar milk cake (kalakand).",
        price: "\u20b9150\u2013300",
        tip: "The milk cake here is denser and less sweet than most kalakand. Try a 200g portion.",
      },
    ],
    streetFood: [
      { name: "Alwar ka kalakand (milk cake)", area: "Multiple sweet shops near clock tower", price: "\u20b940\u201360 per 100g", tip: "Alwar kalakand is GI-tagged. The authentic version is drier and more grainy than soft kalakand." },
    ],
    shopping: [
      { what: "Alwari dhurrie (traditional carpet)", where: "Handloom shops in old city", priceRange: "\u20b9500\u20133,000" },
    ],
    hiddenGems: [
      {
        name: "Bhangarh Fort at dawn",
        what: "India\u2019s most haunted fort \u2014 actually a 17th-century Rajput city in ruins",
        why: "The ASI sign at the entrance warning against entry after sunset draws curious visitors. The real reward is the beautiful ruins in morning light \u2014 havelis, temples, and walls stretching across a hillside.",
        bestTime: "Sunrise 6\u20138 AM",
      },
    ],
    avoid: [
      "Sariska safaris without booking in advance \u2014 permits are limited per zone per day.",
      "Bhangarh after sunset \u2014 officially prohibited by ASI (not a suggestion, it\u2019s enforced).",
    ],
    timingTips: [
      {
        activity: "Sariska Tiger Reserve safari",
        bestTime: "Morning safari (6:30\u20139:30 AM). Tiger sighting probability is higher in winter mornings.",
        tip: "Book via rajasthanwildlife.in. Sariska has a smaller tiger population than Ranthambore but leopards are frequently sighted here.",
      },
    ],
    localTransport: "Autos in Alwar city, \u20b950\u2013100. Sariska (37 km): cab/auto \u20b9400\u2013600 return. Bhangarh (90 km from Alwar): cab \u20b9800\u20131,200 return (combine with Sariska for a full-day trip).",
    knowBeforeYouGo: [
      "Best months: October\u2013March for wildlife. Bhangarh is good October\u2013February.",
      "Delhi to Alwar: 160 km, 2.5 hrs by train (multiple daily). Easy weekend trip from Delhi.",
    ],
    stayAreas: [
      { area: "Alwar town (near station)", why: "Base for Sariska and Bhangarh. Budget to mid-range.", bestFor: "value, balanced" },
      { area: "Sariska resort zone (on forest road)", why: "Wildlife immersion. Better for Sariska safaris.", bestFor: "comfort" },
    ],
  },

  Bharatpur: {
    destination: "Bharatpur",
    mustEat: [
      {
        name: "Birder\u2019s Inn",
        area: "Near Keoladeo Bird Sanctuary gate",
        knownFor: "Good north Indian food, birding log books, and a community of serious bird enthusiasts.",
        price: "\u20b9200\u2013400",
        tip: "The guestbook here has records of rare bird sightings by birders from 40+ countries.",
      },
    ],
    streetFood: [
      { name: "Kachori from Bharatpur town", area: "Any stall near old city bus stand", price: "\u20b920\u201340" },
    ],
    shopping: [
      { what: "Bird photography prints and books", where: "Near sanctuary gate shops", priceRange: "\u20b9200\u20131,500" },
    ],
    hiddenGems: [
      {
        name: "Cycling inside Keoladeo at dawn",
        what: "Rent a cycle at the gate and explore 29 sq km of wetland and forest at sunrise",
        why: "The only national park in India where cycles are allowed inside. The silence, birds, and morning mist make this one of India\u2019s most peaceful experiences.",
        bestTime: "6:30\u20138:30 AM October\u2013February",
      },
    ],
    avoid: [
      "Visiting Keoladeo in summer (March\u2013September) \u2014 migratory birds are gone. The resident bird population is still good but the main event is October\u2013February.",
      "Rickshaws inside the sanctuary. Cycles are the only correct way to experience it at your own pace.",
    ],
    timingTips: [
      {
        activity: "Keoladeo Bird Sanctuary",
        bestTime: "November\u2013February (Siberian cranes and 200+ migratory species)",
        tip: "Hire a BNHS-certified guide at the gate (\u20b9200 for 3 hrs). They spot birds you\u2019ll walk past completely unaware of.",
      },
    ],
    localTransport: "Bharatpur station is 5 km from the sanctuary. Auto \u20b960\u2013100. Cycle rickshaws inside the sanctuary (or rent cycles \u20b950/hr). Agra is 55 km (cab \u20b9700 return).",
    knowBeforeYouGo: [
      "Best months: October\u2013February for birds. November\u2013January for peak migratory species.",
      "Bharatpur is easily combined with Agra (55 km) or Ranthambore (180 km) for a multi-destination trip.",
    ],
    stayAreas: [
      { area: "Near Keoladeo sanctuary gate", why: "Walking distance to park. Birder\u2019s Inn and similar lodges.", bestFor: "value, balanced" },
    ],
  },

  "Mount Abu": {
    destination: "Mount Abu",
    mustEat: [
      {
        name: "Arbuda Restaurant",
        area: "Near Nakki Lake",
        knownFor: "The best dal baati churma in Mount Abu. Homestyle Rajasthani cooking with ghee drizzled liberally.",
        price: "\u20b9200\u2013400",
        tip: "Ask for extra churma. The sweet lentil flour crumble on the baati makes the dish.",
      },
      {
        name: "Chacha Museum Café",
        area: "Near town centre",
        knownFor: "Light snacks, excellent filter coffee, and the most eclectic decor in town.",
        price: "\u20b9100\u2013250",
      },
    ],
    streetFood: [
      { name: "Corn chat and roasted corn", area: "Nakki Lake promenade", price: "\u20b920\u201340" },
      { name: "Jalebi and rabdi", area: "Evening stalls near market", price: "\u20b940\u201380" },
    ],
    shopping: [
      { what: "Silver jewellery (Rajasthani tribal style)", where: "Market near Nakki Lake", priceRange: "\u20b9200\u20133,000" },
      { what: "Brahma Kumaris publications and meditation aids", where: "BK campus shop", priceRange: "\u20b950\u2013500" },
    ],
    hiddenGems: [
      {
        name: "Dilwara temples at opening time",
        what: "11th-century Jain marble temples with 1,500 craftsmen\u2019s finest work over 14 years",
        why: "The marble carving here surpasses the Taj Mahal in intricacy. Arrive exactly at 12 PM (opening time \u2014 closed morning) to have the first 20 minutes relatively undisturbed.",
        bestTime: "12:00\u201312:30 PM",
      },
    ],
    avoid: [
      "Mount Abu on summer weekends (May\u2013June) \u2014 population triples with Gujarati and Rajasthani families. Book 2 months ahead.",
      "Dilwara temples are closed on Mondays. Plan accordingly.",
    ],
    timingTips: [
      {
        activity: "Dilwara Temples",
        bestTime: "12\u201315:00 (only opening hours for non-Jains)",
        tip: "Photography inside the temples is not allowed. Sketching permitted. The Vimal Vasahi (1031 CE) and Luna Vasahi (1231 CE) are the two main temples.",
      },
    ],
    localTransport: "Mount Abu is connected only by road. Abu Road station (27 km): bus (\u20b925, 45 min) or cab (\u20b9400\u2013600). Within town: auto \u20b950\u2013100. Guru Shikhar: cab \u20b9300 return (15 km).",
    knowBeforeYouGo: [
      "Only hill station in Rajasthan. Altitude 1,220m. Cool even in summer.",
      "Best months: October\u2013March. Dilwara closed Mondays. Plan 1-2 nights minimum.",
    ],
    stayAreas: [
      { area: "Near Nakki Lake", why: "Walking distance to lake and market. All tiers of accommodation.", bestFor: "value, balanced" },
      { area: "Hilltop hotels (Sunset Point area)", why: "Views, quiet, premium.", bestFor: "comfort" },
    ],
  },

  Mandawa: {
    destination: "Mandawa",
    mustEat: [
      {
        name: "Castle Mandawa Restaurant",
        area: "Inside Mandawa Castle (heritage hotel)",
        knownFor: "Rajasthani thali with laal maas, ker sangri, and traditional sweets. Served in a 1755 fort.",
        price: "\u20b9350\u2013600",
        tip: "Even if not staying here, lunch in the castle courtyard is the experience of Mandawa.",
      },
    ],
    streetFood: [
      { name: "Pyaaz ki kachori", area: "Any dhaba near the market", price: "\u20b920\u201340" },
    ],
    shopping: [
      { what: "Shekhawati block-print textiles", where: "Mandawa Haveli shops", priceRange: "\u20b9200\u20132,000" },
    ],
    hiddenGems: [
      {
        name: "Laxmi Narayan Ladia Haveli fresco walk",
        what: "A 19th-century merchant\u2019s haveli with murals mixing Hindu mythology with British-era subjects: motorcars, aeroplanes, and the first Indian telephone",
        why: "The juxtaposition of ancient painting technique with modern subjects is uniquely Shekhawati. No tourist guide needed \u2014 just walk the courtyard.",
        bestTime: "Morning (natural light in the courtyards)",
      },
    ],
    avoid: [
      "Mandawa is tiny. 1 night is enough. Don\u2019t plan more than 2 nights unless doing multi-haveli exploration across Shekhawati.",
    ],
    timingTips: [
      {
        activity: "Haveli walk",
        bestTime: "7\u201310 AM (morning courtyard light is best for fresco photography)",
        tip: "Many havelis are privately owned. A small donation (\u20b950\u2013100) to the caretaker gets you full access to the interior courtyards.",
      },
    ],
    localTransport: "Mandawa is walkable (the entire town is 1.5 km end to end). Jhunjhunu (28 km): shared jeep \u20b940\u201360. Jaipur (180 km): cab or bus via Jhunjhunu.",
    knowBeforeYouGo: [
      "Best months: October\u2013March. Summer is intensely hot in this desert region.",
      "No direct train. Nearest station: Jhunjhunu (28 km) or Sikar (65 km). Most arrive by cab from Jaipur.",
    ],
    stayAreas: [
      { area: "Mandawa Castle area", why: "Heritage experience. Budget to luxury options in converted havelis.", bestFor: "value, balanced, comfort" },
    ],
  },

  Ranakpur: {
    destination: "Ranakpur",
    mustEat: [
      {
        name: "Shivika Lake Hotel Restaurant",
        area: "Near temple complex",
        knownFor: "Only decent restaurant near the temples. Rajasthani thali, dal, vegetables. Simple but fresh.",
        price: "\u20b9200\u2013400",
        tip: "After the temples, this is the only food option. Eat lunch here before heading to Kumbhalgarh.",
      },
    ],
    streetFood: [
      { name: "Prasad ladoos at temple", area: "Temple entrance shops", price: "\u20b950\u2013100" },
    ],
    shopping: [
      { what: "Marble Jain deity miniatures from temple shop", where: "Temple gift shop", priceRange: "\u20b9200\u20132,000" },
    ],
    hiddenGems: [
      {
        name: "Aravalli forest walk",
        what: "The temple is surrounded by dense Aravalli forest \u2014 leopard and sloth bear habitat",
        why: "Walking the 500m around the temple complex in the forest is atmospheric. Very few visit beyond the main temple.",
        bestTime: "Early morning before temple opens",
      },
    ],
    avoid: [
      "Visiting Ranakpur on a Monday (temple closed) or a Jain festival day (extremely crowded, non-Jains may be restricted).",
    ],
    timingTips: [
      {
        activity: "Temple visit",
        bestTime: "12\u201317:00 (only visiting hours for non-Jains). Friday and Sunday: slightly busier.",
        tip: "The play of light through the 1,444 marble pillars changes every 30 minutes. Spend at least 2 hours.",
      },
    ],
    localTransport: "No public transport to Ranakpur. Only by cab from Udaipur (95 km, \u20b91,200\u20131,800 return) or Falna station (40 km, \u20b9600\u2013900 return). Best combined with Kumbhalgarh Fort (45 km from Ranakpur).",
    knowBeforeYouGo: [
      "Ranakpur is a 2-3 hour temple experience, not an overnight destination for most.",
      "Non-Jains allowed noon\u201317:00. Leather items not permitted inside (belts too).",
    ],
    stayAreas: [
      { area: "Near temple (few guesthouses)", why: "Only option locally. Limited inventory. Book well ahead.", bestFor: "value, balanced" },
    ],
  },

  Vrindavan: {
    destination: "Vrindavan",
    mustEat: [
      {
        name: "ISKCON Vrindavan Prasad",
        area: "Inside ISKCON Temple campus",
        knownFor: "Sattvic prasad \u2014 khichdi, sabzi, sweets. The temple kitchen follows strict Vaishnava preparation.",
        price: "\u20b980\u2013150",
        tip: "The Sunday feast is extraordinary. Go for the full meal.",
      },
      {
        name: "Brijwasi Sweets",
        area: "Loi Bazaar, Vrindavan",
        knownFor: "Rabdi pedas, mathura peda, and kesar chai. The original Vrindavan sweet shop.",
        price: "\u20b960\u2013200",
      },
    ],
    streetFood: [
      { name: "Chaat (Mathura-style)", area: "Near Banke Bihari Temple lane", price: "\u20b920\u201350" },
      { name: "Lassi (thick, unsweetened)", area: "Shops on the main road", price: "\u20b930\u201080" },
    ],
    shopping: [
      { what: "Krishna idol and pooja items", where: "Shops near Banke Bihari and ISKCON", priceRange: "\u20b9100\u20132,000" },
      { what: "Braj bhoomi malas (tulsi and sandalwood)", where: "Loi Bazaar", priceRange: "\u20b950\u2013500" },
    ],
    hiddenGems: [
      {
        name: "Seva Kunj evening walk",
        what: "The forest grove where, according to tradition, Radha and Krishna had their nightly raas leela",
        why: "The path is lined with peacocks and ancient trees. After sunset it is locked (deity rests inside). The evening walk before 7 PM is one of Vrindavan\u2019s most atmospheric experiences.",
        bestTime: "5\u20136:30 PM",
      },
    ],
    avoid: [
      "Auto-wallahs who want to take you to \u2018special\u2019 temples or shops on commission. Walk in Vrindavan \u2014 everything is close.",
      "Visiting Banke Bihari at noon on weekends \u2014 the lane becomes dangerously crowded.",
    ],
    timingTips: [
      {
        activity: "Banke Bihari darshan",
        bestTime: "6\u20137 AM (mangal aarti, most sacred) or 8\u20139 PM (sayan aarti)",
        avoidTime: "Janmashtami week (August) \u2014 the lane is impassable with crowds",
        tip: "The curtain drops every 30 seconds in front of the idol \u2014 a unique tradition to prevent disciples from being overwhelmed by the deity\u2019s gaze.",
      },
    ],
    localTransport: "Vrindavan is 15 km from Mathura. Shared tempo from Mathura (\u20b920, 30 min). Auto entire day: \u20b9400\u2013600. Vrindavan itself is 3 km end to end \u2014 cycle rickshaws ideal (\u20b930\u201060 per ride).",
    knowBeforeYouGo: [
      "Vrindavan has 5,000+ temples. Focus on Banke Bihari, Prem Mandir, ISKCON, and Radha Raman.",
      "Janmashtami (August) draws 10 lakh visitors. Plan months ahead or avoid.",
      "Best months: October\u2013March. Holi in Vrindavan (Braj Holi) is 10 days before the main Holi date \u2014 world famous.",
    ],
    stayAreas: [
      { area: "Loi Bazaar area", why: "Walking distance to Banke Bihari and main temples.", bestFor: "value" },
      { area: "Chatikara Road area", why: "Quieter. Good mid-range and hotels with gardens.", bestFor: "balanced, comfort" },
    ],
  },

  Prayagraj: {
    destination: "Prayagraj",
    mustEat: [
      {
        name: "El Chico Restaurant",
        area: "Civil Lines",
        knownFor: "Prayagraj\u2019s most beloved restaurant since 1956. Continental breakfast, cold coffee, classic UP thali.",
        price: "\u20b9200\u2013450",
        tip: "The cold coffee and pastries are a 70-year institution. Go for breakfast.",
      },
      {
        name: "Netram\u2019s Sweets",
        area: "Neni Road, Civil Lines",
        knownFor: "Prayagraj\u2019s best mithai shop. Imarti (jaangiri), milk cake, and seasonal sweets.",
        price: "\u20b960\u2013200",
      },
    ],
    streetFood: [
      { name: "Tamatar chaat (Prayagraj style)", area: "Near Chowk and old city", price: "\u20b920\u201050" },
      { name: "Tehri (saffron rice dish, unique to UP)", area: "Any dhaba near university area", price: "\u20b950\u2013100" },
    ],
    shopping: [
      { what: "Sangam mitti (sacred soil souvenirs)", where: "Ghat vendors", priceRange: "\u20b920\u2013100" },
    ],
    hiddenGems: [
      {
        name: "Hanuman Temple on the Sangam ghat",
        what: "A temple with a reclining Hanuman idol that floods underwater every monsoon",
        why: "When the Ganga floods (July\u2013October), the idol is completely submerged. Devotees dive to offer flowers. This ritual is completely unique.",
        bestTime: "Early morning darshan year-round",
      },
    ],
    avoid: [
      "Boat prices at Sangam \u2014 negotiate hard. Fair price is \u20b9150\u2013200 for a shared boat, not the \u20b9500+ quoted.",
    ],
    timingTips: [
      {
        activity: "Sangam dip",
        bestTime: "Sunrise (5:30\u20136:30 AM) when the light on the confluence is golden",
        tip: "The Triveni Sangam is the visible confluence of Ganga and Yamuna (the Saraswati is underground). The colour difference between the rivers is clearly visible at the junction.",
      },
    ],
    localTransport: "Autos and e-rickshaws everywhere. Station to Sangam: auto \u20b9100\u2013150 (5 km). Civil Lines to old city: e-rickshaw \u20b920\u201340.",
    knowBeforeYouGo: [
      "Best months: October\u2013March. Magh Mela (January) and Kumbh Mela (every 6 and 12 years) bring millions \u2014 check dates.",
      "The city has two names: Allahabad (official colonial name) and Prayagraj (Mughal-era / official since 2018).",
    ],
    stayAreas: [
      { area: "Civil Lines", why: "Colonial-era neighbourhood. Best restaurants and infrastructure.", bestFor: "balanced, comfort" },
      { area: "Near Sangam / Daraganj", why: "Walking distance to ghats. Basic accommodation.", bestFor: "value" },
    ],
  },

  "Fatehpur Sikri": {
    destination: "Fatehpur Sikri",
    mustEat: [
      {
        name: "Agra Road dhabas outside the monument",
        area: "Outside the main gate complex",
        knownFor: "Dal, roti, and fresh vegetables. Simple, honest food.",
        price: "\u20b980\u2013150",
        tip: "There is almost no good food inside the complex. Eat before or after at the dhabas outside.",
      },
    ],
    streetFood: [
      { name: "Sugarcane juice outside complex gate", area: "Main parking area", price: "\u20b920\u201340" },
    ],
    shopping: [
      { what: "Marble and stone craft from local artisan stalls", where: "Market approaching the fort", priceRange: "\u20b9100\u20132,000" },
    ],
    hiddenGems: [
      {
        name: "Salim Chishti Dargah wish-making ritual",
        what: "Pilgrims tie a red/white thread on the marble lattice of the Sheikh\u2019s tomb to make wishes",
        why: "The ritual continues 450 years after Akbar\u2019s son Salim (Jahangir) was born as a result of the Sheikh\u2019s blessing. The intricate marble jali (lattice) is also a masterpiece of craftsmanship.",
        bestTime: "Morning",
      },
    ],
    avoid: [
      "Guides inside the complex who quote \u20b91,500+. ASI guides charge \u20b9100 for Indians.",
      "Visiting during Eid or major Hindu festivals \u2014 the dargah gets extremely crowded.",
    ],
    timingTips: [
      {
        activity: "Monument complex",
        bestTime: "8\u201310 AM (good light, fewer crowds, cooler)",
        avoidTime: "12\u201314:00 (extreme heat in summer, harsh light for photos)",
      },
    ],
    localTransport: "Agra to Fatehpur Sikri: bus (\u20b940, 1.5 hrs) or cab (\u20b9500\u2013600 return with waiting). From Fatehpur Sikri to Agra: buses run until 7 PM. Fatehpur Sikri village is tiny \u2014 auto from bus stand to gate (\u20b930).",
    knowBeforeYouGo: [
      "Fatehpur Sikri is 37 km from Agra. Best done as a half-day trip, combined with Agra in the same visit.",
      "The complex is UNESCO-listed. No food or plastic inside.",
    ],
    stayAreas: [
      { area: "Fatehpur Sikri village (basic guesthouses)", why: "For an overnight stay to beat the morning crowds.", bestFor: "value" },
    ],
  },

  Lucknow: {
    destination: "Lucknow",
    mustEat: [
      {
        name: "Tunday Kababi",
        area: "Aminabad, old city (original location)",
        knownFor: "Galouti kebab \u2014 110-ingredient recipe perfected in 1905 for a toothless Nawab. World\u2019s most complex kebab.",
        price: "\u20b9200\u2013400",
        tip: "Eat the galouti on a sheermal (saffron flatbread), not a paratha. That\u2019s the correct pairing.",
      },
      {
        name: "Dastarkhwan",
        area: "Near Hazratganj",
        knownFor: "Dum biryani, nihari, and korma. The definitive Awadhi cuisine restaurant in Lucknow.",
        price: "\u20b9250\u2013500",
        tip: "The nihari (slow-cooked mutton) is the best in the city. Order it with a khamiri roti.",
      },
      {
        name: "Shree Lassi",
        area: "Hazratganj main road",
        knownFor: "The best thandai and malai lassi in Lucknow. Served in glass, not kulhad.",
        price: "\u20b960\u2013150",
      },
    ],
    streetFood: [
      { name: "Biryani at Lalbagh market", area: "Lalbagh evening market", price: "\u20b9100\u2013200", tip: "Evening street biryani is different from restaurant biryani. Smaller portions, more direct spice." },
      { name: "Chai at roadside stalls (Hazratganj)", area: "Hazratganj area", price: "\u20b910\u201320" },
      { name: "Sheermal (saffron bread) from old city bakeries", area: "Chowk area", price: "\u20b930\u201060 per piece" },
    ],
    shopping: [
      { what: "Chikankari embroidery (kurtas, sarees)", where: "Chowk bazaar and Hazratganj", priceRange: "\u20b9400\u20135,000", tip: "Genuine chikankari is hand-done on cotton or georgette. Machine replicas exist. Feel the reverse side \u2014 handwork has slight inconsistency." },
      { what: "Attar (ittar) \u2014 Lucknawi natural perfume", where: "Old city attar shops near Hussainabad", priceRange: "\u20b9200\u20132,000" },
    ],
    hiddenGems: [
      {
        name: "Chota Imambara light ceremony",
        what: "The Hussainabad Imambara is fully illuminated with thousands of Mughal-era chandeliers every evening",
        why: "The interior looks like a palace from the Arabian Nights. Free for Indians (\u20b925). Most tourists rush to the bigger Bara Imambara and miss this.",
        bestTime: "Evening 5\u20137 PM when chandeliers are lit",
      },
    ],
    avoid: [
      "Eating biryani at restaurants near the railway station \u2014 tourist traps. Go to Dastarkhwan or street vendors in Aminabad.",
      "Chikankari from airport or hotel shops \u2014 premium prices for machine-made work.",
    ],
    timingTips: [
      {
        activity: "Bara Imambara",
        bestTime: "8\u201310 AM (cooler, good light, fewer crowds)",
        tip: "The bhool bhulaiya (labyrinth) on the upper floor is genuinely disorienting. Hire a guide inside (\u20b9100) \u2014 worth it to not get lost.",
      },
    ],
    localTransport: "Ola/Uber available throughout. Auto \u20b950\u2013120 per ride. Old city to Hazratganj: auto \u20b960\u201380. Airport to city: Ola (\u20b9350\u2013500).",
    knowBeforeYouGo: [
      "Lucknow is safe, modern, and food-obsessed. The tehzeeb (culture of courtesy) is real \u2014 locals are genuinely welcoming.",
      "Best months: October\u2013March. Summer is very hot (40\u201345\u00b0C).",
      "The old city and Hazratganj are 5 km apart. Base near Hazratganj for food; old city for monuments.",
    ],
    stayAreas: [
      { area: "Hazratganj", why: "Modern, safe, great restaurants. Best base for most visitors.", bestFor: "balanced, comfort" },
      { area: "Near Charbagh station", why: "Budget options. Close to transport.", bestFor: "value" },
    ],
  },

  Dudhwa: {
    destination: "Dudhwa",
    mustEat: [
      {
        name: "Dudhwa Forest Lodge Restaurant",
        area: "Inside park, Tiger Haven zone",
        knownFor: "Simple north Indian cooking. Dal, sabzi, roti. The only food option inside the park.",
        price: "\u20b9200\u2013350",
      },
      {
        name: "Local dhabas in Pallia town (gateway)",
        area: "Pallia town, 8 km from park gate",
        knownFor: "Awadhi-style dal makhani and tandoor. Local and fresh.",
        price: "\u20b9100\u2013200",
      },
    ],
    streetFood: [
      { name: "Sugarcane juice at park gate", area: "Dudhwa main gate", price: "\u20b920\u201330" },
    ],
    shopping: [
      { what: "Forest department publications and wildlife books", where: "Park reception counter", priceRange: "\u20b9100\u2013500" },
    ],
    hiddenGems: [
      {
        name: "One-horned rhino zone at dusk",
        what: "Dudhwa has a successful rhino re-introduction programme \u2014 about 38 one-horned rhinos in the park",
        why: "Seeing a one-horned rhino in North India (not Assam) is extraordinary. The terai grasslands of Dudhwa are their only North Indian habitat.",
        bestTime: "Evening safari 3:30\u20136 PM",
      },
    ],
    avoid: [
      "Arriving without safari bookings \u2014 permits are limited. Book via uptourism.gov.in well in advance.",
      "Dudhwa in monsoon (July\u2013September) \u2014 park closed.",
    ],
    timingTips: [
      {
        activity: "Jeep safari",
        bestTime: "Morning safari (6\u20139 AM) for tiger activity. Evening for rhinos.",
        tip: "Elephant back safari (unique in North India) gives you a different perspective. Book separately via forest department.",
      },
    ],
    localTransport: "No train direct to Dudhwa. Dudhwa railway station (on Lucknow-Mailani branch line) is 3 km from gate. Nearest major station: Lakhimpur (50 km). Cab from Lucknow: \u20b92,000\u20132,500 one way (380 km).",
    knowBeforeYouGo: [
      "Best months: November\u2013June. Park closed July\u2013mid-November.",
      "Dudhwa has tigers, leopards, elephants, rhinos, and over 400 bird species. Less visited than Corbett or Ranthambore \u2014 genuine wilderness.",
      "Stay inside the park if possible (forest rest houses) for the full experience.",
    ],
    stayAreas: [
      { area: "Inside park (forest rest houses)", why: "Waking up in a tiger reserve is irreplaceable. Book months ahead.", bestFor: "balanced, comfort" },
      { area: "Pallia town guesthouses", why: "Budget option outside the park.", bestFor: "value" },
    ],
  },

  Nalanda: {
    destination: "Nalanda",
    mustEat: [
      {
        name: "Nalanda Retreat Hotel Restaurant",
        area: "On the Rajgir road, near site",
        knownFor: "Bihar\u2019s local cuisine: litti chokha, sattu paratha, and chana ghugni.",
        price: "\u20b9150\u2013300",
        tip: "Litti chokha here is cooked over cow dung fire in traditional style. The charred crust is essential.",
      },
    ],
    streetFood: [
      { name: "Thekua (Bihari sweet), sold near the site", area: "Site entrance", price: "\u20b920\u201340" },
    ],
    shopping: [
      { what: "Brass Buddha statues from Bodh Gaya road shops", where: "Nalanda to Rajgir highway", priceRange: "\u20b9200\u20132,000" },
    ],
    hiddenGems: [
      {
        name: "Xuanzang Memorial Hall",
        what: "A memorial to the 7th-century Chinese monk who spent 17 years at Nalanda University",
        why: "His written records are the most detailed account of ancient India. The memorial garden is peaceful and almost always empty.",
        bestTime: "Morning",
      },
    ],
    avoid: [
      "Expecting facilities inside the site \u2014 there are almost none. Carry water and snacks.",
    ],
    timingTips: [
      {
        activity: "Archaeological site",
        bestTime: "8\u201310 AM (good light for photography, cooler temperature)",
        tip: "Hire a guide at the gate (\u20b9100\u2013150 for 1.5 hrs). The ruins are difficult to contextualise without knowing which building was the library, hospital, or lecture hall.",
      },
    ],
    localTransport: "Rajgir to Nalanda: shared jeep (\u20b920, 12 km). Patna to Nalanda: direct bus (90 km, 2 hrs, \u20b9100) or cab (\u20b91,200\u20131,500 return). Bodh Gaya to Nalanda: cab (\u20b91,200\u20131,800 return via Gaya).",
    knowBeforeYouGo: [
      "Best months: October\u2013March. Summer is very hot in Bihar.",
      "Nalanda is usually combined with Rajgir (12 km) and Bodh Gaya (80 km) in a Buddhist circuit.",
    ],
    stayAreas: [
      { area: "Rajgir (12 km)", why: "Better accommodation and hot springs. Use Rajgir as base for Nalanda day trip.", bestFor: "value, balanced" },
    ],
  },

  "Vaishno Devi": {
    destination: "Vaishno Devi",
    mustEat: [
      {
        name: "Pure Veg restaurants near Banganga check-post",
        area: "Katra main market",
        knownFor: "Kashmiri rajma-chawal, kadhi, and the unique Dogri flatbread rajma combination.",
        price: "\u20b9150\u2013300",
      },
      {
        name: "Ram Bhawan Langar (trust-run)",
        area: "Halfway point on the trek",
        knownFor: "Free langar (prasad food) at the midpoint. Dal, roti, and kheer.",
        price: "Free (donation-based)",
        tip: "Eat here on the descent. You\u2019ll need the energy after the Bhawan darshan.",
      },
    ],
    streetFood: [
      { name: "Kheer from bhog stalls at trail checkpoints", area: "Along the yatra route", price: "\u20b920\u201040" },
      { name: "Kashmiri dry fruits and nuts", area: "Katra market", price: "\u20b9200\u2013500/100g" },
    ],
    shopping: [
      { what: "Kashmiri pashmina shawls and phiran (wool garments)", where: "Katra market", priceRange: "\u20b9500\u20136,000", tip: "Genuine pashmina is tested by the ring test (it passes through a ring). Much sold here is Kashmiri acrylic. Ask for a certificate." },
    ],
    hiddenGems: [
      {
        name: "Shiv Khori cave temple",
        what: "A 200m natural limestone tunnel with a Shiva swayambhu (self-formed) linga at the end, 60 km from Katra",
        why: "Far less visited than Vaishno Devi. The cave requires crawling in places. The entire experience is more adventurous and raw.",
        bestTime: "Weekdays 8\u201311 AM",
      },
    ],
    avoid: [
      "Starting the trek without your RFID yatra slip (mandatory). Register at shrivaishnodevi.org (\u20b9100). You will be turned back without it.",
      "Starting after 2 PM for same-day return \u2014 the 14 km round trip takes 8\u201310 hours.",
      "Helicopter booking during festivals \u2014 advance booking essential. Prices triple.",
    ],
    timingTips: [
      {
        activity: "Yatra (full trek)",
        bestTime: "Depart Banganga by 5 AM for best chance of early Bhawan darshan and day return",
        tip: "The 14 km (28 km return) takes a fit person 7\u20138 hours. Use the ropeway (\u20b9280\u2013350 one way) from Katra to Ardh Kuwari to save 6 km.",
      },
    ],
    localTransport: "Katra to Banganga check-post: battery vehicle (\u20b950, free for registered pilgrims). Ropeway from Katra: book in advance during festivals. Helicopter (Katra to Sanjichhat): \u20b92,200 return, 7-min flight, saves 10 km of trekking.",
    knowBeforeYouGo: [
      "Over 8 million pilgrims per year. Navratri (March\u2013April and October) is the busiest period.",
      "Trek is 14 km one way. Good physical fitness required. Elderly or those with health issues should use ropeway + helicopter.",
      "Best months: March\u2013May and September\u2013November (moderate temperature for trekking).",
    ],
    stayAreas: [
      { area: "Katra town", why: "The only option \u2014 the shrine is 14 km from town. Multiple tiers of accommodation.", bestFor: "value, balanced, comfort" },
    ],
  },

  Kurukshetra: {
    destination: "Kurukshetra",
    mustEat: [
      {
        name: "Anupam Sweets and Restaurant",
        area: "Near bus stand, Kurukshetra",
        knownFor: "Haryanvi khichdi, bajre ki roti with sarson ka saag, and fresh lassi.",
        price: "\u20b9150\u2013300",
      },
    ],
    streetFood: [
      { name: "Makki ki roti + sarson ka saag (winter only)", area: "Any dhaba on NH44 bypass", price: "\u20b960\u2013100" },
    ],
    shopping: [
      { what: "Kurukshetra mementos and Gita publications", where: "Krishna Museum shop and Brahma Sarovar shops", priceRange: "\u20b950\u2013500" },
    ],
    hiddenGems: [
      {
        name: "Jyotisar at dawn",
        what: "The banyan tree where Krishna recited the Gita to Arjuna, marked by an ASI monument",
        why: "India\u2019s most philosophically significant spot has almost no visitors at dawn. The morning silence and a 5,000-year-old cosmic moment converging is deeply moving.",
        bestTime: "Sunrise 5:30\u20136:30 AM",
      },
    ],
    avoid: [
      "Kurukshetra Panorama Centre is closed on Mondays. Plan accordingly.",
    ],
    timingTips: [
      {
        activity: "Brahma Sarovar",
        bestTime: "Solar eclipse dates (attracts millions) or Gita Jayanti festival (December)",
        tip: "On a normal day, the sarovar is peaceful and beautiful year-round. The Aarti at dusk on the sarovar steps is calming.",
      },
    ],
    localTransport: "Kurukshetra station is in the city. Auto-rickshaws everywhere (\u20b940\u201380). Brahma Sarovar to Jyotisar: auto (\u20b960, 8 km). Delhi to Kurukshetra: 3 hrs by train (multiple daily, \u20b9130\u2013350).",
    knowBeforeYouGo: [
      "Best months: October\u2013March. Gita Jayanti (December) is the main festival with cultural events.",
      "Kurukshetra is easily done as a day trip from Delhi, Chandigarh, or Ambala.",
    ],
    stayAreas: [
      { area: "Near Brahma Sarovar (city hotels)", why: "Convenient for the main sights.", bestFor: "value, balanced" },
    ],
  },

  Chandigarh: {
    destination: "Chandigarh",
    mustEat: [
      {
        name: "Gopal Sweets, Sector 22",
        area: "Sector 22-B, Chandigarh",
        knownFor: "Best chole bhature in Chandigarh. Crispy bhatura, spiced chole, and a lump of butter.",
        price: "\u20b990\u2013160",
        tip: "Go at 9 AM on weekdays. Weekends have a 30-minute wait.",
      },
      {
        name: "Pal Dhaba",
        area: "Sector 28, Chandigarh",
        knownFor: "North Indian dhaba food elevated. Dal makhani, butter chicken, and tandoor breads. City institution.",
        price: "\u20b9250\u2013500",
      },
      {
        name: "Chinese Room, Sector 35",
        area: "Sector 35",
        knownFor: "Chandigarh\u2019s best north-Indian-Chinese fusion. Been here since 1960s.",
        price: "\u20b9200\u2013400",
      },
    ],
    streetFood: [
      { name: "Kulcha from Sector 17 stalls", area: "Sector 17 evening market", price: "\u20b930\u201060" },
      { name: "Pav bhaji near Sukhna Lake", area: "Sukhna Lake promenade stalls", price: "\u20b940\u201080" },
    ],
    shopping: [
      { what: "Phulkari embroidery from Punjab", where: "Government Emporium, Sector 17", priceRange: "\u20b9300\u20133,000", tip: "The Government Emporium is fixed-price and quality-certified for Punjabi handicrafts." },
      { what: "Books and stationery (the city has an unusual book culture)", where: "Sector 17 and Sector 22 markets", priceRange: "Varies" },
    ],
    hiddenGems: [
      {
        name: "Capitol Complex at dawn",
        what: "Le Corbusier\u2019s three UNESCO monuments \u2014 Secretariat, Legislative Assembly, and High Court \u2014 in brutal concrete",
        why: "Brutalist architecture gets a bad reputation. Corbusier\u2019s concrete here ages beautifully and the scale is extraordinary. Book a guided tour (free, weekdays).",
        bestTime: "8\u201310 AM (soft morning light on the concrete, guides available)",
      },
    ],
    avoid: [
      "Chandigarh autos don\u2019t use meters. Negotiate before boarding or use Ola/Uber.",
    ],
    timingTips: [
      {
        activity: "Rock Garden",
        bestTime: "Weekdays 9\u201311 AM",
        avoidTime: "Weekends (heavily crowded with school groups and families)",
        tip: "Allow 2 hours minimum. The garden is 40 acres and has a flow to it \u2014 don\u2019t rush through.",
      },
    ],
    localTransport: "Ola/Uber works well throughout. Autos available but negotiate. Station to Rock Garden: cab \u20b9150\u2013200. City is planned on a grid (sectors) \u2014 easy to navigate.",
    knowBeforeYouGo: [
      "Best months: March\u2013May and September\u2013December. Winter (Dec\u2013Jan) is foggy and cold.",
      "Chandigarh is the gateway city for McLeod Ganj, Manali, and Shimla trips.",
      "The city is architecturally significant but spread out. A car/cab is essential for day-2 exploration.",
    ],
    stayAreas: [
      { area: "Sector 17 and Sector 22", why: "Central, all facilities, walkable to markets.", bestFor: "value, balanced" },
      { area: "Sector 8 / Sector 35 premium area", why: "Quieter, better mid-range hotels.", bestFor: "comfort" },
    ],
  },

  Deoghar: {
    destination: "Deoghar",
    mustEat: [
      {
        name: "Hotel Apsara Restaurant",
        area: "Near Baidyanath temple",
        knownFor: "Sattvic thali served near the Jyotirlinga. Simple, clean north Indian food.",
        price: "\u20b9150\u2013300",
      },
      {
        name: "Litti Chokha stall",
        area: "Station Road area",
        knownFor: "Jharkhand\u2019s version of litti chokha \u2014 slightly different spicing from Bihar.",
        price: "\u20b960\u2013100 for 4 littis",
        tip: "Eat with mustard oil smeared on the litti and raw onion on the side. The authentic way.",
      },
    ],
    streetFood: [
      { name: "Tilkut (sesame brittle, Deoghar specialty)", area: "Near temple market", price: "\u20b960\u2013150/250g" },
      { name: "Sattu ka sharbat (cold roasted gram drink)", area: "Any stall in temple lane", price: "\u20b910\u201320" },
    ],
    shopping: [
      { what: "Tilkut (GI-tagged Deoghar sesame sweet)", where: "Temple bazaar", priceRange: "\u20b9100\u2013400/kg" },
      { what: "Religious souvenirs and Shiva items", where: "Temple shops", priceRange: "\u20b950\u2013500" },
    ],
    hiddenGems: [
      {
        name: "Shivani Mela canal walk",
        what: "The 105-km Kanwar Yatra \u2014 pilgrims carry Ganga water in decorated pots (kanwar) on foot",
        why: "During Shravan month (July\u2013August), 10+ million kanwariyas walk this route wearing saffron. One of the world\u2019s largest religious gatherings. Watching from the roadside is a profound cultural spectacle.",
        bestTime: "July\u2013August",
      },
    ],
    avoid: [
      "Visiting during Shravani Mela without accommodation booked \u2014 the town is completely overwhelmed.",
      "The temple queue can be 4\u20136 hours on Mondays and festivals. Go at 4 AM for manageable waits.",
    ],
    timingTips: [
      {
        activity: "Baidyanath Temple darshan",
        bestTime: "4\u20135 AM (mangal aarti, most auspicious, shortest queue)",
        avoidTime: "Mondays and Shravani month (July\u2013August) unless you\u2019re here specifically for it",
        tip: "The 12 Jyotirlingas have specific worship protocols. Flowers, bel patra, and water are the correct offerings. Buy from temple-approved stalls only.",
      },
    ],
    localTransport: "Jasidih is the nearest major railway station (7 km). Auto from Jasidih to temple (\u20b960\u2013100). Deoghar town is walkable from the temple. Trikuta Hills ropeway: 2 km from temple (auto \u20b940).",
    knowBeforeYouGo: [
      "Best months: October\u2013March. Shravani Mela (July\u2013August) is the main pilgrimage season.",
      "Deoghar is a Jyotirlinga pilgrimage city. Dress appropriately. Alcohol and non-veg near temple area is rare.",
      "ATMs available in town. Carry cash as some smaller shops don\u2019t accept cards.",
    ],
    stayAreas: [
      { area: "Near Baidyanath Temple", why: "Walking distance to the Jyotirlinga. All budget tiers.", bestFor: "value, balanced" },
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
