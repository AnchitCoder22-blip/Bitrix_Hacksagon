const fs = require('fs');

const generateId = () => Math.random().toString(36).slice(2, 9);

const MALE_NAMES = ["Rahul", "Amit", "Arjun", "Karan", "Sanjay", "Anil", "Vikram", "Ravi", "Suresh", "Manoj", "Raj", "Aditya", "Rohan", "Kabir", "Neha", "Varun"];
const FEMALE_NAMES = ["Priya", "Neha", "Anjali", "Pooja", "Maya", "Kavita", "Riya", "Sneha", "Kiran", "Nisha", "Swati", "Nandini", "Shruti", "Tanvi"];

function getRandomName(gender) {
    const list = gender === 'Male' ? MALE_NAMES : FEMALE_NAMES;
    const first = list[Math.floor(Math.random() * list.length)];
    const lastNames = ["Sharma", "Verma", "Patel", "Reddy", "Singh", "Gupta", "Rao", "Jain", "Mehta", "Iyer"];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${first} ${last}`;
}

const PROBLEMS = ["General checkup", "Fever", "Headache", "Cough", "Body ache", "Follow up", "Consultation", "Skin rash", "Joint pain", "Stomach ache"];

function generatePatients(count, type) {
    const patients = [];
    const now = Date.now();
    for (let i = 0; i < count; i++) {
        const gender = Math.random() > 0.5 ? 'Male' : 'Female';
        const isCompleted = type === 'past' || (type !== 'active' && Math.random() > 0.6);
        
        // Ensure some are definitely active vs completed based on type, otherwise random mix
        let status = 'waiting';
        if (type === 'past') status = 'served';
        if (type === 'active') status = 'waiting';
        else if (Math.random() > 0.8) status = 'arrived';
        
        patients.push({
            id: generateId(),
            tokenNumber: Math.floor(Math.random() * 9000) + 1000,
            name: getRandomName(gender),
            age: Math.floor(Math.random() * 60) + 10,
            gender: gender,
            problem: PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)],
            priority: Math.random() > 0.9 ? 'emergency' : 'normal',
            isEmergency: Math.random() > 0.95,
            isVIP: false,
            status: status,
            joinedAt: new Date(now - Math.random() * 10000000).toISOString(),
            type: 'instant'
        });
    }
    return patients;
}

const DOCTORS = [
  { id: 1, username: "pooja", name: "Dr. Pooja Jain", specialty: "General Physician", hospital: "Apollo Hospital", rating: 4.9, experience: 14, fee: 800, available: true, avatar: "👩‍⚕️", avgTime: 12, patients: generatePatients(25, 'active') },
  { id: 2, username: "naman", name: "Dr. Naman Mishra", specialty: "General Physician", hospital: "Fortis Clinic", rating: 4.8, experience: 8, fee: 600, available: true, avatar: "👨‍⚕️", avgTime: 15, patients: generatePatients(3, 'active') },
  { id: 3, username: "priya", name: "Dr. Priya Sharma", specialty: "Cardiologist", hospital: "Max Healthcare", rating: 4.7, experience: 12, fee: 1200, available: true, avatar: "👩‍⚕️", avgTime: 20, patients: generatePatients(12, 'mixed') },
  { id: 4, username: "rahul", name: "Dr. Rahul Verma", specialty: "Orthopedic", hospital: "Bone Care Center", rating: 4.6, experience: 18, fee: 900, available: true, avatar: "👨‍⚕️", avgTime: 25, patients: generatePatients(14, 'mixed') },
  { id: 5, username: "sneha", name: "Dr. Sneha Reddy", specialty: "Pediatrician", hospital: "Rainbow Hospital", rating: 4.9, experience: 10, fee: 700, available: true, avatar: "👩‍⚕️", avgTime: 12, patients: generatePatients(10, 'mixed') },
  { id: 6, username: "arjun", name: "Dr. Arjun Nair", specialty: "Neurologist", hospital: "Brain & Spine Clinic", rating: 4.5, experience: 20, fee: 1500, available: true, avatar: "👨‍⚕️", avgTime: 30, patients: generatePatients(9, 'mixed') },
  { id: 7, username: "kavita", name: "Dr. Kavita Gupta", specialty: "ENT Specialist", hospital: "Clear Ear Clinic", rating: 4.8, experience: 15, fee: 650, available: true, avatar: "👩‍⚕️", avgTime: 15, patients: generatePatients(11, 'mixed') },
  { id: 8, username: "vikram", name: "Dr. Vikram Singh", specialty: "Ophthalmologist", hospital: "Vision Care", rating: 4.7, experience: 11, fee: 750, available: true, avatar: "👨‍⚕️", avgTime: 18, patients: generatePatients(8, 'mixed') },
  { id: 9, username: "anjali", name: "Dr. Anjali Desai", specialty: "Dermatologist", hospital: "Skin Glow Clinic", rating: 4.8, experience: 9, fee: 850, available: true, avatar: "👩‍⚕️", avgTime: 15, patients: generatePatients(13, 'mixed') },
  { id: 10, username: "sanjay", name: "Dr. Sanjay Rao", specialty: "Psychiatrist", hospital: "Mindful Health", rating: 4.8, experience: 22, fee: 1000, available: true, avatar: "👨‍⚕️", avgTime: 40, patients: generatePatients(15, 'mixed') },
];

fs.writeFileSync('./src/data/mockDoctors.js', `export const DOCTORS = ${JSON.stringify(DOCTORS, null, 2)};`);
console.log("Mock data generated in src/data/mockDoctors.js");
