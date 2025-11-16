import ThemeToggle from "@/components/ThemeToggle";

export const MedicalRecordsHeader = () => (
  <div className="flex justify-between items-start mb-4">
    <h1 className="text-lg font-bold font-montserrat text-foreground">
      Medical Records
    </h1>
    <ThemeToggle />
  </div>
);
