/* =============================================================================
   OUR JOURNEY — DATA FILE
   -----------------------------------------------------------------------------
   This is the ONE file you edit to change places, dates, memories, and photos.
   You do NOT need to know how to code. Just carefully edit the text between the
   quotes " " for each place. Keep the commas and brackets exactly where they are.

   For each place you can change:
     name       -> the title shown on the map + page
     subtitle   -> a short line under the title
     date       -> the pretty date shown to visitors (any text you like)
     memory     -> your story / memories for that place (this can be long!)
     photos     -> list of photo file names you put in  photos/<id>/  (see README)

   Places marked  guessDate: true  are ones where you didn't give me a date, so I
   placed them on the trail using my best guess. Feel free to move them by changing
   the "sort" value (used only to order the dotted trail line).
   ========================================================================== */

const PLACES = [
  {
    id: "toronto-2022",
    name: "Toronto",
    subtitle: "Where it all began — the day we first met 💫",
    date: "2022",
    sort: "2022-06-01",
    coords: [43.6532, -79.3832],
    country: "Canada",
    region: "Ontario",
    category: "milestone",
    emoji: "💞",
    nationalParks: 0,
    memory: "This is where our story started. Write about the day you first met here — how it felt, what you remember most, that very first spark. ✨",
    photos: []
  },
  {
    id: "toronto-2023",
    name: "Toronto",
    subtitle: "Our paper wedding 💍",
    date: "January 5, 2023",
    sort: "2023-01-05",
    coords: [43.6620, -79.3960],
    country: "Canada",
    region: "Ontario",
    category: "milestone",
    emoji: "💍",
    nationalParks: 0,
    memory: "The day we made it official on paper. Write about how it felt to say yes to forever together. 💗",
    photos: []
  },
  {
    id: "charlotte-2023",
    name: "Charlotte",
    subtitle: "Time together before the wedding",
    date: "2023",
    sort: "2023-03-01",
    coords: [35.2271, -80.8431],
    country: "USA",
    region: "North Carolina",
    category: "city",
    emoji: "🏙️",
    nationalParks: 0,
    memory: "Precious time we spent together before our wedding. Add your favorite moments here.",
    photos: []
  },
  {
    id: "hyderabad-2023",
    name: "Hyderabad",
    subtitle: "Our wedding 🎉",
    date: "May 2023",
    sort: "2023-05-10",
    coords: [17.3850, 78.4867],
    country: "India",
    region: "Telangana",
    category: "milestone",
    emoji: "💒",
    nationalParks: 0,
    memory: "Our big fat wedding! Write about the celebrations, the people, the colors, and the joy of the day we became husband and wife. 🥰",
    photos: []
  },
  {
    id: "guntur-2023",
    name: "Guntur",
    subtitle: "Home & family",
    date: "May 2023",
    sort: "2023-05-15",
    coords: [16.3067, 80.4365],
    country: "India",
    region: "Andhra Pradesh",
    category: "city",
    emoji: "🏡",
    nationalParks: 0,
    memory: "Time with family in Guntur. Add your memories here.",
    photos: []
  },
  {
    id: "tirupati-2023",
    name: "Tirupati",
    subtitle: "Blessings for our new journey 🙏",
    date: "May 2023",
    sort: "2023-05-20",
    coords: [13.6288, 79.4192],
    country: "India",
    region: "Andhra Pradesh",
    category: "milestone",
    emoji: "🙏",
    nationalParks: 0,
    memory: "Seeking blessings for our marriage and the life ahead of us. Add your memories here.",
    photos: []
  },
  {
    id: "asheville-2023",
    name: "Asheville & the Blue Ridge Parkway",
    subtitle: "Mountains and misty views",
    date: "July 2023",
    sort: "2023-07-15",
    coords: [35.5951, -82.5515],
    country: "USA",
    region: "North Carolina",
    category: "nature",
    emoji: "🏔️",
    nationalParks: 0,
    memory: "Winding roads and blue mountain layers along the Blue Ridge Parkway. Add your memories here.",
    photos: []
  },
  {
    id: "myrtle-beach-2023",
    name: "Myrtle Beach",
    subtitle: "Sun, sand & the boardwalk",
    date: "July 2023",
    sort: "2023-07-25",
    coords: [33.6891, -78.8867],
    country: "USA",
    region: "South Carolina",
    category: "beach",
    emoji: "🏖️",
    nationalParks: 0,
    memory: "Beach days on the South Carolina coast. Add your memories here.",
    photos: []
  },
  {
    id: "cancun-2023",
    name: "Cancún, Mexico",
    subtitle: "Turquoise water & sunshine 🏝️",
    date: "November 2023",
    sort: "2023-11-10",
    coords: [21.1619, -86.8515],
    country: "Mexico",
    region: "Quintana Roo",
    category: "beach",
    emoji: "🏖️",
    nationalParks: 0,
    memory: "Our getaway to the beaches of Cancún. Add your memories here.",
    photos: []
  },
  {
    id: "quebec-2024",
    name: "Québec City",
    subtitle: "A snowy European fairytale",
    date: "February 2024",
    sort: "2024-02-15",
    coords: [46.8139, -71.2080],
    country: "Canada",
    region: "Québec",
    category: "city",
    emoji: "❄️",
    nationalParks: 0,
    memory: "Cobblestone streets and snow in old Québec City. Add your memories here.",
    photos: []
  },
  {
    id: "atlanta-2024",
    name: "Atlanta",
    subtitle: "Where we made our home together 🏠",
    date: "2024",
    sort: "2024-04-01",
    coords: [33.7490, -84.3880],
    country: "USA",
    region: "Georgia",
    category: "milestone",
    emoji: "🏠",
    nationalParks: 0,
    memory: "The year we moved in together and built our home base. Add your memories here. 💛",
    photos: []
  },
  {
    id: "miami-2024",
    name: "Miami",
    subtitle: "Sun, palms & city nights",
    date: "May 2024",
    sort: "2024-05-15",
    coords: [25.7617, -80.1918],
    country: "USA",
    region: "Florida",
    category: "beach",
    emoji: "🌴",
    nationalParks: 0,
    memory: "Beach days and bright nights in Miami. Add your memories here.",
    photos: []
  },
  {
    id: "amicalola-2024",
    name: "Amicalola Falls",
    subtitle: "Chasing waterfalls",
    date: "2024",
    sort: "2024-06-01",
    guessDate: true,
    coords: [34.5595, -84.2469],
    country: "USA",
    region: "Georgia",
    category: "nature",
    emoji: "💦",
    nationalParks: 0,
    memory: "The tallest waterfall in Georgia. (I guessed the date on this one — feel free to change it!) Add your memories here.",
    photos: []
  },
  {
    id: "washington-dc",
    name: "Washington, D.C.",
    subtitle: "Monuments & history",
    date: "2024",
    sort: "2024-07-01",
    guessDate: true,
    coords: [38.9072, -77.0369],
    country: "USA",
    region: "Washington, D.C.",
    category: "city",
    emoji: "🏛️",
    nationalParks: 0,
    memory: "Exploring the nation's capital together. (I guessed the date on this one — feel free to change it!) Add your memories here.",
    photos: []
  },
  {
    id: "washington-state-2024",
    name: "Washington State",
    subtitle: "All three national parks 🌲",
    date: "August 2024",
    sort: "2024-08-10",
    coords: [47.7511, -120.7401],
    country: "USA",
    region: "Washington",
    category: "nature",
    emoji: "🏞️",
    nationalParks: 3,
    memory: "Olympic, Mount Rainier, and North Cascades — all three of Washington's national parks in one epic trip! Add your memories here.",
    photos: []
  },
  {
    id: "denver-2024",
    name: "Denver & the Colorado Rockies",
    subtitle: "That unforgettable mountain pass",
    date: "August 2024",
    sort: "2024-08-20",
    coords: [39.7392, -104.9903],
    country: "USA",
    region: "Colorado",
    category: "nature",
    emoji: "⛰️",
    nationalParks: 0,
    memory: "The mile-high city and that gorgeous mountain pass. Add the name of the pass and your memories here.",
    photos: []
  },
  {
    id: "poconos-2024",
    name: "Pocono Mountains",
    subtitle: "Cozy autumn in Pennsylvania 🍂",
    date: "October 2024",
    sort: "2024-10-15",
    coords: [41.1220, -75.3616],
    country: "USA",
    region: "Pennsylvania",
    category: "nature",
    emoji: "🍁",
    nationalParks: 0,
    memory: "Fall colors and mountain air in the Poconos. Add your memories here.",
    photos: []
  },
  {
    id: "la-2024",
    name: "Los Angeles",
    subtitle: "City of angels",
    date: "November 2024",
    sort: "2024-11-05",
    coords: [34.0522, -118.2437],
    country: "USA",
    region: "California",
    category: "city",
    emoji: "🌆",
    nationalParks: 0,
    memory: "Sunshine and city lights in LA. Add your memories here.",
    photos: []
  },
  {
    id: "death-valley-2024",
    name: "Death Valley",
    subtitle: "The vast, otherworldly desert",
    date: "November 2024",
    sort: "2024-11-10",
    coords: [36.5054, -117.0794],
    country: "USA",
    region: "California",
    category: "nature",
    emoji: "🏜️",
    nationalParks: 1,
    memory: "Endless dunes and the lowest point in North America. Add your memories here.",
    photos: []
  },
  {
    id: "las-vegas-2024",
    name: "Las Vegas",
    subtitle: "Bright lights & big fun ✨",
    date: "November 2024",
    sort: "2024-11-15",
    coords: [36.1699, -115.1398],
    country: "USA",
    region: "Nevada",
    category: "city",
    emoji: "🎰",
    nationalParks: 0,
    memory: "Neon nights on the Strip. Add your memories here.",
    photos: []
  },
  {
    id: "chicago-2025",
    name: "Chicago",
    subtitle: "The Windy City",
    date: "March 2025",
    sort: "2025-03-15",
    coords: [41.8781, -87.6298],
    country: "USA",
    region: "Illinois",
    category: "city",
    emoji: "🌃",
    nationalParks: 0,
    memory: "Deep dish, the Bean, and the lakefront. Add your memories here.",
    photos: []
  },
  {
    id: "savannah-2025",
    name: "Savannah",
    subtitle: "Southern charm & oak-lined streets",
    date: "April 2025",
    sort: "2025-04-15",
    coords: [32.0809, -81.0912],
    country: "USA",
    region: "Georgia",
    category: "city",
    emoji: "🌳",
    nationalParks: 0,
    memory: "Spanish moss and historic squares in Savannah. Add your memories here.",
    photos: []
  },
  {
    id: "lake-tahoe-2025",
    name: "Lake Tahoe",
    subtitle: "Bluest water in the mountains",
    date: "May 2025",
    sort: "2025-05-10",
    coords: [39.0968, -120.0324],
    country: "USA",
    region: "California / Nevada",
    category: "nature",
    emoji: "🏔️",
    nationalParks: 0,
    memory: "Crystal-clear alpine water surrounded by peaks. Add your memories here.",
    photos: []
  },
  {
    id: "san-francisco-2025",
    name: "San Francisco",
    subtitle: "Golden Gate & rolling hills",
    date: "2025",
    sort: "2025-05-15",
    guessDate: true,
    coords: [37.7749, -122.4194],
    country: "USA",
    region: "California",
    category: "city",
    emoji: "🌉",
    nationalParks: 0,
    memory: "Foggy mornings and the Golden Gate Bridge. (I guessed the date on this one — feel free to change it!) Add your memories here.",
    photos: []
  },
  {
    id: "carmel-2025",
    name: "Carmel-by-the-Sea",
    subtitle: "A storybook coastal town",
    date: "2025",
    sort: "2025-05-18",
    guessDate: true,
    coords: [36.5552, -121.9233],
    country: "USA",
    region: "California",
    category: "beach",
    emoji: "🐚",
    nationalParks: 0,
    memory: "Fairytale cottages and dreamy beaches on the California coast. (I guessed the date on this one — feel free to change it!) Add your memories here.",
    photos: []
  },
  {
    id: "shasta-2025",
    name: "Mount Shasta",
    subtitle: "A majestic snow-capped giant",
    date: "2025",
    sort: "2025-08-05",
    guessDate: true,
    coords: [41.4092, -122.1949],
    country: "USA",
    region: "California",
    category: "nature",
    emoji: "🗻",
    nationalParks: 0,
    memory: "The towering, snow-capped volcano of Northern California. (I guessed the date on this one — feel free to change it!) Add your memories here.",
    photos: []
  },
  {
    id: "crater-lake-2025",
    name: "Crater Lake",
    subtitle: "The deepest, bluest lake 💙",
    date: "August 2025",
    sort: "2025-08-15",
    coords: [42.9446, -122.1090],
    country: "USA",
    region: "Oregon",
    category: "nature",
    emoji: "🌊",
    nationalParks: 1,
    memory: "The deepest lake in the USA, impossibly blue inside an ancient volcano. Add your memories here.",
    photos: []
  },
  {
    id: "zion-2025",
    name: "Zion & Antelope Canyon",
    subtitle: "Red rock canyons & desert light",
    date: "October 2025",
    sort: "2025-10-15",
    coords: [37.2982, -113.0263],
    country: "USA",
    region: "Utah / Arizona",
    category: "nature",
    emoji: "🧡",
    nationalParks: 1,
    memory: "Towering red cliffs in Zion and the glowing waves of Antelope Canyon (we swung back through Death Valley too!). Add your memories here.",
    photos: []
  },
  {
    id: "hawaii-2025",
    name: "Hawaii",
    subtitle: "Paradise found 🌺",
    date: "November 2025",
    sort: "2025-11-10",
    coords: [20.7984, -156.3319],
    country: "USA",
    region: "Hawaii",
    category: "beach",
    emoji: "🌺",
    nationalParks: 0,
    memory: "Volcanoes, waterfalls, and warm ocean waves in paradise. Add your memories here.",
    photos: []
  },
  {
    id: "new-york-2025",
    name: "New York City",
    subtitle: "The city that never sleeps",
    date: "November / December 2025",
    sort: "2025-11-25",
    coords: [40.7128, -74.0060],
    country: "USA",
    region: "New York",
    category: "city",
    emoji: "🗽",
    nationalParks: 0,
    memory: "Holiday lights and big-city magic to close out the year. Add your memories here.",
    photos: []
  },
  {
    id: "point-reyes-2026",
    name: "Point Reyes",
    subtitle: "Windswept cliffs & sea lions",
    date: "January 2026",
    sort: "2026-01-15",
    coords: [38.0723, -122.8869],
    country: "USA",
    region: "California",
    category: "nature",
    emoji: "🦭",
    nationalParks: 0,
    memory: "Foggy coastal bluffs and crashing waves at Point Reyes National Seashore. Add your memories here.",
    photos: []
  },
  {
    id: "pier-39-2026",
    name: "Pier 39, San Francisco",
    subtitle: "Sea lions, sourdough & the bay",
    date: "Spring 2026",
    sort: "2026-04-10",
    guessDate: true,
    coords: [37.8087, -122.4098],
    country: "USA",
    region: "California",
    category: "city",
    emoji: "⚓",
    nationalParks: 0,
    memory: "The barking sea lions and bustling boardwalk of Pier 39. (I guessed the exact date — feel free to change it!) Add your memories here.",
    photos: []
  },
  {
    id: "chicago-2026",
    name: "Chicago",
    subtitle: "Back in the Windy City",
    date: "May 2026",
    sort: "2026-05-25",
    coords: [41.9281, -87.6298],
    country: "USA",
    region: "Illinois",
    category: "city",
    emoji: "🌆",
    nationalParks: 0,
    memory: "Another round of deep dish and lakefront views in Chicago. Add your memories here.",
    photos: []
  },
  {
    id: "lake-tahoe-2026",
    name: "Lake Tahoe",
    subtitle: "Alpine blue — with S's parents 💙",
    date: "May 2026",
    sort: "2026-05-28",
    coords: [39.1468, -120.0324],
    country: "USA",
    region: "California / Nevada",
    category: "nature",
    emoji: "🏔️",
    nationalParks: 0,
    memory: "Back at the bluest lake, this time sharing it with S's parents. Add your memories here.",
    photos: []
  },
  {
    id: "las-vegas-2026",
    name: "Las Vegas",
    subtitle: "Neon nights with the family",
    date: "May 2026",
    sort: "2026-05-30",
    coords: [36.2199, -115.1398],
    country: "USA",
    region: "Nevada",
    category: "city",
    emoji: "🎰",
    nationalParks: 0,
    memory: "The bright lights of the Strip, this time with S's parents along for the fun. Add your memories here.",
    photos: []
  },
  {
    id: "death-valley-2026",
    name: "Death Valley",
    subtitle: "The desert, again — family edition",
    date: "June 2026",
    sort: "2026-06-01",
    coords: [36.5554, -117.0794],
    country: "USA",
    region: "California",
    category: "nature",
    emoji: "🏜️",
    nationalParks: 0,
    memory: "Sharing the vast, otherworldly desert with S's parents. Add your memories here.",
    photos: []
  },
  {
    id: "carmel-2026",
    name: "Carmel-by-the-Sea",
    subtitle: "Storybook coast with the family",
    date: "June 2026",
    sort: "2026-06-03",
    coords: [36.5852, -121.9233],
    country: "USA",
    region: "California",
    category: "beach",
    emoji: "🐚",
    nationalParks: 0,
    memory: "Returning to the fairytale coast of Carmel with S's parents. Add your memories here.",
    photos: []
  }
];

