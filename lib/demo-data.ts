import { VenueItem } from "./types";

export const VENUE_SLUG = "brabham";

export const DEMO_ITEMS: VenueItem[] = [
  {
    id: "comp-afl",
    venue_slug: VENUE_SLUG,
    kind: "competition",
    sort_order: 10,
    is_active: true,
    title: "AFL Game Day Pick",
    subtitle: "Pick the winner, first goal and margin",
    description: "A clean three-pick game built for the sports bar. Entries close at the first bounce.",
    sport: "AFL",
    prize: "Brabham dining voucher + reserved table",
    starts_at: "2026-09-05T15:00:00+08:00",
    ends_at: "2026-09-05T17:40:00+08:00",
    image_url: null,
    config: {
      accent: "AFL",
      home: "Fremantle",
      away: "Collingwood",
      scorers: ["Jye Amiss", "Shai Bolton", "Bobby Hill", "Jamie Elliott", "Other"],
      marginMax: 60,
      requireVenueCheckin: false
    }
  },
  {
    id: "comp-nrl",
    venue_slug: VENUE_SLUG,
    kind: "competition",
    sort_order: 20,
    is_active: true,
    title: "NRL Friday Footy",
    subtitle: "Winner, first try scorer and winning margin",
    description: "Fast to enter and designed for repeat venue engagement before kick-off.",
    sport: "NRL",
    prize: "Sports merch pack",
    starts_at: "2026-09-04T17:00:00+08:00",
    ends_at: "2026-09-04T18:00:00+08:00",
    image_url: null,
    config: {
      home: "Panthers",
      away: "Storm",
      scorers: ["Brian To'o", "Sunia Turuva", "Xavier Coates", "Ryan Papenhuyzen", "Other"],
      marginMax: 40,
      requireVenueCheckin: false
    }
  },
  {
    id: "comp-ufc",
    venue_slug: VENUE_SLUG,
    kind: "competition",
    sort_order: 30,
    is_active: true,
    title: "UFC Main Event Predictor",
    subtitle: "Winner, method and round",
    description: "A premium fight-night prediction card for the main event.",
    sport: "UFC",
    prize: "Brabham meal voucher",
    starts_at: "2026-09-06T09:00:00+08:00",
    ends_at: "2026-09-06T11:30:00+08:00",
    image_url: null,
    config: {
      fighterA: "Fighter A",
      fighterB: "Fighter B",
      methods: ["KO / TKO", "Submission", "Decision"],
      rounds: [1, 2, 3, 4, 5],
      requireVenueCheckin: false
    }
  },
  {
    id: "comp-racing",
    venue_slug: VENUE_SLUG,
    kind: "competition",
    sort_order: 40,
    is_active: true,
    title: "Saturday Racing Pick 6",
    subtitle: "Pick a runner in six featured races",
    description: "Free tipping competition. No wagering. Most winners takes the lead.",
    sport: "RACING",
    prize: "Race-day merch + dining voucher",
    starts_at: "2026-09-05T11:00:00+08:00",
    ends_at: "2026-09-05T13:00:00+08:00",
    image_url: null,
    config: {
      races: [
        { label: "Race 1", runners: ["1. Northern Star", "2. Gold Rush", "3. Local Legend", "4. Fast Lane"] },
        { label: "Race 2", runners: ["1. Big Screen", "2. Brabham Boy", "3. Weekend Ready", "4. Trackside"] },
        { label: "Race 3", runners: ["1. New Local", "2. Pub Classic", "3. Palfrey Street", "4. Grandstand"] },
        { label: "Race 4", runners: ["1. Friday Night", "2. Racing Royalty", "3. Home Straight", "4. Full House"] },
        { label: "Race 5", runners: ["1. Game Day", "2. Main Bar", "3. Late Charge", "4. Final Call"] },
        { label: "Race 6", runners: ["1. Victory Lap", "2. Local Hero", "3. Crowd Favourite", "4. Last Round"] }
      ],
      requireVenueCheckin: false
    }
  },
  {
    id: "trivia-sports-mix",
    venue_slug: VENUE_SLUG,
    kind: "trivia_pack",
    sort_order: 50,
    is_active: true,
    title: "Sports Mix",
    subtitle: "Fast, broad and pub-friendly",
    description: "Five-question sprint for demo mode.",
    sport: "TRIVIA",
    prize: "Leaderboard bragging rights",
    image_url: null,
    config: {
      questions: [
        {
          question: "How many points is a goal worth in AFL?",
          options: ["3", "5", "6", "7"],
          answer: 2
        },
        {
          question: "How many players are on the field for one NRL team?",
          options: ["11", "12", "13", "15"],
          answer: 2
        },
        {
          question: "In UFC, what does TKO stand for?",
          options: ["Technical Knockout", "Total Knockout", "Timed Kick Out", "Technical Kick Off"],
          answer: 0
        },
        {
          question: "What surface is the Melbourne Cup run on?",
          options: ["Dirt", "Synthetic", "Turf", "Sand"],
          answer: 2
        },
        {
          question: "Which term describes a tied score in many sports?",
          options: ["Draw", "Bye", "Set", "Heat"],
          answer: 0
        }
      ]
    }
  },
  {
    id: "trivia-afl",
    venue_slug: VENUE_SLUG,
    kind: "trivia_pack",
    sort_order: 51,
    is_active: true,
    title: "AFL Fan Test",
    subtitle: "Five quick AFL questions",
    description: "Specific sports content selected from the trivia picker.",
    sport: "TRIVIA",
    image_url: null,
    config: {
      questions: [
        {
          question: "How many points is a behind worth?",
          options: ["1", "2", "3", "6"],
          answer: 0
        },
        {
          question: "How many quarters are in an AFL match?",
          options: ["2", "3", "4", "5"],
          answer: 2
        },
        {
          question: "Which line marks the centre of the ground?",
          options: ["Goal square", "Centre square", "Boundary arc", "Interchange line"],
          answer: 1
        },
        {
          question: "A mark is usually paid when a kicked ball travels at least how far?",
          options: ["5m", "10m", "15m", "25m"],
          answer: 2
        },
        {
          question: "What is the restart called after a goal?",
          options: ["Ball-up", "Throw-in", "Centre bounce", "Kick-in"],
          answer: 2
        }
      ]
    }
  },
  {
    id: "trivia-racing",
    venue_slug: VENUE_SLUG,
    kind: "trivia_pack",
    sort_order: 52,
    is_active: true,
    title: "Racing Knowledge",
    subtitle: "Horse racing without wagering",
    description: "A racing-focused knowledge pack for race-day engagement.",
    sport: "TRIVIA",
    image_url: null,
    config: {
      questions: [
        {
          question: "What is the person riding a racehorse called?",
          options: ["Trainer", "Jockey", "Starter", "Clerk"],
          answer: 1
        },
        {
          question: "What is the numbered starting structure used before a race?",
          options: ["Barrier", "Rail", "Mount", "Paddock"],
          answer: 0
        },
        {
          question: "Where are horses commonly viewed before a race?",
          options: ["Paddock", "Scoreboard", "Timekeeper's box", "Press room"],
          answer: 0
        },
        {
          question: "What does a photo finish help decide?",
          options: ["Barrier draw", "Winner", "Track rating", "Race distance"],
          answer: 1
        },
        {
          question: "What does a trainer primarily prepare?",
          options: ["The betting market", "The horse", "The broadcast", "The barrier"],
          answer: 1
        }
      ]
    }
  },
  {
    id: "event-fathers-day",
    venue_slug: VENUE_SLUG,
    kind: "event",
    sort_order: 60,
    is_active: true,
    title: "Father's Day",
    subtitle: "Sunday 6 September",
    description: "Family day with kids activities, face painting, live music and Sunday roast.",
    sport: "GENERAL",
    starts_at: "2026-09-06T12:00:00+08:00",
    ends_at: "2026-09-06T17:00:00+08:00",
    prize: "Ultimate Dad Hamper draw",
    image_url: null,
    config: {}
  },
  {
    id: "event-trivia",
    venue_slug: VENUE_SLUG,
    kind: "event",
    sort_order: 70,
    is_active: true,
    title: "Wednesday Trivia Night",
    subtitle: "Every Wednesday from 7pm",
    description: "General knowledge, pop culture, sport and more.",
    sport: "TRIVIA",
    image_url: null,
    config: {}
  },
  {
    id: "event-afl-gf",
    venue_slug: VENUE_SLUG,
    kind: "event",
    sort_order: 80,
    is_active: true,
    title: "AFL Grand Final Day",
    subtitle: "Saturday 26 September | From 11am",
    description: "Big-screen game day with sports bar seating and family-friendly entertainment.",
    sport: "AFL",
    starts_at: "2026-09-26T11:00:00+08:00",
    image_url: null,
    config: {}
  },
  {
    id: "music-weekend",
    venue_slug: VENUE_SLUG,
    kind: "music",
    sort_order: 90,
    is_active: true,
    title: "Live Music Weekends",
    subtitle: "Beer garden sessions",
    description: "Rotate artists, times and promo copy from Venue Admin.",
    sport: "MUSIC",
    image_url: null,
    config: {
      schedule: [
        { day: "Friday", time: "6:30pm", artist: "Local Acoustic Session" },
        { day: "Saturday", time: "4:00pm", artist: "Weekend Live Set" },
        { day: "Sunday", time: "3:00pm", artist: "Sunday Session" }
      ]
    }
  },
  {
    id: "prize-1",
    venue_slug: VENUE_SLUG,
    kind: "prize",
    sort_order: 100,
    is_active: true,
    title: "Brabham Dining Voucher",
    subtitle: "Venue supplied",
    description: "Simple, useful and easy for staff to fulfil.",
    sport: "GENERAL",
    prize: "$50 dining voucher",
    image_url: null,
    config: {}
  },
  {
    id: "prize-2",
    venue_slug: VENUE_SLUG,
    kind: "prize",
    sort_order: 110,
    is_active: true,
    title: "Sports Merch Pack",
    subtitle: "Competition prize template",
    description: "Use for footy, UFC or racing activations.",
    sport: "GENERAL",
    prize: "Sports merchandise pack",
    image_url: null,
    config: {}
  },
  {
    id: "prize-3",
    venue_slug: VENUE_SLUG,
    kind: "prize",
    sort_order: 120,
    is_active: true,
    title: "Reserved Game-Day Table",
    subtitle: "Experience prize",
    description: "Reserved table for a nominated live sports session.",
    sport: "GENERAL",
    prize: "Reserved table experience",
    image_url: null,
    config: {}
  }
];
