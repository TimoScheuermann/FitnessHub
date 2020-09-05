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

export const defaultChart = {
  chart: {
    toolbar: { show: false },
    parentHeightOffset: 0,
    background: 'transparent',
    // foreColor: store.getters.darkmode && '#fff',
    fontFamily: 'inherit'
  },
  xaxis: {
    type: 'datetime',
    max: new Date().getTime()
  },
  yaxis: {
    opposite: true,
    tickAmount: 0.1,
    forceNiceScale: true
  },
  colors: ['#25ca49'],
  stroke: { lineCap: 'round', width: 4 },
  markers: {
    strokeWidth: 3
    // strokeColors: store.getters.darkmode ? '#28292d' : '#fff'
  },
  tooltip: {
    x: { format: 'dd. MMM yyyy' }
  },
  theme: { mode: 'dark' }
  // theme: { mode: store.getters.darkmode ? 'dark' : 'light' }
};

// export const backendURL = 'http://localhost:3000/';
export const backendURL = 'https://api.timos.design:3000/';
