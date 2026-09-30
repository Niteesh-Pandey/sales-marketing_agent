import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Home,
  CheckCircle2,
  Calculator,
  Download,
  Share2,
  FileCheck,
  Percent,
  Coins,
  Shield,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';

interface PropertyUnit {
  id: string;
  name: string;
  project: string;
  location: string;
  city: 'Mumbai' | 'Thane' | 'Pune';
  type: string;
  carpetArea: number; // in sq.ft
  usableRatio: number; // percentage
  basePrice: number; // in INR
  reraNumber: string;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  possession: string;
  floor: string;
  features: string[];
}

const INVENTORY_UNITS: PropertyUnit[] = [
  {
    id: 'UNT-101',
    name: 'Worli Sky Suite (Tower A, 32nd Fl)',
    project: 'UrbanNest Prime Residences',
    location: 'Worli Sea Face, Mumbai',
    city: 'Mumbai',
    type: '4 BHK Luxury Sky Suite',
    carpetArea: 1940,
    usableRatio: 82.5,
    basePrice: 22000000,
    reraNumber: 'P51800045892',
    status: 'AVAILABLE',
    possession: 'December 2026',
    floor: '32 of 45',
    features: ['Panoramic Arabian Sea view', 'Private elevator lobby', 'Italian marble', '3 Reserved EV slots']
  },
  {
    id: 'UNT-102',
    name: 'Bandra Executive Residence (Tower B, 18th Fl)',
    project: 'UrbanNest Prime Residences',
    location: 'Pali Hill / Bandra West, Mumbai',
    city: 'Mumbai',
    type: '3 BHK Sea-View Suite',
    carpetArea: 1480,
    usableRatio: 81.0,
    basePrice: 17500000,
    reraNumber: 'P51800045892',
    status: 'RESERVED',
    possession: 'October 2026',
    floor: '18 of 28',
    features: ['Double-height deck', 'Smart automation by Legrand', 'Concierge desk tie-up', 'Clubhouse access']
  },
  {
    id: 'UNT-103',
    name: 'Ghodbunder Smart Home (Tower C, 14th Fl)',
    project: 'UrbanNest Select Homes',
    location: 'Ghodbunder Road, Thane',
    city: 'Thane',
    type: '3 BHK Garden Facing',
    carpetArea: 1120,
    usableRatio: 83.2,
    basePrice: 11500000,
    reraNumber: 'P51700032145',
    status: 'AVAILABLE',
    possession: 'Ready to Move / OC Received',
    floor: '14 of 35',
    features: ['Yeoor Hills view', '10 min to Metro Line 4', '80% open landscaped area', 'Solar water heating']
  },
  {
    id: 'UNT-104',
    name: 'Kolshet Tech-Upgrade Unit (Tower D, 8th Fl)',
    project: 'UrbanNest Select Homes',
    location: 'Kolshet Road, Thane',
    city: 'Thane',
    type: '2 BHK Smart Home',
    carpetArea: 840,
    usableRatio: 84.0,
    basePrice: 8500000,
    reraNumber: 'P51700032145',
    status: 'AVAILABLE',
    possession: 'March 2027',
    floor: '8 of 30',
    features: ['Dedicated acoustic study pod', 'EV charging bay', 'Olympic swimming pool', 'Children play zone']
  },
  {
    id: 'UNT-105',
    name: 'Kharadi High-Yield Corporate Suite (Tower E, 6th Fl)',
    project: 'UrbanNest Investor Units',
    location: 'World Trade Center Road, Kharadi, Pune',
    city: 'Pune',
    type: '1 BHK High-Yield Investor Suite',
    carpetArea: 620,
    usableRatio: 85.5,
    basePrice: 7500000,
    reraNumber: 'P52100028741',
    status: 'AVAILABLE',
    possession: 'Immediate / Pre-Leased',
    floor: '6 of 22',
    features: ['Pre-leased to multinational corporate tenant', '6.2% assured annual gross yield', 'Managed facility desk']
  },
  {
    id: 'UNT-106',
    name: 'Hinjawadi Tech Suite (Tower F, 11th Fl)',
    project: 'UrbanNest Investor Units',
    location: 'Hinjawadi Phase 1, Pune',
    city: 'Pune',
    type: 'Studio Investor Suite',
    carpetArea: 480,
    usableRatio: 86.0,
    basePrice: 5800000,
    reraNumber: 'P52100028741',
    status: 'AVAILABLE',
    possession: 'June 2026',
    floor: '11 of 20',
    features: ['Fully furnished by Pepperfry Enterprise', 'Walk to Infosys & Wipro campuses', 'High tenant demand']
  }
];

export const InventoryView: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [selectedUnit, setSelectedUnit] = useState<PropertyUnit>(INVENTORY_UNITS[0]);
  const [copiedQuote, setCopiedQuote] = useState(false);

  // EMI Calculator State
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenorYears, setTenorYears] = useState<number>(20);

  const filteredUnits = INVENTORY_UNITS.filter((u) => {
    if (selectedCity !== 'ALL' && u.city !== selectedCity) return false;
    return true;
  });

  // Financial Calculations (Maharashtra Real Estate Standards)
  const price = selectedUnit.basePrice;
  const stampDutyRate = selectedUnit.city === 'Mumbai' || selectedUnit.city === 'Thane' ? 0.06 : 0.07; // 6% in MMR
  const stampDuty = price * stampDutyRate;
  const gstRate = 0.05; // 5% for under-construction residential
  const gst = price * gstRate;
  const registrationFee = 30000;
  const totalCost = price + stampDuty + gst + registrationFee;

  const downPaymentAmount = (price * downPaymentPercent) / 100;
  const loanAmount = price - downPaymentAmount;

  // Monthly EMI Formula: [P x R x (1+R)^N]/[(1+R)^N-1]
  const monthlyRate = interestRate / 12 / 100;
  const numberOfMonths = tenorYears * 12;
  const emi =
    loanAmount > 0
      ? Math.round(
          (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) /
            (Math.pow(1 + monthlyRate, numberOfMonths) - 1)
        )
      : 0;

  const handleCopyQuote = () => {
    const text = `*UrbanNest Properties - Official Unit Financial Quotation*
Property: ${selectedUnit.name}
Project: ${selectedUnit.project}
Location: ${selectedUnit.location}
RERA Approved: ${selectedUnit.reraNumber}
Configuration: ${selectedUnit.type} (${selectedUnit.carpetArea} sq.ft carpet, ${selectedUnit.usableRatio}% efficiency)

Financial Breakdown:
- Base Agreement Value: ₹${(price / 10000000).toFixed(2)} Cr (₹${price.toLocaleString('en-IN')})
- Stamp Duty (${(stampDutyRate * 100).toFixed(0)}%): ₹${stampDuty.toLocaleString('en-IN')}
- GST (5%): ₹${gst.toLocaleString('en-IN')}
- Registration: ₹${registrationFee.toLocaleString('en-IN')}
- Total All-Inclusive Outlay: ₹${(totalCost / 10000000).toFixed(2)} Cr

Financing Simulation (${downPaymentPercent}% Down Payment):
- Down Payment: ₹${downPaymentAmount.toLocaleString('en-IN')}
- Bank Loan: ₹${loanAmount.toLocaleString('en-IN')} @ ${interestRate}% for ${tenorYears} yrs
- Estimated Monthly EMI: ₹${emi.toLocaleString('en-IN')}/month

Advisor: Niteesh Pandey | Niteesh AI Growth Labs`;

    navigator.clipboard.writeText(text);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            Property Inventory &amp; Financial Engineering Desk
          </h2>
          <p className="text-xs text-slate-400">
            Real-time residential unit availability, RERA certifications, and instant stamp-duty &amp; EMI calculation for UrbanNest Properties
          </p>
        </div>

        {/* City Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
          {['ALL', 'Mumbai', 'Thane', 'Pune'].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedCity === city
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {city === 'ALL' ? 'All Locations' : city}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Units List, Right Financial Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Unit Cards List (7 Cols) */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Showing {filteredUnits.length} verified inventory units</span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Shield className="w-3.5 h-3.5" /> 100% MahaRERA Compliant
            </span>
          </div>

          <div className="space-y-3">
            {filteredUnits.map((unit) => {
              const isSelected = unit.id === selectedUnit.id;
              return (
                <div
                  key={unit.id}
                  onClick={() => setSelectedUnit(unit)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500/80 ring-1 ring-indigo-500/50 shadow-xl'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-sm">{unit.name}</h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            unit.status === 'AVAILABLE'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          {unit.status}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-300 font-medium mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-indigo-400" />
                        {unit.location}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-base font-extrabold text-white">
                        ₹{(unit.basePrice / 10000000).toFixed(2)} Cr
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Base Agreement Value
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2.5 my-2 border-y border-slate-800/80 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Carpet Area</span>
                      <strong className="text-slate-200">{unit.carpetArea} sq.ft</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Efficiency Ratio</span>
                      <strong className="text-emerald-400">{unit.usableRatio}% Usable</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Possession</span>
                      <strong className="text-slate-200">{unit.possession}</strong>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {unit.features.slice(0, 3).map((feat, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300"
                      >
                        &bull; {feat}
                      </span>
                    ))}
                    <span className="ml-auto font-mono text-[10px] text-slate-400">
                      RERA: {unit.reraNumber}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Financial Calculator & Deal Sheet (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">Real Estate Deal Calculator</h3>
              </div>
              <button
                onClick={handleCopyQuote}
                className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedQuote ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedQuote ? 'Copied!' : 'Copy Quote'}</span>
              </button>
            </div>

            {/* Selected Unit Details */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">
                Active Selection
              </span>
              <div className="font-bold text-white text-sm">{selectedUnit.name}</div>
              <div className="text-xs text-slate-400">{selectedUnit.type} &bull; {selectedUnit.city}</div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Base Agreement Value:</span>
                <span className="font-mono font-bold text-white">₹{price.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Stamp Duty ({(stampDutyRate * 100).toFixed(0)}% in {selectedUnit.city}):</span>
                <span className="font-mono text-slate-300">₹{stampDuty.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>GST (5% Under-Construction):</span>
                <span className="font-mono text-slate-300">₹{gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Registration &amp; Legal Charges:</span>
                <span className="font-mono text-slate-300">₹{registrationFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 font-bold text-emerald-400 text-sm">
                <span>Total All-Inclusive Outlay:</span>
                <span className="font-mono">₹{(totalCost / 10000000).toFixed(2)} Cr</span>
              </div>
            </div>

            {/* Loan Financing Controls */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Financing &amp; Loan Simulator</span>
                <span className="text-[10px] text-slate-400">HDFC / SBI / ICICI Rates</span>
              </div>

              {/* Down Payment Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span>Down Payment: {downPaymentPercent}%</span>
                  <span className="font-mono text-indigo-300">₹{downPaymentAmount.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Tenor & Interest */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="7.0"
                    max="12.0"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Tenor (Years)</label>
                  <select
                    value={tenorYears}
                    onChange={(e) => setTenorYears(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value={10}>10 Years</option>
                    <option value={15}>15 Years</option>
                    <option value={20}>20 Years</option>
                    <option value={25}>25 Years</option>
                  </select>
                </div>
              </div>

              {/* Resulting EMI Box */}
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 text-center">
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
                  Estimated Monthly EMI
                </span>
                <div className="text-xl font-extrabold text-white font-mono mt-0.5">
                  ₹{emi.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-400">/mo</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  On Loan of ₹{(loanAmount / 10000000).toFixed(2)} Cr @ {interestRate}% for {tenorYears} yrs
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
