export type Emotion = 'happy' | 'tired' | 'working' | 'eating' | 'chatting' | 'sleeping' | 'relaxing' | 'excited' | 'bored' | 'stressed';

export type Activity =
  | 'sleeping'
  | 'waking_up'
  | 'having_breakfast'
  | 'going_to_work'
  | 'working'
  | 'having_lunch'
  | 'socializing'
  | 'shopping'
  | 'relaxing_park'
  | 'having_dinner'
  | 'going_home'
  | 'evening_leisure'
  | 'going_to_bed';

export type LocationKey =
  | 'home_alice'
  | 'home_bob'
  | 'home_carol'
  | 'home_dave'
  | 'home_emma'
  | 'home_frank'
  | 'home_grace'
  | 'home_henry'
  | 'home_iris'
  | 'home_jack'
  | 'office'
  | 'cafe'
  | 'park'
  | 'shop'
  | 'plaza';

export interface Location {
  key: LocationKey;
  label: string;
  x: number;
  z: number;
}

export const LOCATIONS: Record<LocationKey, Location> = {
  home_alice: { key: 'home_alice', label: 'Alice\'s Home', x: -18, z: -18 },
  home_bob:   { key: 'home_bob',   label: 'Bob\'s Home',   x: -10, z: -18 },
  home_carol: { key: 'home_carol', label: 'Carol\'s Home', x: -2,  z: -18 },
  home_dave:  { key: 'home_dave',  label: 'Dave\'s Home',  x: 6,   z: -18 },
  home_emma:  { key: 'home_emma',  label: 'Emma\'s Home',  x: 14,  z: -18 },
  home_frank: { key: 'home_frank', label: 'Frank\'s Home', x: -18, z: -10 },
  home_grace: { key: 'home_grace', label: 'Grace\'s Home', x: -18, z: -2  },
  home_henry: { key: 'home_henry', label: 'Henry\'s Home', x: 18,  z: -18 },
  home_iris:  { key: 'home_iris',  label: 'Iris\'s Home',  x: -18, z: 6   },
  home_jack:  { key: 'home_jack',  label: 'Jack\'s Home',  x: -18, z: 14  },
  office: { key: 'office', label: 'Office', x: 14,  z: 10  },
  cafe:   { key: 'cafe',   label: 'Café',   x: 0,   z: 10  },
  park:   { key: 'park',   label: 'Park',   x: 6,   z: 0   },
  shop:   { key: 'shop',   label: 'Shop',   x: 14,  z: 0   },
  plaza:  { key: 'plaza',  label: 'Plaza',  x: 0,   z: 0   },
};

export interface ScheduleEntry {
  startHour: number;
  endHour: number;
  activity: Activity;
  location: LocationKey;
  emotion: Emotion;
}

export interface AgentDefinition {
  id: string;
  name: string;
  role: string;
  color: string;
  personality: string[];
  goals: string[];
  homeLocation: LocationKey;
  schedule: ScheduleEntry[];
  dialogueStyle: 'formal' | 'casual' | 'shy' | 'enthusiastic' | 'grumpy';
}

