import React from "react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import {
  Binary,
  Building2,
  Cpu,
  GraduationCap,
  HardHat,
  HeartPulse,
  Layers,
  Wrench,
  Zap,
} from "lucide-react";

export default function DepartmentsPage() {
  const departments = [
    {
      code: "DEPT-CIT",
      name: "Department of Computer & Information Technology",
      head: "Prof. Dr. Munir Ahmed",
      focus: "Software Engineering, Cloud Infrastructure, Database Architecture, Cybersecurity, and Network Operations.",
      programs: ["DAE in Computer Information Technology (3 Years)", "Diploma in Information Technology (1 Year)"],
      icon: Cpu,
    },
    {
      code: "DEPT-CIVIL",
      name: "Department of Civil Engineering Technology",
      head: "Engr. Ayesha Siddiqa",
      focus: "Structural Engineering, Concrete Materials, Quantity Surveying, Transportation, and Geotechnical Assessment.",
      programs: ["DAE in Civil Technology (3 Years)", "Surveying & Building Estimation Certificate"],
      icon: HardHat,
    },
    {
      code: "DEPT-ELECT",
      name: "Department of Electrical & Electronics Technology",
      head: "Engr. Kamran Raza",
      focus: "Electric Power Generation, Transmission & Distribution, Industrial PLC Automation, and Circuit Diagnostics.",
      programs: ["DAE in Electrical Technology (3 Years)", "Industrial Automation Diploma"],
      icon: Zap,
    },
    {
      code: "DEPT-AI",
      name: "Department of Artificial Intelligence & Emerging Tech",
      head: "Dr. Farhan Qureshi",
      focus: "Deep Learning, Autonomous Robotics, Edge Computing, Computer Vision, and Predictive Analytics.",
      programs: ["BS Technology in AI & Robotics (4 Years)", "Applied Data Science Specialist Diploma"],
      icon: Binary,
    },
    {
      code: "DEPT-HEALTH",
      name: "Department of Biomedical & Health Technologies",
      head: "Dr. Samina Kausar",
      focus: "Clinical Laboratory Science, Diagnostic Imaging Equipment, Pathology Automation, and Hospital Informatics.",
      programs: ["Diploma in Medical Laboratory Technology (2 Years)", "Biomedical Equipment Maintenance"],
      icon: HeartPulse,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="bg-bste-navy-100 text-bste-navy-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Academic Divisions
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold font-display text-bste-navy-900">
              Academic &amp; Technical Departments
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Explore the departmental divisions supervising curricula, lab standards, and practical
              examinations under the BSTE Islamabad charter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => {
              const IconComp = dept.icon;
              return (
                <div
                  key={dept.code}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-bste-navy-800 text-bste-gold flex items-center justify-center">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-bste-navy-600">
                      {dept.code}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 font-display">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{dept.focus}</p>

                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
                        Offered Programs:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {dept.programs.map((p) => (
                          <li key={p} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-bste-gold"></span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Head: {dept.head}</span>
                    <Link
                      href="/programs"
                      className="font-bold text-bste-navy-800 hover:underline"
                    >
                      View Curricula →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
