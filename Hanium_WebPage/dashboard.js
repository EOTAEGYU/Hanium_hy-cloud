/* globals Chart:false */

(() => {
  'use strict'

  // Graphs
  const ctx = document.getElementById('myChart')
  const ctx1 = document.getElementById('myChart1')
  const ctx2 = document.getElementById('myChart2')
  const ctx3 = document.getElementById('myChart3')
  const ctx4 = document.getElementById('myChart4')
  const ctx5 = document.getElementById('myChart5')

  // eslint-disable-next-line no-unused-vars
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [
        'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday', 'Saturday'],
      datasets: [{
        data: [15339,21345,18483,24003,23489,24092,12034],
        label:"CPU",
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
      },{
        type: 'line',
        data: [12034,24092, 23489,23489,24003,18483,21345,15339],
        label:"Memory",
        fill: false, // 채우기없음
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: "#c45850",
        borderWidth: 4,
        pointBackgroundColor: "#c45850"
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

  const myChart1 = new Chart(ctx1, {
    type: 'line',
    data: {
      labels: [
        'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday', 'Saturday'],
      datasets: [{
        data: [15339,21345,18483,24003,23489,24092,12034],
        label:"CPU",
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
      },{
        type: 'line',
        data: [12034,24092, 23489,23489,24003,18483,21345,15339],
        label:"Memory",
        fill: false, // 채우기없음
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: "#c45850",
        borderWidth: 4,
        pointBackgroundColor: "#c45850"
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
  
  const myChart2 = new Chart(ctx2, {
    type: 'line',
    data: {
      labels: [
        'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday', 'Saturday'],
      datasets: [{
        data: [15339,21345,18483,24003,23489,24092,12034],
        label:"CPU",
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
      },{
        type: 'line',
        data: [12034,24092, 23489,23489,24003,18483,21345,15339],
        label:"Memory",
        fill: false, // 채우기없음
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: "#c45850",
        borderWidth: 4,
        pointBackgroundColor: "#c45850"
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

  const myChart3 = new Chart(ctx3, {
    type: 'line',
    data: {
      labels: [
        'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday', 'Saturday'],
      datasets: [{
        data: [15339,21345,18483,24003,23489,24092,12034],
        label:"CPU",
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
      },{
        type: 'line',
        data: [12034,24092, 23489,23489,24003,18483,21345,15339],
        label:"Memory",
        fill: false, // 채우기없음
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: "#c45850",
        borderWidth: 4,
        pointBackgroundColor: "#c45850"
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

  const myChart4 = new Chart(ctx4, {
    type: 'line',
    data: {
      labels: [
        'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday', 'Saturday'],
      datasets: [{
        data: [15339,21345,18483,24003,23489,24092,12034],
        label:"CPU",
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
      },{
        type: 'line',
        data: [12034,24092, 23489,23489,24003,18483,21345,15339],
        label:"Memory",
        fill: false, // 채우기없음
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: "#c45850",
        borderWidth: 4,
        pointBackgroundColor: "#c45850"
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

  const myChart5 = new Chart(ctx5, {
    type: 'line',
    data: {
      labels: [
        'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday', 'Saturday'],
      datasets: [{
        data: [15339,21345,18483,24003,23489,24092,12034],
        label:"CPU",
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
      },{
        type: 'line',
        data: [12034,24092, 23489,23489,24003,18483,21345,15339],
        label:"Memory",
        fill: false, // 채우기없음
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: "#c45850",
        borderWidth: 4,
        pointBackgroundColor: "#c45850"
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

})()



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








