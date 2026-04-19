export function displayNameFromEmail(email: string | null | undefined): string {
  if (!email || !email.includes('@')) {
    return 'Apprenant';
  }
  const local = email.split('@')[0] ?? '';
  const cleaned = local.replace(/[._-]+/g, ' ').trim();
  if (!cleaned) {
    return 'Apprenant';
  }
  return cleaned
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}
