import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";

interface AddTaskButtonProps {
  onClick: () => void;
}

const AddTaskButton = ({ onClick }: AddTaskButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
      className="flex items-center justify-center w-full max-w-md mx-auto"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-full py-3 px-6 w-full transition-colors backdrop-blur-sm"
      >
        <PlusCircle size={20} />
        <span>Add new task</span>
      </motion.button>
    </motion.div>
  );
};

export default AddTaskButton; 