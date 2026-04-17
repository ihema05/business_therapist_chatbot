import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Send, Plus, Menu, X, Download, Settings, Trash2, Edit2, Tag } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";

interface Session {
  id: number;
  title: string;
  createdAt: Date;
  summary?: string;
}

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface TagType {
  id: number;
  name: string;
  color: string;
}

export default function Chat() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // tRPC queries and mutations
  const { data: sessions, refetch: refetchSessions } = trpc.chat.getSessions.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: sessionData } = trpc.chat.getSession.useQuery(
    { sessionId: currentSessionId! },
    { enabled: !!currentSessionId }
  );

  const [renamingSessionId, setRenamingSessionId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [selectedSessionForTags, setSelectedSessionForTags] = useState<number | null>(null);
  const [sessionTags, setSessionTags] = useState<TagType[]>([]);
  const [filterTag, setFilterTag] = useState<number | null>(null);

  const { data: allTags, refetch: refetchTags } = trpc.tags.getTags.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: currentSessionTags } = trpc.tags.getSessionTags.useQuery(
    { sessionId: selectedSessionForTags! },
    { enabled: !!selectedSessionForTags }
  );

  useEffect(() => {
    if (currentSessionTags) {
      setSessionTags(currentSessionTags);
    }
  }, [currentSessionTags]);

  const addTagToSessionMutation = trpc.tags.addTagToSession.useMutation({
    onSuccess: () => {
      if (selectedSessionForTags) {
        trpc.useUtils().tags.getSessionTags.invalidate({ sessionId: selectedSessionForTags });
      }
    },
  });

  const removeTagFromSessionMutation = trpc.tags.removeTagFromSession.useMutation({
    onSuccess: () => {
      if (selectedSessionForTags) {
        trpc.useUtils().tags.getSessionTags.invalidate({ sessionId: selectedSessionForTags });
      }
    },
  });

  const createTagMutation = trpc.tags.createTag.useMutation({
    onSuccess: () => {
      refetchTags();
    },
  });

  const deleteTagMutation = trpc.tags.deleteTag.useMutation({
    onSuccess: () => {
      refetchTags();
    },
  });

  const createSessionMutation = trpc.chat.createSession.useMutation({
    onSuccess: (session) => {
      setCurrentSessionId(session.id);
      setMessages([]);
      refetchSessions();
    },
  });

  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: data.message,
          createdAt: new Date(),
        },
      ]);
      setIsTyping(false);
    },
    onError: () => {
      setIsTyping(false);
    },
  });

  const deleteSessionMutation = trpc.chat.deleteSession.useMutation({
    onSuccess: () => {
      if (renamingSessionId === currentSessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }
      refetchSessions();
    },
    onError: () => {
      alert("Failed to delete session");
    },
  });

  const renameSessionMutation = trpc.chat.renameSession.useMutation({
    onSuccess: () => {
      setRenamingSessionId(null);
      setRenameValue("");
      refetchSessions();
    },
    onError: () => {
      alert("Failed to rename session");
    },
  });

  const generateSummaryMutation = trpc.chat.generateSummary.useMutation({
    onSuccess: () => {
      refetchSessions();
    },
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Load session data when it changes
  useEffect(() => {
    if (sessionData) {
      setMessages(
        sessionData.messages.map((m) => ({
          ...m,
          createdAt: new Date(m.createdAt),
        }))
      );
    }
  }, [sessionData]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/" as any);
    }
  }, [isAuthenticated, navigate]);

  const handleNewSession = () => {
    createSessionMutation.mutate({ title: undefined });
  };

  const handleSelectSession = (sessionId: number) => {
    setCurrentSessionId(sessionId);
    setSidebarOpen(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentSessionId || isLoading || isTyping) return;

    const userMessage = inputValue;
    setInputValue("");
    setIsLoading(true);

    // Add user message to UI
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        content: userMessage,
        createdAt: new Date(),
      },
    ]);

    // Show typing indicator
    setIsTyping(true);
    setIsLoading(false);

    // Send message
    await sendMessageMutation.mutateAsync({
      sessionId: currentSessionId,
      message: userMessage,
    });
  };

  const handleGenerateSummary = async () => {
    if (!currentSessionId) return;
    await generateSummaryMutation.mutateAsync({ sessionId: currentSessionId });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } border-r border-border bg-card transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-4 border-b border-border">
          <Button onClick={handleNewSession} className="w-full btn-neon" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Session
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sessions?.map((session) => (
            <div key={session.id} className="group">
              {renamingSessionId === session.id ? (
                <div className="flex gap-2 p-2">
                  <Input
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    placeholder="New title..."
                    className="text-sm h-8"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => renameSessionMutation.mutate({ sessionId: session.id, newTitle: renameValue })}
                    disabled={!renameValue.trim()}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setRenamingSessionId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleSelectSession(session.id)}
                    className={`flex-1 text-left p-3 rounded-lg transition-all duration-200 ${
                      currentSessionId === session.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-card-foreground/10 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="font-semibold truncate">{session.title}</div>
                    <div className="text-xs opacity-75 mt-1">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </div>
                  </button>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 pr-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedSessionForTags(session.id);
                        setShowTagsModal(true);
                      }}
                      title="Manage tags"
                    >
                      <Tag className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setRenamingSessionId(session.id);
                        setRenameValue(session.title);
                      }}
                    >
                      ✎
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (confirm("Delete this session?")) {
                          deleteSessionMutation.mutate({ sessionId: session.id });
                        }
                      }}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border text-sm text-muted-foreground">
          <div className="font-semibold mb-2">Logged in as</div>
          <div className="truncate">{user?.email || user?.name}</div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-card rounded-lg transition-colors lg:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h2 className="text-lg font-bold neon-text">
                {currentSessionId ? "Session Active" : "Select or Create a Session"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {messages.length} messages
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentSessionId && messages.length > 0 && (
              <Button
                onClick={handleGenerateSummary}
                disabled={generateSummaryMutation.isPending}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {generateSummaryMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
                Summary
              </Button>
            )}
            <Button
              onClick={() => navigate("/profile" as any)}
              variant="outline"
              size="sm"
            >
              Profile
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        {currentSessionId ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-6xl">💭</div>
                  <h3 className="text-2xl font-bold neon-glow">Start Your Session</h3>
                  <p className="text-muted-foreground max-w-md">
                    Share what's on your mind. I'm here to listen and help you navigate 
                    your business challenges with empathy and practical solutions.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`${
                        message.role === "user" ? "message-user" : "message-assistant"
                      } max-w-md lg:max-w-lg`}
                    >
                      <Streamdown>{message.content}</Streamdown>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="message-assistant flex items-center gap-2">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl">🚀</div>
              <h3 className="text-2xl font-bold neon-glow">Welcome to Business Therapist</h3>
              <p className="text-muted-foreground max-w-md">
                Create a new session or select an existing one to get started.
              </p>
              <Button onClick={handleNewSession} className="btn-neon mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Start New Session
              </Button>
            </div>
          </div>
        )}

        {/* Input Area */}
        {currentSessionId && (
          <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
            <div className="flex gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                disabled={isLoading || isTyping}
                className="input-neon flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || isTyping || !inputValue.trim()}
                className="btn-neon px-4"
              >
                {isLoading || isTyping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        )}
      </div>

      {/* Tags Modal */}
      {showTagsModal && selectedSessionForTags && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Manage Tags</h2>
              <button
                onClick={() => setShowTagsModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Tags */}
            {sessionTags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Current Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {sessionTags.map((tag) => (
                    <div
                      key={tag.id}
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-white ${
                        tag.color === "red"
                          ? "bg-red-500"
                          : tag.color === "green"
                          ? "bg-green-500"
                          : tag.color === "yellow"
                          ? "bg-yellow-500"
                          : tag.color === "purple"
                          ? "bg-purple-500"
                          : tag.color === "pink"
                          ? "bg-pink-500"
                          : tag.color === "cyan"
                          ? "bg-cyan-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {tag.name}
                      <button
                        onClick={() =>
                          removeTagFromSessionMutation.mutate({
                            sessionId: selectedSessionForTags,
                            tagId: tag.id,
                          })
                        }
                        className="hover:opacity-80 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Tags */}
            {allTags && allTags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Add Tags</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {allTags
                    .filter((tag) => !sessionTags.some((st) => st.id === tag.id))
                    .map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() =>
                          addTagToSessionMutation.mutate({
                            sessionId: selectedSessionForTags,
                            tagId: tag.id,
                          })
                        }
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          tag.color === "red"
                            ? "text-red-500 hover:bg-red-500/10"
                            : tag.color === "green"
                            ? "text-green-500 hover:bg-green-500/10"
                            : tag.color === "yellow"
                            ? "text-yellow-500 hover:bg-yellow-500/10"
                            : tag.color === "purple"
                            ? "text-purple-500 hover:bg-purple-500/10"
                            : tag.color === "pink"
                            ? "text-pink-500 hover:bg-pink-500/10"
                            : tag.color === "cyan"
                            ? "text-cyan-500 hover:bg-cyan-500/10"
                            : "text-blue-500 hover:bg-blue-500/10"
                        }`}
                      >
                        + {tag.name}
                      </button>
                    ))}
                </div>
              </div>
            )}

            <Button
              onClick={() => setShowTagsModal(false)}
              className="w-full"
              variant="outline"
            >
              Done
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
