import type { Messages } from '../i18n.svelte.ts';

// Base messages from the LightHead design system bundle (en/de/pl).
export const messages: Record<string, Messages> = {
en: {
  close: 'Close without saving', back: 'Back', 'continue': 'Continue', skip: 'Skip', done: 'Done',
  stepOf: 'Step {step} of {total}', decrease: 'Decrease {label}', increase: 'Increase {label}',
  sameAsLast: 'Same as last time', lastTime: 'Last time', fromStrain: 'From the strain', fromLabel: 'From the package label',
  rating: 'Rating', ratingOf: '{n} of {max}', rated: 'Rated {n} of {max}',
  indica: 'Indica', sativa: 'Sativa', hybrid: 'Hybrid', cbd: 'CBD', thc: 'THC', sessions: 'Sessions',
  breakLabel: 'Tolerance break', breakDone: 'Break complete', ofTotal: 'of {total}',
  daysToGo: { one: '{count} day to go', other: '{count} days to go' },
  mainNav: 'Main', today: 'Today', log: 'Journal', strains: 'Strains', stats: 'Stats', 'break': 'Break',
  amount: 'Amount', method: 'Method', strain: 'Strain', effects: 'Effects', now: 'Now',
  joint: 'Joint', vape: 'Vape', bong: 'Bong', edible: 'Edible', somethingElse: 'Something else',
  calm: 'Calm', happy: 'Happy', creative: 'Creative', focused: 'Focused', sleepy: 'Sleepy', hungry: 'Hungry',
  qStrain: 'What did you have?', qAmount: 'How much?', qFeel: 'How do you feel?',
  prefilledSub: 'Prefilled from last time. Adjust if needed.', optionalSub: 'Optional. You can add this later.',
  saveSession: 'Save session', sessionSaved: 'Session saved',
  thcDerived: '≈ {mg} mg THC', thcIn: 'in {amount} of {strain} ({pct})',
  addPhoto: 'Add photo', changePhoto: 'Change photo'
},
de: {
  close: 'Schließen ohne Speichern', back: 'Zurück', 'continue': 'Weiter', skip: 'Überspringen', done: 'Fertig',
  stepOf: 'Schritt {step} von {total}', decrease: '{label} verringern', increase: '{label} erhöhen',
  sameAsLast: 'Wie beim letzten Mal', lastTime: 'Letztes Mal', fromStrain: 'Von der Sorte', fromLabel: 'Laut Verpackung',
  rating: 'Bewertung', ratingOf: '{n} von {max}', rated: 'Bewertet mit {n} von {max}',
  indica: 'Indica', sativa: 'Sativa', hybrid: 'Hybrid', cbd: 'CBD', thc: 'THC', sessions: 'Sitzungen',
  breakLabel: 'Toleranzpause', breakDone: 'Pause beendet', ofTotal: 'von {total}',
  daysToGo: { one: 'Noch {count} Tag', other: 'Noch {count} Tage' },
  mainNav: 'Hauptmenü', today: 'Heute', log: 'Tagebuch', strains: 'Sorten', stats: 'Statistik', 'break': 'Pause',
  amount: 'Menge', method: 'Methode', strain: 'Sorte', effects: 'Wirkung', now: 'Jetzt',
  joint: 'Joint', vape: 'Vaporizer', bong: 'Bong', edible: 'Edible', somethingElse: 'Etwas anderes',
  calm: 'Ruhig', happy: 'Fröhlich', creative: 'Kreativ', focused: 'Fokussiert', sleepy: 'Müde', hungry: 'Hungrig',
  qStrain: 'Was hattest du?', qAmount: 'Wie viel?', qFeel: 'Wie fühlst du dich?',
  prefilledSub: 'Wie beim letzten Mal. Bei Bedarf anpassen.', optionalSub: 'Optional. Du kannst das später ergänzen.',
  saveSession: 'Sitzung speichern', sessionSaved: 'Sitzung gespeichert',
  thcDerived: '≈ {mg} mg THC', thcIn: 'in {amount} {strain} ({pct})',
  addPhoto: 'Foto hinzufügen', changePhoto: 'Foto ändern'
},
pl: {
  close: 'Zamknij bez zapisywania', back: 'Wstecz', 'continue': 'Dalej', skip: 'Pomiń', done: 'Gotowe',
  stepOf: 'Krok {step} z {total}', decrease: 'Zmniejsz: {label}', increase: 'Zwiększ: {label}',
  sameAsLast: 'Tak jak ostatnio', lastTime: 'Ostatnio', fromStrain: 'Z odmiany', fromLabel: 'Z etykiety',
  rating: 'Ocena', ratingOf: '{n} z {max}', rated: 'Ocena {n} z {max}',
  indica: 'Indica', sativa: 'Sativa', hybrid: 'Hybryda', cbd: 'CBD', thc: 'THC', sessions: 'Sesje',
  breakLabel: 'Przerwa', breakDone: 'Przerwa zakończona', ofTotal: 'z {total}',
  daysToGo: { one: 'Został {count} dzień', few: 'Zostały {count} dni', many: 'Zostało {count} dni', other: 'Zostało {count} dni' },
  mainNav: 'Główne', today: 'Dziś', log: 'Dziennik', strains: 'Odmiany', stats: 'Statystyki', 'break': 'Przerwa',
  amount: 'Ilość', method: 'Sposób', strain: 'Odmiana', effects: 'Efekty', now: 'Teraz',
  joint: 'Joint', vape: 'Waporyzator', bong: 'Bongo', edible: 'Jadalne', somethingElse: 'Coś innego',
  calm: 'Spokój', happy: 'Radość', creative: 'Kreatywność', focused: 'Skupienie', sleepy: 'Senność', hungry: 'Głód',
  qStrain: 'Jaka odmiana?', qAmount: 'Ile?', qFeel: 'Jak się czujesz?',
  prefilledSub: 'Tak jak ostatnio. Zmień, jeśli trzeba.', optionalSub: 'Opcjonalnie. Możesz dodać to później.',
  saveSession: 'Zapisz sesję', sessionSaved: 'Sesja zapisana',
  thcDerived: '≈ {mg} mg THC', thcIn: 'w {amount} odmiany {strain} ({pct})',
  addPhoto: 'Dodaj zdjęcie', changePhoto: 'Zmień zdjęcie'
}
};
