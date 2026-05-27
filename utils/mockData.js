// Mock data — used when backend is not running (development)

export const MOCK_USER = {
  id: 1,
  name: 'Sarah Johnson',
  email: 'sarah@techcorp.com',
  role: 'CLIENT',
  company: 'TechCorp Inc',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  createdAt: '2024-01-15T10:00:00Z',
};

export const MOCK_PACKAGES = [
  {
    id: 1, name: 'Starter', slug: 'starter', price: 499, deliveryDays: 14, revisions: 2, isFeatured: false,
    description: 'Perfect for small businesses and personal projects',
    features: ['Up to 5 pages', 'Responsive design', 'Basic SEO', 'Contact form', '1 month support', 'Google Analytics'],
  },
  {
    id: 2, name: 'Professional', slug: 'professional', price: 1299, deliveryDays: 21, revisions: 5, isFeatured: true,
    description: 'Ideal for growing businesses needing more features',
    features: ['Up to 15 pages', 'Responsive design', 'Advanced SEO', 'CMS integration', 'E-commerce ready', 'Blog setup', '3 months support', 'Custom animations'],
  },
  {
    id: 3, name: 'Enterprise', slug: 'enterprise', price: 2999, deliveryDays: 45, revisions: 10, isFeatured: false,
    description: 'Full-featured solution for large organizations',
    features: ['Unlimited pages', 'Custom design system', 'Full SEO suite', 'Custom CMS', 'E-commerce', 'API integrations', '6 months support', 'PWA support', 'Priority support'],
  },
  {
    id: 4, name: 'E-Commerce', slug: 'ecommerce', price: 1799, deliveryDays: 30, revisions: 5, isFeatured: false,
    description: 'Dedicated online store solution',
    features: ['Product catalog', 'Payment gateway', 'Inventory management', 'Order tracking', 'Customer accounts', '3 months support'],
  },
];

export const MOCK_PORTFOLIO = [
  {
    id: 1, title: 'LuxeCommerce Fashion Store', slug: 'luxecommerce',
    description: 'High-end fashion e-commerce platform with AR try-on features',
    category: 'E-Commerce', techStack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop',
    clientName: 'LuxeFashion Co', isFeatured: true,
  },
  {
    id: 2, title: 'MedTech Analytics Dashboard', slug: 'medtech-analytics',
    description: 'Real-time health data analytics platform for clinics',
    category: 'Web App', techStack: ['Vue.js', 'Django', 'PostgreSQL', 'D3.js'],
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop',
    clientName: 'MedTech Solutions', isFeatured: true,
  },
  {
    id: 3, title: 'GreenLeaf Restaurant Chain', slug: 'greenleaf-restaurant',
    description: 'Multi-location restaurant website with online ordering',
    category: 'Business Website', techStack: ['React', 'Laravel', 'MySQL', 'Stripe'],
    thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop',
    clientName: 'GreenLeaf Hospitality', isFeatured: false,
  },
  {
    id: 4, title: 'StartupXYZ Landing Page', slug: 'startupxyz',
    description: 'High-converting SaaS product landing page',
    category: 'Landing Page', techStack: ['Next.js', 'Tailwind', 'Framer Motion'],
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop',
    clientName: 'StartupXYZ', isFeatured: true,
  },
  {
    id: 5, title: 'FinFlow Banking Portal', slug: 'finflow-banking',
    description: 'Secure online banking portal with modern UI',
    category: 'Web App', techStack: ['React', 'Spring Boot', 'PostgreSQL', 'JWT'],
    thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop',
    clientName: 'FinFlow Bank', isFeatured: false,
  },
  {
    id: 6, title: 'RealEstate Pro Platform', slug: 'realestate-pro',
    description: 'Property listing and management platform with virtual tours',
    category: 'Platform', techStack: ['Next.js', 'NestJS', 'MongoDB', 'Three.js'],
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop',
    clientName: 'PropTech Ventures', isFeatured: false,
  },
];

