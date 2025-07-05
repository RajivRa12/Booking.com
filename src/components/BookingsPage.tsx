import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, MapPin, Clock, Users, Star, Phone, MessageCircle, Navigation, X } from "lucide-react";
import { toast } from "sonner";

interface BookingsPageProps {
  onBack: () => void;
}

interface Booking {
  id: string;
  place: {
    name: string;
    location: string;
    image_url?: string;
  };
  booking_date: string;
  booking_time?: string;
  guests: number;
  total_amount: number;
  status: 'upcoming' | 'past' | 'cancelled';
}

const BookingsPage = ({ onBack }: BookingsPageProps) => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">("upcoming");
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "1",
      place: {
        name: "Sunset Cafe",
        location: "Goa",
        image_url: "/placeholder.svg",
      },
      booking_date: "2024-08-15",
      booking_time: "19:00",
      guests: 2,
      total_amount: 1200,
      status: "upcoming",
    },
    {
      id: "2",
      place: {
        name: "Mountain View Restaurant",
        location: "Manali",
        image_url: "/placeholder.svg",
      },
      booking_date: "2024-07-22",
      booking_time: "20:30",
      guests: 4,
      total_amount: 2500,
      status: "past",
    },
    {
      id: "3",
      place: {
        name: "Kerala Houseboat",
        location: "Kerala",
        image_url: "/placeholder.svg",
      },
      booking_date: "2024-06-10",
      guests: 3,
      total_amount: 3000,
      status: "cancelled",
    },
    {
      id: "4",
      place: {
        name: "Shimla Fun World",
        location: "Shimla",
        image_url: "/placeholder.svg",
      },
      booking_date: "2024-09-01",
      booking_time: "14:00",
      guests: 2,
      total_amount: 1800,
      status: "upcoming",
    },
  ]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Simulate loading data
    setTimeout(() => {
      setFilteredBookings(
        bookings.filter((booking) => booking.status === activeTab)
      );
      setLoading(false);
    }, 500);
  }, [activeTab, bookings]);

  const stats = {
    upcoming: bookings.filter((booking) => booking.status === "upcoming").length,
    completed: bookings.filter((booking) => booking.status === "past").length,
    cancelled: bookings.filter((booking) => booking.status === "cancelled").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-600";
      case "past":
        return "bg-green-100 text-green-600";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleCancelBooking = async (id: string) => {
    setCancellingId(id);
    // Simulate cancellation process
    setTimeout(() => {
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === id ? { ...booking, status: "cancelled" } : booking
        )
      );
      setCancellingId(null);
      toast.success("Booking cancelled successfully!");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="hover-scale">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-gray-800">My Bookings</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="text-center animate-scale-in" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600 animate-pulse">{stats.upcoming}</div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </CardContent>
          </Card>
          <Card className="text-center animate-scale-in" style={{ animationDelay: '300ms' }}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600 animate-pulse">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card className="text-center animate-scale-in" style={{ animationDelay: '400ms' }}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600 animate-pulse">{stats.cancelled}</div>
              <div className="text-sm text-gray-600">Cancelled</div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 animate-slide-in-right" style={{ animationDelay: '500ms' }}>
            <TabsTrigger value="upcoming" className="transition-all duration-300">
              Upcoming ({stats.upcoming})
            </TabsTrigger>
            <TabsTrigger value="past" className="transition-all duration-300">
              Past ({stats.completed})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="transition-all duration-300">
              Cancelled ({stats.cancelled})
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          {['upcoming', 'past', 'cancelled'].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-6 animate-fade-in">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredBookings.length === 0 ? (
                <Card className="animate-scale-in">
                  <CardContent className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      No {tab} bookings
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {tab === 'upcoming' && "Start exploring and book your next adventure!"}
                      {tab === 'past' && "Your completed bookings will appear here."}
                      {tab === 'cancelled' && "Your cancelled bookings will appear here."}
                    </p>
                    {tab === 'upcoming' && (
                      <Button className="hover-scale">
                        Explore Places
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((booking, index) => (
                    <Card 
                      key={booking.id} 
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-slide-in-right hover-scale"
                      style={{ animationDelay: `${600 + index * 100}ms` }}
                    >
                      <CardContent className="p-0">
                        <div className="flex">
                          {/* Booking Image */}
                          <div className="w-32 h-32 flex-shrink-0 overflow-hidden">
                            <img 
                              src={booking.place.image_url || "/placeholder.svg"} 
                              alt={booking.place.name}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          
                          {/* Booking Details */}
                          <div className="flex-1 p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-bold text-lg text-gray-800">{booking.place.name}</h3>
                                <p className="text-sm text-gray-600 flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {booking.place.location}
                                </p>
                              </div>
                              <Badge className={getStatusColor(booking.status)} variant="outline">
                                {booking.status}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {booking.booking_date}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {booking.booking_time || 'All day'}
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {booking.guests} guests
                              </div>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 mr-1" />
                                ₹{booking.total_amount}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="hover-scale">
                                <Phone className="h-3 w-3 mr-1" />
                                Call
                              </Button>
                              <Button size="sm" variant="outline" className="hover-scale">
                                <MessageCircle className="h-3 w-3 mr-1" />
                                Chat
                              </Button>
                              <Button size="sm" variant="outline" className="hover-scale">
                                <Navigation className="h-3 w-3 mr-1" />
                                Map
                              </Button>
                              
                              {booking.status === 'confirmed' && (
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => handleCancelBooking(booking.id)}
                                  disabled={cancellingId === booking.id}
                                  className="hover-scale"
                                >
                                  {cancellingId === booking.id ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                  ) : (
                                    <X className="h-3 w-3 mr-1" />
                                  )}
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default BookingsPage;
