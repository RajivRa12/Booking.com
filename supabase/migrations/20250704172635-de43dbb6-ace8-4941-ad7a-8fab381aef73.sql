-- Create users profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  avatar_url TEXT,
  verified_traveler BOOLEAN DEFAULT false,
  places_visited INTEGER DEFAULT 0,
  reviews_written INTEGER DEFAULT 0,
  photos_shared INTEGER DEFAULT 0,
  bookings_made INTEGER DEFAULT 0,
  member_since TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create places table
CREATE TABLE public.places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('restaurant', 'hotel', 'activity', 'nightlife')),
  location TEXT,
  city TEXT,
  price_range TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  place_id UUID REFERENCES public.places(id) NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME,
  guests INTEGER DEFAULT 1,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'past', 'cancelled')),
  total_amount DECIMAL(10,2),
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create enquiries table for tourbook enquiries
CREATE TABLE public.enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  destination TEXT,
  travel_dates TEXT,
  group_size INTEGER,
  budget_range TEXT,
  special_requirements TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  place_id UUID REFERENCES public.places(id) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for places (public read)
CREATE POLICY "Anyone can view places" ON public.places FOR SELECT USING (true);

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for enquiries (insert only for now)
CREATE POLICY "Anyone can create enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create their own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert sample places data
INSERT INTO public.places (name, description, category, location, city, price_range, rating, review_count, image_url, featured, popular) VALUES
('Sunset Point Cafe', 'Beautiful cafe with stunning sunset views and local cuisine', 'restaurant', 'Marine Drive', 'Mumbai', '₹₹', 4.5, 124, 'https://images.unsplash.com/photo-1559329007-40df8ddd3415?w=400&h=300&fit=crop', true, true),
('Mountain View Restaurant', 'Fine dining with panoramic mountain views', 'restaurant', 'Hill Station Road', 'Shimla', '₹₹₹', 4.8, 89, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop', true, false),
('Ocean Breeze Hotel', 'Luxury beachfront hotel with world-class amenities', 'hotel', 'Beach Road', 'Goa', '₹₹₹₹', 4.7, 245, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop', true, true),
('Paragliding Adventure', 'Thrilling paragliding experience over scenic valleys', 'activity', 'Adventure Park', 'Manali', '₹₹', 4.9, 67, 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop', false, true),
('Rooftop Lounge', 'Trendy rooftop bar with city views and craft cocktails', 'nightlife', 'City Center', 'Bangalore', '₹₹₹', 4.3, 156, 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop', false, true);
