import { Buffer } from 'buffer';
import { supabase } from '@core/supabase/client';
import { PlanMovil, CreatePlanDTO } from '@domain/entities';
import * as ImagePicker from 'expo-image-picker';
import { RealtimeChannel } from '@supabase/supabase-js';
import { decode } from 'base64-arraybuffer';

export class PlanesRepository {
  // Obtener todos los planes
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

  // Obtener plan por ID
  async getPlanById(id: string): Promise<PlanMovil | null> {
    try {
      const { data, error } = await supabase
        .from('planes_moviles')
        .select('*')
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

  // Buscar planes
  async searchPlanes(query: string): Promise<PlanMovil[]> {
    try {
      const { data, error } = await supabase
        .from('planes_moviles')
        .select('*')
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

  // Filtrar por precio
  async filterPlanesByPrice(minPrice: number, maxPrice: number): Promise<PlanMovil[]> {
    try {
      const { data, error } = await supabase
        .from('planes_moviles')
        .select('*')
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

  // Crear plan con imagen
  async createPlan(
    planData: CreatePlanDTO,
    imageUri?: string | null
  ): Promise<{ success: boolean; plan?: PlanMovil; error?: string }> {
    try {
      let imagenUrl: string | null = null;

      // Subir imagen si existe
      if (imageUri) {
        const uploadResult = await this.uploadImage(imageUri);
        if (uploadResult.success) {
          imagenUrl = uploadResult.url || null;
        }
      }

      const { data, error } = await supabase
        .from('planes_moviles')
        .insert([{
          nombre: planData.nombre,
          precio: planData.precio,
          datos_gb: planData.datosGb,
          minutos: planData.minutos,
          sms: planData.sms,
          velocidad_4g: planData.velocidad4g,
          velocidad_5g: planData.velocidad5g,
          redes_sociales: planData.redesSociales,
          whatsapp: planData.whatsapp,
          llamadas_internacionales: planData.llamadasInternacionales,
          roaming: planData.roaming,
          segmento: planData.segmento,
          publico_objetivo: planData.publicoObjetivo,
          imagen_url: imagenUrl,
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        plan: new PlanMovil(
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
        )
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // Actualizar plan
  async updatePlan(
    id: string,
    planData: Partial<CreatePlanDTO> & { imagenUrl?: string | null },
    imageUri?: string | null
  ): Promise<{ success: boolean; plan?: PlanMovil; error?: string }> {
    try {
      let imagenUrl: string | null = planData.imagenUrl || null;

      // Si hay nueva imagen, subirla
      if (imageUri) {
        // Eliminar imagen anterior si existe
        if (imagenUrl) {
          await this.deleteImage(imagenUrl);
        }
        const uploadResult = await this.uploadImage(imageUri);
        if (uploadResult.success) {
          imagenUrl = uploadResult.url || null;
        }
      }

      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (planData.nombre !== undefined) updateData.nombre = planData.nombre;
      if (planData.precio !== undefined) updateData.precio = planData.precio;
      if (planData.datosGb !== undefined) updateData.datos_gb = planData.datosGb;
      if (planData.minutos !== undefined) updateData.minutos = planData.minutos;
      if (planData.sms !== undefined) updateData.sms = planData.sms;
      if (planData.velocidad4g !== undefined) updateData.velocidad_4g = planData.velocidad4g;
      if (planData.velocidad5g !== undefined) updateData.velocidad_5g = planData.velocidad5g;
      if (planData.redesSociales !== undefined) updateData.redes_sociales = planData.redesSociales;
      if (planData.whatsapp !== undefined) updateData.whatsapp = planData.whatsapp;
      if (planData.llamadasInternacionales !== undefined) updateData.llamadas_internacionales = planData.llamadasInternacionales;
      if (planData.roaming !== undefined) updateData.roaming = planData.roaming;
      if (planData.segmento !== undefined) updateData.segmento = planData.segmento;
      if (planData.publicoObjetivo !== undefined) updateData.publico_objetivo = planData.publicoObjetivo;
      if (imagenUrl !== undefined) updateData.imagen_url = imagenUrl;

      const { data, error } = await supabase
        .from('planes_moviles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        plan: new PlanMovil(
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
        )
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // Eliminar plan
  async deletePlan(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Obtener plan para eliminar imagen
      const plan = await this.getPlanById(id);
      if (plan?.imagenUrl) {
        await this.deleteImage(plan.imagenUrl);
      }

      const { error } = await supabase
        .from('planes_moviles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // Subir imagen a Storage
  private async uploadImage(imageUri: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();
      
      const fileName = `plan_${Date.now()}.jpg`;
      const filePath = `planes/${fileName}`;

      const { data, error } = await supabase.storage
        .from('planes-imagenes')
        .upload(filePath, decode(Buffer.from(arrayBuffer).toString('base64')), {
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

  // Eliminar imagen de Storage
  private async deleteImage(imageUrl: string): Promise<void> {
    try {
      const path = imageUrl.split('/planes-imagenes/')[1];
      if (path) {
        await supabase.storage.from('planes-imagenes').remove([path]);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }

  // Seleccionar imagen
  async pickImage(): Promise<string | null> {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        throw new Error('Se requieren permisos para acceder a la galería');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      return null;
    }
  }

  // Suscribirse a cambios en planes
  subscribeToPlanes(callback: (payload: any) => void): RealtimeChannel {
    const channel = supabase
      .channel('planes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'planes_moviles',
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return channel;
  }
}