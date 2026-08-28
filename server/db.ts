// In-Memory Campus Domain Store with structured collections & state machines

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'FACULTY' | 'VENDOR' | 'MAINTENANCE' | 'ADMIN';
  studentId: string;
  department: string;
  year: string;
  avatarUrl: string;
  campusPoints: number;
}

export interface Building {
  id: string;
  name: string;
  code: string;
  category: string;
  floorCount: number;
  description: string;
  facilities: string[];
  coordinates: { x: number; y: number };
}

export interface Room {
  id: string;
  buildingId: string;
  roomNumber: string;
  name: string;
  type: 'CLASSROOM' | 'LAB' | 'OFFICE' | 'SEMINAR_HALL' | 'OTHER';
  floorNumber: number;
  capacity: number;
}

export interface TimetableClass {
  id: string;
  time: string;
  subject: string;
  code: string;
  room: string;
  roomNumber: string;
  buildingId: string;
  faculty: string;
  color: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface FoodItem {
  id: string;
  vendorId: string;
  name: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  dietary: 'VEG' | 'NON_VEG';
}

export interface FoodOrder {
  id: string;
  orderNumber: string;
  userId: string;
  vendorId: string;
  vendorName: string;
  items: {
    foodItemId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  status: 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'PICKED_UP' | 'COMPLETED' | 'CANCELLED';
  pickupTime: string;
  pickupCounter: string;
  qrToken: string;
  createdAt: string;
}

export interface Notice {
  id: string;
  title: string;
  subtitle: string;
  timeAgo: string;
  category: 'ACADEMIC' | 'PLACEMENT' | 'EVENT' | 'GENERAL' | 'URGENT';
  priority: 'NORMAL' | 'IMPORTANT' | 'URGENT';
  badgeText: string;
  badgeType: 'new' | 'important' | 'academic' | 'general';
  icon: 'megaphone' | 'info' | 'book';
}

export interface CampusEvent {
  id: string;
  title: string;
  subtitle: string;
  month: string;
  day: string;
  location: string;
  time: string;
  category: string;
  capacity: number;
  registeredCount: number;
  registeredUserIds: string[];
}

export interface Complaint {
  id: string;
  ticketNumber: string;
  userId: string;
  category: string;
  location: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  assignedTo?: string;
  createdAt: string;
  timeline: {
    status: string;
    timestamp: string;
    note: string;
  }[];
}

export interface BookingResource {
  id: string;
  name: string;
  type: string;
  capacity: number;
  location: string;
  isAvailable: boolean;
}

export interface CampusFeedback {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Initial Database State
export class CampusDatabase {
  public currentUser: User = {
    id: 'usr_manoj_1',
    name: 'Manoj Reddy',
    email: 'dullamanojreddy@gmail.com',
    role: 'STUDENT',
    studentId: '21B81A0589',
    department: 'Information Technology',
    year: '3rd Year',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    campusPoints: 1250,
  };

