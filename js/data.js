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
    memory: "This is where our story started. ✨",
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
    memory: "The day we made it official on paper. 💗",
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
    memory: "Precious time we spent together before our wedding.",
    photos: ["1189B9A3-6283-46A5-9377-354A3984CF03_1_105_c.jpeg", "14B4951E-FA19-4B65-932D-D08B02FB2640_1_105_c.jpeg", "230FFAB6-5E02-4760-8B70-DE2D11E0213C_1_105_c.jpeg", "2884E315-67A5-453A-9FEA-F7018136799C_1_105_c.jpeg", "2FC6BD1D-B9D2-4923-A3F1-1FAE2E768987_1_105_c.jpeg", "399CF8B0-876F-480A-8D51-5DC3894767A6_1_105_c.jpeg", "40B4D410-1882-4EA7-958A-05BD62B5189F_1_105_c.jpeg", "4B3057CA-88F9-431B-9ABB-6A7E2A8FF259_1_105_c.jpeg", "52DC3E29-5201-4D5B-AACA-0E9C331EB4CA_1_105_c.jpeg", "8BBC79F4-5214-4ABD-86F3-956EE43DA2E7_1_105_c.jpeg", "99FC9F33-B2A4-439A-96D4-80673B2858EC_1_105_c.jpeg", "9A0480AC-5A30-43E0-B2E9-53814AB3F219_1_105_c.jpeg", "9DBA1325-81D1-4655-AD84-E24413527804_1_105_c.jpeg", "A6DE3A6F-4D1D-4A96-A246-A6847FA14CD6_1_105_c.jpeg", "B883B1CF-051C-4451-9083-9F0784D1BB77_1_105_c.jpeg", "C4D01A7D-E5AE-42CC-A7E2-C41C6F0D2FF8_1_105_c.jpeg", "C6666E94-F00F-4072-BD00-B98287390002_1_105_c.jpeg", "CBCD789A-C152-439C-96CE-9C47B8161321_1_105_c.jpeg", "CE24C29D-8D3D-4398-8E98-75C3D9A54055_1_105_c.jpeg", "CF84ED14-1A83-40A2-9743-2D37F59FAD0F_1_105_c.jpeg", "E3417852-5032-4005-8D17-38E6BA9D7576_1_105_c.jpeg", "E6BA4890-1E8F-41C4-A695-3BF75777B605_1_105_c.jpeg", "E9BEC00A-F42E-4C3D-98F8-AAF592F3A7ED_1_102_o.jpeg", "F39FA074-C139-426E-9B0D-C28CFC982F1B_1_105_c.jpeg", "FCA75BFE-2099-4523-BCDA-36BB940AEF00_1_105_c.jpeg"]
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
    memory: "Our big fat wedding! 🥰",
    photos: ["0C0B7AB4-4B69-43AE-A890-21A8B9FDC332_1_105_c.jpeg", "2EF06CEC-84C0-4329-878F-79E734680765_1_105_c.jpeg", "2F87500B-7CC5-44AF-8BE7-B777992B7402_1_105_c.jpeg", "389873D0-2271-4ADE-AC39-E941FBA1E547_1_105_c.jpeg", "4496A2EC-1E48-4C03-83FD-B16D53106449_1_102_a.jpeg", "4A2A7E7B-EA75-48A9-A510-55C708938790_1_105_c.jpeg", "4DBB126E-7864-41C0-BB86-712CCDD874D7_1_105_c.jpeg", "4E63518B-FDCD-4D23-AC74-A27B059043A6_1_105_c.jpeg", "57F080C3-1850-4AE1-BCF2-F60142E79CA3_1_105_c.jpeg", "593CDD6F-F48F-4C81-88E9-2064AEC41553_1_105_c.jpeg", "636D15C2-51D5-46B4-8843-0DE00A3A770E_1_105_c.jpeg", "6461B02B-0392-4792-A7D7-59E63E22D28B_1_105_c.jpeg", "759A0E9A-1D32-4CE4-93D8-F81CCF77C908_1_105_c.jpeg", "8E7A76AD-682C-4EC4-ADC5-612F63942157_1_105_c.jpeg", "96B5E1BF-877F-4772-AAE2-E48D324F7695_1_105_c.jpeg", "A606201D-7A61-4F7A-BAC0-BAE03CA87731_1_105_c.jpeg", "AC473800-1304-43C6-A8DC-FD2640A2D188_1_105_c.jpeg", "C0FAA22B-7E1A-44C8-AC8A-BB66E1EDA4EE_1_105_c.jpeg", "C6EF37A6-2819-4A53-B27C-42CFFFA74152_1_105_c.jpeg", "E46D1919-7A63-4CD0-9461-D65AC9D4B798_1_105_c.jpeg", "E5369CD5-558F-4020-B2AF-C396B8B0AA73_1_105_c.jpeg", "EB2D5CCA-27A4-4BB4-A81C-A85A0BA4B821_1_105_c.jpeg", "F2F162F5-F588-4468-9D52-34808567F280_1_105_c.jpeg"]
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
    memory: "Time with family in Guntur.",
    photos: ["0B4D292E-FB16-4ED8-8593-A10E887BBAA8_1_105_c.jpeg", "5877523A-C456-4E96-A1AC-FF5D83D7A6CC_1_105_c.jpeg", "B3EDC31C-E7FB-4B3A-AA10-F669128A9C30_1_105_c.jpeg"]
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
    memory: "Seeking blessings for our marriage and the life ahead of us.",
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
    memory: "Winding roads and blue mountain layers along the Blue Ridge Parkway.",
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
    memory: "Beach days on the South Carolina coast.",
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
    memory: "Our getaway to the beaches of Cancún.",
    photos: ["139FF380-0E12-4855-9EAC-27548F0CFAAF_1_105_c.jpeg", "13C80574-9C53-475A-A06B-C8FB212F1505_1_105_c.jpeg", "208E5A50-32E6-437D-82D1-6076D848F7A8_1_105_c.jpeg", "21C593E9-69CF-4133-8F22-10B0412606CD_1_105_c.jpeg", "2BE9D0D9-E6A2-4569-95FC-BAACE42307D9_1_105_c.jpeg", "4402A1DC-BB12-4BC2-8DFC-8DDAF74D9519_1_105_c.jpeg", "46979C5C-CEDB-493C-9EE1-C65EB4FDDD5F_1_105_c.jpeg", "7E9ABDEA-2B8C-4A49-85CC-4CEB38C11FEC_1_105_c.jpeg", "857467CC-D693-4FA5-93DC-D81142026629_1_105_c.jpeg", "9C8D224A-2653-4A7B-BDD8-EBBFA37BFF4E_1_105_c.jpeg", "9F17C7EE-E782-4299-8860-4A0D5305C189_1_105_c.jpeg", "A07BFCD7-5D08-4D71-BE78-8035F0E535D3_1_105_c.jpeg", "A75D27B6-60C0-4D70-BC6F-F6AE54FC0022_1_105_c.jpeg", "B852093B-EF60-4845-96AE-674BCCB4564D_1_105_c.jpeg", "C992F53A-A8B9-4370-8DD7-A59EC7229308_1_105_c.jpeg", "CCF53EB1-D338-4DF3-8897-FCE8F9671EC7_1_105_c.jpeg", "D042F0DD-ACF9-47D9-B5A4-A383A770F685_1_105_c.jpeg", "D294023F-EF25-4A59-8965-B547D90D3CB0_1_105_c.jpeg", "D8364A5F-32F6-4F34-9DFE-4251F1122348_1_105_c.jpeg", "E077206D-D547-4BB5-8D3C-4C8DD57FF71E_1_105_c.jpeg", "EB97E79F-51E8-4857-80DF-DC12EB0334B3_1_105_c.jpeg"]
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
    memory: "Cobblestone streets and snow in old Québec City.",
    photos: ["7DCA9F9A-3FF8-45B9-8EAC-DAE075265129_1_105_c.jpeg", "B11A2A66-B7CA-481B-AEA7-161A07EAD2E1_1_105_c.jpeg", "D62BA926-E5AD-42DE-A8AE-5B96AE988E02_1_105_c.jpeg"]
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
    memory: "The year we moved in together and built our home base. 💛",
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
    memory: "Beach days and bright nights in Miami.",
    photos: ["769C430C-64E3-4AFE-A4A2-761D28EB5224_1_105_c.jpeg", "B3B963EA-6552-4F2E-AAA9-0B1F7F0F72F0_1_105_c.jpeg", "C9EB7CD9-0810-4E25-8F0A-B233D8394A73_1_105_c.jpeg", "D3355FB0-376A-40C6-9F89-35933A50442C_1_105_c.jpeg", "F3DB8B29-58C5-4D60-AE8E-598003E6C138_1_105_c.jpeg", "FB44F963-422C-46D1-82E7-DC8BA57ADAFD_1_105_c.jpeg"]
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
    memory: "The tallest waterfall in Georgia.",
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
    memory: "Exploring the nation's capital together.",
    photos: ["2302A645-8895-44CF-9F4D-E60FC5114AF6_1_105_c.jpeg", "3527546B-F5B4-4528-9295-8B12C842A1EB_1_102_a.jpeg"]
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
    memory: "Olympic, Mount Rainier, and North Cascades — all three of Washington's national parks in one epic trip!",
    photos: ["02AC39F5-FAEB-4A8B-8C62-887D50B411A6_1_105_c.jpeg", "133C396C-91A3-44C4-AE18-2E117A205033_1_102_a.jpeg", "519C385F-1308-433F-A982-3C3F621018BE_1_105_c.jpeg", "5587278E-6AD8-4027-8DA2-E0D766F81E2D_1_105_c.jpeg", "5FCDAF87-6587-483F-AA06-DF9297698701_1_105_c.jpeg", "933A0F7B-A9BF-4D94-AD66-854E5DFF4D5C_1_105_c.jpeg", "A9137AD8-AFEC-4BE8-B4F2-BC3FD92111FE_1_105_c.jpeg", "F19F08CA-9BDD-4288-8C6B-901B7EBD3354_1_105_c.jpeg"]
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
    memory: "The mile-high city and that gorgeous mountain pass.",
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
    memory: "Fall colors and mountain air in the Poconos.",
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
    memory: "Sunshine and city lights in LA.",
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
    memory: "Endless dunes and the lowest point in North America.",
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
    memory: "Neon nights on the Strip.",
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
    memory: "Deep dish, the Bean, and the lakefront.",
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
    memory: "Spanish moss and historic squares in Savannah.",
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
    memory: "Crystal-clear alpine water surrounded by peaks.",
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
    memory: "Foggy mornings and the Golden Gate Bridge.",
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
    memory: "Fairytale cottages and dreamy beaches on the California coast.",
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
    memory: "The towering, snow-capped volcano of Northern California.",
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
    memory: "The deepest lake in the USA, impossibly blue inside an ancient volcano.",
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
    memory: "Towering red cliffs in Zion and the glowing waves of Antelope Canyon (we swung back through Death Valley too!).",
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
    memory: "Volcanoes, waterfalls, and warm ocean waves in paradise.",
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
    memory: "Holiday lights and big-city magic to close out the year.",
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
    memory: "Foggy coastal bluffs and crashing waves at Point Reyes National Seashore.",
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
    memory: "The barking sea lions and bustling boardwalk of Pier 39.",
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
    memory: "Another round of deep dish and lakefront views in Chicago.",
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
    memory: "Back at the bluest lake, this time sharing it with S's parents.",
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
    memory: "The bright lights of the Strip, this time with S's parents along for the fun.",
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
    memory: "Sharing the vast, otherworldly desert with S's parents.",
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
    memory: "Returning to the fairytale coast of Carmel with S's parents.",
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
