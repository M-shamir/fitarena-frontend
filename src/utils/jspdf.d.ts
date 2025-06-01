import 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    autoTable: {
      previous: {
        finalY: number;
      };
    };
  }
}