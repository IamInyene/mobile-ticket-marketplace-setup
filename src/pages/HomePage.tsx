
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Star, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const featuredEvents = [
    {
      id: 1,
      title: 'Summer Music Festival',
      date: '2024-07-15',
      location: 'Central Park, NYC',
      price: '$89',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop',
      category: 'Music',
      rating: 4.8,
    },
    {
      id: 2,
      title: 'Tech Conference 2024',
      date: '2024-08-22',
      location: 'Convention Center',
      price: '$299',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
      category: 'Conference',
      rating: 4.9,
    },
    {
      id: 3,
      title: 'Broadway Show',
      date: '2024-06-30',
      location: 'Theater District',
      price: '$125',
      image: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=400&h=300&fit=crop',
      category: 'Theater',
      rating: 4.7,
    },
  ];

  const categories = [
    { name: 'Music', icon: '🎵', count: '2.4k' },
    { name: 'Sports', icon: '⚽', count: '1.8k' },
    { name: 'Theater', icon: '🎭', count: '956' },
    { name: 'Comedy', icon: '😂', count: '743' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative gradient-hero text-primary-foreground px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">
            Buy & Sell Tickets
            <br />
            <span className="text-2xl">Safely & Easily</span>
          </h1>
          <p className="text-primary-foreground/90 mb-6">
            Your trusted marketplace for event tickets. Get the best deals or sell your extras.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/browse">Browse Events</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/sell">Sell Tickets</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-8 bg-secondary/30">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-3 rounded-full mb-2">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">50k+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-success/10 p-3 rounded-full mb-2">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div className="text-2xl font-bold text-foreground">98%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-info/10 p-3 rounded-full mb-2">
                <Star className="w-6 h-6 text-info" />
              </div>
              <div className="text-2xl font-bold text-foreground">4.9</div>
              <div className="text-sm text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-8">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Popular Categories</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <Card key={category.name} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="font-medium">{category.name}</div>
                  <div className="text-sm text-muted-foreground">{category.count} tickets</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Featured Events</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/browse">View All</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {featuredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex">
                  <div 
                    className="w-24 h-24 bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${event.image})` }}
                  />
                  <CardContent className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-sm leading-tight">{event.title}</h3>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {event.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{event.price}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="w-3 h-3 fill-current text-warning" />
                          {event.rating}
                        </div>
                      </div>
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
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-12 bg-gradient-to-r from-primary/5 to-info/5">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of users buying and selling tickets safely on our platform.
          </p>
          <Button asChild size="lg" className="w-full">
            <Link to="/sell">Start Selling Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;