/* -----------------------------------------------------------------------------
   Colors & labels for each category of pin (you can tweak the colors if you like)
   -------------------------------------------------------------------------- */
const CATEGORIES = {
  milestone: { color: "#fbbf24", label: "Milestones" },
  nature:    { color: "#34d399", label: "Nature & Parks" },
  city:      { color: "#38bdf8", label: "City Trips" },
  beach:     { color: "#a78bfa", label: "Beaches & Coast" }
};

/* The specific national parks we've set foot in (used by the stat pop-up) */
const NATIONAL_PARKS = [
  "Olympic 🌲", "Mount Rainier 🏔️", "North Cascades 🏞️",
  "Death Valley 🏜️", "Crater Lake 🌊", "Zion 🧡",
  "Hawaii Volcanoes 🌋", "Great Smoky Mountains 🌫️",
  "Joshua Tree 🌵", "Antelope Canyon 🏜️"
];
window.NATIONAL_PARKS = NATIONAL_PARKS;

/* Make the data available to the other scripts */
window.PLACES = PLACES.slice().sort((a, b) => a.sort.localeCompare(b.sort));
window.CATEGORIES = CATEGORIES;

/* ---------- Distance helpers (great-circle "as the crow flies") ---------- */
function haversineMiles(a, b) {
  const R = 3958.8; // Earth radius in miles
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
window.haversineMiles = haversineMiles;

// Total miles along the whole chronological journey
window.totalJourneyMiles = (function () {
  let sum = 0;
  for (let i = 1; i < window.PLACES.length; i++) {
    sum += haversineMiles(window.PLACES[i - 1].coords, window.PLACES[i].coords);
  }
  return sum;
})();
