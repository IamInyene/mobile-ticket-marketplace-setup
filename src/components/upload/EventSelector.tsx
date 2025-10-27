
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Plus, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Event, EVENT_CATEGORIES } from '@/types/database';
import { toast } from 'sonner';

interface EventSelectorProps {
  onEventSelect: (event: Event) => void;
  selectedEvent?: Event | null;
}

export const EventSelector = ({ onEventSelect, selectedEvent }: EventSelectorProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    venue: '',
    city: '',
    state: '',
    category: '',
    image_url: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(20);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.location || !newEvent.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setCreating(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...newEvent,
          country: 'US'
        }])
        .select()
        .single();

      if (error) throw error;

      setEvents([data, ...events]);
      onEventSelect(data);
      setShowCreateForm(false);
      setNewEvent({
        title: '',
        description: '',
        date: '',
        location: '',
        venue: '',
        city: '',
        state: '',
        category: '',
        image_url: ''
      });
      toast.success('Event created successfully');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    } finally {
      setCreating(false);
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (showCreateForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Create New Event
            <Button variant="outline" size="sm" onClick={() => setShowCreateForm(false)}>
              Cancel
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder="Enter event title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={newEvent.category} onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date & Time *</Label>
            <Input
              id="date"
              type="datetime-local"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              value={newEvent.venue}
              onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
              placeholder="Venue name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={newEvent.city}
                onChange={(e) => setNewEvent({ ...newEvent, city: e.target.value })}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={newEvent.state}
                onChange={(e) => setNewEvent({ ...newEvent, state: e.target.value })}
                placeholder="State"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Full Address *</Label>
            <Input
              id="location"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              placeholder="Full address or location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              placeholder="Event description"
              rows={3}
            />
          </div>

          <Button onClick={createEvent} disabled={creating} className="w-full">
            {creating ? 'Creating...' : 'Create Event'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Event</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Create New Event Button */}
        <Button
          variant="outline"
          onClick={() => setShowCreateForm(true)}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Event
        </Button>

        {/* Selected Event */}
        {selectedEvent && (
          <Card className="border-primary bg-primary/5">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{selectedEvent.title}</h3>
                <Badge variant="secondary">{selectedEvent.category}</Badge>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(selectedEvent.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {selectedEvent.location}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Events List */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="text-center py-4">Loading events...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No events found
            </div>
          ) : (
            filteredEvents.map((event) => (
              <Card
                key={event.id}
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedEvent?.id === event.id ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => onEventSelect(event)}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {event.category}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};