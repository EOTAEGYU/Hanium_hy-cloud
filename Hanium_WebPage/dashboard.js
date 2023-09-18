/* globals Chart:false */

(() => {
  'use strict'

  //aws 차트
  function createAWS(ctxaws) {
    return new Chart(ctxaws, {
      type: 'line',
      data: {
        labels: [
          'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        datasets: [{
          data: [15339, 21345, 18483, 24003, 23489, 24092, 12034],
          label: "CPU",
          lineTension: 0,
          backgroundColor: 'transparent',
          borderColor: '#007bff',
          borderWidth: 4,
          pointBackgroundColor: '#007bff'
          
        }, {
          type: 'line',
          data: [12034, 24092, 23489, 23489, 24003, 18483, 21345, 15339],
          label: "Memory",
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
    });
  }

  const chartAWSIds = ['AChart', 'AChart1', 'AChart2', 'AChart3', 'AChart4', 'AChart5'];

  chartAWSIds.forEach(id => {
    const ctxaws = document.getElementById(id);
    createAWS(ctxaws);
  });

  //gcp 차트
  function createGCP(ctxgcp) {
    return new Chart(ctxgcp, {
      type: 'line',
      data: {
        labels: [
          'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        datasets: [{
          data: [25000, 23045, 12483, 14003, 13489, 14092, 22034],
          label: "CPU",
          lineTension: 0,
          backgroundColor: 'transparent',
          borderColor: '#007bff',
          borderWidth: 4,
          pointBackgroundColor: '#007bff'
        }, {
          type: 'line',
          data: [22034, 14092, 13489, 13489, 14003, 12483, 11345, 25339],
          label: "Memory",
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
    });
  }

  const chartGCPIds = ['GChart', 'GChart1', 'GChart2', 'GChart3', 'GChart4', 'GChart5'];

  chartGCPIds.forEach(id => {
    const ctxgcp = document.getElementById(id);
    createGCP(ctxgcp);
  });



})();


//aws 활성화 버튼
function showAWS() {
  document.getElementById("AChart").style.display = "";
  document.getElementById("AChart1").style.display = "";
  document.getElementById("AChart2").style.display = "";
  document.getElementById("AChart3").style.display = "";
  document.getElementById("AChart4").style.display = "";
  document.getElementById("AChart5").style.display = "";

  document.getElementById("GChart").style.display = "none";
  document.getElementById("GChart1").style.display = "none";
  document.getElementById("GChart2").style.display = "none";
  document.getElementById("GChart3").style.display = "none";
  document.getElementById("GChart4").style.display = "none";
  document.getElementById("GChart5").style.display = "none";

  //버튼 활성화 여부 
  let awsButton = document.querySelector('button[onclick="showAWS()"]');
  let gcpButton = document.querySelector('button[onclick="showGCP()"]');
  awsButton.classList.remove('btn-outline-secondary');
  awsButton.classList.add('btn-warning');
  
  gcpButton.classList.add('btn-outline-secondary');
  gcpButton.classList.remove('btn-primary');
}

//gcp 활성화 버튼
function showGCP() {
  document.getElementById("AChart").style.display = "none";
  document.getElementById("AChart1").style.display = "none";
  document.getElementById("AChart2").style.display = "none";
  document.getElementById("AChart3").style.display = "none";
  document.getElementById("AChart4").style.display = "none";
  document.getElementById("AChart5").style.display = "none";

  document.getElementById("GChart").style.display = "";
  document.getElementById("GChart1").style.display = "";
  document.getElementById("GChart2").style.display = "";
  document.getElementById("GChart3").style.display = "";
  document.getElementById("GChart4").style.display = "";
  document.getElementById("GChart5").style.display = "";

  //버튼 활성화 여부
  let awsButton = document.querySelector('button[onclick="showAWS()"]');
  let gcpButton = document.querySelector('button[onclick="showGCP()"]');
  gcpButton.classList.remove('btn-outline-secondary');
  gcpButton.classList.add('btn-primary');
  
  awsButton.classList.add('btn-outline-secondary');
  awsButton.classList.remove('btn-primary'); 
  awsButton.classList.remove('btn-warning');
}

let isDateShown = false;  // 상태를 추적하는 전역 변수

function showData() {
  const dataDisplayElement = document.getElementById('dataDisplay');
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString() + " " + currentDate.toLocaleTimeString();
    dataDisplayElement.innerText = dateString;  // 날짜 정보 표시
    setInterval(showData, 1000); //1초에 한 번씩 showdata 함수 호출

  isDateShown = !isDateShown;  // 상태 전환
}


//디폴트로 aws를 화면에 보여줌
showAWS();