  public buildings: Building[] = [
    {
      id: 'cse',
      name: 'CSE Block (Computer Science)',
      code: 'CSE',
      category: 'ACADEMIC',
      floorCount: 4,
      description: 'Department of Computer Science & Engineering, AI Labs, and Project Centers.',
      facilities: ['High-speed Wi-Fi', 'Smart Projectors', 'Air Conditioning', 'Elevator'],
      coordinates: { x: 35, y: 40 },
    },
    {
      id: 'it',
      name: 'IT Block (Information Tech)',
      code: 'IT',
      category: 'ACADEMIC',
      floorCount: 4,
      description: 'Department of Information Technology, Cloud Computing Lab, and Software Engineering Studios.',
      facilities: ['Wi-Fi', 'Research Labs', 'Seminar Rooms'],
      coordinates: { x: 50, y: 35 },
    },
    {
      id: 'admin',
      name: 'Admin Block',
      code: 'ADM',
      category: 'ADMINISTRATIVE',
      floorCount: 3,
      description: 'Principal Office, Dean Academics, Admissions, and Examination Cell.',
      facilities: ['Helpdesk', 'Fee Counter', 'Meeting Chambers'],
      coordinates: { x: 20, y: 25 },
    },
    {
      id: 'library',
      name: 'Central Library',
      code: 'LIB',
      category: 'LIBRARY',
      floorCount: 3,
      description: 'Over 50,000 volumes, IEEE digital access library, quiet reading halls.',
      facilities: ['Digital Lounge', 'Discussion Cubicles', 'Printing Center'],
      coordinates: { x: 60, y: 20 },
    },
    {
      id: 'canteen_a',
      name: 'Canteen A (Food Court)',
      code: 'FC1',
      category: 'FOOD',
      floorCount: 1,
      description: 'Main campus food court with express pickup counters and multi-cuisine meals.',
      facilities: ['Express Counter', 'UPI & Student ID Pay', 'Outdoor Seating'],
      coordinates: { x: 25, y: 70 },
    },
    {
      id: 'canteen_b',
      name: 'Canteen B (Quick Bites)',
      code: 'FC2',
      category: 'FOOD',
      floorCount: 1,
      description: 'Fast food, hot snacks, fresh juices, and south-Indian breakfast items.',
      facilities: ['Beverage Bar', 'Snack Counter'],
      coordinates: { x: 45, y: 75 },
    },
    {
      id: 'seminar',
      name: 'Main Seminar Hall',
      code: 'SH1',
      category: 'AUDITORIUM',
      floorCount: 2,
      description: '500-seat auditorium with Dolby audio, stage lighting, and projection systems.',
      facilities: ['Acoustic Paneling', 'Live Broadcast System', 'Podium'],
      coordinates: { x: 70, y: 55 },
    },
    {
      id: 'sports',
      name: 'Sports Complex',
      code: 'SPT',
      category: 'SPORTS',
      floorCount: 2,
      description: 'Indoor badminton courts, gymnasium, table tennis, and sports equipment store.',
      facilities: ['Locker Rooms', 'Gym Equipment', 'First Aid Station'],
      coordinates: { x: 80, y: 80 },
    },
  ];

  public rooms: Room[] = [
    { id: 'r-302', buildingId: 'cse', roomNumber: '302', name: 'Database Management Systems Lab', type: 'LAB', floorNumber: 3, capacity: 60 },
    { id: 'r-304', buildingId: 'cse', roomNumber: '304', name: 'Computer Networks Lab', type: 'LAB', floorNumber: 3, capacity: 60 },
    { id: 'r-306', buildingId: 'cse', roomNumber: '306', name: 'Software Engineering Classroom', type: 'CLASSROOM', floorNumber: 3, capacity: 70 },
    { id: 'r-308', buildingId: 'cse', roomNumber: '308', name: 'Web Technologies Studio', type: 'CLASSROOM', floorNumber: 3, capacity: 70 },
    { id: 'r-ai1', buildingId: 'cse', roomNumber: 'AI Lab - 1', name: 'Artificial Intelligence & Robotics Lab', type: 'LAB', floorNumber: 1, capacity: 50 },
    { id: 'r-201', buildingId: 'cse', roomNumber: '201', name: 'Coding Club Activity Hall', type: 'CLASSROOM', floorNumber: 2, capacity: 80 },
  ];

  public schedule: TimetableClass[] = [
    {
      id: 'sched-1',
      time: '09:00 AM',
      subject: 'DBMS',
      code: 'CS301',
      room: 'CSE Block - 302',
      roomNumber: '302',
      buildingId: 'cse',
      faculty: 'Dr. S. K. Sharma',
      color: '#3b82f6',
      status: 'completed',
    },
    {
      id: 'sched-2',
      time: '10:00 AM',
      subject: 'Computer Networks',
      code: 'CS302',
      room: 'CSE Block - 304',
      roomNumber: '304',
      buildingId: 'cse',
      faculty: 'Prof. Ananya Roy',
      color: '#10b981',
      status: 'ongoing',
    },
    {
      id: 'sched-3',
      time: '11:00 AM',
      subject: 'AI Lab',
      code: 'CS303L',
      room: 'AI Lab - 1',
      roomNumber: 'AI Lab - 1',
      buildingId: 'cse',
      faculty: 'Dr. Vikramaditya',
      color: '#84cc16',
      status: 'upcoming',
    },
    {
      id: 'sched-4',
      time: '02:00 PM',
      subject: 'Software Engineering',
      code: 'CS304',
      room: 'CSE Block - 306',
      roomNumber: '306',
      buildingId: 'cse',
      faculty: 'Prof. Ramesh K.',
      color: '#a855f7',
      status: 'upcoming',
    },
    {
      id: 'sched-5',
      time: '03:00 PM',
      subject: 'Web Technologies',
      code: 'CS305',
      room: 'CSE Block - 308',
      roomNumber: '308',
      buildingId: 'cse',
      faculty: 'Dr. Priya Desai',
      color: '#f97316',
      status: 'upcoming',
    },
  ];

