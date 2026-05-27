-- VoroWebCreator Database Schema
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS vorowebcreator;
USE vorowebcreator;

-- ─────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────
CREATE TABLE users (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password      VARCHAR(255) NOT NULL,
    role          ENUM('CLIENT','ADMIN') DEFAULT 'CLIENT',
    avatar_url    VARCHAR(500),
    phone         VARCHAR(20),
    company       VARCHAR(150),
    bio           TEXT,
    is_active     BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────
-- PACKAGES / PRICING
-- ─────────────────────────────────────────
CREATE TABLE packages (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    slug          VARCHAR(100) NOT NULL UNIQUE,
    description   TEXT,
    price         DECIMAL(10,2) NOT NULL,
    delivery_days INT NOT NULL,
    revisions     INT DEFAULT 2,
    features      JSON,
    is_featured   BOOLEAN DEFAULT FALSE,
    is_active     BOOLEAN DEFAULT TRUE,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────
-- PORTFOLIO
-- ─────────────────────────────────────────
CREATE TABLE portfolio_items (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    title         VARCHAR(200) NOT NULL,
    slug          VARCHAR(200) NOT NULL UNIQUE,
    description   TEXT,
    long_description TEXT,
    category      VARCHAR(100),
    tech_stack    JSON,
    thumbnail_url VARCHAR(500),
    images        JSON,
    live_url      VARCHAR(500),
    github_url    VARCHAR(500),
    client_name   VARCHAR(150),
    completion_date DATE,
    is_featured   BOOLEAN DEFAULT FALSE,
    is_published  BOOLEAN DEFAULT TRUE,
    sort_order    INT DEFAULT 0,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────
-- PROJECTS
-- ─────────────────────────────────────────
CREATE TABLE projects (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_id     BIGINT NOT NULL,
    package_id    BIGINT,
    title         VARCHAR(200) NOT NULL,
    description   TEXT,
    requirements  TEXT,
    status        ENUM('PENDING','IN_REVIEW','IN_PROGRESS','REVIEW','COMPLETED','CANCELLED') DEFAULT 'PENDING',
    priority      ENUM('LOW','MEDIUM','HIGH','URGENT') DEFAULT 'MEDIUM',
    budget        DECIMAL(10,2),
    deadline      DATE,
    start_date    DATE,
    end_date      DATE,
    progress      INT DEFAULT 0,
    admin_notes   TEXT,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (package_id) REFERENCES packages(id)
);

-- ─────────────────────────────────────────
-- PROJECT MILESTONES
-- ─────────────────────────────────────────
CREATE TABLE milestones (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id    BIGINT NOT NULL,
    title         VARCHAR(200) NOT NULL,
    description   TEXT,
    due_date      DATE,
    completed     BOOLEAN DEFAULT FALSE,
    completed_at  DATETIME,
    sort_order    INT DEFAULT 0,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────
-- FILE UPLOADS
-- ─────────────────────────────────────────
CREATE TABLE files (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    uploader_id   BIGINT NOT NULL,
    project_id    BIGINT,
    original_name VARCHAR(255) NOT NULL,
    stored_name   VARCHAR(255) NOT NULL,
    file_path     VARCHAR(500) NOT NULL,
    file_size     BIGINT,
    mime_type     VARCHAR(100),
    file_type     ENUM('DOCUMENT','IMAGE','DESIGN','DELIVERY','OTHER') DEFAULT 'OTHER',
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploader_id) REFERENCES users(id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- ─────────────────────────────────────────
-- CHAT
-- ─────────────────────────────────────────
CREATE TABLE chat_rooms (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id    BIGINT NOT NULL UNIQUE,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE chat_messages (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id       BIGINT NOT NULL,
    sender_id     BIGINT NOT NULL,
    content       TEXT NOT NULL,
    message_type  ENUM('TEXT','FILE','SYSTEM') DEFAULT 'TEXT',
    file_id       BIGINT,
    is_read       BOOLEAN DEFAULT FALSE,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (file_id) REFERENCES files(id)
);

-- ─────────────────────────────────────────
-- PAYMENTS
-- ─────────────────────────────────────────
CREATE TABLE invoices (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id    BIGINT NOT NULL,
    client_id     BIGINT NOT NULL,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    amount        DECIMAL(10,2) NOT NULL,
    tax_amount    DECIMAL(10,2) DEFAULT 0,
    total_amount  DECIMAL(10,2) NOT NULL,
    status        ENUM('DRAFT','SENT','PAID','OVERDUE','CANCELLED') DEFAULT 'DRAFT',
    due_date      DATE,
    paid_at       DATETIME,
    payment_method VARCHAR(50),
    payment_ref   VARCHAR(200),
    notes         TEXT,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (client_id) REFERENCES users(id)
);

-- ─────────────────────────────────────────
-- REVIEWS
-- ─────────────────────────────────────────
CREATE TABLE reviews (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_id     BIGINT NOT NULL,
    project_id    BIGINT NOT NULL,
    portfolio_id  BIGINT,
    rating        INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title         VARCHAR(200),
    content       TEXT,
    is_published  BOOLEAN DEFAULT FALSE,
    admin_reply   TEXT,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (portfolio_id) REFERENCES portfolio_items(id)
);

-- ─────────────────────────────────────────
-- NOTIFICATIONS
-- ─────────────────────────────────────────
CREATE TABLE notifications (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id       BIGINT NOT NULL,
    title         VARCHAR(200) NOT NULL,
    message       TEXT NOT NULL,
    type          ENUM('INFO','SUCCESS','WARNING','ERROR') DEFAULT 'INFO',
    category      VARCHAR(50),
    reference_id  BIGINT,
    reference_type VARCHAR(50),
    is_read       BOOLEAN DEFAULT FALSE,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────
-- CONTACT FORM
-- ─────────────────────────────────────────
CREATE TABLE contact_messages (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL,
    phone         VARCHAR(20),
    subject       VARCHAR(200),
    message       TEXT NOT NULL,
    status        ENUM('NEW','READ','REPLIED','ARCHIVED') DEFAULT 'NEW',
    ip_address    VARCHAR(50),
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────
-- TEMPLATES
-- ─────────────────────────────────────────
CREATE TABLE templates (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(200) NOT NULL,
    category      VARCHAR(100),
    description   TEXT,
    preview_url   VARCHAR(500),
    thumbnail_url VARCHAR(500),
    tags          JSON,
    is_premium    BOOLEAN DEFAULT FALSE,
    is_active     BOOLEAN DEFAULT TRUE,
    view_count    INT DEFAULT 0,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────
CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_chat_messages_room ON chat_messages(room_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_files_project ON files(project_id);
CREATE INDEX idx_reviews_published ON reviews(is_published);

-- ─────────────────────────────────────────
-- SEED DATA
-- ─────────────────────────────────────────

-- Admin user (password: Admin@123)
INSERT INTO users (name, email, password, role, is_active, email_verified) VALUES
('Voro Admin', 'admin@vorowebcreator.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiAiGrXIRPqZELGAKWFvFJCyDCPu', 'ADMIN', TRUE, TRUE);

-- Sample clients (password: Client@123)
INSERT INTO users (name, email, password, role, company, phone) VALUES
('Sarah Johnson', 'sarah@techcorp.com', '$2a$12$eImiTXuWVxfM37uY4JANjQ==', 'CLIENT', 'TechCorp Inc', '+1-555-0101'),
('Marcus Williams', 'marcus@brandstudio.io', '$2a$12$eImiTXuWVxfM37uY4JANjQ==', 'CLIENT', 'Brand Studio', '+1-555-0102'),
('Priya Patel', 'priya@startupx.com', '$2a$12$eImiTXuWVxfM37uY4JANjQ==', 'CLIENT', 'StartupX', '+1-555-0103'),
('James Chen', 'james@retailers.com', '$2a$12$eImiTXuWVxfM37uY4JANjQ==', 'CLIENT', 'Chen Retailers', '+1-555-0104');

-- Packages
INSERT INTO packages (name, slug, description, price, delivery_days, revisions, features, is_featured) VALUES
('Starter', 'starter', 'Perfect for small businesses and personal projects', 499.00, 14, 2,
 '["Up to 5 pages","Responsive design","Basic SEO","Contact form","1 month support","Google Analytics"]', FALSE),
('Professional', 'professional', 'Ideal for growing businesses needing more features', 1299.00, 21, 5,
 '["Up to 15 pages","Responsive design","Advanced SEO","CMS integration","E-commerce ready","Blog setup","3 months support","Performance optimization","Custom animations"]', TRUE),
('Enterprise', 'enterprise', 'Full-featured solution for large organizations', 2999.00, 45, 10,
 '["Unlimited pages","Custom design system","Full SEO suite","Custom CMS","E-commerce","API integrations","6 months support","PWA support","Analytics dashboard","Priority support","Code ownership"]', FALSE),
('E-Commerce', 'ecommerce', 'Dedicated online store solution', 1799.00, 30, 5,
 '["Product catalog","Payment gateway","Inventory management","Order tracking","Customer accounts","Email automation","3 months support","Mobile optimized","SEO for products"]', FALSE);

-- Portfolio Items
INSERT INTO portfolio_items (title, slug, description, category, tech_stack, thumbnail_url, client_name, completion_date, is_featured, is_published) VALUES
('LuxeCommerce Fashion Store', 'luxecommerce', 'High-end fashion e-commerce platform with AR try-on features', 'E-Commerce',
 '["React","Node.js","MongoDB","Stripe","AWS"]',
 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', 'LuxeFashion Co', '2024-11-15', TRUE, TRUE),
('MedTech Analytics Dashboard', 'medtech-analytics', 'Real-time health data analytics platform for clinics', 'Web App',
 '["Vue.js","Django","PostgreSQL","D3.js","Docker"]',
 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800', 'MedTech Solutions', '2024-10-20', TRUE, TRUE),
('GreenLeaf Restaurant Chain', 'greenleaf-restaurant', 'Multi-location restaurant website with online ordering', 'Business Website',
 '["React","Laravel","MySQL","Stripe","Redis"]',
 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', 'GreenLeaf Hospitality', '2024-09-10', FALSE, TRUE),
('StartupXYZ Landing Page', 'startupxyz', 'High-converting SaaS product landing page', 'Landing Page',
 '["Next.js","Tailwind","Framer Motion","Sanity CMS"]',
 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800', 'StartupXYZ', '2024-08-05', TRUE, TRUE),
('FinFlow Banking Portal', 'finflow-banking', 'Secure online banking portal with modern UI', 'Web App',
 '["React","Spring Boot","PostgreSQL","JWT","AWS"]',
 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800', 'FinFlow Bank', '2024-07-22', FALSE, TRUE),
('RealEstate Pro Platform', 'realestate-pro', 'Property listing and management platform with virtual tours', 'Platform',
 '["Next.js","NestJS","MongoDB","Three.js","Cloudinary"]',
 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', 'PropTech Ventures', '2024-06-18', FALSE, TRUE);

-- Reviews
INSERT INTO reviews (client_id, project_id, rating, title, content, is_published) VALUES
(2, 1, 5, 'Exceptional Work!', 'Voro delivered beyond our expectations. The attention to detail and communication throughout was outstanding.', TRUE),
(3, 2, 5, 'Transformed Our Online Presence', 'Our new website has doubled our leads. Professional team, great communication.', TRUE),
(4, 3, 4, 'Great Results', 'Very happy with the final product. Minor revisions needed but handled promptly.', TRUE),
(5, 4, 5, 'Highly Recommended', 'Fast delivery, beautiful design, and excellent post-launch support. Will use again!', TRUE);

-- Templates
INSERT INTO templates (name, category, description, thumbnail_url, tags, is_premium) VALUES
('Aurora SaaS', 'SaaS', 'Modern SaaS landing page with feature showcase', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600', '["saas","landing","modern","dark"]', TRUE),
('Bloom E-Commerce', 'E-Commerce', 'Clean e-commerce template with product grid', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', '["ecommerce","shop","minimal"]', FALSE),
('Nexus Portfolio', 'Portfolio', 'Creative portfolio for designers and developers', 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600', '["portfolio","creative","minimal"]', FALSE),
('Horizon Restaurant', 'Restaurant', 'Elegant restaurant website with reservation system', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600', '["restaurant","food","elegant"]', TRUE),
('Pulse Healthcare', 'Healthcare', 'Professional healthcare website with appointment booking', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600', '["healthcare","medical","clean"]', FALSE),
('Forge Agency', 'Agency', 'Bold agency website with case studies', 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600', '["agency","bold","creative"]', TRUE);
