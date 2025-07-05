"use client"

import { useState } from "react"
import PaymentGateway from "./PaymentGateway"
import BookingConfirmation from "./BookingConfirmation"
import { useToast } from "@/hooks/use-toast"

interface BookingFlowProps {
  packageData: any
  onBack: () => void
  onComplete: () => void
}

const BookingFlow = ({ packageData, onBack, onComplete }: BookingFlowProps) => {
  const [currentStep, setCurrentStep] = useState<"payment" | "confirmation">("payment")
  const [bookingData, setBookingData] = useState<any>(null)
  const { toast } = useToast()

  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      // Create booking record
      const bookingId = `booking_${Date.now()}`
      const confirmationNumber = `TL${new Date().getFullYear()}${String(Date.now()).slice(-6)}`

      const newBookingData = {
        id: bookingId,
        confirmationNumber,
        packageTitle: packageData.title || "Adventure Package",
        agencyName: packageData.agencyName || "Mountain Explorers",
        agencyContact: {
          phone: "+91 8438327763",
          email: "info@mountainexplorers.com",
          address: "123 Mall Road, Manali, Himachal Pradesh",
        },
        customerDetails: {
          name: packageData.customerName || "John Doe",
          email: packageData.customerEmail || "john@example.com",
          phone: packageData.customerPhone || "+91 9876543210",
        },
        travelDetails: {
          date: packageData.travelDate || new Date().toISOString(),
          travelers: packageData.travelers || 2,
          duration: "5 Days / 4 Nights",
        },
        paymentDetails: {
          amount: paymentData.amount,
          paymentId: paymentData.paymentId,
          method: paymentData.paymentMethod,
          timestamp: paymentData.timestamp,
        },
        itinerary: [
          {
            day: 1,
            title: "Arrival in Manali",
            description: "Arrive in Manali, check into hotel. Evening visit to Mall Road and local markets.",
          },
          {
            day: 2,
            title: "Adventure Activities",
            description: "Morning river rafting in Beas River. Afternoon paragliding session.",
          },
          {
            day: 3,
            title: "Solang Valley Excursion",
            description: "Full day trip to Solang Valley. Cable car ride and snow activities.",
          },
          {
            day: 4,
            title: "Cultural Experience",
            description: "Visit to Hadimba Temple and local villages. Cultural show in the evening.",
          },
          {
            day: 5,
            title: "Departure",
            description: "Morning at leisure for shopping. Check out and departure.",
          },
        ],
      }

      setBookingData(newBookingData)
      setCurrentStep("confirmation")

      // Here you would typically save to database
      console.log("Booking created:", newBookingData)
    } catch (error) {
      toast({
        title: "Booking Error",
        description: "Failed to create booking. Please contact support.",
        variant: "destructive",
      })
    }
  }

  const handleNewBooking = () => {
    onComplete()
  }

  if (currentStep === "payment") {
    return (
      <PaymentGateway
        bookingData={{
          packageId: packageData.id || "pkg_001",
          packageTitle: packageData.title || "Adventure Package",
          agencyName: packageData.agencyName || "Mountain Explorers",
          totalAmount: packageData.price || 15999,
          travelers: packageData.travelers || 2,
          travelDate: packageData.travelDate || new Date().toISOString(),
          customerName: packageData.customerName || "John Doe",
          customerEmail: packageData.customerEmail || "john@example.com",
          customerPhone: packageData.customerPhone || "+91 9876543210",
        }}
        onPaymentSuccess={handlePaymentSuccess}
        onBack={onBack}
      />
    )
  }

  return <BookingConfirmation bookingData={bookingData} onNewBooking={handleNewBooking} />
}

export default BookingFlow
