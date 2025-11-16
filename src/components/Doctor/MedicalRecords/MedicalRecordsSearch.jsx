import { Search } from "lucide-react";

export const MedicalRecordsSearch = ({ searchTerm, setSearchTerm }) => (
  <div className="relative flex-1 min-w-[200px]">
    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
    <input
      type="text"
      placeholder="Search patient, diagnosis, symptoms..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full h-8 pl-7 pr-3 bg-ui-surface border rounded-lg text-xs text-foreground placeholder-muted-foreground font-figtree focus:outline-none focus:ring-1 focus:ring-ui-ring"
    />
  </div>
);
