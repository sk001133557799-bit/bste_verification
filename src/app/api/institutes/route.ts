import { NextResponse } from "next/server";

export async function GET() {
  const institutes = [
    {
      id: "inst-1",
      code: "BSTE-INST-001",
      name: "Islamabad College of Technology (ICT)",
      type: "Government Polytechnic Institute",
      district: "Islamabad (Sector H-9)",
      address: "Sector H-9/4, Islamabad Capital Territory",
    },
    {
      id: "inst-2",
      code: "BSTE-INST-002",
      name: "Govt Polytechnic Institute for Women",
      type: "Government Technical Institute",
      district: "Islamabad (Sector H-8)",
      address: "Street 7, Sector H-8/1, Islamabad",
    },
    {
      id: "inst-3",
      code: "BSTE-INST-003",
      name: "Federal Institute of Science & Technology",
      type: "Autonomous Board Affiliate",
      district: "Islamabad (Blue Area)",
      address: "Jinnah Avenue, Blue Area, Islamabad",
    },
    {
      id: "inst-4",
      code: "BSTE-INST-004",
      name: "Rawalpindi Institute of Technology",
      type: "Affiliated Regional College",
      district: "Rawalpindi",
      address: "6th Road, Murree Road, Rawalpindi",
    },
  ];

  return NextResponse.json({ success: true, data: institutes });
}
