export const mockRecords = [
  {
    id: "LR-2026-001284",
    documentName: "Khatian_Record_102.pdf",
    documentType: "Land Record (Khatian)",
    language: "Bengali / English",
    status: "Validated",
    confidence: 96,
    uploadedAt: "Today, 12:20 PM",
    pages: 3,
    fileSize: "4.2 MB",
    parcelId: "PCL-10284",
    validationScore: 92,
    officerAssigned: "Officer A. Pradhan",
    summary: "Complete ROR record for Singamari Mouza with confirmed cadastral match.",
    fields: {
      ownerName: {
        label: "Owner Name",
        value: "Kiran Subba",
        bengali: "রাহুল কুমার দাস",
        confidence: 96,
        status: "high",
        page: 1,
        rawText: "শ্রী রাহুল কুমার দাস (S/O স্বর্গীয় বঙ্কিম দাস)",
        bbox: { top: 27, left: 16, width: 38, height: 4.8 }
      },
      surveyNumber: {
        label: "Survey Number",
        value: "124/3",
        bengali: "দাগ নং ১২৪/৩",
        confidence: 92,
        status: "high",
        page: 1,
        rawText: "দাগ নং - ১২৪/৩ (Plot No 124/3)",
        bbox: { top: 35, left: 16, width: 26, height: 4.8 }
      },
      khasraNumber: {
        label: "Khasra Number",
        value: "KH-408",
        bengali: "খসড়া নং ৪০৮",
        confidence: 95,
        status: "high",
        page: 1,
        rawText: "খসড়া নং ৪০৮ / বন্দোবস্ত ১৯৮২",
        bbox: { top: 35, left: 52, width: 28, height: 4.8 }
      },
      khataNumber: {
        label: "Khata Number",
        value: "KT-89",
        bengali: "খতিয়ান নং ৮৯",
        confidence: 91,
        status: "high",
        page: 1,
        rawText: "রায়তি খতিয়ান নং ৮৯ (বালী সদর)",
        bbox: { top: 43, left: 16, width: 26, height: 4.8 }
      },
      area: {
        label: "Area (Acres)",
        value: "2.45 acres",
        bengali: "২.৪৫ একর",
        confidence: 84,
        status: "medium",
        page: 1,
        rawText: "মোট জমির পরিমাণ: ২.৪৫ একর (Two point four five acres)",
        bbox: { top: 43, left: 52, width: 32, height: 4.8 }
      },
      village: {
        label: "Village / Mouza",
        value: "Singamari",
        bengali: "মৌজা: বালী",
        confidence: 98,
        status: "high",
        page: 1,
        rawText: "মৌজা: বালী (J.L. No. 12, থান নম্বর ৪)",
        bbox: { top: 51, left: 16, width: 28, height: 4.8 }
      },
      tehsil: {
        label: "Tehsil / Block",
        value: "Darjeeling Sadar",
        bengali: "হাওড়া সদর",
        confidence: 94,
        status: "high",
        page: 1,
        rawText: "ব্লক / তহশিল: হাওড়া সদর মহকুমা",
        bbox: { top: 51, left: 52, width: 30, height: 4.8 }
      },
      district: {
        label: "District",
        value: "Darjeeling",
        bengali: "জেলা: হাওড়া",
        confidence: 99,
        status: "high",
        page: 1,
        rawText: "জেলা: হাওড়া, রাজ্য: পশ্চিমবঙ্গ",
        bbox: { top: 59, left: 16, width: 26, height: 4.8 }
      },
      landClassification: {
        label: "Land Classification",
        value: "Agricultural (Dhani)",
        bengali: "ধানী (কৃষি)",
        confidence: 93,
        status: "high",
        page: 1,
        rawText: "জমির প্রকৃতি / শ্রেণী: ধানী (একফসলি কৃষিজমি)",
        bbox: { top: 59, left: 52, width: 34, height: 4.8 }
      },
      mutationNumber: {
        label: "Mutation Number",
        value: "MUT-2024-819",
        bengali: "মিউটেশন ৮১৯/২৪",
        confidence: 61,
        status: "low",
        page: 1,
        rawText: "মিউটেশন কেস নং ৮১৯/২০২৪ (রেভিনিউ রেকর্ড আপডেট)",
        bbox: { top: 67, left: 16, width: 32, height: 4.8 }
      },
      registrationNumber: {
        label: "Registration Number",
        value: "REG-WB-1998-041",
        bengali: "দলিল ০৪১/৯৮",
        confidence: 89,
        status: "medium",
        page: 1,
        rawText: "রেজিস্ট্রিকৃত দলিল নং ০৪১ / বুক ১ / ভলিয়ম ১২",
        bbox: { top: 67, left: 52, width: 36, height: 4.8 }
      }
    },
    validationChecks: [
      { id: "v1", name: "Required Fields Completeness", status: "passed", detail: "All 11 mandatory administrative fields extracted with full values" },
      { id: "v2", name: "Duplicate Detection", status: "passed", detail: "No identical Survey/Khata combination in Darjeeling district records" },
      { id: "v3", name: "Area Consistency", status: "passed", detail: "Document area (2.45 acres) matches sum of sub-plots exactly" },
      { id: "v4", name: "Survey Number Format", status: "passed", detail: "Format 124/3 complies with West Bengal Land Reforms Act specifications" },
      { id: "v5", name: "Mutation Consistency", status: "warning", detail: "Low OCR confidence on mutation stamp (61%). Human confirmation recommended." },
      { id: "v6", name: "Record Metadata Integrity", status: "passed", detail: "Stamp seal dated 1998 with verifiable district registrar code" }
    ]
  },
  {
    id: "LR-2026-008421",
    documentName: "Mutation_Deed_8421.pdf",
    documentType: "Mutation Record",
    language: "Bengali / English",
    status: "Needs Review",
    confidence: 76,
    uploadedAt: "Yesterday, 04:15 PM",
    pages: 2,
    fileSize: "3.8 MB",
    parcelId: "PCL-10285",
    validationScore: 78,
    officerAssigned: "Officer R. Tamang",
    summary: "Area mismatch — refer WBLR Rule 15(3), send for field verification before RoR update.",
    fields: {
      ownerName: {
        label: "Owner Name",
        value: "Anjali Basnet",
        bengali: "প্রিয়া শর্মা",
        confidence: 91,
        status: "high",
        page: 1,
        rawText: "শ্রীমতী প্রিয়া শর্মা (W/O অজয় শর্মা)",
        bbox: { top: 27, left: 16, width: 34, height: 4.8 }
      },
      surveyNumber: {
        label: "Survey Number",
        value: "125/2",
        bengali: "দাগ নং ১২৫/২",
        confidence: 88,
        status: "medium",
        page: 1,
        rawText: "দাগ নং - ১২৫/২ (পশ্চিম অংশ)",
        bbox: { top: 35, left: 16, width: 24, height: 4.8 }
      },
      khasraNumber: {
        label: "Khasra Number",
        value: "KH-412",
        bengali: "খসড়া নং ৪১২",
        confidence: 89,
        status: "medium",
        page: 1,
        rawText: "খসড়া নং ৪১২ (হাল রেকর্ড)",
        bbox: { top: 35, left: 52, width: 26, height: 4.8 }
      },
      khataNumber: {
        label: "Khata Number",
        value: "KT-144",
        bengali: "খতিয়ান নং ১৪৪",
        confidence: 90,
        status: "high",
        page: 1,
        rawText: "খতিয়ান নং ১৪৪ (নতুন নামপত্তন)",
        bbox: { top: 43, left: 16, width: 26, height: 4.8 }
      },
      area: {
        label: "Area (Acres)",
        value: "2.45 acres",
        bengali: "২.৪৫ একর",
        confidence: 68,
        status: "low",
        page: 1,
        rawText: "জমির মাপ: ২.৪৫ একর [GIS calculates 2.61 acres]",
        bbox: { top: 43, left: 52, width: 30, height: 4.8 }
      },
      village: {
        label: "Village / Mouza",
        value: "Singamari",
        bengali: "মৌজা: বালী",
        confidence: 96,
        status: "high",
        page: 1,
        rawText: "মৌজা: বালী, ডাকঘর: বালী",
        bbox: { top: 51, left: 16, width: 25, height: 4.8 }
      },
      tehsil: {
        label: "Tehsil / Block",
        value: "Darjeeling Sadar",
        bengali: "হাওড়া সদর",
        confidence: 95,
        status: "high",
        page: 1,
        rawText: "তহশিল কার্যালয়: হাওড়া সদর",
        bbox: { top: 51, left: 52, width: 28, height: 4.8 }
      },
      district: {
        label: "District",
        value: "Darjeeling",
        bengali: "জেলা: হাওড়া",
        confidence: 98,
        status: "high",
        page: 1,
        rawText: "জেলা: হাওড়া",
        bbox: { top: 59, left: 16, width: 22, height: 4.8 }
      },
      landClassification: {
        label: "Land Classification",
        value: "Residential (Bastu)",
        bengali: "বাস্তু (গৃহভিটা)",
        confidence: 86,
        status: "medium",
        page: 1,
        rawText: "শ্রেণী: বাস্তু ভিটি",
        bbox: { top: 59, left: 52, width: 28, height: 4.8 }
      },
      mutationNumber: {
        label: "Mutation Number",
        value: "MUT-2025-302",
        bengali: "মিউটেশন ৩০২/২৫",
        confidence: 94,
        status: "high",
        page: 1,
        rawText: "মিউটেশন আদেশ নং ৩০২/২০২৫",
        bbox: { top: 67, left: 16, width: 30, height: 4.8 }
      },
      registrationNumber: {
        label: "Registration Number",
        value: "REG-WB-2022-771",
        bengali: "দলিল ৭৭১/২২",
        confidence: 91,
        status: "high",
        page: 1,
        rawText: "রেজিস্ট্রেশন নম্বর ৭৭১/২০২২",
        bbox: { top: 67, left: 52, width: 32, height: 4.8 }
      }
    },
    validationChecks: [
      { id: "v1", name: "Required Fields Completeness", status: "passed", detail: "All mandatory fields populated" },
      { id: "v2", name: "Duplicate Detection", status: "passed", detail: "No duplicate records detected" },
      { id: "v3", name: "Area Consistency", status: "critical", detail: "Area mismatch: Document states 2.45 acres, but GIS Cadastral parcel calculates 2.61 acres (Difference: 0.16 acres)" },
      { id: "v4", name: "Survey Number Format", status: "passed", detail: "Format 125/2 conforms to standard" },
      { id: "v5", name: "Mutation Consistency", status: "passed", detail: "Mutation order matches revenue register" }
    ]
  },
  {
    id: "LR-2026-004319",
    documentName: "Porcha_Survey_88.pdf",
    documentType: "Land Record (Porcha)",
    language: "Bengali",
    status: "Needs Review",
    confidence: 68,
    uploadedAt: "08 Sep 2026",
    pages: 4,
    fileSize: "6.1 MB",
    parcelId: "PCL-10286",
    validationScore: 64,
    officerAssigned: "Officer K. Mangar",
    summary: "Suspected duplicate record similarity with LR-2026-008421 and degraded handwriting OCR.",
    fields: {
      ownerName: {
        label: "Owner Name",
        value: "Sanjay Chhetri",
        bengali: "অর্জুন সিংহ",
        confidence: 64,
        status: "low",
        page: 1,
        rawText: "অর্জুন সিংহ (পিতা হরিশঙ্কর সিংহ)",
        bbox: { top: 27, left: 16, width: 32, height: 4.8 }
      },
      surveyNumber: {
        label: "Survey Number",
        value: "126/1",
        bengali: "দাগ নং ১২৬/১",
        confidence: 72,
        status: "medium",
        page: 1,
        rawText: "দাগ নং ১২৬/১",
        bbox: { top: 35, left: 16, width: 22, height: 4.8 }
      },
      khasraNumber: {
        label: "Khasra Number",
        value: "KH-389",
        bengali: "খসড়া ৩৮৯",
        confidence: 82,
        status: "medium",
        page: 1,
        rawText: "খসড়া ৩৮৯",
        bbox: { top: 35, left: 52, width: 20, height: 4.8 }
      },
      khataNumber: {
        label: "Khata Number",
        value: "KT-51",
        bengali: "খতিয়ান ৫১",
        confidence: 75,
        status: "medium",
        page: 1,
        rawText: "খতিয়ান ৫১",
        bbox: { top: 43, left: 16, width: 20, height: 4.8 }
      },
      area: {
        label: "Area (Acres)",
        value: "1.80 acres",
        bengali: "১.৮০ একর",
        confidence: 62,
        status: "low",
        page: 1,
        rawText: "১.৮০ একর [কালি ছড়ানো পাঠোদ্ধার]",
        bbox: { top: 43, left: 52, width: 25, height: 4.8 }
      },
      village: {
        label: "Village / Mouza",
        value: "Singamari",
        bengali: "বালী",
        confidence: 90,
        status: "high",
        page: 1,
        rawText: "মৌজা বালী",
        bbox: { top: 51, left: 16, width: 20, height: 4.8 }
      },
      tehsil: {
        label: "Tehsil / Block",
        value: "Darjeeling Sadar",
        bengali: "হাওড়া সদর",
        confidence: 92,
        status: "high",
        page: 1,
        rawText: "হাওড়া সদর",
        bbox: { top: 51, left: 52, width: 24, height: 4.8 }
      },
      district: {
        label: "District",
        value: "Darjeeling",
        bengali: "হাওড়া",
        confidence: 96,
        status: "high",
        page: 1,
        rawText: "হাওড়া",
        bbox: { top: 59, left: 16, width: 20, height: 4.8 }
      },
      landClassification: {
        label: "Land Classification",
        value: "Commercial (Dokan)",
        bengali: "বাণিজ্যিক",
        confidence: 65,
        status: "low",
        page: 1,
        rawText: "দোকান ও ব্যবসা",
        bbox: { top: 59, left: 52, width: 26, height: 4.8 }
      },
      mutationNumber: {
        label: "Mutation Number",
        value: "MUT-2023-112",
        bengali: "মিউটেশন ১১২",
        confidence: 58,
        status: "low",
        page: 1,
        rawText: "মিউটেশন ১১২/২০২৩",
        bbox: { top: 67, left: 16, width: 28, height: 4.8 }
      },
      registrationNumber: {
        label: "Registration Number",
        value: "REG-WB-2005-901",
        bengali: "দলিল ৯০১/০৫",
        confidence: 70,
        status: "medium",
        page: 1,
        rawText: "দলিল ৯০১/২০০৫",
        bbox: { top: 67, left: 52, width: 28, height: 4.8 }
      }
    },
    validationChecks: [
      { id: "v1", name: "Required Fields Completeness", status: "passed", detail: "All required fields identified" },
      { id: "v2", name: "Duplicate Detection", status: "critical", detail: "High similarity (93%) detected with existing record LR-2026-008421" },
      { id: "v3", name: "Area Consistency", status: "warning", detail: "Faded ink on area cell. OCR confidence 62% requires manual verification." },
      { id: "v4", name: "Survey Number Format", status: "passed", detail: "Valid format" },
      { id: "v5", name: "Mutation Consistency", status: "warning", detail: "Mutation date precedes registration date in extracted metadata." }
    ]
  },
  {
    id: "LR-2026-009102",
    documentName: "Cadastral_ROR_214.pdf",
    documentType: "Land Record",
    language: "Hindi / English",
    status: "Validated",
    confidence: 97,
    uploadedAt: "07 Sep 2026",
    pages: 2,
    fileSize: "2.9 MB",
    parcelId: "PCL-10287",
    validationScore: 98,
    officerAssigned: "Officer A. Pradhan",
    summary: "Clear print modern computerized Jamabandi/ROR extract, 100% field compliance.",
    fields: {
      ownerName: { label: "Owner Name", value: "Prakash Subba", confidence: 99, status: "high", page: 1, bbox: { top: 27, left: 16, width: 28, height: 4.8 }, rawText: "सौरव रॉय (Prakash Subba, S/O Karma Lama)" },
      surveyNumber: { label: "Survey Number", value: "128/4", confidence: 98, status: "high", page: 1, bbox: { top: 35, left: 16, width: 22, height: 4.8 }, rawText: "खसरा संख्या / Plot 128/4" },
      khasraNumber: { label: "Khasra Number", value: "KH-510", confidence: 97, status: "high", page: 1, bbox: { top: 35, left: 52, width: 22, height: 4.8 }, rawText: "खसरा 510" },
      khataNumber: { label: "Khata Number", value: "KT-312", confidence: 96, status: "high", page: 1, bbox: { top: 43, left: 16, width: 22, height: 4.8 }, rawText: "खाता संख्या 312" },
      area: { label: "Area (Acres)", value: "3.12 acres", confidence: 96, status: "high", page: 1, bbox: { top: 43, left: 52, width: 25, height: 4.8 }, rawText: "क्षेत्रफल: 3.12 एकड़ (3.12 Acres)" },
      village: { label: "Village / Mouza", value: "Singamari", confidence: 99, status: "high", page: 1, bbox: { top: 51, left: 16, width: 22, height: 4.8 }, rawText: "ग्राम / मौजा: Singamari" },
      tehsil: { label: "Tehsil / Block", value: "Darjeeling Sadar", confidence: 97, status: "high", page: 1, bbox: { top: 51, left: 52, width: 26, height: 4.8 }, rawText: "तहसील: Darjeeling Sadar" },
      district: { label: "District", value: "Darjeeling", confidence: 99, status: "high", page: 1, bbox: { top: 59, left: 16, width: 22, height: 4.8 }, rawText: "जिला: Darjeeling" },
      landClassification: { label: "Land Classification", value: "Agricultural (Dofasli)", confidence: 95, status: "high", page: 1, bbox: { top: 59, left: 52, width: 30, height: 4.8 }, rawText: "भूमि उपयोग: दोफसली कृषि" },
      mutationNumber: { label: "Mutation Number", value: "MUT-2025-994", confidence: 94, status: "high", page: 1, bbox: { top: 67, left: 16, width: 28, height: 4.8 }, rawText: "नामांतरण आदेश 994/2025" },
      registrationNumber: { label: "Registration Number", value: "REG-WB-2024-118", confidence: 96, status: "high", page: 1, bbox: { top: 67, left: 52, width: 30, height: 4.8 }, rawText: "पंजीकरण संख्या 118/2024" }
    },
    validationChecks: [
      { id: "v1", name: "Required Fields Completeness", status: "passed", detail: "All fields present" },
      { id: "v2", name: "Duplicate Detection", status: "passed", detail: "Zero conflicts" },
      { id: "v3", name: "Area Consistency", status: "passed", detail: "GIS polygon confirms 3.12 acres exactly" },
      { id: "v4", name: "Survey Number Format", status: "passed", detail: "Format valid" },
      { id: "v5", name: "Mutation Consistency", status: "passed", detail: "Verified with revenue registry" }
    ]
  },
  {
    id: "LR-2026-005517",
    documentName: "Deed_Conveyance_74.pdf",
    documentType: "Registration Record",
    language: "English / Bengali",
    status: "Rejected",
    confidence: 42,
    uploadedAt: "05 Sep 2026",
    pages: 5,
    fileSize: "8.4 MB",
    parcelId: "PCL-10288",
    validationScore: 38,
    officerAssigned: "Officer R. Tamang",
    summary: "Severe document water damage; key survey parcel number and area stamps unreadable.",
    fields: {
      ownerName: { label: "Owner Name", value: "Sita Tamang", confidence: 52, status: "low", page: 1, bbox: { top: 27, left: 16, width: 28, height: 4.8 }, rawText: "Sita Tamang (...unclear patronymic...)" },
      surveyNumber: { label: "Survey Number", value: "129/?", confidence: 38, status: "low", page: 1, bbox: { top: 35, left: 16, width: 20, height: 4.8 }, rawText: "Plot 129/[Torn edge]" },
      khasraNumber: { label: "Khasra Number", value: "KH-???", confidence: 30, status: "low", page: 1, bbox: { top: 35, left: 52, width: 20, height: 4.8 }, rawText: "[Torn edge]" },
      khataNumber: { label: "Khata Number", value: "KT-90", confidence: 65, status: "low", page: 1, bbox: { top: 43, left: 16, width: 20, height: 4.8 }, rawText: "Khata No 90" },
      area: { label: "Area (Acres)", value: "Unreadable", confidence: 25, status: "low", page: 1, bbox: { top: 43, left: 52, width: 24, height: 4.8 }, rawText: "[Water stained]" },
      village: { label: "Village / Mouza", value: "Singamari", confidence: 85, status: "medium", page: 1, bbox: { top: 51, left: 16, width: 22, height: 4.8 }, rawText: "Mouza Singamari" },
      tehsil: { label: "Tehsil / Block", value: "Darjeeling Sadar", confidence: 80, status: "medium", page: 1, bbox: { top: 51, left: 52, width: 24, height: 4.8 }, rawText: "Darjeeling Sadar" },
      district: { label: "District", value: "Darjeeling", confidence: 92, status: "high", page: 1, bbox: { top: 59, left: 16, width: 20, height: 4.8 }, rawText: "Darjeeling" },
      landClassification: { label: "Land Classification", value: "Unspecified", confidence: 40, status: "low", page: 1, bbox: { top: 59, left: 52, width: 24, height: 4.8 }, rawText: "N/A" },
      mutationNumber: { label: "Mutation Number", value: "None", confidence: 30, status: "low", page: 1, bbox: { top: 67, left: 16, width: 22, height: 4.8 }, rawText: "N/A" },
      registrationNumber: { label: "Registration Number", value: "REG-WB-1974-???", confidence: 45, status: "low", page: 1, bbox: { top: 67, left: 52, width: 28, height: 4.8 }, rawText: "Deed 74/1974 [Faded]" }
    },
    validationChecks: [
      { id: "v1", name: "Required Fields Completeness", status: "critical", detail: "Survey Number and Area could not be extracted due to physical tears." },
      { id: "v2", name: "Duplicate Detection", status: "passed", detail: "No conflict" },
      { id: "v3", name: "Area Consistency", status: "critical", detail: "Area value missing" },
      { id: "v4", name: "Survey Number Format", status: "critical", detail: "Malformed survey identifier" }
    ]
  },
  {
    id: "LR-2026-006281",
    documentName: "Survey_Field_Book_05.pdf",
    documentType: "Cadastral Map Extract",
    language: "English",
    status: "Processing",
    confidence: 88,
    uploadedAt: "10 mins ago",
    pages: 1,
    fileSize: "5.5 MB",
    parcelId: "PCL-10289",
    validationScore: 82,
    officerAssigned: "System Pipeline",
    summary: "Automated OCR pipeline active. Field bounding boxes extracted, pending GIS cross-check.",
    fields: {
      ownerName: { label: "Owner Name", value: "Lokesh Gurung", confidence: 92, status: "high", page: 1, bbox: { top: 27, left: 16, width: 30, height: 4.8 }, rawText: "Lokesh Gurung" },
      surveyNumber: { label: "Survey Number", value: "131/1", confidence: 89, status: "medium", page: 1, bbox: { top: 35, left: 16, width: 20, height: 4.8 }, rawText: "Survey 131/1" },
      khasraNumber: { label: "Khasra Number", value: "KH-619", confidence: 91, status: "high", page: 1, bbox: { top: 35, left: 52, width: 20, height: 4.8 }, rawText: "Khasra 619" },
      khataNumber: { label: "Khata Number", value: "KT-202", confidence: 87, status: "medium", page: 1, bbox: { top: 43, left: 16, width: 20, height: 4.8 }, rawText: "Khata 202" },
      area: { label: "Area (Acres)", value: "1.95 acres", confidence: 85, status: "medium", page: 1, bbox: { top: 43, left: 52, width: 22, height: 4.8 }, rawText: "1.95 Acres" },
      village: { label: "Village / Mouza", value: "Singamari", confidence: 94, status: "high", page: 1, bbox: { top: 51, left: 16, width: 20, height: 4.8 }, rawText: "Singamari" },
      tehsil: { label: "Tehsil / Block", value: "Darjeeling Sadar", confidence: 91, status: "high", page: 1, bbox: { top: 51, left: 52, width: 24, height: 4.8 }, rawText: "Darjeeling Sadar" },
      district: { label: "District", value: "Darjeeling", confidence: 98, status: "high", page: 1, bbox: { top: 59, left: 16, width: 20, height: 4.8 }, rawText: "Darjeeling" },
      landClassification: { label: "Land Classification", value: "Commercial", confidence: 84, status: "medium", page: 1, bbox: { top: 59, left: 52, width: 24, height: 4.8 }, rawText: "Commercial Zone" },
      mutationNumber: { label: "Mutation Number", value: "MUT-2025-104", confidence: 88, status: "medium", page: 1, bbox: { top: 67, left: 16, width: 26, height: 4.8 }, rawText: "MUT-2025-104" },
      registrationNumber: { label: "Registration Number", value: "REG-WB-2021-554", confidence: 90, status: "high", page: 1, bbox: { top: 67, left: 52, width: 28, height: 4.8 }, rawText: "REG-WB-2021-554" }
    },
    validationChecks: [
      { id: "v1", name: "Required Fields Completeness", status: "passed", detail: "All basic fields extracted" },
      { id: "v2", name: "Duplicate Detection", status: "passed", detail: "No conflict" },
      { id: "v3", name: "Area Consistency", status: "passed", detail: "Matches standard cadastral parcel" }
    ]
  }
];

export const sampleUploadPresets = [
  {
    name: "Sample West Bengal Khatian #102/3 (Singamari Mouza)",
    file: "Khatian_Record_102.pdf",
    type: "Land Record (Khatian)",
    language: "Bengali",
    size: "4.2 MB",
    pages: 3,
    description: "Multi-page historical revenue porcha with seal stamps, Bengali script, and sub-plot breakdowns."
  },
  {
    name: "Sample Mutation Deed #8421 (Area Mismatch Test)",
    file: "Mutation_Deed_8421.pdf",
    type: "Mutation Record",
    language: "Bengali / English",
    size: "3.8 MB",
    pages: 2,
    description: "Contains area mismatch (2.45 acres vs GIS 2.61 acres) to test smart validation & cross-check alerts."
  },
  {
    name: "Sample Faded Porcha #88 (Duplicate Suspect)",
    file: "Porcha_Survey_88.pdf",
    type: "Land Record (Porcha)",
    language: "Bengali",
    size: "6.1 MB",
    pages: 4,
    description: "Handwritten historical document with ink fading to trigger human verification queue."
  }
];
