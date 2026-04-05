const generateId = () => Math.random().toString(36).slice(2, 9);
const now = Date.now();

const timeOffset = (minutes) => new Date(now - minutes * 60000).toISOString();

const MALE_NAMES = ["Rahul", "Amit", "Arjun", "Karan", "Sanjay", "Anil", "Vikram", "Ravi", "Suresh", "Manoj", "Raj", "Aditya", "Rohan", "Kabir", "Varun"];
const FEMALE_NAMES = ["Priya", "Neha", "Anjali", "Pooja", "Maya", "Kavita", "Riya", "Sneha", "Kiran", "Nisha", "Swati", "Nandini", "Shruti", "Tanvi"];
const LAST_NAMES = ["Sharma", "Verma", "Patel", "Reddy", "Singh", "Gupta", "Rao", "Jain", "Mehta", "Iyer"];

const PROBLEMS = ["General checkup", "Fever", "Headache", "Cough", "Body ache", "Follow up", "Consultation", "Skin rash", "Joint pain", "Stomach ache"];

function getRandomName(gender) {
    const list = gender === 'Male' ? MALE_NAMES : FEMALE_NAMES;
    const first = list[Math.floor(Math.random() * list.length)];
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    return `${first} ${last}`;
}

function createPatient(type) {
    const gender = Math.random() > 0.5 ? 'Male' : 'Female';
    let status = 'waiting';
    if (type === 'past') status = 'served';
    else if (type === 'active') status = Math.random() > 0.3 ? 'waiting' : 'arrived';
    
    return {
        id: generateId(),
        tokenNumber: Math.floor(Math.random() * 9000) + 1000,
        name: getRandomName(gender),
        age: Math.floor(Math.random() * 60) + 10,
        gender: gender,
        phone: '98' + Math.floor(Math.random() * 100000000),
        problem: PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)],
        priority: Math.random() > 0.95 ? 'emergency' : 'normal',
        isEmergency: false,
        isVIP: false,
        status: status,
        joinedAt: timeOffset(Math.floor(Math.random() * 180)),
        type: 'instant'
    };
}

function generatePatients(count, type) {
    const patients = [];
    for (let i = 0; i < count; i++) {
        patients.push(createPatient(type));
    }
    return patients;
}

export const DOCTORS = [
  { id: 1, username: "pooja", name: "Dr. Pooja Jain", specialty: "Cardiologist", hospital: "Apollo Hospital", rating: 4.9, experience: 14, fee: 800, available: true, avatar: "👩‍⚕️", avgTime: 12, patients: generatePatients(24, 'active') },
  { id: 2, username: "naman", name: "Dr. Naman Mishra", specialty: "Cardiologist", hospital: "Fortis Clinic", rating: 4.8, experience: 8, fee: 600, available: true, avatar: "👨‍⚕️", avgTime: 15, patients: generatePatients(2, 'active') },
  { id: 3, username: "priya", name: "Dr. Priya Sharma", specialty: "General Physician", hospital: "Max Healthcare", rating: 4.7, experience: 12, fee: 1200, available: true, avatar: "👩‍⚕️", avgTime: 20, patients: [...generatePatients(10, 'active'), ...generatePatients(4, 'past')] },
  { id: 4, username: "rahul", name: "Dr. Rahul Verma", specialty: "Orthopedic", hospital: "Bone Care Center", rating: 4.6, experience: 18, fee: 900, available: true, avatar: "👨‍⚕️", avgTime: 25, patients: [...generatePatients(8, 'active'), ...generatePunch(5)] },
  { id: 5, username: "sneha", name: "Dr. Sneha Reddy", specialty: "Pediatrician", hospital: "Rainbow Hospital", rating: 4.9, experience: 10, fee: 700, available: false, avatar: "👩‍⚕️", avgTime: 12, patients: generatePatients(0, 'active') },
  { id: 6, username: "arjun", name: "Dr. Arjun Nair", specialty: "Neurologist", hospital: "Brain & Spine Clinic", rating: 4.5, experience: 20, fee: 1500, available: true, avatar: "👨‍⚕️", avgTime: 30, patients: generatePatients(11, 'active') },
  { id: 7, username: "kavita", name: "Dr. Kavita Gupta", specialty: "ENT Specialist", hospital: "Clear Ear Clinic", rating: 4.8, experience: 15, fee: 650, available: true, avatar: "👩‍⚕️", avgTime: 15, patients: generatePatients(13, 'active') },
  { id: 8, username: "vikram", name: "Dr. Vikram Singh", specialty: "Ophthalmologist", hospital: "Vision Care", rating: 4.7, experience: 11, fee: 750, available: true, avatar: "👨‍⚕️", avgTime: 18, patients: generatePatients(9, 'active') },
  { id: 9, username: "anjali", name: "Dr. Anjali Desai", specialty: "Dermatologist", hospital: "Skin Glow Clinic", rating: 4.8, experience: 9, fee: 850, available: true, avatar: "👩‍⚕️", avgTime: 15, patients: generatePatients(14, 'active') },
  { id: 10, username: "sanjay", name: "Dr. Sanjay Rao", specialty: "Psychiatrist", hospital: "Mindful Health", rating: 4.8, experience: 22, fee: 1000, available: true, avatar: "👨‍⚕️", avgTime: 35, patients: generatePatients(10, 'active') },
];

function generatePunch(count) {
    return generatePatients(count, 'past');
}
