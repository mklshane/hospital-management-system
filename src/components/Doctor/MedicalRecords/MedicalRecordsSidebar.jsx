import { useRef } from "react";
import {
  Edit,
  Printer,
  Calendar,
  Stethoscope,
  Activity,
  Pill,
  Clock,
  ChevronDown,
  FileText,
} from "lucide-react";

export const MedicalRecordsSidebar = ({
  selectedRecord,
  patientRecords,
  formatDate,
  onEdit,
  onRecordChange,
}) => {
  const printRef = useRef(null);

  const handlePrint = () => {
    if (!selectedRecord) return;

    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) return;

    const printContent = printRef.current.innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Medical Record - ${selectedRecord.patient?.name}</title>
        <link href="/path-to-your-tailwind.css" rel="stylesheet" /> <!-- if using CDN -->
        <style>
          body { margin: 0; padding: 2rem; font-family: system-ui, sans-serif; }
          .print-header { text-align: center; margin-bottom: 2rem; border-bottom: 2px solid #2563eb; padding-bottom: 1rem; }
          .print-section { margin-bottom: 1.5rem; }
          .print-label { font-weight: 600; color: #1e40af; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
          .prescription-item { border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.75rem; margin-bottom: 0.5rem; }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        ${printContent}
        <script>
          window.onload = () => setTimeout(() => window.print(), 300);
          window.onafterprint = () => window.close();
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();
  };

  if (!selectedRecord) {
    return (
      <div className="flex-1 flex items-center justify-center px-3">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-ui-muted/50 flex items-center justify-center">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">
            No record selected
          </p>
          <p className="text-xs text-muted-foreground">
            Click on any record card to view details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hidden printable area */}
      <div id="print-area" ref={printRef} className="hidden">
        <div className="print-header">
          <h1 className="text-2xl font-bold text-blue-600">Medical Record</h1>
          <p className="text-sm text-gray-600">
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="print-section">
          <div className="print-label">
            <Calendar className="w-5 h-5" />
            Patient Information
          </div>
          <p className="text-lg font-medium">{selectedRecord.patient?.name}</p>
          <p className="text-sm text-gray-600">
            Appointment:{" "}
            {formatDate(selectedRecord.appointment?.appointment_date)}
          </p>
        </div>

        <div className="print-section">
          <div className="print-label">
            <Stethoscope className="w-5 h-5" />
            Diagnosis
          </div>
          <p className="text-base">
            {selectedRecord.diagnosis || "No diagnosis recorded."}
          </p>
        </div>

        {selectedRecord.symptoms && (
          <div className="print-section">
            <div className="print-label">
              <Activity className="w-5 h-5" />
              Symptoms
            </div>
            <p className="text-base">{selectedRecord.symptoms}</p>
          </div>
        )}

        {selectedRecord.prescriptions?.length > 0 && (
          <div className="print-section">
            <div className="print-label">
              <Pill className="w-5 h-5" />
              Prescriptions
            </div>
            <div className="space-y-2">
              {selectedRecord.prescriptions.map((p, i) => (
                <div key={i} className="prescription-item">
                  <div className="font-medium">{p.medicine}</div>
                  <div className="text-sm text-gray-600">
                    {p.dosage} • {p.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Visible UI */}
      <div className="sticky top-0 bg-ui-card z-10 border-b border-ui-border px-3 py-2.5">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold font-montserrat text-foreground leading-tight">
            Record Details
          </h2>
          <button
            onClick={() => onEdit(selectedRecord)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue hover:bg-blue-dark text-white text-xs font-medium rounded-lg transition"
          >
            <Edit className="w-3 h-3" />
            Edit
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar px-3 pt-3 pb-24 space-y-4 text-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
            {selectedRecord.patient?.name
              ?.split(" ")
              .map((n) => n[0].toUpperCase())
              .join("")
              .slice(0, 2) || "P"}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground truncate text-sm">
              {selectedRecord.patient?.name || "Unknown Patient"}
            </h3>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800 mt-0.5">
              <Calendar className="w-3 h-3" />
              {formatDate(selectedRecord.appointment?.appointment_date)}
            </div>
          </div>
        </div>

        <div className="space-y-1 pl-1">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-blue" />
            <p className="text-[10px] tracking-wider text-muted-foreground">
              Diagnosis
            </p>
          </div>
          <p className="text-xs text-foreground leading-relaxed pl-6">
            {selectedRecord.diagnosis || (
              <span className="italic text-muted-foreground">
                No diagnosis recorded.
              </span>
            )}
          </p>
        </div>

        {selectedRecord.symptoms && (
          <div className="space-y-1 pl-1">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue" />
              <p className="text-[10px] tracking-wider text-muted-foreground">
                Symptoms
              </p>
            </div>
            <p className="text-xs text-foreground leading-relaxed pl-6">
              {selectedRecord.symptoms}
            </p>
          </div>
        )}

        {selectedRecord.prescriptions?.length > 0 && (
          <div className="space-y-1 pl-1">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-blue" />
              <p className="text-[10px] tracking-wider text-muted-foreground">
                Prescriptions ({selectedRecord.prescriptions.length})
              </p>
            </div>
            <div className="space-y-2 pl-6">
              {selectedRecord.prescriptions.map((p, i) => (
                <div
                  key={i}
                  className="bg-ui-muted py-2 px-4 border rounded-lg text-xs"
                >
                  <div className="font-medium text-foreground">
                    {p.medicine}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {p.dosage} • {p.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {patientRecords.length > 1 && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <p className="text-[10px] tracking-wider text-muted-foreground">
                Previous Records
              </p>
            </div>
            <div className="relative pl-6">
              <select
                className="w-full p-2 bg-ui-muted border border-ui-border rounded-lg text-xs text-foreground appearance-none pr-8"
                onChange={(e) => {
                  const rec = patientRecords.find(
                    (r) => r._id === e.target.value
                  );
                  if (rec) onRecordChange(rec);
                }}
                value={selectedRecord._id}
              >
                {patientRecords
                  .sort(
                    (a, b) =>
                      new Date(b.appointment?.appointment_date) -
                      new Date(a.appointment?.appointment_date)
                  )
                  .map((r) => (
                    <option key={r._id} value={r._id}>
                      {formatDate(r.appointment?.appointment_date)} -{" "}
                      {r.diagnosis || "No diagnosis"}
                    </option>
                  ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-ui-card px-3 pb-3 pt-2">
        <button
          onClick={handlePrint}
          className="w-full bg-blue hover:bg-blue-dark text-white py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-1.5"
        >
          <Printer className="w-4 h-4" />
          Print Record
        </button>
      </div>
    </>
  );
};
