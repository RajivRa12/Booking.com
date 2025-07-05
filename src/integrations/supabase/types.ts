export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agencies: {
        Row: {
          address: string | null
          city: string | null
          company_name: string
          contact_email: string
          contact_phone: string | null
          created_at: string | null
          description: string | null
          established_year: number | null
          id: string
          license_number: string | null
          logo_url: string | null
          rating: number | null
          state: string | null
          total_bookings: number | null
          total_packages: number | null
          updated_at: string | null
          user_id: string | null
          verified: boolean | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name: string
          contact_email: string
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          established_year?: number | null
          id?: string
          license_number?: string | null
          logo_url?: string | null
          rating?: number | null
          state?: string | null
          total_bookings?: number | null
          total_packages?: number | null
          updated_at?: string | null
          user_id?: string | null
          verified?: boolean | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string
          contact_email?: string
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          established_year?: number | null
          id?: string
          license_number?: string | null
          logo_url?: string | null
          rating?: number | null
          state?: string | null
          total_bookings?: number | null
          total_packages?: number | null
          updated_at?: string | null
          user_id?: string | null
          verified?: boolean | null
          website_url?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_date: string
          booking_time: string | null
          created_at: string | null
          guests: number | null
          id: string
          place_id: string
          special_requests: string | null
          status: string | null
          total_amount: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          booking_date: string
          booking_time?: string | null
          created_at?: string | null
          guests?: number | null
          id?: string
          place_id: string
          special_requests?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          booking_date?: string
          booking_time?: string | null
          created_at?: string | null
          guests?: number | null
          id?: string
          place_id?: string
          special_requests?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      enquiries: {
        Row: {
          budget_range: string | null
          created_at: string | null
          destination: string | null
          email: string
          group_size: number | null
          id: string
          name: string
          phone: string | null
          special_requirements: string | null
          status: string | null
          travel_dates: string | null
        }
        Insert: {
          budget_range?: string | null
          created_at?: string | null
          destination?: string | null
          email: string
          group_size?: number | null
          id?: string
          name: string
          phone?: string | null
          special_requirements?: string | null
          status?: string | null
          travel_dates?: string | null
        }
        Update: {
          budget_range?: string | null
          created_at?: string | null
          destination?: string | null
          email?: string
          group_size?: number | null
          id?: string
          name?: string
          phone?: string | null
          special_requirements?: string | null
          status?: string | null
          travel_dates?: string | null
        }
        Relationships: []
      }
      package_bookings: {
        Row: {
          agency_id: string | null
          booking_reference: string | null
          created_at: string | null
          customer_email: string
          customer_id: string | null
          customer_name: string
          customer_phone: string
          id: string
          package_id: string | null
          special_requests: string | null
          status: string | null
          total_amount: number
          travel_date: string
          travelers: number
          updated_at: string | null
        }
        Insert: {
          agency_id?: string | null
          booking_reference?: string | null
          created_at?: string | null
          customer_email: string
          customer_id?: string | null
          customer_name: string
          customer_phone: string
          id?: string
          package_id?: string | null
          special_requests?: string | null
          status?: string | null
          total_amount: number
          travel_date: string
          travelers: number
          updated_at?: string | null
        }
        Update: {
          agency_id?: string | null
          booking_reference?: string | null
          created_at?: string | null
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string
          id?: string
          package_id?: string | null
          special_requests?: string | null
          status?: string | null
          total_amount?: number
          travel_date?: string
          travelers?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "package_bookings_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      package_reviews: {
        Row: {
          agency_id: string | null
          comment: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          images: string[] | null
          package_id: string | null
          rating: number | null
        }
        Insert: {
          agency_id?: string | null
          comment?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          images?: string[] | null
          package_id?: string | null
          rating?: number | null
        }
        Update: {
          agency_id?: string | null
          comment?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          images?: string[] | null
          package_id?: string | null
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "package_reviews_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_reviews_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          active: boolean | null
          agency_id: string | null
          available_from: string | null
          available_until: string | null
          booking_count: number | null
          category: string | null
          created_at: string | null
          description: string | null
          destination: string
          duration_days: number
          duration_nights: number
          exclusions: string[] | null
          featured: boolean | null
          id: string
          images: string[] | null
          inclusions: string[] | null
          itinerary: Json | null
          max_group_size: number | null
          price_per_person: number
          rating: number | null
          review_count: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          agency_id?: string | null
          available_from?: string | null
          available_until?: string | null
          booking_count?: number | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          destination: string
          duration_days: number
          duration_nights: number
          exclusions?: string[] | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          inclusions?: string[] | null
          itinerary?: Json | null
          max_group_size?: number | null
          price_per_person: number
          rating?: number | null
          review_count?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          agency_id?: string | null
          available_from?: string | null
          available_until?: string | null
          booking_count?: number | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          destination?: string
          duration_days?: number
          duration_nights?: number
          exclusions?: string[] | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          inclusions?: string[] | null
          itinerary?: Json | null
          max_group_size?: number | null
          price_per_person?: number
          rating?: number | null
          review_count?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "packages_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      places: {
        Row: {
          category: string
          city: string | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          location: string | null
          name: string
          popular: boolean | null
          price_range: string | null
          rating: number | null
          review_count: number | null
          updated_at: string | null
        }
        Insert: {
          category: string
          city?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          location?: string | null
          name: string
          popular?: boolean | null
          price_range?: string | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          city?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          location?: string | null
          name?: string
          popular?: boolean | null
          price_range?: string | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          bookings_made: number | null
          created_at: string | null
          email: string
          id: string
          location: string | null
          member_since: string | null
          name: string | null
          phone: string | null
          photos_shared: number | null
          places_visited: number | null
          reviews_written: number | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
          verified_traveler: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          bookings_made?: number | null
          created_at?: string | null
          email: string
          id: string
          location?: string | null
          member_since?: string | null
          name?: string | null
          phone?: string | null
          photos_shared?: number | null
          places_visited?: number | null
          reviews_written?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          verified_traveler?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          bookings_made?: number | null
          created_at?: string | null
          email?: string
          id?: string
          location?: string | null
          member_since?: string | null
          name?: string | null
          phone?: string | null
          photos_shared?: number | null
          places_visited?: number | null
          reviews_written?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          verified_traveler?: boolean | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          place_id: string
          rating: number | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          place_id: string
          rating?: number | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          place_id?: string
          rating?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_booking_reference: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      user_role: "customer" | "agency" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["customer", "agency", "admin"],
    },
  },
} as const
