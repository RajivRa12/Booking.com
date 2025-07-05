"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  Download,
  Eye,
  MapPin,
  Search,
  DollarSign,
  Calendar,
  Star,
  RefreshCw,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"

interface Agent {
  id: string
  company_name: string
  contact_email: string
  contact_phone: string
  location: string
  status: "pending" | "approved" | "rejected"
  created_at: string
  total_packages: number
  total_leads: number
  total_revenue: number
  conversion_rate: number
  rating: number
  total_bookings: number
}

interface Itinerary {
  id: string
  title: string
  destination: string
  price_per_person: number
  duration_days: number
  duration_nights: number
  category: string
  agent_name: string
  agent_id: string
  status: "pending" | "approved" | "rejected"
  created_at: string
  description: string
  bookings_count: number
  revenue: number
  rating: number
  views: number
}

interface Lead {
  id: string
  itinerary_title: string
  agent_name: string
  customer_name: string
  customer_email: string
  customer_phone: string
  travel_date: string
  group_size: string
  created_at: string
  status: string
  value: number
}

interface Booking {
  id: string
  customer_name: string
  agent_name: string
  package_title: string
  booking_date: string
  travel_date: string
  amount: number
  status: "confirmed" | "pending" | "cancelled"
  payment_status: "paid" | "pending" | "failed"
}

interface RevenueData {
  month: string
  revenue: number
  bookings: number
  agents: number
}

interface CategoryData {
  name: string
  value: number
  color: string
}

