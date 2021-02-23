import store from '@/store';

// chart options (see ApexCharts Docs for further informations)
export class ChartOptions {
  public static bmi(range: number, selectedTime: number) {
    return {
      chart: {
        toolbar: { show: false },
        parentHeightOffset: 0,
        background: 'transparent',
        foreColor: store.getters.darkmode && '#fff',
        fontFamily: 'inherit'
      },
      xaxis: {
        type: 'datetime',
        range: range,
        max: new Date().getTime()
      },
      yaxis: {
        opposite: true,
        min: 10,
        tickAmount: 5,
        max: 40,
        labels: { formatter: (value: string) => value + ' BMI' }
      },
      colors: ['#25ca49'],
      stroke: { lineCap: 'round', width: 4 },
      markers: {
        size: selectedTime < 2 ? 5 : 0,
        strokeWidth: 3,
        strokeColors: store.getters.darkmode ? '#28292d' : '#fff'
      },
      tooltip: {
        x: { format: 'dd. MMM yyyy' }
      },
      theme: { mode: store.getters.darkmode ? 'dark' : 'light' },
      annotations: {
        yaxis: [
          {
            y: 20,
            y2: 25,
            borderColor: '#08f',
            borderWidth: 2,
            strokeDashArray: 0,
            fillColor: '#08f',
            opacity: 0.2,
            label: {
              borderWidth: 0,
              text: 'Normalgewicht',
              position: 'left',
              offsetX: 80,
              offsetY: 50,
              style: {
                fontSize: '14px',
                fontWeight: 500,
                color: '#08f',
                background: 'transparent'
              }
            }
          }
        ]
      }
    };
  }

  public static weight(range: number, selectedTime: number) {
    return {
      chart: {
        toolbar: { show: false },
        parentHeightOffset: 0,
        background: 'transparent',
        foreColor: store.getters.darkmode && '#fff',
        fontFamily: 'inherit'
      },
      xaxis: {
        type: 'datetime',
        range: range,
        max: new Date().getTime()
      },
      yaxis: {
        opposite: true,
        tickAmount: 0.1,
        forceNiceScale: true,
        labels: { formatter: (value: string) => value + ' kg' }
      },
      colors: ['#25ca49'],
      stroke: { lineCap: 'round', width: 4 },
      markers: {
        size: selectedTime < 2 ? 5 : 0,
        strokeWidth: 3,
        strokeColors: store.getters.darkmode ? '#28292d' : '#fff'
      },
      tooltip: {
        x: { format: 'dd. MMM yyyy' }
      },
      theme: { mode: store.getters.darkmode ? 'dark' : 'light' }
    };
  }

  public static water(range: number, timespan: number, recommended: number) {
    return {
      chart: {
        toolbar: { show: false },
        parentHeightOffset: 0,
        background: 'transparent',
        foreColor: store.getters.darkmode && '#fff',
        fontFamily: 'inherit'
      },
      xaxis: {
        type: 'datetime',
        range: range,
        max: new Date().getTime()
      },
      yaxis: {
        opposite: true,
        tickAmount: 1,
        min: 0,
        max: 10,
        labels: { formatter: (value: string) => value + ' l' }
      },
      annotations: {
        yaxis: [
          {
            y: recommended,
            borderColor: '#08f',
            borderWidth: 2,
            strokeDashArray: 0,
            opacity: 0.1,
            label: {
              borderWidth: 0,
              text: 'Empfehlung',
              position: 'left',
              offsetX: 80,
              style: {
                fontSize: '14px',
                fontWeight: 500,
                color: store.getters.darkmode && '#fff',
                background: 'transparent'
              }
            }
          }
        ]
      },
      colors: ['#25ca49'],
      stroke: { lineCap: 'round', width: 4 },
      markers: {
        size: timespan < 2 ? 5 : 0,
        strokeWidth: 3,
        strokeColors: store.getters.darkmode ? '#28292d' : '#fff'
      },
      tooltip: {
        x: { format: 'dd. MMM yyyy' }
      },
      theme: { mode: store.getters.darkmode ? 'dark' : 'light' }
    };
  }
}
