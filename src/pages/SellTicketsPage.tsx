
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/upload/ImageUpload';
import { EventSelector } from '@/components/upload/EventSelector';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Event, TICKET_TYPES, DELIVERY_METHODS } from '@/types/database';
import { toast } from 'sonner';
import { Upload, DollarSign, Shield, ArrowLeft, Check } from 'lucide-react';

interface TicketFormData {
  price: string;
  originalPrice: string;
  quantity: string;
  section: string;
  rowName: string;
  seatNumbers: string;
  ticketType: string;
  deliveryMethod: string;
  notes: string;
}

const SellTicketsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<TicketFormData>({
    price: '',
    originalPrice: '',
    quantity: '1',
    section: '',
    rowName: '',
    seatNumbers: '',
    ticketType: 'general',
    deliveryMethod: 'electronic',
    notes: ''
  });

  const updateFormData = (field: keyof TicketFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return selectedEvent !== null;
      case 2:
        return images.length > 0;
      case 3:
        return formData.price !== '' && parseFloat(formData.price) > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      toast.error('Please complete all required fields');
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const submitTicket = async () => {
    if (!user || !selectedEvent) {
      toast.error('Please log in to continue');
      return;
    }

    if (!validateStep(3)) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const seatNumbersArray = formData.seatNumbers
        ? formData.seatNumbers.split(',').map(s => s.trim()).filter(s => s)
        : null;

      const { data, error } = await supabase
        .from('tickets')
        .insert([{
          event_id: selectedEvent.id,
          seller_id: user.id,
          price: parseFloat(formData.price),
          original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          quantity: parseInt(formData.quantity),
          available_quantity: parseInt(formData.quantity),
          section: formData.section || null,
          row_name: formData.rowName || null,
          seat_numbers: seatNumbersArray,
          ticket_type: formData.ticketType,
          delivery_method: formData.deliveryMethod,
          notes: formData.notes || null,
          images: images,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Ticket listing created successfully!');
      navigate('/my-tickets');
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create ticket listing');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Choose Event</h2>
              <p className="text-muted-foreground">
                Select the event for your tickets or create a new one
              </p>
            </div>
            <EventSelector
              onEventSelect={setSelectedEvent}
              selectedEvent={selectedEvent}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Upload Ticket Images</h2>
              <p className="text-muted-foreground">
                Add clear photos of your tickets for verification
              </p>
            </div>
            <ImageUpload
              onImagesChange={setImages}
              maxImages={5}
              existingImages={images}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Ticket Details</h2>
              <p className="text-muted-foreground">
                Provide pricing and seating information
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Selling Price *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => updateFormData('price', e.target.value)}
                        className="pl-10"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="originalPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.originalPrice}
                        onChange={(e) => updateFormData('originalPrice', e.target.value)}
                        className="pl-10"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Select value={formData.quantity} onValueChange={(value) => updateFormData('quantity', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} ticket{num > 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seating Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="section">Section</Label>
                    <Input
                      id="section"
                      value={formData.section}
                      onChange={(e) => updateFormData('section', e.target.value)}
                      placeholder="e.g., A, VIP, General"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rowName">Row</Label>
                    <Input
                      id="rowName"
                      value={formData.rowName}
                      onChange={(e) => updateFormData('rowName', e.target.value)}
                      placeholder="e.g., 1, A, Front"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seatNumbers">Seat Numbers</Label>
                  <Input
                    id="seatNumbers"
                    value={formData.seatNumbers}
                    onChange={(e) => updateFormData('seatNumbers', e.target.value)}
                    placeholder="e.g., 1, 2 or 15-18 (comma separated)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticketType">Ticket Type</Label>
                    <Select value={formData.ticketType} onValueChange={(value) => updateFormData('ticketType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TICKET_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryMethod">Delivery Method</Label>
                    <Select value={formData.deliveryMethod} onValueChange={(value) => updateFormData('deliveryMethod', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DELIVERY_METHODS.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method.charAt(0).toUpperCase() + method.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => updateFormData('notes', e.target.value)}
                    placeholder="Any additional information about the tickets..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Review & Submit</h2>
              <p className="text-muted-foreground">
                Please review your ticket listing before submitting
              </p>
            </div>

            {/* Event Summary */}
            {selectedEvent && (
              <Card>
                <CardHeader>
                  <CardTitle>Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{selectedEvent.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedEvent.date).toLocaleDateString()} • {selectedEvent.location}
                      </p>
                    </div>
                    <Badge variant="secondary">{selectedEvent.category}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ticket Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Ticket Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Price</Label>
                    <p className="text-lg font-bold text-primary">${formData.price}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Quantity</Label>
                    <p>{formData.quantity} ticket{parseInt(formData.quantity) > 1 ? 's' : ''}</p>
                  </div>
                </div>

                {(formData.section || formData.rowName) && (
                  <div>
                    <Label className="text-sm font-medium">Seating</Label>
                    <p>
                      {formData.section && `Section ${formData.section}`}
                      {formData.section && formData.rowName && ' • '}
                      {formData.rowName && `Row ${formData.rowName}`}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Type</Label>
                    <p className="capitalize">{formData.ticketType}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Delivery</Label>
                    <p className="capitalize">{formData.deliveryMethod}</p>
                  </div>
                </div>

                {formData.notes && (
                  <div>
                    <Label className="text-sm font-medium">Notes</Label>
                    <p className="text-sm text-muted-foreground">{formData.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Images Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Images ({images.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {images.map((imageUrl, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={`Ticket ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Sell Your Tickets</h1>
          <p className="text-muted-foreground">
            Turn your extra tickets into cash quickly and safely
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNum <= step
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {stepNum < step ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              {stepNum < 4 && (
                <div
                  className={`w-8 h-0.5 mx-2 ${
                    stepNum < step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 1 && (
            <Button variant="outline" onClick={prevStep} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          
          {step < 4 ? (
            <Button 
              onClick={nextStep} 
              className="flex-1"
              disabled={!validateStep(step)}
            >
              Continue
            </Button>
          ) : (
            <Button 
              onClick={submitTicket} 
              className="flex-1"
              disabled={submitting}
            >
              {submitting ? 'Creating Listing...' : 'Create Listing'}
            </Button>
          )}
        </div>

        {/* Benefits Section */}
        {step === 1 && (
          <div className="grid gap-4 mt-8">
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
        )}
      </div>
    </div>
  );
};

export default SellTicketsPage;