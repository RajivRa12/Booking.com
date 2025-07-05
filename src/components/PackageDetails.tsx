"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import BookingFlow from "./BookingFlow"
import { ArrowLeft, MapPin, Calendar, Star, Check, X, Phone, Mail, Globe } from "lucide-react"

interface PackageDetailsProps {
  packageData: any
  onBack: () => void
}

const PackageDetails = ({ packageData, onBack }: PackageDetailsProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [showBookingFlow, setShowBookingFlow] = useState(false)
  const [bookingFormData, setBookingFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    travelers: 1,
    travelDate: "",
    specialRequests: "",
  })

  const packageImages = ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]

  const itinerary = [
    {
      day: 1,
      title: "Arrival in Manali",
      description:
        "Arrive in Manali, check into hotel. Evening visit to Mall Road and local markets. Welcome dinner with traditional Himachali cuisine.",
    },
    {
      day: 2,
      title: "Adventure Activities",
      description:
        "Morning river rafting in Beas River. Afternoon paragliding session with panoramic mountain views. Evening at leisure.",
    },
    {
      day: 3,
      title: "Solang Valley Excursion",
      description:
        "Full day trip to Solang Valley. Cable car ride, snow activities (seasonal), and adventure sports. Visit to local temples.",
    },
    {
      day: 4,
      title: "Cultural Experience",
      description:
        "Visit to Hadimba Temple and local villages. Interaction with local communities. Traditional cultural show in the evening.",
    },
    {
      day: 5,
      title: "Departure",
      description:
        "Morning at leisure for shopping and last-minute sightseeing. Check out and departure with beautiful memories.",
    },
  ]

  const highlights = [
    "River Rafting",
    "Paragliding",
    "Temple Visit",
    "Local Cuisine",
    "Mountain Trekking",
    "Cultural Show",
  ]

  const included = [
    "4 nights accommodation in premium hotels",
    "Daily breakfast and dinner",
    "Private transportation throughout the trip",
    "Professional tour guide",
    "All adventure activity fees",
    "Airport/railway station transfers",
  ]

  const notIncluded = [
    "Airfare/train fare to and from Manali",
    "Lunch and beverages",
    "Personal expenses and tips",
    "Travel insurance",
    "Any activity not mentioned in inclusions",
    "Emergency evacuation costs",
  ]

  const terms = [
    "Booking confirmation required 48 hours before departure",
    "50% advance payment required at time of booking",
    "Weather conditions may affect some activities",
    "Valid ID proof required for all participants",
    "Age limit: 12-65 years for adventure activities",
    "Cancellation charges apply as per policy",
  ]

  const handleBookingSubmit = () => {
    if (!bookingFormData.customerName || !bookingFormData.customerEmail || !bookingFormData.travelDate) {
      alert("Please fill in all required fields")
      return
    }

    setShowBookingDialog(false)
    setShowBookingFlow(true)
  }

  const handleBookingComplete = () => {
    setShowBookingFlow(false)
    setShowBookingDialog(false)
    setBookingFormData({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      travelers: 1,
      travelDate: "",
      specialRequests: "",
    })
    onBack()
  }

  if (showBookingFlow) {
    return (
      <BookingFlow
        packageData={{
          ...packageData,
          ...bookingFormData,
          price: 15999 * bookingFormData.travelers,
          agencyName: "Mountain Explorers",
        }}
        onBack={() => setShowBookingFlow(false)}
        onComplete={handleBookingComplete}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-gray-800">Package Details</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Image Gallery */}
        <Card className="overflow-hidden animate-scale-in">
          <div className="relative h-64 bg-gradient-to-r from-blue-400 to-purple-500">
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="h-16 w-16 text-white animate-pulse" />
            </div>
            {/* Image thumbnails */}
            <div className="absolute bottom-4 left-4 flex space-x-2">
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className={`w-12 h-12 bg-white/20 rounded border-2 cursor-pointer hover-scale ${
                    activeImageIndex === index ? "border-white" : "border-transparent"
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </Card>

        {/* Package Header */}
        <Card className="animate-slide-in-right" style={{ animationDelay: "200ms" }}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {packageData?.title || "Manali Adventure Package"}
                </h2>
                <div className="flex items-center space-x-4 text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{packageData?.destination || "Manali, Himachal Pradesh"}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>5 Days / 4 Nights</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">₹15,999</div>
                <div className="text-sm text-gray-500">per person</div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Adventure
            </Badge>
          </CardContent>
        </Card>

        {/* Package Highlights */}
        <Card className="animate-slide-in-right" style={{ animationDelay: "300ms" }}>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              Package Highlights
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">{highlight}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Itinerary */}
        <Card className="animate-slide-in-right" style={{ animationDelay: "400ms" }}>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Day-wise Itinerary</h3>
            <div className="space-y-4">
              {itinerary.map((day, index) => (
                <div
                  key={index}
                  className="flex space-x-4 animate-fade-in"
                  style={{ animationDelay: `${500 + index * 100}ms` }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">Day {day.day}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{day.title}</h4>
                    <p className="text-gray-600 text-sm">{day.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* What's Included/Not Included */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="animate-slide-in-right" style={{ animationDelay: "600ms" }}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-700">What's Included</h3>
              <div className="space-y-2">
                {included.map((item, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-in-right" style={{ animationDelay: "700ms" }}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-red-700">What's Not Included</h3>
              <div className="space-y-2">
                {notIncluded.map((item, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Terms & Conditions */}
        <Card className="animate-slide-in-right" style={{ animationDelay: "800ms" }}>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-700">Terms & Conditions</h3>
            <div className="space-y-2">
              {terms.map((term, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{term}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Agency */}
        <Card className="animate-slide-in-right" style={{ animationDelay: "900ms" }}>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Contact Agency</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800">Mountain Explorers</h4>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">4.7</span>
                  <span className="text-xs text-gray-500">(128 reviews)</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">123 Mall Road, Manali, Himachal Pradesh</p>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Email:</strong> info@mountainexplorers.com
                </div>
                <div>
                  <strong>Website:</strong> www.mountainexplorers.com
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button className="bg-green-600 hover:bg-green-700">
                <Phone className="h-4 w-4 mr-2" />
                Call Now: +91 8438327763
              </Button>
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Email Inquiry
              </Button>
              <Button variant="outline">
                <Globe className="h-4 w-4 mr-2" />
                Visit Website
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Booking Button */}
        <div className="sticky bottom-4 animate-slide-in-right" style={{ animationDelay: "1000ms" }}>
          <Button
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
            onClick={() => setShowBookingDialog(true)}
          >
            Book Now - ₹15,999 per person
          </Button>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Your Trip</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName">Full Name *</Label>
              <Input
                id="customerName"
                value={bookingFormData.customerName}
                onChange={(e) => setBookingFormData((prev) => ({ ...prev, customerName: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="customerEmail">Email Address *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={bookingFormData.customerEmail}
                onChange={(e) => setBookingFormData((prev) => ({ ...prev, customerEmail: e.target.value }))}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label htmlFor="customerPhone">Phone Number</Label>
              <Input
                id="customerPhone"
                value={bookingFormData.customerPhone}
                onChange={(e) => setBookingFormData((prev) => ({ ...prev, customerPhone: e.target.value }))}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="travelers">Number of Travelers</Label>
                <Input
                  id="travelers"
                  type="number"
                  min="1"
                  value={bookingFormData.travelers}
                  onChange={(e) =>
                    setBookingFormData((prev) => ({ ...prev, travelers: Number.parseInt(e.target.value) || 1 }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="travelDate">Travel Date *</Label>
                <Input
                  id="travelDate"
                  type="date"
                  value={bookingFormData.travelDate}
                  onChange={(e) => setBookingFormData((prev) => ({ ...prev, travelDate: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                value={bookingFormData.specialRequests}
                onChange={(e) => setBookingFormData((prev) => ({ ...prev, specialRequests: e.target.value }))}
                placeholder="Any special requirements or requests..."
                rows={3}
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Total Amount:</span>
                <span className="font-bold text-lg">₹{(15999 * bookingFormData.travelers).toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">For {bookingFormData.travelers} traveler(s) • Includes taxes</p>
            </div>

            <Button onClick={handleBookingSubmit} className="w-full" size="lg">
              Proceed to Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PackageDetails
