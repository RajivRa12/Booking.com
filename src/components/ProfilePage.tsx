import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  MapPin, 
  Calendar, 
  Star, 
  Camera, 
  MessageCircle,
  Settings,
  ArrowLeft,
  Edit
} from "lucide-react";

const ProfilePage = ({ onBack }: { onBack: () => void }) => {
  const { user, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState('activity');

  // Mock user stats based on role
  const userStats = {
    customer: {
      placesVisited: 24,
      reviewsWritten: 18,
      photosShared: 45,
      bookingsMade: 32
    },
    agency: {
      packagesCreated: 15,
      totalBookings: 128,
      averageRating: 4.7,
      yearsActive: 3
    },
    admin: {
      totalUsers: 1250,
      totalPackages: 89,
      totalBookings: 456,
      systemUptime: 99.9
    }
  };

  const stats = userStats[userRole as keyof typeof userStats] || userStats.customer;

  const recentActivities = [
    { icon: Star, title: "Reviewed Sunset Point Cafe", time: "2 days ago", type: "review" },
    { icon: Calendar, title: "Booked Paragliding Adventure", time: "1 week ago", type: "booking" },
    { icon: Camera, title: "Added photos to Mountain View Restaurant", time: "2 weeks ago", type: "photos" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-gray-800">Profile</h1>
          <div className="flex-1" />
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Profile Header */}
        <Card className="animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl font-bold bg-blue-100 text-blue-600">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                >
                  <Camera className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {user?.name || 'User'}
                  </h2>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
                
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Mumbai, Maharashtra</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Member since 7/4/2025</span>
                  </div>
                </div>
                
                {userRole === 'customer' && (
                  <div className="mt-3">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Star className="h-3 w-3 mr-1" />
                      Verified Traveler
                    </Badge>
                  </div>
                )}
                
                <p className="mt-4 text-gray-700">
                  Travel enthusiast who loves exploring new places and trying local cuisines. 
                  Always looking for the next adventure!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats).map(([key, value], index) => (
            <Card key={key} className="animate-slide-in-right hover-scale" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {typeof value === 'number' ? value : value}
                </div>
                <div className="text-sm text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation Tabs */}
        <Card>
          <CardContent className="p-0">
            <div className="flex border-b">
              {['activity', 'achievements', 'preferences', 'help'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 px-4 text-center capitalize transition-colors ${
                    activeTab === tab 
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        {activeTab === 'activity' && (
          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors animate-slide-in-right"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <activity.icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Other tab content placeholders */}
        {activeTab !== 'activity' && (
          <Card className="animate-fade-in">
            <CardContent className="p-6 text-center">
              <p className="text-gray-500 capitalize">{activeTab} content coming soon...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
