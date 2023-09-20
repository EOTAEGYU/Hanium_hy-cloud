(() => {
  'use strict';

  
  function createAWS(ctxaws) {
    const initialData = {
      cpu: [],
      memory: [],
    };
  
    const chartA = new Chart(ctxaws, {
      type: 'line',
      data: {
        labels: Array(initialData.cpu.length).fill(''),
        datasets: [
          {
            data: initialData.cpu,
            label: 'CPU',
            lineTension: 0,
            backgroundColor: 'transparent',
            borderColor: '#007bff',
            borderWidth: 4,
            pointBackgroundColor: '#007bff',
          },
          {
            data: initialData.memory,
            label: 'Memory',
            fill: false,
            lineTension: 0,
            backgroundColor: 'transparent',
            borderColor: '#c45850',
            borderWidth: 4,
            pointBackgroundColor: '#c45850',
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            boxPadding: 3,
          },
        },
      },
    });
  
    return chartA;
  }
  
  // GCP 차트 생성
  function createGCP(ctxgcp) {
    const initialData = {
      cpu: [],
      memory: [],
    };
  
    const chartB = new Chart(ctxgcp, {
      type: 'line',
      data: {
        labels: Array(initialData.cpu.length).fill(''),
        datasets: [
          {
            data: initialData.cpu,
            label: 'CPU',
            lineTension: 0,
            backgroundColor: 'transparent',
            borderColor: '#007bff',
            borderWidth: 4,
            pointBackgroundColor: '#007bff',
          },
          {
            data: initialData.memory,
            label: 'Memory',
            fill: false,
            lineTension: 0,
            backgroundColor: 'transparent',
            borderColor: '#c45850',
            borderWidth: 4,
            pointBackgroundColor: '#c45850',
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            boxPadding: 3,
          },
        },
      },
    });
  
    return chartB;
  }

  function addData(chartInstance, newData) {
    const newLabel = new Date().toLocaleTimeString();
    chartInstance.data.labels.push(newLabel);
    chartInstance.data.datasets.forEach((dataset, idx) => {
      dataset.data.push(newData[idx]);
    });
    if (chartInstance.data.labels.length > 10) {
      removeData(chartInstance); //10 넘어가면 처음꺼 삭제
    }
    chartInstance.update();
  }

  //shift를 이용하여 한자리씩 앞으로 이동
  function removeData(chartInstance) {
    chartInstance.data.labels.shift();
    chartInstance.data.datasets.forEach((dataset) => {
      dataset.data.shift();
    });
    chartInstance.update();
  }
  
  function initializeCharts() {
    const chartAWSIds = ['AChart', 'AChart1', 'AChart2', 'AChart3', 'AChart4', 'AChart5'];
    const chartGCPIds = ['GChart', 'GChart1', 'GChart2', 'GChart3', 'GChart4', 'GChart5'];
  
    const awsCharts = chartAWSIds.map(id => createAWS(document.getElementById(id)));
    const gcpCharts = chartGCPIds.map(id => createGCP(document.getElementById(id)));
  
    // AWS용 setInterval 함수
    setInterval(async function() {
      let newData = await fetchData('aws');
      awsCharts.forEach(chart => {
        addData(chart, newData);
      });
    }, 1000);
  
    // GCP용 setInterval 함수
    setInterval(async function() {
      let newData = await fetchData('gcp');
      gcpCharts.forEach(chart => {
        addData(chart, newData);
      });
    }, 1000);
  
    // 초기에 AWS 차트를 표시
    showAWS();
  }
  
  // 페이지 로드 시 차트 초기화를 진행
  window.onload = initializeCharts;

async function fetchData(vendor) {
  try {
    const response = await fetch(`http://3.37.10.77:8000/monitor_info?vendor=${vendor}`);
    const data = await response.json();
    console.log(`Data for ${vendor}:`, data);  // 여기서 데이터 로깅
    return [data.cpu, data.memory];
  } catch (error) {
    console.error(`Error fetching data for ${vendor}:`, error);
    return [0, 0];  // 에러 발생 시 0으로 데이터 설정
  }
}

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