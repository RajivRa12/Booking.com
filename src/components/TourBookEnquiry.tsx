import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, MapPin, Users, Calendar, DollarSign } from "lucide-react";
import { toast } from "sonner";

const TourBookEnquiry: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    travelDates: '',
    groupSize: '',
    budgetRange: '',
    specialRequirements: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Save enquiry to localStorage (since we don't have a database)
      const enquiry = {
        ...formData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        status: 'pending'
      };

      const existingEnquiries = JSON.parse(localStorage.getItem('enquiries') || '[]');
      existingEnquiries.push(enquiry);
      localStorage.setItem('enquiries', JSON.stringify(existingEnquiries));

      toast.success('Enquiry submitted successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        destination: '',
        travelDates: '',
        groupSize: '',
        budgetRange: '',
        specialRequirements: ''
      });
      setIsOpen(false);
    } catch (error) {
      toast.error('An error occurred while submitting your enquiry');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <BookOpen className="w-5 h-5 mr-2" />
          TourBook Enquiry
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Plan Your Perfect Trip
          </DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center space-x-1">
                    <span>Full Name *</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>Destination</span>
                  </Label>
                  <Input
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    placeholder="Where would you like to go?"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Travel Dates</span>
                  </Label>
                  <Input
                    name="travelDates"
                    value={formData.travelDates}
                    onChange={handleInputChange}
                    placeholder="e.g., Dec 15-25, 2024"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>Group Size</span>
                  </Label>
                  <Select value={formData.groupSize} onValueChange={(value) => handleSelectChange('groupSize', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select group size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Person</SelectItem>
                      <SelectItem value="2">2 People</SelectItem>
                      <SelectItem value="3">3 People</SelectItem>
                      <SelectItem value="4">4 People</SelectItem>
                      <SelectItem value="5">5 People</SelectItem>
                      <SelectItem value="6+">6+ People</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span>Budget Range</span>
                </Label>
                <Select value={formData.budgetRange} onValueChange={(value) => handleSelectChange('budgetRange', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-50k">Under ₹50,000</SelectItem>
                    <SelectItem value="50k-100k">₹50,000 - ₹1,00,000</SelectItem>
                    <SelectItem value="100k-200k">₹1,00,000 - ₹2,00,000</SelectItem>
                    <SelectItem value="200k-500k">₹2,00,000 - ₹5,00,000</SelectItem>
                    <SelectItem value="above-500k">Above ₹5,00,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialRequirements">Special Requirements</Label>
                <Textarea
                  id="specialRequirements"
                  name="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={handleInputChange}
                  placeholder="Any special requirements, preferences, or questions?"
                  rows={4}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Enquiry'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default TourBookEnquiry;
