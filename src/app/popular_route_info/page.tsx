// src/app/popular_route_info/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { environment } from "@/config/environment";
import { FaSearch, FaArrowRight } from "react-icons/fa";

interface Route {
  id: string;
  routeName: string;
  from: string;
  to: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  status: "active" | "inactive";
  tags: string[];
  lastBooking: string;
  createdAt: string;
}

const PopularRouteInfo: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || environment.baseUrl
        }/routes?status=active&limit=50`
      );
      const data = await response.json();
      if (data.success) {
        setRoutes(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to decode HTML entities like &nbsp; and &amp;
  const decodeHtmlEntities = (html: string): string => {
    if (!html) return "";
    // Replace HTML entities with their actual characters
    return html
      .replace(/&nbsp;/g, " ")
      .replace(/&#160;/g, " ") // Decimal form of &nbsp;
      .replace(/&#x20;/g, " ") // Hex form of space
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  };

  const filteredRoutes = routes.filter((route) => {
    const matchesSearch =
      route.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || route.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // Function to scroll to booking widget
  const scrollToBookingWidget = () => {
    setTimeout(() => {
      const bookingSection = document.getElementById("booking-widget");
      if (bookingSection) {
        bookingSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  // Handle booking button click
  const handleBookNowClick = () => {
    // If not on homepage, navigate first
    if (window.location.pathname !== "/") {
      window.location.href = "/";
      setTimeout(() => {
        scrollToBookingWidget();
      }, 500);
    } else {
      // If already on homepage, just scroll
      scrollToBookingWidget();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          <p className="mt-4 text-gray-300">Loading routes...</p>
        </div>
      </div>
    );
  }

  console.log(filteredRoutes, "mayank");

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Penta CAB
              <span className="block text-yellow-500">Routes</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover our routes and destinations. Find the perfect route for
              your journey with our reliable cab service.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            {/* Search Bar */}
            <div className="relative flex gap-2 w-full max-w-md">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search routes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => {
                  // Clear search
                  setSearchTerm("");
                  setSelectedTag("");
                }}
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                title="Clear search"
              >
                Clear
              </button>
            </div>

            {/* Tag Filter */}
            {/* <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag("")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === ""
                    ? "bg-yellow-500 text-black"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                All
              </button>
              {allTags.slice(0, 5).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === tag
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div> */}
          </div>
        </div>
      </div>

      {/* Routes Grid */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredRoutes.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-xl mb-4">No routes found</div>
              <p className="text-gray-500">
                {searchTerm || selectedTag
                  ? "Try adjusting your search or filter criteria"
                  : "Check back soon for new routes!"}
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Available Routes
                </h2>
                <p className="text-gray-400">
                  {filteredRoutes.length} route
                  {filteredRoutes.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRoutes.map((route) => (
                  <Link
                    key={route.id}
                    href={`/routes/${route.routeName?.replace(/\s+/g, "-")}/${
                      route.id
                    }`}
                    className="block"
                  >
                    <article className="bg-gray-900 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 group cursor-pointer">
                      <div className="p-6">
                        {/* Title */}
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors line-clamp-2">
                          {route.routeName}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                          {decodeHtmlEntities(
                            route.description.replace(/<[^>]*>/g, "")
                          ).substring(0, 90)}
                          ...
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Ready for Your Next Journey?
          </h2>
          <p className="text-black/80 text-lg mb-8">
            Book your ride with Penta CAB and experience comfortable, reliable
            transportation on any of our routes.
          </p>
          <button
            onClick={handleBookNowClick}
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Book Now
            <FaArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopularRouteInfo;
