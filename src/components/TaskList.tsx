import { motion, AnimatePresence } from "framer-motion";
import { Task } from "../types";
import TaskItem from "./TaskItem";
import EditTaskForm from "./EditTaskForm";
import EmptyTaskList from "./EmptyTaskList";

interface TaskListProps {
  tasks: Task[];
  pendingTasks: Task[];
  completedTasks: Task[];
  activeTab: "pending" | "completed";
  editingTaskId: string | null;
  editTaskText: string;
  setEditTaskText: (text: string) => void;
  taskReminder: string;
  setTaskReminder: (reminder: string) => void;
  notifyEnabled: boolean;
  setNotifyEnabled: (enabled: boolean) => void;
  onEditTask: (id: string) => void;
  onTaskComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

const TaskList = ({
  pendingTasks,
  completedTasks,
  activeTab,
  editingTaskId,
  editTaskText,
  setEditTaskText,
  taskReminder,
  setTaskReminder,
  notifyEnabled,
  setNotifyEnabled,
  onEditTask,
  onTaskComplete,
  onDeleteTask,
  onSaveEdit,
  onCancelEdit
}: TaskListProps) => {
  // Get the right list based on the active tab
  const displayedTasks = activeTab === "pending" ? pendingTasks : completedTasks;

  return (
    <motion.div
      layout
      className="h-[300px] overflow-y-auto w-full flex flex-col gap-3 custom-scrollbar"
    >
      {displayedTasks.length > 0 ? (
        displayedTasks.map(task => (
          <AnimatePresence key={task.id} mode="wait">
            {editingTaskId === task.id ? (
              <EditTaskForm
                editTaskText={editTaskText}
                setEditTaskText={setEditTaskText}
                taskReminder={taskReminder}
                setTaskReminder={setTaskReminder}
                notifyEnabled={notifyEnabled}
                setNotifyEnabled={setNotifyEnabled}
                onSave={onSaveEdit}
                onCancel={onCancelEdit}
              />
            ) : (
              <TaskItem
                task={task}
                onEdit={onEditTask}
                onComplete={onTaskComplete}
                onDelete={onDeleteTask}
              />
            )}
          </AnimatePresence>
        ))
      ) : (
        <EmptyTaskList type={activeTab} />
      )}
    </motion.div>
  );
};

export default TaskList; 