const AdminDashboard = () => {
  const { signOut } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [agents, setAgents] = useState<Agent[]>([])
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showAgentDetails, setShowAgentDetails] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    to: new Date(),
  })
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for analytics
  const revenueData: RevenueData[] = [
    { month: "Jan", revenue: 125000, bookings: 45, agents: 12 },
    { month: "Feb", revenue: 180000, bookings: 62, agents: 15 },
    { month: "Mar", revenue: 220000, bookings: 78, agents: 18 },
    { month: "Apr", revenue: 195000, bookings: 68, agents: 20 },
    { month: "May", revenue: 285000, bookings: 95, agents: 22 },
    { month: "Jun", revenue: 340000, bookings: 112, agents: 25 },
  ]

  const categoryData: CategoryData[] = [
    { name: "Adventure", value: 35, color: "#8884d8" },
    { name: "Beach", value: 25, color: "#82ca9d" },
    { name: "Cultural", value: 20, color: "#ffc658" },
    { name: "Wildlife", value: 12, color: "#ff7300" },
    { name: "Luxury", value: 8, color: "#00ff88" },
  ]

  const topDestinations = [
    { name: "Goa", bookings: 145, revenue: 2850000 },
    { name: "Manali", bookings: 132, revenue: 2640000 },
    { name: "Kerala", bookings: 118, revenue: 2950000 },
    { name: "Rajasthan", bookings: 95, revenue: 3800000 },
    { name: "Himachal", bookings: 87, revenue: 2175000 },
  ]

  const performanceMetrics = [
    { metric: "Conversion Rate", value: "12.5%", change: "+2.3%", trend: "up" },
    { metric: "Avg. Booking Value", value: "₹25,450", change: "+8.7%", trend: "up" },
    { metric: "Customer Satisfaction", value: "4.6/5", change: "+0.2", trend: "up" },
    { metric: "Agent Response Time", value: "2.4 hrs", change: "-0.8 hrs", trend: "up" },
  ]

  useEffect(() => {
    loadDashboardData()
  }, [dateRange])

  const loadDashboardData = async () => {
    setIsLoading(true)

    // Mock data loading
    const mockAgents: Agent[] = [
      {
        id: "1",
        company_name: "Mountain Explorers",
        contact_email: "info@mountainexplorers.com",
        contact_phone: "+91 8438327763",
        location: "Manali, Himachal Pradesh",
        status: "approved",
        created_at: "2024-01-15",
        total_packages: 8,
        total_leads: 45,
        total_revenue: 285000,
        conversion_rate: 15.2,
        rating: 4.7,
        total_bookings: 32,
      },
      {
        id: "2",
        company_name: "Coastal Adventures",
        contact_email: "hello@coastaladventures.com",
        contact_phone: "+91 9876543210",
        location: "Goa",
        status: "pending",
        created_at: "2024-03-01",
        total_packages: 0,
        total_leads: 0,
        total_revenue: 0,
        conversion_rate: 0,
        rating: 0,
        total_bookings: 0,
      },
      {
        id: "3",
        company_name: "Desert Safaris",
        contact_email: "contact@desertsafaris.com",
        contact_phone: "+91 9123456789",
        location: "Jaisalmer, Rajasthan",
        status: "approved",
        created_at: "2024-02-10",
        total_packages: 6,
        total_leads: 28,
        total_revenue: 195000,
        conversion_rate: 18.5,
        rating: 4.5,
        total_bookings: 24,
      },
    ]

    const mockItineraries: Itinerary[] = [
      {
        id: "1",
        title: "Manali Adventure Package",
        destination: "Manali, HP",
        price_per_person: 15000,
        duration_days: 5,
        duration_nights: 4,
        category: "Adventure",
        agent_name: "Mountain Explorers",
        agent_id: "1",
        status: "approved",
        created_at: "2024-01-20",
        description: "Thrilling mountain adventures including trekking and rafting",
        bookings_count: 32,
        revenue: 480000,
        rating: 4.6,
        views: 1250,
      },
      {
        id: "2",
        title: "Goa Beach Paradise",
        destination: "Goa",
        price_per_person: 12000,
        duration_days: 4,
        duration_nights: 3,
        category: "Beach",
        agent_name: "Coastal Adventures",
        agent_id: "2",
        status: "pending",
        created_at: "2024-03-05",
        description: "Relaxing beach vacation with water sports",
        bookings_count: 0,
        revenue: 0,
        rating: 0,
        views: 85,
      },
      {
        id: "3",
        title: "Rajasthan Heritage Tour",
        destination: "Jaisalmer, RJ",
        price_per_person: 25000,
        duration_days: 7,
        duration_nights: 6,
        category: "Cultural",
        agent_name: "Desert Safaris",
        agent_id: "3",
        status: "approved",
        created_at: "2024-02-15",
        description: "Explore royal palaces and desert landscapes",
        bookings_count: 24,
        revenue: 600000,
        rating: 4.8,
        views: 890,
      },
    ]

    const mockBookings: Booking[] = [
      {
        id: "1",
        customer_name: "Rahul Sharma",
        agent_name: "Mountain Explorers",
        package_title: "Manali Adventure Package",
        booking_date: "2024-12-01",
        travel_date: "2024-12-15",
        amount: 45000,
        status: "confirmed",
        payment_status: "paid",
      },
      {
        id: "2",
        customer_name: "Priya Patel",
        agent_name: "Desert Safaris",
        package_title: "Rajasthan Heritage Tour",
        booking_date: "2024-12-02",
        travel_date: "2024-12-20",
        amount: 75000,
        status: "confirmed",
        payment_status: "paid",
      },
      {
        id: "3",
        customer_name: "Amit Kumar",
        agent_name: "Mountain Explorers",
        package_title: "Manali Adventure Package",
        booking_date: "2024-12-03",
        travel_date: "2024-12-25",
        amount: 30000,
        status: "pending",
        payment_status: "pending",
      },
    ]

    // Load leads from localStorage
    const storedLeads = JSON.parse(localStorage.getItem("leads") || "[]")

    setAgents(mockAgents)
    setItineraries(mockItineraries)
    setLeads(storedLeads)
    setBookings(mockBookings)
    setIsLoading(false)
  }

  const handleApproveAgent = (agentId: string) => {
    setAgents(agents.map((agent) => (agent.id === agentId ? { ...agent, status: "approved" } : agent)))
    toast.success("Agent approved successfully!")
  }

  const handleRejectAgent = (agentId: string) => {
    setAgents(agents.map((agent) => (agent.id === agentId ? { ...agent, status: "rejected" } : agent)))
    toast.success("Agent rejected!")
  }

  const handleApproveItinerary = (itineraryId: string) => {
    setItineraries(itineraries.map((item) => (item.id === itineraryId ? { ...item, status: "approved" } : item)))
    toast.success("Itinerary approved successfully!")
  }

  const handleRejectItinerary = (itineraryId: string) => {
    setItineraries(itineraries.map((item) => (item.id === itineraryId ? { ...item, status: "rejected" } : item)))
    toast.success("Itinerary rejected!")
  }

  const exportAnalyticsData = () => {
    const analyticsData = {
      summary: {
        totalRevenue: revenueData.reduce((sum, item) => sum + item.revenue, 0),
        totalBookings: revenueData.reduce((sum, item) => sum + item.bookings, 0),
        totalAgents: agents.length,
        approvedAgents: agents.filter((a) => a.status === "approved").length,
      },
      revenueByMonth: revenueData,
      topDestinations,
      categoryBreakdown: categoryData,
      performanceMetrics,
    }

    const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analytics_report_${new Date().toISOString().split("T")[0]}.json`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success("Analytics data exported successfully!")
  }

  const exportLeadsData = () => {
    const csvContent = [
      [
        "Agent Name",
        "Customer Name",
        "Email",
        "Phone",
        "Package",
        "Travel Date",
        "Group Size",
        "Status",
        "Value",
        "Date Created",
      ],
      ...leads.map((lead) => [
        lead.agent_name,
        lead.customer_name,
        lead.customer_email,
        lead.customer_phone,
        lead.itinerary_title,
        lead.travel_date,
        lead.group_size,
        lead.status,
        lead.value || 0,
        new Date(lead.created_at).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `leads_export_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success("Leads data exported successfully!")
  }

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredItineraries = itineraries.filter((itinerary) => {
    const matchesSearch =
      itinerary.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itinerary.agent_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || itinerary.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    totalAgents: agents.length,
    approvedAgents: agents.filter((a) => a.status === "approved").length,
    pendingAgents: agents.filter((a) => a.status === "pending").length,
    totalItineraries: itineraries.length,
    approvedItineraries: itineraries.filter((i) => i.status === "approved").length,
    pendingItineraries: itineraries.filter((i) => i.status === "pending").length,
    totalLeads: leads.length,
    recentLeads: leads.filter((l) => new Date(l.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
    totalRevenue: revenueData.reduce((sum, item) => sum + item.revenue, 0),
    totalBookings: bookings.length,
    confirmedBookings: bookings.filter((b) => b.status === "confirmed").length,
    avgBookingValue: bookings.length > 0 ? bookings.reduce((sum, b) => sum + b.amount, 0) / bookings.length : 0,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Business Intelligence & Analytics</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => loadDashboardData()} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={exportAnalyticsData}>
              <Download className="h-4 w-4 mr-2" />
              Export Analytics
            </Button>
            <Button variant="outline" onClick={exportLeadsData}>
              <Download className="h-4 w-4 mr-2" />
              Export Leads
            </Button>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="itineraries">Packages</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
                      <p className="text-xs text-gray-600">Total Revenue</p>
                      <p className="text-xs text-green-600">+12.5% this month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalBookings}</p>
                      <p className="text-xs text-gray-600">Total Bookings</p>
                      <p className="text-xs text-green-600">{stats.confirmedBookings} confirmed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalAgents}</p>
                      <p className="text-xs text-gray-600">Active Agents</p>
                      <p className="text-xs text-green-600">{stats.approvedAgents} approved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold">₹{Math.round(stats.avgBookingValue / 1000)}K</p>
                      <p className="text-xs text-gray-600">Avg Booking Value</p>
                      <p className="text-xs text-green-600">+8.7% increase</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {performanceMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{metric.metric}</p>
                        <p className="text-xl font-bold">{metric.value}</p>
                      </div>
                      <div
                        className={`flex items-center text-sm ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}
                      >
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {metric.change}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {agents
                      .filter((agent) => agent.status === "pending")
                      .slice(0, 3)
                      .map((agent) => (
                        <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{agent.company_name}</h4>
                            <p className="text-sm text-gray-600">{agent.location}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => handleApproveAgent(agent.id)}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleRejectAgent(agent.id)}>
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Destinations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topDestinations.slice(0, 5).map((destination, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{destination.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{destination.bookings} bookings</p>
                          <p className="text-sm text-gray-600">₹{(destination.revenue / 100000).toFixed(1)}L</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Revenue Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Revenue",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="hsl(var(--chart-1))"
                          fill="hsl(var(--chart-1))"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Package Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      adventure: { label: "Adventure", color: "#8884d8" },
                      beach: { label: "Beach", color: "#82ca9d" },
                      cultural: { label: "Cultural", color: "#ffc658" },
                      wildlife: { label: "Wildlife", color: "#ff7300" },
                      luxury: { label: "Luxury", color: "#00ff88" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <RechartsPieChart
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </RechartsPieChart>
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Bookings vs Agents */}
              <Card>
                <CardHeader>
                  <CardTitle>Growth Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      bookings: {
                        label: "Bookings",
                        color: "hsl(var(--chart-2))",
                      },
                      agents: {
                        label: "Agents",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="bookings" fill="hsl(var(--chart-2))" />
                        <Bar dataKey="agents" fill="hsl(var(--chart-3))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Conversion Funnel */}
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span>Website Visitors</span>
                      <span className="font-bold">12,450</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span>Package Views</span>
                      <span className="font-bold">3,280</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span>Inquiries</span>
                      <span className="font-bold">892</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span>Bookings</span>
                      <span className="font-bold">156</span>
                    </div>
                    <div className="text-center pt-2">
                      <Badge variant="secondary">Conversion Rate: 12.5%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Revenue",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="hsl(var(--chart-1))"
                          strokeWidth={3}
                          dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 6 }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm">Commission (15%)</span>
                      <span className="font-bold">₹{Math.round((stats.totalRevenue * 0.15) / 100000)}L</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm">Platform Fee (3%)</span>
                      <span className="font-bold">₹{Math.round((stats.totalRevenue * 0.03) / 100000)}L</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm">Payment Gateway (2%)</span>
                      <span className="font-bold">₹{Math.round((stats.totalRevenue * 0.02) / 100000)}L</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm">Net Revenue</span>
                      <span className="font-bold">₹{Math.round((stats.totalRevenue * 0.8) / 100000)}L</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Agents */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Bookings</TableHead>
                      <TableHead>Conversion Rate</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agents
                      .filter((agent) => agent.status === "approved")
                      .sort((a, b) => b.total_revenue - a.total_revenue)
                      .map((agent) => (
                        <TableRow key={agent.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{agent.company_name}</div>
                              <div className="text-sm text-gray-600">{agent.location}</div>
                            </div>
                          </TableCell>
                          <TableCell>₹{(agent.total_revenue / 1000).toFixed(0)}K</TableCell>
                          <TableCell>{agent.total_bookings}</TableCell>
                          <TableCell>{agent.conversion_rate}%</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              {agent.rating}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAgents.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell>
                          <div className="font-medium">{agent.company_name}</div>
                          <div className="text-sm text-gray-600">
                            Joined {new Date(agent.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>{agent.location}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{agent.contact_email}</div>
                            <div>{agent.contact_phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{agent.total_packages} packages</div>
                            <div>{agent.total_bookings} bookings</div>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-400 mr-1" />
                              {agent.rating || "N/A"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>₹{(agent.total_revenue / 1000).toFixed(0)}K</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              agent.status === "approved"
                                ? "default"
                                : agent.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {agent.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {agent.status === "pending" && (
                              <>
                                <Button size="sm" onClick={() => handleApproveAgent(agent.id)}>
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleRejectAgent(agent.id)}>
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedAgent(agent)
                                setShowAgentDetails(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
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

          {/* Itineraries Tab */}
          <TabsContent value="itineraries" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search packages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Package Title</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItineraries.map((itinerary) => (
                      <TableRow key={itinerary.id}>
                        <TableCell>
                          <div className="font-medium">{itinerary.title}</div>
                          <div className="text-sm text-gray-600">
                            {itinerary.duration_days}D/{itinerary.duration_nights}N • ₹
                            {itinerary.price_per_person.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>{itinerary.agent_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {itinerary.destination}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{itinerary.bookings_count} bookings</div>
                            <div>{itinerary.views} views</div>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-400 mr-1" />
                              {itinerary.rating || "N/A"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>₹{(itinerary.revenue / 1000).toFixed(0)}K</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              itinerary.status === "approved"
                                ? "default"
                                : itinerary.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {itinerary.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {itinerary.status === "pending" && (
                              <>
                                <Button size="sm" onClick={() => handleApproveItinerary(itinerary.id)}>
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleRejectItinerary(itinerary.id)}>
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
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

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Travel Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="font-medium">{booking.customer_name}</div>
                          <div className="text-sm text-gray-600">
                            Booked on {new Date(booking.booking_date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>{booking.agent_name}</TableCell>
                        <TableCell>{booking.package_title}</TableCell>
                        <TableCell>{new Date(booking.travel_date).toLocaleDateString()}</TableCell>
                        <TableCell>₹{booking.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              booking.status === "confirmed"
                                ? "default"
                                : booking.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              booking.payment_status === "paid"
                                ? "default"
                                : booking.payment_status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {booking.payment_status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Agent Details Dialog */}
      <Dialog open={showAgentDetails} onOpenChange={setShowAgentDetails}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Agent Performance Details</DialogTitle>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Company Name</Label>
                  <p>{selectedAgent.company_name}</p>
                </div>
                <div>
                  <Label className="font-medium">Location</Label>
                  <p>{selectedAgent.location}</p>
                </div>
                <div>
                  <Label className="font-medium">Email</Label>
                  <p>{selectedAgent.contact_email}</p>
                </div>
                <div>
                  <Label className="font-medium">Phone</Label>
                  <p>{selectedAgent.contact_phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedAgent.total_packages}</p>
                    <p className="text-sm text-gray-600">Packages</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">{selectedAgent.total_bookings}</p>
                    <p className="text-sm text-gray-600">Bookings</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      ₹{(selectedAgent.total_revenue / 1000).toFixed(0)}K
                    </p>
                    <p className="text-sm text-gray-600">Revenue</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-orange-600">{selectedAgent.conversion_rate}%</p>
                    <p className="text-sm text-gray-600">Conversion</p>
                  </CardContent>
                </Card>
              </div>

              {selectedAgent.status === "pending" && (
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => handleRejectAgent(selectedAgent.id)}>
                    Reject
                  </Button>
                  <Button onClick={() => handleApproveAgent(selectedAgent.id)}>Approve</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminDashboard
