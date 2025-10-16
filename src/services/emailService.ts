import api from '@/config/axios';

// Types for email requests
export interface EmailRequestData {
  email: string;
  route: string;
  cab?: {
    available: boolean;
    price: number;
    _id: string;
    type?: string;
  };
  car?: {
    type: string;
    available: boolean;
    price: number;
    _id: string;
  };
  traveller: {
    name: string;
    mobile: string;
    email: string;
    pickup?: string;
    drop?: string;
    pickupAddress?: string;
    dropAddress?: string;
    remark?: string;
    gst?: string;
  };
  date?: string;
  time?: string;
  serviceType?: string;
  otherLocation?: string;
}

// New types for booking requests
export interface BookingRequestData {
  bookingId?: string;
  serviceType: 'AIRPORT' | 'LOCAL' | 'OUTSTATION';
  traveller: {
    name: string;
    email: string;
    mobile: string;
    pickup?: string;
    drop?: string;
    pickupAddress?: string;
    dropAddress?: string;
    remark?: string;
    gst?: string;
    whatsapp: boolean;
    gstDetails: boolean;
  };
  route: string;
  cab: {
    type: string;
    price: number;
    _id: string;
  };
  date?: string;
  time?: string;
  estimatedDistance?: string;
  paymentMethod: string;
  status?: 'pending' | 'accepted' | 'declined' | 'driver_sent';
  driverDetails?: {
    name: string;
    whatsappNumber: string;
    vehicleNumber: string;
  };
  adminNotes?: string;
  createdAt?: string;
  calculatedPayment?: {
    remainingAmount: number;
    paymentStatus: string;
    totalFare: number;
  };
}

export interface DriverDetails {
  name: string;
  whatsappNumber: string;
  vehicleNumber: string;
}

// Airport Email Service
export const sendAirportEmail = async (data: EmailRequestData) => {
  try {
    const response = await api.post('/api/send-airport-email', data);
    return response.data;
  } catch (error) {
    console.error('Error sending airport email:', error);
    throw error;
  }
};

// Local Email Service
export const sendLocalEmail = async (data: EmailRequestData) => {
  try {
    const response = await api.post('/send-local-email', data);
    return response.data;
  } catch (error) {
    console.error('Error sending local email:', error);
    throw error;
  }
};

// Outstation/Intercity Email Service
export const sendIntercityEmail = async (data: EmailRequestData) => {
  try {
    const response = await api.post('/send-intercity-email', data);
    return response.data;
  } catch (error) {
    console.error('Error sending intercity email:', error);
    throw error;
  }
};

// Create a new booking request
export const createBookingRequest = async (data: BookingRequestData) => {
  try {
    const response = await api.post('/api/create-booking-request', data);
    return response.data;
  } catch (error) {
    console.error('Error creating booking request:', error);
    throw error;
  }
};

// Get all booking requests for admin
export const getBookingRequests = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/api/booking-requests?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking requests:', error);
    throw error;
  }
};

