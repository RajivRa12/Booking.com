"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { Search, MapPin, Star, Calendar, Download, MessageCircle, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Package } from "lucide-react" // Import Package component

interface Agent {
  id: string
  company_name: string
  location: string
  rating: number
  review_count: number
  verified: boolean
  specialties: string[]
  active_itineraries: number
}

interface Itinerary {
  id: string
  title: string
  destination: string
  price_per_person: number
  duration_days: number
  duration_nights: number
  agent_name: string
  agent_id: string
  rating: number
  description: string
  category: string
}

const CustomerDashboard = () => {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [activeTab, setActiveTab] = useState<"itineraries" | "agents">("itineraries")
  const [showContactForm, setShowContactForm] = useState(false)
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null)
  const [contactForm, setContactForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    message: "",
    travel_date: "",
    group_size: "2",
  })

  const [agents] = useState<Agent[]>([
    {
      id: "1",
      company_name: "Mountain Explorers",
      location: "Manali, HP",
      rating: 4.7,
      review_count: 128,
      verified: true,
      specialties: ["Adventure", "Trekking", "Mountain Tours"],
      active_itineraries: 8,
    },
    {
      id: "2",
      company_name: "Coastal Travels",
      location: "Goa",
      rating: 4.5,
      review_count: 95,
      verified: true,
      specialties: ["Beach", "Water Sports", "Nightlife"],
      active_itineraries: 12,
    },
    {
      id: "3",
      company_name: "Desert Safaris",
      location: "Jaisalmer, RJ",
      rating: 4.8,
      review_count: 156,
      verified: true,
      specialties: ["Desert", "Cultural", "Heritage"],
      active_itineraries: 6,
    },
  ])

  const [itineraries] = useState<Itinerary[]>([
    {
      id: "1",
      title: "Manali Adventure Package",
      destination: "Manali, Himachal Pradesh",
      price_per_person: 15000,
      duration_days: 5,
      duration_nights: 4,
      agent_name: "Mountain Explorers",
      agent_id: "1",
      rating: 4.7,
      description: "Experience thrilling adventures in the beautiful mountains of Manali",
      category: "Adventure",
    },
    {
      id: "2",
      title: "Goa Beach Holiday",
      destination: "Goa",
      price_per_person: 12000,
      duration_days: 4,
      duration_nights: 3,
      agent_name: "Coastal Travels",
      agent_id: "2",
      rating: 4.5,
      description: "Relax on pristine beaches and enjoy water sports",
      category: "Beach",
    },
    {
      id: "3",
      title: "Rajasthan Royal Heritage",
      destination: "Jaisalmer, Rajasthan",
      price_per_person: 25000,
      duration_days: 7,
      duration_nights: 6,
      agent_name: "Desert Safaris",
      agent_id: "3",
      rating: 4.8,
      description: "Explore the royal heritage and desert landscapes",
      category: "Cultural",
    },
    {
      id: "4",
      title: "Kerala Backwaters",
      destination: "Alleppey, Kerala",
      price_per_person: 18000,
      duration_days: 6,
      duration_nights: 5,
      agent_name: "Coastal Travels",
      agent_id: "2",
      rating: 4.6,
      description: "Cruise through serene backwaters and lush landscapes",
      category: "Nature",
    },
  ])

  const filteredItineraries = itineraries.filter((itinerary) => {
    const matchesSearch =
      itinerary.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itinerary.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itinerary.agent_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || itinerary.category === selectedCategory
    const matchesLocation = selectedLocation === "all" || itinerary.destination.includes(selectedLocation)

    return matchesSearch && matchesCategory && matchesLocation
  })

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLocation = selectedLocation === "all" || agent.location.includes(selectedLocation)

    return matchesSearch && matchesLocation
  })

  const handleContactAgent = (itinerary: Itinerary) => {
    setSelectedItinerary(itinerary)
    setShowContactForm(true)
  }

  const handleSubmitContact = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error("Please fill in all required fields")
      return
    }

    // Save lead to localStorage (mock database)
    const lead = {
      id: Date.now().toString(),
      itinerary_id: selectedItinerary?.id,
      itinerary_title: selectedItinerary?.title,
      agent_id: selectedItinerary?.agent_id,
      customer_name: contactForm.name,
      customer_email: contactForm.email,
      customer_phone: contactForm.phone,
      message: contactForm.message,
      travel_date: contactForm.travel_date,
      group_size: contactForm.group_size,
      created_at: new Date().toISOString(),
      status: "new",
    }

    const existingLeads = JSON.parse(localStorage.getItem("leads") || "[]")
    existingLeads.push(lead)
    localStorage.setItem("leads", JSON.stringify(existingLeads))

    toast.success("Your inquiry has been sent to the agent!")
    setShowContactForm(false)
    setContactForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      message: "",
      travel_date: "",
      group_size: "2",
    })
  }

  const handleWhatsAppContact = (itinerary: Itinerary) => {
    const message = `Hi! I'm interested in your "${itinerary.title}" package. Could you please provide more details?`
    const whatsappUrl = `https://wa.me/918438327763?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const downloadItineraryPDF = async (itinerary: Itinerary) => {
    try {
      // Dynamic import of jsPDF
      const { jsPDF } = await import("jspdf")

      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.width
      const margin = 20
      let yPosition = 30

      // Helper function to add text with word wrapping
      const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize = 12) => {
        doc.setFontSize(fontSize)
        const lines = doc.splitTextToSize(text, maxWidth)
        doc.text(lines, x, y)
        return y + lines.length * fontSize * 0.4
      }

      // Header with company branding
      doc.setFillColor(59, 130, 246) // Blue background
      doc.rect(0, 0, pageWidth, 25, "F")

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(20)
      doc.setFont(undefined, "bold")
      doc.text("Travel Itinerary", margin, 18)

      doc.setTextColor(0, 0, 0)
      yPosition = 40

      // Itinerary Title
      doc.setFontSize(18)
      doc.setFont(undefined, "bold")
      yPosition = addWrappedText(itinerary.title, margin, yPosition, pageWidth - 2 * margin, 18)
      yPosition += 10

      // Destination
      doc.setFontSize(14)
      doc.setFont(undefined, "normal")
      doc.setTextColor(100, 100, 100)
      yPosition = addWrappedText(`📍 ${itinerary.destination}`, margin, yPosition, pageWidth - 2 * margin, 14)
      yPosition += 15

      // Key Details Box
      doc.setDrawColor(200, 200, 200)
      doc.setFillColor(248, 250, 252)
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 40, "FD")

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(12)
      doc.setFont(undefined, "bold")

      // Duration and Price in columns
      doc.text("Duration:", margin + 10, yPosition + 15)
      doc.text("Price:", margin + 100, yPosition + 15)
      doc.text("Agent:", margin + 10, yPosition + 30)
      doc.text("Category:", margin + 100, yPosition + 30)

      doc.setFont(undefined, "normal")
      doc.text(`${itinerary.duration_days} Days / ${itinerary.duration_nights} Nights`, margin + 40, yPosition + 15)
      doc.text(`₹${itinerary.price_per_person.toLocaleString()} per person`, margin + 125, yPosition + 15)
      doc.text(itinerary.agent_name, margin + 35, yPosition + 30)
      doc.text(itinerary.category, margin + 135, yPosition + 30)

      yPosition += 55

      // Description Section
      doc.setFontSize(14)
      doc.setFont(undefined, "bold")
      doc.text("Package Description", margin, yPosition)
      yPosition += 10

      doc.setFontSize(11)
      doc.setFont(undefined, "normal")
      yPosition = addWrappedText(itinerary.description, margin, yPosition, pageWidth - 2 * margin, 11)
      yPosition += 15

      // Sample Inclusions (since we don't have inclusions in the current interface)
      const sampleInclusions = [
        "✓ Accommodation in premium hotels",
        "✓ Daily breakfast and dinner",
        "✓ All transfers and transportation",
        "✓ Professional tour guide",
        "✓ All entry fees and permits",
        "✓ Travel insurance coverage",
      ]

      doc.setFontSize(14)
      doc.setFont(undefined, "bold")
      doc.text("Package Inclusions", margin, yPosition)
      yPosition += 10

      doc.setFontSize(11)
      doc.setFont(undefined, "normal")
      sampleInclusions.forEach((inclusion) => {
        doc.text(inclusion, margin, yPosition)
        yPosition += 8
      })
      yPosition += 10

      // Sample Itinerary Schedule
      const sampleSchedule = [
        { day: "Day 1", activity: "Arrival and check-in, welcome dinner" },
        { day: "Day 2", activity: "City tour and local sightseeing" },
        { day: "Day 3", activity: "Adventure activities and cultural experiences" },
        { day: "Day 4", activity: "Free time for shopping and relaxation" },
        { day: "Day 5", activity: "Departure and check-out" },
      ]

      if (yPosition > 200) {
        doc.addPage()
        yPosition = 30
      }

      doc.setFontSize(14)
      doc.setFont(undefined, "bold")
      doc.text("Day-wise Itinerary", margin, yPosition)
      yPosition += 15

      sampleSchedule.slice(0, itinerary.duration_days).forEach((item) => {
        doc.setFontSize(12)
        doc.setFont(undefined, "bold")
        doc.text(item.day, margin, yPosition)

        doc.setFont(undefined, "normal")
        yPosition = addWrappedText(item.activity, margin + 40, yPosition, pageWidth - 2 * margin - 40, 12)
        yPosition += 5
      })

      yPosition += 15

      // Terms and Conditions
      if (yPosition > 220) {
        doc.addPage()
        yPosition = 30
      }

      doc.setFontSize(14)
      doc.setFont(undefined, "bold")
      doc.text("Terms & Conditions", margin, yPosition)
      yPosition += 10

      const terms = [
        "• Booking confirmation required 48 hours in advance",
        "• Cancellation charges apply as per policy",
        "• Travel insurance is mandatory for all participants",
        "• Valid ID proof required for all travelers",
        "• Package rates subject to change without notice",
        "• Weather conditions may affect itinerary",
      ]

      doc.setFontSize(10)
      doc.setFont(undefined, "normal")
      terms.forEach((term) => {
        yPosition = addWrappedText(term, margin, yPosition, pageWidth - 2 * margin, 10)
        yPosition += 3
      })

      // Footer
      const footerY = doc.internal.pageSize.height - 30
      doc.setDrawColor(200, 200, 200)
      doc.line(margin, footerY, pageWidth - margin, footerY)

      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text("Generated by Travel Agent Marketplace", margin, footerY + 10)
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, footerY + 20)
      doc.text("For bookings, contact the agent directly", pageWidth - margin - 80, footerY + 10)

      // Save the PDF
      const fileName = `${itinerary.title.replace(/[^a-zA-Z0-9]/g, "_")}_Itinerary.pdf`
      doc.save(fileName)

      toast.success("PDF downloaded successfully!")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Failed to generate PDF. Please try again.")
    }
  }

  const visitAgentProfile = (agentId: string, agentName: string) => {
    // Mock agent profile page
    const profileUrl = `/agents/${agentName.toLowerCase().replace(/\s+/g, "-")}`
    toast.success(`Visiting agent profile: ${profileUrl} (This is a demo)`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Discover Amazing Travel Experiences</h1>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search destinations, agents, or experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Adventure">Adventure</SelectItem>
                <SelectItem value="Beach">Beach</SelectItem>
                <SelectItem value="Cultural">Cultural</SelectItem>
                <SelectItem value="Nature">Nature</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Himachal">Himachal Pradesh</SelectItem>
                <SelectItem value="Goa">Goa</SelectItem>
                <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                <SelectItem value="Kerala">Kerala</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex space-x-8">
            {["itineraries", "agents"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-3 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Itineraries Tab */}
        {activeTab === "itineraries" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{filteredItineraries.length} Itineraries Found</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItineraries.map((itinerary) => (
                <Card key={itinerary.id} className="hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-white" />
                    </div>
                    <Badge className="absolute top-3 left-3 bg-white text-gray-800">{itinerary.category}</Badge>
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg mb-1">{itinerary.title}</h3>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {itinerary.destination}
                      </p>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{itinerary.description}</p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {itinerary.duration_days}D/{itinerary.duration_nights}N
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{itinerary.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">₹{itinerary.price_per_person}</div>
                        <div className="text-xs text-gray-500">per person</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{itinerary.agent_name}</div>
                        <div className="text-xs text-gray-500">Travel Agent</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1" onClick={() => handleContactAgent(itinerary)}>
                        Connect with Agent
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWhatsAppContact(itinerary)}
                        className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => downloadItineraryPDF(itinerary)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === "agents" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{filteredAgents.length} Travel Agents Found</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.map((agent) => (
                <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-lg">{agent.company_name}</h3>
                          {agent.verified && <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>}
                        </div>
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {agent.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{agent.rating}</span>
                        <span className="text-gray-500">({agent.review_count})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4 text-blue-500" />
                        <span>{agent.active_itineraries} packages</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {agent.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => visitAgentProfile(agent.id, agent.company_name)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const message = `Hi! I'm interested in your travel packages. Could you please share more details?`
                          const whatsappUrl = `https://wa.me/918438327763?text=${encodeURIComponent(message)}`
                          window.open(whatsappUrl, "_blank")
                        }}
                        className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contact Form Dialog */}
      <Dialog open={showContactForm} onOpenChange={setShowContactForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect with Agent</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedItinerary && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium">{selectedItinerary.title}</h4>
                <p className="text-sm text-gray-600">{selectedItinerary.destination}</p>
                <p className="text-sm text-gray-600">by {selectedItinerary.agent_name}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact-name">Name *</Label>
                <Input
                  id="contact-name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label htmlFor="contact-email">Email *</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="Your email"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact-phone">Phone</Label>
                <Input
                  id="contact-phone"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  placeholder="Your phone number"
                />
              </div>
              <div>
                <Label htmlFor="group-size">Group Size</Label>
                <Select
                  value={contactForm.group_size}
                  onValueChange={(value) => setContactForm({ ...contactForm, group_size: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Person</SelectItem>
                    <SelectItem value="2">2 People</SelectItem>
                    <SelectItem value="3">3 People</SelectItem>
                    <SelectItem value="4">4 People</SelectItem>
                    <SelectItem value="5+">5+ People</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="travel-date">Preferred Travel Date</Label>
              <Input
                id="travel-date"
                type="date"
                value={contactForm.travel_date}
                onChange={(e) => setContactForm({ ...contactForm, travel_date: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="contact-message">Message *</Label>
              <Textarea
                id="contact-message"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Tell us about your travel preferences, budget, or any special requirements..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowContactForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitContact}>Send Inquiry</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CustomerDashboard
