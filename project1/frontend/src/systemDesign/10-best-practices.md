# 💎 بهترین شیوه‌ها

## معماری کامپوننت

### 1. Single Responsibility
```tsx
// ✅ درست - هر کامپوننت یک مسئولیت
function UserAvatar({ user }) {
  return <img src={user.avatar} alt={user.name} />
}

function UserName({ user }) {
  return <span>{user.name}</span>
}

// ❌ اشتباه - کامپوننت چند مسئولیتی
function UserEverything({ user }) {
  return (
    <div>
      <img src={user.avatar} />
      <span>{user.name}</span>
      <button onClick={handleEdit}>ویرایش</button>
      <form onSubmit={handleSubmit}>...</form>
    </div>
  )
}
```

### 2. Composition over Inheritance
```tsx
// ✅ درست - Composition
<Card>
  <CardHeader>
    <CardTitle>عنوان</CardTitle>
  </CardHeader>
  <CardContent>
    محتوا
  </CardContent>
</Card>

// ❌ اشتباه - Inheritance
class CardWithTitle extends Card {
  render() {
    return <div>{this.props.title}{this.props.children}</div>
  }
}
```

### 3. Props Interface
```tsx
// ✅ درست - Interface واضح
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  children: React.ReactNode
}

export function Button({ 
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children 
}: ButtonProps) {
  // ...
}
```

## Performance

### 1. React.memo
```tsx
// برای کامپوننت‌های سنگین
export const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* رندر سنگین */}</div>
})
```

### 2. useMemo & useCallback
```tsx
function MyComponent({ items }) {
  // محاسبه سنگین
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.value - b.value)
  }, [items])

  // تابع callback
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])

  return <div>{/* ... */}</div>
}
```

### 3. Code Splitting
```tsx
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<Skeleton />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### 4. Image Optimization
```tsx
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="توضیحات"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

## State Management

### 1. Local State First
```tsx
// ✅ درست - state محلی
function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}

// ❌ اشتباه - global state بدون دلیل
const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}))
```

### 2. Zustand برای Global State
```typescript
import { create } from 'zustand'

interface AuthStore {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}))
```

### 3. React Query برای Server State
```tsx
import { useQuery } from '@tanstack/react-query'

function Users() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  if (isLoading) return <Skeleton />
  return <UserList users={data} />
}
```

## Error Handling

### 1. Error Boundary
```tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}
```

### 2. Try-Catch در Async
```tsx
async function handleSubmit() {
  try {
    await api.post('/data', formData)
    toast.success('موفقیت')
  } catch (error) {
    toast.error(error.message)
  }
}
```

## Accessibility

### 1. Semantic HTML
```tsx
// ✅ درست
<button onClick={handleClick}>کلیک</button>
<nav><a href="/about">درباره</a></nav>

// ❌ اشتباه
<div onClick={handleClick}>کلیک</div>
<div><span onClick={navigate}>درباره</span></div>
```

### 2. ARIA Labels
```tsx
<button aria-label="حذف کاربر" onClick={handleDelete}>
  <TrashIcon />
</button>

<input
  type="text"
  aria-label="جستجو"
  aria-describedby="search-help"
/>
<span id="search-help">نام یا ایمیل را جستجو کنید</span>
```

### 3. Keyboard Navigation
```tsx
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
>
  کلیک کنید
</div>
```

## Testing

### 1. Unit Tests
```tsx
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

test('renders button with text', () => {
  render(<Button>کلیک</Button>)
  expect(screen.getByText('کلیک')).toBeInTheDocument()
})
```

### 2. Integration Tests
```tsx
test('form submission', async () => {
  render(<LoginForm />)
  
  await userEvent.type(screen.getByLabelText('ایمیل'), 'test@test.com')
  await userEvent.type(screen.getByLabelText('رمز عبور'), 'password')
  await userEvent.click(screen.getByRole('button', { name: 'ورود' }))
  
  expect(await screen.findByText('خوش آمدید')).toBeInTheDocument()
})
```

## Code Organization

### 1. Folder Structure
```
src/
├── components/
│   ├── ui/           # کامپوننت‌های پایه
│   ├── shared/       # کامپوننت‌های مشترک
│   └── features/     # کامپوننت‌های feature-specific
├── hooks/            # Custom hooks
├── lib/              # Utilities
├── pages/            # صفحات
├── stores/           # State management
└── types/            # TypeScript types
```

### 2. File Naming
```
// کامپوننت‌ها: PascalCase
Button.tsx
UserCard.tsx

// Hooks: camelCase با use
useAuth.ts
useTheme.ts

// Utils: camelCase
formatDate.ts
api.ts

// Types: PascalCase
User.ts
ApiResponse.ts
```

### 3. Import Order
```tsx
// 1. React
import { useState, useEffect } from 'react'

// 2. External libraries
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'

// 3. Internal components
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// 4. Hooks & Utils
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/lib/utils'

// 5. Types
import type { User } from '@/types'

// 6. Styles
import './styles.css'
```

## چک‌لیست کیفیت

### قبل از Commit
- [ ] TypeScript errors ندارد
- [ ] ESLint warnings ندارد
- [ ] تست‌ها pass می‌شوند
- [ ] کد format شده است
- [ ] کامنت‌های TODO حذف شده‌اند
- [ ] console.log ها حذف شده‌اند

### قبل از Deploy
- [ ] Build موفق است
- [ ] Performance بررسی شده
- [ ] Accessibility تست شده
- [ ] Cross-browser تست شده
- [ ] Mobile responsive است
- [ ] Dark mode کار می‌کند
- [ ] مستندات به‌روز است

## Git Workflow

### Commit Messages
```bash
# Format: type(scope): message

feat(auth): add login functionality
fix(button): resolve hover state issue
docs(readme): update installation guide
style(card): improve spacing
refactor(api): simplify error handling
test(user): add unit tests
chore(deps): update dependencies
```

### Branch Naming
```bash
feature/user-authentication
fix/button-hover-state
refactor/api-error-handling
docs/update-readme
```

## نتیجه‌گیری

رعایت این شیوه‌ها منجر به:
- کد تمیزتر و خواناتر
- نگهداری آسان‌تر
- عملکرد بهتر
- باگ‌های کمتر
- همکاری راحت‌تر
