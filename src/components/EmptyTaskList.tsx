import { motion } from "framer-motion";
import { CheckSquare2 } from "lucide-react";

interface EmptyTaskListProps {
  type: "pending" | "completed";
}

const EmptyTaskList = ({ type }: EmptyTaskListProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-full text-center opacity-60"
    >
      <CheckSquare2 size={64} className="mb-4 opacity-30" />
      {type === "pending" ? (
        <>
          <h3 className="text-xl mb-2">No tasks for today</h3>
          <p className="text-sm text-white/60">Tap + to add a new task.</p>
        </>
      ) : (
        <>
          <h3 className="text-xl mb-2">No completed tasks</h3>
          <p className="text-sm text-white/60">Completed tasks will appear here.</p>
        </>
      )}
    </motion.div>
  );
};

export default EmptyTaskList; 