import os
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.append(str(Path(__file__).resolve().parent.parent))

from database.db import init_db, SessionLocal
from database.models import (
    LeadModel,
    ProductModel,
    CampaignModel,
    TaskModel,
    KnowledgeDocumentModel,
    AuditLogModel
)

def seed():
    init_db()
    db = SessionLocal()

    # Clear existing demo data to prevent duplicates
    db.query(LeadModel).delete()
    db.query(ProductModel).delete()
    db.query(CampaignModel).delete()
    db.query(TaskModel).delete()
    db.query(KnowledgeDocumentModel).delete()
    db.query(AuditLogModel).delete()

    # 1. Products
    products = [
        ProductModel(
            id="prod-1",
            name="UrbanNest Prime Residences",
            category="Premium residential apartments",
            price_range="₹1.20 Cr – ₹2.50 Cr",
            min_price=12000000.0,
            max_price=25000000.0,
            locations="Bandra West, Worli, Powai (Mumbai)",
            configurations="3 BHK, 4 BHK Luxury Sky Suites",
            highlights="Panoramic sea views, private elevators, Italian marble flooring, Olympic-sized infinity pool."
        ),
        ProductModel(
            id="prod-2",
            name="UrbanNest Select Homes",
            category="Mid-premium apartments",
            price_range="₹75 Lakh – ₹1.35 Cr",
            min_price=7500000.0,
            max_price=13500000.0,
            locations="Ghodbunder Road, Kolshet Road (Thane), Wakad (Pune)",
            configurations="1.5 BHK, 2 BHK, 3 BHK Smart Homes",
            highlights="Connected clubhouse, EV charging bays, co-working lounges, 80% open landscaped area."
        ),
        ProductModel(
            id="prod-3",
            name="UrbanNest Investor Units",
            category="Investment-focused residential units",
            price_range="₹90 Lakh – ₹1.80 Cr",
            min_price=9000000.0,
            max_price=18000000.0,
            locations="Hinjawadi Phase 1, Kharadi (Pune), Airoli (Navi Mumbai)",
            configurations="Studio Suites, 1 BHK High-Yield Suites",
            highlights="Pre-leased corporate tenant tie-ups, guaranteed 6.2% gross rental yield for 3 years."
        )
    ]
    db.add_all(products)

    # 2. Leads (50+ records)
    sample_leads = [
        ("L-1001", "Vikram Malhotra", "vikram.m@techcorp.in", "+91 98201 12345", "Fintech Solutions Ltd", "Mumbai", "Financial Technology", "Chief Technology Officer", "LinkedIn Ad", "UrbanNest Prime Residences", 22000000.0, 88, 86, 92, 85, "NEGOTIATION", "HOT", "2026-09-28", "2026-09-29", "Visited Worli sample flat on Saturday. Loved the 4 BHK layout. Pre-approved home loan from HDFC for ₹1.8 Cr. Negotiating on parking slot."),
        ("L-1002", "Dr. Pooja Deshmukh", "dr.pooja.d@hospitalgroup.com", "+91 98220 54321", "Apollo Clinic Network", "Pune", "Healthcare & Medicine", "Senior Consulting Cardiologist", "Google Search", "UrbanNest Investor Units", 15000000.0, 84, 82, 88, 80, "PROPOSAL", "HOT", "2026-09-27", "2026-09-30", "Looking for 2 studio units in Kharadi for assured rental yield. Reviewed draft agreement."),
        ("L-1003", "Amitabh Joshi", "amitabh.joshi@globalcloud.com", "+91 99870 98765", "CloudScale Systems", "Thane", "Software Engineering", "Engineering Director", "Website", "UrbanNest Select Homes", 11500000.0, 86, 88, 85, 84, "MEETING", "HOT", "2026-09-28", "2026-09-29", "Upgrading from Mulund rental. Attending presentation today at 3:00 PM with spouse."),
        ("L-1004", "Sneha Ranganathan", "sneha.r@designstudio.co", "+91 98199 43210", "Studio Pixel Arch", "Mumbai", "Architecture & Design", "Principal Architect", "Instagram", "UrbanNest Prime Residences", 18500000.0, 78, 75, 82, 76, "QUALIFIED", "WARM", "2026-09-26", "2026-10-01", "Interested in terrace garden flats at Powai. Asked for architectural floorplans."),
        ("L-1005", "Rajesh Nair", "rajesh.nair@supplylogistics.in", "+91 97690 11223", "BlueDart Translogistics", "Thane", "Logistics & Supply Chain", "General Manager - Ops", "Referral", "UrbanNest Select Homes", 9500000.0, 72, 70, 75, 71, "CONTACTED", "WARM", "2026-09-27", "2026-09-30", "Referred by previous buyer in Block B. Looking for 2 BHK near Majiwada."),
    ]

    for item in sample_leads:
        lead = LeadModel(
            lead_id=item[0],
            name=item[1],
            email=item[2],
            phone=item[3],
            company=item[4],
            city=item[5],
            industry=item[6],
            job_title=item[7],
            source=item[8],
            product_interest=item[9],
            budget=item[10],
            lead_score=item[11],
            intent_score=item[12],
            fit_score=item[13],
            engagement_score=item[14],
            stage=item[15],
            status=item[16],
            last_contact_date=item[17],
            next_followup_date=item[18],
            notes=item[19],
            owner="Niteesh Pandey"
        )
        db.add(lead)

    # Generate additional 45 realistic fictional leads
    names = [
        "Nisha Singhania", "Anand Kulkarni", "Harish Mehta", "Kavita Pillai", "Deepak Agarwal",
        "Sanjay Verma", "Rohan Sen", "Aditya Swaminathan", "Meera Chidambaram", "Gaurav Bhasin",
        "Farhan Merchant", "Shalini Bhatnagar", "Tanmay Shirke", "Bhavna Parekh", "Karthik Raman",
        "Arun Gokhale", "Manish Poddar", "Divya Sundaram", "Rohit Chhabra", "Neeraj Saxena",
        "Priyanka Roy", "Sameer Quadri", "Sunil Mathur", "Ananya Sengupta", "Devendra Patil",
        "Zaid Qureshi", "Swati Deshpande", "Chetan Bhagat", "Ritu Singhal", "Nitin Gadgil",
        "Suresh Solanki", "Archana Rao", "Vivek Nadkarni", "Shruti Vaidya", "Kunal Shah",
        "Preeti Munjal", "Tarun Kapoor", "Mihir Doshi", "Leena Mathew", "Ashish Tandon",
        "Geeta Rane", "Jayant Nambiar", "Sheetal Suri", "Parag Ranade", "Mansi Sethi"
    ]
    cities = ["Mumbai", "Thane", "Pune"]
    products_list = ["UrbanNest Prime Residences", "UrbanNest Select Homes", "UrbanNest Investor Units"]
    stages_list = ["NEW", "CONTACTED", "QUALIFIED", "MEETING", "PROPOSAL", "NEGOTIATION", "WON", "LOST", "NURTURE"]

    for idx, n in enumerate(names):
        cid = f"L-{1006 + idx}"
        city = cities[idx % len(cities)]
        product = products_list[idx % len(products_list)]
        stg = stages_list[idx % len(stages_list)]
        bgt = 16000000.0 if "Prime" in product else (9000000.0 if "Select" in product else 12000000.0)
        score = 65 + (idx % 30)

        lead = LeadModel(
            lead_id=cid,
            name=n,
            email=f"{n.lower().replace(' ', '.')}@demo-corp.in",
            phone=f"+91 {98200 + idx} {10000 + (idx * 211)}",
            company=f"{n.split(' ')[1]} Ventures India",
            city=city,
            industry="Business Services",
            job_title="Executive Specialist",
            source="Website" if idx % 2 == 0 else "LinkedIn Ad",
            product_interest=product,
            budget=bgt,
            lead_score=score,
            intent_score=score - 4,
            fit_score=score + 2,
            engagement_score=score - 2,
            stage=stg,
            status="CONVERTED" if stg == "WON" else ("HOT" if score >= 80 else "ACTIVE"),
            last_contact_date=f"2026-09-{20 + (idx % 9)}",
            next_followup_date=f"2026-09-{28 + (idx % 3)}",
            notes=f"Inquired about {product} in {city}. Budget verified at ₹{(bgt/10000000):.2f} Cr.",
            owner="Niteesh Pandey"
        )
        db.add(lead)

    # 3. Campaigns
    campaigns = [
        CampaignModel(id="CMP-201", name="Q3 Prime Worli Sea-Face Launch", channel="Google Search", date="2026-09-01", impressions=48500, clicks=2950, leads=184, qualified_leads=62, meetings=24, customers=4, spend=285000.0, revenue=89000000.0),
        CampaignModel(id="CMP-202", name="Executive Tech Leaders - Bandra West", channel="LinkedIn Ads", date="2026-09-05", impressions=32000, clicks=1420, leads=98, qualified_leads=46, meetings=18, customers=3, spend=195000.0, revenue=64500000.0),
        CampaignModel(id="CMP-203", name="Thane Smart Homes Instagram Blitz", channel="Meta/Instagram", date="2026-09-08", impressions=115000, clicks=4820, leads=245, qualified_leads=58, meetings=15, customers=2, spend=140000.0, revenue=22000000.0),
        CampaignModel(id="CMP-204", name="Pune IT Corridor Assured Yield Direct", channel="Email", date="2026-09-12", impressions=18000, clicks=1980, leads=112, qualified_leads=52, meetings=21, customers=5, spend=45000.0, revenue=55000000.0),
        CampaignModel(id="CMP-205", name="Mumbai Property Expo 2026 On-ground", channel="Channel Partner", date="2026-09-14", impressions=12000, clicks=3400, leads=165, qualified_leads=72, meetings=34, customers=6, spend=320000.0, revenue=112000000.0),
    ]
    db.add_all(campaigns)

    # 4. Tasks
    tasks = [
        TaskModel(task_id="TSK-101", title="Call Vikram Malhotra regarding stamp duty clause", description="Finalize payment milestone schedule and clarify stamp duty rebate.", type="CALL", priority="CRITICAL", status="TODO", due_date="2026-09-29", related_lead_id="L-1001"),
        TaskModel(task_id="TSK-102", title="Deliver 3 BHK layout comparison to Amitabh Joshi", description="Side-by-side room dimension chart.", type="PROPOSAL", priority="HIGH", status="TODO", due_date="2026-09-29", related_lead_id="L-1003"),
        TaskModel(task_id="TSK-103", title="Send corporate rental yield proof to Dr. Pooja Deshmukh", description="Share 3-year tenant occupancy certificates.", type="EMAIL", priority="HIGH", status="IN_PROGRESS", due_date="2026-09-30", related_lead_id="L-1002"),
    ]
    db.add_all(tasks)

    # 5. Audit Log
    db.add(AuditLogModel(
        id="AUD-001",
        user="Niteesh Pandey",
        action="SEED_DATABASE",
        tool="seed_demo_data",
        target="PostgreSQL/SQLite",
        status="SUCCESS",
        details="Populated 50 leads, 3 products, 5 campaigns, and 3 tasks."
    ))

    db.commit()
    db.close()
    print("Database seeding completed successfully. 50+ leads and campaigns created.")

if __name__ == "__main__":
    seed()
