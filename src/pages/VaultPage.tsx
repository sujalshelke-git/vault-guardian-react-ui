
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useVault, VaultEntry } from "@/context/VaultContext";
import { EntryDialog } from "@/components/EntryDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Edit, Trash2, Copy, EyeOff, Eye, Clipboard } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const VaultPage = () => {
  const { entries, searchEntries, deleteEntry, decryptPassword } = useVault();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEntries, setFilteredEntries] = useState<VaultEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<VaultEntry | null>(null);
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<VaultEntry | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  
  // Handle URL parameters
  useEffect(() => {
    const action = searchParams.get("action");
    const id = searchParams.get("id");
    
    if (action === "new") {
      setSelectedEntry(null);
      setIsEntryDialogOpen(true);
      // Clear the URL parameter after processing
      setSearchParams({});
    } else if (id) {
      const entry = entries.find(e => e.id === id);
      if (entry) {
        setSelectedEntry(entry);
        setIsEntryDialogOpen(true);
      }
      // Clear the URL parameter after processing
      setSearchParams({});
    }
  }, [searchParams, entries, setSearchParams]);
  
  // Filter entries based on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEntries(entries);
    } else {
      setFilteredEntries(searchEntries(searchQuery));
    }
  }, [searchQuery, entries, searchEntries]);
  
  const handleOpenEntryDialog = (entry?: VaultEntry) => {
    setSelectedEntry(entry || null);
    setIsEntryDialogOpen(true);
  };
  
  const handleDeleteClick = (entry: VaultEntry) => {
    setEntryToDelete(entry);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (entryToDelete) {
      await deleteEntry(entryToDelete.id);
      setIsDeleteDialogOpen(false);
    }
  };
  
  const togglePasswordVisibility = (entryId: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [entryId]: !prev[entryId]
    }));
  };
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
      duration: 2000,
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Vault</h1>
            <p className="text-foreground/70">
              All your passwords and secure notes in one place
            </p>
          </div>
          <Button onClick={() => handleOpenEntryDialog()} className="secureVault-gradient-bg">
            <Plus className="h-4 w-4 mr-2" /> Add Entry
          </Button>
        </div>
        
        <div className="mb-6 flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/50" />
            <Input
              placeholder="Search your vault..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 bg-muted flex justify-between items-center border-b border-border">
            <div className="flex-1 font-medium">Name</div>
            <div className="flex-1 hidden md:block font-medium">Username</div>
            <div className="flex-1 hidden lg:block font-medium">Category</div>
            <div className="flex-1 font-medium">Password</div>
            <div className="w-24 text-right font-medium">Actions</div>
          </div>
          
          <ScrollArea className="max-h-[60vh]">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <div 
                  key={entry.id} 
                  className="p-4 border-b border-border hover:bg-muted/50 transition-colors flex items-center"
                >
                  <div className="flex-1 font-medium truncate">{entry.name}</div>
                  <div className="flex-1 hidden md:block text-foreground/70 truncate">{entry.username}</div>
                  <div className="flex-1 hidden lg:block text-foreground/70">{entry.category || "-"}</div>
                  <div className="flex-1 flex items-center">
                    <div className="relative flex-1">
                      <Input
                        type={visiblePasswords[entry.id] ? "text" : "password"}
                        value={visiblePasswords[entry.id] ? decryptPassword(entry.password) : "••••••••"}
                        className="pr-9"
                        readOnly
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(entry.id)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/70"
                      >
                        {visiblePasswords[entry.id] ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(decryptPassword(entry.password), "Password")}
                      className="ml-2"
                    >
                      <Clipboard className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="w-24 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                            <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenEntryDialog(entry)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(entry)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-foreground/70 mb-4">
                  {searchQuery ? "No entries match your search" : "No entries in your vault yet"}
                </p>
                {!searchQuery && (
                  <Button 
                    onClick={() => handleOpenEntryDialog()} 
                    className="secureVault-gradient-bg"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Entry
                  </Button>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </main>
      
      {/* Entry Dialog */}
      <EntryDialog
        open={isEntryDialogOpen}
        onOpenChange={setIsEntryDialogOpen}
        entry={selectedEntry}
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Entry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{entryToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VaultPage;
