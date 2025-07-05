import { jsPDF } from "jspdf"

interface ItineraryData {
  id: string
  title: string
  destination: string
  price_per_person: number
  duration_days: number
  duration_nights: number
  description: string
  category: string
  rating?: number
  agent_name?: string
}

interface AgentData {
  company_name: string
  contact_phone: string
  contact_email: string
  website_url?: string
  location: string
  license_number?: string
}

export class PDFGenerator {
  private doc: jsPDF
  private pageWidth: number
  private margin = 20
  private yPosition = 30

  constructor() {
    this.doc = new jsPDF()
    this.pageWidth = this.doc.internal.pageSize.width
  }

  private addWrappedText(text: string, x: number, y: number, maxWidth: number, fontSize = 12): number {
    this.doc.setFontSize(fontSize)
    const lines = this.doc.splitTextToSize(text, maxWidth)
    this.doc.text(lines, x, y)
    return y + lines.length * fontSize * 0.4
  }

  private checkPageBreak(requiredSpace = 30): void {
    if (this.yPosition > this.doc.internal.pageSize.height - requiredSpace) {
      this.doc.addPage()
      this.yPosition = 30
    }
  }

  private addHeader(title = "Travel Itinerary"): void {
    // Header with company branding
    this.doc.setFillColor(59, 130, 246) // Blue background
    this.doc.rect(0, 0, this.pageWidth, 25, "F")

    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(20)
    this.doc.setFont(undefined, "bold")
    this.doc.text(title, this.margin, 18)

    this.doc.setTextColor(0, 0, 0)
    this.yPosition = 40
  }

  private addItineraryTitle(itinerary: ItineraryData): void {
    // Itinerary Title
    this.doc.setFontSize(18)
    this.doc.setFont(undefined, "bold")
    this.yPosition = this.addWrappedText(
      itinerary.title,
      this.margin,
      this.yPosition,
      this.pageWidth - 2 * this.margin,
      18,
    )
    this.yPosition += 10

    // Destination
    this.doc.setFontSize(14)
    this.doc.setFont(undefined, "normal")
    this.doc.setTextColor(100, 100, 100)
    this.yPosition = this.addWrappedText(
      `📍 ${itinerary.destination}`,
      this.margin,
      this.yPosition,
      this.pageWidth - 2 * this.margin,
      14,
    )
    this.yPosition += 15
    this.doc.setTextColor(0, 0, 0)
  }

  private addKeyDetails(itinerary: ItineraryData, agent?: AgentData): void {
    // Key Details Box
    this.doc.setDrawColor(200, 200, 200)
    this.doc.setFillColor(248, 250, 252)
    const boxHeight = agent ? 50 : 40
    this.doc.rect(this.margin, this.yPosition, this.pageWidth - 2 * this.margin, boxHeight, "FD")

    this.doc.setTextColor(0, 0, 0)
    this.doc.setFontSize(12)
    this.doc.setFont(undefined, "bold")

    // Labels
    this.doc.text("Duration:", this.margin + 10, this.yPosition + 15)
    this.doc.text("Price:", this.margin + 100, this.yPosition + 15)
    this.doc.text("Category:", this.margin + 10, this.yPosition + 30)

    if (itinerary.rating) {
      this.doc.text("Rating:", this.margin + 100, this.yPosition + 30)
    }

    if (agent) {
      this.doc.text("Agent:", this.margin + 10, this.yPosition + 45)
    }

    // Values
    this.doc.setFont(undefined, "normal")
    this.doc.text(
      `${itinerary.duration_days} Days / ${itinerary.duration_nights} Nights`,
      this.margin + 45,
      this.yPosition + 15,
    )
    this.doc.text(`₹${itinerary.price_per_person.toLocaleString()} per person`, this.margin + 125, this.yPosition + 15)
    this.doc.text(itinerary.category, this.margin + 50, this.yPosition + 30)

    if (itinerary.rating) {
      this.doc.text(`⭐ ${itinerary.rating}/5.0`, this.margin + 130, this.yPosition + 30)
    }

    if (agent) {
      this.doc.text(agent.company_name, this.margin + 40, this.yPosition + 45)
    }

    this.yPosition += boxHeight + 15
  }

