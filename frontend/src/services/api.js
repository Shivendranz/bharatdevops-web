// Data fetch karne ka logic
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const fetchCourses = async () => {
    const res = await fetch(`${API_URL}/api/courses/`);
    return res.json();
};
