"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Eye, MessageCircle, Download, Calendar, MapPin, Users, Star, Package, Mail } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { downloadItineraryPDF } from "./PDFGenerator"
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

interface Lead {
  id: string
  itinerary_id: string
  itinerary_title: string
  customer_name: string
  customer_email: string
  customer_phone: string
  message: string
  travel_date: string
  group_size: string
  created_at: string
  status: "new" | "contacted" | "converted" | "closed"
}

const AgencyDashboard = () => {
  const { user, signOut, userRole } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [showItineraryForm, setShowItineraryForm] = useState(false)
  const [editingItinerary, setEditingItinerary] = useState<Itinerary | null>(null)
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [itineraryForm, setItineraryForm] = useState({
    title: "",
    description: "",
    destination: "",
    duration_days: 1,
    duration_nights: 0,
    price_per_person: 0,
    category: "",
  })

  // Check if user is verified agent
  const isVerifiedAgent = user?.verified && userRole === 'agency'

  // Show verification pending message for unverified agents
  if (userRole === 'agency' && !user?.verified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-orange-600">Verification Pending</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Account Under Review</h3>
              <p className="text-gray-600 mb-4">
                Thank you for registering as a travel agent! Your account is currently under review by our team.
                You'll be able to access the dashboard once your verification is complete.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">What happens next?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• We'll review your business details</li>
                  <li>• Verify your contact information</li>
                  <li>• Send you an email confirmation</li>
                  <li>• Grant access to the dashboard</li>
                </ul>
              </div>
            </div>
            <Button onClick={signOut} variant="outline" className="w-full">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show verification badge in header
  const VerificationBadge = () => (
    <div className="flex items-center gap-2">
      {user?.verified ? (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
          Verified Agent
        </Badge>
      ) : (
        <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-100">
          <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
          Pending Verification
        </Badge>
      )}
    </div>
  )

  // Mock agency data
  const agencyData = {
    company_name: "Mountain Explorers",
    contact_phone: "+91 8438327763",
    contact_email: "info@mountainexplorers.com",
    website_url: "www.mountainexplorers.com",
    location: "Manali, Himachal Pradesh",
    license_number: "HP-TL-2014-001",
  }

  useEffect(() => {
    // Load mock data
    const mockItineraries: Itinerary[] = [
      {
        id: "1",
        title: "Manali Adventure Package",
        description:
          "Experience thrilling adventures including river rafting, paragliding, and mountain trekking in the beautiful mountains of Manali.",
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
        description:
          "Explore the remote and mystical Spiti Valley with its ancient monasteries and stunning landscapes.",
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
        description:
          "Immerse yourself in local culture, visit traditional villages, and experience Himachali hospitality.",
        destination: "Kullu, Himachal Pradesh",
        duration_days: 4,
        duration_nights: 3,
        price_per_person: 12000,
        category: "Cultural",
        active: false,
        created_at: "2024-01-20",
        rating: 4.5,
        total_inquiries: 8,
      },
    ]

    // Load leads from localStorage
    const storedLeads = JSON.parse(localStorage.getItem("leads") || "[]")
    const agentLeads = storedLeads.filter(
      (lead: Lead) => lead.agent_id === user?.id || lead.agent_name === agencyData.company_name,
    )

    setItineraries(mockItineraries)
    setLeads(agentLeads)
  }, [user])

  const handleCreateItinerary = () => {
    if (!itineraryForm.title || !itineraryForm.destination || !itineraryForm.description) {
      toast.error("Please fill in all required fields")
      return
    }

    const newItinerary: Itinerary = {
      id: Date.now().toString(),
      ...itineraryForm,
      active: true,
      created_at: new Date().toISOString().split("T")[0],
      rating: 0,
      total_inquiries: 0,
    }

    if (editingItinerary) {
      setItineraries(
        itineraries.map((item) =>
          item.id === editingItinerary.id ? { ...newItinerary, id: editingItinerary.id } : item,
        ),
      )
      toast.success("Itinerary updated successfully!")
    } else {
      setItineraries([...itineraries, newItinerary])
      toast.success("Itinerary created successfully!")
    }

    setShowItineraryForm(false)
    setEditingItinerary(null)
    setItineraryForm({
      title: "",
      description: "",
      destination: "",
      duration_days: 1,
      duration_nights: 0,
      price_per_person: 0,
      category: "",
    })
  }

  const handleEditItinerary = (itinerary: Itinerary) => {
    setEditingItinerary(itinerary)
    setItineraryForm({
      title: itinerary.title,
      description: itinerary.description,
      destination: itinerary.destination,
      duration_days: itinerary.duration_days,
      duration_nights: itinerary.duration_nights,
      price_per_person: itinerary.price_per_person,
      category: itinerary.category,
    })
    setShowItineraryForm(true)
  }

  const toggleItineraryStatus = (id: string) => {
    setItineraries(itineraries.map((item) => (item.id === id ? { ...item, active: !item.active } : item)))
    toast.success("Itinerary status updated!")
  }

  const handleWhatsAppContact = (lead: Lead) => {
    const message = `Hi ${lead.customer_name}! Thank you for your interest in "${lead.itinerary_title}". I'd be happy to help you plan your trip. When would be a good time to discuss the details?`
    const whatsappUrl = `https://wa.me/${lead.customer_phone?.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")

    // Update lead status
    const updatedLeads = leads.map((l) => (l.id === lead.id ? { ...l, status: "contacted" as const } : l))
    setLeads(updatedLeads)
    localStorage.setItem("leads", JSON.stringify(updatedLeads))
  }

  const handleDownloadItineraryPDF = async (itinerary: Itinerary) => {
    try {
      await downloadItineraryPDF(
        {
          id: itinerary.id,
          title: itinerary.title,
          destination: itinerary.destination,
          price_per_person: itinerary.price_per_person,
          duration_days: itinerary.duration_days,
          duration_nights: itinerary.duration_nights,
          description: itinerary.description,
          category: itinerary.category,
          rating: itinerary.rating,
          agent_name: agencyData.company_name,
        },
        agencyData,
      )
      toast.success("PDF downloaded successfully!")
    } catch (error) {
      toast.error("Failed to generate PDF. Please try again.")
    }
  }

  const stats = {
    totalItineraries: itineraries.length,
    activeItineraries: itineraries.filter((i) => i.active).length,
    totalLeads: leads.length,
    newLeads: leads.filter((l) => l.status === "new").length,
    totalRevenue: leads.filter((l) => l.status === "converted").length * 15000, // Mock calculation
    avgRating: itineraries.reduce((acc, curr) => acc + curr.rating, 0) / itineraries.length || 0,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-800">{agencyData.company_name}</h1>
              <VerificationBadge />
            </div>
            <p className="text-sm text-gray-600">Travel Agent Dashboard</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={() => setShowItineraryForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Itinerary
            </Button>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Package className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalItineraries}</p>
                      <p className="text-xs text-gray-600">Total Packages</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.activeItineraries}</p>
                      <p className="text-xs text-gray-600">Active Packages</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalLeads}</p>
                      <p className="text-xs text-gray-600">Total Inquiries</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</p>
                      <p className="text-xs text-gray-600">Average Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Leads */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leads.slice(0, 5).map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{lead.customer_name}</h4>
                        <p className="text-sm text-gray-600">{lead.itinerary_title}</p>
                        <p className="text-xs text-gray-500">{new Date(lead.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={lead.status === "new" ? "default" : "secondary"}>{lead.status}</Badge>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => handleWhatsAppContact(lead)} className="border-green-500 text-green-700 hover:bg-green-50 transition-transform duration-150 active:scale-95">
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <span>Message customer on WhatsApp</span>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Itineraries Tab */}
          <TabsContent value="itineraries" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {itineraries.map((itinerary) => (
                <Card key={itinerary.id} className={`${!itinerary.active ? "opacity-60" : ""}`}>
                  <div className="relative h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Badge className="bg-white text-gray-800 text-xs">{itinerary.category}</Badge>
                      <Switch
                        checked={itinerary.active}
                        onCheckedChange={() => toggleItineraryStatus(itinerary.id)}
                        size="sm"
                      />
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{itinerary.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {itinerary.destination}
                    </p>
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
                        <div className="text-xl font-bold text-blue-600">
                          ₹{itinerary.price_per_person.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">per person</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{itinerary.total_inquiries} inquiries</div>
                        <div className="text-xs text-gray-500">total</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditItinerary(itinerary)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownloadItineraryPDF(itinerary)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="flex-1">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Travel Date</TableHead>
                      <TableHead>Group Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{lead.customer_name}</div>
                            <div className="text-sm text-gray-600">{lead.customer_email}</div>
                            <div className="text-sm text-gray-600">{lead.customer_phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{lead.itinerary_title}</div>
                        </TableCell>
                        <TableCell>{lead.travel_date || "Flexible"}</TableCell>
                        <TableCell>{lead.group_size} people</TableCell>
                        <TableCell>
                          <Badge variant={lead.status === "new" ? "default" : "secondary"}>{lead.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="sm" variant="outline" onClick={() => handleWhatsAppContact(lead)} className="border-green-500 text-green-700 hover:bg-green-50 transition-transform duration-150 active:scale-95">
                                    <MessageCircle className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <span>Message customer on WhatsApp</span>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <Button size="sm" variant="outline">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Conversion Rate</span>
                      <span className="font-bold">12.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Average Response Time</span>
                      <span className="font-bold">2.3 hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Customer Satisfaction</span>
                      <span className="font-bold">4.7/5.0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Destinations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Manali</span>
                      <Badge>23 inquiries</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Spiti Valley</span>
                      <Badge>15 inquiries</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Kullu</span>
                      <Badge>8 inquiries</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Itinerary Form Dialog */}
      <Dialog open={showItineraryForm} onOpenChange={setShowItineraryForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItinerary ? "Edit Itinerary" : "Create New Itinerary"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Package Title *</Label>
                <Input
                  id="title"
                  value={itineraryForm.title}
                  onChange={(e) => setItineraryForm({ ...itineraryForm, title: e.target.value })}
                  placeholder="e.g., Manali Adventure Package"
                />
              </div>
              <div>
                <Label htmlFor="destination">Destination *</Label>
                <Input
                  id="destination"
                  value={itineraryForm.destination}
                  onChange={(e) => setItineraryForm({ ...itineraryForm, destination: e.target.value })}
                  placeholder="e.g., Manali, Himachal Pradesh"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={itineraryForm.description}
                onChange={(e) => setItineraryForm({ ...itineraryForm, description: e.target.value })}
                placeholder="Describe your travel package..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="duration_days">Duration (Days)</Label>
                <Input
                  id="duration_days"
                  type="number"
                  min="1"
                  value={itineraryForm.duration_days}
                  onChange={(e) =>
                    setItineraryForm({ ...itineraryForm, duration_days: Number.parseInt(e.target.value) || 1 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="duration_nights">Duration (Nights)</Label>
                <Input
                  id="duration_nights"
                  type="number"
                  min="0"
                  value={itineraryForm.duration_nights}
                  onChange={(e) =>
                    setItineraryForm({ ...itineraryForm, duration_nights: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="price">Price per Person (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={itineraryForm.price_per_person}
                  onChange={(e) =>
                    setItineraryForm({ ...itineraryForm, price_per_person: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={itineraryForm.category}
                onValueChange={(value) => setItineraryForm({ ...itineraryForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Adventure">Adventure</SelectItem>
                  <SelectItem value="Cultural">Cultural</SelectItem>
                  <SelectItem value="Nature">Nature</SelectItem>
                  <SelectItem value="Beach">Beach</SelectItem>
                  <SelectItem value="Mountain">Mountain</SelectItem>
                  <SelectItem value="Desert">Desert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowItineraryForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateItinerary}>{editingItinerary ? "Update" : "Create"} Itinerary</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AgencyDashboard
