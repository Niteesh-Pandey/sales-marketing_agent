import { Lead, Campaign, Task, KnowledgeDocument, AuditLog } from '../types';
import { calculateDeterministicLeadScore } from '../services/scoring';

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'UrbanNest Prime Residences',
    category: 'Premium residential apartments',
    price_range: '₹1.20 Cr – ₹2.50 Cr',
    min_price: 12000000,
    max_price: 25000000,
    locations: ['Bandra West, Mumbai', 'Worli, Mumbai', 'Powai, Mumbai'],
    configurations: ['3 BHK', '4 BHK Luxury Sky Suites'],
    highlights: 'Panoramic sea views, private elevators, Italian marble flooring, Olympic-sized infinity pool, concierge services.'
  },
  {
    id: 'prod-2',
    name: 'UrbanNest Select Homes',
    category: 'Mid-premium apartments',
    price_range: '₹75 Lakh – ₹1.35 Cr',
    min_price: 7500000,
    max_price: 13500000,
    locations: ['Ghodbunder Road, Thane', 'Kolshet Road, Thane', 'Wakad, Pune'],
    configurations: ['1.5 BHK', '2 BHK', '3 BHK Smart Homes'],
    highlights: 'Connected clubhouse, EV charging bays, co-working lounges, 80% open landscaped area, 10 min to metro.'
  },
  {
    id: 'prod-3',
    name: 'UrbanNest Investor Units',
    category: 'Investment-focused residential units',
    price_range: '₹90 Lakh – ₹1.80 Cr',
    min_price: 9000000,
    max_price: 18000000,
    locations: ['Hinjawadi Phase 1, Pune', 'Kharadi, Pune', 'Airoli, Navi Mumbai'],
    configurations: ['Studio Suites', '1 BHK High-Yield Suites'],
    highlights: 'Pre-leased corporate tenant tie-ups, guaranteed 6.2% gross rental yield for 3 years, managed rental desk.'
  }
];

const RAW_LEADS_DATA = [
  {
    lead_id: 'L-1001',
    name: 'Vikram Malhotra',
    email: 'vikram.m@techcorp.in',
    phone: '+91 98201 12345',
    company: 'Fintech Solutions Ltd',
    city: 'Mumbai',
    industry: 'Financial Technology',
    job_title: 'Chief Technology Officer',
    source: 'LinkedIn Ad',
    product_interest: 'UrbanNest Prime Residences',
    budget: 22000000,
    stage: 'NEGOTIATION',
    status: 'HOT',
    last_contact_date: '2026-09-28',
    next_followup_date: '2026-09-29',
    owner: 'Niteesh Pandey',
    notes: 'Visited Worli sample flat on Saturday. Loved the 4 BHK layout. Pre-approved home loan from HDFC for ₹1.8 Cr. Negotiating on parking slot and payment schedule. Immediate closing timeline.',
    created_at: '2026-09-10'
  },
  {
    lead_id: 'L-1002',
    name: 'Pooja Deshmukh',
    email: 'dr.pooja.d@hospitalgroup.com',
    phone: '+91 98220 54321',
    company: 'Apollo Clinic Network',
    city: 'Pune',
    industry: 'Healthcare & Medicine',
    job_title: 'Senior Consulting Cardiologist',
    source: 'Google Search',
    product_interest: 'UrbanNest Investor Units',
    budget: 15000000,
    stage: 'PROPOSAL',
    status: 'HOT',
    last_contact_date: '2026-09-27',
    next_followup_date: '2026-09-30',
    owner: 'Niteesh Pandey',
    notes: 'Looking for 2 studio units in Kharadi for assured rental yield. Reviewed draft agreement. Asking for corporate tenant contract details and lease guarantees.',
    created_at: '2026-09-12'
  },
  {
    lead_id: 'L-1003',
    name: 'Amitabh Joshi',
    email: 'amitabh.joshi@globalcloud.com',
    phone: '+91 99870 98765',
    company: 'CloudScale Systems',
    city: 'Thane',
    industry: 'Software Engineering',
    job_title: 'Engineering Director',
    source: 'Website',
    product_interest: 'UrbanNest Select Homes',
    budget: 11500000,
    stage: 'MEETING',
    status: 'HOT',
    last_contact_date: '2026-09-28',
    next_followup_date: '2026-09-29',
    owner: 'Niteesh Pandey',
    notes: 'Upgrading from a 1 BHK in Mulund to 3 BHK in Ghodbunder Road. Attending presentation today at 3:00 PM with spouse. High purchase intent, budget matches exactly.',
    created_at: '2026-09-15'
  },
  {
    lead_id: 'L-1004',
    name: 'Sneha Ranganathan',
    email: 'sneha.r@designstudio.co',
    phone: '+91 98199 43210',
    company: 'Studio Pixel Arch',
    city: 'Mumbai',
    industry: 'Architecture & Design',
    job_title: 'Principal Architect & Owner',
    source: 'Instagram',
    product_interest: 'UrbanNest Prime Residences',
    budget: 18500000,
    stage: 'QUALIFIED',
    status: 'WARM',
    last_contact_date: '2026-09-26',
    next_followup_date: '2026-10-01',
    owner: 'Niteesh Pandey',
    notes: 'Very interested in terrace garden flats at Powai. Asked for architectural floorplans and natural lighting cross-ventilation data. Ready to schedule site tour this weekend.',
    created_at: '2026-09-18'
  },
  {
    lead_id: 'L-1005',
    name: 'Rajesh Nair',
    email: 'rajesh.nair@supplylogistics.in',
    phone: '+91 97690 11223',
    company: 'BlueDart Translogistics',
    city: 'Thane',
    industry: 'Logistics & Supply Chain',
    job_title: 'General Manager - Ops',
    source: 'Referral',
    product_interest: 'UrbanNest Select Homes',
    budget: 9500000,
    stage: 'CONTACTED',
    status: 'WARM',
    last_contact_date: '2026-09-27',
    next_followup_date: '2026-09-30',
    owner: 'Niteesh Pandey',
    notes: 'Referred by Arvind Shah (previous buyer in Block B). Looking for 2 BHK near Majiwada / Kolshet. Budget is firm at ₹95L all-inclusive.',
    created_at: '2026-09-21'
  },
  {
    lead_id: 'L-1006',
    name: 'Nisha Singhania',
    email: 'nisha@singhaniagroup.com',
    phone: '+91 98200 66778',
    company: 'Singhania Exports',
    city: 'Mumbai',
    industry: 'Textile & International Trade',
    job_title: 'Managing Director',
    source: 'Channel Partner',
    product_interest: 'UrbanNest Prime Residences',
    budget: 25000000,
    stage: 'PROPOSAL',
    status: 'HOT',
    last_contact_date: '2026-09-28',
    next_followup_date: '2026-09-30',
    owner: 'Niteesh Pandey',
    notes: 'Shortlisted the top duplex penthouse at Worli. Cheque is ready pending stamp duty concession confirmation from sales head.',
    created_at: '2026-09-08'
  },
  {
    lead_id: 'L-1007',
    name: 'Anand Kulkarni',
    email: 'anand.k@pune-it.com',
    phone: '+91 98900 33445',
    company: 'Cognizant Pune',
    city: 'Pune',
    industry: 'Information Technology',
    job_title: 'Senior Project Manager',
    source: 'Website',
    product_interest: 'UrbanNest Investor Units',
    budget: 9000000,
    stage: 'NEW',
    status: 'ACTIVE',
    last_contact_date: '2026-09-29',
    next_followup_date: '2026-09-29',
    owner: 'Niteesh Pandey',
    notes: 'Downloaded brochure for Hinjawadi units today morning. Stated buying timeline under 60 days. Needs initial discovery call.',
    created_at: '2026-09-29'
  },
  {
    lead_id: 'L-1008',
    name: 'Harish Mehta',
    email: 'harish@mehtabrokers.com',
    phone: '+91 98211 88990',
    company: 'Mehta Securities',
    city: 'Mumbai',
    industry: 'Wealth Management',
    job_title: 'Founder & Partner',
    source: 'Property Expo',
    product_interest: 'UrbanNest Prime Residences',
    budget: 24000000,
    stage: 'WON',
    status: 'CONVERTED',
    last_contact_date: '2026-09-25',
    next_followup_date: '2026-10-15',
    owner: 'Niteesh Pandey',
    notes: 'Token ₹10 Lakh received for Flat 1802 Bandra. Agreement registration scheduled for mid-October. Total booking value ₹2.35 Cr.',
    created_at: '2026-08-20'
  },
  {
    lead_id: 'L-1009',
    name: 'Kavita Pillai',
    email: 'kavita.p@edutech.io',
    phone: '+91 99300 22119',
    company: 'Unlearn Academy',
    city: 'Pune',
    industry: 'EdTech',
    job_title: 'Vice President of Content',
    source: 'LinkedIn Ad',
    product_interest: 'UrbanNest Select Homes',
    budget: 8200000,
    stage: 'QUALIFIED',
    status: 'WARM',
    last_contact_date: '2026-09-25',
    next_followup_date: '2026-10-02',
    owner: 'Niteesh Pandey',
    notes: 'First time buyer. Comparing UrbanNest Wakad with Godrej Elements. Likes the EV charging amenities and clubhouse.',
    created_at: '2026-09-17'
  },
  {
    lead_id: 'L-1010',
    name: 'Deepak Agarwal',
    email: 'deepak@agarwalinfra.in',
    phone: '+91 98450 77123',
    company: 'Agarwal Construction & Steels',
    city: 'Thane',
    industry: 'Building Materials',
    job_title: 'Director',
    source: 'Referral',
    product_interest: 'UrbanNest Select Homes',
    budget: 12500000,
    stage: 'NEGOTIATION',
    status: 'HOT',
    last_contact_date: '2026-09-28',
    next_followup_date: '2026-09-29',
    owner: 'Niteesh Pandey',
    notes: 'Wants to finalize 3 BHK high floor unit in Kolshet Road. Final price discussion underway with 5% builder discount.',
    created_at: '2026-09-11'
  },
  {
    lead_id: 'L-1011',
    name: 'Sanjay Verma',
    email: 'sanjay.v@autoancillary.com',
    phone: '+91 98205 33441',
    company: 'Bharat Precision Gears',
    city: 'Pune',
    industry: 'Automotive Manufacturing',
    job_title: 'Plant Operations Head',
    source: 'Property Expo',
    product_interest: 'UrbanNest Investor Units',
    budget: 11000000,
    stage: 'LOST',
    status: 'LOST',
    last_contact_date: '2026-09-20',
    next_followup_date: '2026-12-01',
    owner: 'Niteesh Pandey',
    notes: 'Decided to invest in commercial shop instead of residential units. Kept in nurture loop for future commercial launches.',
    created_at: '2026-08-15'
  },
  {
    lead_id: 'L-1012',
    name: 'Rohan Sen',
    email: 'rohan.sen@gamecraft.studio',
    phone: '+91 99201 55667',
    company: 'GameCraft Studios',
    city: 'Mumbai',
    industry: 'Digital Entertainment',
    job_title: 'Lead Game Designer',
    source: 'Instagram',
    product_interest: 'UrbanNest Select Homes',
    budget: 7800000,
    stage: 'CONTACTED',
    status: 'WARM',
    last_contact_date: '2026-09-24',
    next_followup_date: '2026-10-01',
    owner: 'Niteesh Pandey',
    notes: 'Young tech professional seeking a starter 1.5 BHK with high-speed fiber connectivity and quiet workspace.',
    created_at: '2026-09-22'
  },
  {
    lead_id: 'L-1013',
    name: 'Aditya Swaminathan',
    email: 'aditya.s@capitalinvest.sg',
    phone: '+65 9123 4567',
    company: 'Temasek Allied Partner',
    city: 'Mumbai',
    industry: 'Private Equity / NRI',
    job_title: 'Investment Associate (NRI)',
    source: 'Google Search',
    product_interest: 'UrbanNest Prime Residences',
    budget: 25000000,
    stage: 'QUALIFIED',
    status: 'HOT',
    last_contact_date: '2026-09-27',
    next_followup_date: '2026-10-03',
    owner: 'Niteesh Pandey',
    notes: 'Singapore-based NRI buyer. Looking for luxury 4 BHK sea-view residence in Worli for parents. Sister will visit site on Thursday.',
    created_at: '2026-09-19'
  },
  {
    lead_id: 'L-1014',
    name: 'Meera Chidambaram',
    email: 'meera.c@lawchambers.in',
    phone: '+91 98202 99881',
    company: 'Bombay High Court Chambers',
    city: 'Mumbai',
    industry: 'Legal Services',
    job_title: 'Senior Advocate',
    source: 'Channel Partner',
    product_interest: 'UrbanNest Prime Residences',
    budget: 21000000,
    stage: 'MEETING',
    status: 'HOT',
    last_contact_date: '2026-09-28',
    next_followup_date: '2026-09-30',
    owner: 'Niteesh Pandey',
    notes: 'Wants spacious study/library room in Bandra West unit. Meeting scheduled for Wednesday morning at sales gallery.',
    created_at: '2026-09-14'
  },
  {
    lead_id: 'L-1015',
    name: 'Gaurav Bhasin',
    email: 'gaurav.b@finrisk.com',
    phone: '+91 98110 33221',
    company: 'FinRisk Analytics',
    city: 'Thane',
    industry: 'Financial Services',
    job_title: 'VP Risk Modelling',
    source: 'LinkedIn Ad',
    product_interest: 'UrbanNest Select Homes',
    budget: 10500000,
    stage: 'NEW',
    status: 'ACTIVE',
    last_contact_date: '2026-09-29',
    next_followup_date: '2026-09-29',
    owner: 'Niteesh Pandey',
    notes: 'Submitted lead form requesting cost breakdown and bank pre-approval assistance for Ghodbunder Road 2 BHK.',
    created_at: '2026-09-29'
  },
  {
    lead_id: 'L-1016',
    name: 'Farhan Merchant',
    email: 'farhan@merchantshipping.com',
    phone: '+91 98203 77441',
    company: 'Merchant Maritime Agencies',
    city: 'Mumbai',
    industry: 'Maritime & Shipping',
    job_title: 'Partner',
    source: 'Website',
    product_interest: 'UrbanNest Prime Residences',
    budget: 23000000,
    stage: 'PROPOSAL',
    status: 'HOT',
    last_contact_date: '2026-09-26',
    next_followup_date: '2026-09-30',
    owner: 'Niteesh Pandey',
    notes: 'Proposal sent for Flat 1201 Worli. Evaluating payment scheme: 10:90 subvention vs construction-linked plan.',
    created_at: '2026-09-09'
  },
  {
    lead_id: 'L-1017',
    name: 'Shalini Bhatnagar',
    email: 'shalini@bhatnagarcreatives.com',
    phone: '+91 98711 44556',
    company: 'Bhatnagar Ad Films',
    city: 'Mumbai',
    industry: 'Advertising & Media',
    job_title: 'Executive Producer',
    source: 'Instagram',
    product_interest: 'UrbanNest Prime Residences',
    budget: 16000000,
    stage: 'CONTACTED',
    status: 'WARM',
    last_contact_date: '2026-09-25',
    next_followup_date: '2026-10-02',
    owner: 'Niteesh Pandey',
    notes: 'Looking for a penthouse or high-ceiling apartment in Powai with good natural light for filming lifestyle reels.',
    created_at: '2026-09-23'
  },
  {
    lead_id: 'L-1018',
    name: 'Tanmay Shirke',
    email: 'tanmay.shirke@biopharma.org',
    phone: '+91 98224 88771',
    company: 'Serum Research Labs',
    city: 'Pune',
    industry: 'Pharmaceuticals',
    job_title: 'Senior Research Scientist',
    source: 'Google Search',
    product_interest: 'UrbanNest Select Homes',
    budget: 8800000,
    stage: 'QUALIFIED',
    status: 'WARM',
    last_contact_date: '2026-09-26',
    next_followup_date: '2026-10-03',
    owner: 'Niteesh Pandey',
    notes: 'Checking Wakad connectivity to Hinjawadi bio-cluster. Satisfied with amenity specs and RERA approvals.',
    created_at: '2026-09-16'
  },
  {
    lead_id: 'L-1019',
    name: 'Bhavna Parekh',
    email: 'bhavna@parekhtrading.in',
    phone: '+91 98207 11992',
    company: 'Parekh Diamond Tools',
    city: 'Mumbai',
    industry: 'Jewellery & Manufacturing',
    job_title: 'Co-Founder',
    source: 'Referral',
    product_interest: 'UrbanNest Investor Units',
    budget: 18000000,
    stage: 'NEGOTIATION',
    status: 'HOT',
    last_contact_date: '2026-09-28',
    next_followup_date: '2026-09-29',
    owner: 'Niteesh Pandey',
    notes: 'Ready to book 2 investor suites in Airoli. Discussing bulk investor cash discount (3% requested). Decision pending approval.',
    created_at: '2026-09-13'
  },
  {
    lead_id: 'L-1020',
    name: 'Karthik Raman',
    email: 'karthik.r@retailventures.com',
    phone: '+91 98840 55661',
    company: 'OmniRetail India',
    city: 'Thane',
    industry: 'E-commerce & Retail',
    job_title: 'Head of Category Merchandising',
    source: 'Website',
    product_interest: 'UrbanNest Select Homes',
    budget: 11000000,
    stage: 'MEETING',
    status: 'WARM',
    last_contact_date: '2026-09-27',
    next_followup_date: '2026-09-30',
    owner: 'Niteesh Pandey',
    notes: 'Meeting scheduled at Thane site office. Interested in 2.5 BHK configuration with clubhouse views.',
    created_at: '2026-09-15'
  }
];

