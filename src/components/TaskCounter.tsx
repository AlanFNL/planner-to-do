import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare2 } from "lucide-react";

interface TaskCounterProps {
  pendingCount: number;
}

const TaskCounter = ({ pendingCount }: TaskCounterProps) => {
  return (
    <div className="flex flex-wrap items-center justify-center text-xl md:text-3xl font-bold gap-2">
      <h2 className="text-white/60 whitespace-nowrap">You have</h2> 
      <div className="flex items-center gap-2 min-w-[80px] justify-center">
        <CheckSquare2 className="shrink-0" />
        <div className="h-8 w-8 relative overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={pendingCount}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute left-1/2 -translate-x-1/2"
            >
              {pendingCount}
            </motion.span>
          </AnimatePresence>
        </div>
        <span className="whitespace-nowrap">{pendingCount === 1 ? "task" : "tasks"}</span>
      </div>
      <h2 className="text-white/60 whitespace-nowrap">left today.</h2>
    </div>
  );
};

export default TaskCounter; 