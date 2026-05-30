export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          status: Database["public"]["Enums"]["project_status"]
          platforms: Database["public"]["Enums"]["platform_type"][] | null
          deadline: string | null
          posted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          platforms?: Database["public"]["Enums"]["platform_type"][] | null
          deadline?: string | null
          posted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          platforms?: Database["public"]["Enums"]["platform_type"][] | null
          deadline?: string | null
          posted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      ideas: {
        Row: {
          id: string
          user_id: string
          content: string
          reference_url: string | null
          is_promoted: boolean
          promoted_to_project_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          reference_url?: string | null
          is_promoted?: boolean
          promoted_to_project_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          reference_url?: string | null
          is_promoted?: boolean
          promoted_to_project_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      scripts: {
        Row: {
          id: string
          project_id: string
          content: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          content?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          content?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      scenes: {
        Row: {
          id: string
          project_id: string
          order_index: number
          title: string | null
          description: string | null
          duration_seconds: number | null
          script_content: string | null
          is_completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          order_index: number
          title?: string | null
          description?: string | null
          duration_seconds?: number | null
          script_content?: string | null
          is_completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          order_index?: number
          title?: string | null
          description?: string | null
          duration_seconds?: number | null
          script_content?: string | null
          is_completed?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      project_status: "idea" | "scripting" | "shooting" | "editing" | "posted"
      platform_type:
        | "tiktok"
        | "instagram_reels"
        | "youtube_shorts"
        | "youtube_long"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type ProjectStatus = Database["public"]["Enums"]["project_status"]
export type PlatformType = Database["public"]["Enums"]["platform_type"]
