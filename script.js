// =========================
// Select HTML Elements
// =========================

let input = document.querySelector("#task-input");
let button = document.querySelector(".add-btn");
let taskContainer = document.querySelector("#task-container");
let taskCount = document.querySelector("#task-count");
let darkModeButton = document.querySelector("#dark-mode-btn");
let progressBar = document.querySelector("#progress-bar");
let progressText = document.querySelector("#progress-text");
let searchInput = document.querySelector("#search-input");
let prioritySelect = document.querySelector("#priority-select");
let dueDate = document.querySelector("#due-date");
let clearAllButton = document.querySelector("#clear-all-btn");
let filterButtons = document.querySelectorAll(".filter-btn");


// =========================
// Current Filter
// =========================

let currentFilter = "all";


// =========================
// Get Tasks from Local Storage
// =========================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// =========================
// Save Tasks
// =========================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// =========================
// Display Task
// =========================

function displayTask(taskData) {

    // Create task text

    let task = document.createElement("p");

    task.innerText = taskData.text;


    // =========================
    // Priority
    // =========================

    let priority = document.createElement("span");

    let taskPriority = taskData.priority || "Medium";

    priority.innerText = taskPriority;

    priority.classList.add("priority");

    priority.classList.add(
        "priority-" + taskPriority.toLowerCase()
    );


    // =========================
    // Due Date
    // =========================

    let date = document.createElement("span");

    if (taskData.dueDate) {

        date.innerText = "📅 " + taskData.dueDate;

    }

    date.classList.add("due-date");


    // =========================
    // Completed Check
    // =========================

    if (taskData.completed) {

        task.classList.add("completed");

    }


    // =========================
    // Task Box
    // =========================

    let taskBox = document.createElement("div");


    // =========================
    // Delete Button
    // =========================

    let deleteButton = document.createElement("button");

    deleteButton.innerText = "Delete";

    deleteButton.classList.add("delete-btn");


    deleteButton.addEventListener("click", function() {

        let confirmDelete = confirm(
            "Are you sure you want to delete this task?"
        );


        if (confirmDelete) {

            taskBox.remove();


            tasks = tasks.filter(function(item) {

                return item.id !== taskData.id;

            });


            saveTasks();

            updateCounter();

        }

    });


    // =========================
    // Complete Button
    // =========================

    let completeButton = document.createElement("button");

    completeButton.innerText = "Complete";

    completeButton.classList.add("complete-btn");


    completeButton.addEventListener("click", function() {

        task.classList.toggle("completed");


        taskData.completed =
            task.classList.contains("completed");


        saveTasks();

        updateCounter();

        filterTasks();

    });


    // =========================
    // Edit Button
    // =========================

    let editButton = document.createElement("button");

    editButton.innerText = "Edit";

    editButton.classList.add("edit-btn");


    editButton.addEventListener("click", function() {

        let newTask = prompt(
            "Edit your task",
            task.innerText
        );


        if (
            newTask !== null &&
            newTask.trim() !== ""
        ) {

            task.innerText = newTask.trim();


            let taskItem = tasks.find(function(item) {

                return item.id === taskData.id;

            });


            if (taskItem) {

                taskItem.text = newTask.trim();

            }


            saveTasks();

        }

    });


    // =========================
    // Button Group
    // =========================

    let buttonGroup = document.createElement("div");

    buttonGroup.classList.add("button-group");


    buttonGroup.appendChild(deleteButton);

    buttonGroup.appendChild(completeButton);

    buttonGroup.appendChild(editButton);


    // =========================
    // Add Elements to Task Box
    // =========================

    taskBox.appendChild(task);

    taskBox.appendChild(priority);

    taskBox.appendChild(date);

    taskBox.appendChild(buttonGroup);


    // Add Task Box to Container

    taskContainer.appendChild(taskBox);

}


// =========================
// Update Counter + Progress
// =========================

function updateCounter() {

    let completedCount = tasks.filter(function(item) {

        return item.completed === true;

    }).length;


    taskCount.innerText =
        "Total Tasks: " +
        tasks.length +
        " | Completed: " +
        completedCount;


    // =========================
    // Calculate Progress
    // =========================

    let progress = 0;


    if (tasks.length > 0) {

        progress =
            (completedCount / tasks.length) * 100;

    }


    progressBar.style.width =
        progress + "%";


    progressText.innerText =
        Math.round(progress) +
        "% Completed";

}


// =========================
// Filter + Search Tasks
// =========================

function filterTasks() {

    taskContainer.innerHTML = "";


    let searchText =
        searchInput.value.toLowerCase();


    tasks.forEach(function(taskData) {

        // =========================
        // Search Condition
        // =========================

        let matchesSearch =
            taskData.text
                .toLowerCase()
                .includes(searchText);


        // =========================
        // Filter Condition
        // =========================

        let matchesFilter = false;


        if (currentFilter === "all") {

            matchesFilter = true;

        }


        else if (
            currentFilter === "active" &&
            taskData.completed === false
        ) {

            matchesFilter = true;

        }


        else if (
            currentFilter === "completed" &&
            taskData.completed === true
        ) {

            matchesFilter = true;

        }


        // =========================
        // Display if Both Match
        // =========================

        if (
            matchesSearch &&
            matchesFilter
        ) {

            displayTask(taskData);

        }

    });

}


// =========================
// Filter Button Events
// =========================

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        currentFilter =
            button.dataset.filter;


        filterTasks();

    });

});


// =========================
// Load Saved Tasks
// =========================

tasks.forEach(function(taskData) {

    displayTask(taskData);

});


updateCounter();


// =========================
// Add New Task
// =========================

button.addEventListener("click", function() {

    // Don't allow empty task

    if (input.value.trim() === "") {

        return;

    }


    // =========================
    // Create New Task
    // =========================

    let newTask = {

        id: Date.now(),

        text: input.value.trim(),

        completed: false,

        priority: prioritySelect.value,

        dueDate: dueDate.value

    };


    // Add Task to Array

    tasks.push(newTask);


    // Save Task

    saveTasks();


    // Display Task

    displayTask(newTask);


    // Update Counter

    updateCounter();


    // Clear Inputs

    input.value = "";

    dueDate.value = "";

});


// =========================
// Enter Key
// =========================

input.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        button.click();

    }

});


// =========================
// Dark Mode
// =========================

// Check Saved Dark Mode

let darkMode =
    localStorage.getItem("darkMode");


if (darkMode === "true") {

    document.body.classList.add("dark-mode");

}


// Dark Mode Button

darkModeButton.addEventListener("click", function() {

    document.body.classList.toggle("dark-mode");


    let isDark =
        document.body.classList.contains("dark-mode");


    localStorage.setItem(
        "darkMode",
        isDark
    );

});


// =========================
// Search Tasks
// =========================

searchInput.addEventListener("input", function() {

    filterTasks();

});


// =========================
// Clear All Tasks
// =========================

clearAllButton.addEventListener("click", function() {

    if (tasks.length === 0) {

        return;

    }


    let confirmDelete = confirm(
        "Are you sure you want to delete all tasks?"
    );


    if (confirmDelete) {

        tasks = [];

        saveTasks();

        taskContainer.innerHTML = "";

        updateCounter();

    }

});