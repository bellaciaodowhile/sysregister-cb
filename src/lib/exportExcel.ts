import * as XLSX from 'xlsx';
import { Participant, ClubCategory } from '../types';
import { CATEGORY_CONFIGS } from '../data/categoryConfig';

/**
 * Columns in the EXACT required order from user prompt:
 * 1. Usuario
 * 2. Nombre
 * 3. Apellido
 * 4. Lugar que representa
 * 5. Correo
 * 6. Contraseña
 */
export function formatParticipantsForExcel(participants: Participant[]) {
  return participants.map((p) => ({
    'Usuario': p.usuario,
    'Nombre': p.nombre,
    'Apellido': p.apellido,
    'Lugar que representa': p.lugar_representa,
    'Correo': p.correo,
    'Contraseña': p.contrasena,
    'Categoría': CATEGORY_CONFIGS[p.categoria]?.name || p.categoria,
    'Fecha de Registro': new Date(p.created_at).toLocaleString('es-ES'),
  }));
}

/**
 * Strict export with only the 6 specific requested columns:
 * Usuario, Nombre, Apellido, Lugar que representa, Correo, Contraseña
 */
export function formatStrictRequestedColumns(participants: Participant[]) {
  return participants.map((p) => ({
    'Usuario': p.usuario,
    'Nombre': p.nombre,
    'Apellido': p.apellido,
    'Lugar que representa': p.lugar_representa,
    'Correo': p.correo,
    'Contraseña': p.contrasena,
  }));
}

/**
 * Export participants of a specific category into a standalone Excel workbook (.xlsx)
 */
export function exportCategoryToExcel(participants: Participant[], category: ClubCategory) {
  const categoryData = participants.filter((p) => p.categoria === category);
  const rows = formatStrictRequestedColumns(categoryData);
  const catName = CATEGORY_CONFIGS[category]?.name || category;

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths for clean readability
  worksheet['!cols'] = [
    { wch: 18 }, // Usuario
    { wch: 18 }, // Nombre
    { wch: 18 }, // Apellido
    { wch: 28 }, // Lugar que representa
    { wch: 32 }, // Correo
    { wch: 22 }, // Contraseña
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, catName.substring(0, 31));

  const fileName = `Registro_${catName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

/**
 * Export all participants with individual category sheets and a consolidated sheet
 */
export function exportAllCategoriesToExcel(participants: Participant[]) {
  const workbook = XLSX.utils.book_new();

  // 1. Consolidated sheet
  const allRows = formatStrictRequestedColumns(participants);
  const allWs = XLSX.utils.json_to_sheet(allRows);
  allWs['!cols'] = [
    { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 28 }, { wch: 32 }, { wch: 22 }
  ];
  XLSX.utils.book_append_sheet(workbook, allWs, 'Todos los Inscritos');

  // 2. Individual Category Sheets
  const categories: ClubCategory[] = ['aventureros', 'conquistadores', 'guias_mayores'];
  
  categories.forEach((cat) => {
    const catData = participants.filter((p) => p.categoria === cat);
    const catRows = formatStrictRequestedColumns(catData);
    const catWs = XLSX.utils.json_to_sheet(catRows);
    catWs['!cols'] = [
      { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 28 }, { wch: 32 }, { wch: 22 }
    ];
    const sheetName = CATEGORY_CONFIGS[cat]?.name || cat;
    XLSX.utils.book_append_sheet(workbook, catWs, sheetName.substring(0, 31));
  });

  const fileName = `Club_Quest_Registro_Completo_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

/**
 * Export selected participants to a clean Excel file
 */
export function exportSelectedToExcel(selectedParticipants: Participant[]) {
  if (!selectedParticipants || selectedParticipants.length === 0) return;
  const rows = formatStrictRequestedColumns(selectedParticipants);
  const worksheet = XLSX.utils.json_to_sheet(rows);

  worksheet['!cols'] = [
    { wch: 18 }, // Usuario
    { wch: 18 }, // Nombre
    { wch: 18 }, // Apellido
    { wch: 28 }, // Lugar que representa
    { wch: 32 }, // Correo
    { wch: 22 }, // Contraseña
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Seleccionados');

  const fileName = `Participantes_Seleccionados_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

