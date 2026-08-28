-- ==============================================================================
-- SCAM v1.0 (Smart Campus Administration & Management System)
-- PostgreSQL Relational Database Schema Specification
-- Vasavi College of Engineering (VCE)
-- ==============================================================================

-- 1. EXTENSIONS & TYPES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role_enum AS ENUM ('STUDENT', 'FACULTY', 'ADMIN');
CREATE TYPE complaint_status_enum AS ENUM ('SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED');
CREATE TYPE complaint_priority_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE order_status_enum AS ENUM ('RECEIVED', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED');
CREATE TYPE report_status_enum AS ENUM ('PENDING', 'REVIEWED', 'REMOVED', 'DISMISSED');

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roll_or_emp_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'STUDENT',
    department VARCHAR(100) NOT NULL,
    branch VARCHAR(20),
    academic_year VARCHAR(20),
    section VARCHAR(10),
    batch VARCHAR(10),
    classroom VARCHAR(100),
    is_verified_senior BOOLEAN DEFAULT FALSE,
    campus_points INT DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. NOTICES & ANNOUNCEMENTS TABLE (SRS 4.1)
CREATE TABLE IF NOT EXISTS notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    is_emergency BOOLEAN DEFAULT FALSE,
    is_retracted BOOLEAN DEFAULT FALSE,
    target_branch VARCHAR(20),
    target_year VARCHAR(20),
    target_section VARCHAR(10),
    target_role user_role_enum,
    published_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    attachment_url VARCHAR(255)
);

-- 4. COMPLAINTS TABLE (SRS 4.2)
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(30) UNIQUE NOT NULL,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    location VARCHAR(150) NOT NULL,
    priority complaint_priority_enum DEFAULT 'MEDIUM',
    status complaint_status_enum DEFAULT 'SUBMITTED',
    assigned_technician VARCHAR(100),
    assigned_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. FACULTY STUDENT QUERIES TABLE (SRS 4.2.5 & BR-5.5.7)
CREATE TABLE IF NOT EXISTS faculty_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES users(id) ON DELETE SET NULL,
    course_name VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    query_text TEXT NOT NULL,
    response_text TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. CAMPUS MAP LOCATIONS TABLE (SRS 4.3)
CREATE TABLE IF NOT EXISTS campus_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    block_name VARCHAR(100) NOT NULL,
    floor_number INT NOT NULL,
    room_number VARCHAR(50),
    category VARCHAR(50) NOT NULL,
    facility_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Available',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. CANTEEN FOOD ITEMS & ORDERS TABLE (SRS 4.4)
CREATE TABLE IF NOT EXISTS canteen_menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(8, 2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    prep_time_mins INT DEFAULT 10,
    dietary_type VARCHAR(20) DEFAULT 'Veg',
    image_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS canteen_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_token VARCHAR(20) UNIQUE NOT NULL,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10, 2) NOT NULL,
    pickup_slot VARCHAR(50) NOT NULL,
    status order_status_enum DEFAULT 'RECEIVED',
    payment_method VARCHAR(50) DEFAULT 'UPI / Campus Points',
    items JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. LIBRARY CATALOG TABLE (SRS 4.5)
CREATE TABLE IF NOT EXISTS library_books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    isbn VARCHAR(30) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(150) NOT NULL,
    department VARCHAR(50) NOT NULL,
    shelf_location VARCHAR(50) NOT NULL,
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    course_tags VARCHAR(100)[]
);

-- 9. COMMUNITY QUESTIONS & MODERATION (SRS 4.6)
CREATE TABLE IF NOT EXISTS community_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    tags VARCHAR(50)[],
    upvotes INT DEFAULT 0,
    is_reported BOOLEAN DEFAULT FALSE,
    is_removed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reported_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID REFERENCES community_threads(id) ON DELETE CASCADE,
    reported_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    status report_status_enum DEFAULT 'PENDING',
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. PLACEMENT & RESUME ARCHIVES (SRS 4.7)
CREATE TABLE IF NOT EXISTS placement_companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(100) NOT NULL,
    tier VARCHAR(20) NOT NULL,
    package_lpa DECIMAL(5, 2) NOT NULL,
    eligible_branches VARCHAR(20)[],
    selection_rounds TEXT[],
    roles VARCHAR(100)[]
);

CREATE TABLE IF NOT EXISTS interview_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES placement_companies(id) ON DELETE CASCADE,
    topic VARCHAR(50) NOT NULL,
    question TEXT NOT NULL,
    answer_tip TEXT,
    difficulty VARCHAR(20) DEFAULT 'Medium'
);

-- 11. FAQ KNOWLEDGE BASE TABLE
CREATE TABLE IF NOT EXISTS faq_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
