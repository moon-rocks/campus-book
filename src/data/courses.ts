export const COURSES = [
  {
    id: 'diploma',
    name: 'Diploma',
    tagline: 'Polytechnic & Technical Education',
    duration: '3 Years (6 Semesters)',
    description: 'Find affordable books for Diploma students across engineering disciplines.',
    badge: 'Polytechnic Core',
    semesters: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 'btech',
    name: 'B.Tech',
    tagline: 'Bachelor of Technology / B.E.',
    duration: '4 Years (8 Semesters)',
    description: 'Find academic books for B.Tech students from standard curriculum to specialized electives.',
    badge: 'Degree Programs',
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
  },
] as const;

export const POPULAR_SEARCH_SUGGESTIONS = [
  'Engineering Mathematics',
  'Programming in C',
  'Data Structures',
  'Electrical Engineering',
  'Engineering Physics',
  'Database Management Systems',
  'Strength of Materials',
  'Digital Logic & Microprocessor',
];

export const STATES_AND_CITIES = [
  {
    state: 'Bihar',
    cities: ['Patna', 'Muzaffarpur', 'Bhagalpur', 'Gaya', 'Darbhanga'],
  },
  {
    state: 'Delhi NCR',
    cities: ['New Delhi', 'Noida', 'Gurugram', 'Ghaziabad', 'Faridabad'],
  },
  {
    state: 'Uttar Pradesh',
    cities: ['Lucknow', 'Kanpur', 'Varanasi', 'Prayagraj', 'Agra'],
  },
  {
    state: 'Maharashtra',
    cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
  },
  {
    state: 'Karnataka',
    cities: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi'],
  },
  {
    state: 'West Bengal',
    cities: ['Kolkata', 'Durgapur', 'Asansol', 'Siliguri', 'Kalyani'],
  },
];
