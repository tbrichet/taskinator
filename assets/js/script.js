// Arrays for Local Storage
var tasks = [];

//Reference Columns
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

//Page Content Selector in order to progam delete buttons
var pageContentEl = document.querySelector("#page-content");

//Create a counter that increments by one each time a task is created
var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

//Function for User Input
var taskFormHandler = function(event) {

    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    //check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    formEl.reset();

    //Save edited tasks
    var isEdit = formEl.hasAttribute("data-task-id");

    //has data attribute, so get task id and call function to complete edit
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    //no data attribute, so create object as normal and pass to createTask
    else {
        //package up data as an object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };
        createTaskEl(taskDataObj);
        }
};

//create edited tasks
var completeEditTask = function(taskName, taskType, taskId) {
    //find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
        
    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    //loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    alert("Task Updated!");

    //reset the form and change the button text back to normal
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";

    //Save tasks to localStorage
    saveTasks();
};

//Function for Creating Tasks from Given user Input
var createTaskEl = function(taskDataObj) {

    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    //Make tasks draggable
    listItemEl.setAttribute("draggable", "true");
    
    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");

    // give it a class name
    taskInfoEl.className = "task-info";

    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl);

    // Add task ID as a property to the taskDataObj variable and add object to task array
    taskDataObj.id = taskIdCounter;

    tasks.push(taskDataObj);

    // increase task counter for next unique id
    taskIdCounter++;

    //Save tasks functon
    saveTasks();
}

//Add Buttons and Dropdowns to Each Task
var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    //create dropdown
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    //for loop to add dropdown menu options
    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i <statusChoices.length; i++) {
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        //append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    actionContainerEl.appendChild(statusSelectEl);

    return actionContainerEl;
}

formEl.addEventListener("submit", taskFormHandler);

//Function for Identifying Edit and Delete Button Clicks
var taskButtonHandler = function(event) {
    //get target element from event
    var targetEl = event.target;

    // edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

    //delete button was clicked
    else if (targetEl.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

//Function to Edit Tasks
var editTask = function(taskId) {

    //get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);

};

//Function to Delete Tasks
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    //Create new array to hold updated list of tasks
    var updatedTaskArr = [];

    //loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        //if tasks[i].id doesn't match the value of taskId, let's keep that task and push into the new array
        if (tasks[i].id !== parseInf(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    //Reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

    //Save tasks to localStorage
    saveTasks();
};


//Function to move tasks to other columns
var taskStatusChangeHandler = function(event) {
    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");
  
    // get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();
  
    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
      } 
      else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
      } 
      else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
      }
    
    // update tasks in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }

    //Save tasks to localStorage
    saveTasks();
};

//Function to drag tasks
var dragTaskHandler = function(event) {
    var taskId = event.target.getAttribute("data-task-id");
    event.dataTransfer.setData("text/plain", taskId);
    var getId = event.dataTransfer.getData("text/plain");
    console.log("getId", getId, typeof getId);
};

//Function to define where tasks can be dragged
var dropZoneDragHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
    event.preventDefault();
    //highlight column when task hovers over it
    taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
};

//Function to drop tasks in new column
var dropTaskHandler = function(event) {
    var id = event.dataTransfer.getData("text/plain");
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");
    var dropZoneEl = event.target.closest(".task-list");
    var statusType = dropZoneEl.id;

    //set status of task based on dropZone id
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");

    if (statusType === "tasks-to-do") {
        statusSelectEl.selectedIndex = 0;
    }
    else if (statusType === "tasks-in-progress") {
        statusSelectEl.selectedIndex = 1;
    }
    else if (statusType === "tasks-completed") {
        statusSelectEl.selectedIndex = 2;
    }
    //Remove highlight from column when task is dropped
    dropZoneEl.removeAttribute("style");

    dropZoneEl.appendChild(draggableElement);

    //Loop through tasks array to find and update the updated task's status
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(id)) {
            tasks[i].status - statusSelectEl.value.toLowerCase();
        }
    }

    // Save task to localStorage
    saveTasks();
 };

//Function to correct hightlights when task hovers over column
var dragLeaveHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        taskListEl.removeAttribute("style");
    }
};

// Save Tasks in LocalStorage
var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

    //Get task items from localStorage

var loadTasks = function() {
    tasks = localStorage.getItem("tasks", tasks);

    if (tasks === null) {
        tasks =[];
        return false;
    };

    //Convert tasks from stringified format back into an array of objects

    tasks = JSON.parse(tasks);

    //Iterate through tasks array and create task elements on the page from it
 
    for (i = 0; i <tasks.length; i++) {
        tasks[i].id = taskIdCounter;
        var listItemEl = document.createElement("li");
        listItemEl.className = "task-item";
        listItemEl.setAttribute("data-task-id", tasks[i].id);
        listItemEl.setAttribute("draggable", "true");

        var taskInfoEl = document.createElement("div");
        taskInfoEl.className = "task-info";
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
    
        taskInfoEl.appendChild(listItemEl);

        var taskActionsEl = createTaskActions(tasks[i].id);
        taskActionsEl.appendChild(listItemEl);
        if (tasks[i].status === "to do") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
            listItemEl.appendChild(tasksToDoEl);
        }
        else if (tasks[i].status === "in progress") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
            listItemEl.appendChild(tasksInProgressEl);
        }
        else if (tasks[i].status === "complete") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
            listItemEl.appendChild(tasksCompletedEl);
        }
        taskIdCounter++;
    }
};

//Event listener for delete button
pageContentEl.addEventListener("click", taskButtonHandler);

//Event listener to see if task status changes
pageContentEl.addEventListener("change", taskStatusChangeHandler);

//Event listener to drag tasks
pageContentEl.addEventListener("dragstart", dragTaskHandler);

//Event listener to delegate where tasks can be dropped
pageContentEl.addEventListener("dragover", dropZoneDragHandler);

//Event listener to drop tasks
pageContentEl.addEventListener("drop", dropTaskHandler);

//Event listener for highlighting columns when task hovers
pageContentEl.addEventListener("dragleave", dragLeaveHandler);