// Update booking request status
export const updateBookingStatus = async (id: string, status: string, adminNotes?: string) => {
  try {
    const response = await api.put(`/api/booking-requests/${id}/status`, { status, adminNotes });
    return response.data;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

// Add driver details to accepted booking
export const addDriverDetails = async (id: string, driverDetails: DriverDetails) => {
  try {
    const response = await api.put(`/api/booking-requests/${id}/driver-details`, { driverDetails });
    return response.data;
  } catch (error) {
    console.error('Error adding driver details:', error);
    throw error;
  }
};

// Send decline email
export const sendDeclineEmail = async (email: string, route: string, reason?: string) => {
  try {
    const response = await api.post('/api/send-decline-email', { email, route, reason });
    return response.data;
  } catch (error) {
    console.error('Error sending decline email:', error);
    throw error;
  }
};

// Helper function to prepare email data based on booking type
export const prepareEmailData = (
  bookingData: Record<string, unknown>,
  formData: Record<string, unknown>,
  serviceType: 'AIRPORT' | 'LOCAL' | 'OUTSTATION'
): EmailRequestData => {
  const baseData = {
    email: formData.email as string,
    traveller: {
      name: formData.name as string,
      mobile: formData.mobile as string,
      email: formData.email as string,
      remark: (formData.remark as string) || '',
      gst: formData.gstDetails ? ((formData.gst as string) || 'GST Details Required') : '',
    },
  };

  switch (serviceType) {
    case 'AIRPORT':
      // Determine route based on pickup/drop type
      let route = '';
      if (bookingData.pickupDropType === 'PICKUP') {
        route = `Pickup from ${bookingData.airport as string}`;
      } else {
        route = `Drop to ${bookingData.airport as string}`;
      }

      return {
        ...baseData,
        route: route,
        cab: {
          type: (bookingData.selectedCabType as string) || 'sedan',
          available: true,
          price: parseInt(bookingData.selectedCabPrice as string) || 0,
          _id: (bookingData.selectedCabId as string) || '',
        },
        traveller: {
          ...baseData.traveller,
          pickup: (formData.pickup as string) || (bookingData.address as string) || '',
          drop: (formData.drop as string) || (bookingData.airport as string) || '',
        },
        date: bookingData.date as string,
        time: (bookingData.time as string) || (bookingData.pickupTime as string),
        serviceType: (bookingData.pickupDropType as string)?.toLowerCase() || 'drop',
        otherLocation: (bookingData.address as string) || '',
      };

    case 'LOCAL':
      return {
        ...baseData,
        route: `${bookingData.city as string} | ${(bookingData.duration as string) || '4hr'}/${(bookingData.estimatedDistance as string) || '40km'} | ${bookingData.date as string} ${(bookingData.time as string) || (bookingData.pickupTime as string)}`,
        car: {
          type: (bookingData.selectedCabType as string) || 'sedan',
          available: true,
          price: parseInt(bookingData.selectedCabPrice as string) || 0,
          _id: (bookingData.selectedCabId as string) || '',
        },
        traveller: {
          ...baseData.traveller,
          pickupAddress: (formData.pickup as string) || (bookingData.pickupAddress as string) || '',
          dropAddress: (formData.drop as string) || (bookingData.dropAddress as string) || '',
        },
      };

    case 'OUTSTATION':
      return {
        ...baseData,
        route: `${bookingData.from as string} ➡️ ${bookingData.to as string}`,
        cab: {
          type: (bookingData.selectedCabType as string) || 'suv',
          available: true,
          price: parseInt(bookingData.selectedCabPrice as string) || 0,
          _id: (bookingData.selectedCabId as string) || '',
        },
        traveller: {
          ...baseData.traveller,
          pickup: (formData.pickup as string) || (bookingData.pickupAddress as string) || '',
          drop: (formData.drop as string) || (bookingData.dropAddress as string) || '',
        },
      };

    default:
      throw new Error(`Unsupported service type: ${serviceType}`);
  }
};

// Helper function to prepare booking request data
export const prepareBookingRequestData = (
  bookingData: Record<string, unknown>,
  formData: Record<string, unknown>,
  serviceType: 'AIRPORT' | 'LOCAL' | 'OUTSTATION',
  paymentMethod: string
): BookingRequestData => {
  const baseData = {
    serviceType,
    traveller: {
      name: formData.name as string,
      email: formData.email as string,
      mobile: formData.mobile as string,
      remark: (formData.remark as string) || '',
      gst: formData.gstDetails ? ((formData.gst as string) || 'GST Details Required') : '',
      whatsapp: (formData.whatsapp as boolean) || false,
      gstDetails: (formData.gstDetails as boolean) || false,
    },
    paymentMethod,
  };

  switch (serviceType) {
    case 'AIRPORT':
      let route = '';
      if (bookingData.pickupDropType === 'PICKUP') {
        route = `Pickup from ${bookingData.airport as string}`;
      } else {
        route = `Drop to ${bookingData.airport as string}`;
      }

      return {
        ...baseData,
        route: route,
        cab: {
          type: (bookingData.selectedCabType as string) || 'sedan',
          price: parseInt(bookingData.selectedCabPrice as string) || 0,
          _id: (bookingData.selectedCabId as string) || '',
        },
        traveller: {
          ...baseData.traveller,
          pickup: (formData.pickup as string) || (bookingData.address as string) || '',
          drop: (formData.drop as string) || (bookingData.airport as string) || '',
        },
        date: bookingData.date as string,
        time: (bookingData.time as string) || (bookingData.pickupTime as string),
      };

    case 'LOCAL':
      return {
        ...baseData,
        route: `${bookingData.city as string} | ${(bookingData.duration as string) || '4hr'}/${(bookingData.estimatedDistance as string) || '40km'} | ${bookingData.date as string} ${(bookingData.time as string) || (bookingData.pickupTime as string)}`,
        cab: {
          type: (bookingData.selectedCabType as string) || 'sedan',
          price: parseInt(bookingData.selectedCabPrice as string) || 0,
          _id: (bookingData.selectedCabId as string) || '',
        },
        traveller: {
          ...baseData.traveller,
          pickup: (formData.pickup as string) || (bookingData.pickupAddress as string) || '',
          drop: (formData.drop as string) || (bookingData.dropAddress as string) || '',
        },
        date: bookingData.date as string,
        time: (bookingData.time as string) || (bookingData.pickupTime as string),
        estimatedDistance: (bookingData.estimatedDistance as string) || '40km',
      };

    case 'OUTSTATION':
      return {
        ...baseData,
        route: `${bookingData.from as string} ➡️ ${bookingData.to as string}`,
        cab: {
          type: (bookingData.selectedCabType as string) || 'suv',
          price: parseInt(bookingData.selectedCabPrice as string) || 0,
          _id: (bookingData.selectedCabId as string) || '',
        },
        traveller: {
          ...baseData.traveller,
          pickup: (formData.pickup as string) || (bookingData.pickupAddress as string) || '',
          drop: (formData.drop as string) || (bookingData.dropAddress as string) || '',
        },
        date: bookingData.date as string,
        time: (bookingData.time as string) || (bookingData.pickupTime as string),
        estimatedDistance: (bookingData.estimatedDistance as string) || '',
      };

    default:
      throw new Error(`Unsupported service type: ${serviceType}`);
  }
}; 