import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { MapPin, Package, Users, Star, Plane, TrendingUp, User, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HomePageProps {
  onNavigate?: (view: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { user, signOut, userRole } = useAuth();
  const navigate = useNavigate();

  const getWelcomeMessage = () => {
    switch (userRole) {
      case 'customer':
        return 'Welcome to Booking.com! Discover amazing travel packages and plan your next adventure.';
      case 'agency':
        return 'Welcome to your Agency Dashboard! Manage your travel packages and bookings.';
      case 'admin':
        return 'Welcome to the Admin Dashboard! Monitor platform performance and manage users.';
      default:
        return 'Welcome to Booking.com!';
    }
  };

  const getQuickActions = () => {
    switch (userRole) {
      case 'customer':
        return [
          { title: 'Browse Packages', icon: Package, description: 'Explore travel packages', action: 'packages' },
          { title: 'My Bookings', icon: MapPin, description: 'View your bookings', action: 'bookings' },
          { title: 'Agent Profile', icon: User, description: 'View travel agent profile', action: 'agent-profile' },
          { title: 'Reviews', icon: Star, description: 'Write reviews', action: 'reviews' }
        ];
      case 'agency':
        return [
          { title: 'Manage Packages', icon: Package, description: 'Create and edit packages', action: 'manage-packages' },
          { title: 'View Bookings', icon: Users, description: 'Monitor bookings', action: 'view-bookings' },
          { title: 'Analytics', icon: TrendingUp, description: 'View performance', action: 'analytics' }
        ];
      case 'admin':
        return [
          { title: 'Manage Users', icon: Users, description: 'User management', action: 'manage-users' },
          { title: 'Platform Stats', icon: TrendingUp, description: 'View analytics', action: 'platform-stats' },
          { title: 'System Health', icon: Package, description: 'Monitor system', action: 'system-health' }
        ];
      default:
        return [];
    }
  };

  const handleActionClick = (action: string) => {
    if (action === 'agent-profile') {
      // Navigate to agent profile page
      window.location.href = '/agents/mountain-explorers';
    } else if (onNavigate) {
      onNavigate(action);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Booking.com</h1>
              <p className="text-sm text-gray-600 capitalize">{userRole} Dashboard</p>
            </div>
          </div>

        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-2">
                Hello, {user?.name || user?.email}! 👋
              </h2>
              <p className="text-blue-100 text-lg">
                {getWelcomeMessage()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Agents Section - Only for customers */}
        {userRole === 'customer' && (
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Featured Travel Agents</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* Mountain Explorers */}
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm sm:text-base">ME</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base text-gray-800 truncate">Mountain Explorers</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Adventure & Himalayan Tours</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3 text-xs sm:text-sm text-gray-600">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                    <span>4.8</span>
                    <span>•</span>
                    <span>1250+ trips</span>
                  </div>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => navigate('/agents/mountain-explorers')} 
                      className="w-full text-xs sm:text-sm py-2"
                    >
                      View Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-xs sm:text-sm py-2 border-green-300 text-green-700 hover:bg-green-50"
                      onClick={() => window.open('https://wa.me/918438327763', '_blank')}
                    >
                      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Kerala Dreams */}
              <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm sm:text-base">KD</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base text-gray-800 truncate">Kerala Dreams</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Backwaters & Ayurveda</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3 text-xs sm:text-sm text-gray-600">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                    <span>4.9</span>
                    <span>•</span>
                    <span>890+ trips</span>
                  </div>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => navigate('/agents/kerala-dreams')} 
                      className="w-full text-xs sm:text-sm py-2"
                    >
                      View Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-xs sm:text-sm py-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                      onClick={() => window.open('https://wa.me/919876543210', '_blank')}
                    >
                      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Rajasthan Royal */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm sm:text-base">RR</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base text-gray-800 truncate">Rajasthan Royal</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Luxury & Heritage Tours</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3 text-xs sm:text-sm text-gray-600">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                    <span>4.7</span>
                    <span>•</span>
                    <span>650+ trips</span>
                  </div>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => navigate('/agents/rajasthan-royal')} 
                      className="w-full text-xs sm:text-sm py-2"
                    >
                      View Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-xs sm:text-sm py-2 border-purple-300 text-purple-700 hover:bg-purple-50"
                      onClick={() => window.open('https://wa.me/919876543211', '_blank')}
                    >
                      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Goa Paradise */}
              <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm sm:text-base">GP</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base text-gray-800 truncate">Goa Paradise</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Beach & Party Tours</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3 text-xs sm:text-sm text-gray-600">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                    <span>4.6</span>
                    <span>•</span>
                    <span>420+ trips</span>
                  </div>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => navigate('/agents/goa-paradise')} 
                      className="w-full text-xs sm:text-sm py-2"
                    >
                      View Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-xs sm:text-sm py-2 border-orange-300 text-orange-700 hover:bg-orange-50"
                      onClick={() => window.open('https://wa.me/919876543212', '_blank')}
                    >
                      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* North East Explorer */}
              <Card className="bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm sm:text-base">NE</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base text-gray-800 truncate">North East Explorer</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Tribal & Nature Tours</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3 text-xs sm:text-sm text-gray-600">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                    <span>4.8</span>
                    <span>•</span>
                    <span>380+ trips</span>
                  </div>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => navigate('/agents/north-east-explorer')} 
                      className="w-full text-xs sm:text-sm py-2"
                    >
                      View Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-xs sm:text-sm py-2 border-teal-300 text-teal-700 hover:bg-teal-50"
                      onClick={() => window.open('https://wa.me/919876543213', '_blank')}
                    >
                      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getQuickActions().map((action, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleActionClick(action.action)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <action.icon className="w-8 h-8 text-blue-600" />
                    <h4 className="font-semibold text-gray-800">{action.title}</h4>
                  </div>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {userRole === 'customer' ? '0' : userRole === 'agency' ? '3' : '25'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {userRole === 'customer' ? 'Bookings' : userRole === 'agency' ? 'Packages' : 'Total Packages'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {userRole === 'customer' ? '0' : userRole === 'agency' ? '2' : '20'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {userRole === 'customer' ? 'Destinations' : 'Active Packages'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {userRole === 'customer' ? '0' : userRole === 'agency' ? '4.5' : '4.3'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {userRole === 'customer' ? 'Reviews' : 'Rating'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {userRole === 'customer' ? '0' : userRole === 'agency' ? '12' : '150'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {userRole === 'customer' ? 'Growth' : userRole === 'agency' ? 'Bookings' : 'Total Users'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500">No recent activity to display</p>
              <p className="text-sm text-gray-400 mt-2">Your recent actions will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;