  public foodItems: FoodItem[] = [
    {
      id: 'food-1',
      vendorId: 'canteen_a',
      name: 'Paneer Biryani',
      price: 140,
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80',
      isAvailable: true,
      preparationTimeMinutes: 12,
      dietary: 'VEG',
    },
    {
      id: 'food-2',
      vendorId: 'canteen_b',
      name: 'Veg Thali (Special)',
      price: 90,
      category: 'Meals',
      image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=300&auto=format&fit=crop&q=80',
      isAvailable: true,
      preparationTimeMinutes: 8,
      dietary: 'VEG',
    },
    {
      id: 'food-3',
      vendorId: 'canteen_a',
      name: 'Masala Dosa',
      price: 60,
      category: 'Breakfast',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&auto=format&fit=crop&q=80',
      isAvailable: true,
      preparationTimeMinutes: 6,
      dietary: 'VEG',
    },
    {
      id: 'food-4',
      vendorId: 'canteen_a',
      name: 'Crispy Samosa (2 pcs)',
      price: 30,
      category: 'Snacks',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&auto=format&fit=crop&q=80',
      isAvailable: true,
      preparationTimeMinutes: 3,
      dietary: 'VEG',
    },
    {
      id: 'food-5',
      vendorId: 'canteen_b',
      name: 'Cold Coffee with Ice Cream',
      price: 50,
      category: 'Beverages',
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=300&auto=format&fit=crop&q=80',
      isAvailable: true,
      preparationTimeMinutes: 4,
      dietary: 'VEG',
    },
    {
      id: 'food-6',
      vendorId: 'canteen_a',
      name: 'Veg Fried Rice with Manchurian',
      price: 120,
      category: 'Chinese',
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&auto=format&fit=crop&q=80',
      isAvailable: true,
      preparationTimeMinutes: 10,
      dietary: 'VEG',
    },
  ];

  public orders: FoodOrder[] = [
    {
      id: 'ord_1234',
      orderNumber: '1234',
      userId: 'usr_manoj_1',
      vendorId: 'canteen_a',
      vendorName: 'Canteen A',
      items: [
        {
          foodItemId: 'food-1',
          name: 'Paneer Biryani',
          price: 140,
          quantity: 1,
        },
      ],
      total: 140,
      status: 'PREPARING',
      pickupTime: '12:45 PM',
      pickupCounter: 'Counter 2',
      qrToken: 'QR-ORD-1234-VALID',
      createdAt: new Date().toISOString(),
    },
  ];

  public notices: Notice[] = [
    {
      id: 'not-1',
      title: 'Placement Drive by TCS',
      subtitle: 'Eligible for 2026 Batch CSE/IT',
      timeAgo: '2h ago',
      category: 'PLACEMENT',
      priority: 'URGENT',
      badgeText: 'NEW',
      badgeType: 'new',
      icon: 'megaphone',
    },
    {
      id: 'not-2',
      title: 'Independence Day Celebration',
      subtitle: 'Flag hoisting at 8:30 AM in Main Ground',
      timeAgo: '1d ago',
      category: 'EVENT',
      priority: 'IMPORTANT',
      badgeText: 'IMPORTANT',
      badgeType: 'important',
      icon: 'info',
    },
    {
      id: 'not-3',
      title: 'Mid Sem Exams Timetable',
      subtitle: 'Schedule released for all branches',
      timeAgo: '2d ago',
      category: 'ACADEMIC',
      priority: 'NORMAL',
      badgeText: 'ACADEMIC',
      badgeType: 'academic',
      icon: 'book',
    },
  ];

