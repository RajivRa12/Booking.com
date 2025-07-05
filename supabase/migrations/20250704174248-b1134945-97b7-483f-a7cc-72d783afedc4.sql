-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('customer', 'agency', 'admin');

-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN role public.user_role DEFAULT 'customer';

-- Create travel agencies table
CREATE TABLE public.agencies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  description TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  website_url TEXT,
  license_number TEXT,
  established_year INTEGER,
  logo_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  total_packages INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create travel packages table
CREATE TABLE public.packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  destination TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  duration_nights INTEGER NOT NULL,
  price_per_person DECIMAL(10,2) NOT NULL,
  max_group_size INTEGER DEFAULT 10,
  inclusions TEXT[],
  exclusions TEXT[],
  itinerary JSONB,
  images TEXT[],
  category TEXT CHECK (category IN ('adventure', 'family', 'honeymoon', 'pilgrimage', 'business', 'budget', 'luxury')),
  available_from DATE,
  available_until DATE,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  booking_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create package bookings table
CREATE TABLE public.package_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES auth.users(id),
  package_id UUID REFERENCES public.packages(id),
  agency_id UUID REFERENCES public.agencies(id),
  travelers INTEGER NOT NULL,
  travel_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  special_requests TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  booking_reference TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create package reviews table
CREATE TABLE public.package_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES auth.users(id),
  package_id UUID REFERENCES public.packages(id),
  agency_id UUID REFERENCES public.agencies(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agencies
CREATE POLICY "Anyone can view agencies" ON public.agencies FOR SELECT USING (true);
CREATE POLICY "Agency users can update their own agency" ON public.agencies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Agency users can insert their own agency" ON public.agencies FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for packages
CREATE POLICY "Anyone can view active packages" ON public.packages FOR SELECT USING (active = true);
CREATE POLICY "Agency users can manage their packages" ON public.packages FOR ALL USING (
  EXISTS (SELECT 1 FROM public.agencies WHERE id = packages.agency_id AND user_id = auth.uid())
);

-- RLS Policies for package bookings
CREATE POLICY "Users can view their own bookings" ON public.package_bookings FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Anyone can create bookings" ON public.package_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Agencies can view their bookings" ON public.package_bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.agencies WHERE id = package_bookings.agency_id AND user_id = auth.uid())
);

-- RLS Policies for package reviews
CREATE POLICY "Anyone can view reviews" ON public.package_reviews FOR SELECT USING (true);
CREATE POLICY "Customers can create reviews" ON public.package_reviews FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Insert demo users and data
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'customer@demo.com', crypt('password', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Demo Customer"}', false, 'authenticated'),
  ('550e8400-e29b-41d4-a716-446655440002', 'agency@demo.com', crypt('password', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Demo Agency"}', false, 'authenticated'),
  ('550e8400-e29b-41d4-a716-446655440003', 'admin@demo.com', crypt('password', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Demo Admin"}', false, 'authenticated');

-- Insert demo profiles
INSERT INTO public.profiles (id, email, name, role) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'customer@demo.com', 'Demo Customer', 'customer'),
  ('550e8400-e29b-41d4-a716-446655440002', 'agency@demo.com', 'Demo Agency', 'agency'),
  ('550e8400-e29b-41d4-a716-446655440003', 'admin@demo.com', 'Demo Admin', 'admin');

-- Insert demo agency
INSERT INTO public.agencies (id, user_id, company_name, description, contact_email, contact_phone, city, rating, verified) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Himalayan Adventures', 'Specialized in mountain treks and adventure tours in Himachal Pradesh', 'agency@demo.com', '+91-9876543210', 'Manali', 4.5, true);

-- Insert demo packages
INSERT INTO public.packages (agency_id, title, description, destination, duration_days, duration_nights, price_per_person, inclusions, category, featured, active) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Manali Adventure Package', '3-day adventure package including paragliding, river rafting, and mountain trekking', 'Manali', 3, 2, 5999.00, ARRAY['Accommodation', 'Meals', 'Adventure Activities', 'Local Transport'], 'adventure', true, true),
  ('660e8400-e29b-41d4-a716-446655440001', 'Himalayan Trek Experience', '5-day trekking experience through beautiful mountain trails', 'Manali', 5, 4, 8999.00, ARRAY['Trekking Guide', 'Equipment', 'Meals', 'Camping'], 'adventure', false, true);

-- Generate booking reference function
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT AS $$
BEGIN
  RETURN 'BK' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
END;
$$ LANGUAGE plpgsql;

-- Add trigger to auto-generate booking reference
CREATE OR REPLACE FUNCTION set_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_reference IS NULL THEN
    NEW.booking_reference = generate_booking_reference();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_reference_trigger
  BEFORE INSERT ON public.package_bookings
  FOR EACH ROW EXECUTE FUNCTION set_booking_reference();
