
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { TicketWithEvent, TicketSearchParams } from '@/types/database';
import { toast } from 'sonner';

interface UseTicketSearchResult {
  tickets: TicketWithEvent[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  loadMore: () => void;
  refresh: () => void;
  updateFilters: (filters: Partial<TicketSearchParams>) => void;
}

export const useTicketSearch = (initialFilters: TicketSearchParams = {}): UseTicketSearchResult => {
  const [tickets, setTickets] = useState<TicketWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<TicketSearchParams>({
    limit: 10,
    offset: 0,
    sort_by: 'created_at',
    sort_order: 'DESC',
    ...initialFilters
  });

  const searchTickets = useCallback(async (isLoadMore = false) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('tickets')
        .select(`
          *,
          event:events(*),
          seller:users(id, name, rating, verified)
        `)
        .eq('status', 'active')
        .gt('available_quantity', 0);

      // Apply filters
      if (filters.search_query) {
        query = query.or(`event.title.ilike.%${filters.search_query}%,event.location.ilike.%${filters.search_query}%`);
      }

      if (filters.event_category) {
        query = query.eq('event.category', filters.event_category);
      }

      if (filters.min_price !== undefined) {
        query = query.gte('price', filters.min_price);
      }

      if (filters.max_price !== undefined) {
        query = query.lte('price', filters.max_price);
      }

      if (filters.event_city) {
        query = query.eq('event.city', filters.event_city);
      }

      if (filters.event_state) {
        query = query.eq('event.state', filters.event_state);
      }

      if (filters.start_date) {
        query = query.gte('event.date', filters.start_date);
      }

      if (filters.end_date) {
        query = query.lte('event.date', filters.end_date);
      }

      // Apply sorting
      if (filters.sort_by) {
        const sortColumn = filters.sort_by === 'date' ? 'event.date' : filters.sort_by;
        query = query.order(sortColumn, { ascending: filters.sort_order === 'ASC' });
      }

      // Apply pagination
      const currentOffset = isLoadMore ? filters.offset || 0 : 0;
      query = query.range(currentOffset, currentOffset + (filters.limit || 10) - 1);

      const { data, error: queryError, count } = await query;

      if (queryError) throw queryError;

      const newTickets = (data as TicketWithEvent[]) || [];
      
      if (isLoadMore) {
        setTickets(prev => [...prev, ...newTickets]);
      } else {
        setTickets(newTickets);
      }

      setTotalCount(count || 0);
      setHasMore(newTickets.length === (filters.limit || 10));
      
      if (!isLoadMore) {
        setFilters(prev => ({ ...prev, offset: 0 }));
      }

    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to load tickets');
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    
    const newOffset = (filters.offset || 0) + (filters.limit || 10);
    setFilters(prev => ({ ...prev, offset: newOffset }));
    searchTickets(true);
  }, [hasMore, loading, filters.offset, filters.limit, searchTickets]);

  const refresh = useCallback(() => {
    setFilters(prev => ({ ...prev, offset: 0 }));
    searchTickets(false);
  }, [searchTickets]);

  const updateFilters = useCallback((newFilters: Partial<TicketSearchParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters, offset: 0 }));
  }, []);

  useEffect(() => {
    searchTickets(false);
  }, [filters.search_query, filters.event_category, filters.min_price, filters.max_price, 
      filters.event_city, filters.event_state, filters.start_date, filters.end_date, 
      filters.sort_by, filters.sort_order]);

  return {
    tickets,
    loading,
    error,
    hasMore,
    totalCount,
    loadMore,
    refresh,
    updateFilters
  };
};