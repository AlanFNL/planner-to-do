import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import TaskCounter from "./components/TaskCounter";
import TabSelector from "./components/TabSelector";
import TaskList from "./components/TaskList";
import AddTaskButton from "./components/AddTaskButton";
import AddTaskForm from "./components/AddTaskForm";
import useTaskStorage from "./hooks/useTaskStorage";
import useUsernameStorage from "./hooks/useUsernameStorage";
import { determineGreeting, formatDateTimeForInput, debugLocalStorage } from "./utils";

/*
TODO: 

- Display current todos
- Add a todo
- Mark as completed
- Edit a todo
- Remove a todo
- Set reminder (send notifications)
- Store in localstorage

*/



function App() {
  // Custom hooks
  const { username, setUsername } = useUsernameStorage("Alan");
  const { 
    tasks, 
    pendingTasks,
    completedTasks,
    addTask, 
    updateTask, 
    deleteTask, 
    toggleComplete 
  } = useTaskStorage();
  
  // UI state
  const [greeting, setGreeting] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [showAddTaskUI, setShowAddTaskUI] = useState(true);
  
  // Form state
  const [newTask, setNewTask] = useState("");
  const [taskReminder, setTaskReminder] = useState<string>("");
  const [notifyEnabled, setNotifyEnabled] = useState(false); // Default to off
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskText, setEditTaskText] = useState("");

  // Get pending count for the counter
  const pendingCount = pendingTasks.length;

  // Check localStorage availability on app start
  useEffect(() => {
    try {
      // Check if localStorage is available
      if (!window.localStorage) {
        console.error("localStorage is not available in this browser");
        return;
      }
      
      // Test if we can write to localStorage
      localStorage.setItem('__test__', 'test');
      localStorage.removeItem('__test__');
      
      // Debug: Check what's already in localStorage
      console.log("localStorage available and working");
      debugLocalStorage.inspect("tasks");
      debugLocalStorage.inspect("username");
    } catch (error) {
      console.error("localStorage is not accessible:", error);
    }
  }, []);

  // Set greeting based on time of day
  useEffect(() => {
    setGreeting(determineGreeting());
  }, []);

  // Reset add task state and hide UI temporarily when switching tabs
  useEffect(() => {
    // Hide add task UI
    setShowAddTaskUI(false);
    // Reset adding state
    setIsAddingTask(false);
    setNewTask("");
    setTaskReminder("");
    setNotifyEnabled(false);
    setEditingTaskId(null);
    // Show add task UI after a short delay
    const timer = setTimeout(() => {
      setShowAddTaskUI(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleAddTask = () => {
    if (!isAddingTask) {
      setIsAddingTask(true);
      
      // Set default date (30 minutes from now)
      const now = new Date();
      now.setMinutes(now.getMinutes() + 30);
      setTaskReminder(formatDateTimeForInput(now));
      
      // Get the saved notification preference from localStorage, default to false if not set
      const savedNotificationPreference = localStorage.getItem('notificationPreference') === 'true';
      setNotifyEnabled(savedNotificationPreference);
    }
  };

  const cancelAddTask = () => {
    console.log("Cancelling task addition");
    setIsAddingTask(false);
    setNewTask("");
    setTaskReminder("");
    setNotifyEnabled(false);
  };

  const addNewTask = () => {
    if (newTask.trim() !== "") {
      try {
        console.log("Starting task addition...");
        
        // Ensure we have a default reminder time
        let useReminder = taskReminder;
        if (!useReminder) {
          const now = new Date();
          now.setMinutes(now.getMinutes() + 30);
          useReminder = formatDateTimeForInput(now);
        }
        
        // Create a date object from the input string
        const reminderDate = new Date(useReminder);
        console.log("Adding task:", {
          text: newTask,
          reminder: reminderDate,
          notifyEnabled: notifyEnabled
        });
        
        // Add the task
        const result = addTask(newTask, reminderDate, notifyEnabled);
        console.log("Task addition result:", result);
        
        // Debug: Verify task was saved
        setTimeout(() => {
          debugLocalStorage.inspect("tasks");
        }, 100);
        
        // Reset form
        cancelAddTask();
        
        console.log("Task addition completed successfully");
      } catch (error) {
        console.error("Error adding task:", error);
      }
    } else {
      console.log("Task text is empty, not adding");
    }
  };

  const handleEditTask = (id: string) => {
    const taskToEdit = tasks.find(task => task.id === id);
    if (taskToEdit) {
      console.log("Editing task:", taskToEdit);
      setEditingTaskId(id);
      setEditTaskText(taskToEdit.text);
      
      // Handle reminder properly
      if (taskToEdit.reminder) {
        // Ensure we have a valid date object
        const reminderDate = taskToEdit.reminder instanceof Date 
          ? taskToEdit.reminder 
          : new Date(taskToEdit.reminder);
        
        // Format it for the input
        setTaskReminder(formatDateTimeForInput(reminderDate));
        console.log("Setting reminder to:", formatDateTimeForInput(reminderDate));
      } else {
        // Set a default reminder if none exists
        const now = new Date();
        now.setMinutes(now.getMinutes() + 30);
        setTaskReminder(formatDateTimeForInput(now));
      }
      
      // Ensure notifyEnabled reflects the task's current setting
      setNotifyEnabled(!!taskToEdit.notifyEnabled);
      console.log("Setting notifications to:", !!taskToEdit.notifyEnabled);
    }
  };

  const saveEditedTask = () => {
    if (editingTaskId && editTaskText.trim() !== "") {
      // Ensure we have a default reminder time
      let useReminder = taskReminder;
      if (!useReminder) {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 30);
        useReminder = formatDateTimeForInput(now);
      }
      
      // Create a date object from the input string
      const reminderDate = new Date(useReminder);
      console.log("Saving task with reminder:", reminderDate, "Notifications:", notifyEnabled);
      
      updateTask(editingTaskId, {
        text: editTaskText,
        reminder: reminderDate,
        notifyEnabled: notifyEnabled
      });
      
      // Debug: Verify task was updated
      setTimeout(() => {
        debugLocalStorage.inspect("tasks");
      }, 100);
      
      setEditingTaskId(null);
      setEditTaskText("");
      setTaskReminder("");
      setNotifyEnabled(false);
    }
  };

  const cancelEditTask = () => {
    setEditingTaskId(null);
    setEditTaskText("");
    setTaskReminder("");
    setNotifyEnabled(false);
  };

  return (
    <motion.div layout className="fixed inset-0 flex flex-col items-center w-screen min-h-screen overflow-x-hidden bg-[#171717]">
      <motion.div
        layout 
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex flex-col justify-center items-center fixed top-16 left-1/2 -translate-x-1/2 w-full px-4"
      >
        <Header 
          greeting={greeting} 
          username={username} 
          setUsername={setUsername} 
        />
        <TaskCounter pendingCount={pendingCount} />
      </motion.div>

      <div className="flex flex-col items-center justify-center font-bold mt-32 w-full max-w-md mx-auto mb-28 px-4">
        <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

        <motion.div layout className="w-full">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-3 w-full"
            >
              <TaskList
                tasks={tasks}
                pendingTasks={pendingTasks}
                completedTasks={completedTasks}
                activeTab={activeTab}
                editingTaskId={editingTaskId}
                editTaskText={editTaskText}
                setEditTaskText={setEditTaskText}
                taskReminder={taskReminder}
                setTaskReminder={setTaskReminder}
                notifyEnabled={notifyEnabled}
                setNotifyEnabled={setNotifyEnabled}
                onEditTask={handleEditTask}
                onTaskComplete={toggleComplete}
                onDeleteTask={deleteTask}
                onSaveEdit={saveEditedTask}
                onCancelEdit={cancelEditTask}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Fixed add task UI at the bottom */}
      {showAddTaskUI && activeTab === "pending" && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-50 bg-[#171717]">
          <AnimatePresence mode="wait">
            {!isAddingTask ? (
              <AddTaskButton onClick={handleAddTask} />
            ) : (
              <AddTaskForm
                newTask={newTask}
                setNewTask={setNewTask}
                taskReminder={taskReminder}
                setTaskReminder={setTaskReminder}
                notifyEnabled={notifyEnabled}
                setNotifyEnabled={setNotifyEnabled}
                onAdd={addNewTask}
                onCancel={cancelAddTask}
              />
            )}
          </AnimatePresence>
        </div>
      )}
      
    
  
    </motion.div>
  );
}

export default App


