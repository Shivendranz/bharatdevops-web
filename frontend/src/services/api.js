// Data fetch karne ka logic
// Agar environment variable nahi milta, toh ye default value lega (lekin Vercel par mil jayega)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.bharatdevops.com';

export const fetchCourses = async () => {
    try {
        const res = await fetch(`${API_URL}/api/courses/`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error("Fetch Error:", error);
        return [];
    }
};