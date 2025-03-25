import { useRef, useEffect, useContext, useState } from "react";
import { motion } from "framer-motion";
import { CheckSquare2, X, Calendar, Bell, BellOff } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { NotificationsContext } from '../contexts/NotificationsContext';

interface EditTaskFormProps {
  editTaskText: string;
  setEditTaskText: (text: string) => void;
  taskReminder: string;
  setTaskReminder: (reminder: string) => void;
  notifyEnabled: boolean;
  setNotifyEnabled: (enabled: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditTaskForm = ({
  editTaskText,
  setEditTaskText,
  taskReminder,
  setTaskReminder,
  notifyEnabled,
  setNotifyEnabled,
  onSave,
  onCancel
}: EditTaskFormProps) => {
  const editInputRef = useRef<HTMLInputElement>(null);
  const { permissionState, requestPermission } = useContext(NotificationsContext);
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    return taskReminder ? new Date(taskReminder) : null;
  });

  useEffect(() => {
    if (editInputRef.current) {
      editInputRef.current.focus();
    }
  }, []);

  // Update string date when the DatePicker date changes
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().slice(0, 16);
      setTaskReminder(formattedDate);
    }
  }, [selectedDate, setTaskReminder]);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && editTaskText.trim() !== "") {
      onSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  const handleSave = () => {
    if (editTaskText.trim() !== "") {
      onSave();
    }
  };

  const handleToggleNotify = async () => {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white/10 p-3 rounded-md"
    >
      <div className="flex gap-2 items-center mb-2">
        <input
          ref={editInputRef}
          type="text"
          value={editTaskText}
          onChange={(e) => setEditTaskText(e.target.value)}
          onKeyDown={handleInputKeyDown}
          className="bg-transparent border-none outline-none appearance-none p-2 text-white flex-1"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className="p-1 rounded-md hover:bg-white/10"
        >
          <CheckSquare2 size={18} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="p-1 rounded-md hover:bg-white/10"
        >
          <X size={18} />
        </motion.button>
      </div>
      
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center gap-2 text-sm font-normal">
          <Calendar size={16} className="text-white/60" />
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            showTimeSelect
            dateFormat="MMM d, yyyy h:mm aa"
            timeFormat="HH:mm"
            minDate={new Date()}
            placeholderText="Select date and time"
            className="bg-white/5 rounded p-1 text-xs border-none outline-none w-full text-white cursor-pointer"
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
        <div className="flex items-center justify-between text-sm font-normal cursor-pointer">
          <div className="flex items-center gap-2">
            {notifyEnabled ? (
              <Bell size={16} className="text-green-400" />
            ) : (
              <BellOff size={16} className="text-white/40" />
            )}
            <span className={notifyEnabled ? "text-white" : "text-white/40"}>
              Notifications
            </span>
          </div>
          
          <div 
            onClick={handleToggleNotify}
            className={`w-10 h-5 rounded-full relative ${notifyEnabled ? 'bg-green-500' : 'bg-white/20'} transition-colors duration-200`}
          >
            <motion.div 
              initial={false}
              animate={{ x: notifyEnabled ? 20 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-4 h-4 bg-white rounded-full absolute top-0.5"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EditTaskForm; 