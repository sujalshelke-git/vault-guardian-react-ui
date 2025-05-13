
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useVault } from "@/context/VaultContext";
import { Lock, User, Settings, Plus, ChevronRight } from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();
  const { entries } = useVault();
  
  // Category counts
  const categoriesCount = entries.reduce((acc: Record<string, number>, entry) => {
    const category = entry.category || "Uncategorized";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  
  // Recent entries (last 5)
  const recentEntries = [...entries]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name || "User"}
          </h1>
          <p className="text-foreground/70">
            Here's an overview of your secured information
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Lock className="h-5 w-5 mr-2 text-primary" />
                Total Entries
              </CardTitle>
              <CardDescription>
                Passwords and secure notes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{entries.length}</div>
              <div className="mt-2">
                <Link to="/vault">
                  <Button variant="link" className="p-0 h-auto">
                    View all entries <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                Account
              </CardTitle>
              <CardDescription>
                Your account information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium truncate">{user?.email}</div>
              <div className="mt-2">
                <Link to="/profile">
                  <Button variant="link" className="p-0 h-auto">
                    View profile <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Settings className="h-5 w-5 mr-2 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link to="/vault?action=new">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" /> Add new entry
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Entries */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Entries</h2>
            <Link to="/vault">
              <Button variant="outline">View all</Button>
            </Link>
          </div>
          
          <div className="grid gap-4">
            {recentEntries.length > 0 ? (
              recentEntries.map((entry) => (
                <Link key={entry.id} to={`/vault?id=${entry.id}`}>
                  <Card className="hover:border-primary/50 transition-colors">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <div className="font-medium">{entry.name}</div>
                        <div className="text-sm text-foreground/70">{entry.username}</div>
                      </div>
                      <div className="text-sm text-foreground/50">
                        {entry.category || "Uncategorized"}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">No entries yet</p>
                  <Link to="/vault?action=new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" /> Add your first entry
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* Categories */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Categories</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(categoriesCount).length > 0 ? (
              Object.entries(categoriesCount).map(([category, count]) => (
                <Card key={category}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="font-medium">{category}</div>
                    <div className="text-sm bg-primary/10 rounded-full px-2 py-1">
                      {count} {count === 1 ? 'entry' : 'entries'}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">
                    No categories yet. Add entries to organize them into categories.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
