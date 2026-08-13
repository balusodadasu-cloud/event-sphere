export const API_URL = import.meta.env.VITE_API_URL || '/api';
export const ROLES = { STUDENT: 'student', FACULTY: 'faculty', COORDINATOR: 'coordinator', ADMIN: 'admin' };
export const EVENT_CATEGORIES = ['Technical','Hackathon','Workshop','Seminar','Cultural','Sports','Fest','Coding Contest','Club Activity','Placement','Awareness','Other'];
export const CATEGORY_COLORS = { Technical:'blue', Hackathon:'violet', Workshop:'green', Seminar:'yellow', Cultural:'pink', Sports:'orange', Fest:'red', 'Coding Contest':'cyan', 'Club Activity':'purple', Placement:'teal', Awareness:'indigo', Other:'slate' };
export const CATEGORY_ICONS = { Technical:'Cpu', Hackathon:'Zap', Workshop:'Wrench', Seminar:'BookOpen', Cultural:'Music', Sports:'Trophy', Fest:'PartyPopper', 'Coding Contest':'Code2', 'Club Activity':'Users', Placement:'Briefcase', Awareness:'Megaphone', Other:'Star' };
export const EVENT_STATUSES = ['draft','published','ongoing','completed','cancelled'];
export const DEPARTMENTS = ['Computer Science','Information Technology','Electronics','Mechanical','Civil','Chemical','MBA','MCA','Arts & Science','Other'];
