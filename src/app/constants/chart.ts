export const CHART_OPTIONS = {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Sum',
      lineTension: 0,
      backgroundColor: 'rgba(98, 47, 234, 0.09)',
      borderColor: '#622fea',
      borderWidth: 2,
      pointRadius: 1,
      pointBackgroundColor: '#5e2fe9',
      pointBorderColor: 'rgba(255,255,255,0.8)',
      pointHoverRadius: 0,
      displayColors: false,
      pointHoverBackgroundColor: '#5e2fe9',
      pointHitRadius: 10,
      pointBorderWidth: 10
    }],
  },
  options: {
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: true
        },
        ticks: {
          maxTicksLimit: 12
        }
      }],
      yAxes: [{
        ticks: {
          fontSize: 14,
          fontWeight: 400,
          min: 50,
          // max: Math.round(maxVal),
          maxTicksLimit: 10,
          padding: 32,
          callback: function (value, index, values) {
            return '$ ' + value;
          },
        },
        gridLines: {
          color: '#cfcad8',
          borderDash: [2, 2],
        }
      }],
      xaxes: [{
        ticks: {
          fontSize: 14,
          fontWeight: 300,
          padding: 32
        },
        gridLines: {
          color: '#cfcad8',
          borderDash: [2, 2],
        }
      }],
    },
    legend: {
      display: false
    }
  }
};
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const CHART_DEF_DATA = [15000, 13162, 17162, 15262, 18115, 19562, 23135, 17230, 15862, 26464, 28362, 26962];
export const CHART_FONT = '-apple-system,system-ui,BlinkMacSystemFont,\'Segoe UI\',Roboto,\'Helvetica Neue\',Arial,sans-serif';
