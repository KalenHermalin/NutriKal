import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export const SearchInput = ({ value, onChange, onClear, placeholder = "Search..." }: SearchInputProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10 bg-muted border-0 text-foreground"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <X className="w-4 h-4 text-muted-foreground z-999999" />
        </button>
      )}
    </div>
  );
}