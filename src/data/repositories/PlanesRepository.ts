import { Buffer } from 'buffer';
import { supabase } from '@core/supabase/client';
import { PlanMovil, CreatePlanDTO } from '@domain/entities';
import * as ImagePicker from 'expo-image-picker';
import { RealtimeChannel } from '@supabase/supabase-js';
import type { Database } from '@core/supabase/database.types';

// TIPADO CORRECTO: FUERA DE LA CLASE
type PlanRow = Database['public']['Tables']['planes_moviles']['Row'];

export class PlanesRepository {
  // ---------------------------------------------------------
  // GET ALL PLANES
  // ---------------------------------------------------------
  async getPlanes(): Promise<PlanMovil[]> {
    try {
      const { data, error } = await supabase
        .from('planes_moviles')
        .select('*')
        .eq('activo', true)
        .order('precio', { ascending: true });


      if (error) throw error;

      return (data || []).map(plan => new PlanMovil(
        plan.id,
        plan.nombre,
        plan.precio,
        plan.datos_gb,
        plan.minutos,
        plan.sms,
        plan.velocidad_4g,
        plan.velocidad_5g,
        plan.redes_sociales,
        plan.whatsapp,
        plan.llamadas_internacionales,
        plan.roaming,
        plan.segmento,
        plan.publico_objetivo,
        plan.imagen_url,
        plan.activo,
        new Date(plan.created_at),
        new Date(plan.updated_at)
      ));
    } catch (error) {
      console.error('Error getting planes:', error);
      return [];
    }
  }

  // ---------------------------------------------------------
  // GET BY ID
  // ---------------------------------------------------------
  async getPlanById(id: string): Promise<PlanMovil | null> {
    try {
      const { data, error } = await supabase
        .from('planes_moviles')
        .select<PlanRow>('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return new PlanMovil(
        data.id,
        data.nombre,
        data.precio,
        data.datos_gb,
        data.minutos,
        data.sms,
        data.velocidad_4g,
        data.velocidad_5g,
        data.redes_sociales,
        data.whatsapp,
        data.llamadas_internacionales,
        data.roaming,
        data.segmento,
        data.publico_objetivo,
        data.imagen_url,
        data.activo,
        new Date(data.created_at),
        new Date(data.updated_at)
      );
    } catch (error) {
      console.error('Error getting plan:', error);
      return null;
    }
  }

  // ---------------------------------------------------------
  // SEARCH
  // ---------------------------------------------------------
  async searchPlanes(query: string): Promise<PlanMovil[]> {
    try {
      const { data, error } = await supabase
        .from('planes_moviles')
        .select<PlanRow[]>('*')
        .eq('activo', true)
        .or(`nombre.ilike.%${query}%,segmento.ilike.%${query}%,publico_objetivo.ilike.%${query}%`)
        .order('precio', { ascending: true });

      if (error) throw error;

      return (data || []).map(plan => new PlanMovil(
        plan.id,
        plan.nombre,
        plan.precio,
        plan.datos_gb,
        plan.minutos,
        plan.sms,
        plan.velocidad_4g,
        plan.velocidad_5g,
        plan.redes_sociales,
        plan.whatsapp,
        plan.llamadas_internacionales,
        plan.roaming,
        plan.segmento,
        plan.publico_objetivo,
        plan.imagen_url,
        plan.activo,
        new Date(plan.created_at),
        new Date(plan.updated_at)
      ));
    } catch (error) {
      console.error('Error searching planes:', error);
      return [];
    }
  }

  // ---------------------------------------------------------
  // FILTER BY PRICE
  // ---------------------------------------------------------
  async filterPlanesByPrice(minPrice: number, maxPrice: number): Promise<PlanMovil[]> {
    try {
      const { data, error } = await supabase
        .from('planes_moviles')
        .select<PlanRow[]>('*')
        .eq('activo', true)
        .gte('precio', minPrice)
        .lte('precio', maxPrice)
        .order('precio', { ascending: true });

      if (error) throw error;

      return (data || []).map(plan => new PlanMovil(
        plan.id,
        plan.nombre,
        plan.precio,
        plan.datos_gb,
        plan.minutos,
        plan.sms,
        plan.velocidad_4g,
        plan.velocidad_5g,
        plan.redes_sociales,
        plan.whatsapp,
        plan.llamadas_internacionales,
        plan.roaming,
        plan.segmento,
        plan.publico_objetivo,
        plan.imagen_url,
        plan.activo,
        new Date(plan.created_at),
        new Date(plan.updated_at)
      ));
    } catch (error) {
      console.error('Error filtering planes:', error);
      return [];
    }
  }

  // ---------------------------------------------------------
  // UPLOAD IMAGE (ÚNICA VERSIÓN CORRECTA)
  // ---------------------------------------------------------
  private async uploadImage(imageUri: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const fileName = `plan_${Date.now()}.jpg`;
      const filePath = `planes/${fileName}`;

      const { data, error } = await supabase.storage
        .from('planes-imagenes')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('planes-imagenes')
        .getPublicUrl(filePath);

      return { success: true, url: urlData.publicUrl };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
}
