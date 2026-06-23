import { supabase } from './supabase'

// Saves the signup profile to the real database. Each visitor gets a secure
// anonymous identity (auth.uid) that owns their row. Returns {ok} — never
// throws, so signup proceeds even if the backend is unreachable.
export async function saveProfile(form, { interests = {}, prompts = {}, photos = [] } = {}) {
  if (!supabase) return { ok: false, reason: 'no-supabase' }
  try {
    // Ensure we have a session (anonymous is fine for now)
    let { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      const { data, error } = await supabase.auth.signInAnonymously()
      if (error) return { ok: false, error }
      user = data.user
    }

    const dob = form.birthYear && form.birthMonth && form.birthDay
      ? `${form.birthYear}-${String(form.birthMonth).padStart(2, '0')}-${String(form.birthDay).padStart(2, '0')}`
      : null

    const row = {
      id: user.id,
      name: form.name || null,
      dob,
      gender: form.gender || null,
      looking_for: form.lookingFor || null,
      height_ft: form.heightFt ? parseInt(form.heightFt) : null,
      height_in: form.heightIn ? parseInt(form.heightIn) : null,
      city: form.city || null,
      work: form.work || null,
      bio: form.bio || null,
      instagram: form.instagram || null,
      spotify: form.spotify || null,
      interests, prompts, photos,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('profiles').upsert(row)
    if (error) return { ok: false, error }
    return { ok: true, id: user.id }
  } catch (error) {
    return { ok: false, error }
  }
}
