export interface RecallQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
}

export interface VideoItem {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  tags: string[];
  videoUrl: string;
  fallbackGradient: string;
  durationSeconds: number;
  recallQuestions: RecallQuestion[];
}

export const SAMPLE_VIDEOS: VideoItem[] = [
  {
    id: "vid_1",
    title: "Mountain Creek Serenade",
    author: "@nature_explorer",
    description: "Serene mountain creek flowing through lush green pine forest in autumn.",
    category: "Nature",
    tags: ["#nature", "#mountains", "#relaxing", "#creek"],
    // Reliable HTML5 test video streams
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    fallbackGradient: "from-emerald-800 to-teal-950",
    durationSeconds: 15,
    recallQuestions: [
      {
        id: "q1_1",
        question: "What environment was shown in the first video?",
        options: ["Desert dunes", "Mountain creek & forest", "City skyline", "Deep ocean reef"],
        correctAnswer: 1
      },
      {
        id: "q1_2",
        question: "What primary colors dominated the scene background?",
        options: ["Neon purple and yellow", "Green and natural forest tones", "Red and orange lava", "Bright blue snow"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "vid_2",
    title: "Urban Architecture in Motion",
    author: "@city_sketches",
    description: "Fast-paced timelapse of geometric glass skyscrapers reflecting twilight clouds.",
    category: "Architecture",
    tags: ["#city", "#architecture", "#timelapse", "#design"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    fallbackGradient: "from-blue-900 to-slate-950",
    durationSeconds: 15,
    recallQuestions: [
      {
        id: "q2_1",
        question: "What type of environment was depicted in the second video?",
        options: ["Tropical beach", "Subterranean cave", "Modern urban architecture", "Snowy pine forest"],
        correctAnswer: 2
      },
      {
        id: "q2_2",
        question: "What atmosphere or mood did the visuals portray?",
        options: ["Fast-paced city skyline", "Underwater calm", "Volcano eruption", "Medieval market"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: "vid_3",
    title: "Artisan Coffee Pour-Over",
    author: "@cafe_stories",
    description: "Precision pour-over coffee brewing with rich crema and steaming warmth.",
    category: "Food & Drink",
    tags: ["#coffee", "#barista", "#morning", "#artisan"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    fallbackGradient: "from-amber-900 to-stone-950",
    durationSeconds: 12,
    recallQuestions: [
      {
        id: "q3_1",
        question: "What item or activity was featured in the third video?",
        options: ["Car racing", "Coffee brewing", "Painting canvas", "Surfing waves"],
        correctAnswer: 1
      },
      {
        id: "q3_2",
        question: "What category best describes this video content?",
        options: ["Food & Drink", "Extreme Sports", "Space & Astronomy", "Wildlife"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: "vid_4",
    title: "Cosmic Nebula Exploration",
    author: "@astro_views",
    description: "Hypnotic simulation through vibrant stellar gas clouds and distant galaxies.",
    category: "Science",
    tags: ["#space", "#astronomy", "#cosmos", "#3d"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyplays.mp4",
    fallbackGradient: "from-purple-900 to-indigo-950",
    durationSeconds: 15,
    recallQuestions: [
      {
        id: "q4_1",
        question: "What theme was presented in the fourth video?",
        options: ["Cosmic nebula / space", "Cooking steak", "Basketball match", "Gardening"],
        correctAnswer: 0
      },
      {
        id: "q4_2",
        question: "Which visual elements were central to this video?",
        options: ["Stellar gas and glowing stars", "Racing cars on asphalt", "Cooking utensils", "Dense jungle foliage"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: "vid_5",
    title: "Neon Cybernetic Beats",
    author: "@synth_waves",
    description: "Futuristic digital synthesizer visualizer bouncing with pulsing neon grids.",
    category: "Music & Tech",
    tags: ["#synthwave", "#neon", "#cyberpunk", "#music"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    fallbackGradient: "from-fuchsia-900 to-violet-950",
    durationSeconds: 15,
    recallQuestions: [
      {
        id: "q5_1",
        question: "What aesthetic was featured in the fifth video?",
        options: ["Neon cybernetic / synthwave", "Vintage 1920s black and white", "Rustic wooden farm", "Minimalist white gallery"],
        correctAnswer: 0
      },
      {
        id: "q5_2",
        question: "How many videos were shown in total in the feed?",
        options: ["3 videos", "5 videos", "8 videos", "10 videos"],
        correctAnswer: 1
      }
    ]
  }
];
