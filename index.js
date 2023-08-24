// script.js

const processes = [];
const scheduler = document.querySelector('.scheduler');
const startButton = document.getElementById('startButton');
const addProcessButton = document.getElementById('addProcessButton');
const algorithmRadios = document.getElementsByName('algorithm');
const chartCanvas = document.getElementById('chart');
const processNameInput = document.getElementById('processName');
const arrivalTimeInput = document.getElementById('arrivalTime');
const burstTimeInput = document.getElementById('burstTime');
const priorityInput = document.getElementById('priority');
const ganttChart = document.querySelector('.gantt-chart');

startButton.addEventListener('click', startSimulation);
addProcessButton.addEventListener('click', addProcess);

function clearScheduler() {
  scheduler.innerHTML = '';
}

function runProcess(process, currentTime) {
  const processElement = document.createElement('div');
  processElement.classList.add('process');
  processElement.textContent = process.name;
  processElement.style.backgroundColor = getColorByPriority(process.priority);
  processElement.style.transitionDuration = `${process.burstTime}s`;

  scheduler.appendChild(processElement);

  const progressBar = document.querySelector('.progress-bar');
  progressBar.style.transitionDuration = `${process.burstTime}s`;
  progressBar.style.width = '100%';

  // Add Gantt chart bar
  const ganttBar = document.createElement('div');
  ganttBar.classList.add('gantt-bar');
  ganttBar.style.backgroundColor = getColorByPriority(process.priority);
  ganttBar.style.width = `${process.burstTime * 40}px`; // Adjust width as needed
  ganttChart.appendChild(ganttBar);

  setTimeout(() => {
    progressBar.style.width = '0';
    scheduler.removeChild(processElement);
    ganttChart.removeChild(ganttBar);
  }, process.burstTime * 1000);
}

function getColorByPriority(priority) {
  switch (priority) {
    case 1:
      return 'red';
    case 2:
      return 'orange';
    case 3:
      return 'yellow';
    case 4:
      return 'green';
    default:
      return 'blue';
  }
}

function startSimulation() {
  startButton.disabled = true;

  let selectedAlgorithm;
  for (const radio of algorithmRadios) {
    if (radio.checked) {
      selectedAlgorithm = radio.value;
      break;
    }
  }

  switch (selectedAlgorithm) {
    case 'priority':
      scheduleProcessesByPriority();
      break;
    default:
      break;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scheduleProcessesByPriority() {
  const sortedProcesses = [...processes].sort((a, b) => a.priority - b.priority);
  let currentTime = 0;

  for (const process of sortedProcesses) {
    if (process.arrivalTime > currentTime) {
      currentTime = process.arrivalTime;
    }

    runProcess(process, currentTime);
    process.color = getColorByPriority(process.priority);
    scheduler.lastChild.classList.add('running');
    await sleep(process.burstTime * 1000);
    scheduler.lastChild.classList.remove('running');

    currentTime += process.burstTime;
    await sleep(1000);
  }

  startButton.disabled = false;
}

function updateChart(completionTimes) {
  const labels = processes.map(process => process.name);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Completion Times',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data: completionTimes,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  new Chart(chartCanvas, {
    type: 'bar',
    data: chartData,
    options: chartOptions,
  });
}

function addProcess() {
  const processName = processNameInput.value;
  const arrivalTime = parseInt(arrivalTimeInput.value);
  const burstTime = parseInt(burstTimeInput.value);
  const priority = parseInt(priorityInput.value);

  if (processName && !isNaN(arrivalTime) && !isNaN(burstTime) && !isNaN(priority)) {
    const newProcess = { name: processName, arrivalTime, burstTime, priority };
    processes.push(newProcess);
    processNameInput.value = '';
    arrivalTimeInput.value = '';
    burstTimeInput.value = '';
    priorityInput.value = '';
    console.log('New process added:', newProcess);

    // Create a new row for adding processes dynamically
    const newRow = document.createElement('div');
    newRow.classList.add('process-input');
    newRow.innerHTML = `
      <input type="text" id="processName" placeholder="Process Name">
      <input type="number" id="arrivalTime" placeholder="Arrival Time">
      <input type="number" id="burstTime" placeholder="Burst Time">
      <input type="number" id="priority" placeholder="Priority">
      <button id="addProcessButton">Add Process</button>
    `;

    // Append the new row after the existing process input row
    const container = document.querySelector('.container');
    container.insertBefore(newRow, addProcessButton.parentElement.nextSibling);
  } else {
    console.log('Invalid input for new process.');
  }
}
