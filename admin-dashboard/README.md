# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Admin Dashboard for Food Delivery App

A modern, responsive admin dashboard built with React, TypeScript, and Tailwind CSS for managing the food delivery platform.

## 🚀 Features

- **Authentication System**: Sign-in and sign-up pages with form validation
- **Custom UI Components**: Reusable button and input components with consistent styling
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Form Validation**: Zod schema validation with React Hook Form
- **Modern Routing**: React Router v6 with nested routes
- **Custom Fonts**: Quicksand font family integration

## 🛠️ Tech Stack

- **React 19.1.1** - Latest React with modern features
- **TypeScript** - Type safety and better developer experience  
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **Lucide React** - Beautiful icon library

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Development

The development server runs on `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/
│   └── ui/
│       ├── CustomButton.tsx    # Reusable button component
│       ├── CustomInput.tsx     # Reusable input component
│       └── FormContainer.tsx   # Form wrapper component
├── pages/
│   ├── auth/
│   │   ├── SignInPage.tsx      # Sign-in page with validation
│   │   └── SignUpPage.tsx      # Sign-up page with validation
│   └── DemoPage.tsx            # Landing page with auth options
├── types/
│   └── index.ts                # TypeScript type definitions
├── App.tsx                     # Main app component with routing
└── index.css                   # Global styles and Tailwind imports
```

## 🎨 Design System

### Colors
- **Primary**: Blue tones for main actions
- **Secondary**: Gray tones for text and borders  
- **Accent**: Orange tones for highlights
- **Success**: Green for positive actions
- **Error**: Red for warnings and errors

### Typography
- **Font Family**: Quicksand (Light, Regular, Medium, SemiBold, Bold)
- **Headings**: Quicksand SemiBold/Bold
- **Body Text**: Quicksand Regular
- **Labels**: Quicksand Medium

### Components
- **Buttons**: Multiple variants (primary, secondary, outline, ghost)
- **Inputs**: Consistent styling with focus states
- **Cards**: Clean containers with subtle shadows

## 🔐 Authentication

The dashboard includes a complete authentication system:

- **Demo Page**: Landing page with navigation to auth forms
- **Sign In**: Email/password authentication
- **Sign Up**: Account creation with validation
- **Form Validation**: Real-time validation with error messages
- **Responsive Forms**: Mobile-optimized layouts

## 🚧 Next Steps

### Backend Integration
- [ ] Connect to Spring Boot API endpoints
- [ ] Implement JWT token handling
- [ ] Add authentication state management
- [ ] Create API service layer

### Dashboard Features
- [ ] Main dashboard layout
- [ ] User management interface
- [ ] Food item management
- [ ] Order tracking system
- [ ] Analytics and reporting
- [ ] Restaurant management
- [ ] Table reservation system

### Enhanced UI Components
- [ ] Data tables with sorting/filtering
- [ ] Charts and graphs for analytics
- [ ] File upload components
- [ ] Modal dialogs
- [ ] Notification system
- [ ] Loading states and skeletons

### Advanced Features
- [ ] Role-based access control
- [ ] Real-time notifications
- [ ] Export functionality
- [ ] Search and filtering
- [ ] Audit logs
- [ ] Settings management

## 🎯 Current Status

✅ **Completed:**
- Project setup with Vite and TypeScript
- Tailwind CSS configuration
- Custom UI component library
- Authentication pages with validation
- Responsive design implementation
- React Router configuration
- Demo landing page

🚧 **In Progress:**
- Backend API integration
- Authentication state management

📋 **Planned:**
- Main dashboard layout
- Core admin functionality
- Data management interfaces

## 📸 Preview

The admin dashboard features:
- Clean, modern interface design
- Consistent component styling
- Mobile-responsive layouts
- Professional authentication flow
- Intuitive navigation structure

Visit `http://localhost:3000` to see the demo page with navigation to sign-in and sign-up forms.

## 🤝 Contributing

1. Follow the existing code style and component patterns
2. Use TypeScript for all new components
3. Implement responsive design with Tailwind CSS
4. Add proper form validation using Zod schemas
5. Maintain component reusability and consistency

## 📄 License

