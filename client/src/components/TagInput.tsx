import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface Tag {
  id: number;
  name: string;
  color: string;
}

interface TagInputProps {
  tags: Tag[];
  selectedTags: Tag[];
  onAddTag: (tag: Tag) => void;
  onRemoveTag: (tagId: number) => void;
  onCreateTag: (name: string, color: string) => Promise<Tag>;
  isLoading?: boolean;
}

const colorOptions = [
  { name: "blue", bg: "bg-blue-500", text: "text-blue-500" },
  { name: "red", bg: "bg-red-500", text: "text-red-500" },
  { name: "green", bg: "bg-green-500", text: "text-green-500" },
  { name: "yellow", bg: "bg-yellow-500", text: "text-yellow-500" },
  { name: "purple", bg: "bg-purple-500", text: "text-purple-500" },
  { name: "pink", bg: "bg-pink-500", text: "text-pink-500" },
  { name: "cyan", bg: "bg-cyan-500", text: "text-cyan-500" },
];

export default function TagInput({
  tags,
  selectedTags,
  onAddTag,
  onRemoveTag,
  onCreateTag,
  isLoading,
}: TagInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchValue.toLowerCase()) &&
      !selectedTags.some((st) => st.id === tag.id)
  );

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      setIsCreating(true);
      const newTag = await onCreateTag(newTagName, selectedColor);
      onAddTag(newTag);
      setNewTagName("");
      setSelectedColor("blue");
      setSearchValue("");
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="relative w-full">
      {/* Selected Tags Display */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag) => (
          <div
            key={tag.id}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              colorOptions.find((c) => c.name === tag.color)?.bg || "bg-blue-500"
            } text-white`}
          >
            {tag.name}
            <button
              onClick={() => onRemoveTag(tag.id)}
              className="hover:opacity-80 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Tag Selector */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-left hover:bg-card/50 transition-colors"
        >
          {selectedTags.length === 0 ? "Add tags..." : `${selectedTags.length} tag(s)`}
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 p-3 space-y-3">
            {/* Search/Filter */}
            <Input
              ref={inputRef}
              placeholder="Search or create tag..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="text-sm"
            />

            {/* Existing Tags */}
            {filteredTags.length > 0 && (
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {filteredTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => {
                      onAddTag(tag);
                      setSearchValue("");
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      colorOptions.find((c) => c.name === tag.color)?.text || "text-blue-500"
                    } hover:bg-card-foreground/10`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}

            {/* Create New Tag */}
            {searchValue && !filteredTags.some((t) => t.name.toLowerCase() === searchValue.toLowerCase()) && (
              <div className="border-t border-border pt-3 space-y-2">
                <p className="text-xs text-muted-foreground">Create new tag</p>
                <Input
                  placeholder="Tag name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="text-sm"
                />
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-6 h-6 rounded-full ${color.bg} ${
                        selectedColor === color.name ? "ring-2 ring-offset-1 ring-foreground" : ""
                      }`}
                    />
                  ))}
                </div>
                <Button
                  onClick={handleCreateTag}
                  disabled={!newTagName.trim() || isCreating}
                  className="w-full"
                  size="sm"
                >
                  {isCreating ? "Creating..." : "Create Tag"}
                </Button>
              </div>
            )}

            {/* Empty State */}
            {filteredTags.length === 0 && !searchValue && (
              <p className="text-sm text-muted-foreground text-center py-2">No tags yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
