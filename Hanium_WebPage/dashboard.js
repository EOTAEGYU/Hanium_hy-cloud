/* globals Chart:false */

(() => {
  'use strict'

  // Graphs
  const ctx = document.getElementById('myChart')
  // eslint-disable-next-line no-unused-vars
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ],
      datasets: [{
        data: [
          2435,
          1234,
          6335,
          7777,
          3489,
          12378,
          1924
        ],
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          boxPadding: 3
        }
      }
    }
  })
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








