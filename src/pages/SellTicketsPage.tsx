
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, DollarSign, Shield } from 'lucide-react';

const SellTicketsPage = () => {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Sell Your Tickets</h1>
          <p className="text-muted-foreground">
            Turn your extra tickets into cash quickly and safely
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Ticket Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Feature coming soon! Upload your ticket images and set your price.
            </p>
            <Button className="w-full" disabled>
              Upload Tickets
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-success" />
              <div>
                <h3 className="font-semibold">Best Prices</h3>
                <p className="text-sm text-muted-foreground">Get competitive rates for your tickets</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-semibold">Secure Transactions</h3>
                <p className="text-sm text-muted-foreground">Protected payments and fraud prevention</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SellTicketsPage;