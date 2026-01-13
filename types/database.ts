export interface Database {
  public: {
    Tables: {
      stretches: {
        Row: {
          id: number;
          name: string;
          seconds: number;
          dynamic: boolean;
          duration: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          seconds: number;
          dynamic: boolean;
          duration: string;
          description: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          seconds?: number;
          dynamic?: boolean;
          duration?: string;
          description?: string;
          created_at?: string;
        };
      };
      muscle_groups: {
        Row: {
          id: number;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          created_at?: string;
        };
      };
      stretch_muscle_groups: {
        Row: {
          stretch_id: number;
          muscle_group_id: number;
        };
        Insert: {
          stretch_id: number;
          muscle_group_id: number;
        };
        Update: {
          stretch_id?: number;
          muscle_group_id?: number;
        };
      };
    };
  };
}

export type StretchRow = Database["public"]["Tables"]["stretches"]["Row"];
export type MuscleGroupRow = Database["public"]["Tables"]["muscle_groups"]["Row"];

export interface StretchWithMuscleGroups extends StretchRow {
  muscle_groups: MuscleGroupRow[];
}
