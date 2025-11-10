// Formatting Utilities
export const formatDate = (dateValue?: string | number): string => {
  if (dateValue === undefined || dateValue === null) return "N/A";
  
  try {
    let date: Date;
    
    // Handle epoch timestamp (number)
    if (typeof dateValue === "number") {
      // Check if it's in seconds (less than year 2000 in milliseconds) or milliseconds
      // Timestamps after 2000-01-01 in seconds would be > 946684800
      // If it's less than 1e12, it's likely in seconds
      const timestamp = dateValue < 1e12 ? dateValue * 1000 : dateValue;
      date = new Date(timestamp);
    } else {
      // Handle ISO string or other date strings
      date = new Date(dateValue);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return String(dateValue);
    }
    
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(dateValue);
  }
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  }
  return phone;
};

