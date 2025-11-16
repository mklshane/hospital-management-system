import { Printer } from "lucide-react";

export const PrintRecordButton = ({ appointment, records, formatDate }) => {
  const handlePrint = () => {
    if (!appointment || records.length === 0) return;

    const printWindow = window.open("", "_blank", "width=900,height=1000");
    if (!printWindow) return;

    const doctor = appointment.doctor || {
      name: "Unknown",
      specialization: "General",
    };
    const record = records[0]; // Primary record

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Medical Record - ${doctor.name}</title>
        <style>
          body { margin: 0; padding: 2rem; font-family: system-ui, -apple-system, sans-serif; background: white; color: #1f2937; }
          .header { text-align: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid #2563eb; }
          .header h1 { margin: 0; font-size: 1.8rem; color: #2563eb; }
          .header p { margin: 0.5rem 0 0; color: #6b7280; }
          .section { margin-bottom: 1.5rem; }
          .label { font-weight: 600; color: #1e40af; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; font-size: 1rem; }
          .value { margin-left: 1.5rem; font-size: 1rem; line-height: 1.6; }
          .prescription { border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.75rem; margin: 0.5rem 0 0 1.5rem; background: #f9fafb; }
          .prescription .medicine { font-weight: 600; }
          .prescription .details { font-size: 0.9rem; color: #6b7280; margin-top: 0.25rem; }
          @page { margin: 1cm; }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Medical Record</h1>
          <p>Generated on ${new Date().toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</p>
        </div>

        <div class="section">
          <div class="label"><span>Doctor</span></div>
          <div class="value">Dr. ${doctor.name} — ${doctor.specialization}</div>
        </div>

        <div class="section">
          <div class="label"><span>Date & Time</span></div>
          <div class="value">
            ${formatDate(appointment.appointment_date)} at ${
      appointment.appointment_time || "—"
    }
          </div>
        </div>

        <div class="section">
          <div class="label"><span>Diagnosis</span></div>
          <div class="value">${
            record.diagnosis || "No diagnosis recorded."
          }</div>
        </div>

        ${
          record.symptoms
            ? `
          <div class="section">
            <div class="label"><span>Symptoms</span></div>
            <div class="value">${record.symptoms}</div>
          </div>
        `
            : ""
        }

        ${
          Array.isArray(record.prescriptions) && record.prescriptions.length > 0
            ? `
          <div class="section">
            <div class="label"><span>Prescriptions</span></div>
            ${record.prescriptions
              .map(
                (p) => `
              <div class="prescription">
                <div class="medicine">${p.medicine || "Unknown"}</div>
                <div class="details">${p.dosage || "?"} • ${
                  p.duration || "?"
                }</div>
              </div>
            `
              )
              .join("")}
          </div>
        `
            : ""
        }

        ${
          record.notes
            ? `
          <div class="section">
            <div class="label"><span>Notes</span></div>
            <div class="value italic">"${record.notes}"</div>
          </div>
        `
            : ""
        }

        <script>
          window.onload = () => setTimeout(() => window.print(), 400);
          window.onafterprint = () => window.close();
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-all shadow-sm"
    >
      <Printer className="w-3.5 h-3.5" />
      Print
    </button>
  );
};
