import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AuthPage from "@/components/AuthPage";
import CustomerDashboard from "@/components/CustomerDashboard";
import AgencyDashboard from "@/components/AgencyDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import HomePage from "@/components/HomePage";
import ProfilePage from "@/components/ProfilePage";
import BookingsPage from "@/components/BookingsPage";
import { Loader2, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const { user, loading, userRole, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'profile' | 'packages' | 'bookings' | 'reviews' | 'manage-packages' | 'view-bookings' | 'analytics' | 'manage-users' | 'platform-stats' | 'system-health'>('home');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage onSuccess={() => window.location.reload()} />;
  }

  const handleNavigation = (view: string) => {
    setCurrentView(view as any);
  };

  // Navigation component with profile button
  const NavigationTabs = () => (
    <div className="bg-white border-b px-4 py-2 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <Button
            variant={currentView === 'home' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('home')}
            className="hover-scale"
          >
            Home
          </Button>
          <Button
            variant={currentView === 'dashboard' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('dashboard')}
            className="hover-scale"
          >
            Dashboard
          </Button>
        </div>
        
        {/* Profile Section */}
        <div className="flex items-center space-x-3">
          <Button
            variant={currentView === 'profile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('profile')}
            className="flex items-center space-x-2 hover-scale"
          >
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline">Profile</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={signOut}
            className="hover-scale"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onNavigate={handleNavigation} />;
      case 'profile':
        return <ProfilePage onBack={() => setCurrentView('home')} />;
      case 'dashboard':
        switch (userRole) {
          case 'customer':
            return <CustomerDashboard />;
          case 'agency':
            return <AgencyDashboard />;
          case 'admin':
            return <AdminDashboard />;
          default:
            return <CustomerDashboard />;
        }
      case 'packages':
        return <CustomerDashboard />;
      case 'bookings':
        return <BookingsPage onBack={() => setCurrentView('home')} />;
      case 'reviews':
        return <ReviewsPage onBack={() => setCurrentView('home')} />;
      case 'manage-packages':
        return <ManagePackagesPage onBack={() => setCurrentView('home')} />;
      case 'view-bookings':
        return <ViewBookingsPage onBack={() => setCurrentView('home')} />;
      case 'analytics':
        return <AnalyticsPage onBack={() => setCurrentView('home')} />;
      case 'manage-users':
        return <ManageUsersPage onBack={() => setCurrentView('home')} />;
      case 'platform-stats':
        return <PlatformStatsPage onBack={() => setCurrentView('home')} />;
      case 'system-health':
        return <SystemHealthPage onBack={() => setCurrentView('home')} />;
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen">
      <NavigationTabs />
      {renderContent()}
    </div>
  );
};

// Placeholder components for the new pages
const ReviewsPage = ({ onBack }: { onBack: () => void }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="bg-white shadow-sm border-b px-4 py-3">
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">Reviews</h1>
      </div>
    </div>
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Write Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Review functionality coming soon!</p>
            <p className="text-sm text-gray-400 mt-2">You'll be able to write and manage your reviews here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const ManagePackagesPage = ({ onBack }: { onBack: () => void }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="bg-white shadow-sm border-b px-4 py-3">
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">Manage Packages</h1>
      </div>
    </div>
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create and Edit Packages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Package management coming soon!</p>
            <p className="text-sm text-gray-400 mt-2">You'll be able to create and edit travel packages here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const ViewBookingsPage = ({ onBack }: { onBack: () => void }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="bg-white shadow-sm border-b px-4 py-3">
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">View Bookings</h1>
      </div>
    </div>
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Monitor Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Booking monitoring coming soon!</p>
            <p className="text-sm text-gray-400 mt-2">You'll be able to monitor all bookings here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const AnalyticsPage = ({ onBack }: { onBack: () => void }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="bg-white shadow-sm border-b px-4 py-3">
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">Analytics</h1>
      </div>
    </div>
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>View Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Analytics dashboard coming soon!</p>
            <p className="text-sm text-gray-400 mt-2">You'll be able to view performance metrics here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const ManageUsersPage = ({ onBack }: { onBack: () => void }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="bg-white shadow-sm border-b px-4 py-3">
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">Manage Users</h1>
      </div>
    </div>
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">User management coming soon!</p>
            <p className="text-sm text-gray-400 mt-2">You'll be able to manage all users here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const PlatformStatsPage = ({ onBack }: { onBack: () => void }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="bg-white shadow-sm border-b px-4 py-3">
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">Platform Stats</h1>
      </div>
    </div>
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>View Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Platform analytics coming soon!</p>
            <p className="text-sm text-gray-400 mt-2">You'll be able to view platform statistics here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const SystemHealthPage = ({ onBack }: { onBack: () => void }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="bg-white shadow-sm border-b px-4 py-3">
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">System Health</h1>
      </div>
    </div>
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Monitor System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">System monitoring coming soon!</p>
            <p className="text-sm text-gray-400 mt-2">You'll be able to monitor system health here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default Index;
