import { useRef, useEffect, useContext, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar, Bell, BellOff, AlertTriangle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { NotificationsContext } from "../contexts/NotificationsContext";

interface AddTaskFormProps {
  newTask: string;
  setNewTask: (task: string) => void;
  taskReminder: string;
  setTaskReminder: (reminder: string) => void;
  notifyEnabled: boolean;
  setNotifyEnabled: (enabled: boolean) => void;
  onAdd: () => void;
  onCancel: () => void;
}

const AddTaskForm = ({
  newTask,
  setNewTask,
  taskReminder,
  setTaskReminder,
  notifyEnabled,
  setNotifyEnabled,
  onAdd,
  onCancel
}: AddTaskFormProps) => {
  const taskInputRef = useRef<HTMLInputElement>(null);
  const { permissionState, requestPermission } = useContext(NotificationsContext);
  
  // Store the date directly without converting to string
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    // If there's an existing task reminder, parse it
    if (taskReminder) {
      return new Date(taskReminder);
    }
    
    // Otherwise, set default to 30 minutes from now
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now;
  });

  useEffect(() => {
    if (taskInputRef.current) {
      taskInputRef.current.focus();
    }
    
    // If no task reminder is set, initialize with default time
    if (!taskReminder) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 30);
      setSelectedDate(now);
      
      // We'll update taskReminder based on selectedDate in another effect
    }
  }, [taskReminder]);

  // Update the string representation whenever selectedDate changes
  useEffect(() => {
    // Store the ISO string directly
    setTaskReminder(selectedDate.toISOString());
  }, [selectedDate, setTaskReminder]);

  const handleTaskInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTask.trim() !== "") {
      handleAdd();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };
  
  const handleAdd = () => {
    // Ensure reminder has a value before adding
    if (taskReminder === '') {
      // Set a default date if nothing provided
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 16);
      setTaskReminder(formattedDate);
    }
    
    onAdd();
  };

  const handleNotificationToggle = async () => {
    // If already enabled, just toggle off
    if (notifyEnabled) {
      setNotifyEnabled(false);
      localStorage.setItem('notificationPreference', 'false');
      return;
    }
    
    // If permissions already granted, just toggle on
    if (permissionState === 'granted') {
      setNotifyEnabled(true);
      localStorage.setItem('notificationPreference', 'true');
      return;
    }
    
    // Otherwise request permission and then toggle if granted
    const granted = await requestPermission();
    if (granted) {
      setNotifyEnabled(true);
      localStorage.setItem('notificationPreference', 'true');
    }
  };

  const getNotificationDisplay = () => {
    if (permissionState === 'unsupported') {
      return {
        icon: <AlertTriangle size={18} className="text-yellow-400 shrink-0" />,
        text: "Not supported",
        color: "text-yellow-400"
      };
    } else if (permissionState === 'denied') {
      return {
        icon: <AlertTriangle size={18} className="text-red-400 shrink-0" />,
        text: "Blocked in browser",
        color: "text-red-400"
      };
    } else {
      return {
        icon: notifyEnabled 
          ? <Bell size={18} className="text-green-400 shrink-0" />
          : <BellOff size={18} className="text-white/40 shrink-0" />,
        text: "Notifications",
        color: notifyEnabled ? "text-white" : "text-white/40"
      };
    }
  };

  const notificationDisplay = getNotificationDisplay();
  const canToggleNotifications = permissionState !== 'unsupported' && permissionState !== 'denied';

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 40
      }}
      className="flex flex-col gap-4 w-full max-w-md mx-auto"
    >
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
        className="contents"
      >
        <div className="flex flex-col gap-3 bg-white/10 rounded-lg p-4 backdrop-blur-xl">
          <input
            ref={taskInputRef}
            type="text"
            placeholder="What needs to be done?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleTaskInputKeyDown}
            className="bg-transparent border-none outline-none appearance-none p-2 text-white text-lg border-b border-white/20 w-full"
            inputMode="text"
            autoComplete="off"
            aria-label="New task input"
          />
          
          <div className="flex flex-col gap-3 mt-2">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-white/60 shrink-0" />
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => date && setSelectedDate(date)}
                showTimeSelect
                dateFormat="MMM d, yyyy h:mm aa"
                timeFormat="HH:mm"
                minDate={new Date()}
                placeholderText="Select date and time"
                className="bg-white/5 rounded p-2 text-sm flex-1 border-none outline-none w-full text-white cursor-pointer"
                calendarClassName="bg-[#262626] border-0 rounded-md text-white shadow-lg"
                popperClassName="react-datepicker-dark"
                required
                fixedHeight
                shouldCloseOnSelect={false}
                onKeyDown={(e) => {
                  // Prevent backspace, delete and other editing keys
                  if (e.key === 'Backspace' || e.key === 'Delete') {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            
            {/* Notification toggle styled as a switch */}
            <div className="flex items-center justify-between p-2 rounded-md">
              <div className="flex items-center gap-2">
                {notificationDisplay.icon}
                <span className={`${notificationDisplay.color} whitespace-nowrap`}>
                  {notificationDisplay.text}
                </span>
              </div>
              
              {canToggleNotifications && (
                <div 
                  onClick={handleNotificationToggle}
                  className={`w-12 h-6 rounded-full relative ${notifyEnabled ? 'bg-green-500' : 'bg-white/20'} transition-colors duration-200 cursor-pointer shrink-0`}
                  role="switch"
                  aria-checked={notifyEnabled}
                  tabIndex={0}
                >
                  <motion.div 
                    initial={false}
                    animate={{ x: notifyEnabled ? 24 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 bg-[#171717] py-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="flex-1 bg-white/5 hover:bg-white/10 rounded-md py-2"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!newTask.trim()}
            className={`flex-1 rounded-md py-2 flex items-center justify-center gap-2 ${
              newTask.trim() ? 'bg-white/20 hover:bg-white/30' : 'bg-white/5 cursor-not-allowed'
            }`}
          >
            <Plus size={18} />
            Add Task
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddTaskForm; 