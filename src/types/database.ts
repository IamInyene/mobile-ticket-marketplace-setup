
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          verified: boolean
          rating: number
          total_reviews: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          verified?: boolean
          rating?: number
          total_reviews?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          verified?: boolean
          rating?: number
          total_reviews?: number
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          location: string
          category: string
          image_url: string | null
          venue: string | null
          city: string | null
          state: string | null
          country: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date: string
          location: string
          category: string
          image_url?: string | null
          venue?: string | null
          city?: string | null
          state?: string | null
          country?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string
          location?: string
          category?: string
          image_url?: string | null
          venue?: string | null
          city?: string | null
          state?: string | null
          country?: string
          created_at?: string
          updated_at?: string
        }
      }
      tickets: {
        Row: {
          id: string
          event_id: string
          seller_id: string
          price: number
          original_price: number | null
          quantity: number
          available_quantity: number
          section: string | null
          row_name: string | null
          seat_numbers: string[] | null
          ticket_type: string
          status: 'active' | 'sold' | 'cancelled' | 'expired'
          images: string[] | null
          notes: string | null
          delivery_method: 'electronic' | 'physical' | 'mobile'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          seller_id: string
          price: number
          original_price?: number | null
          quantity?: number
          available_quantity?: number
          section?: string | null
          row_name?: string | null
          seat_numbers?: string[] | null
          ticket_type?: string
          status?: 'active' | 'sold' | 'cancelled' | 'expired'
          images?: string[] | null
          notes?: string | null
          delivery_method?: 'electronic' | 'physical' | 'mobile'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          seller_id?: string
          price?: number
          original_price?: number | null
          quantity?: number
          available_quantity?: number
          section?: string | null
          row_name?: string | null
          seat_numbers?: string[] | null
          ticket_type?: string
          status?: 'active' | 'sold' | 'cancelled' | 'expired'
          images?: string[] | null
          notes?: string | null
          delivery_method?: 'electronic' | 'physical' | 'mobile'
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          ticket_id: string
          buyer_id: string
          seller_id: string
          quantity: number
          unit_price: number
          total_amount: number
          platform_fee: number
          seller_amount: number
          status: 'pending' | 'completed' | 'cancelled' | 'refunded' | 'disputed'
          stripe_payment_intent_id: string | null
          stripe_transfer_id: string | null
          payment_method: string
          created_at: string
          updated_at: string
          completed_at: string | null
          cancelled_at: string | null
        }
        Insert: {
          id?: string
          ticket_id: string
          buyer_id: string
          seller_id: string
          quantity?: number
          unit_price: number
          total_amount: number
          platform_fee?: number
          seller_amount: number
          status?: 'pending' | 'completed' | 'cancelled' | 'refunded' | 'disputed'
          stripe_payment_intent_id?: string | null
          stripe_transfer_id?: string | null
          payment_method?: string
          created_at?: string
          updated_at?: string
          completed_at?: string | null
          cancelled_at?: string | null
        }
        Update: {
          id?: string
          ticket_id?: string
          buyer_id?: string
          seller_id?: string
          quantity?: number
          unit_price?: number
          total_amount?: number
          platform_fee?: number
          seller_amount?: number
          status?: 'pending' | 'completed' | 'cancelled' | 'refunded' | 'disputed'
          stripe_payment_intent_id?: string | null
          stripe_transfer_id?: string | null
          payment_method?: string
          created_at?: string
          updated_at?: string
          completed_at?: string | null
          cancelled_at?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          transaction_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment: string | null
          review_type: 'seller' | 'buyer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          transaction_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment?: string | null
          review_type?: 'seller' | 'buyer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          transaction_id?: string
          reviewer_id?: string
          reviewee_id?: string
          rating?: number
          comment?: string | null
          review_type?: 'seller' | 'buyer'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      search_tickets: {
        Args: {
          search_query?: string
          event_category?: string
          min_price?: number
          max_price?: number
        }
        Returns: {
          ticket_id: string
          event_title: string
          event_date: string
          price: number
          available_quantity: number
          seller_name: string
          seller_rating: number
        }[]
      }
    }
  }
}

// Convenience types
export type User = Database['public']['Tables']['users']['Row']
export type Event = Database['public']['Tables']['events']['Row']
export type Ticket = Database['public']['Tables']['tickets']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']

export type InsertUser = Database['public']['Tables']['users']['Insert']
export type InsertEvent = Database['public']['Tables']['events']['Insert']
export type InsertTicket = Database['public']['Tables']['tickets']['Insert']
export type InsertTransaction = Database['public']['Tables']['transactions']['Insert']
export type InsertReview = Database['public']['Tables']['reviews']['Insert']

export type UpdateUser = Database['public']['Tables']['users']['Update']
export type UpdateEvent = Database['public']['Tables']['events']['Update']
export type UpdateTicket = Database['public']['Tables']['tickets']['Update']
export type UpdateTransaction = Database['public']['Tables']['transactions']['Update']
export type UpdateReview = Database['public']['Tables']['reviews']['Update']

// Extended types with relations
export type TicketWithEvent = Ticket & {
  event: Event
  seller: User
}

export type TransactionWithDetails = Transaction & {
  ticket: TicketWithEvent
  buyer: User
  seller: User
}

export type ReviewWithDetails = Review & {
  reviewer: User
  reviewee: User
  transaction: Transaction
}

// Search and filter types
export interface TicketSearchParams {
  search_query?: string
  event_category?: string
  min_price?: number
  max_price?: number
  event_city?: string
  event_state?: string
  start_date?: string
  end_date?: string
  sort_by?: 'price' | 'date' | 'created_at'
  sort_order?: 'ASC' | 'DESC'
  limit?: number
  offset?: number
}

export interface TicketSearchResult {
  ticket_id: string
  event_title: string
  event_date: string
  price: number
  available_quantity: number
  seller_name: string
  seller_rating: number
}

// Event categories
export const EVENT_CATEGORIES = [
  'Concert',
  'Sports',
  'Theater',
  'Festival',
  'Comedy',
  'Dance',
  'Family',
  'Other'
] as const

export type EventCategory = typeof EVENT_CATEGORIES[number]

// Ticket types
export const TICKET_TYPES = [
  'general',
  'vip',
  'premium'
] as const

export type TicketType = typeof TICKET_TYPES[number]

// Delivery methods
export const DELIVERY_METHODS = [
  'electronic',
  'physical',
  'mobile'
] as const

export type DeliveryMethod = typeof DELIVERY_METHODS[number]