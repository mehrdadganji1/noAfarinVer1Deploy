import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useDevStore } from '@/store/devStore'
import { usePermission } from '@/hooks/usePermission'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { filterNavigationByRole } from '@/config/navigation'
import { filterApplicantNavigation } from '@/utils/filterApplicantNavigation'
import { useApplicationGuard } from '@/hooks/useApplicationGuard'
import RoleBadge from '@/components/RoleBadge'
import RoleSwitcher from '@/components/RoleSwitcher'
import NotificationCenter from '@/components/NotificationCenter'
import { useSocket } from '@/hooks/useSocket'
import { LogOut, ChevronDown, PanelLeftClose, PanelLeftOpen, Sparkles, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { UserRole } from '@/types/roles'
import { motion, AnimatePresence } from 'framer-motion'

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const setOverrideRole = useDevStore((state) => state.setOverrideRole)
  const { role, roles, permissions } = usePermission()
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    'خانه',
    'فعالیت‌ها',
    'پیشرفت و رقابت',
    'شبکه و همکاری',
    'ارتباطات',
    'ارزیابی',
    'مالی',
    'منتورینگ و داوری',
    'مدیریت',
    'مدیریت ارشد'
  ])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])
  
  // Initialize Socket.io connection
  useSocket()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    )
  }

  const handleRoleChange = (newRole: UserRole) => {
    setOverrideRole(newRole)
  }

  // Check if user is admin
  const isAdmin = roles.includes(UserRole.ADMIN)

  // Get application guard status for applicants
  const { hasSubmittedApplication } = useApplicationGuard()

  // Filter navigation by role first
  let navigationGroups = filterNavigationByRole(roles, permissions)
  
  // Then filter for applicants based on application submission status
  navigationGroups = filterApplicantNavigation(
    navigationGroups, 
    hasSubmittedApplication || false, // Default to false if undefined
    user?.role || []
  )

  return (
    <div className="h-screen overflow-hidden bg-gray-100" dir="rtl">
      <div className="flex h-full">
        {/* Mobile Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Ultra Premium Dark Sidebar */}
        <div className={`
          ${isMobile ? 'fixed inset-y-0 right-0 z-50' : 'p-3 flex-shrink-0'}
          transition-transform duration-300 ease-in-out
          ${isMobile && !mobileMenuOpen ? 'translate-x-full' : 'translate-x-0'}
        `}>
          <motion.aside
            animate={{ 
              width: isMobile ? 280 : (sidebarCollapsed ? 80 : 280),
            }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.8
            }}
            className={`
              relative overflow-hidden shadow-2xl
              ${isMobile 
                ? 'h-full w-[280px] rounded-l-2xl' 
                : 'h-[calc(100vh-97px)] rounded-2xl sticky top-3'
              }
            `}
          >
          {/* Background - Light for Admin, Dark for others */}
          {isAdmin ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 rounded-2xl border-l border-gray-200" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/30 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-[#1a1d2e] rounded-2xl" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-600/5 rounded-full blur-3xl" />
            </>
          )}
          
          {/* Top Border Accent */}
          <div className={`absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent ${isAdmin ? 'via-purple-300/50' : 'via-violet-500/30'} to-transparent`} />

          {/* Minimal Toggle Button */}
          <div className="sticky top-0 z-50 relative">
            <div className="relative p-4 flex items-center justify-between">
              <AnimatePresence mode="wait">
                {(!sidebarCollapsed || isMobile) && (
                  <motion.div
                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.9 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }}
                    className="flex items-center gap-2"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg ${isAdmin ? 'bg-gradient-to-br from-purple-500 to-blue-500 shadow-purple-500/20' : 'bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-violet-500/20'}`}>
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className={`text-xs font-bold tracking-wide ${isAdmin ? 'text-gray-800' : 'text-white/90'}`}>{isAdmin ? 'پنل مدیریت' : 'منوی اصلی'}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {isMobile ? (
                <motion.button
                  onClick={() => setMobileMenuOpen(false)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors border ${isAdmin ? 'bg-gray-100 hover:bg-gray-200 border-gray-200' : 'bg-white/5 hover:bg-white/10 border-white/10'}`}
                >
                  <X className={`h-4 w-4 ${isAdmin ? 'text-gray-600' : 'text-white/70'}`} />
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors border ${isAdmin ? 'bg-gray-100 hover:bg-gray-200 border-gray-200' : 'bg-white/5 hover:bg-white/10 border-white/10'}`}
                >
                  <motion.div
                    animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                  >
                    {sidebarCollapsed ? (
                      <PanelLeftOpen className={`h-4 w-4 ${isAdmin ? 'text-gray-600' : 'text-white/70'}`} />
                    ) : (
                      <PanelLeftClose className={`h-4 w-4 ${isAdmin ? 'text-gray-600' : 'text-white/70'}`} />
                    )}
                  </motion.div>
                </motion.button>
              )}
            </div>
          </div>

          {/* Minimal User Profile */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative px-4 pb-4 mb-2"
          >
            {isAdmin ? (
              /* Admin Light Theme User Profile */
              <div className={`${!sidebarCollapsed ? 'bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-3 border border-purple-100' : ''}`}>
                <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-2'}`}>
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-bold">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </span>
                  </div>
                  <AnimatePresence mode="wait">
                    {(!sidebarCollapsed || isMobile) && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 min-w-0"
                      >
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {user?.email}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              /* Dark Theme User Profile */
              <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full blur-sm opacity-40" />
                  <Avatar className="relative h-10 w-10 ring-1 ring-white/10">
                    <AvatarFallback className="bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white text-sm font-bold">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#1a1d2e]" />
                </motion.div>
                
                <AnimatePresence mode="wait">
                  {(!sidebarCollapsed || isMobile) && (
                    <motion.div
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -20, scale: 0.95 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 400,
                        damping: 25
                      }}
                      className="flex-1 min-w-0"
                    >
                      <p className="text-sm font-bold text-white/90 truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <div className="inline-flex items-center gap-1.5 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] text-white/50 font-medium">متقاضی</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Ultra Modern Navigation */}
          <nav className={`
            relative p-4 space-y-3 overflow-y-auto custom-scrollbar
            ${isMobile ? 'h-[calc(100vh-200px)]' : 'h-[calc(100vh-280px)]'}
          `}>
            {navigationGroups.map((group, groupIndex) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: groupIndex * 0.06, 
                  duration: 0.4, 
                  ease: "easeOut"
                }}
                className="space-y-1"
              >
                {(!sidebarCollapsed || isMobile) && (
                  <motion.button
                    onClick={() => toggleGroup(group.title)}
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className={`flex items-center justify-between w-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${isAdmin ? 'text-gray-400 hover:text-gray-600' : 'text-white/40 hover:text-white/60'}`}
                  >
                    <span>{group.title}</span>
                    <motion.div
                      animate={{ rotate: expandedGroups.includes(group.title) ? 180 : 0 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }}
                    >
                      <ChevronDown className="h-3 w-3" />
                    </motion.div>
                  </motion.button>
                )}
                
                <AnimatePresence initial={false}>
                  {(expandedGroups.includes(group.title) || sidebarCollapsed) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                        mass: 0.8
                      }}
                      className={`space-y-1 overflow-hidden ${sidebarCollapsed ? '' : 'pt-1'}`}
                    >
                      {group.items.map((item, itemIndex) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.path
                        return (
                          <motion.div
                            key={item.path}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ 
                              delay: itemIndex * 0.03, 
                              duration: 0.25,
                              ease: "easeOut"
                            }}
                          >
                            <Link to={item.path}>
                              <motion.div
                                whileHover={{ x: sidebarCollapsed ? 0 : 3 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                className={`
                                  relative group
                                  ${sidebarCollapsed ? 'flex items-center justify-center' : 'flex items-center gap-3'}
                                  px-3 py-2.5 rounded-lg
                                  transition-all duration-200
                                  ${isAdmin
                                    ? isActive 
                                      ? 'bg-gradient-to-l from-purple-100 to-blue-100 text-purple-700 shadow-sm' 
                                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                    : isActive 
                                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20' 
                                      : 'text-white/60 hover:text-white hover:bg-white/5'
                                  }
                                `}
                              >
                                {/* Active Indicator */}
                                {isActive && !isAdmin && (
                                  <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                  />
                                )}
                                {isActive && isAdmin && !sidebarCollapsed && (
                                  <motion.div
                                    layoutId="activeTabAdmin"
                                    className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-l-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                  />
                                )}
                                
                                {/* Icon */}
                                <div className={`relative z-10 ${isAdmin ? 'p-1.5 rounded-lg transition-colors' : ''} ${isAdmin && isActive ? 'bg-white shadow-sm' : isAdmin ? 'group-hover:bg-white/50' : ''}`}>
                                  <Icon className={`h-[18px] w-[18px] flex-shrink-0 transition-colors ${
                                    isAdmin
                                      ? isActive ? 'text-purple-700' : 'text-gray-600 group-hover:text-gray-800'
                                      : isActive ? 'text-white' : 'text-white/60 group-hover:text-white'
                                  }`} />
                                </div>
                                
                                {/* Label */}
                                <AnimatePresence mode="wait">
                                  {(!sidebarCollapsed || isMobile) && (
                                    <motion.span
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: -10 }}
                                      transition={{ 
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 25
                                      }}
                                      className="relative z-10 flex-1 text-right text-[13px] font-medium"
                                    >
                                      {item.label}
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                                
                                {/* Badge */}
                                {item.badge && (!sidebarCollapsed || isMobile) && (
                                  <div className="relative z-10">
                                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[18px] text-center">
                                      {item.badge}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Tooltip for Collapsed */}
                                {sidebarCollapsed && !isMobile && (
                                  <div className={`absolute left-full ml-2 px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl ${isAdmin ? 'bg-white text-gray-800 border border-gray-200' : 'bg-[#2a2d3e] text-white border border-white/10'}`}>
                                    {item.label}
                                    <div className={`absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent ${isAdmin ? 'border-l-white' : 'border-l-[#2a2d3e]'}`} />
                                  </div>
                                )}
                              </motion.div>
                            </Link>
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </nav>

          {/* Footer with Logout for Admin */}
          <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${isAdmin ? 'border-gray-200 bg-white/80' : 'border-white/5 bg-[#1a1d2e]/80'} backdrop-blur-sm space-y-3`}>
            {/* Logout Button for Admin */}
            {isAdmin && (
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-700 rounded-xl transition-all text-sm font-medium shadow-sm hover:shadow group ${sidebarCollapsed && !isMobile ? 'justify-center px-2' : ''}`}
                title={sidebarCollapsed ? "خروج از حساب" : undefined}
              >
                <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <AnimatePresence>
                  {(!sidebarCollapsed || isMobile) && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap"
                    >
                      خروج از حساب
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )}
            
            {/* Copyright */}
            <AnimatePresence mode="wait">
              {(!sidebarCollapsed || isMobile) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }}
                >
                  <p className={`text-center text-[10px] font-medium ${isAdmin ? 'text-gray-400' : 'text-white/30'}`}>
                    نوآفرین © 2024
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          </motion.aside>
        </div>

        {/* Main Content with Header */}
        <div className="flex-1 flex flex-col h-full">
          {/* Ultra Modern Premium Header - Hidden for Admin */}
          {!isAdmin && (
          <header className="relative bg-gradient-to-b from-[#1a1d2e] to-[#151824] border-b border-white/5 sticky top-0 z-30 backdrop-blur-xl">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-transparent to-fuchsia-600/5 opacity-50" />
            
            {/* Subtle Top Border Glow */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
            
            <div className="relative px-4 lg:px-8 py-4">
              <div className="flex items-center justify-between gap-4">
                {/* Right Section - Mobile Menu + Logo */}
                <div className="flex items-center gap-3">
                  {/* Mobile Menu Button */}
                  {isMobile && (
                    <motion.button
                      onClick={() => setMobileMenuOpen(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-11 h-11 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 flex items-center justify-center transition-all border border-white/10 shadow-lg lg:hidden backdrop-blur-sm"
                    >
                      <Menu className="h-5 w-5 text-white/90" />
                    </motion.button>
                  )}

                  {/* Logo & Brand */}
                  <Link to="/" className="flex items-center gap-3 group">
                    <motion.div
                      whileHover={{ scale: 1.08, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="relative"
                    >
                      {/* Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity" />
                      
                      {/* Logo Container */}
                      <div className="relative w-12 h-12 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-500/30 ring-1 ring-white/20">
                        <span className="text-white font-black text-xl">ن</span>
                      </div>
                    </motion.div>
                    
                    <div className="hidden sm:block">
                      <h1 className="text-base lg:text-lg font-black text-white leading-tight tracking-tight">
                        پلتفرم نوآفرین
                      </h1>
                      <p className="text-[10px] lg:text-xs text-white/40 font-medium">
                        طرح ملی توان‌افزایی هسته‌های فناور
                      </p>
                    </div>
                  </Link>
                </div>

                {/* Left Section - Actions */}
                <div className="flex items-center gap-2 lg:gap-3">
                  {/* Role Switcher - Hidden on mobile */}
                  <div className="hidden md:block">
                    <RoleSwitcher onRoleChange={handleRoleChange} />
                  </div>
                  
                  {/* Notification Center */}
                  <NotificationCenter />
                  
                  {/* User Profile Card - Desktop */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-white/20 transition-all shadow-lg backdrop-blur-sm cursor-pointer"
                  >
                    <div className="text-right">
                      <p className="text-sm font-bold text-white leading-tight">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <RoleBadge role={role} className="text-[10px] mt-0.5" />
                    </div>
                    
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="relative"
                    >
                      {/* Avatar Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl blur-md opacity-50" />
                      
                      {/* Avatar */}
                      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-sm shadow-xl ring-2 ring-white/20">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                      </div>
                      
                      {/* Online Status */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#1a1d2e] shadow-lg" />
                    </motion.div>
                  </motion.div>

                  {/* Mobile User Avatar Only */}
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="sm:hidden relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl blur-md opacity-50" />
                    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-sm shadow-xl ring-2 ring-white/20">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#1a1d2e]" />
                  </motion.div>

                  {/* Logout Button */}
                  <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-600/10 hover:from-red-500/20 hover:to-red-600/20 flex items-center justify-center transition-all border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 shadow-lg backdrop-blur-sm group"
                  >
                    <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  </motion.button>
                </div>
              </div>
            </div>
            
            {/* Bottom Border Glow */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
          </header>
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
