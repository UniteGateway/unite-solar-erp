// Since the libraries are loaded via script tags, we declare them for TypeScript
declare const jspdf: any;
declare const html2canvas: any;

/**
 * Generates a PDF from a container element by treating each matched section as a block.
 * This prevents sections from being split across page breaks.
 * Sections that are taller than a single page will be rendered on a new page but may still overflow.
 * @param containerElement The HTML element that contains all the sections to be printed.
 * @param sectionSelector A CSS selector to find the printable sections within the container.
 * @param fileName The name of the file to be saved.
 */
export const generatePdfFromSections = async (
  containerElement: HTMLElement | null,
  sectionSelector: string,
  fileName: string
) => {
  if (!containerElement) {
    console.error("PDF generation failed: container element not found.");
    return;
  }

  // Add a class to the body for CSS to hide non-printable elements
  document.body.classList.add('pdf-generating');

  const { jsPDF } = jspdf;
  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });

  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  const effectiveWidth = pageWidth - 2 * margin;
  
  const canvasOptions = {
    scale: 2, // Higher scale for better quality
    backgroundColor: document.documentElement.classList.contains('dark') ? '#212121' : '#ffffff',
    useCORS: true,
    windowWidth: 1400, // Use a wider fixed width for better layout consistency
  };

  const sections = containerElement.querySelectorAll<HTMLElement>(sectionSelector);
  let yPos = margin; // Start at top margin

  for (const section of Array.from(sections)) {
    try {
      const canvas = await html2canvas(section, canvasOptions);
      const imgData = canvas.toDataURL('image/png', 0.95);
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * effectiveWidth) / imgProps.width;

      // If the section doesn't fit in the remaining space on the page, create a new page.
      // A check `yPos > margin` prevents creating a blank page at the beginning.
      if (yPos > margin && yPos + imgHeight > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
      }

      pdf.addImage(imgData, 'PNG', margin, yPos, effectiveWidth, imgHeight);
      yPos += imgHeight + 5; // Add a 5mm gap for the next element
    } catch (e) {
      console.error("Could not process section for PDF:", section, e);
    }
  }

  pdf.save(fileName);

  // Clean up the class from the body
  document.body.classList.remove('pdf-generating');
};