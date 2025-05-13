
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useVault, VaultEntry } from "@/context/VaultContext";
import { Eye, EyeOff } from "lucide-react";

interface EntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: VaultEntry | null;
}

export const EntryDialog = ({ open, onOpenChange, entry }: EntryDialogProps) => {
  const { addEntry, updateEntry, decryptPassword } = useVault();
  
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    username?: string;
    password?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form when entry changes or dialog opens/closes
  useEffect(() => {
    if (open) {
      if (entry) {
        setName(entry.name);
        setUsername(entry.username);
        setPassword(decryptPassword(entry.password));
        setUrl(entry.url || "");
        setNotes(entry.notes || "");
        setCategory(entry.category || "");
      } else {
        // Clear form for new entry
        setName("");
        setUsername("");
        setPassword("");
        setUrl("");
        setNotes("");
        setCategory("");
      }
      setShowPassword(false);
      setErrors({});
    }
  }, [entry, open, decryptPassword]);
  
  const validateForm = () => {
    const newErrors: {
      name?: string;
      username?: string;
      password?: string;
    } = {};
    let isValid = true;
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    
    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }
    
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (entry) {
        // Update existing entry
        await updateEntry(entry.id, {
          name,
          username,
          password, // Will be encrypted in context
          url: url || undefined,
          notes: notes || undefined,
          category: category || undefined,
        });
      } else {
        // Add new entry
        await addEntry({
          name,
          username,
          password,
          url: url || undefined,
          notes: notes || undefined,
          category: category || undefined,
        });
      }
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{entry ? "Edit Entry" : "Add New Entry"}</DialogTitle>
          <DialogDescription>
            {entry 
              ? "Update the details of your existing vault entry" 
              : "Enter the details to add a new entry to your vault"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Google, Facebook, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username/Email</Label>
            <Input
              id="username"
              placeholder="your.email@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={errors.username ? "border-destructive" : ""}
            />
            {errors.username && (
              <p className="text-destructive text-sm">{errors.username}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "border-destructive pr-10" : "pr-10"}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/70"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-destructive text-sm">{errors.password}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">Website URL (optional)</Label>
            <Input
              id="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category (optional)</Label>
            <Input
              id="category"
              placeholder="Social, Banking, Work, etc."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional information here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="secureVault-gradient-bg"
          >
            {isSubmitting
              ? entry ? "Updating..." : "Adding..."
              : entry ? "Update Entry" : "Add Entry"
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
