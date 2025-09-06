# Review System Documentation

## Overview
The review system allows visitors to submit reviews about the Nithyanruthyaaradana academy, which are then managed through the admin panel.

## Features

### Public Features
- **Review Display**: Shows approved reviews on the home page with star ratings and comments
- **Review Submission**: Visitors can submit reviews through a modal form
- **Star Rating System**: 5-star rating system for reviews
- **Responsive Design**: Works on all device sizes
- **Fallback Data**: Includes sample reviews for demonstration

### Admin Features
- **Review Management**: Complete CRUD operations for reviews
- **Approval System**: Reviews require admin approval before being displayed
- **Search & Filter**: Search reviews by name, email, or comment content
- **Status Filtering**: Filter by approved, pending, or all reviews
- **Statistics Dashboard**: View review counts and statistics
- **Bulk Operations**: Approve, reject, or delete reviews

## Data Structure

### Review Model
```typescript
interface Review {
  id: string;
  name: string;
  email: string;
  rating: number; // 1-5 stars
  comment: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Firebase Collections

### Reviews Collection (`reviews`)
- Stores all submitted reviews
- Fields: name, email, rating, comment, isApproved, createdAt, updatedAt
- Indexes: createdAt (desc), isApproved (for filtering)

## Components

### ReviewSection (`/src/components/review-section.tsx`)
- Main component for displaying reviews on the home page
- Handles review submission
- Includes modal form for new reviews
- Fetches and displays approved reviews

### ReviewManagement (`/src/components/admin/review-management.tsx`)
- Admin component for managing reviews
- Includes search, filter, and CRUD operations
- Shows statistics and review details
- Handles approval/rejection workflow

## Admin Panel Integration

### Navigation
- Added "Reviews" menu item in admin sidebar
- Accessible at `/admin/reviews`

### Dashboard Integration
- Added review statistics to admin dashboard
- Shows total reviews, approved reviews, and pending reviews
- Real-time updates using Firebase listeners

## Usage

### For Visitors
1. Navigate to the home page
2. Scroll to the "What Our Students Say" section
3. Click "Write a Review" button
4. Fill out the review form with name, email, rating, and comment
5. Submit the review (requires admin approval)

### For Admins
1. Access admin panel at `/admin`
2. Navigate to "Reviews" section
3. View all submitted reviews
4. Use search and filters to find specific reviews
5. Approve, reject, or delete reviews as needed
6. Monitor review statistics on the dashboard

## Security Considerations
- Reviews require admin approval before being displayed publicly
- Email validation on form submission
- Input sanitization for review comments
- Firebase security rules should be configured to restrict direct access

## Customization
- Review display limit can be adjusted in the `limit()` query
- Star rating system can be modified in the `renderStars` function
- Form validation can be enhanced with additional checks
- Email notifications can be added for new review submissions

## Future Enhancements
- Email notifications for new reviews
- Review moderation queue with bulk actions
- Review analytics and insights
- Integration with external review platforms
- Review response system for admin replies