This project is part of the Food Delivery App ecosystem.

## 📁 Project Structure

```
admin-dashboard/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── CustomButton.tsx
│   │   │   ├── CustomInput.tsx
│   │   │   └── FormContainer.tsx
│   │   └── index.ts
│   ├── pages/
│   │   └── auth/
│   │       ├── SignInPage.tsx
│   │       └── SignUpPage.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── assets/
│   ├── fonts/
│   ├── icons/
│   └── images/
└── constants/
    └── index.ts
```

## 🛠️ Technologies Used

- **React 19.1.1** - UI Library
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **React Router Dom** - Routing
- **React Hook Form** - Form Management
- **Zod** - Schema Validation
- **Lucide React** - Icons
- **Vite** - Build Tool

## 🎨 Design System

### Colors
- **Primary**: Orange (#FF6B35) with shades
- **Secondary**: Dark Gray (#2C2C2C) with shades
- **Success**: Green (#22C55E)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Font Family**: Quicksand (Multiple weights)
- **Weights**: Light (300), Regular (400), Medium (500), SemiBold (600), Bold (700)

### Components
- **CustomButton**: Multiple variants (primary, secondary, outline, ghost)
- **CustomInput**: Form inputs with icons, validation states
- **FormContainer**: Centered form layout with logo and styling

## 📋 Available Scripts

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🚀 Getting Started

1. **Clone and navigate to the project:**
   ```bash
   cd admin-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📱 Available Pages

### Authentication
- **Sign In** (`/signin`) - Admin login page
- **Sign Up** (`/signup`) - Admin registration page

## 🎯 Form Validation

Both authentication forms include comprehensive validation:

### Sign In
- Email format validation
- Password minimum length (6 characters)
- Required field validation

### Sign Up
- Full name validation (letters and spaces only)
- Email format validation
- Phone number format validation
- Strong password requirements (8+ chars, uppercase, lowercase, number)
- Password confirmation matching
- Terms and conditions agreement

## 🎨 Custom Components Usage

### CustomButton
```tsx
import { CustomButton } from '@/components';

<CustomButton
  variant="primary"
  size="md"
  isLoading={false}
  fullWidth
  onClick={handleClick}
>
  Click Me
</CustomButton>
```

### CustomInput
```tsx
import { CustomInput } from '@/components';
import { Mail } from 'lucide-react';

<CustomInput
  label="Email"
  placeholder="Enter email"
  leftIcon={<Mail className="w-5 h-5" />}
  error={errors.email?.message}
  {...register('email')}
/>
```

### FormContainer
```tsx
import { FormContainer } from '@/components';

<FormContainer
  title="Welcome"
  subtitle="Sign in to continue"
  showLogo={true}
>
  {/* Form content */}
</FormContainer>
```

## 🎨 Styling Guidelines

### Tailwind Classes
- Use custom CSS classes defined in `index.css`
- Follow the design system colors and spacing
- Responsive design with mobile-first approach

### Custom CSS Classes
- `.btn` - Base button styles
- `.btn-primary` - Primary button variant
- `.input-field` - Base input styles
- `.label` - Form label styles
- `.card` - Container card styles

## 🔧 Configuration

### Vite Config
- Path aliases configured (`@` points to `src/`)
- Development server on port 3000
- Auto-open browser on start

### Tailwind Config
- Custom color palette
- Extended font families
- Custom spacing and shadows
- Responsive breakpoints

## 🚀 Next Steps

1. **Backend Integration**
   - Connect authentication forms to your Spring Boot backend
   - Implement actual API calls
   - Add token management

2. **Dashboard Features**
   - Add main dashboard layout
   - Implement user management
   - Add food item management
   - Create table management
   - Add analytics and reports

3. **Additional Components**
   - Data tables
   - Charts and graphs
   - File upload components
   - Modal dialogs
   - Notification system

## 📝 Notes

- All components are fully typed with TypeScript
- Form validation is handled by React Hook Form + Zod
- Responsive design works on all screen sizes
- Custom fonts are loaded from the assets folder
- Icons are provided by Lucide React

The authentication system is now ready and you can start building additional dashboard features! 🎉

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