export const AGENTS: AgentDefinition[] = [
  {
    id: 'alice',
    name: 'Alice',
    role: 'Teacher',
    color: '#FF6B9D',
    personality: ['Caring', 'Patient', 'Organized'],
    goals: ['Inspire students', 'Stay healthy', 'Learn new things'],
    homeLocation: 'home_alice',
    dialogueStyle: 'formal',
    schedule: [
      { startHour: 0,  endHour: 6,  activity: 'sleeping',         location: 'home_alice', emotion: 'sleeping' },
      { startHour: 6,  endHour: 7,  activity: 'waking_up',        location: 'home_alice', emotion: 'tired'    },
      { startHour: 7,  endHour: 8,  activity: 'having_breakfast', location: 'cafe',       emotion: 'happy'    },
      { startHour: 8,  endHour: 9,  activity: 'going_to_work',    location: 'office',     emotion: 'working'  },
      { startHour: 9,  endHour: 12, activity: 'working',          location: 'office',     emotion: 'working'  },
      { startHour: 12, endHour: 13, activity: 'having_lunch',     location: 'cafe',       emotion: 'eating'   },
      { startHour: 13, endHour: 17, activity: 'working',          location: 'office',     emotion: 'working'  },
      { startHour: 17, endHour: 18, activity: 'going_home',       location: 'park',       emotion: 'relaxing' },
      { startHour: 18, endHour: 19, activity: 'relaxing_park',    location: 'park',       emotion: 'happy'    },
      { startHour: 19, endHour: 20, activity: 'having_dinner',    location: 'home_alice', emotion: 'eating'   },
      { startHour: 20, endHour: 22, activity: 'evening_leisure',  location: 'home_alice', emotion: 'relaxing' },
      { startHour: 22, endHour: 24, activity: 'sleeping',         location: 'home_alice', emotion: 'sleeping' },
    ],
  },
  {
    id: 'bob',
    name: 'Bob',
    role: 'Baker',
    color: '#FFB347',
    personality: ['Cheerful', 'Creative', 'Early riser'],
    goals: ['Bake perfect bread', 'Make people happy', 'Socialize'],
    homeLocation: 'home_bob',
    dialogueStyle: 'enthusiastic',
    schedule: [
      { startHour: 0,  endHour: 5,  activity: 'sleeping',         location: 'home_bob',   emotion: 'sleeping' },
      { startHour: 5,  endHour: 6,  activity: 'waking_up',        location: 'home_bob',   emotion: 'tired'    },
      { startHour: 6,  endHour: 12, activity: 'working',          location: 'cafe',        emotion: 'working'  },
      { startHour: 12, endHour: 13, activity: 'having_lunch',     location: 'plaza',       emotion: 'eating'   },
      { startHour: 13, endHour: 15, activity: 'socializing',      location: 'park',        emotion: 'happy'    },
      { startHour: 15, endHour: 17, activity: 'shopping',         location: 'shop',        emotion: 'relaxing' },
      { startHour: 17, endHour: 19, activity: 'having_dinner',    location: 'home_bob',    emotion: 'eating'   },
      { startHour: 19, endHour: 21, activity: 'evening_leisure',  location: 'plaza',       emotion: 'happy'    },
      { startHour: 21, endHour: 24, activity: 'sleeping',         location: 'home_bob',    emotion: 'sleeping' },
    ],
  },
  {
    id: 'carol',
    name: 'Carol',
    role: 'Doctor',
    color: '#4ECDC4',
    personality: ['Serious', 'Dedicated', 'Empathetic'],
    goals: ['Help patients', 'Research medicine', 'Work life balance'],
    homeLocation: 'home_carol',
    dialogueStyle: 'formal',
    schedule: [
      { startHour: 0,  endHour: 7,  activity: 'sleeping',         location: 'home_carol', emotion: 'sleeping' },
      { startHour: 7,  endHour: 8,  activity: 'waking_up',        location: 'home_carol', emotion: 'tired'    },
      { startHour: 8,  endHour: 9,  activity: 'having_breakfast', location: 'home_carol', emotion: 'happy'    },
      { startHour: 9,  endHour: 13, activity: 'working',          location: 'office',     emotion: 'working'  },
      { startHour: 13, endHour: 14, activity: 'having_lunch',     location: 'cafe',       emotion: 'eating'   },
      { startHour: 14, endHour: 18, activity: 'working',          location: 'office',     emotion: 'stressed' },
      { startHour: 18, endHour: 20, activity: 'relaxing_park',    location: 'park',       emotion: 'relaxing' },
      { startHour: 20, endHour: 22, activity: 'having_dinner',    location: 'home_carol', emotion: 'eating'   },
      { startHour: 22, endHour: 24, activity: 'sleeping',         location: 'home_carol', emotion: 'sleeping' },
    ],
  },
  {
    id: 'dave',
    name: 'Dave',
    role: 'Engineer',
    color: '#45B7D1',
    personality: ['Analytical', 'Introverted', 'Precise'],
    goals: ['Build great software', 'Learn new tech', 'Find quiet time'],
    homeLocation: 'home_dave',
    dialogueStyle: 'casual',
    schedule: [
      { startHour: 0,  endHour: 8,  activity: 'sleeping',         location: 'home_dave',  emotion: 'sleeping' },
      { startHour: 8,  endHour: 9,  activity: 'having_breakfast', location: 'home_dave',  emotion: 'tired'    },
      { startHour: 9,  endHour: 12, activity: 'working',          location: 'office',     emotion: 'working'  },
      { startHour: 12, endHour: 13, activity: 'having_lunch',     location: 'cafe',       emotion: 'eating'   },
      { startHour: 13, endHour: 18, activity: 'working',          location: 'office',     emotion: 'working'  },
      { startHour: 18, endHour: 20, activity: 'shopping',         location: 'shop',       emotion: 'relaxing' },
      { startHour: 20, endHour: 22, activity: 'evening_leisure',  location: 'home_dave',  emotion: 'happy'    },
      { startHour: 22, endHour: 24, activity: 'sleeping',         location: 'home_dave',  emotion: 'sleeping' },
    ],
  },
  {
    id: 'emma',
    name: 'Emma',
    role: 'Artist',
    color: '#A8E6CF',
    personality: ['Creative', 'Dreamy', 'Sensitive'],
    goals: ['Create inspiring art', 'Find beauty', 'Connect with nature'],
    homeLocation: 'home_emma',
    dialogueStyle: 'enthusiastic',
    schedule: [
      { startHour: 0,  endHour: 9,  activity: 'sleeping',         location: 'home_emma',  emotion: 'sleeping' },
      { startHour: 9,  endHour: 10, activity: 'waking_up',        location: 'home_emma',  emotion: 'relaxing' },
      { startHour: 10, endHour: 12, activity: 'relaxing_park',    location: 'park',       emotion: 'happy'    },
      { startHour: 12, endHour: 13, activity: 'having_lunch',     location: 'cafe',       emotion: 'eating'   },
      { startHour: 13, endHour: 17, activity: 'working',          location: 'plaza',      emotion: 'working'  },
      { startHour: 17, endHour: 19, activity: 'socializing',      location: 'cafe',       emotion: 'chatting' },
      { startHour: 19, endHour: 21, activity: 'having_dinner',    location: 'home_emma',  emotion: 'eating'   },
      { startHour: 21, endHour: 23, activity: 'evening_leisure',  location: 'park',       emotion: 'relaxing' },
      { startHour: 23, endHour: 24, activity: 'sleeping',         location: 'home_emma',  emotion: 'sleeping' },
    ],
  },
  {
    id: 'frank',
    name: 'Frank',
    role: 'Shop Owner',
    color: '#DDA0DD',
    personality: ['Grumpy', 'Hardworking', 'Loyal'],
    goals: ['Run successful shop', 'Keep regular customers', 'Retire peacefully'],
    homeLocation: 'home_frank',
    dialogueStyle: 'grumpy',
    schedule: [
      { startHour: 0,  endHour: 6,  activity: 'sleeping',         location: 'home_frank', emotion: 'sleeping' },
      { startHour: 6,  endHour: 7,  activity: 'waking_up',        location: 'home_frank', emotion: 'tired'    },
      { startHour: 7,  endHour: 8,  activity: 'having_breakfast', location: 'home_frank', emotion: 'eating'   },
      { startHour: 8,  endHour: 18, activity: 'working',          location: 'shop',       emotion: 'working'  },
      { startHour: 18, endHour: 19, activity: 'having_dinner',    location: 'cafe',       emotion: 'eating'   },
      { startHour: 19, endHour: 21, activity: 'relaxing_park',    location: 'park',       emotion: 'relaxing' },
      { startHour: 21, endHour: 24, activity: 'sleeping',         location: 'home_frank', emotion: 'sleeping' },
    ],
  },
  {
    id: 'grace',
    name: 'Grace',
    role: 'Student',
    color: '#98D8C8',
    personality: ['Curious', 'Energetic', 'Social'],
    goals: ['Graduate with honors', 'Make friends', 'Explore the world'],
    homeLocation: 'home_grace',
    dialogueStyle: 'casual',
    schedule: [
      { startHour: 0,  endHour: 7,  activity: 'sleeping',         location: 'home_grace', emotion: 'sleeping' },
      { startHour: 7,  endHour: 8,  activity: 'waking_up',        location: 'home_grace', emotion: 'tired'    },
      { startHour: 8,  endHour: 9,  activity: 'having_breakfast', location: 'cafe',       emotion: 'happy'    },
      { startHour: 9,  endHour: 12, activity: 'working',          location: 'office',     emotion: 'working'  },
      { startHour: 12, endHour: 13, activity: 'having_lunch',     location: 'plaza',      emotion: 'eating'   },
      { startHour: 13, endHour: 16, activity: 'working',          location: 'office',     emotion: 'working'  },
      { startHour: 16, endHour: 18, activity: 'socializing',      location: 'park',       emotion: 'chatting' },
      { startHour: 18, endHour: 20, activity: 'shopping',         location: 'shop',       emotion: 'happy'    },
      { startHour: 20, endHour: 22, activity: 'evening_leisure',  location: 'cafe',       emotion: 'relaxing' },
      { startHour: 22, endHour: 24, activity: 'sleeping',         location: 'home_grace', emotion: 'sleeping' },
    ],
  },
  {
    id: 'henry',
    name: 'Henry',
    role: 'Chef',
    color: '#F0A500',
    personality: ['Passionate', 'Perfectionist', 'Warm'],
    goals: ['Cook perfect meals', 'Share culture', 'Win cooking award'],
    homeLocation: 'home_henry',
    dialogueStyle: 'enthusiastic',
    schedule: [
      { startHour: 0,  endHour: 7,  activity: 'sleeping',         location: 'home_henry', emotion: 'sleeping' },
      { startHour: 7,  endHour: 8,  activity: 'waking_up',        location: 'home_henry', emotion: 'tired'    },
      { startHour: 8,  endHour: 10, activity: 'shopping',         location: 'shop',       emotion: 'happy'    },
      { startHour: 10, endHour: 15, activity: 'working',          location: 'cafe',       emotion: 'working'  },
      { startHour: 15, endHour: 16, activity: 'having_lunch',     location: 'cafe',       emotion: 'eating'   },
      { startHour: 16, endHour: 20, activity: 'working',          location: 'cafe',       emotion: 'working'  },
      { startHour: 20, endHour: 22, activity: 'socializing',      location: 'plaza',      emotion: 'chatting' },
      { startHour: 22, endHour: 24, activity: 'sleeping',         location: 'home_henry', emotion: 'sleeping' },
    ],
  },
  {
    id: 'iris',
    name: 'Iris',
    role: 'Journalist',
    color: '#E8A0BF',
    personality: ['Inquisitive', 'Bold', 'Social butterfly'],
    goals: ['Break big story', 'Meet interesting people', 'Travel'],
    homeLocation: 'home_iris',
    dialogueStyle: 'enthusiastic',
    schedule: [
      { startHour: 0,  endHour: 8,  activity: 'sleeping',         location: 'home_iris',  emotion: 'sleeping' },
      { startHour: 8,  endHour: 9,  activity: 'waking_up',        location: 'home_iris',  emotion: 'excited'  },
      { startHour: 9,  endHour: 11, activity: 'working',          location: 'cafe',       emotion: 'working'  },
      { startHour: 11, endHour: 13, activity: 'socializing',      location: 'plaza',      emotion: 'chatting' },
      { startHour: 13, endHour: 14, activity: 'having_lunch',     location: 'cafe',       emotion: 'eating'   },
      { startHour: 14, endHour: 17, activity: 'working',          location: 'office',     emotion: 'working'  },
      { startHour: 17, endHour: 19, activity: 'socializing',      location: 'park',       emotion: 'happy'    },
      { startHour: 19, endHour: 21, activity: 'having_dinner',    location: 'cafe',       emotion: 'eating'   },
      { startHour: 21, endHour: 23, activity: 'evening_leisure',  location: 'home_iris',  emotion: 'relaxing' },
      { startHour: 23, endHour: 24, activity: 'sleeping',         location: 'home_iris',  emotion: 'sleeping' },
    ],
  },
  {
    id: 'jack',
    name: 'Jack',
    role: 'Retired',
    color: '#B8B8FF',
    personality: ['Wise', 'Nostalgic', 'Kind'],
    goals: ['Enjoy retirement', 'Share stories', 'Stay active'],
    homeLocation: 'home_jack',
    dialogueStyle: 'casual',
    schedule: [
      { startHour: 0,  endHour: 7,  activity: 'sleeping',         location: 'home_jack',  emotion: 'sleeping' },
      { startHour: 7,  endHour: 8,  activity: 'waking_up',        location: 'home_jack',  emotion: 'tired'    },
      { startHour: 8,  endHour: 9,  activity: 'having_breakfast', location: 'cafe',       emotion: 'happy'    },
      { startHour: 9,  endHour: 11, activity: 'relaxing_park',    location: 'park',       emotion: 'happy'    },
      { startHour: 11, endHour: 13, activity: 'socializing',      location: 'plaza',      emotion: 'chatting' },
      { startHour: 13, endHour: 14, activity: 'having_lunch',     location: 'cafe',       emotion: 'eating'   },
      { startHour: 14, endHour: 16, activity: 'shopping',         location: 'shop',       emotion: 'relaxing' },
      { startHour: 16, endHour: 18, activity: 'relaxing_park',    location: 'park',       emotion: 'relaxing' },
      { startHour: 18, endHour: 20, activity: 'having_dinner',    location: 'home_jack',  emotion: 'eating'   },
      { startHour: 20, endHour: 22, activity: 'evening_leisure',  location: 'home_jack',  emotion: 'relaxing' },
      { startHour: 22, endHour: 24, activity: 'sleeping',         location: 'home_jack',  emotion: 'sleeping' },
    ],
  },
];

export const EMOTION_EMOJI: Record<Emotion, string> = {
  happy:    '😊',
  tired:    '😴',
  working:  '💼',
  eating:   '🍔',
  chatting: '💬',
  sleeping: '💤',
  relaxing: '😌',
  excited:  '🤩',
  bored:    '😑',
  stressed: '😰',
};

export const ACTIVITY_LABELS: Record<Activity, string> = {
  sleeping:         'Sleeping',
  waking_up:        'Waking Up',
  having_breakfast: 'Having Breakfast',
  going_to_work:    'Going to Work',
  working:          'Working',
  having_lunch:     'Having Lunch',
  socializing:      'Socializing',
  shopping:         'Shopping',
  relaxing_park:    'Relaxing at Park',
  having_dinner:    'Having Dinner',
  going_home:       'Going Home',
  evening_leisure:  'Evening Leisure',
  going_to_bed:     'Going to Bed',
};
