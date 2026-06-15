import { BusinessDetails, Review } from '../../types/business.types';
import { Business } from '../../types/home.types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockBusinessDetails: Record<string, BusinessDetails> = {
  '1': {
    id: '1',
    name: 'Sunrise Elite PG for Gents',
    category: 'PG & Hostel',
    rating: 4.6,
    reviewsCount: 842,
    isVerified: true,
    isPremium: true,
    coverImage: 'https://images.unsplash.com/photo-1522771731470-ea457f14b600?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1522771731470-ea457f14b600?q=80&w=1000&auto=format&fit=crop', // bedroom
      'https://images.unsplash.com/photo-1598928506311-c55dedbfc181?q=80&w=1000&auto=format&fit=crop', // common area
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop', // dining
      'https://images.unsplash.com/photo-1628156157121-da421290e29b?q=80&w=1000&auto=format&fit=crop' // laundry
    ],
    distanceStr: '0.8 km',
    isOpenNow: true,
    description: 'Premium executive PG for gents with all modern amenities. Experience home-like comfort with hygienic food, high-speed internet, and daily housekeeping.',
    about: 'Sunrise Elite PG has been setting the standard for luxury co-living spaces since 2018. We provide fully furnished rooms, 3-times hygienic meals, biometric security, and dedicated study/work spaces for IT professionals and students.',
    establishedYear: 2018,
    services: [
      { id: 's1', name: '1/2/3 Sharing', iconName: 'bed-outline' },
      { id: 's2', name: '3 Times Food', iconName: 'restaurant-outline' },
      { id: 's3', name: 'Daily Cleaning', iconName: 'sparkles-outline' },
      { id: 's4', name: 'AC & Non-AC', iconName: 'snow-outline' }
    ],
    amenities: [
      { id: 'a1', name: 'High-Speed WiFi', iconName: 'wifi-outline' },
      { id: 'a2', name: 'Washing Machine', iconName: 'water-outline' },
      { id: 'a3', name: '24/7 Security & CCTV', iconName: 'shield-checkmark-outline' },
      { id: 'a4', name: 'Power Backup', iconName: 'flash-outline' },
      { id: 'a5', name: 'RO Water', iconName: 'water-outline' }
    ],
    contact: {
      mobile: '+91 9876543210',
      alternateNumber: '+91 9876543211',
      email: 'info@sunrisepg.com',
      website: 'www.sunrisepg.com'
    },
    location: {
      address: 'Plot 42, Hitech City Main Road, Madhapur',
      area: 'Madhapur',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081'
    },
    hours: [
      { day: 'Monday', open: '06:00 AM', close: '11:00 PM' },
      { day: 'Tuesday', open: '06:00 AM', close: '11:00 PM' },
      { day: 'Wednesday', open: '06:00 AM', close: '11:00 PM' },
      { day: 'Thursday', open: '06:00 AM', close: '11:00 PM' },
      { day: 'Friday', open: '06:00 AM', close: '11:00 PM' },
      { day: 'Saturday', open: '06:00 AM', close: '11:00 PM' },
      { day: 'Sunday', open: '06:00 AM', close: '11:00 PM' }
    ],
    faqs: [
      { question: 'Is food included in the rent?', answer: 'Yes, breakfast, lunch, and dinner are included in the monthly rent.' },
      { question: 'What is the lock-in period?', answer: 'We have a standard lock-in period of 3 months.' },
      { question: 'Are there any hidden electricity charges?', answer: 'For Non-AC rooms, electricity is included. For AC rooms, there is a separate sub-meter.' }
    ],
    ratingSummary: {
      '5': 600,
      '4': 180,
      '3': 40,
      '2': 15,
      '1': 7
    }
  }
};

const mockReviews: Record<string, Review[]> = {
  '1': [
    {
      id: 'r1',
      businessId: '1',
      authorName: 'Rahul Verma',
      rating: 5,
      text: 'Best PG in Madhapur! The food quality is actually like home, which is rare to find. Rooms are cleaned daily and the WiFi speed is great for WFH.',
      date: '2 weeks ago',
      isVerified: true,
      helpfulCount: 24,
      businessResponse: 'Thank you Rahul! We are glad you are enjoying your stay.'
    },
    {
      id: 'r2',
      businessId: '1',
      authorName: 'Karthik S',
      rating: 4,
      text: 'Good facilities and security. Management is responsive when there are any maintenance issues. Only feedback is that parking space is a bit limited.',
      date: '1 month ago',
      isVerified: true,
      helpfulCount: 12,
      images: [
        'https://images.unsplash.com/photo-1598928506311-c55dedbfc181?q=80&w=500&auto=format&fit=crop'
      ]
    }
  ]
};

const genericBusinessGenerator = (id: string): BusinessDetails => {
  return {
    ...mockBusinessDetails['1'],
    id,
    name: `Premium PG ${id}`,
    category: 'PG & Hostel',
    coverImage: `https://picsum.photos/seed/${id}/800/600`,
    gallery: [
      `https://picsum.photos/seed/${id}1/800/600`,
      `https://picsum.photos/seed/${id}2/800/600`,
      `https://picsum.photos/seed/${id}3/800/600`
    ]
  };
};

export const businessDetailsService = {
  getBusinessDetails: async (id: string): Promise<BusinessDetails> => {
    await delay(800);
    return mockBusinessDetails[id] || genericBusinessGenerator(id);
  },

  getBusinessReviews: async (id: string): Promise<Review[]> => {
    await delay(600);
    return mockReviews[id] || mockReviews['1'];
  },

  getSimilarBusinesses: async (id: string): Promise<Business[]> => {
    await delay(1000);
    // Return dummy data using the generic generator
    return [
      genericBusinessGenerator('101'),
      genericBusinessGenerator('102'),
      genericBusinessGenerator('103'),
    ];
  },

  submitBusinessReview: async (reviewPayload: any): Promise<{ success: boolean; message: string }> => {
    await delay(1500); // Simulate network request
    
    // In a real app, we would push this payload to a database.
    // For the mock, we can just log it and simulate a success.
    console.log('Mock Review Submitted:', reviewPayload);
    
    return { success: true, message: 'Review submitted successfully' };
  }
};
