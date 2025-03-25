import { motion } from "framer-motion";
import { CheckSquare2, Edit, Trash, Clock, Bell } from "lucide-react";
import { Task } from "../types";

interface TaskItemProps {
  task: Task;
  onEdit: (id: string) => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem = ({ task, onEdit, onComplete, onDelete }: TaskItemProps) => {
  if (task.completed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        layout
        className="bg-white/5 p-4 rounded-md flex items-center justify-between opacity-60"
      >
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onComplete(task.id)}
            className="p-1 rounded-md hover:bg-white/10 shrink-0"
          >
            <CheckSquare2 size={20} className="text-green-400" />
          </motion.button>
          <div className="flex flex-col">
            <span className="line-through">{task.text}</span>
            {task.reminder && (
              <div className="flex items-center gap-2 mt-1 text-xs font-normal text-white/40">
                <Clock size={12} />
                <span className="line-through">
                  {new Date(task.reminder).toLocaleString(undefined, { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 ml-2 shrink-0">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(task.id)}
            className="p-1 rounded-md hover:bg-white/10 text-red-400"
          >
            <Trash size={20} />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
      className="bg-white/5 p-4 rounded-md flex flex-col"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onComplete(task.id)}
            className="p-1 rounded-md hover:bg-white/10 mt-0.5 shrink-0"
          >
            <CheckSquare2 size={20} />
          </motion.button>
          <div>
            <span className="break-words">{task.text}</span>
            {task.reminder && (
              <div className="flex items-center gap-2 mt-2 text-sm font-normal text-white/60">
                <Clock size={14} />
                <span>
                  {new Date(task.reminder).toLocaleString(undefined, { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                {task.notifyEnabled && <Bell size={14} />}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 ml-2 shrink-0">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(task.id)}
            className="p-1 rounded-md hover:bg-white/10"
          >
            <Edit size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(task.id)}
            className="p-1 rounded-md hover:bg-white/10 text-red-400"
          >
            <Trash size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem; 