// A complete demo profile so investors can skip login and land straight in the
// app with everything populated. Shape matches what signup writes + the
// dashboard/profile screens read.
export const DEMO_USER = {
  name: 'Aditya',
  dob: '2003-08-15',
  gender: 'Man',
  lookingFor: 'Women',
  heightFt: '5',
  heightIn: '10',
  city: 'Bangalore',
  work: 'Founders office at Teachmint',
  bio: 'Building things by day, debating film endings by night.',
  instagram: 'aditya.kumar_',
  spotify: 'aditya.vibes',
  interests: {
    music: ['prateek', 'arijit', 'weeknd'],
    film: ['interstellar', 'tamasha'],
    books: ['norwegian'],
  },
  prompts: {
    weekend: 'Coffee, bookstore, no plans honestly',
    geekout: 'How startups go from 0 to 1. And street food.',
    controversial: 'Maggi > any pasta. I will die on this hill.',
  },
  photos: [0, 1, 2],
}

export function seedDemoUser() {
  localStorage.setItem('crushky_user', JSON.stringify(DEMO_USER))
}
