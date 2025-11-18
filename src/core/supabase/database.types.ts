export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type RolUsuario = 'usuario_registrado' | 'asesor_comercial';
export type EstadoContratacion = 'pendiente' | 'aprobada' | 'rechazada';

export interface Database {
  public: {
    Tables: {
      perfiles: {
        Row: {
          id: string;
          email: string;
          nombre_completo: string | null;
          telefono: string | null;
          rol: RolUsuario;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          nombre_completo?: string | null;
          telefono?: string | null;
          rol: RolUsuario;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          nombre_completo?: string | null;
          telefono?: string | null;
          rol?: RolUsuario;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      planes_moviles: {
        Row: {
          id: string;
          nombre: string;
          precio: number;
          datos_gb: string;
          minutos: string;
          sms: string;
          velocidad_4g: string;
          velocidad_5g: string | null;
          redes_sociales: string;
          whatsapp: string;
          llamadas_internacionales: string;
          roaming: string;
          segmento: string;
          publico_objetivo: string;
          imagen_url: string | null;
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          precio: number;
          datos_gb: string;
          minutos: string;
          sms: string;
          velocidad_4g: string;
          velocidad_5g?: string | null;
          redes_sociales: string;
          whatsapp: string;
          llamadas_internacionales: string;
          roaming: string;
          segmento: string;
          publico_objetivo: string;
          imagen_url?: string | null;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          precio?: number;
          datos_gb?: string;
          minutos?: string;
          sms?: string;
          velocidad_4g?: string;
          velocidad_5g?: string | null;
          redes_sociales?: string;
          whatsapp?: string;
          llamadas_internacionales?: string;
          roaming?: string;
          segmento?: string;
          publico_objetivo?: string;
          imagen_url?: string | null;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      contrataciones: {
        Row: {
          id: string;
          usuario_id: string;
          plan_id: string;
          estado: EstadoContratacion;
          fecha_contratacion: string;
          fecha_aprobacion: string | null;
          asesor_id: string | null;
          notas: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          usuario_id: string;
          plan_id: string;
          estado?: EstadoContratacion;
          fecha_contratacion?: string;
          fecha_aprobacion?: string | null;
          asesor_id?: string | null;
          notas?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          usuario_id?: string;
          plan_id?: string;
          estado?: EstadoContratacion;
          fecha_contratacion?: string;
          fecha_aprobacion?: string | null;
          asesor_id?: string | null;
          notas?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      mensajes_chat: {
        Row: {
          id: string;
          contratacion_id: string;
          remitente_id: string;
          mensaje: string;
          leido: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          contratacion_id: string;
          remitente_id: string;
          mensaje: string;
          leido?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          contratacion_id?: string;
          remitente_id?: string;
          mensaje?: string;
          leido?: boolean;
          created_at?: string;
        };
      };
      chat_typing: {
        Row: {
          id: string;
          contratacion_id: string;
          usuario_id: string;
          is_typing: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          contratacion_id: string;
          usuario_id: string;
          is_typing?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          contratacion_id?: string;
          usuario_id?: string;
          is_typing?: boolean;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}