  public events: CampusEvent[] = [
    {
      id: 'evt-1',
      title: 'Hackathon 2025',
      subtitle: 'Smart India Hackathon Internal Round',
      month: 'AUG',
      day: '19',
      location: 'Seminar Hall',
      time: '10:00 AM',
      category: 'Hackathon',
      capacity: 300,
      registeredCount: 287,
      registeredUserIds: ['usr_manoj_1'],
    },
    {
      id: 'evt-2',
      title: 'Coding Club Meetup',
      subtitle: 'DSA Session for Beginners',
      month: 'AUG',
      day: '21',
      location: 'CSE Block - 201',
      time: '04:00 PM',
      category: 'Club',
      capacity: 100,
      registeredCount: 78,
      registeredUserIds: [],
    },
    {
      id: 'evt-3',
      title: 'Workshop on AI/ML',
      subtitle: 'Hands-on Session with PyTorch',
      month: 'AUG',
      day: '25',
      location: 'AI Lab - 1',
      time: '11:00 AM',
      category: 'Workshop',
      capacity: 60,
      registeredCount: 52,
      registeredUserIds: [],
    },
  ];

  public complaints: Complaint[] = [
    {
      id: 'c-1',
      ticketNumber: 'TKT-9842',
      userId: 'usr_manoj_1',
      category: 'Classroom Projector / AC',
      location: 'CSE Block - Room 304',
      description: 'Projector display flickering intermittently during morning lectures.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      assignedTo: 'Maintenance Team A (Electrical)',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      timeline: [
        { status: 'Submitted', timestamp: '09:15 AM', note: 'Ticket logged by Manoj Reddy' },
        { status: 'Assigned', timestamp: '09:30 AM', note: 'Assigned to Tech Senior Suresh' },
        { status: 'In Progress', timestamp: '10:00 AM', note: 'Technician inspecting HDMI & lamp ballast' },
      ],
    },
  ];

  public bookings: BookingResource[] = [
    { id: 'b-1', name: 'Seminar Hall A', type: 'AUDITORIUM', capacity: 300, location: 'Seminar Hall Building', isAvailable: true },
    { id: 'b-2', name: 'IoT Research Lab', type: 'LAB', capacity: 40, location: 'IT Block - 2nd Floor', isAvailable: true },
    { id: 'b-3', name: 'Badminton Court 1', type: 'SPORTS', capacity: 4, location: 'Sports Complex', isAvailable: true },
  ];

  public feedbacks: CampusFeedback[] = [
    { id: 'fb-1', userId: 'usr_manoj_1', rating: 5, comment: 'Canteen food pickup was fast and hot!', createdAt: new Date().toISOString() },
  ];

  // Helper Methods
  public findBuilding(query: string): Building | undefined {
    const q = query.toLowerCase();
    return this.buildings.find(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
    );
  }

  public findRoom(query: string): Room | undefined {
    const q = query.toLowerCase();
    return this.rooms.find(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.roomNumber.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
    );
  }

  public createOrder(items: { foodItemId: string; quantity: number }[], pickupTime: string, vendorId = 'canteen_b'): FoodOrder {
    const orderNum = String(Math.floor(1000 + Math.random() * 9000));
    let total = 0;
    const orderItems = items.map((i) => {
      const item = this.foodItems.find((f) => f.id === i.foodItemId) || {
        name: 'Veg Thali',
        price: 90,
      };
      const lineTotal = item.price * i.quantity;
      total += lineTotal;
      return {
        foodItemId: i.foodItemId,
        name: item.name,
        price: item.price,
        quantity: i.quantity,
      };
    });

    const newOrder: FoodOrder = {
      id: `ord_${orderNum}`,
      orderNumber: orderNum,
      userId: this.currentUser.id,
      vendorId: vendorId,
      vendorName: vendorId === 'canteen_a' ? 'Canteen A' : 'Canteen B',
      items: orderItems,
      total,
      status: 'PREPARING',
      pickupTime: pickupTime || '1:00 PM',
      pickupCounter: 'Counter 2',
      qrToken: `QR-ORD-${orderNum}-SECURE`,
      createdAt: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);
    return newOrder;
  }
}

export const db = new CampusDatabase();
