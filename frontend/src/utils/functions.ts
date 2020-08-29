export function copyToClipboard(data: string) {
  const el = document.createElement('textarea');
  el.value = data;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

/* eslint-disable */
export function formatDate(time: any): string {
  switch (typeof time) {
    case 'number':
      break;
    case 'string':
      time = +new Date(time);
      break;
    case 'object':
      if (time.constructor === Date) time = time.getTime();
      break;
    default:
      time = +new Date();
  }
  const time_formats = [
    [60, 'sekunden', 1], // 60
    [120, 'vor einer Minute', 'in einer Minute'], // 60*2
    [3600, 'Minuten', 60], // 60*60, 60
    [7200, 'vor einer Stunde', 'in einer Stunde'], // 60*60*2
    [86400, 'Stunden', 3600], // 60*60*24, 60*60
    [172800, 'Gestern', 'Morgen'], // 60*60*24*2
    [604800, 'Tage', 86400], // 60*60*24*7, 60*60*24
    [1209600, 'Letzte Woche', 'Nächste Woche'], // 60*60*24*7*4*2
    [2419200, 'Wochen', 604800], // 60*60*24*7*4, 60*60*24*7
    [4838400, 'Letzter Monat', 'Nächster Monat'], // 60*60*24*7*4*2
    [29030400, 'Monate', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, 'Letztes Jahr', 'Nächstes Jahr'], // 60*60*24*7*4*12*2
    [2903040000, 'Jahre', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, 'Letztes Jahrzehnt', 'Nächstes Jahrzehnt'], // 60*60*24*7*4*12*100*2
    [58060800000, 'Jahrzente', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  let seconds = (+new Date() - time) / 1000,
    token = 'alt',
    list_choice = 1;

  if (seconds == 0) {
    return 'Gerade eben';
  }
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = 'von heute';
    list_choice = 2;
  }
  let i = 0,
    format;
  while ((format = time_formats[i++]))
    if (seconds < format[0]) {
      if (typeof format[2] == 'string') return (format as any)[list_choice];
      else
        return Math.floor(seconds / +format[2]) + ' ' + format[1] + ' ' + token;
    }
  return time;
}
