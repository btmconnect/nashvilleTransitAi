import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface CommandInputProps {
  onCommand: (command: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CommandInput({
  onCommand,
  placeholder = "Type a command...",
  className = "",
}: CommandInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onCommand(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className={className}
        aria-label="Command input"
      />
      <Button type="submit" aria-label="Send command">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
