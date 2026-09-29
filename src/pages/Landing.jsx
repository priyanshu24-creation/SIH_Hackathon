import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Cpu, 
  Table2, 
  ShieldCheck, 
  MapPin, 
  ArrowRight, 
  Languages, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Compass, 
  Workflow, 
  Database,
  ExternalLink,
  ChevronRight,
  Shield,
  Award
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [activeWorkflowStage, setActiveWorkflowStage] = useState(0);

  const workflowStages = [
    {
      step: "01",
      title: "Upload",
      desc: "Ingest scanned historical Khatians, Porchas, or legacy Jamabandis in PDF/JPG format.",
      icon: FileText,
      color: "from-blue-500 to-indigo-600"
    },
    {
      step: "02",
      title: "AI Processing",
      desc: "Automated binarization, deskewing, and Indian multilingual OCR across Bengali, Hindi, etc.",
      icon: Cpu,
      color: "from-indigo-600 to-purple-600"
    },
    {
      step: "03",
      title: "Structured Extraction",
      desc: "Named Entity Recognition maps Owner, Survey Plot No, Khasra, Khata, and Acreage with spatial bounding coordinates.",
      icon: Table2,
      color: "from-purple-600 to-brand-600"
    },
    {
      step: "04",
      title: "Validation",
      desc: "Heuristic rules check area consistency, mutation sequences, and flags suspected duplicate parcels.",
      icon: ShieldCheck,
      color: "from-brand-600 to-teal-600"
    },
    {
      step: "05",
      title: "Human Verification",
      desc: "Revenue officers review low-confidence or conflicting values in an evidence-linked 3-column workspace.",
      icon: CheckCircle2,
      color: "from-teal-600 to-emerald-600"
    },
    {
      step: "06",
      title: "GIS / API Ready",
      desc: "Seamless synchronization with cadastral GIS polygons for automated boundary cross-checking.",
      icon: MapPin,
      color: "from-emerald-600 to-emerald-700"
    }
  ];

  const features = [
    {
      title: "AI Document Digitization",
      desc: "Convert degraded scanned PDFs, physical photographs, and legacy records into high-fidelity structured digital assets with bounding-box coordinate tracking.",
      icon: FileText
    },
    {
      title: "Multilingual OCR Engine",
      desc: "Comprehensive support for both printed and complex cursive handwritten scripts across Bengali (বাংলা), Hindi (हिन्दी), Odia, and standard English.",
      icon: Languages
    },
    {
      title: "Structured Extraction",
      desc: "Accurately extracts 11 critical administrative attributes: Owner Name, Survey Number, Khasra, Khata, Area, Village/Mouza, Tehsil, District, Land Classification, Mutation Case, and Registration details.",
      icon: Table2
    },
    {
      title: "Confidence-Based Verification",
      desc: "Field-level character confidence scoring highlights ambiguous or low-fidelity values (below 70%) and immediately routes them to authorized verification queues.",
      icon: Sparkles
    },
    {
      title: "Automated Validation",
      desc: "Built-in intelligence detects missing metadata, suspected duplicate parcels, mathematical area discrepancies, and malformed cadastral identifiers before ledger commitment.",
      icon: ShieldCheck
    },
    {
      title: "GIS Integration",
      desc: "Connect structured digital records directly with cadastral spatial layers (GeoJSON/Shapefiles) to perform automated text-to-map boundary acreage cross-checking.",
      icon: MapPin
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-brand-500 selection:text-white">
      {/* Top Navigation */}
      <nav className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-900/10">
              <Layers className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">IND</span>
                <span className="font-extrabold text-base tracking-tight text-brand-600">DIGI-LAND</span>
              </div>
              <span className="text-[10.5px] font-semibold text-slate-400 block tracking-wider uppercase">
                AI Land Record Digitization & Validation
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Key Capabilities</a>
            <a href="#workflow" className="hover:text-slate-900 transition-colors">6-Stage Pipeline</a>
            <a href="#gis-preview" className="hover:text-slate-900 transition-colors">Cadastral GIS</a>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 text-xs font-mono text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
              <Award className="w-3.5 h-3.5" />
              <span>SIH 2026 • PS 26018</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/app"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all hover:shadow-md"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            {/* Hackathon Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-medium shadow-sm mb-2">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping"></span>
              <span className="font-bold text-brand-300">Smart India Hackathon 2026</span>
              <span className="text-slate-400">•</span>
              <span>Problem Statement 26018</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.15]">
              IND DIGI-LAND
              <span className="block text-2xl sm:text-3xl lg:text-3xl font-bold text-slate-700 mt-2">
                Intelligent Land Record Digitization & Validation
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed pt-2">
              Transform legacy land records into structured, verifiable, and GIS-ready digital information using AI-assisted document intelligence and evidence-linked spatial cross-checking.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                to="/app"
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-elevated transition-all hover:scale-[1.02]"
              >
                <span>Explore Platform</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/app/records/LR-2026-001284"
                className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-subtle transition-all"
              >
                <span>View Live Demo</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Hero Visual: Interactive 5-Stage Pipeline Preview */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-premium p-4 sm:p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Live Processing Pipeline Visualization
                  </div>
                  <div className="text-sm font-bold text-slate-800 mt-0.5">
                    Document → AI OCR → Structured Record → Validation → GIS
                  </div>
                </div>
                <span className="text-[12px] font-mono bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
                  ● End-to-End Simulation
                </span>
              </div>

              {/* 5-Stage Interactive Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {/* Stage 1: Document */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold font-mono">01. INGEST</span>
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">Scanned Khatian</div>
                  <div className="text-[12px] text-slate-500">Physical deed scanned at 300 DPI with official seal</div>
                  <div className="text-[10.5px] font-mono text-slate-400">Bengali / English</div>
                </div>

                {/* Stage 2: OCR */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold font-mono">02. OCR</span>
                    <Cpu className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">Multilingual Vision</div>
                  <div className="text-[12px] text-slate-500">Binarization, layout parsing & character segmentation</div>
                  <div className="text-[10.5px] font-mono text-emerald-600 font-semibold">96.2% Confidence</div>
                </div>

                {/* Stage 3: Extraction */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold font-mono">03. EXTRACT</span>
                    <Table2 className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">Entity Mapping</div>
                  <div className="text-[12px] text-slate-500">Owner, Plot 124/3, Khata 89, 2.45 acres mapped</div>
                  <div className="text-[10.5px] font-mono text-slate-500">11 Fields Bounding-Box</div>
                </div>

                {/* Stage 4: Validation */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold font-mono">04. VALIDATE</span>
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">Heuristic Engine</div>
                  <div className="text-[12px] text-slate-500">Area math verification, duplicate detection checks</div>
                  <div className="text-[10.5px] font-mono text-emerald-600 font-semibold">Score: 92/100</div>
                </div>

                {/* Stage 5: GIS */}
                <div className="p-3.5 rounded-xl border border-brand-200 bg-brand-50/50 space-y-2 ring-1 ring-brand-400">
                  <div className="flex items-center justify-between text-xs text-brand-600">
                    <span className="font-bold font-mono">05. GIS READY</span>
                    <MapPin className="w-4 h-4 text-brand-600" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">Cadastral Sync</div>
                  <div className="text-[12px] text-slate-600">Spatial polygon linked: PCL-10284 with 2.45 acres match</div>
                  <div className="text-[10.5px] font-mono text-brand-700 font-semibold">Boundary Aligned</div>
                </div>
              </div>

              {/* Interactive preview footer banner */}
              <div className="bg-slate-900 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></div>
                  <span className="text-xs text-slate-300">
                    Ready to inspect digitized Khatian record <strong>LR-2026-001284</strong> for Singamari Mouza?
                  </span>
                </div>
                <Link
                  to="/app/records/LR-2026-001284"
                  className="text-xs font-bold text-brand-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Launch Evidence-Linked Viewer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              Core Capabilities & UVPs
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Engineered for Revenue Administration & GIS Teams
            </h2>
            <p className="text-sm text-slate-600">
              Purpose-built tools designed to tackle legacy paper archives, varied linguistic formats, and spatial discrepancy detection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-slate-300 hover:shadow-card transition-all space-y-3 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 text-brand-600 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:bg-brand-50 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works: 6-Step Workflow Section */}
      <section id="workflow" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              System Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Five-Step Digitization & Verification Pipeline
            </h2>
            <p className="text-sm text-slate-600">
              From raw historical deed scan to validated, GIS-linked cadastral intelligence in under 3 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {workflowStages.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-subtle hover:shadow-card transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-200 font-mono">
                      {stage.step}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">{stage.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{stage.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-base font-bold">Ready to test the pipeline with your own record?</h4>
              <p className="text-xs text-slate-300">
                Try pre-loaded sample records from West Bengal (Singamari Mouza), Karnataka, and Maharashtra.
              </p>
            </div>
            <Link
              to="/app/upload"
              className="px-5 py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shrink-0 transition-colors shadow-sm"
            >
              <span>Upload Document</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <Layers className="w-4 h-4 text-brand-400" />
                </div>
                <span className="font-extrabold text-sm text-slate-900">IND DIGI-LAND</span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Intelligent Land Record Digitization & Validation System. AI-assisted digitization for modern land administration, cadastral GIS integration, and revenue transparency.
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded-md">
                <span>SIH 2026 • PS 26018</span>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Platform Modules
              </h5>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><Link to="/app" className="hover:text-slate-900">Executive Dashboard</Link></li>
                <li><Link to="/app/records" className="hover:text-slate-900">Digitized Land Records</Link></li>
                <li><Link to="/app/validation" className="hover:text-slate-900">Automated Validation Engine</Link></li>
                <li><Link to="/app/verification" className="hover:text-slate-900">Human Verification Queue</Link></li>
                <li><Link to="/app/gis" className="hover:text-slate-900">Cadastral GIS Map</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Project Documentation
              </h5>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><a href="#workflow" className="hover:text-slate-900">System Workflow</a></li>
                <li><Link to="/app/audit" className="hover:text-slate-900">Audit Trail Integrity</Link></li>
                <li><Link to="/app/analytics" className="hover:text-slate-900">State-wise Statistics</Link></li>
                <li><Link to="/app/settings" className="hover:text-slate-900">System Settings</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <div>
              © 2026 IND DIGI-LAND • Smart India Hackathon 2026 Project (Problem Statement 26018).
            </div>
            <div className="flex items-center gap-4">
              <span>Frontend Simulation</span>
              <span>•</span>
              <span>All sample records fictional (Demo Data)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
