// Display names for every interest id pickable at signup
export const INTEREST_TITLES = {
  // music
  taylor: 'Taylor Swift', bts: 'BTS', arijit: 'Arijit Singh', rahman: 'A.R. Rahman',
  diljit: 'Diljit Dosanjh', prateek: 'Prateek Kuhad', anuv: 'Anuv Jain', billie: 'Billie Eilish',
  weeknd: 'The Weeknd', shreya: 'Shreya Ghoshal', olivia: 'Olivia Rodrigo', karan: 'Karan Aujla',
  // film
  interstellar: 'Interstellar', inception: 'Inception', 'dark-knight': 'The Dark Knight',
  parasite: 'Parasite', shawshank: 'Shawshank', forrest: 'Forrest Gump', lalaland: 'La La Land',
  oppenheimer: 'Oppenheimer', dune: 'Dune', '3idiots': '3 Idiots', znmd: 'ZNMD', tamasha: 'Tamasha',
  // books
  sapiens: 'Sapiens', atomic: 'Atomic Habits', alchemist: 'The Alchemist', 1984: '1984',
  zero: 'Zero to One', norwegian: 'Norwegian Wood', thinking: 'Think Fast & Slow',
  deepwork: 'Deep Work', ikigai: 'Ikigai',
}

export function titleFor(id) {
  return INTEREST_TITLES[id] || id
}

// The current signed-up user's interest ids (flattened across categories)
export function userTasteIds() {
  try {
    const u = JSON.parse(localStorage.getItem('crushky_user') || '{}')
    return Object.values(u.interests || {}).flat()
  } catch { return [] }
}

// Real overlap between the user and a match → display names
export function sharedTaste(match) {
  const mine = userTasteIds()
  const theirs = match.tasteIds || []
  return theirs.filter(id => mine.includes(id)).map(titleFor)
}

// A natural-language line about shared taste, or null if none overlap
export function sharedTasteLine(match) {
  const shared = sharedTaste(match)
  if (shared.length === 0) return null
  if (shared.length === 1) return `You both love ${shared[0]}`
  if (shared.length === 2) return `You both love ${shared[0]} and ${shared[1]}`
  return `You both love ${shared[0]}, ${shared[1]} and ${shared.length - 2} more`
}
