"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  Calendar, 
  Users, 
  Package,
  MessageCircle,
  ArrowLeft,
  CheckCircle,
  Clock
} from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

interface Itinerary {
  id: string
  title: string
  description: string
  destination: string
  duration_days: number
  duration_nights: number
  price_per_person: number
  category: string
  active: boolean
  created_at: string
  rating: number
  total_inquiries: number
}

interface AgentData {
  id: string
  name: string
  company_name: string
  contact_phone: string
  contact_email: string
  website_url?: string
  location: string
  license_number: string
  verified: boolean
  rating: number
  total_trips: number
  experience_years: number
  description: string
  specialties: string[]
}

const AgentProfilePage = () => {
  const { agentName } = useParams<{ agentName: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("packages")
  const [agent, setAgent] = useState<AgentData | null>(null)
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - in real app, this would fetch from API based on agentName
    const mockAgents: Record<string, AgentData> = {
      "mountain-explorers": {
        id: "1",
        name: "Raj Kumar",
        company_name: "Mountain Explorers",
        contact_phone: "+91 8438327763",
        contact_email: "info@mountainexplorers.com",
        website_url: "www.mountainexplorers.com",
        location: "Manali, Himachal Pradesh",
        license_number: "HP-TL-2014-001",
        verified: true,
        rating: 4.8,
        total_trips: 1250,
        experience_years: 8,
        description: "We are a leading travel agency specializing in adventure tourism and cultural experiences in the beautiful Himalayas. With over 8 years of experience, we've helped thousands of travelers create unforgettable memories.",
        specialties: ["Adventure Tourism", "Cultural Tours", "Mountain Trekking", "River Rafting", "Paragliding"]
      },
      "kerala-dreams": {
        id: "2",
        name: "Priya Menon",
        company_name: "Kerala Dreams",
        contact_phone: "+91 9876543210",
        contact_email: "hello@keraladreams.com",
        website_url: "www.keraladreams.com",
        location: "Kochi, Kerala",
        license_number: "KL-TL-2016-002",
        verified: true,
        rating: 4.9,
        total_trips: 890,
        experience_years: 6,
        description: "Discover the magic of God's Own Country with our curated Kerala experiences. From backwaters to Ayurveda, we bring you authentic Kerala hospitality and unforgettable journeys.",
        specialties: ["Backwater Tours", "Ayurveda Retreats", "Cultural Heritage", "Beach Holidays", "Wildlife Safaris"]
      },
      "rajasthan-royal": {
        id: "3",
        name: "Amit Singh",
        company_name: "Rajasthan Royal Tours",
        contact_phone: "+91 8765432109",
        contact_email: "info@rajasthanroyal.com",
        website_url: "www.rajasthanroyal.com",
        location: "Jaipur, Rajasthan",
        license_number: "RJ-TL-2012-003",
        verified: true,
        rating: 4.7,
        total_trips: 2100,
        experience_years: 12,
        description: "Experience the royal heritage of Rajasthan with our luxury tours. From majestic palaces to desert adventures, we offer the finest Rajasthan experiences with personalized service.",
        specialties: ["Luxury Tours", "Palace Stays", "Desert Safaris", "Heritage Walks", "Cultural Festivals"]
      },
      "goa-paradise": {
        id: "4",
        name: "Maria Fernandes",
        company_name: "Goa Paradise",
        contact_phone: "+91 7654321098",
        contact_email: "contact@goaparadise.com",
        website_url: "www.goaparadise.com",
        location: "Panaji, Goa",
        license_number: "GA-TL-2018-004",
        verified: true,
        rating: 4.6,
        total_trips: 650,
        experience_years: 4,
        description: "Your gateway to the perfect Goan holiday! From pristine beaches to vibrant nightlife, we offer the best of Goa with local expertise and authentic experiences.",
        specialties: ["Beach Holidays", "Water Sports", "Nightlife Tours", "Spice Plantations", "Church Heritage"]
      },
      "ladakh-adventures": {
        id: "5",
        name: "Tenzin Dorje",
        company_name: "Ladakh Adventures",
        contact_phone: "+91 6543210987",
        contact_email: "info@ladakhadventures.com",
        website_url: "www.ladakhadventures.com",
        location: "Leh, Ladakh",
        license_number: "LA-TL-2015-005",
        verified: true,
        rating: 4.9,
        total_trips: 450,
        experience_years: 7,
        description: "Explore the mystical land of Ladakh with our adventure tours. From high-altitude treks to monastery visits, experience the raw beauty of the Himalayas with local expertise.",
        specialties: ["High Altitude Trekking", "Monastery Tours", "Mountain Biking", "Photography Tours", "Cultural Immersion"]
      }
    };

    const mockItineraries: Record<string, Itinerary[]> = {
      "mountain-explorers": [
        {
          id: "1",
          title: "Manali Adventure Package",
          description: "Experience thrilling adventures including river rafting, paragliding, and mountain trekking in the beautiful mountains of Manali.",
          destination: "Manali, Himachal Pradesh",
          duration_days: 5,
          duration_nights: 4,
          price_per_person: 15000,
          category: "Adventure",
          active: true,
          created_at: "2024-01-15",
          rating: 4.7,
          total_inquiries: 23,
        },
        {
          id: "2",
          title: "Spiti Valley Expedition",
          description: "Explore the remote and mystical Spiti Valley with its ancient monasteries and stunning landscapes.",
          destination: "Spiti Valley, HP",
          duration_days: 8,
          duration_nights: 7,
          price_per_person: 28000,
          category: "Adventure",
          active: true,
          created_at: "2024-02-01",
          rating: 4.8,
          total_inquiries: 15,
        },
        {
          id: "3",
          title: "Kullu Valley Cultural Tour",
          description: "Immerse yourself in local culture, visit traditional villages, and experience Himachali hospitality.",
          destination: "Kullu, Himachal Pradesh",
          duration_days: 4,
          duration_nights: 3,
          price_per_person: 12000,
          category: "Cultural",
          active: true,
          created_at: "2024-01-20",
          rating: 4.5,
          total_inquiries: 8,
        },
      ],
      "kerala-dreams": [
        {
          id: "4",
          title: "Kerala Backwaters Experience",
          description: "Cruise through the serene backwaters of Kerala on traditional houseboats with authentic local cuisine.",
          destination: "Alleppey, Kerala",
          duration_days: 3,
          duration_nights: 2,
          price_per_person: 18000,
          category: "Cultural",
          active: true,
          created_at: "2024-01-10",
          rating: 4.9,
          total_inquiries: 31,
        },
        {
          id: "5",
          title: "Ayurveda Wellness Retreat",
          description: "Rejuvenate your mind and body with traditional Ayurvedic treatments in the lap of nature.",
          destination: "Kovalam, Kerala",
          duration_days: 7,
          duration_nights: 6,
          price_per_person: 35000,
          category: "Wellness",
          active: true,
          created_at: "2024-02-05",
          rating: 4.8,
          total_inquiries: 12,
        },
        {
          id: "6",
          title: "Munnar Tea Gardens Tour",
          description: "Explore the picturesque tea gardens of Munnar with guided tours and nature walks.",
          destination: "Munnar, Kerala",
          duration_days: 4,
          duration_nights: 3,
          price_per_person: 22000,
          category: "Nature",
          active: true,
          created_at: "2024-01-25",
          rating: 4.6,
          total_inquiries: 18,
        },
      ],
      "rajasthan-royal": [
        {
          id: "7",
          title: "Golden Triangle Luxury Tour",
          description: "Experience the best of Delhi, Agra, and Jaipur with luxury accommodations and royal treatment.",
          destination: "Delhi-Agra-Jaipur",
          duration_days: 6,
          duration_nights: 5,
          price_per_person: 45000,
          category: "Luxury",
          active: true,
          created_at: "2024-01-12",
          rating: 4.7,
          total_inquiries: 25,
        },
        {
          id: "8",
          title: "Jaisalmer Desert Safari",
          description: "Experience the magic of the Thar Desert with camel safaris, folk music, and luxury tent stays.",
          destination: "Jaisalmer, Rajasthan",
          duration_days: 3,
          duration_nights: 2,
          price_per_person: 25000,
          category: "Adventure",
          active: true,
          created_at: "2024-02-08",
          rating: 4.8,
          total_inquiries: 19,
        },
        {
          id: "9",
          title: "Udaipur Palace Experience",
          description: "Stay in heritage palaces and explore the romantic city of lakes with boat rides and cultural shows.",
          destination: "Udaipur, Rajasthan",
          duration_days: 4,
          duration_nights: 3,
          price_per_person: 32000,
          category: "Luxury",
          active: true,
          created_at: "2024-01-18",
          rating: 4.9,
          total_inquiries: 22,
        },
      ],
      "goa-paradise": [
        {
          id: "10",
          title: "Goa Beach Holiday Package",
          description: "Relax on pristine beaches, enjoy water sports, and experience Goan nightlife and cuisine.",
          destination: "North & South Goa",
          duration_days: 5,
          duration_nights: 4,
          price_per_person: 28000,
          category: "Beach",
          active: true,
          created_at: "2024-01-20",
          rating: 4.6,
          total_inquiries: 35,
        },
        {
          id: "11",
          title: "Goa Heritage & Spice Tour",
          description: "Explore Old Goa churches, spice plantations, and Portuguese heritage with guided tours.",
          destination: "Old Goa & Spice Plantations",
          duration_days: 3,
          duration_nights: 2,
          price_per_person: 15000,
          category: "Cultural",
          active: true,
          created_at: "2024-02-10",
          rating: 4.5,
          total_inquiries: 14,
        },
        {
          id: "12",
          title: "Goa Adventure & Water Sports",
          description: "Thrilling water sports, parasailing, jet skiing, and adventure activities on Goa's beaches.",
          destination: "Calangute & Baga, Goa",
          duration_days: 4,
          duration_nights: 3,
          price_per_person: 22000,
          category: "Adventure",
          active: true,
          created_at: "2024-01-28",
          rating: 4.7,
          total_inquiries: 28,
        },
      ],
      "ladakh-adventures": [
        {
          id: "13",
          title: "Ladakh Monastery Circuit",
          description: "Visit ancient monasteries, experience Buddhist culture, and explore the spiritual side of Ladakh.",
          destination: "Leh & Surrounding Monasteries",
          duration_days: 6,
          duration_nights: 5,
          price_per_person: 38000,
          category: "Cultural",
          active: true,
          created_at: "2024-01-15",
          rating: 4.9,
          total_inquiries: 16,
        },
        {
          id: "14",
          title: "Khardungla Pass Trek",
          description: "Trek to the world's highest motorable pass with stunning views of the Karakoram range.",
          destination: "Khardungla Pass, Ladakh",
          duration_days: 4,
          duration_nights: 3,
          price_per_person: 25000,
          category: "Adventure",
          active: true,
          created_at: "2024-02-12",
          rating: 4.8,
          total_inquiries: 11,
        },
        {
          id: "15",
          title: "Pangong Lake Photography Tour",
          description: "Capture the stunning beauty of Pangong Lake with professional photography guidance.",
          destination: "Pangong Lake, Ladakh",
          duration_days: 3,
          duration_nights: 2,
          price_per_person: 20000,
          category: "Photography",
          active: true,
          created_at: "2024-01-30",
          rating: 4.9,
          total_inquiries: 9,
        },
      ]
    };

    const selectedAgent = mockAgents[agentName || "mountain-explorers"];
    const selectedItineraries = mockItineraries[agentName || "mountain-explorers"] || [];

    setAgent(selectedAgent);
    setItineraries(selectedItineraries.filter(i => i.active));
    setLoading(false);
  }, [agentName])

  const handleContactAgent = () => {
    if (agent) {
      const message = `Hi ${agent.name}! I'm interested in your travel packages. Could you please provide more information?`
      const whatsappUrl = `https://wa.me/${agent.contact_phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")
    }
  }

  const handleInquirePackage = (itinerary: Itinerary) => {
    // Store inquiry in localStorage (in real app, this would go to backend)
    const inquiry = {
      id: Date.now().toString(),
      agent_id: agent?.id,
      agent_name: agent?.company_name,
      itinerary_id: itinerary.id,
      itinerary_title: itinerary.title,
      customer_name: "Anonymous",
      customer_email: "",
      customer_phone: "",
      message: `I'm interested in the ${itinerary.title} package.`,
      travel_date: "",
      group_size: "2",
      created_at: new Date().toISOString(),
      status: "new"
    }

    const existingLeads = JSON.parse(localStorage.getItem("leads") || "[]")
    localStorage.setItem("leads", JSON.stringify([...existingLeads, inquiry]))
    
    toast.success("Inquiry sent! The agent will contact you soon.")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading agent profile...</p>
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Agent Not Found</h2>
            <p className="text-gray-600 mb-4">The travel agent you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/")}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/")} className="flex items-center gap-2 text-sm">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleContactAgent}
                    className="bg-green-600 hover:bg-green-700 transition-transform duration-150 active:scale-95 text-sm px-3 py-2"
                  >
                    <MessageCircle className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Contact Agent</span>
                    <span className="sm:hidden">Contact</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span>Chat with agent on WhatsApp</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        {/* Agent Profile Header */}
        <Card className="mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
              {/* Agent Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{agent.company_name}</h1>
                  {agent.verified && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 w-fit">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified Agent
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4 text-sm sm:text-base">{agent.description}</p>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{agent.rating}</span>
                    <span>({agent.total_trips} trips)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{agent.experience_years} years experience</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="break-words">{agent.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="break-all">{agent.contact_phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="break-all">{agent.contact_email}</span>
                  </div>
                  {agent.website_url && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="break-all">{agent.website_url}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Card */}
              <div className="lg:w-80">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-blue-800 mb-3">Get in Touch</h3>
                    <div className="space-y-3">
                      <Button onClick={handleContactAgent} className="w-full bg-green-600 hover:bg-green-700 text-sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                      <Button variant="outline" className="w-full text-sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                      <Button variant="outline" className="w-full text-sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons Section */}
        <Card className="mb-6 sm:mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Ready to Start Your Journey?</h2>
              <p className="text-gray-600 text-sm sm:text-base">Choose how you'd like to connect with {agent.name}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={handleContactAgent}
                      className="h-14 sm:h-16 bg-green-600 hover:bg-green-700 text-white font-semibold text-base sm:text-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                    >
                      <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                      <div className="text-left">
                        <div>WhatsApp Chat</div>
                        <div className="text-xs sm:text-sm opacity-90">Instant Response</div>
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Start a conversation on WhatsApp</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline"
                      className="h-14 sm:h-16 border-blue-300 text-blue-700 hover:bg-blue-50 font-semibold text-base sm:text-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                      onClick={() => window.location.href = `mailto:${agent.contact_email}`}
                    >
                      <Mail className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                      <div className="text-left">
                        <div>Send Email</div>
                        <div className="text-xs sm:text-sm opacity-90">Detailed Inquiry</div>
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Send a detailed email inquiry</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline"
                      className="h-14 sm:h-16 border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold text-base sm:text-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl sm:col-span-2 lg:col-span-1"
                      onClick={() => window.location.href = `tel:${agent.contact_phone}`}
                    >
                      <Phone className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                      <div className="text-left">
                        <div>Call Now</div>
                        <div className="text-xs sm:text-sm opacity-90">Direct Contact</div>
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Call the agent directly</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                <Clock className="h-4 w-4 inline mr-1" />
                Response time: Usually within 2 hours
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Specialties */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">Specialties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {agent.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs sm:text-sm">
                  {specialty}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Packages */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">Travel Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 h-auto p-1">
                <TabsTrigger value="packages" className="text-xs sm:text-sm py-2">All ({itineraries.length})</TabsTrigger>
                <TabsTrigger value="adventure" className="text-xs sm:text-sm py-2">Adventure</TabsTrigger>
                <TabsTrigger value="cultural" className="text-xs sm:text-sm py-2">Cultural</TabsTrigger>
              </TabsList>

              <TabsContent value="packages" className="mt-4 sm:mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {itineraries.map((itinerary) => (
                    <Card key={itinerary.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="outline" className="text-xs">{itinerary.category}</Badge>
                          <div className="flex items-center gap-1 text-xs sm:text-sm">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{itinerary.rating}</span>
                          </div>
                        </div>
                        
                        <h3 className="font-semibold text-base sm:text-lg mb-2">{itinerary.title}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2">{itinerary.description}</p>
                        
                        <div className="space-y-2 text-xs sm:text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="break-words">{itinerary.destination}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>{itinerary.duration_days} days, {itinerary.duration_nights} nights</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>₹{itinerary.price_per_person.toLocaleString()} per person</span>
                          </div>
                        </div>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                onClick={() => handleInquirePackage(itinerary)} 
                                className="w-full text-sm py-2 transition-transform duration-150 active:scale-95"
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Inquire Now
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <span>Send inquiry to agent</span>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="adventure" className="mt-4 sm:mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {itineraries.filter(i => i.category.toLowerCase().includes('adventure')).map((itinerary) => (
                    <Card key={itinerary.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="outline" className="text-xs">{itinerary.category}</Badge>
                          <div className="flex items-center gap-1 text-xs sm:text-sm">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{itinerary.rating}</span>
                          </div>
                        </div>
                        
                        <h3 className="font-semibold text-base sm:text-lg mb-2">{itinerary.title}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2">{itinerary.description}</p>
                        
                        <div className="space-y-2 text-xs sm:text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="break-words">{itinerary.destination}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>{itinerary.duration_days} days, {itinerary.duration_nights} nights</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>₹{itinerary.price_per_person.toLocaleString()} per person</span>
                          </div>
                        </div>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                onClick={() => handleInquirePackage(itinerary)} 
                                className="w-full text-sm py-2 transition-transform duration-150 active:scale-95"
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Inquire Now
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <span>Send inquiry to agent</span>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="cultural" className="mt-4 sm:mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {itineraries.filter(i => i.category.toLowerCase().includes('cultural')).map((itinerary) => (
                    <Card key={itinerary.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="outline" className="text-xs">{itinerary.category}</Badge>
                          <div className="flex items-center gap-1 text-xs sm:text-sm">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{itinerary.rating}</span>
                          </div>
                        </div>
                        
                        <h3 className="font-semibold text-base sm:text-lg mb-2">{itinerary.title}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2">{itinerary.description}</p>
                        
                        <div className="space-y-2 text-xs sm:text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="break-words">{itinerary.destination}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>{itinerary.duration_days} days, {itinerary.duration_nights} nights</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>₹{itinerary.price_per_person.toLocaleString()} per person</span>
                          </div>
                        </div>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                onClick={() => handleInquirePackage(itinerary)} 
                                className="w-full text-sm py-2 transition-transform duration-150 active:scale-95"
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Inquire Now
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <span>Send inquiry to agent</span>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AgentProfilePage
