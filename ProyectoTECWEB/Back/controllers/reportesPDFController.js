import { validationResult } from 'express-validator';
import reporteModel from '../models/reporteModel.js';
import generarPDF from '../services/pdfService.js';

const reportesPDFController = {



  getPDFDocumentos: async (req, res) => {
    try {
      const documentos = await reporteModel.getDocumentos();

      const buffer = await generarPDF({
        titulo: 'Reporte de Documentos Vigentes',
        subtitulo: 'Listado oficial de normativa vigente',
        generarContenido: (doc, checkPageSpace) => {

          documentos.forEach((d, index) => {

       
            checkPageSpace(200);

            doc
              .fontSize(11)
              .fillColor('#1F3A5F')
              .text(`Documento ${index + 1}`, { underline: true });

            doc.moveDown(0.6);
            doc.fillColor('#000').fontSize(10);

           
            doc.text(`Código: ${d.codigo}`);
            doc.text(`Tipo: ${d.tipo}`);
            doc.text(`Año: ${d.anio}`);
            doc.text(`Aplicación: ${d.aplicacion}`);

            doc.moveDown(0.6);

           
            const block = (label, value) => {
              doc
                .fontSize(10)
                .fillColor('#333')
                .text(`${label}:`)
                .fillColor('#000')
                .text(value || '-', { width: 495 });
              doc.moveDown(0.4);
            };

            block('Fuente', d.fuente);
            block('Descripción', d.descripcion);
            block('Relevancia', d.relevancia);
            block('Conceptos CPE', d.conceptos_cpe);
            block('Jerarquía', d.jerarquia);
            block('Vigente', d.vigente ? 'Sí' : 'No');

            doc.moveDown(0.8);
            doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
            doc.moveDown(1);
          });
        }
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="reporte_documentos.pdf"'
      );
      res.send(buffer);

    } catch (error) {
      res.status(500).json({ error: 'Error al generar PDF de documentos' });
    }
  },



getPDFDocumentosPorTipo: async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  const { tipo } = req.params;
  const documentos = await reporteModel.getDocumentosPorTipo(tipo);

  const buffer = await generarPDF({
    titulo: 'Reporte de Documentos por Tipo',
    subtitulo: `Tipo seleccionado: ${tipo}`,
    generarContenido: (doc, checkPageSpace) => {

      documentos.forEach((d, index) => {
        checkPageSpace(200);

        doc
          .fontSize(11)
          .fillColor('#1F3A5F')
          .text(`Documento ${index + 1}`, { underline: true });

        doc.moveDown(0.6);
        doc.fillColor('#000').fontSize(10);

        doc.text(`Código: ${d.codigo}`);
        doc.text(`Tipo: ${d.tipo}`);
        doc.text(`Año: ${d.anio}`);
        doc.text(`Aplicación: ${d.aplicacion}`);

        doc.moveDown(0.6);

        doc.fontSize(10).fillColor('#333').text('Fuente:');
        doc.fillColor('#000').text(d.fuente || '-', { width: 495 });

        doc.moveDown(0.4);
        doc.fillColor('#333').text('Descripción:');
        doc.fillColor('#000').text(d.descripcion || '-', { width: 495 });

        doc.moveDown(0.4);
        doc.fillColor('#333').text('Relevancia:');
        doc.fillColor('#000').text(d.relevancia || '-', { width: 495 });

        doc.moveDown(0.4);
        doc.fillColor('#333').text('Conceptos CPE:');
        doc.fillColor('#000').text(d.conceptos_cpe || '-', { width: 495 });

        doc.moveDown(0.4);
        doc.fillColor('#333').text('Jerarquía:');
        doc.fillColor('#000').text(d.jerarquia || '-', { width: 495 });

        doc.moveDown(0.4);
        doc.fillColor('#333').text('Vigente:');
        doc.fillColor('#000').text(d.vigente ? 'Sí' : 'No');

        doc.moveDown(0.8);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(1);
      });
    }
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `inline; filename="documentos_${tipo}.pdf"`
  );
  res.send(buffer);
},


 getPDFDocumentosPorAnio: async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  const { anio } = req.params;
  const documentos = await reporteModel.getDocumentosPorAnio(anio);

  const buffer = await generarPDF({
    titulo: 'Reporte de Documentos por Año',
    subtitulo: `Año seleccionado: ${anio}`,
    generarContenido: (doc, checkPageSpace) => {

      documentos.forEach((d, index) => {
        checkPageSpace(200);

        doc
          .fontSize(11)
          .fillColor('#1F3A5F')
          .text(`Documento ${index + 1}`, { underline: true });

        doc.moveDown(0.6);
        doc.fillColor('#000').fontSize(10);

        doc.text(`Código: ${d.codigo}`);
        doc.text(`Tipo: ${d.tipo}`);
        doc.text(`Año: ${d.anio}`);
        doc.text(`Aplicación: ${d.aplicacion}`);

        doc.moveDown(0.6);

        doc.fontSize(10).fillColor('#333').text('Fuente:');
        doc.fillColor('#000').text(d.fuente || '-', { width: 495 });

        doc.moveDown(0.4);
        doc.fillColor('#333').text('Descripción:');
        doc.fillColor('#000').text(d.descripcion || '-', { width: 495 });

        doc.moveDown(0.4);
        doc.fillColor('#333').text('Relevancia:');
        doc.fillColor('#000').text(d.relevancia || '-', { width: 495 });

        doc.moveDown(0.4);
        doc.fillColor('#333').text('Conceptos CPE:');
        doc.fillColor('#000').text(d.conceptos_cpe || '-', { width: 495 });

        doc.moveDown(0.4);
        doc.fillColor('#333').text('Jerarquía:');
        doc.fillColor('#000').text(d.jerarquia || '-', { width: 495 });

        doc.moveDown(0.4);
        doc.fillColor('#333').text('Vigente:');
        doc.fillColor('#000').text(d.vigente ? 'Sí' : 'No');

        doc.moveDown(0.8);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(1);
      });
    }
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `inline; filename="documentos_${anio}.pdf"`
  );
  res.send(buffer);
},



  getPDFConsultas: async (req, res) => {
  const consultas = await reporteModel.getHistorialConsultas();

  const buffer = await generarPDF({
    titulo: 'Reporte de Historial de Consultas',
    subtitulo: 'Registro de búsquedas realizadas por usuarios',
    generarContenido: (doc, checkPageSpace) => {

      const marginLeft = doc.page.margins.left; // 50
      const columnGap = 20;
      const columnWidth = (doc.page.width - marginLeft * 2 - columnGap) / 2;

      let yLeft = doc.y;
      let yRight = doc.y;
      let useLeft = true;

      consultas.forEach((c, index) => {
        const blockHeight = 55;

        // 🔁 alternar columna
        let x = useLeft
          ? marginLeft
          : marginLeft + columnWidth + columnGap;

        let y = useLeft ? yLeft : yRight;

     
        if (Math.max(yLeft, yRight) + blockHeight > doc.page.height - 70) {
          doc.addPage();
          yLeft = doc.y;
          yRight = doc.y;
          x = marginLeft;
          y = yLeft;
          useLeft = true;
        }

        doc
          .fontSize(10)
          .fillColor('#000')
          .text(`${index + 1}. Palabra: ${c.palabra}`, x, y, {
            width: columnWidth,
            align: 'left'
          })
          .text(`Campo: ${c.buscado_donde}`, {
            width: columnWidth,
            align: 'left'
          })
          .text(
            `Fecha: ${new Date(c.buscado_en).toLocaleString()}`,
            { width: columnWidth, align: 'left' }
          );

        if (useLeft) {
          yLeft = doc.y + 5;
        } else {
          yRight = doc.y + 5;
        }

        useLeft = !useLeft;
      });

      doc.y = Math.max(yLeft, yRight);
    }
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    'inline; filename="consultas.pdf"'
  );
  res.send(buffer);
}

};

export default reportesPDFController;
