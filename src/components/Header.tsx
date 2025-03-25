import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface HeaderProps {
  greeting: string;
  username: string;
  setUsername: (name: string) => void;
}

const Header = ({ greeting, username, setUsername }: HeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputWidth, setInputWidth] = useState(0);
  
  const textRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hiddenTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (hiddenTextRef.current) {
      hiddenTextRef.current.textContent = username;
      setInputWidth(hiddenTextRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    if (isEditing) {
      if (hiddenTextRef.current) {
        hiddenTextRef.current.textContent = username;
        const newWidth = hiddenTextRef.current.offsetWidth;
        setInputWidth(newWidth > 0 ? newWidth : 20);
      }
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isEditing, username]);

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setUsername(newValue);
    
    if (hiddenTextRef.current) {
      hiddenTextRef.current.textContent = newValue;
      const newWidth = hiddenTextRef.current.offsetWidth;
      setInputWidth(newWidth > 0 ? newWidth : 20);
    }
  };

  return (
    <h1 className="text-2xl md:text-5xl font-bold transition-all mb-6 text-center w-full overflow-hidden">
      <div className="flex flex-wrap justify-center items-center gap-2">
        <div className="inline-block whitespace-nowrap">Good {greeting},</div>
        { isEditing ? (
          <motion.div 
            layout
            initial={{ width: inputWidth || 'auto' }}
            animate={{ width: inputWidth || 'auto' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ display: "inline-block" }}
            className="max-w-[60vw]"
          >
            <input 
              ref={inputRef}
              type="text"
              value={username}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              autoFocus
              style={{ width: inputWidth ? `${inputWidth}px` : 'auto' }} 
              className="bg-transparent border-none outline-none appearance-none p-0 text-center w-full"
              inputMode="text"
              autoComplete="off"
              autoCapitalize="words"
            />
          </motion.div>
        ) : (
          <motion.span 
            layout
            ref={textRef} 
            onClick={() => setIsEditing(true)} 
            className="cursor-pointer inline-block max-w-[60vw] truncate"
          >
            {username}
          </motion.span>
        )}
      </div>
      <span 
        ref={hiddenTextRef} 
        style={{ 
          visibility: "hidden", 
          position: "absolute", 
          whiteSpace: "pre",
          fontSize: "inherit", 
          fontWeight: "bold",
          left: "-9999px",
          top: 0
        }}
      >
        {username}
      </span>
    </h1>
  );
};

export default Header; 