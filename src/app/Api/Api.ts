export const BASE_URL = "https://project-consult-1.onrender.com";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: ApiError = {
      message: errorData.message || "An error occurred",
      status: response.status,
      errors: errorData.errors,
    };
    throw error;
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

async function request<T>(
  endpoint: string,
  method: RequestMethod = "GET",
  body?: any,
  customHeaders: Record<string, string> = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint
    }`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  // Add authorization token if available
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const options: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(url, options);
    return handleResponse<T>(response);
  } catch (error) {
    console.error(`API Request failed for ${url}:`, error);
    throw error;
  }
}

// Auth API - OTP-based WhatsApp authentication
export const AuthApi = {
  // Send OTP to user's WhatsApp number
  sendOTP: (phone: string) => request("/api/auth/send-otp", "POST", { phone }),
  // Verify OTP and get JWT token
  verifyOTP: (phone: string, otp: string) => request("/api/auth/verify-otp", "POST", { phone, otp }),
  // Get user profile
  getProfile: () => request("/api/users/profile", "GET"),
  // Update user profile (name, email)
  updateProfile: (data: { name: string; email: string }) => request("/api/users/profile", "PUT", data),
};

// Contact API
export const ContactApi = {
  submitQuery: (data: any) => request("/contact", "POST", data),
};

// Plans/Subscription API
export const PlansApi = {
  getAllPlans: () => request("/plans", "GET"),
  getPlanById: (id: string) => request(`/plans/${id}`, "GET"),
  subscribe: (planId: string, data: any) =>
    request(`/plans/${planId}/subscribe`, "POST", data),
};

// Courses API
export const CoursesApi = {
  getAllCourses: () => request("/courses", "GET"),
  getCourseById: (id: string) => request(`/courses/${id}`, "GET"),
  enroll: (courseId: string) => request(`/courses/${courseId}/enroll`, "POST"),
  getMyCourses: () => request("/courses/my-courses", "GET"),
};

// Workshops API
export const WorkshopsApi = {
  getAllWorkshops: () => request("/workshops", "GET"),
  register: (workshopId: string, data: any) =>
    request(`/workshops/${workshopId}/register`, "POST", data),
};

// Payment API
export const PaymentApi = {
  createOrder: (data: any) => request("/payment/create-order", "POST", data),
  verifyPayment: (data: any) => request("/payment/verify", "POST", data),
};

// General/Other APIs reflecting the file structure
export const ServiceApi = {
  getAllServices: () => request("/services", "GET"),
};

export const BlogApi = {
  getAllBlogs: () => request("/blogs", "GET"),
  getBlogBySlug: (slug: string) => request(`/blogs/${slug}`, "GET"),
};

export const SmallCaseApi = {
  getAll: () => request("/small-case", "GET"),
};

export default {
  Auth: AuthApi,
  Contact: ContactApi,
  Plans: PlansApi,
  Courses: CoursesApi,
  Workshops: WorkshopsApi,
  Payment: PaymentApi,
  Service: ServiceApi,
  Blog: BlogApi,
  SmallCase: SmallCaseApi,
};
