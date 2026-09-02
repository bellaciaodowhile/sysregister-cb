import { getSupabaseClient } from './supabaseClient';
import { Participant, ParticipantFormData } from '../types';

export const PRIMARY_TABLE = 'participants';
export const FALLBACK_TABLE = 'participantes';

/**
 * Format and sanitize error messages to keep backend engine invisible to end users
 */
function sanitizeErrorMessage(err: unknown, defaultMsg: string): string {
  if (!err) return defaultMsg;
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes('duplicate key') || msg.includes('unique constraint') || msg.includes('23505')) {
    return 'El nombre de usuario o correo ya se encuentra registrado.';
  }
  if (msg.includes('42P01') || msg.includes('does not exist')) {
    return 'La tabla de registros no existe aún en la base de datos.';
  }
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('network')) {
    return 'No se pudo establecer conexión con el servidor. Revisa tu conexión a internet.';
  }
  if (msg.includes('JWT') || msg.includes('apikey') || msg.includes('invalid claim')) {
    return 'Credenciales de acceso a la base de datos inválidas o expiradas.';
  }
  return msg.replace(/supabase/gi, 'servidor');
}

/**
 * Fetch all participants from the database, ordered by creation date descending
 */
export async function fetchParticipantsFromSupabase(): Promise<{ data: Participant[] | null; error: Error | null; tableUsed?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      data: null,
      error: new Error('La base de datos no está configurada.'),
    };
  }

  try {
    // Try primary table 'participants'
    const { data, error } = await supabase
      .from(PRIMARY_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return { data: data as Participant[], error: null, tableUsed: PRIMARY_TABLE };
    }

    // If table doesn't exist, try fallback 'participantes'
    if (error && (error.code === '42P01' || error.message?.includes('does not exist'))) {
      const fallbackRes = await supabase
        .from(FALLBACK_TABLE)
        .select('*')
        .order('created_at', { ascending: false });

      if (!fallbackRes.error && fallbackRes.data) {
        return { data: fallbackRes.data as Participant[], error: null, tableUsed: FALLBACK_TABLE };
      }
      return { data: null, error: new Error(sanitizeErrorMessage(fallbackRes.error || error, 'Error al consultar la base de datos')) };
    }

    return { data: null, error: new Error(sanitizeErrorMessage(error, 'Error al obtener participantes de la base de datos')) };
  } catch (err: unknown) {
    return { data: null, error: new Error(sanitizeErrorMessage(err, 'Error inesperado al conectar con el servidor')) };
  }
}

/**
 * Insert a new participant into the database
 */
export async function insertParticipantToSupabase(formData: ParticipantFormData): Promise<{ data: Participant | null; error: Error | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      data: null,
      error: new Error('La base de datos no está configurada.'),
    };
  }

  const payload = {
    usuario: formData.usuario.trim().toLowerCase(),
    nombre: formData.nombre.trim(),
    apellido: formData.apellido.trim(),
    lugar_representa: formData.lugar_representa.trim(),
    correo: formData.correo.trim().toLowerCase(),
    contrasena: formData.contrasena || '123456789',
    categoria: formData.categoria,
    nivel: formData.categoria === 'guias_mayores' ? 8 : formData.categoria === 'conquistadores' ? 5 : 2,
    rango: formData.rango || (formData.categoria === 'guias_mayores' ? 'Guía Mayor' : formData.categoria === 'conquistadores' ? 'Conquistador' : 'Aventurero'),
    avatar_seed: formData.nombre.trim(),
  };

  try {
    const { data, error } = await supabase
      .from(PRIMARY_TABLE)
      .insert([payload])
      .select()
      .single();

    if (error) {
      // Fallback check
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        const fallbackRes = await supabase
          .from(FALLBACK_TABLE)
          .insert([payload])
          .select()
          .single();
        if (fallbackRes.error) {
          return { data: null, error: new Error(sanitizeErrorMessage(fallbackRes.error, 'Error al registrar participante')) };
        }
        return { data: fallbackRes.data as Participant, error: null };
      }
      return { data: null, error: new Error(sanitizeErrorMessage(error, 'Error al registrar participante')) };
    }

    return { data: data as Participant, error: null };
  } catch (err: unknown) {
    return { data: null, error: new Error(sanitizeErrorMessage(err, 'Error al registrar participante en el servidor')) };
  }
}

