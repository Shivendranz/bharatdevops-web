// Data fetch karne ka logic
const API_URL = process.env.NEXT_PUBLIC_API_URL || '${process.env.NEXT_PUBLIC_API_URL}';

export const fetchCourses = async () => {
    const res = await fetch(`${API_URL}/api/courses/`);
    return res.json();
};
