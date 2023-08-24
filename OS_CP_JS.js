document.getElementById('submitBtn').addEventListener('click', function () {
    const algorithm = document.getElementById('algorithm').value;
    const numProcesses = parseInt(document.getElementById('numProcesses').value);

    const processes = [];

    for (let i = 0; i < numProcesses; i++) {
        const process = {
            pid: i + 1,
            arrival_time: parseInt(prompt(`Enter arrival time for Process ${i + 1}:`)),
            burst_time: parseInt(prompt(`Enter burst time for Process ${i + 1}:`))
        };
        processes.push(process);
    }

    const timelineElement = document.getElementById('timeline');
    timelineElement.innerHTML = '';

    if (algorithm === 'fcfs') {
        fcfsSchedulerVisualize(processes);
    } else if (algorithm === 'sjf') {
        sjfSchedulerVisualize(processes);
    }
});

function fcfsSchedulerVisualize(processes) {
    const timelineElement = document.getElementById('timeline');
    const animationDuration = 500;
    
    let currentTime = 0;

    for (const process of processes) {
        if (currentTime < process.arrival_time) {
            const idleElement = document.createElement('div');
            idleElement.textContent = `Idle ${currentTime} - ${process.arrival_time}`;
            idleElement.className = 'event idle';
            timelineElement.appendChild(idleElement);
            currentTime = process.arrival_time;
        }

        const processElement = document.createElement('div');
        processElement.textContent = `P${process.pid} (${currentTime} - ${currentTime + process.burst_time})`;
        processElement.className = 'event';
        timelineElement.appendChild(processElement);

        setTimeout(() => {
            processElement.classList.add('active');
        }, currentTime * animationDuration);
        
        setTimeout(() => {
            processElement.classList.remove('active');
        }, (currentTime + process.burst_time) * animationDuration);

        currentTime += process.burst_time;
    }
}

function sjfSchedulerVisualize(processes) {
    const timelineElement = document.getElementById('timeline');
    const animationDuration = 500;
    
    const numProcesses = processes.length;
    const completed = new Array(numProcesses).fill(false);
    
    let currentTime = 0;
    let completedProcesses = 0;

    while (completedProcesses < numProcesses) {
        let shortestBurst = Infinity;
        let shortestIndex = -1;

        for (let i = 0; i < numProcesses; i++) {
            if (!completed[i] && processes[i].arrival_time <= currentTime && processes[i].burst_time < shortestBurst) {
                shortestBurst = processes[i].burst_time;
                shortestIndex = i;
            }
        }

        if (shortestIndex === -1) {
            const idleElement = document.createElement('div');
            idleElement.textContent = `Idle ${currentTime} - `;
            idleElement.className = 'event idle';
            timelineElement.appendChild(idleElement);
            currentTime++;
            continue;
        }

        const process = processes[shortestIndex];
        completed[shortestIndex] = true;

        if (currentTime < process.arrival_time) {
            const idleElement = document.createElement('div');
            idleElement.textContent = `Idle ${currentTime} - ${process.arrival_time}`;
            idleElement.className = 'event idle';
            timelineElement.appendChild(idleElement);
            currentTime = process.arrival_time;
        }

        const processElement = document.createElement('div');
        processElement.textContent = `P${process.pid} (${currentTime} - ${currentTime + process.burst_time})`;
        processElement.className = 'event';
        timelineElement.appendChild(processElement);

        setTimeout(() => {
            processElement.classList.add('active');
        }, currentTime * animationDuration);
        
        setTimeout(() => {
            processElement.classList.remove('active');
        }, (currentTime + process.burst_time) * animationDuration);

        currentTime += process.burst_time;
        completedProcesses++;
    }
}