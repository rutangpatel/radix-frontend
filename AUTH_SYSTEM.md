# Radix Authentication System

## Overview

The Radix fintech payment application includes a complete authentication flow with Login and Signup screens. The system is fully responsive, supporting both mobile and desktop experiences.

## Components

### Auth Flow (`components/auth/auth-flow.tsx`)
Main wrapper component that manages the state between Login and Signup screens with smooth fade-in/out animations.

**Features:**
- Smooth opacity transitions between screens
- Responsive container design
- Centered layout on desktop, full-screen on mobile

### Login Screen (`components/auth/login-screen.tsx`)
User login interface with the following features:

**Inputs:**
- Radix ID or Mobile Number field
- Password field with eye icon toggle for visibility
- Forgot Password link

**Layout:**
- Radix branding header with lock icon
- Welcoming subtitle: "Welcome back. Log in to your wallet."
- Prominent Login button
- Link to switch to Signup

### Signup Screen (`components/auth/signup-screen.tsx`)
New user registration interface with the following features:

**Inputs:**
- Full Name
- Mobile Number (10 digits)
- Password (minimum 8 characters with visual hint)
- Secure 4-Digit PIN (masked input with transaction authorization hint)
- Toggle checkbox: "Use my name for my Radix ID instead of my mobile number"

**Layout:**
- Join Radix branding header
- Subtitle: "Set up your secure digital wallet."
- Prominent Create Account button
- Link to switch to Login

## Design & Theme

### Color Palette
- **Background:** `bg-slate-50` (soft off-white)
- **Cards:** `bg-white` (pure white)
- **Text:** `text-slate-900` (deep slate)
- **Primary Button:** `bg-blue-600` (vibrant, trustworthy blue)
- **Focus State:** `focus:ring-blue-200` (soft blue ring)

### Responsive Design
- **Mobile:** Full-screen experience (h-screen, w-full)
- **Desktop:** Centered card container (max-w-md, rounded-3xl shadow-2xl)
- **Breakpoints:** Uses Tailwind's `sm:` prefix for scaling

### Typography & Spacing
- Font sizes scale with responsive prefixes (sm:text-3xl)
- Padding scales responsively (px-4 sm:px-6)
- Icon sizing adjusts for screen size (w-8 h-8 sm:w-10 sm:h-10)

## Animations

### Fade In Animation
Defined in `globals.css`, used on all screen content:
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fadeIn { animation: fadeIn 0.3s ease-in-out; }
```

### Screen Transitions
Both screens are absolutely positioned and use opacity transitions for smooth crossfade effects.

## Routing

- **Auth Page:** `/auth` - Displays the AuthFlow component
- **Main App:** `/` - Displays the main payment application

## Form Validation

### Login
- No validation required (placeholder implementation)
- Ready for backend integration

### Signup
- **Full Name:** Required
- **Mobile Number:** Required, 10 digits only
- **Password:** Required, minimum 8 characters
- **PIN:** Required, exactly 4 digits
- **Radix ID Toggle:** Optional preference

## Integration Points

### Backend Integration (Ready)
All form handlers call `console.log()` for debugging and can be connected to backend API calls:

```typescript
// Login
handleLogin(e) - POST /api/auth/login

// Signup
handleSignup(e) - POST /api/auth/signup
```

### State Management
Currently uses React `useState` hooks. Consider migration to:
- Context API for global auth state
- Redux/Zustand for complex state management
- Session storage for persistence

## Responsive Behavior

### Mobile (< 640px)
- Full viewport height and width
- Compact padding (px-4)
- Smaller font sizes and icons
- Appropriate spacing for touch interactions

### Small to Medium (640px - 1024px)
- Transition zone with responsive scaling
- Medium padding and spacing

### Desktop (> 1024px)
- Centered card container (max-w-md)
- Rounded corners and shadow
- Full height viewport with vertical centering
- Expanded padding and spacing

## Accessibility

- All inputs have associated labels
- Focus states clearly visible with blue ring
- Password visibility toggle for accessibility
- PIN input masked for security
- Semantic HTML structure with proper form elements
- Touch-friendly button sizing

## Future Enhancements

1. **Backend Integration**
   - Connect to authentication API
   - Password hashing and validation
   - Session management with JWT tokens

2. **Error Handling**
   - Form validation error messages
   - API error responses
   - Network timeout handling

3. **Security**
   - Rate limiting on login attempts
   - CAPTCHA verification
   - Two-factor authentication (2FA)
   - Email verification for signup

4. **User Experience**
   - Loading states during API calls
   - Success/error toast notifications
   - Password strength indicator
   - Remember me functionality

5. **Mobile-Specific**
   - Biometric authentication (fingerprint/face)
   - Deep linking from notifications
   - Offline support

## Files Structure

```
components/auth/
├── auth-flow.tsx        # Main auth wrapper
├── login-screen.tsx     # Login UI
└── signup-screen.tsx    # Signup UI

app/
├── auth/
│   └── page.tsx         # Auth route
├── page.tsx             # Main app
└── globals.css          # Animation definitions
```
