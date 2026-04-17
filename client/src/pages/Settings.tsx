import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Bell, Lock, Palette, User } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function Settings() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"account" | "preferences" | "notifications" | "security">("account");

  const { data: preferences } = trpc.profile.getPreferences.useQuery(undefined, {
    enabled: !!user,
  });

  const updatePreferencesMutation = trpc.profile.updatePreferences.useMutation({
    onSuccess: () => {
      // Preferences updated successfully
    },
  });

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/chat")}
              className="hover:bg-card-foreground/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold neon-glow">Settings</h1>
          </div>
          <Button
            onClick={() => navigate("/about" as any)}
            variant="outline"
            size="sm"
          >
            About
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <div className="space-y-2 sticky top-8">
              <button
                onClick={() => setActiveTab("account")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  activeTab === "account"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-card-foreground/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                <User className="w-4 h-4" />
                Account
              </button>
              <button
                onClick={() => setActiveTab("preferences")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  activeTab === "preferences"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-card-foreground/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Palette className="w-4 h-4" />
                Preferences
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  activeTab === "notifications"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-card-foreground/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Bell className="w-4 h-4" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  activeTab === "security"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-card-foreground/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Lock className="w-4 h-4" />
                Security
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            {/* Account Tab */}
            {activeTab === "account" && (
              <Card className="p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Name</label>
                      <p className="text-lg mt-1">{user?.name || "Not set"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-lg mt-1">{user?.email || "Not set"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                      <p className="text-lg mt-1 capitalize">{user?.role || "User"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                      <p className="text-lg mt-1">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold mb-4">Danger Zone</h3>
                  <Button onClick={handleLogout} variant="destructive">
                    Logout
                  </Button>
                </div>
              </Card>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <Card className="p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Display Preferences</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Theme</label>
                      <select
                        defaultValue={preferences?.theme || "light"}
                        onChange={(e) =>
                          updatePreferencesMutation.mutate({
                            theme: (e.target.value as "light" | "dark") || "light",
                            language: preferences?.language || "en",
                            timezone: preferences?.timezone || "UTC",
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Language</label>
                      <select
                        defaultValue={preferences?.language || "en"}
                        onChange={(e) =>
                          updatePreferencesMutation.mutate({
                            theme: (preferences?.theme as "light" | "dark") || "light",
                            language: e.target.value,
                            timezone: preferences?.timezone || "UTC",
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="ja">日本語</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Timezone</label>
                      <select
                        defaultValue={preferences?.timezone || "UTC"}
                        onChange={(e) =>
                          updatePreferencesMutation.mutate({
                            theme: (preferences?.theme as "light" | "dark") || "light",
                            language: preferences?.language || "en",
                            timezone: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground"
                      >
                        <option value="UTC">UTC</option>
                        <option value="EST">Eastern Time</option>
                        <option value="CST">Central Time</option>
                        <option value="MST">Mountain Time</option>
                        <option value="PST">Pacific Time</option>
                        <option value="GMT">GMT</option>
                        <option value="CET">Central European Time</option>
                        <option value="IST">India Standard Time</option>
                        <option value="JST">Japan Standard Time</option>
                        <option value="AEST">Australian Eastern Time</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <Card className="p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive email updates about your sessions</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked={preferences?.emailNotifications === 1}
                        onChange={(e) =>
                          updatePreferencesMutation.mutate({
                            theme: (preferences?.theme as "light" | "dark") || "light",
                            language: preferences?.language || "en",
                            timezone: preferences?.timezone || "UTC",
                          })
                        }
                        className="w-5 h-5"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div>
                        <p className="font-medium">Session Summaries</p>
                        <p className="text-sm text-muted-foreground">Get automated summaries after each session</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked={preferences?.summaryNotifications === 1}
                        onChange={(e) =>
                          updatePreferencesMutation.mutate({
                            theme: (preferences?.theme as "light" | "dark") || "light",
                            language: preferences?.language || "en",
                            timezone: preferences?.timezone || "UTC",
                          })
                        }
                        className="w-5 h-5"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div>
                        <p className="font-medium">Weekly Digest</p>
                        <p className="text-sm text-muted-foreground">Receive a weekly digest of your progress</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked={preferences?.weeklyDigest === 1}
                        onChange={(e) =>
                          updatePreferencesMutation.mutate({
                            theme: (preferences?.theme as "light" | "dark") || "light",
                            language: preferences?.language || "en",
                            timezone: preferences?.timezone || "UTC",
                          })
                        }
                        className="w-5 h-5"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <Card className="p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Security & Privacy</h2>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-card-foreground/5 border border-border">
                      <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Add an extra layer of security to your account
                      </p>
                      <Button variant="outline" disabled>
                        Enable 2FA (Coming Soon)
                      </Button>
                    </div>

                    <div className="p-4 rounded-lg bg-card-foreground/5 border border-border">
                      <h3 className="font-medium mb-2">Session Management</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        View and manage your active sessions across devices
                      </p>
                      <Button variant="outline" disabled>
                        Manage Sessions (Coming Soon)
                      </Button>
                    </div>

                    <div className="p-4 rounded-lg bg-card-foreground/5 border border-border">
                      <h3 className="font-medium mb-2">Data & Privacy</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Download your data or request account deletion
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" disabled>
                          Download Data (Coming Soon)
                        </Button>
                        <Button variant="outline" disabled>
                          Delete Account (Coming Soon)
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
