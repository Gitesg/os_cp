// HTML elements
const inputSection = document.querySelector('.input-section');
const addTaskBtn = document.getElementById('addTaskBtn');
const algorithmSelect = document.getElementById('algorithm');
const startBtn = document.getElementById('startBtn');
const scheduler = document.querySelector('.scheduler');
const tooltip = document.querySelector('.tooltip');
const progressBar = document.querySelector('.progress-bar');
const clock = document.querySelector('.clock');
const showAdditionalInfoCheckbox = document.getElementById('showAdditionalInfo');

// Task list
const tasks = [];

// Event listeners
addTaskBtn.addEventListener('click', addTask);
startBtn.addEventListener('click', startSimulation);

// Function to add a task
function addTask() {
  const taskName = document.getElementById('taskName').value;
  const arrivalTime = parseInt(document.getElementById('arrivalTime').value);
  const burstTime = parseInt(document.getElementById('burstTime').value);
  const priority = parseInt(document.getElementById('priority').value);

  if (taskName && !isNaN(arrivalTime) && !isNaN(burstTime) && !isNaN(priority)) {
    tasks.push({ name: taskName, arrivalTime, burstTime, priority });
    updateTaskList();
  }
}

// Function to update the task list display
function updateTaskList() {
  const taskList = document.createElement('ul');
  tasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.textContent = `${task.name} (Arrival: ${task.arrivalTime} ms, Burst: ${task.burstTime} ms, Priority: ${task.priority})`;
    taskList.appendChild(taskItem);
  });
  inputSection.appendChild(taskList);
}

// Function to start the simulation based on selected algorithm
function startSimulation() {
  const selectedAlgorithm = algorithmSelect.value;

  if (selectedAlgorithm === 'fcfs') {
    simulateFCFS();
  } else if (selectedAlgorithm === 'pq') {
    simulatePriority();
  } else if (selectedAlgorithm === 'rr') {
    simulateRoundRobin();
  }
}

// FCFS Simulation
function simulateFCFS() {
  tasks.sort((a, b) => a.arrivalTime - b.arrivalTime);
  const ganttChart = [];
  let currentTime = tasks[0].arrivalTime;

  while (tasks.length > 0) {
    const availableTasks = tasks.filter(task => task.arrivalTime <= currentTime);

    if (availableTasks.length === 0) {
      currentTime++;
      continue;
    }

    const currentTask = availableTasks.shift();

    ganttChart.push({ name: currentTask.name, start: currentTime });
    currentTime += currentTask.burstTime;
    ganttChart.push({ name: 'Idle', start: currentTime });

    const taskIndex = tasks.findIndex(task => task.name === currentTask.name);
    const task = tasks.splice(taskIndex, 1)[0];
    task.waitingTime = currentTime - task.arrivalTime - task.burstTime;
    task.turnaroundTime = task.waitingTime + task.burstTime;
  }

  visualizeGanttChart(ganttChart);
}

// Priority Simulation
function simulatePriority() {
  tasks.sort((a, b) => a.arrivalTime - b.arrivalTime);
  const ganttChart = [];
  let currentTime = tasks[0].arrivalTime;

  while (tasks.length > 0) {
    const availableTasks = tasks.filter(task => task.arrivalTime <= currentTime);

    if (availableTasks.length === 0) {
      currentTime++;
      continue;
    }

    const highestPriorityTask = availableTasks.reduce((highest, task) => task.priority < highest.priority ? task : highest, availableTasks[0]);

    ganttChart.push({ name: highestPriorityTask.name, start: currentTime });
    currentTime += highestPriorityTask.burstTime;
    ganttChart.push({ name: 'Idle', start: currentTime });

    const taskIndex = tasks.findIndex(task => task.name === highestPriorityTask.name);
    const task = tasks.splice(taskIndex, 1)[0];
    task.waitingTime = currentTime - task.arrivalTime - task.burstTime;
    task.turnaroundTime = task.waitingTime + task.burstTime;
  }

  visualizeGanttChart(ganttChart);
}

// Round Robin Simulation
function simulateRoundRobin() {
  const timeQuantum = 4;
  let ganttChart = [];
  let currentTime = 0;
  let queue = [...tasks];

  while (queue.length > 0) {
    const currentTask = queue.shift();

    if (currentTask.burstTime > timeQuantum) {
      ganttChart.push({ name: currentTask.name, start: currentTime });
      currentTime += timeQuantum;
      ganttChart.push({ name: 'Idle', start: currentTime });
      currentTask.burstTime -= timeQuantum;
      queue.push(currentTask);
    } else {
      ganttChart.push({ name: currentTask.name, start: currentTime });
      currentTime += currentTask.burstTime;
      ganttChart.push({ name: 'Idle', start: currentTime });

      const taskIndex = tasks.findIndex(task => task.name === currentTask.name);
      const task = tasks.splice(taskIndex, 1)[0];
      task.waitingTime = currentTime - task.arrivalTime - task.burstTime;
      task.turnaroundTime = task.waitingTime + task.burstTime;
    }
  }

  visualizeGanttChart(ganttChart);
}

// Function to visualize the Gantt chart
function visualizeGanttChart(ganttChart) {
  scheduler.innerHTML = '';
  progressBar.style.width = '0';
  clock.textContent = 'Time: 0 ms';

  ganttChart.forEach((entry, index) => {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.style.width = entry.start + 'px';
    taskElement.textContent = entry.name;
    scheduler.appendChild(taskElement);

    taskElement.addEventListener('mouseenter', () => {
      tooltip.textContent = `Waiting Time: ${tasks[index / 2].waitingTime} ms | Turnaround Time: ${tasks[index / 2].turnaroundTime} ms`;
      tooltip.style.display = 'block';
    });

    taskElement.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });

    setTimeout(() => {
      taskElement.style.backgroundColor = '#ff6666';
      setTimeout(() => {
        taskElement.style.backgroundColor = '#66cc66';
      }, 500);
    }, index * 1000);
  });
}

// Event listener to show/hide additional information
showAdditionalInfoCheckbox.addEventListener('change', function() {
  const additionalInfo = document.querySelectorAll('.additional-info');
  additionalInfo.forEach(info => {
    info.style.display = this.checked ? 'block' : 'none';
  });
}
)