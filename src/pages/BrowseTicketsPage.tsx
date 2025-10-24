
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

const BrowseTicketsPage = () => {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Browse Tickets</h1>
          <p className="text-muted-foreground">
            Find tickets for your favorite events
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 border rounded-lg">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input 
                  placeholder="Search events..." 
                  className="flex-1 bg-transparent outline-none text-sm"
                  disabled
                />
              </div>
              <Button variant="outline" size="icon" disabled>
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Browse functionality coming soon!
          </p>
          <p className="text-sm text-muted-foreground">
            Search and filter through thousands of available tickets.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrowseTicketsPage;