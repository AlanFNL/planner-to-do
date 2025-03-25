import { motion } from "framer-motion";

type TabType = "pending" | "completed";

interface TabSelectorProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TabSelector = ({ activeTab, setActiveTab }: TabSelectorProps) => {
  return (
    <motion.div 
      layout
      className="flex gap-3 justify-between items-center text-center mb-8 mt-24 w-full"
    >
      <motion.div 
        className={`cursor-pointer text-white/60 rounded-md p-2 relative flex-1 ${activeTab === "pending" ? "text-white" : ""}`} 
        onClick={() => setActiveTab("pending")}
      >
        Pending
        {activeTab === "pending" && (
          <motion.div 
            layoutId="activeTab"
            className="absolute inset-0 bg-white/10 rounded-md -z-10"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </motion.div>
      <motion.div 
        className={`cursor-pointer text-white/60 rounded-md p-2 relative flex-1 ${activeTab === "completed" ? "text-white" : ""}`} 
        onClick={() => setActiveTab("completed")}
      >
        Completed
        {activeTab === "completed" && (
          <motion.div 
            layoutId="activeTab"
            className="absolute inset-0 bg-white/10 rounded-md -z-10"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default TabSelector; 