import { validationResult } from 'express-validator';
import reporteModel from '../models/reporteModel.js';
import generarPDF from '../services/pdfService.js';

const reportesPDFController = {

  /* ================= DOCUMENTOS ================= */

  getPDFDocumentos: async (req, res) => {
    try {
      const documentos = await reporteModel.getDocumentos();

      const buffer = await generarPDF({
        titulo: 'Reporte de Documentos Vigentes',
        subtitulo: 'Listado oficial de normativa vigente',
        generarContenido: (doc, checkPageSpace) => {

          documentos.forEach((d, index) => {

            // Altura real del bloque
            checkPageSpace(200);

            // Título del documento
            doc
              .fontSize(11)
              .fillColor('#1F3A5F')
              .text(`Documento ${index + 1}`, { underline: true });

            doc.moveDown(0.6);
            doc.fillColor('#000').fontSize(10);

            // Datos básicos (TODO A LA IZQUIERDA)
            doc.text(`Código: ${d.codigo}`);
            doc.text(`Tipo: ${d.tipo}`);
            doc.text(`Año: ${d.anio}`);
            doc.text(`Aplicación: ${d.aplicacion}`);

            doc.moveDown(0.6);

            // Bloques largos
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

  /* ================= DOCUMENTOS POR TIPO ================= */

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
          checkPageSpace(120);

          doc.fontSize(10).fillColor('#000')
            .text(`${index + 1}. Código: ${d.codigo}`)
            .text(`Año: ${d.anio}`)
            .text(`Descripción:`)
            .text(d.descripcion || '-', { width: 495 });

          doc.moveDown(0.8);
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

  /* ================= DOCUMENTOS POR AÑO ================= */

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
          checkPageSpace(120);

          doc.fontSize(10).fillColor('#000')
            .text(`${index + 1}. Código: ${d.codigo}`)
            .text(`Tipo: ${d.tipo}`)
            .text(`Descripción:`)
            .text(d.descripcion || '-', { width: 495 });

          doc.moveDown(0.8);
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

  /* ================= CONSULTAS ================= */

  getPDFConsultas: async (req, res) => {
    const consultas = await reporteModel.getHistorialConsultas();

    const buffer = await generarPDF({
      titulo: 'Reporte de Historial de Consultas',
      subtitulo: 'Registro de búsquedas realizadas por usuarios',
      generarContenido: (doc, checkPageSpace) => {

        consultas.forEach((c, index) => {
          checkPageSpace(80);

          doc.fontSize(10).fillColor('#000')
            .text(`${index + 1}. Palabra: ${c.palabra}`)
            .text(`Campo: ${c.buscado_donde}`)
            .text(`Fecha: ${new Date(c.buscado_en).toLocaleString()}`);

          doc.moveDown(0.6);
        });
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
