import { Link } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer 
      className="text-white relative"
      style={{
        background: 'linear-gradient(180deg, #0f0520 0%, #0a0315 50%, #050108 100%)',
        boxShadow: 'inset 0 1px 0 rgba(139, 92, 246, 0.1)',
      }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">آکادمی نوآفرین</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
              پلتفرم نوآوری و شتاب‌دهی برای توسعه ایده‌ها و کسب‌وکارهای فناورانه
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold">دسترسی سریع</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-purple-400 transition" style={{ color: '#9ca3af' }}>درباره ما</Link></li>
              <li><Link to="/events" className="hover:text-purple-400 transition" style={{ color: '#9ca3af' }}>رویدادها</Link></li>
              <li><Link to="/courses" className="hover:text-purple-400 transition" style={{ color: '#9ca3af' }}>دوره‌ها</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-bold">تماس با ما</h4>
            <ul className="space-y-2 text-sm" style={{ color: '#9ca3af' }}>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@noafarin.ir</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="font-bold">شبکه‌های اجتماعی</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition" style={{ backgroundColor: '#1a0b2e' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7c4ab3'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1a0b2e'}>
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 text-center text-sm" style={{ borderTop: '1px solid rgba(158, 96, 230, 0.2)', color: '#9ca3af' }}>
          <p>© 2025 تمامی حقوق برای کیا نو تجارت افرا محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