// Generate additional realistic leads to ensure 50+ total
const NAMES = [
  'Arun Gokhale', 'Manish Poddar', 'Divya Sundaram', 'Rohit Chhabra', 'Neeraj Saxena',
  'Priyanka Roy', 'Sameer Quadri', 'Sunil Mathur', 'Ananya Sengupta', 'Devendra Patil',
  'Zaid Qureshi', 'Swati Deshpande', 'Chetan Bhagat', 'Ritu Singhal', 'Nitin Gadgil',
  'Suresh Solanki', 'Archana Rao', 'Vivek Nadkarni', 'Shruti Vaidya', 'Kunal Shah',
  'Preeti Munjal', 'Tarun Kapoor', 'Mihir Doshi', 'Leena Mathew', 'Ashish Tandon',
  'Geeta Rane', 'Jayant Nambiar', 'Sheetal Suri', 'Parag Ranade', 'Mansi Sethi'
];

const INDUSTRIES = [
  'Banking & Financial Services', 'Software & SaaS', 'Healthcare & Diagnostics',
  'Consulting & Audit', 'Renewable Energy', 'Retail & FMCG', 'Legal & Compliance',
  'Civil Infrastructure', 'Aerospace Engineering', 'Digital Media'
];

const CITIES: ('Mumbai' | 'Thane' | 'Pune')[] = ['Mumbai', 'Thane', 'Pune'];

