import type { DiscountItem } from "./components/DiscountCard";

const API_BASE = 'http://localhost:5000/api';

const mockDiscounts: DiscountItem[] = [
  { id: 1, title: '50% off Lviv Croissants', description: 'Amazing deal near Rynok Square', originalPrice: 100, discountPrice: 50, latitude: 49.8419, longitude: 24.0315, categoryId: 1, dateAdded: new Date().toISOString(), category: { name: 'Food', icon: 'Utensils' }, imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1d4075cbf9?auto=format&fit=crop&q=80&w=800' },
  { id: 2, title: 'Cinema City Multiplex', description: '2 for 1 movie tickets', originalPrice: 300, discountPrice: 150, latitude: 49.8093, longitude: 24.0089, categoryId: 2, dateAdded: new Date().toISOString(), category: { name: 'Entertainment', icon: 'Film' }, imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800' },
  { id: 3, title: 'Comfy Outlet', description: 'Laptops on Sale', originalPrice: 20000, discountPrice: 18000, latitude: 49.8252, longitude: 23.9743, categoryId: 3, dateAdded: new Date().toISOString(), category: { name: 'Electronics', icon: 'Laptop' }, imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800' },
];

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function getDiscounts(query?: string): Promise<DiscountItem[]> {
  try {
    const res = await fetch(`${API_BASE}/discounts${query ? `?query=${query}` : ''}`, { headers: getHeaders() });
    if (res.ok) return await res.json();
  } catch (error) {
    console.warn("Backend unavailable, using mock data.");
  }
  
  if (query) {
    return mockDiscounts.filter(d => d.title.toLowerCase().includes(query.toLowerCase()));
  }
  return mockDiscounts;
}

export async function getDiscount(id: number): Promise<DiscountItem | null> {
  try {
    const res = await fetch(`${API_BASE}/discounts/${id}`, { headers: getHeaders() });
    if (res.ok) return await res.json();
  } catch (error) {
    console.warn("Backend unavailable, using mock data for detail.");
  }
  return mockDiscounts.find(d => d.id === id) || null;
}

export async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`, { headers: getHeaders() });
    if (res.ok) return await res.json();
  } catch (error) {
  }
  return [
    { id: 1, name: 'Food', icon: 'Utensils' },
    { id: 2, name: 'Entertainment', icon: 'Film' },
    { id: 3, name: 'Electronics', icon: 'Laptop' }
  ];
}

export async function getProfile() {
  const res = await fetch(`${API_BASE}/users/profile`, { headers: getHeaders() });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return await res.json();
}
