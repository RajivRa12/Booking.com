"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  CheckCircle,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  Share2,
  MessageCircle,
  Star,
} from "lucide-react"

interface BookingConfirmationProps {
  bookingData: {
    confirmationNumber: string
    packageTitle: string
    agencyName: string
    agencyContact: {
      phone: string
      email: string
      address: string
    }
    customerDetails: {
      name: string
      email: string
      phone: string
    }
    travelDetails: {
      date: string
      travelers: number
      duration: string
    }
    paymentDetails: {
      amount: number
      paymentId: string
      method: string
      timestamp: string
    }
    itinerary: Array<{
      day: number
      title: string
      description: string
    }>
  }
  onNewBooking: () => void
}

const BookingConfirmation = ({ bookingData, onNewBooking }: BookingConfirmationProps) => {
  const [emailSent, setEmailSent] = useState(false)
  const [pdfGenerated, setPdfGenerated] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate sending confirmation email
    const sendConfirmationEmail = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setEmailSent(true)
        toast({
          title: "Confirmation Email Sent",
          description: `Booking confirmation sent to ${bookingData.customerDetails.email}`,
        })
      } catch (error) {
        toast({
          title: "Email Error",
          description: "Failed to send confirmation email. Please contact support.",
          variant: "destructive",
        })
      }
    }

    sendConfirmationEmail()
  }, [])

  const downloadConfirmationPDF = async () => {
    try {
      // Import jsPDF dynamically
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF()

      // Header
      doc.setFillColor(59, 130, 246)
      doc.rect(0, 0, 210, 40, "F")

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.text("BOOKING CONFIRMATION", 105, 25, { align: "center" })

      // Reset text color
      doc.setTextColor(0, 0, 0)

      // Confirmation Details
      let yPos = 60
      doc.setFontSize(16)
      doc.setFont(undefined, "bold")
      doc.text("Confirmation Details", 20, yPos)

      yPos += 15
      doc.setFontSize(12)
      doc.setFont(undefined, "normal")
      doc.text(`Confirmation Number: ${bookingData.confirmationNumber}`, 20, yPos)
      yPos += 8
      doc.text(`Booking Date: ${new Date(bookingData.paymentDetails.timestamp).toLocaleDateString()}`, 20, yPos)
      yPos += 8
      doc.text(`Payment ID: ${bookingData.paymentDetails.paymentId}`, 20, yPos)

      // Package Details
      yPos += 20
      doc.setFontSize(16)
      doc.setFont(undefined, "bold")
      doc.text("Package Details", 20, yPos)

      yPos += 15
      doc.setFontSize(12)
      doc.setFont(undefined, "normal")
      doc.text(`Package: ${bookingData.packageTitle}`, 20, yPos)
      yPos += 8
      doc.text(`Agency: ${bookingData.agencyName}`, 20, yPos)
      yPos += 8
      doc.text(`Travel Date: ${new Date(bookingData.travelDetails.date).toLocaleDateString()}`, 20, yPos)
      yPos += 8
      doc.text(`Travelers: ${bookingData.travelDetails.travelers} person(s)`, 20, yPos)
      yPos += 8
      doc.text(`Duration: ${bookingData.travelDetails.duration}`, 20, yPos)

      // Customer Details
      yPos += 20
      doc.setFontSize(16)
      doc.setFont(undefined, "bold")
      doc.text("Customer Details", 20, yPos)

      yPos += 15
      doc.setFontSize(12)
      doc.setFont(undefined, "normal")
      doc.text(`Name: ${bookingData.customerDetails.name}`, 20, yPos)
      yPos += 8
      doc.text(`Email: ${bookingData.customerDetails.email}`, 20, yPos)
      yPos += 8
      doc.text(`Phone: ${bookingData.customerDetails.phone}`, 20, yPos)

      // Payment Details
      yPos += 20
      doc.setFontSize(16)
      doc.setFont(undefined, "bold")
      doc.text("Payment Details", 20, yPos)

      yPos += 15
      doc.setFontSize(12)
      doc.setFont(undefined, "normal")
      doc.text(`Amount Paid: ₹${bookingData.paymentDetails.amount.toLocaleString()}`, 20, yPos)
      yPos += 8
      doc.text(`Payment Method: ${bookingData.paymentDetails.method}`, 20, yPos)
      yPos += 8
      doc.text(`Transaction ID: ${bookingData.paymentDetails.paymentId}`, 20, yPos)

      // Agency Contact
      yPos += 20
      doc.setFontSize(16)
      doc.setFont(undefined, "bold")
      doc.text("Agency Contact Information", 20, yPos)

      yPos += 15
      doc.setFontSize(12)
      doc.setFont(undefined, "normal")
      doc.text(`Phone: ${bookingData.agencyContact.phone}`, 20, yPos)
      yPos += 8
      doc.text(`Email: ${bookingData.agencyContact.email}`, 20, yPos)
      yPos += 8
      doc.text(`Address: ${bookingData.agencyContact.address}`, 20, yPos)

      // Footer
      doc.setFontSize(10)
      doc.setTextColor(128, 128, 128)
      doc.text("Thank you for choosing TravelLink! Have a wonderful trip!", 105, 280, { align: "center" })

      // Save the PDF
      doc.save(`booking-confirmation-${bookingData.confirmationNumber}.pdf`)
      setPdfGenerated(true)

      toast({
        title: "PDF Downloaded",
        description: "Booking confirmation PDF has been downloaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Download Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
    }
  }

  const shareBooking = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Travel Booking",
          text: `I just booked ${bookingData.packageTitle} with ${bookingData.agencyName}! Confirmation: ${bookingData.confirmationNumber}`,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(`Booking Confirmation: ${bookingData.confirmationNumber}`)
        toast({
          title: "Copied to Clipboard",
          description: "Booking details copied to clipboard.",
        })
      }
    } else {
      navigator.clipboard.writeText(`Booking Confirmation: ${bookingData.confirmationNumber}`)
      toast({
        title: "Copied to Clipboard",
        description: "Booking details copied to clipboard.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success Header */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-green-800 mb-2">Booking Confirmed!</h1>
              <p className="text-green-700 mb-4">
                Your travel booking has been successfully confirmed and payment processed.
              </p>
              <div className="bg-white p-4 rounded-lg inline-block">
                <p className="text-sm text-gray-600">Confirmation Number</p>
                <p className="text-2xl font-bold text-gray-800">{bookingData.confirmationNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4">
          <Button onClick={downloadConfirmationPDF} className="h-auto p-4 flex-col">
            <Download className="h-6 w-6 mb-2" />
            <span>Download PDF</span>
          </Button>
          <Button variant="outline" onClick={shareBooking} className="h-auto p-4 flex-col bg-transparent">
            <Share2 className="h-6 w-6 mb-2" />
            <span>Share Booking</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex-col bg-transparent">
            <MessageCircle className="h-6 w-6 mb-2" />
            <span>Contact Agency</span>
          </Button>
          <Button variant="outline" onClick={onNewBooking} className="h-auto p-4 flex-col bg-transparent">
            <Star className="h-6 w-6 mb-2" />
            <span>Book Again</span>
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{bookingData.packageTitle}</h3>
                <p className="text-gray-600">by {bookingData.agencyName}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Travel Date</p>
                    <p className="text-sm text-gray-600">
                      {new Date(bookingData.travelDetails.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Travelers</p>
                    <p className="text-sm text-gray-600">{bookingData.travelDetails.travelers} person(s)</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm text-gray-600">{bookingData.travelDetails.duration}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Payment Successful</p>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Paid
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span className="font-bold">₹{bookingData.paymentDetails.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Payment Method:</span>
                  <span>{bookingData.paymentDetails.method}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Transaction ID:</span>
                  <span>{bookingData.paymentDetails.paymentId}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Payment Date:</span>
                  <span>{new Date(bookingData.paymentDetails.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer & Agency Info */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{bookingData.customerDetails.name}</p>
                  <p className="text-sm text-gray-600">Primary Traveler</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{bookingData.customerDetails.email}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-600">Email confirmation</p>
                    {emailSent && <CheckCircle className="h-4 w-4 text-green-600" />}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{bookingData.customerDetails.phone}</p>
                  <p className="text-sm text-gray-600">Contact Number</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-lg">{bookingData.agencyName}</p>
                <p className="text-sm text-gray-600">Travel Agency</p>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{bookingData.agencyContact.phone}</p>
                  <p className="text-sm text-gray-600">24/7 Support</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <p className="font-medium">{bookingData.agencyContact.email}</p>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <p className="font-medium">{bookingData.agencyContact.address}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Information */}
        <Card>
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Before You Travel</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Please carry a valid ID proof during travel</li>
                <li>• Contact the agency 24 hours before departure for final confirmation</li>
                <li>• Check weather conditions and pack accordingly</li>
                <li>• Keep your booking confirmation handy</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Cancellation Policy</h4>
              <p className="text-sm text-yellow-700">
                Cancellation charges may apply as per the agency's policy. Please contact the agency directly for
                cancellation requests.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="text-center space-y-4">
          <p className="text-gray-600">Thank you for choosing TravelLink! We hope you have an amazing trip.</p>
          <Button onClick={onNewBooking} size="lg">
            Plan Another Trip
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmation
