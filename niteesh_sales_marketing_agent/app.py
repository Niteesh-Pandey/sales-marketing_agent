import os
import sys
from pathlib import Path
import streamlit as st
import pandas as pd
import plotly.express as px

# Ensure root is in path
sys.path.append(str(Path(__file__).resolve().parent))

from config.settings import OWNER_NAME, DEMO_CLIENT, DATABASE_URL, GEMINI_MODEL
from database.db import init_db, SessionLocal
from database.models import LeadModel, CampaignModel, TaskModel, KnowledgeDocumentModel, AuditLogModel
from services.lead_service import LeadService
from services.analytics_service import AnalyticsService
from ai.agent import agent_instance
from ai.gemini_client import gemini_service
from rag.retriever import local_retriever

# Initialize database
init_db()

st.set_page_config(
    page_title="Niteesh AI Sales & Marketing Command Center",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling
st.markdown("""
<style>
    .main { background-color: #0b0f19; }
    .stMetric { background-color: #111827; border: 1px solid #1f2937; border-radius: 10px; padding: 12px; }
    .stTabs [data-baseweb="tab-list"] { gap: 8px; }
    .stTabs [data-baseweb="tab"] { border-radius: 8px; padding: 8px 16px; background-color: #111827; }
</style>
""", unsafe_allow_html=True)

# Sidebar
st.sidebar.markdown(f"### ⚡ Niteesh AI Growth Labs")
st.sidebar.caption(f"Owner: **{OWNER_NAME}**")
st.sidebar.caption(f"Demo Client: **{DEMO_CLIENT}** (Mumbai, Thane, Pune)")
st.sidebar.caption(f"AI Model: **{GEMINI_MODEL}**")

db_type = "PostgreSQL" if "postgresql" in DATABASE_URL else "SQLite"
st.sidebar.info(f"Database: **{db_type} Mode**")

menu = st.sidebar.radio(
    "Workspaces",
    [
        "Dashboard",
        "AI Assistant",
        "Lead Management",
        "Visual Pipeline",
        "Sales & Objections",
        "Marketing & Copy",
        "Analytics & Funnel",
        "Knowledge Base (RAG)",
        "Meeting Intelligence",
        "Day Plan & Tasks",
        "Reports & Settings"
    ]
)

db = SessionLocal()

# ----------------- 1. DASHBOARD ----------------- #
if menu == "Dashboard":
    st.title("⚡ Niteesh AI Sales & Marketing Command Center")
    st.subheader(f"Welcome back, {OWNER_NAME.split()[0]}.")
    st.caption("AI Sales, Marketing, Lead Intelligence and Business Decision Assistant for UrbanNest Properties.")

    leads = db.query(LeadModel).all()
    campaigns = db.query(CampaignModel).all()

    total_leads = len(leads)
    hot_leads = len([l for l in leads if l.lead_score >= 80 or l.status == "HOT"])
    pipeline_val = sum(l.budget for l in leads if l.stage in ["PROPOSAL", "NEGOTIATION"])
    closed_val = sum(l.budget for l in leads if l.stage == "WON")

    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Total Leads", total_leads, f"{hot_leads} Hot Opportunities")
    c2.metric("Weighted Pipeline", f"₹{(pipeline_val / 10000000):.2f} Cr")
    c3.metric("Closed Won Bookings", f"₹{(closed_val / 10000000):.2f} Cr")
    c4.metric("Avg Lead Score", f"{int(sum(l.lead_score for l in leads) / (total_leads or 1))}/100")

    st.markdown("---")
    st.subheader("Sales Pipeline Distribution")
    stages = ["NEW", "CONTACTED", "QUALIFIED", "MEETING", "PROPOSAL", "NEGOTIATION", "WON", "LOST"]
    stage_counts = {s: len([l for l in leads if l.stage == s]) for s in stages}
    df_stages = pd.DataFrame(list(stage_counts.items()), columns=["Stage", "Count"])
    fig = px.bar(df_stages, x="Stage", y="Count", color="Count", color_continuous_scale="Viridis")
    st.plotly_chart(fig, use_container_width=True)

# ----------------- 2. AI ASSISTANT ----------------- #
elif menu == "AI Assistant":
    st.title("🤖 AI Sales & Marketing Assistant")
    st.caption("Free-first grounded reasoning: FACT, INFERENCE, ASSUMPTION, and RECOMMENDATION.")

    if "chat_history" not in st.session_state:
        st.session_state.chat_history = []

    for msg in st.session_state.chat_history:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

    user_input = st.chat_input("Ask Niteesh AI (e.g. 'Which leads should I contact today?', 'Draft a follow-up for Vikram')...")
    if user_input:
        st.session_state.chat_history.append({"role": "user", "content": user_input})
        with st.chat_message("user"):
            st.markdown(user_input)

        with st.chat_message("assistant"):
            with st.spinner("Analyzing CRM data, campaigns & knowledge base..."):
                reply = agent_instance.answer_query(user_input)
                st.markdown(reply)
                st.session_state.chat_history.append({"role": "assistant", "content": reply})

# ----------------- 3. LEADS ----------------- #
elif menu == "Lead Management":
    st.title("👥 Lead Management CRM")
    leads = db.query(LeadModel).all()
    df_leads = pd.DataFrame([
        {
            "ID": l.lead_id,
            "Name": l.name,
            "Company": l.company,
            "City": l.city,
            "Product": l.product_interest,
            "Budget (₹)": f"₹{(l.budget/10000000):.2f} Cr",
            "Score": l.lead_score,
            "Stage": l.stage,
            "Status": l.status,
            "Notes": l.notes
        }
        for l in leads
    ])
    st.dataframe(df_leads, use_container_width=True)

# ----------------- 4. PIPELINE ----------------- #
elif menu == "Visual Pipeline":
    st.title("📊 Visual Pipeline (Kanban)")
    leads = db.query(LeadModel).all()
    cols = st.columns(4)
    stages_order = ["NEW", "QUALIFIED", "MEETING", "PROPOSAL", "NEGOTIATION", "WON"]

    for idx, stg in enumerate(stages_order):
        with cols[idx % 4]:
            st.markdown(f"#### {stg}")
            stg_leads = [l for l in leads if l.stage == stg]
            for l in stg_leads:
                st.info(f"**{l.name}**\n\n₹{(l.budget/10000000):.2f} Cr &bull; Score: {l.lead_score}\n\n_{l.product_interest}_")

# ----------------- 5. SALES & OBJECTIONS ----------------- #
elif menu == "Sales & Objections":
    st.title("✉️ Consultative Sales Assistant & Objection Engine")
    leads = db.query(LeadModel).all()
    lead_names = {l.name: l for l in leads}

    lead_choice = st.selectbox("Select Lead from CRM", list(lead_names.keys()))
    target_lead = lead_names[lead_choice]

    tone = st.selectbox("Tone", ["Consultative", "Executive", "Professional", "Short & Direct", "Persuasive"])
    msg_type = st.selectbox("Objective", ["Follow-up Email", "Cold Outreach", "Meeting Request", "Reactivation"])

    if st.button("Generate Sales Email"):
        with st.spinner("Drafting evidence-backed copy..."):
            prompt = f"Draft a {tone} {msg_type} for {target_lead.name} ({target_lead.company}, {target_lead.city}) interested in {target_lead.product_interest} with budget ₹{(target_lead.budget/10000000):.2f} Cr. Notes: {target_lead.notes}."
            draft = gemini_service.generate_text(prompt)
            st.text_area("Generated Draft (Stored locally in Draft mode)", draft, height=260)

# ----------------- 6. MARKETING ----------------- #
elif menu == "Marketing & Copy":
    st.title("📢 Marketing & Campaign Generator")
    platform = st.selectbox("Platform", ["LinkedIn", "Instagram", "Email", "WhatsApp", "Website"])
    offer = st.text_input("Offer", "10:90 Payment Subvention + 82% Usable Carpet Area Guarantee")
    if st.button("Generate Omni-Channel Copy"):
        with st.spinner("Synthesizing copy..."):
            prompt = f"Create a high-converting {platform} post for UrbanNest Properties offering {offer}. Provide Hook, Body, Proof, and CTA."
            res = gemini_service.generate_text(prompt)
            st.markdown(res)

# ----------------- 7. ANALYTICS ----------------- #
elif menu == "Analytics & Funnel":
    st.title("📈 Marketing Analytics (11 Formulas)")
    campaigns = db.query(CampaignModel).all()
    df_camp = pd.DataFrame([
        {
            "Campaign": c.name,
            "Channel": c.channel,
            "Clicks": c.clicks,
            "Leads": c.leads,
            "Qualified": c.qualified_leads,
            "Spend": f"₹{(c.spend/1000):.0f}k",
            "Revenue": f"₹{(c.revenue/10000000):.2f} Cr",
            "ROAS": f"{(c.revenue/c.spend):.1f}x" if c.spend > 0 else "0"
        }
        for c in campaigns
    ])
    st.dataframe(df_camp, use_container_width=True)

# ----------------- 8. KNOWLEDGE BASE (RAG) ----------------- #
elif menu == "Knowledge Base (RAG)":
    st.title("📚 Local RAG Knowledge Base")
    query = st.text_input("Search Knowledge Base (e.g. '10:90 payment plan', 'usable carpet area')")
    if query:
        matches = local_retriever.search(query, top_k=3)
        for m in matches:
            st.markdown(f"**Source Document:** `{m['source']}`")
            st.info(m['evidence'])

# ----------------- 9. MEETING INTEL ----------------- #
elif menu == "Meeting Intelligence":
    st.title("🎧 Meeting Intelligence & CRM Extraction")
    transcript = st.text_area("Paste Transcript / Call Notes", height=200)
    if st.button("Extract CRM Intelligence"):
        with st.spinner("Extracting pain points, budget, timeline and commitments..."):
            res = gemini_service.generate_text(f"Extract CRM intelligence (participants, need, budget, objections, commitments, next steps) from:\n{transcript}")
            st.markdown(res)

# ----------------- 10. DAY PLAN & TASKS ----------------- #
elif menu == "Day Plan & Tasks":
    st.title("📅 Today's Command Center & Day Plan")
    if st.button("⚡ Create My Day Plan"):
        with st.spinner("Generating 4-block chronological schedule..."):
            plan = gemini_service.generate_text("Create a 4-block day plan (Morning, Midday, Afternoon, End-of-day) for Niteesh Pandey managing UrbanNest residential sales.")
            st.markdown(plan)

# ----------------- 11. REPORTS & SETTINGS ----------------- #
elif menu == "Reports & Settings":
    st.title("⚙️ System Health & PostgreSQL Settings")
    st.success("✅ Database: PostgreSQL / SQLite Dual Driver Active")
    st.info(f"Database Connection: `{DATABASE_URL}`")
    st.caption("Run locally on Windows with: `setup_windows.bat` followed by `run_windows.bat`.")

db.close()
