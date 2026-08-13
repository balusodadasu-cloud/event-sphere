const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const User = require('../models/User');
const Event = require('../models/Event');
const Club = require('../models/Club');
const Registration = require('../models/Registration');
const Notification = require('../models/Notification');
const Certificate = require('../models/Certificate');
const Result = require('../models/Result');
const Gallery = require('../models/Gallery');
const Bookmark = require('../models/Bookmark');

const generateQR = require('../utils/generateQR');
const { v4: uuidv4 } = require('uuid');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/campus-connect';

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Event.deleteMany({}),
      Club.deleteMany({}),
      Registration.deleteMany({}),
      Notification.deleteMany({}),
      Certificate.deleteMany({}),
      Result.deleteMany({}),
      Gallery.deleteMany({}),
      Bookmark.deleteMany({}),
    ]);
    console.log('🧹 Cleared existing data');

    // ─────────────────────────────────────────────
    // USERS
    // ─────────────────────────────────────────────
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const userPassword = await bcrypt.hash('Student@123', 10);

    const [admin, faculty1, faculty2, coord1, coord2, ...students] = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@campusconnect.com',
        password: adminPassword,
        role: 'admin',
        department: 'Administration',
        phone: '9000000001',
        bio: 'System administrator for Campus Connect.',
        isActive: true,
      },
      {
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh@campusconnect.com',
        password: userPassword,
        role: 'faculty',
        department: 'Computer Science',
        phone: '9000000002',
        bio: 'Professor of Computer Science.',
      },
      {
        name: 'Prof. Anita Sharma',
        email: 'anita@campusconnect.com',
        password: userPassword,
        role: 'faculty',
        department: 'Electronics',
        phone: '9000000003',
        bio: 'Professor of Electronics Engineering.',
      },
      {
        name: 'Vikram Singh',
        email: 'vikram@campusconnect.com',
        password: userPassword,
        role: 'coordinator',
        department: 'Computer Science',
        phone: '9000000004',
        bio: 'Tech Club Coordinator.',
      },
      {
        name: 'Priya Patel',
        email: 'priya@campusconnect.com',
        password: userPassword,
        role: 'coordinator',
        department: 'Arts & Science',
        phone: '9000000005',
        bio: 'Cultural Club Coordinator.',
      },
      {
        name: 'Arjun Mehta',
        email: 'arjun@campusconnect.com',
        password: userPassword,
        role: 'student',
        studentId: 'CS2021001',
        department: 'Computer Science',
        year: 3,
        phone: '9111111001',
        bio: 'Passionate about coding and AI.',
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha@campusconnect.com',
        password: userPassword,
        role: 'student',
        studentId: 'IT2021002',
        department: 'Information Technology',
        year: 3,
        phone: '9111111002',
        bio: 'Web developer and designer.',
      },
      {
        name: 'Rohit Verma',
        email: 'rohit@campusconnect.com',
        password: userPassword,
        role: 'student',
        studentId: 'EC2022003',
        department: 'Electronics',
        year: 2,
        phone: '9111111003',
      },
      {
        name: 'Ananya Krishnan',
        email: 'ananya@campusconnect.com',
        password: userPassword,
        role: 'student',
        studentId: 'CS2022004',
        department: 'Computer Science',
        year: 2,
        phone: '9111111004',
      },
      {
        name: 'Karthik Nair',
        email: 'karthik@campusconnect.com',
        password: userPassword,
        role: 'student',
        studentId: 'ME2021005',
        department: 'Mechanical',
        year: 3,
        phone: '9111111005',
      },
      {
        name: 'Pooja Gupta',
        email: 'pooja@campusconnect.com',
        password: userPassword,
        role: 'student',
        studentId: 'CS2023006',
        department: 'Computer Science',
        year: 1,
        phone: '9111111006',
      },
      {
        name: 'Siddharth Joshi',
        email: 'siddharth@campusconnect.com',
        password: userPassword,
        role: 'student',
        studentId: 'IT2022007',
        department: 'Information Technology',
        year: 2,
        phone: '9111111007',
      },
      {
        name: 'Divya Menon',
        email: 'divya@campusconnect.com',
        password: userPassword,
        role: 'student',
        studentId: 'MBA2021008',
        department: 'MBA',
        year: 2,
        phone: '9111111008',
      },
    ]);

    console.log('👥 Users created:', 4 + students.length, 'total');

    // ─────────────────────────────────────────────
    // CLUBS
    // ─────────────────────────────────────────────
    const clubs = await Club.insertMany([
      {
        name: 'TechWave Club',
        description: 'The premier technology club driving innovation, coding contests, hackathons, and technical workshops for students passionate about computing and technology.',
        logo: 'https://ui-avatars.com/api/?name=TW&background=6366f1&color=fff&size=128',
        department: 'Computer Science',
        coordinator: coord1._id,
        members: [
          { user: students[0]._id, role: 'President' },
          { user: students[1]._id, role: 'Vice President' },
        ],
        socialLinks: {
          instagram: 'https://instagram.com/techwaveclub',
          linkedin: 'https://linkedin.com/company/techwaveclub',
        },
      },
      {
        name: 'CulturalConnect Club',
        description: 'Celebrating the rich tapestry of Indian culture through dance, music, drama, and art. Organizing fests and events that bring the campus alive.',
        logo: 'https://ui-avatars.com/api/?name=CC&background=ec4899&color=fff&size=128',
        department: 'Arts & Science',
        coordinator: coord2._id,
        members: [
          { user: students[2]._id, role: 'President' },
          { user: students[3]._id, role: 'Secretary' },
        ],
        socialLinks: {
          instagram: 'https://instagram.com/culturalconnect',
        },
      },
      {
        name: 'CodeCraft Society',
        description: 'A community of competitive programmers, open-source contributors, and software developers building real-world projects and participating in global coding contests.',
        logo: 'https://ui-avatars.com/api/?name=CS&background=06b6d4&color=fff&size=128',
        department: 'Computer Science',
        coordinator: coord1._id,
        members: [
          { user: students[4]._id, role: 'President' },
          { user: students[5]._id, role: 'Tech Lead' },
        ],
        socialLinks: {
          github: 'https://github.com/codecraft',
          linkedin: 'https://linkedin.com/company/codecraft',
        },
      },
      {
        name: 'Sports & Fitness Club',
        description: 'Promoting sports, fitness, and a healthy lifestyle on campus. Organizing inter-college tournaments, yoga sessions, and sports events.',
        logo: 'https://ui-avatars.com/api/?name=SF&background=f59e0b&color=fff&size=128',
        department: 'Physical Education',
        coordinator: faculty1._id,
        members: [
          { user: students[6]._id, role: 'Sports Captain' },
        ],
        socialLinks: {},
      },
      {
        name: 'Entrepreneurship Cell',
        description: 'Fostering the entrepreneurial spirit among students through startup pitches, industry talks, mentorship programs, and business plan competitions.',
        logo: 'https://ui-avatars.com/api/?name=EC&background=10b981&color=fff&size=128',
        department: 'MBA',
        coordinator: faculty2._id,
        members: [
          { user: students[7]._id, role: 'President' },
        ],
        socialLinks: {
          linkedin: 'https://linkedin.com/company/ecell',
        },
      },
    ]);

    console.log('🏛️ Clubs created:', clubs.length);

    // ─────────────────────────────────────────────
    // EVENTS
    // ─────────────────────────────────────────────
    const now = new Date();
    const future = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const past = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const events = await Event.insertMany([
      {
        title: 'AI Innovation Hackathon 2026',
        description: 'Join us for a 24-hour hackathon where teams of 2-4 students build innovative AI-powered solutions to real-world problems. Mentors from top tech companies will guide you throughout. Prizes worth ₹1,50,000 to be won!',
        category: 'Hackathon',
        department: 'Computer Science',
        club: clubs[0]._id,
        organizer: coord1._id,
        date: future(15),
        startTime: '09:00',
        endTime: '09:00',
        venue: 'Main Auditorium & CS Labs',
        maxParticipants: 200,
        registrationDeadline: future(10),
        poster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop',
        rules: [
          'Teams of 2-4 members only',
          'At least one CS/IT student per team',
          'Use of pre-built AI models is allowed',
          'Plagiarism will result in disqualification',
          'Judges\' decision is final',
        ],
        requirements: ['Laptop with required software', 'College ID card', 'Team registration done before deadline'],
        contact: { name: 'Vikram Singh', email: 'vikram@campusconnect.com', phone: '9000000004' },
        status: 'published',
        tags: ['AI', 'Machine Learning', 'Innovation', 'Programming'],
        currentRegistrations: 45,
      },
      {
        title: 'React & Node.js Full-Stack Workshop',
        description: 'A hands-on 2-day workshop covering modern full-stack development with React.js, Node.js, Express, and MongoDB. Build a complete application from scratch with industry best practices.',
        category: 'Workshop',
        department: 'Computer Science',
        club: clubs[0]._id,
        organizer: faculty1._id,
        date: future(8),
        startTime: '10:00',
        endTime: '17:00',
        venue: 'Computer Lab 3, Block A',
        maxParticipants: 60,
        registrationDeadline: future(5),
        poster: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&auto=format&fit=crop',
        rules: [
          'Basic knowledge of HTML/CSS/JavaScript required',
          'Bring your own laptop',
          'Attendance on both days is mandatory for certificate',
        ],
        requirements: ['Laptop with Node.js 18+ installed', 'VS Code editor', 'GitHub account'],
        contact: { name: 'Dr. Rajesh Kumar', email: 'rajesh@campusconnect.com', phone: '9000000002' },
        status: 'published',
        tags: ['React', 'Node.js', 'Full-Stack', 'Web Development'],
        currentRegistrations: 52,
      },
      {
        title: 'Annual Cultural Fest – Tarang 2026',
        description: 'The most awaited cultural extravaganza of the year! Three days of dance, music, drama, fashion, and art. Open for all students. Come, celebrate, and showcase your talent!',
        category: 'Fest',
        department: 'Arts & Science',
        club: clubs[1]._id,
        organizer: coord2._id,
        date: future(30),
        startTime: '09:00',
        endTime: '21:00',
        venue: 'College Grounds',
        maxParticipants: 1000,
        registrationDeadline: future(25),
        poster: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop',
        rules: [
          'Open to all currently enrolled students',
          'Group size varies by event category',
          'Costumes must be culturally appropriate',
        ],
        requirements: ['College ID card', 'Pre-registration for specific events'],
        contact: { name: 'Priya Patel', email: 'priya@campusconnect.com', phone: '9000000005' },
        status: 'published',
        tags: ['Cultural', 'Dance', 'Music', 'Drama', 'Fest'],
        currentRegistrations: 320,
      },
      {
        title: 'Inter-College Coding Contest – CodeStorm',
        description: 'Compete against the best programmers from 20+ colleges in this prestigious coding contest. Problems range from beginner to expert level in algorithms, data structures, and competitive programming.',
        category: 'Coding Contest',
        department: 'Computer Science',
        club: clubs[2]._id,
        organizer: coord1._id,
        date: future(20),
        startTime: '10:00',
        endTime: '14:00',
        venue: 'Online (HackerRank Platform)',
        maxParticipants: 500,
        registrationDeadline: future(18),
        poster: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop',
        rules: [
          'Individual participation only',
          'No collaboration allowed during the contest',
          'All standard programming languages allowed',
          'Internet access restricted to the platform only',
        ],
        requirements: ['HackerRank account', 'Stable internet connection', 'College enrollment proof'],
        contact: { name: 'Vikram Singh', email: 'vikram@campusconnect.com', phone: '9000000004' },
        status: 'published',
        tags: ['Coding', 'DSA', 'Competitive Programming', 'Inter-College'],
        currentRegistrations: 187,
      },
      {
        title: 'Cybersecurity Awareness Seminar',
        description: 'Industry experts from CERT-In and leading cybersecurity firms talk about modern threats, ethical hacking, digital safety, and career opportunities in cybersecurity. Open to all students and faculty.',
        category: 'Seminar',
        department: 'Computer Science',
        club: clubs[0]._id,
        organizer: faculty1._id,
        date: future(5),
        startTime: '11:00',
        endTime: '13:00',
        venue: 'Seminar Hall, Block B',
        maxParticipants: 150,
        registrationDeadline: future(3),
        poster: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop',
        rules: [
          'Free entry for all college students',
          'Registration required for certificate',
          'Q&A session at the end',
        ],
        requirements: ['College ID card'],
        contact: { name: 'Dr. Rajesh Kumar', email: 'rajesh@campusconnect.com', phone: '9000000002' },
        status: 'published',
        tags: ['Cybersecurity', 'Ethical Hacking', 'Awareness', 'Seminar'],
        currentRegistrations: 98,
      },
      {
        title: 'Startup Pitch Competition – IdeaForge',
        description: 'Got a startup idea? Pitch it to a panel of investors and industry mentors! Top 3 teams win seed funding and 6-month incubation support. Open to teams of 1-5 students.',
        category: 'Technical',
        department: 'MBA',
        club: clubs[4]._id,
        organizer: faculty2._id,
        date: future(25),
        startTime: '09:00',
        endTime: '18:00',
        venue: 'Innovation Hub, Administrative Block',
        maxParticipants: 100,
        registrationDeadline: future(20),
        poster: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop',
        rules: [
          'Submit a 2-page executive summary before deadline',
          'Presentation: 10 minutes + 5 minutes Q&A',
          'Business plan must be original',
        ],
        requirements: ['Executive summary document', 'PPT presentation', 'Prototype (optional but encouraged)'],
        contact: { name: 'Prof. Anita Sharma', email: 'anita@campusconnect.com', phone: '9000000003' },
        status: 'published',
        tags: ['Startup', 'Entrepreneurship', 'Pitch', 'Business'],
        currentRegistrations: 28,
      },
      {
        title: 'Annual Sports Meet 2026',
        description: 'The annual inter-department sports competition featuring cricket, football, basketball, volleyball, badminton, table tennis, and athletics. Represent your department and bring home the trophy!',
        category: 'Sports',
        department: 'Physical Education',
        club: clubs[3]._id,
        organizer: faculty1._id,
        date: future(45),
        startTime: '08:00',
        endTime: '17:00',
        venue: 'College Sports Complex',
        maxParticipants: 800,
        registrationDeadline: future(35),
        poster: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
        rules: [
          'Only enrolled students can participate',
          'One student can register for maximum 3 events',
          'Sportsman spirit is mandatory',
          'All decisions by sports committee are final',
        ],
        requirements: ['Sports shoes (mandatory)', 'College ID card', 'Medical fitness certificate'],
        contact: { name: 'Dr. Rajesh Kumar', email: 'rajesh@campusconnect.com', phone: '9000000002' },
        status: 'published',
        tags: ['Sports', 'Cricket', 'Football', 'Basketball', 'Athletics'],
        currentRegistrations: 412,
      },
      {
        title: 'Machine Learning Bootcamp',
        description: 'A 3-day intensive bootcamp covering ML fundamentals, scikit-learn, TensorFlow, and real-world project implementation. Certificate of completion provided to all attendees.',
        category: 'Workshop',
        department: 'Computer Science',
        club: clubs[2]._id,
        organizer: faculty1._id,
        date: future(12),
        startTime: '09:00',
        endTime: '16:00',
        venue: 'AI Lab, Block C',
        maxParticipants: 40,
        registrationDeadline: future(8),
        poster: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop',
        rules: [
          'Python programming knowledge required',
          'Attendance all 3 days mandatory for certificate',
          'Assignments must be submitted',
        ],
        requirements: ['Laptop with Python 3.10+', 'Anaconda/Jupyter installed', 'Basic Python knowledge'],
        contact: { name: 'Dr. Rajesh Kumar', email: 'rajesh@campusconnect.com', phone: '9000000002' },
        status: 'published',
        tags: ['Machine Learning', 'AI', 'Python', 'TensorFlow', 'Bootcamp'],
        currentRegistrations: 38,
      },
      // Past/Completed Events
      {
        title: 'Tech Expo 2025',
        description: 'Annual technology exhibition where students showcase their final year projects, innovative solutions, and research work to industry professionals and the college community.',
        category: 'Technical',
        department: 'Computer Science',
        club: clubs[0]._id,
        organizer: coord1._id,
        date: past(30),
        startTime: '10:00',
        endTime: '17:00',
        venue: 'Main Auditorium',
        maxParticipants: 300,
        registrationDeadline: past(35),
        poster: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
        rules: ['Project must be original', 'Team size: 1-4 members'],
        requirements: ['Project abstract', 'Demo setup'],
        contact: { name: 'Vikram Singh', email: 'vikram@campusconnect.com', phone: '9000000004' },
        status: 'completed',
        tags: ['Exhibition', 'Projects', 'Innovation'],
        currentRegistrations: 180,
      },
      {
        title: 'Fresher\'s Welcome Night 2025',
        description: 'The grand welcome event for freshers featuring cultural performances, talent show, and campus introduction by senior students and faculty.',
        category: 'Cultural',
        department: 'Arts & Science',
        club: clubs[1]._id,
        organizer: coord2._id,
        date: past(60),
        startTime: '18:00',
        endTime: '21:00',
        venue: 'Open Air Theatre',
        maxParticipants: 600,
        registrationDeadline: past(65),
        poster: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop',
        rules: ['Open to all students', 'Formal/semi-formal attire preferred'],
        requirements: ['College ID card'],
        contact: { name: 'Priya Patel', email: 'priya@campusconnect.com', phone: '9000000005' },
        status: 'completed',
        tags: ['Freshers', 'Cultural', 'Welcome'],
        currentRegistrations: 580,
      },
    ]);

    console.log('📅 Events created:', events.length);

    // ─────────────────────────────────────────────
    // REGISTRATIONS with QR codes
    // ─────────────────────────────────────────────
    const registrationsData = [];
    // Register first 4 students for first 3 events
    for (let si = 0; si < 4; si++) {
      for (let ei = 0; ei < 3; ei++) {
        const regId = `CC-${uuidv4().split('-')[0].toUpperCase()}`;
        const qrData = await generateQR(JSON.stringify({ registrationId: regId, eventId: events[ei]._id, studentId: students[si]._id }));
        registrationsData.push({
          student: students[si]._id,
          event: events[ei]._id,
          registrationId: regId,
          status: 'confirmed',
          qrCode: qrData,
          attendance: ei === 0 && si < 2,
        });
      }
    }
    // Register for past events
    for (let si = 0; si < 3; si++) {
      const regId = `CC-${uuidv4().split('-')[0].toUpperCase()}`;
      const qrData = await generateQR(JSON.stringify({ registrationId: regId }));
      registrationsData.push({
        student: students[si]._id,
        event: events[8]._id,
        registrationId: regId,
        status: 'confirmed',
        qrCode: qrData,
        attendance: true,
      });
    }
    const registrations = await Registration.insertMany(registrationsData);
    console.log('📝 Registrations created:', registrations.length);

    // ─────────────────────────────────────────────
    // NOTIFICATIONS
    // ─────────────────────────────────────────────
    const notificationsData = students.slice(0, 5).flatMap(student => [
      {
        user: student._id,
        title: 'New Event Added',
        message: 'AI Innovation Hackathon 2026 has been added. Register before seats fill up!',
        type: 'event',
        read: false,
        relatedEvent: events[0]._id,
      },
      {
        user: student._id,
        title: 'Registration Confirmed',
        message: `Your registration for React & Node.js Workshop is confirmed. Check your registration details.`,
        type: 'registration',
        read: Math.random() > 0.5,
        relatedEvent: events[1]._id,
      },
      {
        user: student._id,
        title: 'Registration Deadline Tomorrow',
        message: 'Cybersecurity Awareness Seminar registration closes tomorrow. Register now!',
        type: 'event',
        read: false,
        relatedEvent: events[4]._id,
      },
    ]);
    await Notification.insertMany(notificationsData);
    console.log('🔔 Notifications created:', notificationsData.length);

    // ─────────────────────────────────────────────
    // CERTIFICATES
    // ─────────────────────────────────────────────
    const certsData = [
      {
        student: students[0]._id,
        event: events[8]._id,
        certificateUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf',
        certificateType: 'participation',
        issuedBy: admin._id,
        issuedDate: past(20),
      },
      {
        student: students[1]._id,
        event: events[8]._id,
        certificateUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf',
        certificateType: 'winner',
        issuedBy: admin._id,
        issuedDate: past(20),
      },
      {
        student: students[2]._id,
        event: events[9]._id,
        certificateUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf',
        certificateType: 'participation',
        issuedBy: admin._id,
        issuedDate: past(50),
      },
    ];
    await Certificate.insertMany(certsData);
    console.log('🏆 Certificates created:', certsData.length);

    // ─────────────────────────────────────────────
    // RESULTS
    // ─────────────────────────────────────────────
    await Result.insertMany([
      {
        event: events[8]._id,
        results: [
          { student: students[1]._id, position: 1, score: '95/100', remarks: 'Excellent project on IoT-based smart irrigation system.' },
          { student: students[0]._id, position: 2, score: '88/100', remarks: 'Great AI chatbot for college FAQs.' },
          { student: students[2]._id, position: 3, score: '82/100', remarks: 'Innovative blockchain-based attendance system.' },
        ],
        publishedBy: admin._id,
        publishedAt: past(25),
      },
    ]);
    console.log('📊 Results created: 1');

    // ─────────────────────────────────────────────
    // GALLERY
    // ─────────────────────────────────────────────
    await Gallery.insertMany([
      {
        event: events[8]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', caption: 'Opening Ceremony', publicId: 'gallery_1' },
          { url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800', caption: 'Project Demonstrations', publicId: 'gallery_2' },
          { url: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800', caption: 'Award Ceremony', publicId: 'gallery_3' },
          { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800', caption: 'Team Collaboration', publicId: 'gallery_4' },
        ],
        uploadedBy: admin._id,
      },
      {
        event: events[9]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800', caption: 'Freshers Welcome', publicId: 'gallery_5' },
          { url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800', caption: 'Cultural Performances', publicId: 'gallery_6' },
          { url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800', caption: 'Group Photo', publicId: 'gallery_7' },
        ],
        uploadedBy: admin._id,
      },
    ]);
    console.log('🖼️ Gallery created: 2 entries');

    // ─────────────────────────────────────────────
    // BOOKMARKS
    // ─────────────────────────────────────────────
    await Bookmark.insertMany([
      { user: students[0]._id, event: events[3]._id },
      { user: students[0]._id, event: events[5]._id },
      { user: students[1]._id, event: events[0]._id },
      { user: students[1]._id, event: events[2]._id },
      { user: students[2]._id, event: events[6]._id },
    ]);
    console.log('🔖 Bookmarks created: 5');

    console.log('\n════════════════════════════════════════');
    console.log('✅ SEED COMPLETED SUCCESSFULLY!');
    console.log('════════════════════════════════════════');
    console.log('\n📋 DEMO CREDENTIALS:');
    console.log('──────────────────────────────────────');
    console.log('👑 Admin:        admin@campusconnect.com   / Admin@123');
    console.log('👨‍🏫 Faculty:      rajesh@campusconnect.com / Student@123');
    console.log('🎯 Coordinator:  vikram@campusconnect.com / Student@123');
    console.log('👨‍🎓 Student:      arjun@campusconnect.com  / Student@123');
    console.log('──────────────────────────────────────\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();
