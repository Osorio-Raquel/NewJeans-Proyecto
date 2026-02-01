import PDFDocument from 'pdfkit';

export default function generarPDF({ titulo, subtitulo = '', generarContenido }) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        bufferPages: false
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const fechaGeneracion = new Date().toLocaleString('es-BO', {
  timeZone: 'America/La_Paz'
});


      
      const header = () => {
        
        doc.x = doc.page.margins.left;

        doc.fontSize(14)
          .fillColor('#1F3A5F')
          .text('MIGA – Sistema de Normativa Alimentaria', {
            align: 'left'
          });

        doc.moveDown(0.2);

        doc.fontSize(11)
          .fillColor('#000')
          .text(titulo, { align: 'left' });

        if (subtitulo) {
          doc.fontSize(9)
            .fillColor('#555')
            .text(subtitulo, { align: 'left' });
        }

        
        doc.fontSize(8)
          .fillColor('#555')
          .text(
  `Fecha de generación: ${fechaGeneracion}`,
  doc.page.width - doc.page.margins.right - 200,
  60,
  { width: 200, align: 'right' }
);

        doc.moveTo(50, 95).lineTo(545, 95).stroke();

     
        doc.x = doc.page.margins.left;
        doc.y = 110;
      };

      
      const checkPageSpace = (blockHeight = 160) => {
        if (doc.y + blockHeight > doc.page.height - 70) {
          doc.addPage();
          header();
        }
      };

     
      const footer = () => {
        doc.fontSize(8)
          .fillColor('#666')
          .text(
            'Documento generado automáticamente por MIGA',
            0,
            800,
            { align: 'center', width: doc.page.width }
          );
      };

      header();
      generarContenido(doc, checkPageSpace);
      footer();
      doc.end();

    } catch (err) {
      reject(err);
    }
  });
}
