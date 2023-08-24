/* globals Chart:false */

(() => {
  'use strict'

  // Graphs
  
// <block:actions:2>
/*
const ctx = document.getElementById('myChart')
const actions = [
  {
    name: 'myChart',
    handler(chart) {
      chart.data.datasets.forEach(dataset => {
        dataset.data = Utils.numbers({count: chart.data.labels.length, min: -100, max: 100});
      });
      chart.update();
    }
  },
];
// </block:actions>

// <block:setup:1>
const DATA_COUNT = 7;
const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};

const labels = Utils.months({count: 7});
const data = {
  labels: labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: Utils.numbers(NUMBER_CFG),
      borderColor: Utils.CHART_COLORS.red,
      backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
      yAxisID: 'y',
    },
    {
      label: 'Dataset 2',
      data: Utils.numbers(NUMBER_CFG),
      borderColor: Utils.CHART_COLORS.blue,
      backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
      yAxisID: 'y1',
    }
  ]
};
// </block:setup>

// <block:config:0>
const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Chart.js Line Chart - Multi Axis'
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',

        // grid line settings
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
    }
  },
};
// </block:config>

module.exports = {
  actions: actions,
  config: config,
};
*/

  const ctx = document.getElementById('myChart')
  // eslint-disable-next-line no-unused-vars
  const myChart = new Chart(ctx, {

    data: {
      labels: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
      datasets: [
        {
        type: 'line',
        label: 'AWS',
        data: [2435,1234,6335,7777,3489,12378,1924],
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff',
        yAxisID: 'AWS0'
        
      },
      {
        type: 'line',
        label: 'GCP',
        data: [9495,1234,1455,735342,3489,12378,1924],
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff',
        yAxisID: 'GCP0'
      },
    ],
    scales:{
    yAxisID: {
      GCP0: {
        ticks:{
        show: false
        }
      },
      AWS0: {
        show: false
        }
      }
    }
    },
    options: {
      plugins: {
        legend: {
          display: true
        },
        tooltip: {
          boxPadding: 3
        },
      },
      
    }
  })
  module.exports = {
    actions: actions,
    config: config,
  };
  
})();

let isDateShown = false;  // 상태를 추적하는 전역 변수

function showData() {
  const dataDisplayElement = document.getElementById('dataDisplay');
  
  if (isDateShown) {
    dataDisplayElement.innerText = "Today";  // 날짜 정보 숨기기
  } else {
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString() + " " + currentDate.toLocaleTimeString();
    dataDisplayElement.innerText = dateString;  // 날짜 정보 표시
  }

  isDateShown = !isDateShown;  // 상태 전환
}