const STAGES: ('NEW' | 'CONTACTED' | 'QUALIFIED' | 'MEETING' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST' | 'NURTURE')[] = [
  'NEW', 'CONTACTED', 'QUALIFIED', 'MEETING', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST', 'NURTURE'
];

const PRODUCTS = [
  'UrbanNest Prime Residences',
  'UrbanNest Select Homes',
  'UrbanNest Investor Units'
];

const SOURCES = [
  'Website', 'LinkedIn Ad', 'Google Search', 'Referral', 'Property Expo', 'Instagram', 'Channel Partner'
];

export const INITIAL_LEADS: Lead[] = [
  ...RAW_LEADS_DATA.map((item, idx) => {
    const scored = calculateDeterministicLeadScore(item as any);
    return {
      ...item,
      lead_score: scored.lead_score,
      intent_score: scored.intent_score,
      fit_score: scored.fit_score,
      engagement_score: scored.engagement_score,
      score_breakdown: scored.score_breakdown,
      ai_priority: scored.ai_priority,
      ai_priority_reason: scored.ai_priority_reason,
      recommended_next_action: scored.recommended_next_action,
      updated_at: item.last_contact_date,
    } as Lead;
  }),
  ...NAMES.map((name, i) => {
    const id = `L-${1021 + i}`;
    const city = CITIES[i % CITIES.length];
    const product = PRODUCTS[i % PRODUCTS.length];
    const stage = STAGES[i % STAGES.length];
    const industry = INDUSTRIES[i % INDUSTRIES.length];
    const source = SOURCES[i % SOURCES.length];
    const budget = product.includes('Prime')
      ? 13000000 + (i * 400000)
      : product.includes('Select')
      ? 8000000 + (i * 200000)
      : 9500000 + (i * 300000);

    const status = (stage === 'WON'
      ? 'CONVERTED'
      : stage === 'LOST'
      ? 'LOST'
      : ['PROPOSAL', 'NEGOTIATION'].includes(stage)
      ? 'HOT'
      : ['QUALIFIED', 'MEETING'].includes(stage)
      ? 'WARM'
      : 'ACTIVE') as any;

    const raw = {
      lead_id: id,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@demo-client.in`,
      phone: `+91 ${98200 + i} ${10000 + (i * 123)}`.slice(0, 15),
      company: `${name.split(' ')[1]} Global Enterprises`,
      city,
      industry,
      job_title: i % 3 === 0 ? 'Managing Director' : i % 2 === 0 ? 'VP Technology' : 'Senior Specialist',
      source,
      product_interest: product,
      budget,
      stage,
      status,
      last_contact_date: `2026-09-${20 + (i % 9)}`,
      next_followup_date: `2026-09-${28 + (i % 4)}`,
      owner: 'Niteesh Pandey',
      notes: `Target customer exploring ${product} in ${city}. Interested in ${i % 2 === 0 ? 'immediate possession' : 'flexible down-payment scheme'}. Needs follow-up on pricing.`,
      created_at: `2026-09-${Math.max(1, 15 - (i % 12))}`,
    };

    const scored = calculateDeterministicLeadScore(raw as any);

    return {
      ...raw,
      lead_score: scored.lead_score,
      intent_score: scored.intent_score,
      fit_score: scored.fit_score,
      engagement_score: scored.engagement_score,
      score_breakdown: scored.score_breakdown,
      ai_priority: scored.ai_priority,
      ai_priority_reason: scored.ai_priority_reason,
      recommended_next_action: scored.recommended_next_action,
      updated_at: raw.last_contact_date,
    } as Lead;
  })
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'CMP-201',
    name: 'Q3 Prime Worli Sea-Face Launch',
    channel: 'Google Search',
    date: '2026-09-01',
    impressions: 48500,
    clicks: 2950,
    leads: 184,
    qualified_leads: 62,
    meetings: 24,
    customers: 4,
    spend: 285000,
    revenue: 89000000
  },
  {
    id: 'CMP-202',
    name: 'Executive Tech Leaders - Bandra West',
    channel: 'LinkedIn Ads',
    date: '2026-09-05',
    impressions: 32000,
    clicks: 1420,
    leads: 98,
    qualified_leads: 46,
    meetings: 18,
    customers: 3,
    spend: 195000,
    revenue: 64500000
  },
  {
    id: 'CMP-203',
    name: 'Thane Smart Homes Instagram Blitz',
    channel: 'Meta/Instagram',
    date: '2026-09-08',
    impressions: 115000,
    clicks: 4820,
    leads: 245,
    qualified_leads: 58,
    meetings: 15,
    customers: 2,
    spend: 140000,
    revenue: 22000000
  },
  {
    id: 'CMP-204',
    name: 'Pune IT Corridor Assured Yield Direct',
    channel: 'Email',
    date: '2026-09-12',
    impressions: 18000,
    clicks: 1980,
    leads: 112,
    qualified_leads: 52,
    meetings: 21,
    customers: 5,
    spend: 45000,
    revenue: 55000000
  },
  {
    id: 'CMP-205',
    name: 'Mumbai Property Expo 2026 On-ground',
    channel: 'Channel Partner',
    date: '2026-09-14',
    impressions: 12000,
    clicks: 3400,
    leads: 165,
    qualified_leads: 72,
    meetings: 34,
    customers: 6,
    spend: 320000,
    revenue: 112000000
  },
  {
    id: 'CMP-206',
    name: 'NRI High-Net-Worth Direct Outreach',
    channel: 'LinkedIn Ads',
    date: '2026-09-18',
    impressions: 21000,
    clicks: 940,
    leads: 54,
    qualified_leads: 31,
    meetings: 14,
    customers: 3,
    spend: 165000,
    revenue: 72000000
  },
  {
    id: 'CMP-207',
    name: 'MagicBricks & 99acres Premium Showcase',
    channel: 'Property Portal',
    date: '2026-09-20',
    impressions: 64000,
    clicks: 2200,
    leads: 130,
    qualified_leads: 38,
    meetings: 12,
    customers: 2,
    spend: 175000,
    revenue: 26000000
  },
  {
    id: 'CMP-208',
    name: 'Powai Luxury Apartments Brand Search',
    channel: 'Google Search',
    date: '2026-09-22',
    impressions: 34000,
    clicks: 2150,
    leads: 142,
    qualified_leads: 48,
    meetings: 16,
    customers: 2,
    spend: 180000,
    revenue: 42000000
  },
  {
    id: 'CMP-209',
    name: 'Ghodbunder Road Young Families Reel Ads',
    channel: 'Meta/Instagram',
    date: '2026-09-24',
    impressions: 89000,
    clicks: 3100,
    leads: 178,
    qualified_leads: 34,
    meetings: 9,
    customers: 1,
    spend: 110000,
    revenue: 11500000
  },
  {
    id: 'CMP-210',
    name: 'Doctor & Medical Specialists VIP Circle',
    channel: 'Email',
    date: '2026-09-26',
    impressions: 14000,
    clicks: 1650,
    leads: 82,
    qualified_leads: 41,
    meetings: 15,
    customers: 3,
    spend: 38000,
    revenue: 48000000
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    task_id: 'TSK-101',
    title: 'Call Vikram Malhotra regarding stamp duty clause',
    description: 'Finalize payment milestone schedule and clarify stamp duty rebate for Flat 1402 Worli.',
    type: 'CALL',
    priority: 'CRITICAL',
    status: 'TODO',
    due_date: '2026-09-29',
    related_lead_id: 'L-1001',
    related_lead_name: 'Vikram Malhotra',
    created_at: '2026-09-28'
  },
  {
    task_id: 'TSK-102',
    title: 'Deliver 3 BHK layout comparison to Amitabh Joshi',
    description: 'Prepare side-by-side room dimension chart for Mulund existing flat vs UrbanNest Thane 3 BHK.',
    type: 'PROPOSAL',
    priority: 'HIGH',
    status: 'TODO',
    due_date: '2026-09-29',
    related_lead_id: 'L-1003',
    related_lead_name: 'Amitabh Joshi',
    created_at: '2026-09-28'
  },
  {
    task_id: 'TSK-103',
    title: 'Send corporate rental yield proof to Dr. Pooja Deshmukh',
    description: 'Share audited 3-year tenant occupancy certificates for Kharadi Investor Suites.',
    type: 'EMAIL',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    due_date: '2026-09-30',
    related_lead_id: 'L-1002',
    related_lead_name: 'Dr. Pooja Deshmukh',
    created_at: '2026-09-27'
  },
  {
    task_id: 'TSK-104',
    title: 'Conduct site walkthrough with Meera Chidambaram',
    description: 'Show Bandra West corner flat with personalized study layout options.',
    type: 'MEETING',
    priority: 'HIGH',
    status: 'TODO',
    due_date: '2026-09-30',
    related_lead_id: 'L-1014',
    related_lead_name: 'Meera Chidambaram',
    created_at: '2026-09-28'
  },
  {
    task_id: 'TSK-105',
    title: 'Review Q3 Google Ads Search keywords vs Meta CPL',
    description: 'Analyze why Instagram CPL is low but Qualified Lead Rate is under 15% compared to Google Search 33%.',
    type: 'MARKETING',
    priority: 'MEDIUM',
    status: 'TODO',
    due_date: '2026-10-01',
    created_at: '2026-09-28'
  },
  {
    task_id: 'TSK-106',
    title: 'Audit unregistered leads from Property Expo',
    description: 'Run automated deduplication and score remaining 42 visitor cards.',
    type: 'REVIEW',
    priority: 'MEDIUM',
    status: 'DONE',
    due_date: '2026-09-28',
    created_at: '2026-09-25'
  }
];

export const INITIAL_KNOWLEDGE_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'DOC-01',
    title: 'Niteesh AI Growth Labs Profile & Operating Principles',
    category: 'company',
    filename: 'knowledge/company/niteesh_ai_growth_labs.md',
    summary: 'Overview of Niteesh AI Growth Labs founded by Niteesh Pandey, core AI decision architecture, free-first framework, and consulting services.',
    content: `# Niteesh AI Growth Labs

**Founder & Business Architect:** Niteesh Pandey  
**Role:** Business Owner & Lead Architect  
**Mission:** Turn scattered sales and marketing data into practical, AI-assisted business actions.

### Core Services
1. **AI Sales Automation & Pipeline Intelligence:** Lead scoring, prioritization, consultative sales draft generation.
2. **Sales Funnel & Bottleneck Analytics:** Stage conversion drop-offs and pipeline value forecasting.
3. **Marketing Analytics & Attribution:** Multi-channel ROAS, CAC, CPL, and campaign optimization.
4. **Local RAG & Business Intelligence:** Evidence-backed document retrieval without leaking sensitive business context.
5. **Meeting Intelligence:** Automated transcript/notes synthesis with CRM extraction.

### Guiding Principles
- **No Hallucination Policy:** Always separate FACT, INFERENCE, ASSUMPTION, and RECOMMENDATION.
- **Evidence-First:** Never invent business metrics or customer information.
- **Safety First:** Destructive actions and external communications require explicit owner approval.`,
    updated_at: '2026-09-28'
  },
  {
    id: 'DOC-02',
    title: 'UrbanNest Properties — Company & Product Catalog',
    category: 'products',
    filename: 'knowledge/products/product_catalog.md',
    summary: 'Fictional demo client UrbanNest Properties profile, real estate residential projects across Mumbai, Thane, and Pune with pricing brackets.',
    content: `# UrbanNest Properties (Fictional Demo Client)

**Important Notice:** UrbanNest Properties is a fictional demonstration company created for Niteesh AI Growth Labs and must never be represented as an active commercial entity.

### Markets Covered
- **Mumbai:** Worli, Bandra West, Powai
- **Thane:** Ghodbunder Road, Kolshet Road
- **Pune:** Hinjawadi Phase 1, Wakad, Kharadi

### Product Lines
1. **UrbanNest Prime Residences**
   - Price: ₹1.20 Cr – ₹2.50 Cr
   - Target: High-income executives, founders, CXOs, NRI buyers.
   - Highlights: Panoramic sea/lake views, private elevator lobbies, 11-ft clear ceiling height, Italian marble, smart home automation.

2. **UrbanNest Select Homes**
   - Price: ₹75 Lakh – ₹1.35 Cr
   - Target: First-time homebuyers, young families, IT professionals upgrading from rentals.
   - Highlights: 30,000 sq ft clubhouse, co-working pods, EV charging bays, 80% open greenery, proximity to metro stations.

3. **UrbanNest Investor Units**
   - Price: ₹90 Lakh – ₹1.80 Cr
   - Target: Domestic property investors, NRI investors, medical specialists seeking passive rental yield.
   - Highlights: Pre-leased corporate tenant arrangements, guaranteed 6.2% gross rental yield for first 3 years, complete rental desk management.`,
    updated_at: '2026-09-28'
  },
  {
    id: 'DOC-03',
    title: 'Pricing Policy, Payment Plans & Bank Approvals',
    category: 'pricing',
    filename: 'knowledge/pricing/pricing_policy.md',
    summary: 'Official payment schedules, 10:90 schemes, stamp duty absorption rules, and partner banks (HDFC, SBI, ICICI).',
    content: `# UrbanNest Pricing & Payment Policy

### Standard Payment Milestone Plan (CLP)
- **10% Booking Token & Application:** Upon unit allotment.
- **10% Upon Agreement Registration:** Within 30 days.
- **15% Completion of Plinth:** Verified by structural engineer certificate.
- **10% Each for 4th, 8th, 12th, and 16th Slabs:** Linked to physical casting.
- **15% Completion of External Plaster & Elevation:**
- **10% Intimation of Possession & Handover:**

### Special Subvention Schemes
- **10:90 Bank Subvention Plan:** Eligible on UrbanNest Prime Residences for credit scores >780. Buyer pays 10% now; no EMI until possession or 24 months.
- **Investor Yield Guarantee:** 6.2% annual payout credited quarterly directly into the buyer bank account on Investor Units.

### Partner Banks & Pre-Approvals
- HDFC Bank, State Bank of India (SBI), ICICI Bank, Axis Bank, and Bank of Baroda.
- Average processing turnaround: 5 business days.`,
    updated_at: '2026-09-28'
  },
  {
    id: 'DOC-04',
    title: 'Sales Playbook & Objection Handling Framework',
    category: 'sales',
    filename: 'knowledge/sales/objection_handling.md',
    summary: 'Proven objection scripts, evidence points, and consultative questions across Price, Timing, Trust, and Competition.',
    content: `# UrbanNest Sales Playbook & Objection Handling

### Objection 1: "The price per square foot is higher than other developers nearby."
- **Customer Concern:** Paying an unjustified premium or fear of poor capital appreciation.
- **Suggested Response:** "I completely understand price comparison is critical. What makes UrbanNest unique is our 82% usable carpet area efficiency versus the market standard of 68-70%. You are paying for liveable space, not non-usable super built-up common walls."
- **Evidence Needed:** Carpet area certification approved by RERA authority.
- **Follow-up Question:** "Would it be helpful if I showed you the exact usable carpet measurement sheet side-by-side with the neighboring project?"
- **Next Step:** Email usable carpet comparison sheet.

### Objection 2: "We want to wait 6 months for interest rates or market prices to soften."
- **Customer Concern:** Fear of market timing risk and locking in capital right before rate cuts.
- **Suggested Response:** "Waiting feels safe, but current pre-launch introductory pricing has a contractual ₹500/sqft price hike scheduled at the next slab completion. Plus, our 10:90 payment shield locks your price today with minimal capital outlay."
- **Evidence Needed:** Official price revision notification memo.
- **Follow-up Question:** "If we could protect you against rate changes while freezing today's launch tariff, would that give you peace of mind?"
- **Next Step:** Schedule a discovery call with our mortgage financing partner.`,
    updated_at: '2026-09-28'
  },
  {
    id: 'DOC-05',
    title: 'Customer Personas & Ideal Customer Profile (ICP)',
    category: 'customers',
    filename: 'knowledge/customers/customer_personas.md',
    summary: 'Detailed persona maps for First-time Buyer, Upgrade Buyer, NRI Investor, and Medical/Corporate Professional.',
    content: `# UrbanNest Customer Personas

### Persona A: "The Tech Upgrade Buyer" (Amitabh Joshi profile)
- **Age:** 34–45
- **Role:** Director / VP / Architect in IT, SaaS, or Fintech.
- **Current Situation:** Owns an older 1 BHK/2 BHK in congested suburbs (Mulund, Ghatkopar, Kothrud).
- **Core Motivation:** Dedicated study room for remote work, lifestyle amenities for children, EV charging, 80% open space.
- **Budget:** ₹95 Lakh – ₹1.40 Cr.
- **Trigger:** Second child birth, remote work hybrid mandates, wanting modern clubhouse amenities.

### Persona B: "The HNI Executive & Luxury Seeker" (Vikram Malhotra profile)
- **Age:** 40–55
- **Role:** Founder, CXO, Managing Director, Senior Partner.
- **Motivation:** Status address in Bandra/Worli, low-density luxury, sea views, high-grade security, bespoke finishes.
- **Budget:** ₹1.80 Cr – ₹2.50 Cr+.
- **Decision Speed:** Fast if architectural floorplan and bespoke customization terms are met.`,
    updated_at: '2026-09-28'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-09-29 08:30:12',
    user: 'Niteesh Pandey',
    action: 'SYSTEM_BOOT',
    tool: 'system_health',
    target: 'database_and_gemini',
    status: 'SUCCESS',
    details: 'System initialized with PostgreSQL compatibility mode, 50 demo leads, 10 campaigns, and RAG knowledge base.'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-09-29 08:35:44',
    user: 'Niteesh Pandey',
    action: 'DETERMINISTIC_SCORING',
    tool: 'calculateDeterministicLeadScore',
    target: 'lead_L-1001',
    status: 'SUCCESS',
    details: 'Score computed: 88/100 (Budget fit: 20, Intent: 15, Authority: 15, Recency: 15).'
  },
  {
    id: 'AUD-003',
    timestamp: '2026-09-29 09:12:00',
    user: 'Niteesh Pandey',
    action: 'EMAIL_DRAFT_GENERATED',
    tool: 'generate_sales_copy',
    target: 'Vikram Malhotra',
    status: 'SUCCESS',
    details: 'Drafted consultative follow-up email focusing on payment milestone flexibility.'
  }
];
