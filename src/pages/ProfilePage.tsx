
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useVault } from "@/context/VaultContext";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { entries } = useVault();
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // For demo purposes, we're not actually updating the user info
  const handleUpdateProfile = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated",
      });
      setIsSubmitting(false);
    }, 1000);
  };
  
  const handleExportVault = () => {
    // Create a JSON blob with the vault data
    const vaultData = JSON.stringify(entries, null, 2);
    const blob = new Blob([vaultData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = `securevault-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Vault exported",
      description: "Your vault has been exported as a JSON file",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile & Settings</h1>
          <p className="text-foreground/70">
            Manage your account and security preferences
          </p>
        </div>
        
        <Tabs defaultValue="account" className="space-y-8">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your account details and personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-sm text-foreground/70">
                    This email is used for notifications and login
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setName(user?.name || "");
                    setEmail(user?.email || "");
                  }}
                >
                  Reset
                </Button>
                <Button 
                  onClick={handleUpdateProfile}
                  disabled={isSubmitting}
                  className="secureVault-gradient-bg"
                >
                  {isSubmitting ? "Updating..." : "Update Profile"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your master password
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="secureVault-gradient-bg ml-auto"
                    onClick={() => {
                      toast({
                        title: "Password updated",
                        description: "Your password has been updated successfully",
                      });
                    }}
                  >
                    Update Password
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">2FA Status</h4>
                      <p className="text-sm text-foreground/70">
                        Two-factor authentication is currently disabled
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="data">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vault Export</CardTitle>
                  <CardDescription>
                    Export your vault data for backup purposes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70 mb-4">
                    Export your vault as a JSON file. The file will contain all your vault entries, including encrypted passwords.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleExportVault}
                  >
                    Export Vault
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                  <CardDescription>
                    Manage your account status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Logout from all devices</h4>
                    <p className="text-sm text-foreground/70 mb-2">
                      This will log you out from all devices where you're currently logged in
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "Logged out from all devices",
                          description: "You have been logged out from all devices",
                        });
                      }}
                    >
                      Logout from all devices
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium text-destructive mb-2">Danger Zone</h4>
                    <p className="text-sm text-foreground/70 mb-2">
                      These actions are irreversible. Please proceed with caution.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        variant="destructive"
                        onClick={logout}
                      >
                        Logout
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          toast({
                            variant: "destructive",
                            title: "Cannot delete account",
                            description: "This is a demo application, account deletion is disabled",
                          });
                        }}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ProfilePage;
