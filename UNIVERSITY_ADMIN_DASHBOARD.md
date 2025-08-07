# University Admin Dashboard

A comprehensive analytics and management dashboard for university administrators, designed to provide deep insights into campus food service operations and student engagement.

## Features

### 🎯 Advanced Analytics
- **Revenue Analytics**: Track daily, weekly, and monthly revenue trends
- **Order Analytics**: Monitor order volumes, completion rates, and peak hours
- **Student Engagement**: Analyze student activity, retention rates, and spending patterns
- **Vendor Performance**: Comprehensive vendor metrics and performance tracking

### 📊 Food Trends Analysis
- **Popular Items**: Real-time tracking of trending food items
- **Category Analysis**: Distribution of orders across food categories  
- **Peak Hours**: Identify optimal service times for different food items
- **Seasonal Trends**: Track how food preferences change over time
- **Rating Analysis**: Monitor food quality through student ratings

### 👥 Student Management
- **Active Student Tracking**: Monitor student engagement levels
- **Wallet Management**: Track student spending and wallet balances
- **Registration Trends**: Analyze new student onboarding patterns
- **Retention Metrics**: Understand student loyalty and return rates

### 🏪 Vendor Management  
- **Performance Metrics**: Track vendor success rates and response times
- **Revenue Tracking**: Monitor vendor earnings and growth
- **Quality Control**: Vendor rating and review management
- **Status Management**: Activate/deactivate vendor accounts

### 📈 Real-time Monitoring
- **Live Order Tracking**: Monitor orders as they happen
- **System Performance**: Track platform uptime and performance
- **Alert System**: Automated notifications for important events
- **Dashboard Customization**: Personalized views and time ranges

## Components Structure

```
components/
├── UniversityAdminDashboard.tsx        # Main dashboard component
└── universityAdmin/
    ├── UniversityAdminLayout.tsx       # Layout wrapper
    ├── AnalyticsCharts.tsx             # Chart components
    └── FoodTrendsAnalysis.tsx          # Food trends analysis
```

## Services

```
lib/
└── universityAdminService.ts           # Backend service layer
```

## Key Metrics Tracked

### Financial Metrics
- Total Revenue
- Average Order Value  
- Revenue Growth Rate
- Vendor Commissions
- Student Wallet Usage

### Operational Metrics
- Order Completion Rate
- Average Delivery Time
- Vendor Response Time
- Peak Hour Analysis
- Category Performance

### Engagement Metrics
- Active Students
- Student Retention Rate
- Average Orders per Student
- New Student Registrations
- Returning Customer Rate

## Usage

### Basic Setup
```tsx
import { UniversityAdminDashboard } from '@/components/UniversityAdminDashboard';

export default function AdminPage() {
  return (
    <div>
      <UniversityAdminDashboard />
    </div>
  );
}
```

### Custom Time Ranges
The dashboard supports multiple time range analyses:
- Last 7 days
- Last 30 days  
- Last 90 days
- Custom date ranges

### Data Filtering
- Filter by food category
- Sort by popularity, revenue, or trend
- Search students and vendors
- University-specific data isolation

## API Integration

The dashboard integrates with Firebase Firestore for real-time data:

### Collections Used
- `orders` - Order transactions
- `users` - Student and vendor accounts  
- `vendors` - Vendor profiles and settings
- `universities` - University configurations

### Real-time Updates
- Live order status updates
- Real-time analytics refresh
- Automatic notification system
- Dynamic chart updates

## Design System

Following the same design patterns as the Super Admin Dashboard:
- **Colors**: Consistent color scheme with role-based variants
- **Typography**: Clear hierarchy with proper Arabic/English support
- **Layout**: Responsive grid system with mobile-first design
- **Components**: Reusable UI components from the design system
- **Icons**: Lucide React icons for consistency

## Performance Features

- **Lazy Loading**: Components load as needed
- **Data Caching**: Intelligent caching for better performance
- **Optimized Queries**: Efficient Firebase queries
- **Real-time Subscriptions**: Minimal data transfer
- **Mobile Responsive**: Optimized for all device sizes

## Security & Permissions

- **Role-based Access**: Admin-only access controls
- **University Isolation**: Data scoped to specific universities
- **Audit Logging**: Track all administrative actions
- **Data Privacy**: Student data protection compliance

## Internationalization

- **RTL Support**: Full Arabic language support
- **Dynamic Layout**: Layout adapts to text direction
- **Currency Formatting**: Egyptian Pound (EGP) formatting
- **Date Formatting**: Localized date and time formats

## Future Enhancements

- **AI-Powered Insights**: Machine learning recommendations
- **Advanced Reporting**: PDF/Excel export capabilities  
- **Mobile App**: Native mobile admin app
- **Integration APIs**: Third-party service integrations
- **Advanced Analytics**: Predictive analytics and forecasting

## Development

### Adding New Metrics
1. Update the `AnalyticsData` interface in `universityAdminService.ts`
2. Add the metric calculation in the service layer
3. Create UI components in the dashboard
4. Update the dashboard layout

### Customizing Charts  
The `AnalyticsCharts` component accepts custom data formats and can be extended with new chart types.

### Adding New Filters
Extend the filtering logic in each tab component and update the service layer queries accordingly.
