"use client";

import jsPDF from "jspdf";
import "jspdf-autotable";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DownloadPressRelease() {
  const handleDownload = () => {
    const element = document.getElementById("press-release-content");
    if (!element) return;

    const doc = new jsPDF("p", "mm", "a4");
    let y = 20;

    // Parse all child nodes of the content
    element.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        // plain text
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        const text = doc.splitTextToSize(node.textContent?.trim() || "", 180);
        doc.text(text, 15, y);
        y += text.length * 6;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;

        switch (el.tagName.toLowerCase()) {
          case "h3":
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text(el.innerText, 15, y);
            y += 10;
            break;

          case "p":
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            const ptext = doc.splitTextToSize(el.innerText, 180);
            doc.text(ptext, 15, y);
            y += ptext.length * 6 + 4;
            break;

          case "blockquote":
            doc.setFont("times", "italic");
            doc.setFontSize(12);
            const btext = doc.splitTextToSize(`“${el.innerText}”`, 170);
            doc.text(btext, 20, y); // indent
            y += btext.length * 6 + 6;
            break;

          case "ul":
            el.querySelectorAll("li").forEach((li) => {
              doc.setFont("helvetica", "normal");
              doc.setFontSize(12);
              const bulletText = doc.splitTextToSize(`• ${li.innerText}`, 170);
              doc.text(bulletText, 20, y);
              y += bulletText.length * 6;
            });
            y += 4;
            break;
        }

        // Auto page break
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      }
    });

    doc.save("press-release.pdf");
  };

  return (
    <Button
      onClick={handleDownload}
      className="flex items-center bg-[#00990d] text-white hover:bg-[#3c362f]"
    >
      <Download className="mr-2 h-4 w-4" />
      Download Press Release
    </Button>
  );
}