/**
 * Update an existing participant in the database
 */
export async function updateParticipantInSupabase(id: string, updates: Partial<Participant>): Promise<{ data: Participant | null; error: Error | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      data: null,
      error: new Error('La base de datos no está configurada.'),
    };
  }

  const payload: Record<string, unknown> = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  // Avoid updating primary key or undefined fields
  delete payload.id;

  try {
    const { data, error } = await supabase
      .from(PRIMARY_TABLE)
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        const fallbackRes = await supabase
          .from(FALLBACK_TABLE)
          .update(payload)
          .eq('id', id)
          .select()
          .single();
        if (fallbackRes.error) {
          return { data: null, error: new Error(sanitizeErrorMessage(fallbackRes.error, 'Error al actualizar participante')) };
        }
        return { data: fallbackRes.data as Participant, error: null };
      }
      return { data: null, error: new Error(sanitizeErrorMessage(error, 'Error al actualizar participante')) };
    }

    return { data: data as Participant, error: null };
  } catch (err: unknown) {
    return { data: null, error: new Error(sanitizeErrorMessage(err, 'Error al actualizar participante en el servidor')) };
  }
}

/**
 * Delete a single participant from the database
 */
export async function deleteParticipantFromSupabase(id: string): Promise<{ success: boolean; error: Error | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      error: new Error('La base de datos no está configurada.'),
    };
  }

  try {
    const { error } = await supabase
      .from(PRIMARY_TABLE)
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        const fallbackRes = await supabase
          .from(FALLBACK_TABLE)
          .delete()
          .eq('id', id);
        if (fallbackRes.error) {
          return { success: false, error: new Error(sanitizeErrorMessage(fallbackRes.error, 'Error al eliminar participante')) };
        }
        return { success: true, error: null };
      }
      return { success: false, error: new Error(sanitizeErrorMessage(error, 'Error al eliminar participante')) };
    }

    return { success: true, error: null };
  } catch (err: unknown) {
    return { success: false, error: new Error(sanitizeErrorMessage(err, 'Error al eliminar participante del servidor')) };
  }
}

/**
 * Delete multiple participants from the database (Batch Delete)
 */
export async function deleteMultipleParticipantsFromSupabase(ids: string[]): Promise<{ success: boolean; count: number; error: Error | null }> {
  if (!ids || ids.length === 0) {
    return { success: true, count: 0, error: null };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      count: 0,
      error: new Error('La base de datos no está configurada.'),
    };
  }

  try {
    const { error } = await supabase
      .from(PRIMARY_TABLE)
      .delete()
      .in('id', ids);

    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        const fallbackRes = await supabase
          .from(FALLBACK_TABLE)
          .delete()
          .in('id', ids);
        if (fallbackRes.error) {
          return { success: false, count: 0, error: new Error(sanitizeErrorMessage(fallbackRes.error, 'Error al eliminar los participantes seleccionados')) };
        }
        return { success: true, count: ids.length, error: null };
      }
      return { success: false, count: 0, error: new Error(sanitizeErrorMessage(error, 'Error al eliminar los participantes seleccionados')) };
    }

    return { success: true, count: ids.length, error: null };
  } catch (err: unknown) {
    return { success: false, count: 0, error: new Error(sanitizeErrorMessage(err, 'Error al eliminar participantes del servidor')) };
  }
}

/**
 * Subscribe to real-time changes in the participants table
 */
export function subscribeToSupabaseParticipants(onChange: () => void) {
  const supabase = getSupabaseClient();
  if (!supabase) return () => {};

  try {
    const channel = supabase
      .channel('realtime_participants_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: PRIMARY_TABLE },
        () => {
          onChange();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: FALLBACK_TABLE },
        () => {
          onChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('No se pudo establecer el canal en tiempo real:', err);
    return () => {};
  }
}
