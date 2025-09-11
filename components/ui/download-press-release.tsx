"use client";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DownloadPressRelease() {
  const handleDownload = async () => {
    const element = document.getElementById("press-release-content");
    if (!element) return;

    // Capture element as canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

    let position = 0;
    pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);

    // Multipage support
    let heightLeft = imgHeight - pageHeight;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("press-release.pdf");
  };

  return (
    <Button
      onClick={handleDownload}
      className="flex items-center bg-[#00990d] text-white hover:bg-[#3c362f] shadow-md px-4 py-2 rounded-lg transition"
    >
      <Download className="mr-2 h-4 w-4" />
      Download Press Release
    </Button>
  );
}
