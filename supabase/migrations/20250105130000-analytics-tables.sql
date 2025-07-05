-- Create analytics and business intelligence tables

-- Agent performance tracking
CREATE TABLE IF NOT EXISTS agent_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_views INTEGER DEFAULT 0,
  total_inquiries INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  avg_response_time INTEGER DEFAULT 0, -- in minutes
  customer_rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Package performance tracking
CREATE TABLE IF NOT EXISTS package_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  inquiries INTEGER DEFAULT 0,
  bookings INTEGER DEFAULT 0,
  revenue DECIMAL(12,2) DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  avg_rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform-wide analytics
CREATE TABLE IF NOT EXISTS platform_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  total_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  total_agents INTEGER DEFAULT 0,
  new_agents INTEGER DEFAULT 0,
  total_packages INTEGER DEFAULT 0,
  new_packages INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  platform_commission DECIMAL(12,2) DEFAULT 0,
  avg_booking_value DECIMAL(10,2) DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Revenue breakdown tracking
CREATE TABLE IF NOT EXISTS revenue_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  gross_revenue DECIMAL(12,2) DEFAULT 0,
  platform_commission DECIMAL(12,2) DEFAULT 0,
  payment_gateway_fees DECIMAL(12,2) DEFAULT 0,
  agent_payouts DECIMAL(12,2) DEFAULT 0,
  net_revenue DECIMAL(12,2) DEFAULT 0,
  refunds DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer behavior analytics
CREATE TABLE IF NOT EXISTS customer_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  total_sessions INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0, -- in seconds
  bounce_rate DECIMAL(5,2) DEFAULT 0,
  pages_per_session DECIMAL(5,2) DEFAULT 0,
  search_queries INTEGER DEFAULT 0,
  filter_usage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Geographic analytics
CREATE TABLE IF NOT EXISTS geographic_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  country VARCHAR(100),
  state VARCHAR(100),
  city VARCHAR(100),
  visitors INTEGER DEFAULT 0,
  bookings INTEGER DEFAULT 0,
  revenue DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agent_analytics_agent_date ON agent_analytics(agent_id, date);
CREATE INDEX IF NOT EXISTS idx_package_analytics_package_date ON package_analytics(package_id, date);
CREATE INDEX IF NOT EXISTS idx_platform_analytics_date ON platform_analytics(date);
CREATE INDEX IF NOT EXISTS idx_revenue_analytics_date ON revenue_analytics(date);
CREATE INDEX IF NOT EXISTS idx_customer_analytics_date ON customer_analytics(date);
CREATE INDEX IF NOT EXISTS idx_geographic_analytics_date_location ON geographic_analytics(date, country, state, city);

-- Create functions for automatic analytics updates
CREATE OR REPLACE FUNCTION update_agent_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update agent analytics when bookings are created/updated
  INSERT INTO agent_analytics (agent_id, date, total_bookings, total_revenue)
  VALUES (NEW.agent_id, CURRENT_DATE, 1, NEW.total_amount)
  ON CONFLICT (agent_id, date) 
  DO UPDATE SET 
    total_bookings = agent_analytics.total_bookings + 1,
    total_revenue = agent_analytics.total_revenue + NEW.total_amount,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic analytics updates
CREATE TRIGGER trigger_update_agent_analytics
  AFTER INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_analytics();

-- Insert sample analytics data
INSERT INTO platform_analytics (date, total_users, new_users, total_agents, new_agents, total_packages, new_packages, total_bookings, total_revenue, platform_commission, avg_booking_value, conversion_rate)
VALUES 
  ('2024-01-01', 1250, 125, 12, 2, 45, 8, 45, 1125000, 168750, 25000, 12.5),
  ('2024-02-01', 1580, 180, 15, 3, 62, 12, 62, 1800000, 270000, 29032, 13.2),
  ('2024-03-01', 1890, 220, 18, 3, 78, 16, 78, 2200000, 330000, 28205, 14.1),
  ('2024-04-01', 2150, 195, 20, 2, 68, 8, 68, 1950000, 292500, 28676, 11.8),
  ('2024-05-01', 2435, 285, 22, 2, 95, 18, 95, 2850000, 427500, 30000, 15.2),
  ('2024-06-01', 2780, 340, 25, 3, 112, 22, 112, 3400000, 510000, 30357, 16.8);

-- Insert sample revenue analytics
INSERT INTO revenue_analytics (date, gross_revenue, platform_commission, payment_gateway_fees, agent_payouts, net_revenue, refunds)
VALUES 
  ('2024-01-01', 1125000, 168750, 22500, 900000, 33750, 15000),
  ('2024-02-01', 1800000, 270000, 36000, 1440000, 54000, 18000),
  ('2024-03-01', 2200000, 330000, 44000, 1760000, 66000, 22000),
  ('2024-04-01', 1950000, 292500, 39000, 1560000, 58500, 19500),
  ('2024-05-01', 2850000, 427500, 57000, 2280000, 85500, 28500),
  ('2024-06-01', 3400000, 510000, 68000, 2720000, 102000, 34000);
