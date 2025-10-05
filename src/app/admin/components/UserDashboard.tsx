"use client";

import React, { useState, useEffect, useCallback } from "react";
import { theme } from "@/styles/theme";
import {
  getBookingRequests,
  updateBookingStatus,
  addDriverDetails,
  sendDeclineEmail,
} from "@/services/emailService";

interface BookingRequest {
  _id: string;
  serviceType: "AIRPORT" | "LOCAL" | "OUTSTATION";
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
  status: "pending" | "accepted" | "declined" | "driver_sent";
  driverDetails?: {
    name: string;
    whatsappNumber: string;
    vehicleNumber: string;
  };
  adminNotes?: string;
  createdAt: string;
  calculatedPayment?: {
    remainingAmount: number;
    paymentStatus: string;
    totalFare: number;
  };
}

interface DriverDetails {
  name: string;
  whatsappNumber: string;
  vehicleNumber: string;
}

export default function UserDashboard() {
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [isDriverDetailsModalOpen, setIsDriverDetailsModalOpen] =
    useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(
    null
  );
  const [driverDetails, setDriverDetails] = useState<DriverDetails>({
    name: "",
    whatsappNumber: "",
    vehicleNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingDriverDetails, setIsSubmittingDriverDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalBookings, setTotalBookings] = useState(0);

  const fetchBookingRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getBookingRequests(currentPage, limit);
      setBookingRequests(response.bookingRequests);
      setTotalPages(response.totalPages);
      setTotalBookings(response.total);
    } catch (error) {
      console.error("Error fetching booking requests:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit]);

  // Fetch booking requests on component mount
  useEffect(() => {
    fetchBookingRequests();
  }, [fetchBookingRequests]);

  const filteredRequests = bookingRequests.filter((request) => {
    const matchesSearch =
      request.traveller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.traveller.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      request.traveller.mobile.includes(searchTerm) ||
      request.route.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;

    // Handle nested properties
    if (sortBy === "traveller.name") {
      aValue = a.traveller.name;
      bValue = b.traveller.name;
    } else if (sortBy === "cab.price") {
      aValue = a.cab.price;
      bValue = b.cab.price;
    } else {
      aValue = a[sortBy as keyof BookingRequest] as string | number | Date;
      bValue = b[sortBy as keyof BookingRequest] as string | number | Date;
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      await updateBookingStatus(bookingId, "accepted");
      await fetchBookingRequests(); // Refresh the list
    } catch (error) {
      console.error("Error accepting booking:", error);
    }
  };

  const handleDeclineBooking = async (bookingId: string) => {
    try {
      const request = bookingRequests.find((r) => r._id === bookingId);
      if (request) {
        await updateBookingStatus(bookingId, "declined");
        // Send decline email
        await sendDeclineEmail(
          request.traveller.email,
          request.route,
          "Service temporarily unavailable"
        );
        await fetchBookingRequests(); // Refresh the list
      }
    } catch (error) {
      console.error("Error declining booking:", error);
    }
  };

  const handleSendDriverDetails = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setIsDriverModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDriverModalOpen(false);
    setIsUserDetailsModalOpen(false);
    setIsDriverDetailsModalOpen(false);
    setSelectedBookingId(null);
    setSelectedBooking(null);
    setDriverDetails({
      name: "",
      whatsappNumber: "",
      vehicleNumber: "",
    });
  };

  const handleShowUserDetails = (booking: BookingRequest) => {
    setSelectedBooking(booking);
    setIsUserDetailsModalOpen(true);
  };

  const handleShowDriverDetails = (booking: BookingRequest) => {
    setSelectedBooking(booking);
    setIsDriverDetailsModalOpen(true);
  };

  const sendUserDetailsToWhatsApp = (booking: BookingRequest) => {
    if (!booking.driverDetails?.whatsappNumber) return;

    const message = `User Details for Booking:
Name: ${booking.traveller.name}
Email: ${booking.traveller.email}
Phone: ${booking.traveller.mobile}
Route: ${booking.route}
Service: ${booking.serviceType}
Cab Type: ${booking.cab.type}
Date: ${booking.date || "N/A"}
Time: ${booking.time || "N/A"}
Payment Method: ${getPaymentMethodText(booking.paymentMethod)}
Total Amount: ₹${booking.cab.price?.toLocaleString() || "0"}

Please contact the customer for pickup details.`;

    const whatsappUrl = `https://wa.me/${booking.driverDetails.whatsappNumber.replace(
      /[^0-9]/g,
      ""
    )}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const sendDriverDetailsToWhatsApp = (booking: BookingRequest) => {
    if (!booking.driverDetails || !booking.traveller.mobile) return;

    const message = `Your Driver Details:
Driver Name: ${booking.driverDetails.name}
Driver Contact: ${booking.driverDetails.whatsappNumber}
Vehicle Number: ${booking.driverDetails.vehicleNumber}
Route: ${booking.route}
Service: ${booking.serviceType}
Cab Type: ${booking.cab.type}

Your driver will contact you soon for pickup.`;

    const whatsappUrl = `https://wa.me/${booking.traveller.mobile.replace(
      /[^0-9]/g,
      ""
    )}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const getPaymentMethodText = (paymentMethod: string) => {
    if (paymentMethod === "0") return "Cash on Delivery";
    if (paymentMethod === "20") return "20% Advance";
    if (paymentMethod === "100") return "100% Advance";
    return "Advance Payment";
  };

  // Three-dot menu component
  const ThreeDotMenu = ({ request }: { request: BookingRequest }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-gray-400 hover:text-white transition-colors"
          title="More options"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-20">
              <div className="py-1">
                <button
                  onClick={() => {
                    handleShowUserDetails(request);
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  User Details
                </button>
                {request.driverDetails && (
                  <button
                    onClick={() => {
                      handleShowDriverDetails(request);
                      setIsOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    Driver Details
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const handleSubmitDriverDetails = async () => {
    if (!selectedBookingId) return;

    try {
      setIsSubmittingDriverDetails(true);
      await addDriverDetails(selectedBookingId, driverDetails);
      await fetchBookingRequests(); // Refresh the list
      handleCloseModal();
    } catch (error) {
      console.error("Error adding driver details:", error);
    } finally {
      setIsSubmittingDriverDetails(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-600", text: "Pending" },
      accepted: { color: "bg-blue-600", text: "Accepted" },
      declined: { color: "bg-red-600", text: "Declined" },
      driver_sent: { color: "bg-green-600", text: "Driver Sent" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  const getPaymentBadge = (paymentMethod: string) => {
    if (paymentMethod === "0") {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-semibold text-white bg-green-600">
          Cash on Delivery
        </span>
      );
    } else if (paymentMethod === "20") {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-semibold text-white bg-blue-600">
          20% Advance
        </span>
      );
    } else if (paymentMethod === "100") {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-semibold text-white bg-purple-600">
          100% Advance
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold text-white bg-blue-600">
        Advance Payment
      </span>
    );
  };

  const renderActionButtons = (request: BookingRequest) => {
    switch (request.status) {
      case "pending":
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleAcceptBooking(request._id)}
              className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
            >
              Accept
            </button>
            <button
              onClick={() => handleDeclineBooking(request._id)}
              className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              Decline
            </button>
            <ThreeDotMenu request={request} />
          </div>
        );

      case "accepted":
        if (request.driverDetails) {
          return (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleSendDriverDetails(request._id)}
                className="px-3 py-1 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition-colors"
                title="Resend driver details to customer"
              >
                Send Again
              </button>
              <ThreeDotMenu request={request} />
            </div>
          );
        }
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleSendDriverDetails(request._id)}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Send Driver Details
            </button>
            <ThreeDotMenu request={request} />
          </div>
        );

      case "driver_sent":
        if (request.driverDetails) {
          return (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleSendDriverDetails(request._id)}
                className="px-3 py-1 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition-colors"
                title="Resend driver details to customer"
              >
                Change Driver
              </button>
              <ThreeDotMenu request={request} />
            </div>
          );
        }
        return (
          <div className="flex items-center space-x-2">
            <div className="text-green-500 text-sm font-semibold">
              Driver assigned
            </div>
            <ThreeDotMenu request={request} />
          </div>
        );

      case "declined":
        return (
          <div className="flex items-center space-x-2">
            <div className="text-red-500 text-sm font-semibold">
              Booking declined
            </div>
            <ThreeDotMenu request={request} />
          </div>
        );

      default:
        return <ThreeDotMenu request={request} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2
            className="text-xl sm:text-2xl font-bold"
            style={{
              color: theme.colors.accent.gold,
              fontFamily: theme.typography.fontFamily.sans.join(", "),
            }}
          >
            Booking Management
          </h2>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">
            Manage booking requests and assign drivers
          </p>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold text-white">
              {bookingRequests.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">
              Total Bookings
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search bookings by name, email, phone, or route..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm sm:text-base"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="declined">Declined</option>
          <option value="driver_sent">Driver Sent</option>
        </select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading bookings...</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <div
          className="rounded-2xl border border-gray-700 overflow-hidden"
          style={{
            backgroundColor: theme.colors.background.card,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left">
                    <button
                      onClick={() => handleSort("traveller.name")}
                      className="flex items-center space-x-1 sm:space-x-2 text-white font-semibold hover:text-yellow-500 transition-colors text-xs sm:text-sm"
                    >
                      <span>Customer</span>
                      {sortBy === "traveller.name" && (
                        <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-xs sm:text-sm">
                    Service
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-xs sm:text-sm">
                    Route
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left">
                    <button
                      onClick={() => handleSort("cab.price")}
                      className="flex items-center space-x-1 sm:space-x-2 text-white font-semibold hover:text-yellow-500 transition-colors text-xs sm:text-sm"
                    >
                      <span>Remaining Payment</span>
                      {sortBy === "cab.price" && (
                        <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-xs sm:text-sm">
                    Payment
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-xs sm:text-sm">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-xs sm:text-sm">
                    Driver Details
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-xs sm:text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRequests.map((request, index) => (
                  <tr
                    key={request._id}
                    className={`border-b border-gray-700 hover:bg-gray-700 transition-colors ${
                      index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
                    }`}
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div>
                        <div className="font-semibold text-white text-xs sm:text-sm">
                          {request.traveller.name || "N/A"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {request.traveller.email || "N/A"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {request.traveller.mobile || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="text-white text-xs sm:text-sm">
                        {request.serviceType || "N/A"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {request.cab.type || "N/A"}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="text-white text-xs sm:text-sm">
                        {request.route || "N/A"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {request.date || "N/A"} {request.time || "N/A"}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="text-white font-semibold text-xs sm:text-sm">
                        ₹
                        {(
                          request.calculatedPayment?.remainingAmount ||
                          request.cab.price ||
                          0
                        )?.toLocaleString() || "0"}
                      </div>
                      {request.calculatedPayment && (
                        <>
                          <div className="text-xs text-green-400">
                            Paid: ₹
                            {(
                              request.calculatedPayment.totalFare -
                              request.calculatedPayment.remainingAmount
                            ).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            Total: ₹
                            {request.calculatedPayment.totalFare.toLocaleString()}
                          </div>
                        </>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      {getPaymentBadge(request.paymentMethod || "0")}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      {getStatusBadge(request.status || "pending")}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      {request.driverDetails ? (
                        <div className="text-xs">
                          <div className="text-white font-semibold">
                            {request.driverDetails.name}
                          </div>
                          <div className="text-gray-400">
                            📱 {request.driverDetails.whatsappNumber}
                          </div>
                          <div className="text-gray-400">
                            🚗 {request.driverDetails.vehicleNumber}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs">
                          Not assigned
                        </span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      {renderActionButtons(request)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedRequests.length === 0 && (
            <div className="p-6 sm:p-8 text-center">
              <div className="text-gray-400 text-base sm:text-lg">
                No bookings found
              </div>
              <div className="text-gray-500 text-sm mt-2">
                Try adjusting your search or filters
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalBookings > 0 && (
        <div className="flex items-center justify-between bg-gray-800 px-6 py-4 border border-gray-600 rounded-lg">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Show</span>
              <select
                value={limit}
                onChange={(e) => {
                  const newLimit = parseInt(e.target.value);
                  setLimit(newLimit);
                  setCurrentPage(1); // Reset to first page when changing limit
                }}
                className="px-2 py-1 text-sm border border-gray-500 rounded bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center border border-gray-500 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-700 transition-colors"
              title="Previous page"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center border border-gray-500 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-700 transition-colors"
              title="Next page"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Driver Details Modal */}
      {isDriverModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div
            className="bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-md mx-auto"
            style={{
              border: `1px solid ${theme.colors.border.primary}`,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3
                className="text-lg sm:text-xl font-bold"
                style={{
                  color: theme.colors.accent.gold,
                  fontFamily: theme.typography.fontFamily.sans.join(", "),
                }}
              >
                Driver Details
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Driver Name
                </label>
                <input
                  type="text"
                  value={driverDetails.name}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                    setDriverDetails((prev) => ({ ...prev, name: value }));
                  }}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter driver name (letters only)"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={driverDetails.whatsappNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9+\-\s]/g, "");
                    setDriverDetails((prev) => ({
                      ...prev,
                      whatsappNumber: value,
                    }));
                  }}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter WhatsApp number (e.g., +91 98765 43210)"
                  maxLength={15}
                  pattern="[0-9+\-\s]+"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Vehicle Number
                </label>
                <input
                  type="text"
                  value={driverDetails.vehicleNumber}
                  onChange={(e) => {
                    // Allow both numbers and text (letters), plus spaces and dashes
                    const value = e.target.value.toUpperCase();
                    setDriverDetails((prev) => ({
                      ...prev,
                      vehicleNumber: value,
                    }));
                  }}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter vehicle number (e.g., GJ-01-AB-1234)"
                  maxLength={15}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-4 sm:mt-6">
              <button
                onClick={handleSubmitDriverDetails}
                disabled={isSubmittingDriverDetails}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors text-sm sm:text-base flex items-center justify-center"
              >
                {isSubmittingDriverDetails ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  "Send"
                )}
              </button>
              <button
                onClick={handleCloseModal}
                disabled={isSubmittingDriverDetails}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 disabled:bg-gray-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {isUserDetailsModalOpen && selectedBooking && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div
            className="bg-gray-900 rounded-2xl w-full max-w-2xl mx-auto border border-gray-700 flex flex-col max-h-[90vh]"
            style={{
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Header */}
            <div className="flex items-center p-6 border-b border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-yellow-400">
                  User Details send to driver
                </h3>
                <p className="text-gray-300 text-sm">
                  Customer booking information
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center">
                    <span className="mr-2">👤</span>
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Full Name
                      </label>
                      <div className="text-white text-lg font-medium">
                        {selectedBooking.traveller.name || "N/A"}
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Email Address
                      </label>
                      <div className="text-white text-lg">
                        {selectedBooking.traveller.email || "N/A"}
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Phone Number
                      </label>
                      <div className="text-white text-lg font-medium">
                        {selectedBooking.traveller.mobile || "N/A"}
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Payment Method
                      </label>
                      <div className="text-white text-lg">
                        {getPaymentMethodText(selectedBooking.paymentMethod)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Information */}
                <div>
                  <h4 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center">
                    <span className="mr-2">🚗</span>
                    Booking Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Service Type
                      </label>
                      <div className="text-white text-lg font-medium">
                        {selectedBooking.serviceType || "N/A"}
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Route
                      </label>
                      <div className="text-white text-lg">
                        {selectedBooking.route || "N/A"}
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Date & Time
                      </label>
                      <div className="text-white text-lg">
                        {selectedBooking.date || "N/A"}{" "}
                        {selectedBooking.time || "N/A"}
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Total Amount
                      </label>
                      <div className="text-green-400 text-xl font-bold">
                        ₹{selectedBooking.cab.price?.toLocaleString() || "0"}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 p-6 border-t border-gray-700">
              <button
                onClick={() => sendUserDetailsToWhatsApp(selectedBooking)}
                disabled={!selectedBooking.driverDetails?.whatsappNumber}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                <span>Send to WhatsApp</span>
              </button>
              <button
                onClick={handleCloseModal}
                className="px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Driver Details Modal */}
      {isDriverDetailsModalOpen &&
        selectedBooking &&
        selectedBooking.driverDetails && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div
              className="bg-gray-900 rounded-2xl w-full max-w-2xl mx-auto border border-gray-700 flex flex-col max-h-[90vh]"
              style={{
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
              }}
            >
              {/* Header */}
              <div className="flex items-center p-6 border-b border-gray-700">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-yellow-400">
                    Driver Details send to user
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Assigned driver information
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Driver Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center">
                      <span className="mr-2">🚗</span>
                      Driver Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Driver Name
                        </label>
                        <div className="text-white text-lg font-medium">
                          {selectedBooking.driverDetails.name}
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Contact Number
                        </label>
                        <div className="text-white text-lg font-medium">
                          {selectedBooking.driverDetails.whatsappNumber}
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Vehicle Number
                        </label>
                        <div className="text-white text-lg font-medium">
                          {selectedBooking.driverDetails.vehicleNumber}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center">
                      <span className="mr-2">📋</span>
                      Booking Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Customer Name
                        </label>
                        <div className="text-white text-lg font-medium">
                          {selectedBooking.traveller.name}
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Service Type
                        </label>
                        <div className="text-white text-lg">
                          {selectedBooking.serviceType}
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Date & Time
                        </label>
                        <div className="text-white text-lg">
                          {selectedBooking.date || "N/A"}{" "}
                          {selectedBooking.time || "N/A"}
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Route
                        </label>
                        <div className="text-white text-lg">
                          {selectedBooking.route}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center">
                      <span className="mr-2">📞</span>
                      Customer Contact
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Customer Phone
                        </label>
                        <div className="text-white text-lg font-medium">
                          {selectedBooking.traveller.mobile}
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Customer Email
                        </label>
                        <div className="text-white text-lg">
                          {selectedBooking.traveller.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 p-6 border-t border-gray-700">
                <button
                  onClick={() => sendDriverDetailsToWhatsApp(selectedBooking)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  <span>Send to Customer</span>
                </button>
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
