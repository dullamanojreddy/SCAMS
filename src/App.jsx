import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ScheduleCard } from './components/ScheduleCard';
import { QuickActionsCard } from './components/QuickActionsCard';
import { CampusMapCard } from './components/CampusMapCard';
import { NoticesCard } from './components/NoticesCard';
import { FoodOrdersCard } from './components/FoodOrdersCard';
import { EventsCard } from './components/EventsCard';
import { MetricCards } from './components/MetricCards';
import { AIAssistantWidget } from './components/AIAssistantWidget';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AuthScreen } from './components/AuthScreen';
import { USER_PROFILE, USER_ROLES } from './data/mockData';
import { canAccessFeature } from './data/roleAccess';

// SRS Interactive Modals
import { StudentIdModal } from './components/StudentIdModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { FullMapModal } from './components/FullMapModal';
import { TimetableModal } from './components/TimetableModal';
import { FoodMenuModal } from './components/FoodMenuModal';
import { ComplaintsModal } from './components/ComplaintsModal';
import { NoticesModal } from './components/NoticesModal';
import { LibraryModal } from './components/LibraryModal';
import { CommunityModal } from './components/CommunityModal';
import { PlacementsModal } from './components/PlacementsModal';
import { EventsModal } from './components/EventsModal';
import { FeedbackModal } from './components/FeedbackModal';
import { SRSModal } from './components/SRSModal';
import { LocalSetupModal } from './components/LocalSetupModal';
import { AdminControlModal } from './components/AdminControlModal';
import { FacultyPortalModal } from './components/FacultyPortalModal';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const savedAuth = localStorage.getItem('campus_os_auth');
      return savedAuth !== 'false';
    } catch {
      return true;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('campus_os_user');
      return savedUser ? JSON.parse(savedUser) : USER_PROFILE;
    } catch {
      return USER_PROFILE;
    }
  });

  const [activeTab, setActiveTab] = useState('home');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState('3');
  const [selectedBuildingId, setSelectedBuildingId] = useState('ramanujan');

  // SRS Modal States
  const [isSRSOpen, setIsSRSOpen] = useState(false);
  const [isIdModalOpen, setIsIdModalOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isFullMapOpen, setIsFullMapOpen] = useState(false);
  const [isTimetableOpen, setIsTimetableOpen] = useState(false);
  const [isFoodMenuOpen, setIsFoodMenuOpen] = useState(false);
  const [isComplaintsOpen, setIsComplaintsOpen] = useState(false);
  const [isNoticesOpen, setIsNoticesOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isPlacementsOpen, setIsPlacementsOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isLocalDbModalOpen, setIsLocalDbModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState('users');
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [facultyActiveTab, setFacultyActiveTab] = useState('queries');
  const currentRole = currentUser?.role || 'Student';
  const isStudent = currentRole === 'Student';

  const handleLoginSuccess = (userData) => {
    const user = userData || USER_PROFILE;
    setCurrentUser(user);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('campus_os_auth', 'true');
      localStorage.setItem('campus_os_user', JSON.stringify(user));
    } catch (e) {
      console.warn('Storage not available', e);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.setItem('campus_os_auth', 'false');
    } catch (e) {
      console.warn('Storage not available', e);
    }
  };

  const handleSwitchRole = (roleKey) => {
    let targetUser = USER_ROLES.STUDENT;
    if (roleKey === 'student' || roleKey === 'STUDENT') {
      targetUser = USER_ROLES.STUDENT;
    } else if (roleKey === 'student_bhavesh' || roleKey === 'STUDENT_BHAVESH') {
      targetUser = USER_ROLES.STUDENT_BHAVESH;
    } else if (roleKey === 'faculty' || roleKey === 'FACULTY') {
      targetUser = USER_ROLES.FACULTY;
    } else if (roleKey === 'admin' || roleKey === 'ADMIN') {
      targetUser = USER_ROLES.ADMIN;
    } else if (USER_ROLES[roleKey]) {
      targetUser = USER_ROLES[roleKey];
    }
    setCurrentUser(targetUser);
    setActiveTab('home');
    setIsAdminModalOpen(false);
    setIsFacultyModalOpen(false);
    setIsNoticesOpen(false);
    setIsComplaintsOpen(false);
    setIsFoodMenuOpen(false);
    setIsLibraryOpen(false);
    setIsCommunityOpen(false);
    setIsPlacementsOpen(false);
    setIsTimetableOpen(false);
    setIsFullMapOpen(false);
    try {
      localStorage.setItem('campus_os_user', JSON.stringify(targetUser));
    } catch {
      // ignore
    }
  };

  const handleQuickAction = (actionId) => {
    const featureId = actionId === 'report-issue' ? 'complaints' : actionId;
    if (featureId !== 'home' && !canAccessFeature(currentRole, featureId)) {
      return;
    }

    switch (actionId) {
      case 'srs':
        setIsSRSOpen(true);
        break;
      case 'local-db':
      case 'database':
      case 'postgres':
        setIsLocalDbModalOpen(true);
        break;
      case 'admin-console':
      case 'admin-users':
        setAdminActiveTab('users');
        setIsAdminModalOpen(true);
        break;
      case 'admin-emergency':
        setAdminActiveTab('emergency');
        setIsAdminModalOpen(true);
        break;
      case 'admin-complaints':
        setAdminActiveTab('complaints');
        setIsAdminModalOpen(true);
        break;
      case 'admin-canteen':
        setAdminActiveTab('canteen');
        setIsAdminModalOpen(true);
        break;
      case 'admin-library':
        setAdminActiveTab('library');
        setIsAdminModalOpen(true);
        break;
      case 'admin-moderation':
        setAdminActiveTab('moderation');
        setIsAdminModalOpen(true);
        break;
      case 'admin-placements':
        setAdminActiveTab('placements');
        setIsAdminModalOpen(true);
        break;
      case 'admin-audit':
        setAdminActiveTab('audit');
        setIsAdminModalOpen(true);
        break;
      case 'faculty-portal':
      case 'faculty-queries':
        setFacultyActiveTab('queries');
        setIsFacultyModalOpen(true);
        break;
      case 'faculty-notices':
        setFacultyActiveTab('notices');
        setIsFacultyModalOpen(true);
        break;
      case 'food':
        setIsFoodMenuOpen(true);
        break;
      case 'map':
        setIsFullMapOpen(true);
        break;
      case 'library':
        setIsLibraryOpen(true);
        break;
      case 'placements':
        setIsPlacementsOpen(true);
        break;
      case 'community':
        setIsCommunityOpen(true);
        break;
      case 'complaints':
      case 'report-issue':
        setIsComplaintsOpen(true);
        break;
      case 'notices':
        setIsNoticesOpen(true);
        break;
      case 'timetable':
        setIsTimetableOpen(true);
        break;
      case 'student-id':
      case 'id-card':
      case 'bookings':
        setIsIdModalOpen(true);
        break;
      case 'feedback':
        setIsFeedbackOpen(true);
        break;
      case 'events':
        setIsEventsOpen(true);
        break;
      case 'logout':
        handleLogout();
        break;
      case 'ai-assistant':
        document.getElementById('ai-chat-input')?.focus();
        break;
      default:
        break;
    }
  };

  const handleMetricCardClick = (metricId) => {
    switch (metricId) {
      case 'metric-food': // Active Canteen Orders
      case 'metric-1':
        if (!canAccessFeature(currentRole, 'food')) return;
        setIsTrackOrderOpen(true);
        break;
      case 'metric-complaints': // Complaints / Helpdesk
      case 'metric-2':
        if (!canAccessFeature(currentRole, 'complaints')) return;
        setIsComplaintsOpen(true);
        break;
      case 'metric-3':
        if (!canAccessFeature(currentRole, 'events')) return;
        setIsEventsOpen(true);
        break;
      case 'metric-4':
        if (!canAccessFeature(currentRole, 'notices')) return;
        setIsNoticesOpen(true);
        break;
      case 'metric-library': // Library Books
        if (!canAccessFeature(currentRole, 'library')) return;
        setIsLibraryOpen(true);
        break;
      case 'metric-placements': // Placements Database
        if (!canAccessFeature(currentRole, 'placements')) return;
        setIsPlacementsOpen(true);
        break;
      default:
        break;
    }
  };

  // If not logged in, show the Campus OS / SCAM Login & Registration Screen
  if (!isAuthenticated) {
    return (
      <AuthScreen
        onLoginSuccess={handleLoginSuccess}
        defaultUser={currentUser || USER_PROFILE}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f0f2f7] dark:bg-[#000000] text-slate-800 dark:text-neutral-100 font-sans selection:bg-lime-300 selection:text-slate-900 animate-fadeIn transition-colors duration-200">
      {/* 1. Left Sidebar (Fixed on Desktop, Slide-over Drawer on Mobile) */}
      <Sidebar
        activeTab={activeTab}
        isOpen={isMobileSidebarOpen}
        currentUser={currentUser}
        onClose={() => setIsMobileSidebarOpen(false)}
        onLogout={handleLogout}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsMobileSidebarOpen(false);
        }}
        onOpenIdModal={() => {
          setIsIdModalOpen(true);
          setIsMobileSidebarOpen(false);
        }}
        onOpenActionModal={(action) => {
          handleQuickAction(action);
          setIsMobileSidebarOpen(false);
        }}
      />

      {/* Main Container: Center Dashboard + Right Column */}
      <main className="flex-1 min-w-0 p-4 lg:p-6 pb-24 lg:pb-6 overflow-x-hidden">
        <div className="max-w-[1600px] mx-auto flex flex-col 2xl:flex-row gap-6">
          {/* 2. Center Main Dashboard Area */}
          <div className="flex-1 min-w-0">
            {/* Top Greeting Header */}
            <Header
              currentUser={currentUser}
              onOpenNotifications={isStudent ? () => setIsNoticesOpen(true) : undefined}
              onOpenScanner={isStudent ? () => setIsIdModalOpen(true) : undefined}
              onOpenSRS={isStudent ? () => setIsSRSOpen(true) : undefined}
              onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
            />

            {/* Top Row: 3 Grid Cards */}
            {isStudent && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Card 1: Today's Schedule */}
              <div className="min-h-[320px] flex flex-col">
                <ScheduleCard
                  onViewTimetable={() => setIsTimetableOpen(true)}
                  onSelectClass={() => setIsTimetableOpen(true)}
                />
              </div>

              {/* Card 2: Quick Actions (SRS Modules) */}
              <div className="min-h-[320px] flex flex-col">
                <QuickActionsCard onActionClick={handleQuickAction} />
              </div>

              {/* Card 3: Campus Map */}
              <div className="min-h-[320px] flex flex-col">
                <CampusMapCard
                  onExploreFullMap={() => setIsFullMapOpen(true)}
                  onSelectBuilding={(building) => {
                    setSelectedBuildingId(building.id);
                    setIsFullMapOpen(true);
                  }}
                  selectedFloor={selectedFloor}
                  onFloorChange={setSelectedFloor}
                />
              </div>
            </div>}

            {/* Middle Row: 3 Grid Cards */}
            {isStudent && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
              {/* Card 4: Notices & Announcements */}
              <div className="min-h-[320px] flex flex-col">
                <NoticesCard
                  onViewAll={() => setIsNoticesOpen(true)}
                  onSelectNotice={() => setIsNoticesOpen(true)}
                />
              </div>

              {/* Card 5: Food Orders */}
              <div className="min-h-[320px] flex flex-col">
                <FoodOrdersCard
                  onViewAll={() => setIsFoodMenuOpen(true)}
                  onTrackOrder={() => setIsTrackOrderOpen(true)}
                  onReorder={() => setIsFoodMenuOpen(true)}
                />
              </div>

              {/* Card 6: Upcoming Events */}
              <div className="min-h-[320px] flex flex-col">
                <EventsCard
                  onViewAll={() => setIsEventsOpen(true)}
                  onSelectEvent={() => setIsEventsOpen(true)}
                />
              </div>
            </div>}

            {/* Bottom Row: 4 Metric Cards */}
            {isStudent && <MetricCards onCardClick={handleMetricCardClick} />}
          </div>

          {/* 3. Right Column: AI Assistant */}
          {isStudent && <div className="w-full 2xl:w-[350px] shrink-0 flex flex-col gap-6">
            {/* AI Assistant Widget */}
            <div className="h-full">
              <AIAssistantWidget
                onHighlightLocation={(buildingId) => {
                  setSelectedBuildingId(buildingId);
                  setIsFullMapOpen(true);
                }}
                onPlaceOrder={() => setIsTrackOrderOpen(true)}
              />
            </div>
          </div>}
        </div>
      </main>

      {/* Native Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        currentUser={currentUser}
        onSelectTab={setActiveTab}
        onOpenAction={handleQuickAction}
      />

      {/* Interactive Modals for SCAM SRS Modules */}
      <StudentIdModal
        isOpen={isIdModalOpen}
        currentUser={currentUser}
        onClose={() => setIsIdModalOpen(false)}
      />

      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
      />

      <FullMapModal
        isOpen={isFullMapOpen}
        onClose={() => setIsFullMapOpen(false)}
        selectedBuildingId={selectedBuildingId}
      />

      <TimetableModal
        isOpen={isTimetableOpen}
        onClose={() => setIsTimetableOpen(false)}
      />

      <FoodMenuModal
        isOpen={isFoodMenuOpen}
        currentUser={currentUser}
        onClose={() => setIsFoodMenuOpen(false)}
        onOrderPlaced={() => setIsTrackOrderOpen(true)}
      />

      <ComplaintsModal
        isOpen={isComplaintsOpen}
        currentUser={currentUser}
        onClose={() => setIsComplaintsOpen(false)}
      />

      <NoticesModal
        isOpen={isNoticesOpen}
        currentUser={currentUser}
        onClose={() => setIsNoticesOpen(false)}
      />

      <LibraryModal
        isOpen={isLibraryOpen}
        currentUser={currentUser}
        onClose={() => setIsLibraryOpen(false)}
      />

      <CommunityModal
        isOpen={isCommunityOpen}
        currentUser={currentUser}
        onClose={() => setIsCommunityOpen(false)}
      />

      <PlacementsModal
        isOpen={isPlacementsOpen}
        currentUser={currentUser}
        onClose={() => setIsPlacementsOpen(false)}
      />

      <EventsModal
        isOpen={isEventsOpen}
        onClose={() => setIsEventsOpen(false)}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      <LocalSetupModal
        isOpen={isLocalDbModalOpen}
        onClose={() => setIsLocalDbModalOpen(false)}
      />

      <AdminControlModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        initialTab={adminActiveTab}
      />

      <FacultyPortalModal
        isOpen={isFacultyModalOpen}
        onClose={() => setIsFacultyModalOpen(false)}
        initialTab={facultyActiveTab}
        currentUser={currentUser}
      />

      <SRSModal
        isOpen={isSRSOpen}
        onClose={() => setIsSRSOpen(false)}
        currentUser={currentUser}
        onSwitchUser={handleSwitchRole}
        onLaunchModule={(moduleKey) => handleQuickAction(moduleKey)}
      />
    </div>
  );
}
