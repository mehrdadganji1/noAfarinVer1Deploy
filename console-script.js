// ═══════════════════════════════════════════════════════════════
// 🚀 QUICK PROMOTE - Console Script
// ═══════════════════════════════════════════════════════════════
// نحوه استفاده:
// 1. برو به http://localhost:5173/login و Login کن
// 2. F12 → Console
// 3. Copy/Paste این کل فایل رو در Console
// 4. Enter بزن
// ═══════════════════════════════════════════════════════════════

(async function() {
    const API_URL = 'http://localhost:3001';
    
    console.log('🚀 Starting Quick Promote Script...\n');
    
    // ═══════════════════════════════════════════════════════════
    // Step 1: Get Token
    // ═══════════════════════════════════════════════════════════
    console.log('📍 Step 1: دریافت Token...');
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('❌ Token پیدا نشد!');
        console.log('💡 لطفا ابتدا Login کنید: http://localhost:5173/login');
        return;
    }
    
    console.log('✅ Token پیدا شد!');
    console.log('📋 Token Preview:', token.substring(0, 50) + '...');
    console.log('');
    
    // ═══════════════════════════════════════════════════════════
    // Step 2: Get Applications
    // ═══════════════════════════════════════════════════════════
    console.log('📍 Step 2: دریافت Applications...');
    
    try {
        const appsResponse = await fetch(`${API_URL}/api/applications?status=approved&limit=10`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const appsData = await appsResponse.json();
        
        if (!appsResponse.ok) {
            console.error('❌ خطا در دریافت Applications:', appsData);
            return;
        }
        
        if (!appsData.data || appsData.data.length === 0) {
            console.warn('⚠️ هیچ Application تایید شده‌ای وجود ندارد!');
            return;
        }
        
        console.log(`✅ ${appsData.data.length} Application تایید شده پیدا شد:\n`);
        
        // Display all applications
        appsData.data.forEach((app, index) => {
            const userId = typeof app.userId === 'string' ? app.userId : (app.userId?._id || 'N/A');
            const isClubMember = app.userId?.role?.includes('club_member') || app.userId?.role?.includes('CLUB_MEMBER');
            
            console.log(`═══════════════════════════════════════════════════════════`);
            console.log(`${index + 1}. 👤 ${app.firstName} ${app.lastName}`);
            console.log(`   📧 Email: ${app.email}`);
            console.log(`   🆔 User ID: ${userId}`);
            console.log(`   🎓 دانشگاه: ${app.university || 'نامشخص'}`);
            console.log(`   ✅ Status: ${app.status}`);
            console.log(`   👥 Club Member: ${isClubMember ? 'بله ✓' : 'خیر ✗'}`);
        });
        console.log(`═══════════════════════════════════════════════════════════\n`);
        
        // ═══════════════════════════════════════════════════════════
        // Step 3: Auto-Promote First Non-Member
        // ═══════════════════════════════════════════════════════════
        
        // Find first non-club-member
        const targetApp = appsData.data.find(app => {
            const isClubMember = app.userId?.role?.includes('club_member') || app.userId?.role?.includes('CLUB_MEMBER');
            return !isClubMember;
        });
        
        if (!targetApp) {
            console.log('✅ همه کاربران تایید شده، قبلا عضو باشگاه شده‌اند!');
            console.log('\n💡 برای seed کردن MemberProfile ها، این دستور رو اجرا کن:');
            console.log('fetch("http://localhost:3001/api/seed/member-profiles", { method: "POST", headers: { "Authorization": "Bearer " + localStorage.getItem("token") } }).then(r => r.json()).then(console.log)');
            return;
        }
        
        const userId = typeof targetApp.userId === 'string' ? targetApp.userId : targetApp.userId._id;
        
        console.log('📍 Step 3: ارتقای کاربر اول...');
        console.log(`🎯 انتخاب شده: ${targetApp.firstName} ${targetApp.lastName}`);
        console.log(`🆔 User ID: ${userId}\n`);
        
        // Ask for confirmation
        console.log('⚠️ برای ارتقا، این دستور رو اجرا کن:');
        console.log(`\npromoteUser("${userId}", "${targetApp.firstName} ${targetApp.lastName}")\n`);
        
        // Define promote function
        window.promoteUser = async function(uid, name) {
            console.log(`🚀 در حال ارتقای ${name}...`);
            
            try {
                const response = await fetch(`${API_URL}/api/membership/promote/${uid}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    console.log('✅ موفقیت!');
                    console.log('📦 Response:', data);
                } else {
                    console.error('❌ خطا:', data);
                }
            } catch (error) {
                console.error('❌ Network Error:', error);
            }
        };
        
        // Define seed function
        window.seedProfiles = async function() {
            console.log('🌱 در حال seed کردن MemberProfiles...');
            
            try {
                const response = await fetch(`${API_URL}/api/seed/member-profiles`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    console.log('✅ Seed موفق!');
                    console.log('📦 Response:', data);
                } else {
                    console.error('❌ خطا:', data);
                }
            } catch (error) {
                console.error('❌ Network Error:', error);
            }
        };
        
        console.log('💡 یا برای seed کردن همه Member Profiles:');
        console.log('seedProfiles()\n');
        
        console.log('═══════════════════════════════════════════════════════════');
        console.log('✅ Script اجرا شد! تابع‌های زیر آماده استفاده هستند:');
        console.log('   • promoteUser(userId, name) - ارتقای یک کاربر');
        console.log('   • seedProfiles() - seed کردن همه profiles');
        console.log('═══════════════════════════════════════════════════════════');
        
    } catch (error) {
        console.error('❌ خطا:', error);
    }
})();
