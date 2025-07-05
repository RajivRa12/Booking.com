"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Lock, Shield, CheckCircle, Loader2, ArrowLeft } from "lucide-react"

interface PaymentGatewayProps {
  bookingData: {
    packageId: string
    packageTitle: string
    agencyName: string
    totalAmount: number
    travelers: number
    travelDate: string
    customerName: string
    customerEmail: string
    customerPhone: string
  }
  onPaymentSuccess: (paymentData: any) => void
  onBack: () => void
}

const PaymentGateway = ({ bookingData, onPaymentSuccess, onBack }: PaymentGatewayProps) => {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [processing, setProcessing] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const [billingAddress, setBillingAddress] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
  })
  const { toast } = useToast()

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const handleCardInputChange = (field: string, value: string) => {
    let formattedValue = value

    if (field === "number") {
      formattedValue = formatCardNumber(value)
    } else if (field === "expiry") {
      formattedValue = formatExpiry(value)
    } else if (field === "cvv") {
      formattedValue = value.replace(/[^0-9]/g, "").substring(0, 3)
    }

    setCardDetails((prev) => ({
      ...prev,
      [field]: formattedValue,
    }))
  }

  const validateCardDetails = () => {
    const { number, expiry, cvv, name } = cardDetails

    if (!name.trim()) {
      toast({
        title: "Invalid Card Details",
        description: "Please enter cardholder name",
        variant: "destructive",
      })
      return false
    }

    if (number.replace(/\s/g, "").length < 16) {
      toast({
        title: "Invalid Card Details",
        description: "Please enter a valid card number",
        variant: "destructive",
      })
      return false
    }

    if (expiry.length !== 5) {
      toast({
        title: "Invalid Card Details",
        description: "Please enter a valid expiry date",
        variant: "destructive",
      })
      return false
    }

    if (cvv.length < 3) {
      toast({
        title: "Invalid Card Details",
        description: "Please enter a valid CVV",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const processPayment = async () => {
    if (!validateCardDetails()) return

    setProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate payment success/failure (90% success rate)
      const isSuccess = Math.random() > 0.1

      if (isSuccess) {
        const paymentData = {
          paymentId: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          amount: bookingData.totalAmount,
          currency: "INR",
          status: "succeeded",
          paymentMethod: "card",
          transactionId: `txn_${Date.now()}`,
          timestamp: new Date().toISOString(),
        }

        toast({
          title: "Payment Successful!",
          description: "Your booking has been confirmed.",
        })

        onPaymentSuccess(paymentData)
      } else {
        throw new Error("Payment failed")
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const calculateTaxes = () => {
    const baseAmount = bookingData.totalAmount
    const gst = baseAmount * 0.18 // 18% GST
    const serviceFee = baseAmount * 0.02 // 2% service fee
    return { gst, serviceFee, total: baseAmount + gst + serviceFee }
  }

  const { gst, serviceFee, total } = calculateTaxes()

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Booking
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{bookingData.packageTitle}</h3>
                <p className="text-gray-600">by {bookingData.agencyName}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Travel Date:</span>
                  <span className="font-medium">{new Date(bookingData.travelDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Travelers:</span>
                  <span className="font-medium">{bookingData.travelers} person(s)</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-medium">{bookingData.customerName}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Package Cost:</span>
                  <span>₹{bookingData.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>GST (18%):</span>
                  <span>₹{gst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Service Fee (2%):</span>
                  <span>₹{serviceFee.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount:</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center text-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">Secure payment protected by SSL encryption</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <Label className="text-base font-medium">Payment Method</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button
                    variant={paymentMethod === "card" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPaymentMethod("card")}
                  >
                    Card
                  </Button>
                  <Button
                    variant={paymentMethod === "upi" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPaymentMethod("upi")}
                  >
                    UPI
                  </Button>
                  <Button
                    variant={paymentMethod === "netbanking" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPaymentMethod("netbanking")}
                  >
                    Net Banking
                  </Button>
                </div>
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="Enter name as on card"
                      value={cardDetails.name}
                      onChange={(e) => handleCardInputChange("name", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => handleCardInputChange("number", e.target.value)}
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => handleCardInputChange("expiry", e.target.value)}
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => handleCardInputChange("cvv", e.target.value)}
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input id="upiId" placeholder="yourname@paytm" type="email" />
                </div>
              )}

              {paymentMethod === "netbanking" && (
                <div>
                  <Label htmlFor="bank">Select Bank</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Choose your bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                  </select>
                </div>
              )}

              {/* Billing Address */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Billing Address</Label>
                <div className="grid grid-cols-1 gap-4">
                  <Input
                    placeholder="Address"
                    value={billingAddress.address}
                    onChange={(e) => setBillingAddress((prev) => ({ ...prev, address: e.target.value }))}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="City"
                      value={billingAddress.city}
                      onChange={(e) => setBillingAddress((prev) => ({ ...prev, city: e.target.value }))}
                    />
                    <Input
                      placeholder="State"
                      value={billingAddress.state}
                      onChange={(e) => setBillingAddress((prev) => ({ ...prev, state: e.target.value }))}
                    />
                  </div>
                  <Input
                    placeholder="PIN Code"
                    value={billingAddress.pincode}
                    onChange={(e) => setBillingAddress((prev) => ({ ...prev, pincode: e.target.value }))}
                  />
                </div>
              </div>

              {/* Security Info */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center text-blue-700">
                  <Lock className="h-4 w-4 mr-2" />
                  <span className="text-sm">Your payment information is encrypted and secure</span>
                </div>
              </div>

              {/* Pay Button */}
              <Button size="lg" className="w-full" onClick={processPayment} disabled={processing}>
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Pay ₹{total.toLocaleString()}
                  </>
                )}
              </Button>

              <div className="text-center text-xs text-gray-500">
                By proceeding, you agree to our Terms & Conditions and Privacy Policy
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PaymentGateway