  private addAgentInfo(agent: AgentData): void {
    this.doc.setFillColor(252, 248, 227) // Light yellow background
    this.doc.rect(this.margin, this.yPosition, this.pageWidth - 2 * this.margin, 35, "FD")

    this.doc.setFontSize(12)
    this.doc.setFont(undefined, "bold")
    this.doc.text("Agent Contact Information", this.margin + 10, this.yPosition + 12)

    this.doc.setFont(undefined, "normal")
    this.doc.setFontSize(10)
    this.doc.text(`📞 ${agent.contact_phone}`, this.margin + 10, this.yPosition + 22)
    this.doc.text(`✉️ ${agent.contact_email}`, this.margin + 10, this.yPosition + 30)

    if (agent.website_url) {
      this.doc.text(`🌐 ${agent.website_url}`, this.margin + 100, this.yPosition + 22)
    }
    this.doc.text(`📍 ${agent.location}`, this.margin + 100, this.yPosition + 30)

    this.yPosition += 50
  }

  private addDescription(description: string): void {
    this.doc.setFontSize(14)
    this.doc.setFont(undefined, "bold")
    this.doc.text("Package Description", this.margin, this.yPosition)
    this.yPosition += 10

    this.doc.setFontSize(11)
    this.doc.setFont(undefined, "normal")
    this.yPosition = this.addWrappedText(description, this.margin, this.yPosition, this.pageWidth - 2 * this.margin, 11)
    this.yPosition += 15
  }

  private addInclusions(): void {
    const inclusions = [
      "✓ Accommodation in premium hotels/resorts",
      "✓ Daily breakfast and dinner",
      "✓ All transfers and transportation",
      "✓ Professional tour guide services",
      "✓ All entry fees and permits",
      "✓ Travel insurance coverage",
      "✓ 24/7 customer support",
    ]

    this.checkPageBreak(100)

    this.doc.setFontSize(14)
    this.doc.setFont(undefined, "bold")
    this.doc.text("Package Inclusions", this.margin, this.yPosition)
    this.yPosition += 10

    this.doc.setFontSize(11)
    this.doc.setFont(undefined, "normal")
    inclusions.forEach((inclusion) => {
      this.checkPageBreak()
      this.doc.text(inclusion, this.margin, this.yPosition)
      this.yPosition += 8
    })
    this.yPosition += 10
  }

  private addDayWiseItinerary(durationDays: number): void {
    const sampleSchedule = [
      { day: "Day 1", activity: "Arrival and check-in, welcome dinner, briefing session" },
      { day: "Day 2", activity: "City tour, local sightseeing, cultural experiences" },
      { day: "Day 3", activity: "Adventure activities, nature exploration, photography" },
      { day: "Day 4", activity: "Free time for shopping, relaxation, optional activities" },
      { day: "Day 5", activity: "Final sightseeing, departure preparations, check-out" },
      { day: "Day 6", activity: "Extended exploration, special experiences" },
      { day: "Day 7", activity: "Leisure day, final shopping, departure" },
      { day: "Day 8", activity: "Departure and journey back home" },
    ]

    this.checkPageBreak(80)

    this.doc.setFontSize(14)
    this.doc.setFont(undefined, "bold")
    this.doc.text("Day-wise Itinerary", this.margin, this.yPosition)
    this.yPosition += 15

    sampleSchedule.slice(0, durationDays).forEach((item) => {
      this.checkPageBreak(25)

      this.doc.setFontSize(12)
      this.doc.setFont(undefined, "bold")
      this.doc.text(item.day, this.margin, this.yPosition)

      this.doc.setFont(undefined, "normal")
      this.yPosition = this.addWrappedText(
        item.activity,
        this.margin + 40,
        this.yPosition,
        this.pageWidth - 2 * this.margin - 40,
        12,
      )
      this.yPosition += 8
    })

    this.yPosition += 15
  }

  private addTermsAndConditions(): void {
    this.checkPageBreak(100)

    this.doc.setFontSize(14)
    this.doc.setFont(undefined, "bold")
    this.doc.text("Terms & Conditions", this.margin, this.yPosition)
    this.yPosition += 10

    const terms = [
      "• Booking confirmation required 48 hours in advance",
      "• Cancellation charges apply as per our cancellation policy",
      "• Travel insurance is mandatory for all participants",
      "• Valid government-issued ID proof required for all travelers",
      "• Package rates are subject to change without prior notice",
      "• Weather conditions may affect the planned itinerary",
      "• Additional charges may apply for extra services not mentioned",
      "• Please read our complete terms and conditions before booking",
    ]

    this.doc.setFontSize(10)
    this.doc.setFont(undefined, "normal")
    terms.forEach((term) => {
      this.checkPageBreak(15)
      this.yPosition = this.addWrappedText(term, this.margin, this.yPosition, this.pageWidth - 2 * this.margin, 10)
      this.yPosition += 5
    })
  }

