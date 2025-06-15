import 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: unknown) => jsPDF;
    autoTable: {
      previous: {
        finalY: number;
      };
    };
  }
}