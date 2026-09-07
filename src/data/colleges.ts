import { CollegeInfo } from '../types';

export const OFFICIAL_POLYTECHNIC_COLLEGES = [
  'Government Polytechnic, Muzaffarpur',
  'Government Women\'s Polytechnic, Muzaffarpur',
  'Government Polytechnic, Vaishali',
  'Government Polytechnic, Sheohar',
  'Government Polytechnic, Sitamarhi',
  'Government Polytechnic, Samastipur',
  'Government Polytechnic, Darbhanga',
  'Government Polytechnic, Madhubani',
  'Government Polytechnic, Motihari',
  'Government Polytechnic, West Champaran',
  'Government Polytechnic, Gopalganj',
  'Government Polytechnic, Chapra',
  'Government Polytechnic, Begusarai',
  'Government Polytechnic, Saharsa',
  'Government Polytechnic, Bhagalpur',
] as const;

const collegeImage = 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80';

export const COLLEGES: CollegeInfo[] = OFFICIAL_POLYTECHNIC_COLLEGES.map((name) => {
  const city = name.replace('Government Women\'s Polytechnic, ', '').replace('Government Polytechnic, ', '');
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return {
    id: slug,
    name,
    city,
    state: 'Bihar',
    courses: ['Diploma'],
    popularBranches: ['Civil', 'Mechanical', 'Electrical', 'Electronics', 'Computer Science'],
    bookCount: 0,
    image: collegeImage,
    status: 'active',
    isOfficial: true,
    is_demo: false,
    isDemo: false,
    data_type: 'real',
  };
});

export const OTHER_COLLEGE_OPTION = 'Other College';