  private addFooter(agent?: AgentData): void {
    const footerY = this.doc.internal.pageSize.height - 30
    this.doc.setDrawColor(200, 200, 200)
    this.doc.line(this.margin, footerY, this.pageWidth - this.margin, footerY)

    this.doc.setFontSize(10)
    this.doc.setTextColor(100, 100, 100)

    if (agent) {
      this.doc.text(`Provided by ${agent.company_name}`, this.margin, footerY + 10)
      if (agent.license_number) {
        this.doc.text(`License: ${agent.license_number}`, this.pageWidth - this.margin - 100, footerY + 20)
      }
      this.doc.text("For bookings and inquiries, contact us directly", this.pageWidth - this.margin - 120, footerY + 10)
    } else {
      this.doc.text("Generated by Travel Agent Marketplace", this.margin, footerY + 10)
      this.doc.text("For bookings, contact the agent directly", this.pageWidth - this.margin - 100, footerY + 10)
    }

    this.doc.text(`Generated on: ${new Date().toLocaleDateString()}`, this.margin, footerY + 20)
  }

  public generateItineraryPDF(itinerary: ItineraryData, agent?: AgentData): void {
    this.addHeader()
    this.addItineraryTitle(itinerary)
    this.addKeyDetails(itinerary, agent)

    if (agent) {
      this.addAgentInfo(agent)
    }

    this.addDescription(itinerary.description)
    this.addInclusions()
    this.addDayWiseItinerary(itinerary.duration_days)
    this.addTermsAndConditions()
    this.addFooter(agent)

    // Generate filename
    const agentName = agent ? agent.company_name.replace(/[^a-zA-Z0-9]/g, "_") : "Agent"
    const fileName = `${itinerary.title.replace(/[^a-zA-Z0-9]/g, "_")}_${agentName}_Itinerary.pdf`

    this.doc.save(fileName)
  }

  public generateAgentProfilePDF(agent: AgentData, itineraries: ItineraryData[]): void {
    this.addHeader(`${agent.company_name} - Travel Packages`)

    // Agent Profile Section
    this.doc.setFontSize(18)
    this.doc.setFont(undefined, "bold")
    this.yPosition = this.addWrappedText(
      agent.company_name,
      this.margin,
      this.yPosition,
      this.pageWidth - 2 * this.margin,
      18,
    )
    this.yPosition += 10

    this.addAgentInfo(agent)

    // Available Packages
    this.doc.setFontSize(16)
    this.doc.setFont(undefined, "bold")
    this.doc.text("Available Travel Packages", this.margin, this.yPosition)
    this.yPosition += 15

    itineraries.forEach((itinerary, index) => {
      this.checkPageBreak(60)

      // Package box
      this.doc.setDrawColor(200, 200, 200)
      this.doc.setFillColor(248, 250, 252)
      this.doc.rect(this.margin, this.yPosition, this.pageWidth - 2 * this.margin, 45, "FD")

      this.doc.setFontSize(14)
      this.doc.setFont(undefined, "bold")
      this.doc.text(`${index + 1}. ${itinerary.title}`, this.margin + 10, this.yPosition + 15)

      this.doc.setFontSize(11)
      this.doc.setFont(undefined, "normal")
      this.doc.text(`📍 ${itinerary.destination}`, this.margin + 10, this.yPosition + 25)
      this.doc.text(
        `⏱️ ${itinerary.duration_days}D/${itinerary.duration_nights}N`,
        this.margin + 10,
        this.yPosition + 35,
      )
      this.doc.text(`💰 ₹${itinerary.price_per_person.toLocaleString()}/person`, this.margin + 100, this.yPosition + 35)

      if (itinerary.rating) {
        this.doc.text(`⭐ ${itinerary.rating}/5.0`, this.pageWidth - this.margin - 40, this.yPosition + 25)
      }

      this.yPosition += 55
    })

    this.addFooter(agent)

    const fileName = `${agent.company_name.replace(/[^a-zA-Z0-9]/g, "_")}_Travel_Packages.pdf`
    this.doc.save(fileName)
  }
}

// Utility functions for easy use
export const downloadItineraryPDF = async (itinerary: ItineraryData, agent?: AgentData) => {
  try {
    const generator = new PDFGenerator()
    generator.generateItineraryPDF(itinerary, agent)
    return true
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw error
  }
}

export const downloadAgentProfilePDF = async (agent: AgentData, itineraries: ItineraryData[]) => {
  try {
    const generator = new PDFGenerator()
    generator.generateAgentProfilePDF(agent, itineraries)
    return true
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw error
  }
}
