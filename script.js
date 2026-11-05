
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const addBtn = document.getElementById("addBtn");
const taskCount = document.getElementById("taskCount");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

let tasks = [];
let timeLeft = 25 * 60;
let timerInterval = null;
let running = false;

// Add a new task
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") return;

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    taskInput.value = "";

    renderTasks();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addTask();
});

// Display tasks
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task) => {
        const div = document.createElement("div");

        div.className = task.completed ? "task done" : "task";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        const span = document.createElement("span");
        span.textContent = task.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "×";

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            renderTasks();
        });

        deleteBtn.addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            renderTasks();
        });

        div.append(checkbox, span, deleteBtn);
        taskList.appendChild(div);
    });

    updateProgress();
}

// Update productivity
function updateProgress() {
    const completed = tasks.filter(t => t.completed).length;

    const percentage = tasks.length
        ? Math.round((completed / tasks.length) * 100)
        : 0;

    taskCount.textContent = `${tasks.length} tasks`;
    progressText.textContent = `${percentage}%`;
    progressFill.style.width = `${percentage}%`;
}

// Pomodoro timer
function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

startBtn.addEventListener("click", () => {
    if (running) {
        clearInterval(timerInterval);
        running = false;
        startBtn.textContent = "▶ Resume";
        return;
    }

    running = true;
    startBtn.textContent = "Ⅱ Pause";

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            running = false;
            startBtn.textContent = "▶ Start";

            document.getElementById("timerStatus").textContent =
                "🎉 Focus session complete!";
        }
    }, 1000);
});

resetBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    running = false;
    timeLeft = 25 * 60;

    startBtn.textContent = "▶ Start";
    document.getElementById("timerStatus").textContent =
        "Ready when you are.";

    updateTimer();
});

// Theme switcher
document.getElementById("themeBtn").addEventListener("click", () => {
    document.body.classList.toggle("dark");

    document.getElementById("themeBtn").textContent =
        document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Random quotes
const quotes = [
    "Great things are done by a series of small things brought together.",
    "Your future is created by what you do today.",
    "Focus on progress, not perfection.",
    "It always seems impossible until it's done.",
    "One task at a time. One step at a time.",
    "Dream big. Start small. Act now."
];

document.getElementById("quoteBtn").addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);

    document.getElementById("quote").textContent =
        `"${quotes[randomIndex]}"`;
});

document.getElementById("date").textContent =
    new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

updateTimer();
renderTasks();
