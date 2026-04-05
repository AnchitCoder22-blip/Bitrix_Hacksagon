export const CLINIC_LOCATION = { lat: 28.6139, lng: 77.2090, name: "HealthQueue Central Clinic", address: "123 Healthcare Ave, New Delhi" };

export const SPECIALTIES = [
  "General Physician", "Cardiologist", "Dermatologist", "Orthopedic",
  "Pediatrician", "Neurologist", "ENT Specialist", "Gynecologist",
  "Ophthalmologist", "Psychiatrist", "Dentist", "Urologist"
];

export { DOCTORS } from './mockDoctors';

export const LAB_TESTS = [
  { id: 1, name: "Complete Blood Count (CBC)", price: 350, duration: "4-6 hours", category: "Blood", icon: "🩸", description: "Measures components of blood including red and white blood cells" },
  { id: 2, name: "Lipid Profile", price: 500, duration: "24 hours", category: "Blood", icon: "💉", description: "Measures cholesterol and triglyceride levels" },
  { id: 3, name: "Thyroid Function Test", price: 600, duration: "24 hours", category: "Hormone", icon: "🧬", description: "Checks thyroid hormone levels (T3, T4, TSH)" },
  { id: 4, name: "Blood Sugar (Fasting)", price: 150, duration: "2 hours", category: "Blood", icon: "🍬", description: "Measures blood glucose levels after fasting" },
  { id: 5, name: "Liver Function Test", price: 450, duration: "24 hours", category: "Organ", icon: "🫁", description: "Evaluates liver function and detects liver disease" },
  { id: 6, name: "Kidney Function Test", price: 500, duration: "24 hours", category: "Organ", icon: "🫘", description: "Assesses kidney health and function" },
  { id: 7, name: "Vitamin D Test", price: 800, duration: "48 hours", category: "Vitamin", icon: "☀️", description: "Measures vitamin D levels in blood" },
  { id: 8, name: "HbA1c", price: 400, duration: "24 hours", category: "Blood", icon: "📊", description: "Average blood sugar over past 3 months" },
  { id: 9, name: "Urine Analysis", price: 200, duration: "4 hours", category: "Urine", icon: "🧪", description: "Examines urine for various health indicators" },
  { id: 10, name: "ECG", price: 300, duration: "30 min", category: "Cardiac", icon: "❤️", description: "Records electrical activity of the heart" },
];

export const SYMPTOM_RULES = [
  { keywords: ["chest pain", "heart", "breathing difficulty", "palpitation"], specialty: "Cardiologist", severity: "high", advice: "Please seek immediate medical attention if symptoms are severe." },
  { keywords: ["headache", "migraine", "dizziness", "numbness", "seizure"], specialty: "Neurologist", severity: "medium", advice: "Track your symptoms and note any triggers." },
  { keywords: ["skin", "rash", "acne", "allergy", "itching", "eczema"], specialty: "Dermatologist", severity: "low", advice: "Avoid scratching and keep the area clean." },
  { keywords: ["bone", "joint", "fracture", "back pain", "knee", "spine"], specialty: "Orthopedic", severity: "medium", advice: "Rest the affected area and apply ice if swelling." },
  { keywords: ["child", "fever", "vaccination", "growth", "infant"], specialty: "Pediatrician", severity: "medium", advice: "Monitor temperature and keep the child hydrated." },
  { keywords: ["ear", "nose", "throat", "sinus", "hearing", "tonsil"], specialty: "ENT Specialist", severity: "low", advice: "Stay hydrated and avoid irritants." },
  { keywords: ["eye", "vision", "blurry", "redness", "glasses"], specialty: "Ophthalmologist", severity: "low", advice: "Rest your eyes and avoid screens." },
  { keywords: ["stress", "anxiety", "depression", "sleep", "insomnia", "mental"], specialty: "Psychiatrist", severity: "medium", advice: "Practice deep breathing. You're not alone." },
  { keywords: ["stomach", "digestion", "nausea", "vomiting", "abdomen"], specialty: "General Physician", severity: "medium", advice: "Stay hydrated and eat light foods." },
  { keywords: ["cold", "cough", "flu", "fever", "body pain", "weakness"], specialty: "General Physician", severity: "low", advice: "Rest, hydrate, and monitor your temperature." },
];

export const ANALYTICS_DATA = {
  peakHours: [
    { hour: "8AM", patients: 12 }, { hour: "9AM", patients: 28 }, { hour: "10AM", patients: 45 },
    { hour: "11AM", patients: 52 }, { hour: "12PM", patients: 38 }, { hour: "1PM", patients: 20 },
    { hour: "2PM", patients: 35 }, { hour: "3PM", patients: 48 }, { hour: "4PM", patients: 42 },
    { hour: "5PM", patients: 30 }, { hour: "6PM", patients: 18 }, { hour: "7PM", patients: 8 },
  ],
  waitTrends: [
    { day: "Mon", avg: 18 }, { day: "Tue", avg: 22 }, { day: "Wed", avg: 15 },
    { day: "Thu", avg: 25 }, { day: "Fri", avg: 30 }, { day: "Sat", avg: 12 }, { day: "Sun", avg: 8 },
  ],
  doctorPerformance: [
    { name: "Dr. Aisha", patientsServed: 45, avgWait: 12, satisfaction: 4.9 },
    { name: "Dr. Rajesh", patientsServed: 62, avgWait: 8, satisfaction: 4.7 },
    { name: "Dr. Priya", patientsServed: 38, avgWait: 15, satisfaction: 4.8 },
    { name: "Dr. Vikram", patientsServed: 28, avgWait: 20, satisfaction: 4.6 },
  ],
  patientFlow: { total: 1247, today: 86, avgPerDay: 78, satisfaction: 4.7 },
};
