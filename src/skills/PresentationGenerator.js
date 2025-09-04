import { config } from '../utils/config.js';
import fs from 'fs';
import path from 'path';
import pptxgen from 'pptxgenjs';
import MarkdownIt from 'markdown-it';

class PresentationGenerator {
  constructor() {
    this.outputDir = 'outputs';
    // Asegurarse de que el directorio de salida exista
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir);
    }
    
    // Inicializar el parser de markdown
    this.md = new MarkdownIt();
  }

  /**
   * Genera una presentación en formato PowerPoint a partir del informe markdown
   * @param {string} query - La consulta de investigación
   * @param {string} report - El informe en formato markdown
   * @returns {string} - La ruta del archivo de presentación generado
   */
  async generatePresentationFromReport(query, report) {
    console.log(`Generando presentación para: ${query}`);
    
    try {
      // Generar presentación en formato PowerPoint
      const pptFilename = this.generateFilename(query, 'pptx');
      const pptFilepath = path.join(this.outputDir, pptFilename);
      
      await this.createPowerPointPresentationFromMarkdown(pptFilepath, query, report);
      console.log(`Presentación guardada en: ${pptFilepath}`);
      return pptFilepath;
    } catch (error) {
      console.error('Error generando la presentación:', error.message);
      throw error;
    }
  }

  /**
   * Crea una presentación PowerPoint usando pptxgenjs a partir de markdown
   * @param {string} filepath - La ruta del archivo a guardar
   * @param {string} query - La consulta de investigación
   * @param {string} markdown - El contenido en formato markdown
   */
  async createPowerPointPresentationFromMarkdown(filepath, query, markdown) {
    // Crear una nueva presentación
    const pptx = new pptxgen();
    
    // Establecer diseños y estilos generales
    pptx.author = 'GPT Researcher';
    pptx.company = 'Techgethr';
    
    // Dividir el markdown en secciones por títulos de nivel 2 (##)
    const sections = this.splitMarkdownIntoSections(markdown);
    
    // Crear diapositiva de título principal
    const titleSlide = pptx.addSlide();
    titleSlide.addText(query, {
      x: 0.5,
      y: 1,
      w: 9,
      h: 1.5,
      fontSize: 28,
      bold: true,
      align: 'center',
      color: '000000'
    });
    
    titleSlide.addText('Informe de Investigación', {
      x: 0.5,
      y: 3,
      w: 9,
      h: 1,
      fontSize: 20,
      align: 'center',
      color: '363636'
    });
    
    titleSlide.addText(new Date().toLocaleDateString(), {
      x: 0.5,
      y: 5,
      w: 9,
      h: 0.5,
      fontSize: 14,
      align: 'center',
      color: '666666'
    });
    
    // Procesar cada sección
    for (const section of sections) {
      // Parsear el contenido de la sección
      const parsedContent = this.parseSectionContent(section);
      
      // Crear diapositivas según el tipo de contenido
      await this.createSlidesFromContent(pptx, parsedContent);
    }
    
    // Guardar la presentación
    await pptx.writeFile(filepath);
  }

  /**
   * Divide el markdown en secciones basadas en títulos de nivel 2 (##)
   * @param {string} markdown - El contenido markdown completo
   * @returns {Array} - Array de secciones
   */
  splitMarkdownIntoSections(markdown) {
    // Remover el título principal (nivel 1) si existe
    const contentWithoutTitle = markdown.replace(/^#.*\n?/, '');
    
    // Dividir por títulos de nivel 2
    const sections = contentWithoutTitle.split(/(?=##\s)/g);
    
    // Filtrar secciones vacías
    return sections.filter(section => section.trim() !== '');
  }

  /**
   * Parsea el contenido de una sección markdown
   * @param {string} section - El contenido de la sección
   * @returns {Object} - Objeto con el título y contenido parseado
   */
  parseSectionContent(section) {
    // Extraer el título (primer línea que empieza con ##)
    const titleMatch = section.match(/^##\s+(.*)/);
    const title = titleMatch ? titleMatch[1].trim() : 'Sin título';
    
    // Remover el título del contenido
    const contentWithoutTitle = section.replace(/^##.*\n?/, '').trim();
    
    // Parsear diferentes elementos markdown
    const elements = this.parseMarkdownElements(contentWithoutTitle);
    
    return {
      title,
      elements
    };
  }

  /**
   * Parsea elementos markdown como listas, tablas, énfasis, etc.
   * @param {string} content - El contenido markdown
   * @returns {Array} - Array de elementos parseados
   */
  parseMarkdownElements(content) {
    const elements = [];
    const lines = content.split('\n');
    
    let currentElement = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Saltar líneas vacías
      if (line.trim() === '') {
        continue;
      }
      
      // Detectar listas
      if (line.match(/^(\s*)[\*\-\+]\s+/) || line.match(/^(\s*)\d+\.\s+/)) {
        const listItems = this.extractListItems(lines, i);
        elements.push({
          type: 'list',
          items: listItems.items
        });
        i = listItems.endIndex;
        continue;
      }
      
      // Detectar tablas
      if (line.includes('|') && i + 1 < lines.length && lines[i + 1].match(/^\s*\|?[\|\-]+/)) {
        const tableData = this.extractTableData(lines, i);
        elements.push({
          type: 'table',
          headers: tableData.headers,
          rows: tableData.rows
        });
        i = tableData.endIndex;
        continue;
      }
      
      // Detectar texto con énfasis (negritas, cursivas)
      if (line.match(/(\*\*|__|\*|_)/)) {
        elements.push({
          type: 'text',
          content: line,
          formatted: true
        });
        continue;
      }
      
      // Texto normal
      elements.push({
        type: 'text',
        content: line
      });
    }
    
    return elements;
  }

  /**
   * Extrae elementos de lista del markdown
   * @param {Array} lines - Array de líneas
   * @param {number} startIndex - Índice inicial
   * @returns {Object} - Objeto con items y endIndex
   */
  extractListItems(lines, startIndex) {
    const items = [];
    let i = startIndex;
    
    // Determinar el tipo de lista (ordenada o desordenada)
    const isOrdered = lines[i].match(/^(\s*)\d+\.\s+/);
    
    // Extraer todos los items consecutivos de la lista
    while (i < lines.length) {
      const line = lines[i];
      
      // Verificar si es un item de lista
      if ((isOrdered && line.match(/^(\s*)\d+\.\s+/)) || 
          (!isOrdered && line.match(/^(\s*)[\*\-\+]\s+/))) {
        // Extraer el contenido del item (sin el marcador)
        const content = line.replace(/^(\s*)[\*\-\+\d\.)]+\s+/, '');
        items.push(content);
        i++;
      } else if (line.match(/^\s+/) && items.length > 0) {
        // Elemento indentado (sub-item)
        const content = line.trim();
        const lastIndex = items.length - 1;
        items[lastIndex] += '\n' + content;
        i++;
      } else {
        // Fin de la lista
        break;
      }
    }
    
    return {
      items,
      endIndex: i - 1
    };
  }

  /**
   * Extrae datos de tabla del markdown
   * @param {Array} lines - Array de líneas
   * @param {number} startIndex - Índice inicial
   * @returns {Object} - Objeto con headers, rows y endIndex
   */
  extractTableData(lines, startIndex) {
    const headers = lines[startIndex].split('|').map(h => h.trim()).filter(h => h !== '');
    const rows = [];
    
    let i = startIndex + 2; // Saltar la línea de separación
    
    // Extraer filas de la tabla
    while (i < lines.length && lines[i].includes('|')) {
      const row = lines[i].split('|').map(cell => cell.trim()).filter(cell => cell !== '');
      rows.push(row);
      i++;
    }
    
    return {
      headers,
      rows,
      endIndex: i - 1
    };
  }

  /**
   * Crea diapositivas a partir del contenido parseado
   * @param {Object} pptx - Instancia de pptxgenjs
   * @param {Object} content - Contenido parseado
   */
  async createSlidesFromContent(pptx, content) {
    // Crear diapositiva para el título de la sección
    const titleSlide = pptx.addSlide();
    titleSlide.addText(content.title, {
      x: 0.5,
      y: 1,
      w: 9,
      h: 1.5,
      fontSize: 24,
      bold: true,
      align: 'center',
      color: '000000'
    });
    
    // Crear diapositivas para el contenido
    let currentSlide = pptx.addSlide();
    let currentY = 0.5; // Posición Y inicial
    
    for (const element of content.elements) {
      // Verificar si necesitamos una nueva diapositiva
      if (currentY > 6) {
        currentSlide = pptx.addSlide();
        currentY = 0.5;
      }
      
      switch (element.type) {
        case 'text':
          // Agregar texto normal o formateado
          const textOptions = {
            x: 0.5,
            y: currentY,
            w: 9,
            h: 0.8,
            fontSize: 16,
            color: '363636',
            bold: element.formatted && element.content.match(/(\*\*|__)/) ? true : false,
            italic: element.formatted && element.content.match(/(\*|_)/) && !element.content.match(/(\*\*|__)/) ? true : false
          };
          
          // Limpiar marcadores de énfasis para la presentación
          const cleanText = element.content
            .replace(/\*\*(.*?)\*\*/g, '$1')  // Negritas
            .replace(/\*(.*?)\*/g, '$1')      // Cursivas
            .replace(/__(.*?)__/g, '$1')      // Negritas
            .replace(/_(.*?)_/g, '$1');       // Cursivas
          
          currentSlide.addText(cleanText, textOptions);
          currentY += 0.8;
          break;
          
        case 'list':
          // Agregar lista
          for (const [index, item] of element.items.entries()) {
            // Verificar si necesitamos una nueva diapositiva
            if (currentY > 6) {
              currentSlide = pptx.addSlide();
              currentY = 0.5;
            }
            
            currentSlide.addText(`• ${item}`, {
              x: 1,
              y: currentY,
              w: 8.5,
              h: 0.6,
              fontSize: 15,
              color: '363636',
              bullet: false // Usamos nuestro propio marcador de lista
            });
            currentY += 0.6;
          }
          currentY += 0.2; // Espacio después de la lista
          break;
          
        case 'table':
          // Agregar tabla
          if (element.headers && element.rows) {
            // Verificar si necesitamos una nueva diapositiva
            if (currentY > 5) {
              currentSlide = pptx.addSlide();
              currentY = 0.5;
            }
            
            // Crear datos de tabla para pptxgenjs
            const tableData = [element.headers, ...element.rows];
            
            currentSlide.addTable(tableData, {
              x: 0.5,
              y: currentY,
              w: 9,
              h: 0.5 * (tableData.length + 1),
              fontSize: 12,
              color: '363636',
              fill: 'F0F0F0'
            });
            
            currentY += 0.5 * (tableData.length + 1) + 0.3;
          }
          break;
      }
    }
  }

  /**
   * Genera un nombre de archivo seguro para la presentación
   * @param {string} query - La consulta de investigación
   * @param {string} extension - La extensión del archivo
   * @returns {string} - El nombre del archivo generado
   */
  generateFilename(query, extension) {
    const cleanQuery = query.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 50);
    return `${cleanQuery}_presentacion.${extension}`;
  }
}

export default PresentationGenerator;