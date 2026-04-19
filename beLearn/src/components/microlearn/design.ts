/** Palette type catalogue / maquettes MicroLearn (violet, orange, vert, bleu). */
export const THEME_CARD_ACCENTS = ['#6366F1', '#F59E0B', '#10B981', '#3B82F6'] as const;

export const COURSE_COVER_GRADIENTS: readonly [string, string][] = [
  ['#6366F1', '#8B5CF6'],
  ['#EC4899', '#F472B6'],
  ['#10B981', '#34D399'],
  ['#3B82F6', '#60A5FA'],
  ['#7C3AED', '#A78BFA'],
];

export function pickAccent(index: number): string {
  return THEME_CARD_ACCENTS[index % THEME_CARD_ACCENTS.length]!;
}

export function pickCourseGradient(index: number): readonly [string, string] {
  return COURSE_COVER_GRADIENTS[index % COURSE_COVER_GRADIENTS.length]!;
}
