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
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          client_info: Json
          client_name: string
          contract_number: string
          contract_type: string
          contract_value: number
          created_at: string
          created_by: string
          delivery_date: string | null
          documents: Json | null
          id: string
          incoterms: string | null
          payment_terms: string | null
          port_of_destination: string | null
          port_of_origin: string | null
          products: Json
          signed_date: string | null
          status: string
          terms: Json | null
          updated_at: string
        }
        Insert: {
          client_info: Json
          client_name: string
          contract_number: string
          contract_type: string
          contract_value: number
          created_at?: string
          created_by: string
          delivery_date?: string | null
          documents?: Json | null
          id?: string
          incoterms?: string | null
          payment_terms?: string | null
          port_of_destination?: string | null
          port_of_origin?: string | null
          products?: Json
          signed_date?: string | null
          status?: string
          terms?: Json | null
          updated_at?: string
        }
        Update: {
          client_info?: Json
          client_name?: string
          contract_number?: string
          contract_type?: string
          contract_value?: number
          created_at?: string
          created_by?: string
          delivery_date?: string | null
          documents?: Json | null
          id?: string
          incoterms?: string | null
          payment_terms?: string | null
          port_of_destination?: string | null
          port_of_origin?: string | null
          products?: Json
          signed_date?: string | null
          status?: string
          terms?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      import_orders: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          invoice_number: string | null
          status: string
          supplier_id: string | null
          total_amount: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          invoice_number?: string | null
          status?: string
          supplier_id?: string | null
          total_amount: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          invoice_number?: string | null
          status?: string
          supplier_id?: string | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "import_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          }
        ]
      }
      import_order_items: {
        Row: {
          created_at: string
          id: string
          import_order_id: string | null
          import_price: number
          product_id: string | null
          quantity: number
          total_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          import_order_id?: string | null
          import_price: number
          product_id?: string | null
          quantity: number
          total_price: number
        }
        Update: {
          created_at?: string
          id?: string
          import_order_id?: string | null
          import_price?: number
          product_id?: string | null
          quantity?: number
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "import_order_items_import_order_id_fkey"
            columns: ["import_order_id"]
            isOneToOne: false
            referencedRelation: "import_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          tax_code: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          tax_code?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          tax_code?: string | null
        }
        Relationships: []
      }
      news: {
        Row: {
          author: string | null
          content: string
          created_at: string
          id: string
          image: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string
          id?: string
          image?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string
          id?: string
          image?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          price: number
          product_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          price: number
          product_id?: string | null
          quantity: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          price?: number
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          payment_method: string
          shipping_address: string
          shipping_name: string
          shipping_phone: string
          status: string | null
          total_amount: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          payment_method: string
          shipping_address: string
          shipping_name: string
          shipping_phone: string
          status?: string | null
          total_amount: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          payment_method?: string
          shipping_address?: string
          shipping_name?: string
          shipping_phone?: string
          status?: string | null
          total_amount?: number
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          is_active: boolean
          name: string
          price: number
          specifications: Json | null
          stock_quantity: number
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean
          name: string
          price: number
          specifications?: Json | null
          stock_quantity?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean
          name?: string
          price?: number
          specifications?: Json | null
          stock_quantity?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          client: string | null
          completion_date: string | null
          content: string | null
          created_at: string
          description: string
          id: string
          image: string | null
          title: string
          updated_at: string
        }
        Insert: {
          client?: string | null
          completion_date?: string | null
          content?: string | null
          created_at?: string
          description: string
          id?: string
          image?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          client?: string | null
          completion_date?: string | null
          content?: string | null
          created_at?: string
          description?: string
          id?: string
          image?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          created_at: string
          created_by: string | null
          customer_info: Json
          id: string
          items: Json
          notes: string | null
          quote_number: string
          status: string
          terms: string | null
          total_estimate: number
          updated_at: string
          user_id: string
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_info: Json
          id?: string
          items?: Json
          notes?: string | null
          quote_number: string
          status?: string
          terms?: string | null
          total_estimate?: number
          updated_at?: string
          user_id: string
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_info?: Json
          id?: string
          items?: Json
          notes?: string | null
          quote_number?: string
          status?: string
          terms?: string | null
          total_estimate?: number
          updated_at?: string
          user_id?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      shipments: {
        Row: {
          actual_delivery: string | null
          actual_pickup: string | null
          carrier: string | null
          contract_id: string | null
          created_at: string
          destination_address: Json | null
          dimensions: Json | null
          estimated_delivery: string | null
          estimated_pickup: string | null
          id: string
          order_id: string | null
          origin_address: Json | null
          shipping_cost: number | null
          shipping_method: string
          status: string
          tracking_number: string
          updates: Json | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          actual_delivery?: string | null
          actual_pickup?: string | null
          carrier?: string | null
          contract_id?: string | null
          created_at?: string
          destination_address?: Json | null
          dimensions?: Json | null
          estimated_delivery?: string | null
          estimated_pickup?: string | null
          id?: string
          order_id?: string | null
          origin_address?: Json | null
          shipping_cost?: number | null
          shipping_method: string
          status?: string
          tracking_number: string
          updates?: Json | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          actual_delivery?: string | null
          actual_pickup?: string | null
          carrier?: string | null
          contract_id?: string | null
          created_at?: string
          destination_address?: Json | null
          dimensions?: Json | null
          estimated_delivery?: string | null
          estimated_pickup?: string | null
          id?: string
          order_id?: string | null
          origin_address?: Json | null
          shipping_cost?: number | null
          shipping_method?: string
          status?: string
          tracking_number?: string
          updates?: Json | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          }
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never
