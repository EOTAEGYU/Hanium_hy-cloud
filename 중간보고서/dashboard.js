/* globals Chart:false */

//주기적으로 서버에서 데이터 가져오기
/*
function fetchData() {
  return fetch("http://3.37.10.77:8000/monitor_info")
      .then(response => response.json())
      .then((data)=>{console.log(data)})
      .catch(err => console.error(err));
}
*/

(() => {
  'use strict'
  //가져온 데이터로 차트 업데이트
  function updateChartWithData() {

    const chartAWSIds = ['AChart', 'AChart1', 'AChart2', 'AChart3', 'AChart4', 'AChart5'];
    chartAWSIds.forEach(id => {
      const ctxaws = document.getElementById(id);
      const chartA = createAWS(ctxaws);
      chartA.destroy(ctxaws);
    });

    const chartGCPIds = ['GChart', 'GChart1', 'GChart2', 'GChart3', 'GChart4', 'GChart5'];
    chartGCPIds.forEach(id => {
      const ctxgcp = document.getElementById(id);
      const chartB = createGCP(ctxgcp);
      chartB.destroy(ctxgcp);
    });
  }
  
  //aws 차트
  function createAWS(ctxaws) {
    return new Chart(ctxaws, {
      //chartid: chartA, 
      type: 'line',
      data: {
        labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          datasets: [{
            data: [fetch("http://3.37.10.77:8000/monitor_info?vendor=aws").then((response) => //주기적으로 서버에서 데이터 가져오기
            response.json()
          ).then((res)=>{
            console.log(res.data);
          }).catch((err)=>{
            console.log(err);
          })],
          label: "CPU",
          lineTension: 0,
          backgroundColor: 'transparent',
          borderColor: '#007bff',
          borderWidth: 4,
          pointBackgroundColor: '#007bff'
          
        }, {
          type: 'line',
          data: [fetch("http://3.37.10.77:8000/monitor_info?vendor=aws").then((response) => //주기적으로 서버에서 데이터 가져오기
            response.json()
          ).then((res)=>{
            console.log(res.data);
          }).catch((err)=>{
            console.log(err);
          })],
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

  //gcp 차트
  function createGCP(ctxgcp) {
    return new Chart(ctxgcp, {
      //chartid: chartB,
      type: 'line',
      data: {
        labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          datasets: [{
            data: [fetch("http://3.37.10.77:8000/monitor_info?vendor=gcp").then((response) => //주기적으로 서버에서 데이터 가져오기
            response.json()
          ).then((res)=>{
            console.log(res.data);
          }).catch((err)=>{
            console.log(err);
          })],
          label: "CPU",
          lineTension: 0,
          backgroundColor: 'transparent',
          borderColor: '#007bff',
          borderWidth: 4,
          pointBackgroundColor: '#007bff'
        }, {
          type: 'line',
          data: [fetch("http://3.37.10.77:8000/monitor_info?vendor=gcp").then((response) => //주기적으로 서버에서 데이터 가져오기
            response.json()
          ).then((res)=>{
            console.log(res.data);
          }).catch((err)=>{
            console.log(err);
          })],
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
  
  function addData(chartInstance, label, newData) {
    chartInstance.data.labels.push(label);
    chartInstance.data.datasets.forEach((dataset) => {
        dataset.data.push(newData);
    });
    chartInstance.update();
}

function removeData(chartInstance) {
    chartInstance.data.labels.pop();
    chartInstance.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chartInstance.update();
}

// 전역 변수를 사용하여 차트 인스턴스를 저장합니다.
let awsChartInstances = {};
let gcpChartInstances = {};

// AWS용 setInterval 함수
setInterval(function() {
  let newLabel = new Date().toLocaleTimeString();
  let newData = Math.random() * 100;

  const chartAWSIds = ['AChart', 'AChart1', 'AChart2', 'AChart3', 'AChart4', 'AChart5'];
  chartAWSIds.forEach(id => {
    if (awsChartInstances[id]) {
      awsChartInstances[id].destroy();
    }
    
    awsChartInstances[id] = createAWS(document.getElementById(id));
    addData(awsChartInstances[id], newLabel, newData);

    if (awsChartInstances[id].data.labels.length > 10) {  
        removeData(awsChartInstances[id]);
    }
  });
}, 1000);

setInterval(function() {
  let newLabel = new Date().toLocaleTimeString();
  let newData = Math.random() * 100;

  const chartGCPIds = ['GChart', 'GChart1', 'GChart2', 'GChart3', 'GChart4', 'GChart5'];
  chartGCPIds.forEach(id => {
    if (gcpChartInstances[id]) {
      gcpChartInstances[id].destroy();
    }
    
    gcpChartInstances[id] = createGCP(document.getElementById(id));
    addData(gcpChartInstances[id], newLabel, newData);

    if (gcpChartInstances[id].data.labels.length > 10) {  
        removeData(gcpChartInstances[id]);
    }
  });
}, 1000);


// 주기적으로 차트 업데이트(5초마다)
setInterval(() => {
  updateChartWithData();
}, 5000); //5초 5000틱

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