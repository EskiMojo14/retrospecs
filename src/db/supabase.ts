export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      actions: {
        Row: {
          action: string;
          completed: boolean;
          created_at: string;
          id: number;
          sprint_id: number;
          user_id: string;
        };
        Insert: {
          action: string;
          completed?: boolean;
          created_at?: string;
          id?: number;
          sprint_id: number;
          user_id?: string;
        };
        Update: {
          action?: string;
          completed?: boolean;
          created_at?: string;
          id?: number;
          sprint_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "actions_sprint_id_fkey";
            columns: ["sprint_id"];
            isOneToOne: false;
            referencedRelation: "sprints";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "actions_sprintId_fkey";
            columns: ["sprint_id"];
            isOneToOne: false;
            referencedRelation: "sprints";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "actions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      feedback: {
        Row: {
          category: Database["public"]["Enums"]["category"];
          created_at: string;
          discussed: boolean;
          feedback: string;
          id: number;
          sprint_id: number;
          title: string | null;
          user_id: string;
        };
        Insert: {
          category: Database["public"]["Enums"]["category"];
          created_at?: string;
          discussed?: boolean;
          feedback: string;
          id?: number;
          sprint_id: number;
          title?: string | null;
          user_id: string;
        };
        Update: {
          category?: Database["public"]["Enums"]["category"];
          created_at?: string;
          discussed?: boolean;
          feedback?: string;
          id?: number;
          sprint_id?: number;
          title?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "feedback_sprintId_fkey";
            columns: ["sprint_id"];
            isOneToOne: false;
            referencedRelation: "sprints";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "feedback_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      org_members: {
        Row: {
          created_at: string;
          org_id: number;
          role: Database["public"]["Enums"]["member_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          org_id: number;
          role: Database["public"]["Enums"]["member_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          org_id?: number;
          role?: Database["public"]["Enums"]["member_role"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "org_members_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "orgs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "org_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      orgs: {
        Row: {
          created_at: string;
          id: number;
          name: string;
          owner_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
          owner_id?: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
          owner_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orgs_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          display_name: string;
          email: string;
          user_id: string;
        };
        Insert: {
          avatar_url?: string | null;
          display_name: string;
          email: string;
          user_id: string;
        };
        Update: {
          avatar_url?: string | null;
          display_name?: string;
          email?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      reactions: {
        Row: {
          created_at: string;
          feedback_id: number;
          reaction: Database["public"]["Enums"]["reaction"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          feedback_id: number;
          reaction: Database["public"]["Enums"]["reaction"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          feedback_id?: number;
          reaction?: Database["public"]["Enums"]["reaction"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reactions_feedback_id_fkey";
            columns: ["feedback_id"];
            isOneToOne: false;
            referencedRelation: "feedback";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      sprints: {
        Row: {
          created_at: string;
          follows_id: number | null;
          id: number;
          name: string;
          team_id: number;
        };
        Insert: {
          created_at?: string;
          follows_id?: number | null;
          id?: number;
          name: string;
          team_id: number;
        };
        Update: {
          created_at?: string;
          follows_id?: number | null;
          id?: number;
          name?: string;
          team_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "sprints_follows_id_fkey";
            columns: ["follows_id"];
            isOneToOne: false;
            referencedRelation: "sprints";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sprints_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      team_members: {
        Row: {
          created_at: string;
          team_id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          team_id: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          team_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "team_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      teams: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: number;
          name: string;
          org_id: number;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          id?: number;
          name: string;
          org_id: number;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          id?: number;
          name?: string;
          org_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "teams_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "teams_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "orgs";
            referencedColumns: ["id"];
          },
        ];
      };
      user_config: {
        Row: {
          created_at: string;
          groove: Database["public"]["Enums"]["groove"] | null;
          theme: Database["public"]["Enums"]["theme"] | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          groove?: Database["public"]["Enums"]["groove"] | null;
          theme?: Database["public"]["Enums"]["theme"] | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          groove?: Database["public"]["Enums"]["groove"] | null;
          theme?: Database["public"]["Enums"]["theme"] | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_config_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      category: "good" | "improvement" | "neutral";
      groove: "none" | "low_volume" | "heavy";
      member_role: "admin" | "member";
      reaction: "like";
      theme: "light" | "dark" | "system";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
