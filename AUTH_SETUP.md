# Authentication Setup with Appwrite

This application uses Appwrite for authentication with role-based access control. Follow these steps to set up authentication:

## 1. Appwrite Setup

1. Create an account at [Appwrite Cloud](https://cloud.appwrite.io)
2. Create a new project
3. **Configure Platform (Important for CORS)**:
   - Go to **Settings** > **Platforms**
   - Add Web Platform:
     - **Name**: CampusBites Development
     - **Hostname**: localhost (for development)
   - For production, add another platform:
     - **Name**: CampusBites Production  
     - **Hostname**: www.campusbites.app
4. Copy your project details to `.env.local`

## 2. Environment Variables

Create a `.env.local` file in your project root:

```bash
# Copy from .env.local.example
cp .env.local.example .env.local
```

Update the following variables:
```bash
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID=your-user-collection-id
```

## 3. Features Implemented

### Login System
- **English Route**: `/en/login`
- **Arabic Route**: `/ar/login`
- Email/password authentication
- Role selection after login
- Proper i18n support

### Forgot Password
- Password reset via email
- Appwrite handles the reset flow
- Redirect URL: `{your-domain}/reset-password`

### User Roles
Three roles are supported:
- **Student**: Access to food ordering features
- **Vendor**: Manage restaurant/food business
- **Admin**: Manage campus dining operations

### Internationalization
- Full RTL support for Arabic
- All authentication text translated
- Proper form validation messages

## 4. Components Structure

```
app/components/auth/
├── AuthContainer.tsx       # Main auth flow controller
├── LoginForm.tsx          # Login with role selection
├── ForgotPasswordForm.tsx # Password reset
├── RegisterForm.tsx       # User registration
└── RoleBasedRedirect.tsx  # Dashboard routing
```

## 5. Context Integration

The authentication is integrated with:
- `AuthContext`: Manages user state and auth methods
- `LanguageContext`: Provides translations and RTL support
- `Header`: Shows login/logout buttons and user menu

## 6. Usage

### Login Flow
1. User enters email/password
2. After successful authentication, role selection appears
3. User selects role (student/vendor/admin)
4. Redirects to appropriate dashboard

### Registration Flow
1. User selects role first
2. Fills out registration form
3. Account created with selected role
4. Redirects to appropriate dashboard

## 7. Navigation

- Header includes login/logout functionality
- Authenticated users see dropdown menu with dashboard link
- Mobile-responsive design
- Language toggle maintains authentication state

## 8. Security

- Passwords require minimum 8 characters
- Email validation
- Appwrite handles session management
- Role-based routing protection

## Next Steps

1. Set up your Appwrite project with correct platform configuration
2. Configure environment variables
3. Test login/registration flows
4. For production deployment, see `APPWRITE_PRODUCTION_SETUP.md`
5. Use `npm run cors:verify` to check CORS configuration

## Troubleshooting

### CORS Errors
If you see "blocked by CORS policy" errors:
- Check that your Appwrite platform hostname matches your domain exactly
- For localhost development: use `localhost` (not `127.0.0.1`)
- For production: use your actual domain (e.g., `www.campusbites.app`)
- Run: `npm run cors:verify` for automated checking

### Authentication Issues
- Verify project ID is correct in environment variables
- Check network connectivity to Appwrite
- Clear browser cache and cookies
- Try incognito/private browsing mode
