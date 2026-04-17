import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft, Save, Mail, Bell, Palette, Settings } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Preferences {
  theme: "dark" | "light";
  language: string;
  emailNotifications: boolean;
  summaryNotifications: boolean;
  weeklyDigest: boolean;
  timezone: string;
}

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [preferences, setPreferences] = useState<Preferences>({
    theme: "dark",
    language: "en",
    emailNotifications: true,
    summaryNotifications: true,
    weeklyDigest: false,
    timezone: "UTC",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"account" | "preferences" | "notifications">("account");

  // Fetch user preferences
  const { data: prefsData, isLoading: isLoadingPrefs } = trpc.profile.getPreferences.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Update preferences mutation
  const updatePrefsMutation = trpc.profile.updatePreferences.useMutation({
    onSuccess: () => {
      toast.success("Preferences updated successfully!");
      setIsSaving(false);
    },
    onError: (error) => {
      toast.error("Failed to update preferences");
      setIsSaving(false);
    },
  });

  // Load preferences when data arrives
  useEffect(() => {
    if (prefsData) {
      setPreferences({
        theme: prefsData.theme as "dark" | "light",
        language: prefsData.language,
        emailNotifications: prefsData.emailNotifications === 1,
        summaryNotifications: prefsData.summaryNotifications === 1,
        weeklyDigest: prefsData.weeklyDigest === 1,
        timezone: prefsData.timezone,
      });
    }
  }, [prefsData]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/" as any);
    }
  }, [isAuthenticated, navigate]);

  const handleSavePreferences = async () => {
    setIsSaving(true);
    await updatePrefsMutation.mutateAsync(preferences);
  };

  const handlePreferenceChange = (key: keyof Preferences, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (!isAuthenticated || isLoadingPrefs) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/chat" as any)}
              className="p-2 hover:bg-card rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold neon-glow">Profile Settings</h1>
              <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/settings" as any)}
              variant="outline"
              size="sm"
            >
              App Settings
            </Button>
            <Button
              onClick={() => navigate("/about" as any)}
              variant="outline"
              size="sm"
            >
              About
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <div className="space-y-2 sticky top-24">
              <button
                onClick={() => setActiveTab("account")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "account"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <Mail className="w-4 h-4" />
                Account
              </button>
              <button
                onClick={() => setActiveTab("preferences")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "preferences"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <Palette className="w-4 h-4" />
                Preferences
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "notifications"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <Bell className="w-4 h-4" />
                Notifications
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            {/* Account Information */}
            {activeTab === "account" && (
              <Card className="p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4 neon-text">Account Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <Input
                        value={user?.name || ""}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Your name from your Manus account
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        value={user?.email || ""}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Your primary email address for notifications
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Account Created</label>
                      <Input
                        value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Sign In</label>
                      <Input
                        value={user?.lastSignedIn ? new Date(user.lastSignedIn).toLocaleDateString() : ""}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Preferences */}
            {activeTab === "preferences" && (
              <Card className="p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4 neon-text">Display Preferences</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Theme</label>
                      <select
                        value={preferences.theme}
                        onChange={(e) => handlePreferenceChange("theme", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Choose your preferred color scheme
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Language</label>
                      <select
                        value={preferences.language}
                        onChange={(e) => handlePreferenceChange("language", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Select your preferred language
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Timezone</label>
                      <select
                        value={preferences.timezone}
                        onChange={(e) => handlePreferenceChange("timezone", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Paris">Paris</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                        <option value="Australia/Sydney">Sydney</option>
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Set your timezone for session timestamps
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <Card className="p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4 neon-text">Notification Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-card/50 transition-colors">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about important updates
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.emailNotifications}
                        onChange={(e) => handlePreferenceChange("emailNotifications", e.target.checked)}
                        className="w-5 h-5 rounded cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-card/50 transition-colors">
                      <div>
                        <h3 className="font-medium">Session Summaries</h3>
                        <p className="text-sm text-muted-foreground">
                          Get emailed summaries after each session
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.summaryNotifications}
                        onChange={(e) => handlePreferenceChange("summaryNotifications", e.target.checked)}
                        className="w-5 h-5 rounded cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-card/50 transition-colors">
                      <div>
                        <h3 className="font-medium">Weekly Digest</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive a weekly digest of your progress
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.weeklyDigest}
                        onChange={(e) => handlePreferenceChange("weeklyDigest", e.target.checked)}
                        className="w-5 h-5 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Save Button */}
            {(activeTab === "preferences" || activeTab === "notifications") && (
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  onClick={() => setActiveTab("account")}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSavePreferences}
                  disabled={isSaving}
                  className="btn-neon gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