export const MOCK_PROJECTS = [
  {
    id: 1, title: 'E-Commerce Platform Redesign', status: 'IN_PROGRESS', priority: 'HIGH',
    description: 'Complete redesign of existing online store', progress: 65,
    budget: 1299, deadline: '2024-12-31', startDate: '2024-10-01',
    packageItem: { name: 'Professional' }, createdAt: '2024-09-25T10:00:00Z',
  },
  {
    id: 2, title: 'Company Portfolio Website', status: 'COMPLETED', priority: 'MEDIUM',
    description: 'Modern portfolio site for architecture firm', progress: 100,
    budget: 499, deadline: '2024-10-15', endDate: '2024-10-12',
    packageItem: { name: 'Starter' }, createdAt: '2024-09-01T10:00:00Z',
  },
  {
    id: 3, title: 'SaaS Dashboard App', status: 'PENDING', priority: 'URGENT',
    description: 'Analytics dashboard for B2B SaaS product', progress: 0,
    budget: 2999, deadline: '2025-02-28',
    packageItem: { name: 'Enterprise' }, createdAt: '2024-11-01T10:00:00Z',
  },
];

export const MOCK_REVIEWS = [
  {
    id: 1, rating: 5, title: 'Exceptional Work!',
    content: 'Voro delivered beyond our expectations. The attention to detail and communication throughout was outstanding. Our new website has already increased conversions by 40%.',
    client: { name: 'Sarah Johnson', company: 'TechCorp Inc', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    createdAt: '2024-11-15',
  },
  {
    id: 2, rating: 5, title: 'Transformed Our Online Presence',
    content: 'Our new website has doubled our leads. Professional team, great communication, and delivered ahead of schedule. Couldn\'t be happier.',
    client: { name: 'Marcus Williams', company: 'Brand Studio', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' },
    createdAt: '2024-10-20',
  },
  {
    id: 3, rating: 5, title: 'Highly Recommended',
    content: 'Fast delivery, beautiful design, and excellent post-launch support. The team truly understood our vision and executed it perfectly.',
    client: { name: 'Priya Patel', company: 'StartupX', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
    createdAt: '2024-10-05',
  },
  {
    id: 4, rating: 4, title: 'Great Results',
    content: 'Very happy with the final product. Minor revision cycles were handled promptly and professionally.',
    client: { name: 'James Chen', company: 'Chen Retailers', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
    createdAt: '2024-09-18',
  },
];

export const MOCK_TEMPLATES = [
  { id: 1, name: 'Aurora SaaS', category: 'SaaS', isPremium: true, thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop', tags: ['saas', 'landing', 'dark'] },
  { id: 2, name: 'Bloom E-Commerce', category: 'E-Commerce', isPremium: false, thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop', tags: ['ecommerce', 'shop'] },
  { id: 3, name: 'Nexus Portfolio', category: 'Portfolio', isPremium: false, thumbnail: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&auto=format&fit=crop', tags: ['portfolio', 'minimal'] },
  { id: 4, name: 'Horizon Restaurant', category: 'Restaurant', isPremium: true, thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop', tags: ['restaurant', 'elegant'] },
  { id: 5, name: 'Pulse Healthcare', category: 'Healthcare', isPremium: false, thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop', tags: ['healthcare', 'clean'] },
  { id: 6, name: 'Forge Agency', category: 'Agency', isPremium: true, thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&auto=format&fit=crop', tags: ['agency', 'bold'] },
];

export const ADMIN_STATS = {
  totalUsers: 47,
  totalProjects: 23,
  activeProjects: 8,
  pendingProjects: 3,
  completedProjects: 12,
  newUsersThisMonth: 6,
  totalRevenue: 38450,
  projectsByStatus: [
    { status: 'PENDING', count: 3 },
    { status: 'IN_REVIEW', count: 2 },
    { status: 'IN_PROGRESS', count: 8 },
    { status: 'REVIEW', count: 2 },
    { status: 'COMPLETED', count: 12 },
    { status: 'CANCELLED', count: 1 },
  ],
};
