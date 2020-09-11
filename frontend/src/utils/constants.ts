export const days = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag'
];
export const months = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember'
];

export const aSecond = 1000;
export const aMinute = 1000 * 60;
export const aHour = 1000 * 60 * 60;
export const aDay = 1000 * 60 * 60 * 24;
export const aWeek = 1000 * 60 * 60 * 24 * 7;
export const aMonth = 1000 * 60 * 60 * 24 * 30.43;
export const aYear = 1000 * 60 * 60 * 24 * 365;

export const fhBotId = '5f4a1a372149ef521c108f4a';

// export const backendURL = 'http://localhost:3000/';
export const backendURL = 'https://api.timos.design:3000/';

export const sampleRecipe = {
  author: '',
  created: new Date().getTime(),
  updated: 0,
  title: 'Veganer Beeren-Porridge',
  category: ['vegan', 'vegetarisch'],
  time: 10 * 60,
  difficulty: 1,
  ingredients: [
    {
      name: 'Wasser',
      amount: '150-200',
      unit: 'ml'
    },
    {
      name: 'Haferflocken',
      amount: '50',
      unit: 'g'
    },
    {
      name: 'Geschrotete Leinsamen',
      amount: '10',
      unit: 'g'
    },
    {
      name: 'Salz',
      amount: '1',
      unit: ' Prise'
    },
    {
      name: 'TK Beeren',
      amount: '150',
      unit: 'g'
    }
  ],
  nutrition: [
    {
      title: 'Kalorien',
      amount: 300,
      unit: 'kcal'
    },
    {
      title: 'Kohlenhydrate',
      amount: 38.4,
      unit: 'g'
    },
    {
      title: 'Proteine',
      amount: 10.6,
      unit: 'g'
    },
    {
      title: 'Fett',
      amount: 8.1,
      unit: 'g'
    }
  ],
  thumbnail:
    'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=1080&q=5',
  steps: [
    'Wasser mit Haferflocken, Leinsamen, Salz und Beeren unter Rühren in einem Topf erhitzen und leicht köcheln lassen.',
    'Je nach Präferenz der Konsistenz noch etwas Wasser hinzufügen.',
    'Mit Zutaten deiner Wahl toppen, bspw. gepuffter Amaranth, Nussmus, frische Beeren, einen Schuss Milch… (noch nicht in die Nährwerte eingerechnet!)'
  ],
  description:
    'Um deinen Porridge proteinreicher zu gestalten kannst du zum Schluss Proteinpulver deiner Wahl unterrühren – pimpt deinen Porridge und sorgt für bessere Makrowerte! Durch das Hinzufügen von Nüssen deiner Wahl versorgst du deinen Körper direkt noch mit weiteren wichtigen Nährstoffen!'
};
