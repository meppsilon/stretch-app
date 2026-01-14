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
      stretch_reactions: {
        Row: {
          id: number;
          user_id: string;
          stretch_id: number;
          reaction: "love" | "like" | "dislike" | "hate";
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          stretch_id: number;
          reaction: "love" | "like" | "dislike" | "hate";
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          stretch_id?: number;
          reaction?: "love" | "like" | "dislike" | "hate";
          created_at?: string;
        };
      };
      stretch_history: {
        Row: {
          id: number;
          user_id: string;
          stretch_id: number;
          status: "started" | "paused" | "completed" | "abandoned";
          started_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: number;
          user_id: string;
          stretch_id: number;
          status: "started" | "paused" | "completed" | "abandoned";
          started_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: number;
          user_id?: string;
          stretch_id?: number;
          status?: "started" | "paused" | "completed" | "abandoned";
          started_at?: string;
          completed_at?: string | null;
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
