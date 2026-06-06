"use client";

import { useState } from "react";
import { CourseSection } from "@/data/course-content";

interface CourseData {
  title: string;
  description: string;
  intro: string;
  sections: CourseSection[];
}

interface Props {
  course: CourseData;
}

export default function DownloadPDFButton({ course }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });

      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxW = pageW - margin * 2;
      let y = margin;

      const addText = (text: string, fontSize: number, bold = false, color: [number, number, number] = [30, 30, 50]) => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(text, maxW);
        for (const line of lines) {
          if (y + fontSize * 0.4 > pageH - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y);
          y += fontSize * 0.5;
        }
        y += 2;
      };

      // Header background
      doc.setFillColor(88, 28, 135);
      doc.rect(0, 0, pageW, 30, "F");
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("Dojo.info — Fiche récapitulative", margin, 12);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(new Date().toLocaleDateString("fr-FR"), pageW - margin - 25, 12);

      y = 40;

      // Title
      addText(course.title, 18, true, [88, 28, 135]);
      y += 2;

      // Description
      addText(course.description, 10, false, [80, 80, 100]);
      y += 4;

      // Divider
      doc.setDrawColor(180, 120, 255);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageW - margin, y);
      y += 6;

      // Intro
      addText("Introduction", 13, true, [30, 30, 50]);
      addText(course.intro.replace(/\n/g, " "), 9, false, [60, 60, 80]);
      y += 4;

      // Sections
      for (const section of course.sections) {
        doc.setDrawColor(200, 200, 220);
        doc.setLineWidth(0.2);
        doc.line(margin, y, pageW - margin, y);
        y += 5;

        addText(section.title, 12, true, [88, 28, 135]);

        const cleanContent = section.content.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\n/g, " ");
        addText(cleanContent, 9, false, [60, 60, 80]);

        if (section.tip) {
          y += 2;
          doc.setFillColor(254, 243, 199);
          const tipLines = doc.splitTextToSize(`💡 ${section.tip}`, maxW - 8);
          const tipH = tipLines.length * 5 + 4;
          if (y + tipH > pageH - margin) { doc.addPage(); y = margin; }
          doc.roundedRect(margin, y, maxW, tipH, 2, 2, "F");
          doc.setFontSize(8.5);
          doc.setFont("helvetica", "italic");
          doc.setTextColor(120, 80, 0);
          doc.text(tipLines, margin + 4, y + 4);
          y += tipH + 4;
        }
        y += 3;
      }

      // Footer
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pages = (doc.internal as any).getNumberOfPages() as number;
      for (let i = 1; i <= pages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(150, 150, 170);
        doc.text(`Dojo.info — ${course.title}`, margin, pageH - 8);
        doc.text(`Page ${i}/${pages}`, pageW - margin - 15, pageH - 8);
      }

      doc.save(`${course.title.toLowerCase().replace(/\s+/g, "-")}-dojo.pdf`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-3 p-3 bg-white/2 rounded-xl border border-white/5 hover:border-purple-500/20 cursor-pointer transition-colors group w-full text-left"
    >
      <span>📄</span>
      <span className="text-slate-300 text-sm flex-1 group-hover:text-white transition-colors">
        {loading ? "Génération en cours…" : "Fiche récap PDF"}
      </span>
      <span className="text-xs bg-white/10 text-slate-500 px-2 py-0.5 rounded">PDF</span>
    </button>
  );
}
