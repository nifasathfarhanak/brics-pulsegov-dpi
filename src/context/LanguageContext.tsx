import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { BRICS_33_LANGUAGES, BRICSLanguageInfo } from '../data/bricsData';
import { Translations, ENGLISH_BASE_TRANSLATIONS, FULL_TRANSLATIONS_DATABASE } from '../data/translations';

export type { Translations };

// Complete 33 Languages Dictionary
const FULL_33_TRANSLATIONS: Record<string, Partial<Translations>> = {
  en: {
    portalTitle: 'BRICS PulseGov DPI',
    portalSubtitle: 'AI Digital Public Infrastructure & Citizen Governance',
    raiseComplaint: 'Raise a Complaint',
    gisHotspots: 'GIS Hotspots',
    citizenVoice: 'Citizen Grievance Feed',
    aiDprStudio: 'AI DPR & Gantt Studio',
    geminiSovereignHub: 'Gemini Sovereign Intelligence Hub',
    geminiVoiceAdvisor: 'Gemini Sovereign Voice Agent',
    ministerialCopilot: 'Gemini Sovereign Intelligence Hub',
    liveCrisisDashboard: 'Live Ministerial Crisis Dashboard',
    dashboard: 'Dashboard',
    login: 'Login',
    signUp: 'Sign Up',
    allCountries: '🌍 All 10 BRICS Nations',
    selectCountry: 'Select Country',
    selectRegion: 'Select Region / State / Territory',
    complaintTitle: 'Grievance / Infrastructure Issue Title',
    complaintDescription: 'Describe the infrastructure breakdown or community need...',
    category: 'Infrastructure Sector',
    urgency: 'Urgency Priority',
    submitComplaint: 'Submit Sovereign Grievance',
    voiceRecording: 'Voice Memo Intake',
    uploadPhoto: 'Attach Photographic Evidence',
    aiAnalyzing: 'Gemini AI is analyzing and classifying...',
    verificationToken: 'Sovereign Verification Token',
    assignedDept: 'Assigned Government Directorate',
    reassuranceMsg: 'Citizen Reassurance Broadcast',
    crossBorderPicks: 'Gemini Cross-Border AI Picks',
    zeroDebtGuarantee: '100% Zero-Debt Open Source DPG',
    ministerOfExternalAffairs: 'Minister of External Affairs / Diplomatic Advisor',
    backToPrevious: 'Back to Previous Overview',
    grievancesCount: 'Citizen Grievances',
    hotspotsCount: 'GIS Hotspots',
    switchLanguage: 'Language (33 BRICS Languages)',
    waterSanitation: 'Water & Sanitation',
    energyMicrogrids: 'Energy & Microgrids',
    transportConnectivity: 'Transport & Connectivity',
    healthInfrastructure: 'Health Infrastructure',
    digitalPublicInfrastructure: 'Digital Public Infrastructure',
    agriculturalIrrigation: 'Agricultural & Irrigation',
    educationSanitation: 'Education & Sanitation',
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    speakText: 'Listen in Gemini AI Voice',
    geminiAgentActive: 'Gemini AI Regional Sentinel Active',
    emergencyEscalation: 'Emergency Escalation',
    duplicateBlocked: 'Duplicate Complaint Blocked',
    policyImpact: 'Policy Impact Simulation',
    validityFilter: 'Validity Filter',
  },
  hi: {
    portalTitle: 'ब्रिक्स पल्सगव डीपीआई',
    portalSubtitle: 'एआई डिजिटल सार्वजनिक अवसंरचना एवं नागरिक शासन',
    raiseComplaint: 'शिकायत दर्ज करें',
    gisHotspots: 'भू-स्थानिक हॉटस्पॉट',
    citizenVoice: 'नागरिक शिकायत मंच',
    aiDprStudio: 'एआई डीपीआर व गैंट स्टूडियो',
    geminiSovereignHub: 'जेमिनी सॉवरेन इंटेलिजेंस हब',
    geminiVoiceAdvisor: 'जेमिनी सॉवरेन वॉयस एजेंट',
    ministerialCopilot: 'जेमिनी सॉवरेन इंटेलिजेंस हब',
    dashboard: 'डैशबोर्ड',
    login: 'लॉग इन करें',
    signUp: 'पंजीकरण करें',
    allCountries: '🌍 सभी 10 ब्रिक्स राष्ट्र',
    selectCountry: 'देश चुनें',
    selectRegion: 'राज्य / केंद्र शासित प्रदेश चुनें',
    complaintTitle: 'शिकायत / बुनियादी ढांचा समस्या शीर्षक',
    complaintDescription: 'समस्या का विस्तृत विवरण यहाँ लिखें...',
    category: 'अवसंरचना श्रेणी',
    urgency: 'आपातकालीन प्राथमिकता',
    submitComplaint: 'शिकायत दर्ज करें',
    voiceRecording: 'आवाज द्वारा शिकायत',
    uploadPhoto: 'फोटो साक्ष्य अपलोड करें',
    aiAnalyzing: 'जेमिनी एआई विश्लेषण व वर्गीकरण कर रहा है...',
    verificationToken: 'संप्रभु सत्यापन टोकन',
    assignedDept: 'आवंटित सरकारी विभाग',
    reassuranceMsg: 'नागरिक आश्वासन संदेश',
    crossBorderPicks: 'जेमिनी क्रॉस-बॉर्डर एआई चयन',
    zeroDebtGuarantee: '100% शून्य-ऋण ओपन सोर्स डीपीजी',
    ministerOfExternalAffairs: 'विदेश मंत्री / राजनयिक सलाहकार',
    backToPrevious: 'पिछले पृष्ठ पर वापस जाएँ',
    grievancesCount: 'नागरिक शिकायतें',
    hotspotsCount: 'जीआईएस हॉटस्पॉट',
    switchLanguage: 'भाषा चुनें (33 ब्रिक्स भाषाएँ)',
    waterSanitation: 'पेयजल एवं स्वच्छता',
    energyMicrogrids: 'ऊर्जा व सोलर माइक्रोग्रिड',
    transportConnectivity: 'सड़क व परिवहन संपर्क',
    healthInfrastructure: 'स्वास्थ्य अवसंरचना',
    digitalPublicInfrastructure: 'डिजिटल पब्लिक इन्फ्रास्ट्रक्चर',
    agriculturalIrrigation: 'कृषि व सिंचाई नहर',
    educationSanitation: 'शिक्षा व स्कूल स्वच्छता',
    critical: 'अति-गंभीर',
    high: 'उच्च प्राथमिकता',
    medium: 'मध्यम',
    low: 'सामान्य',
    speakText: 'जेमिनी एआई आवाज में सुनें',
    geminiAgentActive: 'जेमिनी एआई क्षेत्रीय प्रहरी सक्रिय',
    emergencyEscalation: 'आपातकालीन उच्चीकरण',
    duplicateBlocked: 'डुप्लिकेट शिकायत रोकी गई',
    policyImpact: 'नीति प्रभाव सिमुलेशन',
    validityFilter: 'वैधता फ़िल्टर',
  },
  ta: {
    portalTitle: 'பிரிக்ஸ் பல்ஸ்கவ் டிபிஐ',
    portalSubtitle: 'செயற்கை நுண்ணறிவு டிஜிட்டல் பொதுக் கட்டமைப்பு மற்றும் குடிமக்கள் ஆட்சி',
    raiseComplaint: 'புகார் பதிவு செய்க',
    gisHotspots: 'ஜிஐஎஸ் வரைபட மையங்கள்',
    citizenVoice: 'குடிமக்கள் குறைகள் தளம்',
    aiDprStudio: 'ஏஐ திட்ட அறிக்கை & கேண்ட் ஸ்டுடியோ',
    geminiSovereignHub: 'ஜெமினி இறையாண்மை நுண்ணறிவு மையம்',
    geminiVoiceAdvisor: 'ஜெமினி இறையாண்மை குரல் முகவர்',
    ministerialCopilot: 'ஜெமினி இறையாண்மை நுண்ணறிவு மையம்',
    dashboard: 'டாஷ்போர்டு',
    login: 'உள்நுழைக',
    signUp: 'பதிவு செய்க',
    allCountries: '🌍 அனைத்து 10 பிரிக்ஸ் நாடுகள்',
    selectCountry: 'நாட்டைத் தேர்ந்தெடுக்கவும்',
    selectRegion: 'மாநிலம் / பகுதியைத் தேர்ந்தெடுக்கவும்',
    complaintTitle: 'கட்டமைப்புப் புகார் தலைப்பு',
    complaintDescription: 'பிரச்சனையை விரிவாக விவரிக்கவும்...',
    category: 'கட்டமைப்புப் பிரிவு',
    urgency: 'அவசர நிலை முன்னுரிமை',
    submitComplaint: 'அதிகாரப்பூர்வ புகாரை சமர்ப்பிக்கவும்',
    voiceRecording: 'குரல் பதிவு மூலம் புகார்',
    uploadPhoto: 'புகைப்படச் சான்று இணைக்கவும்',
    aiAnalyzing: 'ஜெமினி ஏஐ ஆய்வு செய்து வகைப்படுத்துகிறது...',
    verificationToken: 'இறைமை சரிபார்ப்புக் குறியீடு',
    assignedDept: 'ஒதுக்கப்பட்ட அரசுத் துறை',
    reassuranceMsg: 'குடிமக்கள் உறுதிமொழி அறிக்கை',
    crossBorderPicks: 'ஜெமினி எல்லைகடந்த ஏஐ தேர்வுகள்',
    zeroDebtGuarantee: '100% கடன் இல்லா திறந்த மூலப் பொதுப் பொருள்',
    ministerOfExternalAffairs: 'வெளியுறவு அமைச்சர் / தூதரக ஆலோசகர்',
    backToPrevious: 'முந்தைய பக்கத்திற்குத் திரும்புக',
    grievancesCount: 'குடிமக்கள் புகார்கள்',
    hotspotsCount: 'ஜிஐஎஸ் பகுதிகள்',
    switchLanguage: 'மொழி (33 பிரிக்ஸ் மொழிகள்)',
    waterSanitation: 'குடிநீர் & சுகாதாரம்',
    energyMicrogrids: 'ஆற்றல் & சூரிய மைக்ரோகிரிட்',
    transportConnectivity: 'போக்குவரத்து & சாலை இணைப்பு',
    healthInfrastructure: 'சுகாதாரக் கட்டமைப்பு',
    digitalPublicInfrastructure: 'டிஜிட்டல் பொதுக் கட்டமைப்பு (DPI)',
    agriculturalIrrigation: 'விவசாயம் & பாசனம்',
    educationSanitation: 'கல்வி & சுகாதாரம்',
    critical: 'மிக அவசரம் (Critical)',
    high: 'உயர் முன்னுரிமை',
    medium: 'நடுத்தரம்',
    low: 'குறைந்த முன்னுரிமை',
    speakText: 'ஜெமினி ஏஐ குரலில் கேட்கவும்',
    geminiAgentActive: 'ஜெமினி ஏஐ பிராந்திய சென்டினல் செயல்படுகிறது',
    emergencyEscalation: 'அவசர நிலை தீவிரப்படுத்தல்',
    duplicateBlocked: 'இந்த புகார் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது',
    policyImpact: 'கொள்கை தாக்க மதிப்பீடு',
    validityFilter: 'செல்லுபடி வடிகட்டி',
  },
  te: {
    portalTitle: 'బ్రిక్స్ పల్స్‌గవ్ డిపిఐ',
    portalSubtitle: 'ఏఐ డిజిటల్ పబ్లిక్ ఇన్‌ఫ్రాస్ట్రక్చర్ & పౌర పాలన',
    raiseComplaint: 'ఫిర్యాదు నమోదు చేయండి',
    gisHotspots: 'జిఐఎస్ హాట్‌స్పాట్లు',
    citizenVoice: 'పౌర సమస్యల వేదిక',
    aiDprStudio: 'ఏఐ ప్రాజెక్ట్ రిపోర్ట్ స్టూడియో',
    ministerialCopilot: 'మంత్రుల ఏఐ సలహాదారు',
    dashboard: 'డాష్‌బోర్డ్',
    login: 'లాగిన్',
    signUp: 'నమోదు చేసుకోండి',
    allCountries: '🌍 మొత్తం 10 బ్రిక్స్ దేశాలు',
    selectCountry: 'దేశాన్ని ఎంచుకోండి',
    selectRegion: 'రాష్ట్రం / ప్రాంతాన్ని ఎంచుకోండి',
    complaintTitle: 'ఫిర్యాదు శీర్షిక',
    complaintDescription: 'సమస్యను వివరంగా వివరించండి...',
    category: 'ఇన్‌ఫ్రాస్ట్రక్చర్ విభాగం',
    urgency: 'అత్యవసర ప్రాధాన్యత',
    submitComplaint: 'ఫిర్యాదును సమర్పించండి',
    voiceRecording: 'వాయిస్ మెమో రికార్డింగ్',
    uploadPhoto: 'ఫోటో సాక్ష్యం అప్‌లోడ్ చేయండి',
    aiAnalyzing: 'జెమిని ఏఐ విశ్లేషిస్తోంది...',
    verificationToken: 'ధృవీకరణ టోకెన్',
    assignedDept: 'కేటాయించిన ప్రభుత్వ శాఖ',
    reassuranceMsg: 'పౌరులకు అధికారిక సందేశం',
    crossBorderPicks: 'జెమిని సరిహద్దు ఏఐ ఎంపికలు',
    zeroDebtGuarantee: '100% జీరో-డెట్ ఓపెన్ సోర్స్ డిపిజి',
    ministerOfExternalAffairs: 'విదేశాంగ మంత్రి / దౌత్య సలహాదారు',
    backToPrevious: 'మునుపటి పేజీకి తిరిగి వెళ్లండి',
    grievancesCount: 'పౌర ఫిర్యాదులు',
    hotspotsCount: 'జిఐఎస్ ప్రాంతాలు',
    switchLanguage: 'భాష (33 బ్రిక్స్ భాషలు)',
    waterSanitation: 'తాగునీరు & పారిశుధ్యం',
    energyMicrogrids: 'విద్యుత్ & సౌర మైక్రోగ్రిడ్లు',
    transportConnectivity: 'రవాణా & రోడ్ల కనెక్టివిటీ',
    healthInfrastructure: 'ఆరోగ్య మౌలిక సదుపాయాలు',
    digitalPublicInfrastructure: 'డిజిటల్ పబ్లిక్ ఇన్‌ఫ్రాస్ట్రక్చర్',
    agriculturalIrrigation: 'వ్యవసాయం & సాగునీరు',
    educationSanitation: 'విద్య & పాఠశాల పారిశుధ్యం',
    critical: 'అత్యంత క్లిష్టమైనది',
    high: 'అధికం',
    medium: 'మధ్యస్థం',
    low: 'సాధారణం',
    speakText: 'జెమిని ఏఐ వాయిస్‌లో వినండి',
    geminiAgentActive: 'జెమిని ఏఐ ప్రాంతీయ సెంటీనెల్ సక్రియంగా ఉంది',
  },
  mr: {
    portalTitle: 'ब्रिक्स पल्सगव्ह डीपीआय',
    portalSubtitle: 'एआय डिजिटल सार्वजनिक पायाभूत सुविधा आणि नागरी प्रशासन',
    raiseComplaint: 'तक्रार नोंदवा',
    gisHotspots: 'जीआयएस हॉटस्पॉट्स',
    citizenVoice: 'नागरी तक्रार मंच',
    aiDprStudio: 'एआय प्रकल्प अहवाल स्टुडिओ',
    ministerialCopilot: 'मंत्रालयीन एआय सल्लागार',
    dashboard: 'डॅशबोर्ड',
    login: 'लॉगिन',
    signUp: 'साइन अप',
    allCountries: '🌍 सर्व १० ब्रिक्स देश',
    selectCountry: 'देश निवडा',
    selectRegion: 'राज्य / प्रदेश निवडा',
    complaintTitle: 'पायाभूत सुविधा तक्रार शीर्षक',
    complaintDescription: 'तक्रारीचे सविस्तर वर्णन करा...',
    category: 'पायाभूत सुविधा क्षेत्र',
    urgency: 'तातडीची प्राथमिकता',
    submitComplaint: 'तक्रार सबमिट करा',
    voiceRecording: 'व्हॉइस रेकॉर्डिंग',
    uploadPhoto: 'फोटो पुरावा जोडा',
    aiAnalyzing: 'जेमिनी एआय विश्लेषण करत आहे...',
    verificationToken: 'सत्यापन टोकन',
    assignedDept: 'नियुक्त सरकारी विभाग',
    reassuranceMsg: 'नागरिक आश्वासन संदेश',
    crossBorderPicks: 'जेमिनी क्रॉस-बॉर्डर एआय निवड',
    zeroDebtGuarantee: '१००% शून्य-कर्ज ओपन सोर्स डीपीजी',
    ministerOfExternalAffairs: 'परराष्ट्र व्यवहार मंत्री',
    backToPrevious: 'मागील पृष्ठावर जा',
    grievancesCount: 'नागरी तक्रारी',
    hotspotsCount: 'जीआयएस हॉटस्पॉट्स',
    switchLanguage: 'भाषा (३३ ब्रिक्स भाषा)',
    waterSanitation: 'पिण्याचे पाणी आणि स्वच्छता',
    energyMicrogrids: 'ऊर्जा आणि सौर मायक्रोग्रिड',
    transportConnectivity: 'वाहतूक आणि रस्ते संपर्क',
    healthInfrastructure: 'आरोग्य पायाभूत सुविधा',
    digitalPublicInfrastructure: 'डिजिटल सार्वजनिक पायाभूत सुविधा',
    agriculturalIrrigation: 'शेती आणि सिंचन कालवे',
    educationSanitation: 'शिक्षण आणि स्वच्छता',
    critical: 'अति-गंभीर',
    high: 'उच्च',
    medium: 'मध्यम',
    low: 'कमी',
    speakText: 'जेमिनी एआय आवाजात ऐका',
    geminiAgentActive: 'जेमिनी एआय प्रादेशिक संरक्षक सक्रिय',
  },
  bn: {
    portalTitle: 'ব্রিকস পালসগভ ডিপিআই',
    portalSubtitle: 'এআই ডিজিটাল পাবলিক অবকাঠামো ও নাগরিক শাসন',
    raiseComplaint: 'অভিযোগ দায়ের করুন',
    gisHotspots: 'জিআইএস হটস্পট',
    citizenVoice: 'নাগরিক অভিযোগ কেন্দ্র',
    aiDprStudio: 'এআই ডিপিআর ও প্রকল্প স্টুডিও',
    ministerialCopilot: 'মন্ত্রী পর্যায়ের এআই সহকারী',
    dashboard: 'ড্যাশবোর্ড',
    login: 'লগইন',
    signUp: 'নিবন্ধন',
    allCountries: '🌍 সমস্ত ১০টি ব্রিকস রাষ্ট্র',
    selectCountry: 'দেশ নির্বাচন করুন',
    selectRegion: 'রাজ্য / অঞ্চল নির্বাচন করুন',
    complaintTitle: 'অবকাঠামোগত অভিযোগের শিরোনাম',
    complaintDescription: 'সমস্যার বিস্তারিত বিবরণ দিন...',
    category: 'অবকাঠামো খাত',
    urgency: 'জরুরি মাত্রা',
    submitComplaint: 'অভিযোগ জমা দিন',
    voiceRecording: 'ভয়েস রেকর্ডিং',
    uploadPhoto: 'ছবি প্রমাণ যুক্ত করুন',
    aiAnalyzing: 'জেমিনি এআই বিশ্লেষণ করছে...',
    verificationToken: 'সার্বভৌম যাচাই টোকেন',
    assignedDept: 'নির্ধারিত সরকারি বিভাগ',
    reassuranceMsg: 'নাগরিক আশ্বাস বার্তা',
    crossBorderPicks: 'জেমিনি আন্তঃসীমান্ত এআই নির্বাচন',
    zeroDebtGuarantee: '১০০% ঋণমুক্ত ওপেন সোর্স ডিপিজি',
    ministerOfExternalAffairs: 'পররাষ্ট্রমন্ত্রী / কূটনৈতিক উপদেষ্টা',
    backToPrevious: 'পূর্ববর্তী পাতায় ফিরে যান',
    grievancesCount: 'নাগরিক অভিযোগ',
    hotspotsCount: 'জিআইএস এলাকা',
    switchLanguage: 'ভাষা (৩৩টি ব্রিকস ভাষা)',
    waterSanitation: 'পানীয় জল ও স্যানিটেশন',
    energyMicrogrids: 'শক্তি ও সৌর মাইক্রোগ্রিড',
    transportConnectivity: 'পরিবহন ও রাস্তা সংযোগ',
    healthInfrastructure: 'স্বাস্থ্য অবকাঠামো',
    digitalPublicInfrastructure: 'ডিজিটাল পাবলিক অবকাঠামো',
    agriculturalIrrigation: 'কৃষি ও সেচ খাল',
    educationSanitation: 'শিক্ষা ও স্যানিটেশন',
    critical: 'সংকটপূর্ণ',
    high: 'উচ্চ',
    medium: 'মাঝারি',
    low: 'সাধারণ',
    speakText: 'জেমিনি এআই কণ্ঠে শুনুন',
    geminiAgentActive: 'জেমিনি এআই আঞ্চলিক সেন্টিনেল সক্রিয়',
  },
  gu: {
    portalTitle: 'બ્રિક્સ પલ્સગવ ડીપીઆઈ',
    portalSubtitle: 'એઆઈ ડિજિટલ પબ્લિક ઈન્ફ્રાસ્ટ્રક્ચર અને નાગરિક શાસન',
    raiseComplaint: 'ફરિયાદ નોંધાવો',
    gisHotspots: 'જીઆઈએસ હોટસ્પોટ્સ',
    citizenVoice: 'નાગરિક ફરિયાદ મંચ',
    aiDprStudio: 'એઆઈ ડીપીઆર સ્ટુડિયો',
    ministerialCopilot: 'મંત્રી સ્તરના એઆઈ સલાહકાર',
    dashboard: 'ડેશબોર્ડ',
    login: 'લૉગિન',
    signUp: 'સાઇન અપ',
    allCountries: '🌍 તમામ ૧૦ બ્રિક્સ દેશો',
    selectCountry: 'દેશ પસંદ કરો',
    selectRegion: 'રાજ્ય / પ્રદેશ પસંદ કરો',
    complaintTitle: 'ફરિયાદનું શીર્ષક',
    complaintDescription: 'સમસ્યાની વિગતવાર માહિતી આપો...',
    category: 'ઈન્ફ્રાસ્ટ્રક્ચર કેટેગરી',
    urgency: 'તાકીદની પ્રાથમિકતા',
    submitComplaint: 'સત્તાવાર ફરિયાદ સબમિટ કરો',
    voiceRecording: 'વૉઇસ રેકોર્ડિંગ',
    uploadPhoto: 'ફોટો પુરાવો અપલોડ કરો',
    aiAnalyzing: 'જેમિની એઆઈ વિશ્લેષણ કરી રહ્યું છે...',
    verificationToken: 'વેરિફિકેશન ટોકન',
    assignedDept: 'સોંપાયેલ સરકારી વિભાગ',
    reassuranceMsg: 'નાગરિક આશ્વાસન સંદેશ',
    crossBorderPicks: 'જેમિની ક્રોસ-બોર્ડર એઆઈ પિક્સ',
    zeroDebtGuarantee: '૧૦૦% શૂન્ય-દેવું ઓપન સોર્સ ડીપીજી',
    ministerOfExternalAffairs: 'વિદેશ મંત્રી',
    backToPrevious: 'પાછલા પેજ પર પાછા જાઓ',
    grievancesCount: 'નાગરિક ફરિયાદો',
    hotspotsCount: 'જીઆઈએસ હોટસ્પોટ્સ',
    switchLanguage: 'ભાષા (૩૩ બ્રિક્સ ભાષાઓ)',
    waterSanitation: 'પીવાનું પાણી અને સ્વચ્છતા',
    energyMicrogrids: 'ઊર્જા અને સોલર માઇક્રોગ્રિડ',
    transportConnectivity: 'પરિવહન અને રસ્તાઓ',
    healthInfrastructure: 'આરોગ્ય ઈન્ફ્રાસ્ટ્રક્ચર',
    digitalPublicInfrastructure: 'ડિજિટલ પબ્લિક ઈન્ફ્રાસ્ટ્રક્ચર',
    agriculturalIrrigation: 'કૃષિ અને સિંચાઈ',
    educationSanitation: 'શિક્ષણ અને શાળા સ્વચ્છતા',
    critical: 'અતિ-ગંભીર',
    high: 'ઉચ્ચ',
    medium: 'મધ્યમ',
    low: 'સામાન્ય',
    speakText: 'જેમિની એઆઈ અવાજમાં સાંભળો',
    geminiAgentActive: 'જેમિની એઆઈ પ્રાદેશિક સેન્ટીનેલ સક્રિય',
  },
  kn: {
    portalTitle: 'ಬ್ರಿಕ್ಸ್ ಪಲ್ಸ್‌ಗವ್ ಡಿಪಿಐ',
    portalSubtitle: 'ಎಐ ಡಿಜಿಟಲ್ ಸಾರ್ವಜನಿಕ ಮೂಲಸೌಕರ್ಯ ಮತ್ತು ನಾಗರಿಕ ಆಡಳಿತ',
    raiseComplaint: 'ದೂರು ದಾಖಲಿಸಿ',
    gisHotspots: 'ಜಿಐಎಸ್ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು',
    citizenVoice: 'ನಾಗರಿಕ ದೂರುಗಳ ವೇದಿಕೆ',
    aiDprStudio: 'ಎಐ ಯೋಜನಾ ವರದಿ ಸ್ಟುಡಿಯೋ',
    ministerialCopilot: 'ಸಚಿವರ ಎಐ ಸಲಹೆಗಾರ',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    login: 'ಲಾಗಿನ್',
    signUp: 'ನೋಂದಣಿ',
    allCountries: '🌍 ಎಲ್ಲಾ 10 ಬ್ರಿಕ್ಸ್ ದೇಶಗಳು',
    selectCountry: 'ದೇಶವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    selectRegion: 'ರಾಜ್ಯ / ಪ್ರದೇಶವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    complaintTitle: 'ದೂರಿನ ಶೀರ್ಷಿಕೆ',
    complaintDescription: 'ಸಮಸ್ಯೆಯನ್ನು ವಿವರವಾಗಿ ಬರೆಯಿರಿ...',
    category: 'ಮೂಲಸೌಕರ್ಯ ವಿಭಾಗ',
    urgency: 'ತುರ್ತು ಆದ್ಯತೆ',
    submitComplaint: 'ದೂರನ್ನು ಸಲ್ಲಿಸಿ',
    voiceRecording: 'ಧ್ವನಿ ಮುದ್ರಣ',
    uploadPhoto: 'ಫೋಟೋ ಪುರಾವೆ ಲಗತ್ತಿಸಿ',
    aiAnalyzing: 'ಜೆಮಿನಿ ಎಐ ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...',
    verificationToken: 'ಪರಿಶೀಲನಾ ಟೋಕನ್',
    assignedDept: 'ನಿಯೋಜಿತ ಸರ್ಕಾರಿ ಇಲಾಖೆ',
    reassuranceMsg: 'ನಾಗರಿಕ ಭರವಸೆ ಸಂದೇಶ',
    crossBorderPicks: 'ಜೆಮಿನಿ ಗಡಿಯಾಚೆಗಿನ ಎಐ ಆಯ್ಕೆಗಳು',
    zeroDebtGuarantee: '100% ಸಾಲಮುಕ್ತ ಮುಕ್ತ ಮೂಲ ಡಿಪಿಜಿ',
    ministerOfExternalAffairs: 'ವಿದೇಶಾಂಗ ಸಚಿವರು',
    backToPrevious: 'ಹಿಂದಿನ ಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
    grievancesCount: 'ನಾಗರಿಕ ದೂರುಗಳು',
    hotspotsCount: 'ಜಿಐಎಸ್ ಪ್ರದೇಶಗಳು',
    switchLanguage: 'ಭಾಷೆ (33 ಬ್ರಿಕ್ಸ್ ಭಾಷೆಗಳು)',
    waterSanitation: 'ಕುಡಿಯುವ ನೀರು ಮತ್ತು ನೈರ್ಮಲ್ಯ',
    energyMicrogrids: 'ಶಕ್ತಿ ಮತ್ತು ಸೌರ ಮೈಕ್ರೋಗ್ರಿಡ್',
    transportConnectivity: 'ಸಾರಿಗೆ ಮತ್ತು ರಸ್ತೆ ಸಂಪರ್ಕ',
    healthInfrastructure: 'ಆರೋಗ್ಯ ಮೂಲಸೌಕರ್ಯ',
    digitalPublicInfrastructure: 'ಡಿಜಿಟಲ್ ಸಾರ್ವಜನಿಕ ಮೂಲಸೌಕರ್ಯ',
    agriculturalIrrigation: 'ಕೃಷಿ ಮತ್ತು ನೀರಾವರಿ',
    educationSanitation: 'ಶಿಕ್ಷಣ ಮತ್ತು ನೈರ್ಮಲ್ಯ',
    critical: 'ಅತ್ಯಂತ ತುರ್ತು',
    high: 'ಹೆಚ್ಚು',
    medium: 'ಮಧ್ಯಮ',
    low: 'ಸಾಮಾನ್ಯ',
    speakText: 'ಜೆಮಿನಿ ಎಐ ಧ್ವನಿಯಲ್ಲಿ ಆಲಿಸಿ',
    geminiAgentActive: 'ಜೆಮಿನಿ ಎಐ ಪ್ರಾದೇಶಿಕ ಕಾವಲುಗಾರ ಸಕ್ರಿಯವಾಗಿದೆ',
  },
  ml: {
    portalTitle: 'ബ്രിക്സ് പൾസ്ഗോവ് ഡിപിഐ',
    portalSubtitle: 'എഐ ഡിജിറ്റൽ പബ്ലിക് ഇൻഫ്രാസ്ട്രക്ചറും പൗരഭരണവും',
    raiseComplaint: 'പരാതി സമർപ്പിക്കുക',
    gisHotspots: 'ജിഐഎസ് ഹോട്ട്സ്പോട്ടുകൾ',
    citizenVoice: 'പൗരപരാതി വേദി',
    aiDprStudio: 'എഐ പ്രോജക്റ്റ് റിപ്പോർട്ട് സ്റ്റുഡിയോ',
    ministerialCopilot: 'മന്ത്രിതല എഐ ഉപദേശകൻ',
    dashboard: 'ഡാഷ്ബോർഡ്',
    login: 'ലോഗിൻ',
    signUp: 'സൈൻ അപ്പ്',
    allCountries: '🌍 എല്ലാ 10 ബ്രിക്സ് രാജ്യങ്ങളും',
    selectCountry: 'രാജ്യം തിരഞ്ഞെടുക്കുക',
    selectRegion: 'സംസ്ഥാനം / പ്രദേശം തിരഞ്ഞെടുക്കുക',
    complaintTitle: 'പരാതിയുടെ തലക്കെട്ട്',
    complaintDescription: 'പ്രശ്നം വിശദമായി വിവരിക്കുക...',
    category: 'അടിസ്ഥാന സൗകര്യ വിഭാഗം',
    urgency: 'അടിയന്തര മുൻഗണന',
    submitComplaint: 'ഔദ്യോഗിക പരാതി സമർപ്പിക്കുക',
    voiceRecording: 'വോയ്സ് റെക്കോർഡിംഗ്',
    uploadPhoto: 'ഫോട്ടോ തെളിവ് അറ്റാച്ചുചെയ്യുക',
    aiAnalyzing: 'ജെമിനി എഐ വിശകലനം ചെയ്യുന്നു...',
    verificationToken: 'സ്ഥിരീകരണ ടോക്കൺ',
    assignedDept: 'നിയോഗിച്ച സർക്കാർ വകുപ്പ്',
    reassuranceMsg: 'പൗരന്മാർക്കുള്ള ഉറപ്പ് സന്ദേശം',
    crossBorderPicks: 'ജെമിനി അതിർത്തി കടന്നുള്ള എഐ തെരഞ്ഞെടുപ്പുകൾ',
    zeroDebtGuarantee: '100% കടരഹിത ഓപ്പൺ സോഴ്സ് ഡിപിജി',
    ministerOfExternalAffairs: 'വിദേശകാര്യ മന്ത്രി',
    backToPrevious: 'മുമ്പത്തെ പേജിലേക്ക് മടങ്ങുക',
    grievancesCount: 'പൗരപരാതികൾ',
    hotspotsCount: 'ജിഐഎസ് കേന്ദ്രങ്ങൾ',
    switchLanguage: 'ഭാഷ (33 ബ്രിക്സ് ഭാഷകൾ)',
    waterSanitation: 'കുടിവെള്ളവും ശുചിത്വവും',
    energyMicrogrids: 'ഊർജ്ജവും സോളാർ മൈക്രോഗ്രിഡും',
    transportConnectivity: 'ഗതാഗതവും റോഡ് കണക്റ്റിവിറ്റിയും',
    healthInfrastructure: 'ആരോഗ്യ ഇൻഫ്രാസ്ട്രക്ചർ',
    digitalPublicInfrastructure: 'ഡിജിറ്റൽ പബ്ലിക് ഇൻഫ്രാസ്ട്രക്ചർ',
    agriculturalIrrigation: 'കൃഷിയും ജലസേചനവും',
    educationSanitation: 'വിദ്യാഭ്യാസവും സ്കൂൾ ശുചിത്വവും',
    critical: 'വളരെ അടിയന്തിരം',
    high: 'ഉയർന്നത്',
    medium: 'ഇടത്തരം',
    low: 'സാധാരണ',
    speakText: 'ജെമിനി എഐ ശബ്ദത്തിൽ കേൾക്കുക',
    geminiAgentActive: 'ജെമിനി എഐ റീജിയണൽ സെന്റിനൽ സജീവമാണ്',
  },
  pa: {
    portalTitle: 'ਬ੍ਰਿਕਸ ਪਲਸਗਵ ਡੀਪੀਆਈ',
    portalSubtitle: 'ਏਆਈ ਡਿਜੀਟਲ ਪਬਲਿਕ ਇਨਫਰਾਸਟਰੱਕਚਰ ਅਤੇ ਨਾਗਰਿਕ ਪ੍ਰਸ਼ਾਸਨ',
    raiseComplaint: 'ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ',
    gisHotspots: 'ਜੀਆਈਐਸ ਹੌਟਸਪੌਟ',
    citizenVoice: 'ਨਾਗਰਿਕ ਸ਼ਿਕਾਇਤ ਮੰਚ',
    aiDprStudio: 'ਏਆਈ ਪ੍ਰੋਜੈਕਟ ਰਿਪੋਰਟ ਸਟੂਡੀਓ',
    ministerialCopilot: 'ਮੰਤਰੀ ਪੱਧਰੀ ਏਆਈ ਸਲਾਹਕਾਰ',
    dashboard: 'ਡੈਸ਼ਬੋਰਡ',
    login: 'ਲਾਗਇਨ',
    signUp: 'ਸਾਈਨ ਅੱਪ',
    allCountries: '🌍 ਸਾਰੇ 10 ਬ੍ਰਿਕਸ ਦੇਸ਼',
    selectCountry: 'ਦੇਸ਼ ਚੁਣੋ',
    selectRegion: 'ਰਾਜ / ਖੇਤਰ ਚੁਣੋ',
    complaintTitle: 'ਸ਼ਿਕਾਇਤ ਦਾ ਸਿਰਲੇਖ',
    complaintDescription: 'ਸਮੱਸਿਆ ਦਾ ਵਿਸਥਾਰਪੂਰਵਕ ਵੇਰਵਾ ਦਿਓ...',
    category: 'ਇਨਫਰਾਸਟਰੱਕਚਰ ਸ਼੍ਰੇਣੀ',
    urgency: 'ਜ਼ਰੂਰੀ ਤਰਜੀਹ',
    submitComplaint: 'ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ',
    voiceRecording: 'ਆਵਾਜ਼ ਰਿਕਾਰਡਿੰਗ',
    uploadPhoto: 'ਫੋਟੋ ਸਬੂਤ ਅੱਪਲੋਡ ਕਰੋ',
    aiAnalyzing: 'ਜੈਮਿਨੀ ਏਆਈ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ...',
    verificationToken: 'ਤਸਦੀਕ ਟੋਕਨ',
    assignedDept: 'ਨਿਰਧਾਰਤ ਸਰਕਾਰੀ ਵਿਭਾਗ',
    reassuranceMsg: 'ਨਾਗਰਿਕ ਭਰੋਸਾ ਸੰਦੇਸ਼',
    crossBorderPicks: 'ਜੈਮਿਨੀ ਸਰਹੱਦ ਪਾਰ ਏਆਈ ਚੋਣਾਂ',
    zeroDebtGuarantee: '100% ਕਰਜ਼ਾ-ਮੁਕਤ ਓਪਨ ਸੋਰਸ ਡੀਪੀਜੀ',
    ministerOfExternalAffairs: 'ਵਿਦੇਸ਼ ਮੰਤਰੀ',
    backToPrevious: 'ਪਿਛਲੇ ਪੰਨੇ ਤੇ ਵਾਪਸ ਜਾਓ',
    grievancesCount: 'ਨਾਗਰਿਕ ਸ਼ਿਕਾਇਤਾਂ',
    hotspotsCount: 'ਜੀਆਈਐਸ ਹੌਟਸਪੌਟ',
    switchLanguage: 'ਭਾਸ਼ਾ (33 ਬ੍ਰਿਕਸ ਭਾਸ਼ਾਵਾਂ)',
    waterSanitation: 'ਪੀਣ ਵਾਲਾ ਪਾਣੀ ਅਤੇ ਸਵੱਛਤਾ',
    energyMicrogrids: 'ਊਰਜਾ ਅਤੇ ਸੋਲਰ ਮਾਈਕ੍ਰੋਗ੍ਰਿਡ',
    transportConnectivity: 'ਆਵਾਜਾਈ ਅਤੇ ਸੜਕਾਂ',
    healthInfrastructure: 'ਸਿਹਤ ਬੁਨਿਆਦੀ ਢਾਂਚਾ',
    digitalPublicInfrastructure: 'ਡਿਜੀਟਲ ਪਬਲਿਕ ਇਨਫਰਾਸਟਰੱਕਚਰ',
    agriculturalIrrigation: 'ਖੇਤੀਬਾੜੀ ਅਤੇ ਸਿੰਚਾਈ',
    educationSanitation: 'ਸਿੱਖਿਆ ਅਤੇ ਸਵੱਛਤਾ',
    critical: 'ਬਹੁਤ ਗੰਭੀਰ',
    high: 'ਉੱਚ',
    medium: 'ਦਰਮਿਆਨਾ',
    low: 'ਆਮ',
    speakText: 'ਜੈਮਿਨੀ ਏਆਈ ਆਵਾਜ਼ ਵਿੱਚ ਸੁਣੋ',
    geminiAgentActive: 'ਜੈਮਿਨੀ ਏਆਈ ਖੇਤਰੀ ਰਖਵਾਲਾ ਸਰਗਰਮ ਹੈ',
  },
  or: {
    portalTitle: 'ବ୍ରିକ୍ସ ପଲସଗଭ ଡିପିଆଇ',
    portalSubtitle: 'ଏଆଇ ଡିଜିଟାଲ ସାର୍ବଜନୀନ ଭିତ୍ତିଭୂମି ଓ ନାଗରିକ ପ୍ରଶାସନ',
    raiseComplaint: 'ଅଭିଯୋଗ ଦାଖଲ କରନ୍ତୁ',
    gisHotspots: 'ଜିଆଇଏସ ହଟସ୍ପଟ',
    citizenVoice: 'ନାଗରିକ ଅଭିଯୋଗ ମଞ୍ଚ',
    aiDprStudio: 'ଏଆଇ ପ୍ରକଳ୍ପ ରିପୋର୍ଟ ଷ୍ଟୁଡିଓ',
    ministerialCopilot: 'ମନ୍ତ୍ରୀ ସ୍ତରୀୟ ଏଆଇ ପରାମର୍ଶଦାତା',
    dashboard: 'ଡ୍ୟାସବୋର୍ଡ',
    login: 'ଲଗଇନ',
    signUp: 'ପଞ୍ଜୀକରଣ',
    allCountries: '🌍 ସମସ୍ତ ୧୦ ବ୍ରିକ୍ସ ରାଷ୍ଟ୍ର',
    selectCountry: 'ଦେଶ ବାଛନ୍ତୁ',
    selectRegion: 'ରାଜ୍ୟ / ଅଞ୍ଚଳ ବାଛନ୍ତୁ',
    complaintTitle: 'ଅଭିଯୋଗ ଶୀର୍ଷକ',
    complaintDescription: 'ସମସ୍ୟା ବିଷୟରେ ବିସ୍ତୃତ ଭାବରେ ଲେଖନ୍ତୁ...',
    category: 'ଭିତ୍ତିଭୂମି ବିଭାଗ',
    urgency: 'ଜରୁରୀ ପ୍ରାଥମିକତା',
    submitComplaint: 'ଅଭିଯୋଗ ଦାଖଲ କରନ୍ତୁ',
    voiceRecording: 'ଭଏସ ରେକର୍ଡିଂ',
    uploadPhoto: 'ଫଟୋ ପ୍ରମାଣ ସଂଲଗ୍ନ କରନ୍ତୁ',
    aiAnalyzing: 'ଜେମିନି ଏଆଇ ବିଶ୍ଳେଷଣ କରୁଛି...',
    verificationToken: 'ଯାଞ୍ଚ ଟୋକନ',
    assignedDept: 'ନ୍ୟସ୍ତ ସରକାରୀ ବିଭାଗ',
    reassuranceMsg: 'ନାଗରିକ ଆଶ୍ୱାସନା ବାର୍ତ୍ତା',
    crossBorderPicks: 'ଜେମିନି ଆନ୍ତଃସୀମା ଏଆଇ ଚୟନ',
    zeroDebtGuarantee: '୧୦୦% ଋଣମୁକ୍ତ ଓପନ ସୋର୍ସ ଡିପିଜି',
    ministerOfExternalAffairs: 'ବୈଦେଶିକ ବ୍ୟାପାର ମନ୍ତ୍ରୀ',
    backToPrevious: 'ପୂର୍ବ ପୃଷ୍ଠାକୁ ଫେରନ୍ତୁ',
    grievancesCount: 'ନାଗରିକ ଅଭିଯୋଗ',
    hotspotsCount: 'ଜିଆଇଏସ କ୍ଷେତ୍ର',
    switchLanguage: 'ଭାଷା (୩୩ ବ୍ରିକ୍ସ ଭାଷା)',
    waterSanitation: 'ପାନୀୟ ଜଳ ଓ ପରିମଳ',
    energyMicrogrids: 'ଶକ୍ତି ଓ ସୌର ମାଇକ୍ରୋଗ୍ରିଡ',
    transportConnectivity: 'ପରିବହନ ଓ ରାସ୍ତା ସଂଯୋଗ',
    healthInfrastructure: 'ସ୍ୱାସ୍ଥ୍ୟ ଭିତ୍ତିଭୂମି',
    digitalPublicInfrastructure: 'ଡିଜିଟାଲ ସାର୍ବଜନୀନ ଭିତ୍ତିଭୂମି',
    agriculturalIrrigation: 'କୃଷି ଓ ଜଳସେଚନ',
    educationSanitation: 'ଶିକ୍ଷା ଓ ବିଦ୍ୟାଳୟ ପରିମଳ',
    critical: 'ଅତି ଜରୁରୀ',
    high: 'ଉଚ୍ଚ',
    medium: 'ମଧ୍ୟମ',
    low: 'ସାଧାରଣ',
    speakText: 'ଜେମିନି ଏଆଇ ସ୍ୱରରେ ଶୁଣନ୍ତୁ',
    geminiAgentActive: 'ଜେମିନି ଏଆଇ ଆଞ୍ଚଳିକ ସୁରକ୍ଷାକର୍ତ୍ତା ସକ୍ରିୟ',
  },
  ur: {
    portalTitle: 'برکس پلس گو ڈی پی آئی',
    portalSubtitle: 'مصنوعی ذہانت ڈیجیٹل پبلک انفراسٹرکچر اور شہری حکمرانی',
    raiseComplaint: 'شکایت درج کریں',
    gisHotspots: 'جی آئی ایس ہاٹ اسپاٹس',
    citizenVoice: 'شہری شکایات پورٹل',
    aiDprStudio: 'اے آئی پروجیکٹ رپورٹ اسٹوڈیو',
    ministerialCopilot: 'وزارتی اے آئی مشیر',
    dashboard: 'ڈیش بورڈ',
    login: 'لاگ ان',
    signUp: 'رجسٹریشن',
    allCountries: '🌍 تمام 10 برکس ممالک',
    selectCountry: 'ملک منتخب کریں',
    selectRegion: 'ریاست / علاقہ منتخب کریں',
    complaintTitle: 'شکایت کا عنوان',
    complaintDescription: 'مسئلے کی تفصیل لکھیں...',
    category: 'انفراسٹرکچر شعبہ',
    urgency: 'ہنگامی ترجیح',
    submitComplaint: 'شکایت جمع کروائیں',
    voiceRecording: 'آواز کی ریکارڈنگ',
    uploadPhoto: 'تصویری ثبوت منسلک کریں',
    aiAnalyzing: 'جیمنی اے آئی تجزیہ کر رہا ہے...',
    verificationToken: 'حکومتی توثیقی ٹوکن',
    assignedDept: 'متعلقہ سرکاری محکمہ',
    reassuranceMsg: 'شہری تسلی کا پیغام',
    crossBorderPicks: 'جیمنی کراس بارڈر اے آئی سلیکشن',
    zeroDebtGuarantee: '100% غیر ملکی قرض سے پاک اوپن سورس',
    ministerOfExternalAffairs: 'وزیر خارجہ / سفارتی مشیر',
    backToPrevious: 'پچھلے صفحے پر واپس جائیں',
    grievancesCount: 'شہری شکایات',
    hotspotsCount: 'جی آئی ایس ہاٹ اسپاٹس',
    switchLanguage: 'زبان (33 برکس زبانیں)',
    waterSanitation: 'پینے کا پانی اور صفائی',
    energyMicrogrids: 'توانائی اور شمسی مائیکرو گرڈ',
    transportConnectivity: 'نقل و حمل اور سڑکیں',
    healthInfrastructure: 'صحت کا بنیادی ڈھانچہ',
    digitalPublicInfrastructure: 'ڈیجیٹل پبلک انفراسٹرکچر',
    agriculturalIrrigation: 'زراعت اور آبپاشی',
    educationSanitation: 'تعلیم اور اسکول کی صفائی',
    critical: 'انتہائی اہم',
    high: 'اعلیٰ',
    medium: 'درمیانہ',
    low: 'عام',
    speakText: 'جیمنی اے آئی کی آواز میں سنیں',
    geminiAgentActive: 'جیمنی اے آئی علاقائی محافظ فعال ہے',
  },
  pt: {
    portalTitle: 'BRICS PulseGov DPI',
    portalSubtitle: 'Infraestrutura Pública Digital e Governança Cidadã com IA',
    raiseComplaint: 'Registrar Reclamação',
    gisHotspots: 'Hotspots GIS',
    citizenVoice: 'Voz do Cidadão',
    aiDprStudio: 'Estúdio DPR & Gantt IA',
    ministerialCopilot: 'Hub de Inteligência Soberana BRICS',
    dashboard: 'Painel',
    login: 'Entrar',
    signUp: 'Cadastrar',
    allCountries: '🌍 Todas as 10 Nações BRICS',
    selectCountry: 'Selecionar País',
    selectRegion: 'Selecionar Estado / Província',
    complaintTitle: 'Título da Solicitação de Infraestrutura',
    complaintDescription: 'Descreva a necessidade comunitária...',
    category: 'Setor de Infraestrutura',
    urgency: 'Prioridade de Urgência',
    submitComplaint: 'Enviar Reclamação Soberana',
    voiceRecording: 'Gravação de Voz',
    uploadPhoto: 'Anexar Foto Evidência',
    aiAnalyzing: 'IA Gemini analisando...',
    verificationToken: 'Token de Verificação Soberano',
    assignedDept: 'Departamento Designado',
    reassuranceMsg: 'Mensagem de Reafirmação ao Cidadão',
    crossBorderPicks: 'Recomendações IA Transfronteiriças',
    zeroDebtGuarantee: '100% DPG Aberto Sem Dívida',
    ministerOfExternalAffairs: 'Ministro das Relações Exteriores',
    backToPrevious: 'Voltar ao Anterior',
    grievancesCount: 'Reclamações Cidadãs',
    hotspotsCount: 'Hotspots GIS',
    switchLanguage: 'Idioma (33 Idiomas BRICS)',
    waterSanitation: 'Água e Saneamento',
    energyMicrogrids: 'Energia e Microredes Solares',
    transportConnectivity: 'Transporte e Conectividade',
    healthInfrastructure: 'Infraestrutura de Saúde',
    digitalPublicInfrastructure: 'Infraestrutura Pública Digital',
    agriculturalIrrigation: 'Agricultura e Irrigação',
    educationSanitation: 'Educação e Saneamento',
    critical: 'Crítico',
    high: 'Alto',
    medium: 'Médio',
    low: 'Baixo',
    speakText: 'Ouvir na Voz IA Gemini',
    geminiAgentActive: 'Sentinela Regional IA Gemini Ativo',
  },
  ru: {
    portalTitle: 'BRICS PulseGov DPI',
    portalSubtitle: 'Цифровая Общественная Инфраструктура и Управление с ИИ',
    raiseComplaint: 'Подать обращение',
    gisHotspots: 'ГИС Хотспоты',
    citizenVoice: 'Голос Граждан',
    aiDprStudio: 'ИИ DPR и График Ганта',
    ministerialCopilot: 'Суверенный интеллектуальный хаб БРИКС',
    dashboard: 'Панель',
    login: 'Вход',
    signUp: 'Регистрация',
    allCountries: '🌍 Все 10 стран БРИКС',
    selectCountry: 'Выбрать страну',
    selectRegion: 'Выбрать регион / субъект',
    complaintTitle: 'Тема обращения по инфраструктуре',
    complaintDescription: 'Опишите проблему или потребность...',
    category: 'Сектор инфраструктуры',
    urgency: 'Срочность',
    submitComplaint: 'Отправить обращение',
    voiceRecording: 'Голосовая запись',
    uploadPhoto: 'Прикрепить фото',
    aiAnalyzing: 'ИИ Gemini анализирует...',
    verificationToken: 'Суверенный токен проверки',
    assignedDept: 'Назначенное ведомство',
    reassuranceMsg: 'Официальное уведомление гражданину',
    crossBorderPicks: 'Трансграничные ИИ-решения',
    zeroDebtGuarantee: '100% открытый исходный код без долгов',
    ministerOfExternalAffairs: 'Министр иностранных дел',
    backToPrevious: 'Назад к обзору',
    grievancesCount: 'Обращения граждан',
    hotspotsCount: 'ГИС Хотспоты',
    switchLanguage: 'Язык (33 языка БРИКС)',
    waterSanitation: 'Водоснабжение и канализация',
    energyMicrogrids: 'Энергетика и микросети',
    transportConnectivity: 'Транспорт и дороги',
    healthInfrastructure: 'Медицинская инфраструктура',
    digitalPublicInfrastructure: 'Цифровая общественная инфраструктура',
    agriculturalIrrigation: 'Сельское хозяйство и мелиорация',
    educationSanitation: 'Образование и санитария',
    critical: 'Критический',
    high: 'Высокий',
    medium: 'Средний',
    low: 'Низкий',
    speakText: 'Слушать голос ИИ Gemini',
    geminiAgentActive: 'Региональный ИИ Gemini активен',
  },
  zh: {
    portalTitle: '金砖国家 PulseGov 数字公共基础设施',
    portalSubtitle: 'AI 数字公共基础设施与公民治理平台',
    raiseComplaint: '提交公民诉求',
    gisHotspots: '地理信息热点',
    citizenVoice: '公民诉求中心',
    aiDprStudio: 'AI 项目报告与甘特图',
    ministerialCopilot: '部长级 AI 助手',
    dashboard: '控制面板',
    login: '登录',
    signUp: '注册',
    allCountries: '🌍 金砖10国全境',
    selectCountry: '选择国家',
    selectRegion: '选择地区 / 省份',
    complaintTitle: '基础设施诉求标题',
    complaintDescription: '请详细描述基础设施缺陷或社区需求...',
    category: '基础设施类别',
    urgency: '紧迫性评级',
    submitComplaint: '提交主权工单',
    voiceRecording: '语音诉求录制',
    uploadPhoto: '上传照片证据',
    aiAnalyzing: 'Gemini AI 正在智能分析分类...',
    verificationToken: '主权验证防伪凭据',
    assignedDept: '受理政府部门',
    reassuranceMsg: '公民反馈通知',
    crossBorderPicks: '金砖跨境 AI 匹配选项目',
    zeroDebtGuarantee: '100% 零债务开源主权保障',
    ministerOfExternalAffairs: '外交事务专员 / 战略顾问',
    backToPrevious: '返回上一步',
    grievancesCount: '已登记诉求',
    hotspotsCount: 'GIS 热点',
    switchLanguage: '语言切换 (金砖 33 种语言)',
    waterSanitation: '供水与卫生设施',
    energyMicrogrids: '能源与太阳能微电网',
    transportConnectivity: '交通与道路互联互通',
    healthInfrastructure: '医疗卫生基础设施',
    digitalPublicInfrastructure: '数字公共基础设施 (DPI)',
    agriculturalIrrigation: '农业与灌溉水利',
    educationSanitation: '教育与学校卫生',
    critical: '紧急特级',
    high: '高度优先',
    medium: '中等',
    low: '常规',
    speakText: 'Gemini AI 语音播报',
    geminiAgentActive: 'Gemini AI 区域哨兵已就绪',
  },
  ar: {
    portalTitle: 'بوابة البنية التحتية الرقمية لدول بريكس',
    portalSubtitle: 'البنية التحتية الرقمية العامة وحوكمة المواطنين بالذكاء الاصطناعي',
    raiseComplaint: 'تقديم شكوى مواطن',
    gisHotspots: 'الخرائط الجغرافية للبنية التحتية',
    citizenVoice: 'سجل شكاوى المواطنين',
    aiDprStudio: 'استوديو تقارير المشاريع بالذكاء الاصطناعي',
    ministerialCopilot: 'المساعد الوزاري الذكي',
    dashboard: 'لوحة التحكم',
    login: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    allCountries: '🌍 جميع دول بريكس العشر',
    selectCountry: 'اختر الدولة',
    selectRegion: 'اختر المنطقة / المحافظة',
    complaintTitle: 'عنوان البلاغ أو مشكلة البنية التحتية',
    complaintDescription: 'صف المشكلة أو الاحتياج الخدمي بالتفصيل...',
    category: 'قطاع البنية التحتية',
    urgency: 'درجة الاستعجال',
    submitComplaint: 'إرسال البلاغ الرسمي',
    voiceRecording: 'تسجيل صوتي للبلاغ',
    uploadPhoto: 'إرفاق صور الإثبات',
    aiAnalyzing: 'جاري التحليل بواسطة Gemini AI...',
    verificationToken: 'رمز التحقق السيادي المعتمد',
    assignedDept: 'الجهة الحكومية المختصة',
    reassuranceMsg: 'رسالة طمأنة رسمية للمواطن',
    crossBorderPicks: 'توصيات الذكاء الاصطناعي العابرة للحدود',
    zeroDebtGuarantee: 'منتج رقمي عام 100% بدون ديون خارجية',
    ministerOfExternalAffairs: 'وزير الخارجية / المستشار الدبلوماسي',
    backToPrevious: 'الرجوع إلى النظرة العامة',
    grievancesCount: 'شكاوى المواطنين',
    hotspotsCount: 'المناطق الجغرافية',
    switchLanguage: 'اللغة (33 لغة في دول بريكس)',
    waterSanitation: 'المياه والصرف الصحي',
    energyMicrogrids: 'الطاقة والشبكات الشمسية المصغرة',
    transportConnectivity: 'النقل والربط الطرقي',
    healthInfrastructure: 'البنية التحتية الصحية',
    digitalPublicInfrastructure: 'البنية التحتية الرقمية العامة',
    agriculturalIrrigation: 'الزراعة والري',
    educationSanitation: 'التعليم والصحة المدرسية',
    critical: 'حرج جداً',
    high: 'أولوية عالية',
    medium: 'متوسط',
    low: 'عادي',
    speakText: 'الاستماع بصوت الذكاء الاصطناعي Gemini',
    geminiAgentActive: 'حارس الذكاء الاصطناعي الإقليمي نشط',
  },
  am: {
    portalTitle: 'የብሪክስ ዲጂታል የህዝብ መሠረተ-ልማት',
    portalSubtitle: 'በአርቴፊሻል ኢንተለጀንስ የተደገፈ የህዝብ አስተዳደር ፖርታል',
    raiseComplaint: 'ቅሬታ ወይም ጥያቄ ያቅርቡ',
    gisHotspots: 'የካርታ መረጃ',
    citizenVoice: 'የህዝብ ድምፅ',
    aiDprStudio: 'የፕሮጀክት ሪፖርት ማመንጫ',
    ministerialCopilot: 'የሚኒስትሮች አማካሪ',
    dashboard: 'ዳሽቦርድ',
    login: 'ግባ',
    signUp: 'ተመዝገብ',
    allCountries: '🌍 ሁሉም 10 የብሪክስ አገሮች',
    selectCountry: 'አገር ይምረጡ',
    selectRegion: 'ክልል ይምረጡ',
    complaintTitle: 'የመሠረተ-ልማት ጥያቄ ርዕስ',
    complaintDescription: 'ችግሩን በዝርዝር ይግለጹ...',
    category: 'የመሠረተ-ልማት ዘርፍ',
    urgency: 'አስቸኳይነት ደረጃ',
    submitComplaint: 'ጥያቄውን መዝግብ',
    voiceRecording: 'በድምፅ ቅሬታ ማቅረቢያ',
    uploadPhoto: 'ፎቶ ያያይዙ',
    aiAnalyzing: 'Gemini AI እየተነተነ ነው...',
    verificationToken: 'የማረጋገጫ ኮድ',
    assignedDept: 'የተመደበው ክፍል',
    reassuranceMsg: 'ለዜጎች ማረጋገጫ መልእክት',
    crossBorderPicks: 'አገር አቋራጭ ምርጫዎች',
    zeroDebtGuarantee: '100% ነፃ የህዝብ ሶፍትዌር',
    ministerOfExternalAffairs: 'የውጭ ጉዳይ ሚኒስትር አማካሪ',
    backToPrevious: 'ወደ ኋላ ተመለስ',
    grievancesCount: 'የተመዘገቡ ቅሬታዎች',
    hotspotsCount: 'የካርታ ቦታዎች',
    switchLanguage: 'ቋንቋ (33 የብሪክስ ቋንቋዎች)',
    waterSanitation: 'ውሃ እና ሳኒቴሽን',
    energyMicrogrids: 'ኃይል እና የፀሐይ ማይክሮግሪድ',
    transportConnectivity: 'ትራንስፖርት እና የመንገድ ግንኙነት',
    healthInfrastructure: 'የጤና መሠረተ ልማት',
    digitalPublicInfrastructure: 'ዲጂታል የህዝብ መሠረተ ልማት',
    agriculturalIrrigation: 'ግብርና እና መስኖ',
    educationSanitation: 'ትምህርት እና ንፅህና',
    critical: 'እጅግ አስቸኳይ',
    high: 'ከፍተኛ',
    medium: 'መካከለኛ',
    low: 'ዝቅተኛ',
    speakText: 'በGemini AI ድምፅ ያዳምጡ',
    geminiAgentActive: 'የGemini AI የክልል ጠባቂ ንቁ ነው',
  },
  fa: {
    portalTitle: 'سامانه زیرساخت دیجیتال عمومی بریکس',
    portalSubtitle: 'حکمرانی هوشمند و زیرساخت عمومی دیجیتال با هوش مصنوعی',
    raiseComplaint: 'ثبت شکایت یا درخواست',
    gisHotspots: 'نقشه مناطق اولویت‌دار',
    citizenVoice: 'صدای شهروندان',
    aiDprStudio: 'استودیوی طرح توجیهی هوش مصنوعی',
    ministerialCopilot: 'دستیار هوشمند وزیران',
    dashboard: 'داشبورد',
    login: 'ورود',
    signUp: 'ثبت نام',
    allCountries: '🌍 تمام ۱۰ کشور عضو بریکس',
    selectCountry: 'انتخاب کشور',
    selectRegion: 'انتخاب استان / منطقه',
    complaintTitle: 'عنوان درخواست یا مشکل زیرساختی',
    complaintDescription: 'توضیحات مربوط به کمبود یا آسیب زیرساخت...',
    category: 'بخش زیرساخت',
    urgency: 'اولویت و فوریت',
    submitComplaint: 'ثبت رسمی گزارش',
    voiceRecording: 'ضبط صوتی درخواست',
    uploadPhoto: 'پیوست تصویر',
    aiAnalyzing: 'در حال تحلیل با هوش مصنوعی Gemini...',
    verificationToken: 'شناسه پیگیری حاکمیتی',
    assignedDept: 'نهاد اجرایی مسئول',
    reassuranceMsg: 'پیام اطمینان‌بخش به شهروند',
    crossBorderPicks: 'انتقال فناوری برون‌مرزی هوش مصنوعی',
    zeroDebtGuarantee: '۱۰۰٪ متن‌باز و بدون بدهی خارجی',
    ministerOfExternalAffairs: 'وزیر امور خارجه / مشاور دیپلماتیک',
    backToPrevious: 'بازگشت به صفحه قبل',
    grievancesCount: 'شکایات ثبت‌شده',
    hotspotsCount: 'نقاط کلیدی',
    switchLanguage: 'انتخاب زبان (۳۳ زبان بریکس)',
    waterSanitation: 'آب و فاضلاب',
    energyMicrogrids: 'انرژی و ریزشبکه‌های خورشیدی',
    transportConnectivity: 'حمل و نقل و جاده‌ها',
    healthInfrastructure: 'زیرساخت‌های درمانی و بهداشت',
    digitalPublicInfrastructure: 'زیرساخت عمومی دیجیتال',
    agriculturalIrrigation: 'کشاورزی و آبیاری',
    educationSanitation: 'آموزش و بهداشت مدارس',
    critical: 'بسیار فوری و بحرانی',
    high: 'اولویت بالا',
    medium: 'متوسط',
    low: 'عادی',
    speakText: 'شنیدن با صدای هوش مصنوعی Gemini',
    geminiAgentActive: 'نگهبان هوش مصنوعی منطقه‌ای Gemini فعال است',
  },
  zu: {
    portalTitle: 'BRICS PulseGov DPI',
    portalSubtitle: 'Ingqalasizinda Yomphakathi Yedijithali Nokubusa Kwezakhamuzi nge-AI',
    raiseComplaint: 'Faka Isikhalo',
    gisHotspots: 'Izindawo ze-GIS',
    citizenVoice: 'Izwi Lezakhamuzi',
    aiDprStudio: 'I-AI DPR Studio',
    ministerialCopilot: 'Umeluleki Wongqongqoshe we-AI',
    dashboard: 'Ideshibhodi',
    login: 'Ngena',
    signUp: 'Bhalisa',
    allCountries: '🌍 Wonke Amazwe ayi-10 e-BRICS',
    selectCountry: 'Khetha Izwe',
    selectRegion: 'Khetha Isifundazwe',
    complaintTitle: 'Isihloko Sesikhalo',
    complaintDescription: 'Chaza inkinga yengqalasizinda...',
    category: 'Umkhakha Wengqalasizinda',
    urgency: 'Izinga Lokuphuthuma',
    submitComplaint: 'Thumela Isikhalo Esisemthethweni',
    voiceRecording: 'Ukuqoshwa Kwezwi',
    uploadPhoto: 'Faka Isithombe',
    aiAnalyzing: 'I-Gemini AI iyahlaziya...',
    verificationToken: 'Ithokheni Lokugunyazwa',
    assignedDept: 'Umnyango Oqokiwe',
    reassuranceMsg: 'Umlayezo Wesiqiniseko',
    crossBorderPicks: 'Izixazululo ze-AI Ezinqamula Imingcele',
    zeroDebtGuarantee: '100% Ayinazikweletu Zangaphandle',
    ministerOfExternalAffairs: 'UNgqongqoshe Wezindaba Zangaphandle',
    backToPrevious: 'Buyela Emuva',
    grievancesCount: 'Izikhalo Zomphakathi',
    hotspotsCount: 'Izindawo ze-GIS',
    switchLanguage: 'Ulimi (Izilimi ezingama-33 ze-BRICS)',
    waterSanitation: 'Amanzi Nokuthuthwa Kwendle',
    energyMicrogrids: 'Amandla Nogesi Welanga',
    transportConnectivity: 'Ezokuthutha Nemigwaqo',
    healthInfrastructure: 'Ingqalasizinda Yezempilo',
    digitalPublicInfrastructure: 'Ingqalasizinda Yedijithali',
    agriculturalIrrigation: 'Ezolimo Nokunisela',
    educationSanitation: 'Imfundo Nokuthuthwa Kwendle',
    critical: 'Iphuthuma Kakhulu',
    high: 'Phezulu',
    medium: 'Phakathi',
    low: 'Phansi',
    speakText: 'Lalela Ngezwi le-Gemini AI',
    geminiAgentActive: 'I-Gemini AI Sentinel Yesifunda Iyasebenza',
  },
  mg: {
    portalTitle: 'BRICS PulseGov DPI',
    portalSubtitle: 'Fotodrafitrasa nomerika sy fitantanana ny olom-pirenena amin\'ny alalan\'ny AI',
    raiseComplaint: 'Mametraka fitarainana',
    gisHotspots: 'Toerana laharam-pahamehana GIS',
    citizenVoice: 'Fanehoan-kevitry ny vahoaka',
    aiDprStudio: 'Studio AI DPR sy Gantt',
    ministerialCopilot: 'Mpanolo-tsaina AI ho an\'ny Minisitra',
    dashboard: 'Solaitrabe',
    login: 'Hiditra',
    signUp: 'Hisoratra anarana',
    allCountries: '🌍 Firenena BRICS rehetra',
    selectCountry: 'Safidio ny firenena',
    selectRegion: 'Safidio ny faritra / faritany',
    complaintTitle: 'Lohatenin\'ny fitarainana / olana momba ny fotodrafitrasa',
    complaintDescription: 'Hazavao amin\'ny antsipiriany ny olana ara-potodrafitrasa na ny filan\'ny fiaraha-monina...',
    category: 'Sehatra fotodrafitrasa',
    urgency: 'Ambaratongam-pahasahiranana',
    submitComplaint: 'Handefa ny fitarainana',
    voiceRecording: 'Fandraisam-peo feo mivantana',
    uploadPhoto: 'Ampidiro sary porofo',
    aiAnalyzing: 'Mamakafaka sy manasokajy ny Gemini AI...',
    verificationToken: 'Kaody fanamarinana manokana',
    assignedDept: 'Sampan-draharaha misahana ny asa',
    reassuranceMsg: 'Hafatry ny fitoniana ho an\'ny olom-pirenena',
    crossBorderPicks: 'Safidy AI manerantany',
    zeroDebtGuarantee: '100% Loharano malalaka tsy misy trosa (DPG)',
    ministerOfExternalAffairs: 'Minisitry ny Raharaham-bahiny',
    backToPrevious: 'Hiverina amin\'ny pejy teo aloha',
    grievancesCount: 'Fitarainan\'ny vahoaka',
    hotspotsCount: 'Toerana GIS',
    switchLanguage: 'Fiteny (Fiteny BRICS 33)',
    waterSanitation: 'Rano sy Fidiovana',
    energyMicrogrids: 'Angovo sy Tambajotra masoandro',
    transportConnectivity: 'Fitaterana sy Lalana',
    healthInfrastructure: 'Fotodrafitrasa ara-pahasalamana',
    digitalPublicInfrastructure: 'Fotodrafitrasa nomerika ho an\'ny daholobe',
    agriculturalIrrigation: 'Fambolena sy Fari-drano',
    educationSanitation: 'Fanabeazana sy Fidiovana',
    critical: 'Tena maika',
    high: 'Maika',
    medium: 'Antonony',
    low: 'Tsy maika',
    speakText: 'Hihaino amin\'ny feon\'ny Gemini AI',
    geminiAgentActive: 'Gemini AI Regional Sentinel Active',
  }
};

// Region to Native Language mapping (e.g. Karnataka -> Kannada 'kn', Maharashtra -> Marathi 'mr', Madagascar -> Malagasy 'mg')
export const REGION_TO_LANGUAGE_MAP: Record<string, string> = {
  ind_karnataka: 'kn',
  ind_tamilnadu: 'ta',
  ind_maharashtra: 'mr',
  ind_gujarat: 'gu',
  ind_westbengal: 'bn',
  ind_punjab: 'pa',
  ind_kerala: 'ml',
  ind_andhra: 'te',
  ind_telangana: 'te',
  ind_odisha: 'or',
  ind_assam: 'as',
  ind_bihar: 'hi',
  ind_up: 'hi',
  ind_rajasthan: 'hi',
  ind_mp: 'hi',
  ind_haryana: 'hi',
  ind_delhi: 'hi',
  ind_jharkhand: 'hi',
  ind_chhattisgarh: 'hi',
  ind_himachal: 'hi',
  ind_uttarakhand: 'hi',
  ind_goa: 'mr',
  ind_jk: 'ur',
  ind_ladakh: 'hi',
  ind_tripura: 'bn',
  ind_meghalaya: 'en',
  ind_manipur: 'en',
  ind_nagaland: 'en',
  ind_mizoram: 'en',
  ind_sikkim: 'hi',
  ind_arunachal: 'hi',
  ind_puducherry: 'ta',
  ind_chandigarh: 'pa',

  // Madagascar Regions -> Malagasy
  mdg_antananarivo: 'mg',
  mdg_toamasina: 'mg',
  mdg_mahajanga: 'mg',
  mdg_fianarantsoa: 'mg',
  mdg_toliara: 'mg',
  mdg_antsiranana: 'mg',

  // Russia
  rus_yakutia: 'ru',
  rus_siberia: 'ru',
  rus_dagestan: 'ru',
  rus_karelia: 'ru',

  // China
  chn_sichuan: 'zh',
  chn_guizhou: 'zh',
  chn_gansu: 'zh',
  chn_xinjiang: 'zh',

  // Brazil
  bra_maranhao: 'pt',
  bra_bahia: 'pt',
  bra_para: 'pt',
  bra_piaui: 'pt',

  // Egypt
  egy_asyut: 'ar',
  egy_sinai: 'ar',
  egy_matrouh: 'ar',
  egy_qena: 'ar',

  // Ethiopia
  eth_somali: 'so',
  eth_oromia: 'om',
  eth_tigray: 'ti',
  eth_amhara: 'am',

  // UAE & Saudi Arabia
  uae_fujairah: 'ar',
  uae_rak: 'ar',
  uae_dhafra: 'ar',
  sau_asir: 'ar',
  sau_jazan: 'ar',
  sau_najran: 'ar',

  // Iran
  irn_sistan: 'fa',
  irn_khuzestan: 'fa',
  irn_kerman: 'fa',

  // South Africa
  za_kzn: 'zu',
  za_ec: 'xh',
  za_wc: 'af',
  za_lp: 'nso',
  za_nw: 'tn',
  za_fs: 'st',
};

// Country to Primary Native Language mapping (e.g. Madagascar -> Malagasy 'mg', India -> Hindi 'hi')
export const COUNTRY_TO_LANGUAGE_MAP: Record<string, string> = {
  madagascar: 'mg',
  india: 'hi',
  china: 'zh',
  russia: 'ru',
  brazil: 'pt',
  egypt: 'ar',
  uae: 'ar',
  saudi_arabia: 'ar',
  ethiopia: 'am',
  iran: 'fa',
  south_africa: 'zu',
};

// Mapping of internal language codes to standard BCP-47 locale tags for browser SpeechSynthesis
export const BCP47_LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  pa: 'pa-IN',
  or: 'or-IN',
  as: 'as-IN',
  mai: 'mai-IN',
  ur: 'ur-IN',
  sa: 'sa-IN',
  pt: 'pt-BR',
  ru: 'ru-RU',
  zh: 'zh-CN',
  ar: 'ar-SA',
  fa: 'fa-IR',
  am: 'am-ET',
  om: 'om-ET',
  ti: 'ti-ET',
  so: 'so-SO',
  mg: 'mg-MG',
  fr: 'fr-FR',
  af: 'af-ZA',
  zu: 'zu-ZA',
  xh: 'xh-ZA',
  nso: 'nso-ZA',
  tn: 'tn-ZA',
  st: 'st-ZA',
  ts: 'ts-ZA',
  ss: 'ss-ZA',
  ve: 've-ZA',
  nr: 'nr-ZA',
  es: 'es-ES',
  sw: 'sw-KE',
  id: 'id-ID',
  ms: 'ms-MY',
};

export interface LanguageContextType {
  currentLanguage: string;
  currentLanguageInfo: BRICSLanguageInfo;
  isRTL: boolean;
  dir: 'rtl' | 'ltr';
  setLanguage: (lang: string) => void;
  adaptLanguageForRegion: (regionId: string, silent?: boolean) => void;
  adaptLanguageForCountry: (countryId: string, silent?: boolean) => void;
  adaptationNotice: {
    languageName: string;
    nativeName: string;
    locationName: string;
  } | null;
  dismissAdaptationNotice: () => void;
  t: Translations;
  tCountry: (countryId: string) => string;
  tSector: (sectorName: string) => string;
  tUrgency: (urgency: string) => string;
  tLayer: (layer: string) => string;
  allLanguages: BRICSLanguageInfo[];
  speak: (
    text: string,
    customLang?: string,
    options?: { rate?: number; pitch?: number; onEnd?: () => void; onStart?: () => void }
  ) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  speakingLanguageName: string | null;
  // Web Speech API Voice-To-Text (Speech Recognition)
  isListening: boolean;
  listeningLanguageName: string | null;
  listenError: string | null;
  startListening: (options?: {
    lang?: string;
    continuous?: boolean;
    onResult?: (transcript: string, isFinal: boolean) => void;
    onError?: (error: string) => void;
  }) => void;
  stopListening: () => void;
  isSpeechRecognitionSupported: boolean;
  isSpeechSynthesisSupported: boolean;
  // Integrated Gemini Sovereign AI Native Voice Engine
  askGeminiVoice: (
    query: string,
    customLang?: string,
    ministerialDomain?: string
  ) => Promise<{
    markdown: string;
    spokenText: string;
    success: boolean;
    isDuplicate?: boolean;
    duplicateMessage?: string;
    isValid?: boolean;
    validityFeedback?: string;
    structuredComplaint?: any;
  }>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const RTL_LANGUAGES = ['ar', 'fa', 'ur'];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [adaptationNotice, setAdaptationNotice] = useState<{
    languageName: string;
    nativeName: string;
    locationName: string;
  } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingLanguageName, setSpeakingLanguageName] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Web Speech API STT State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [listeningLanguageName, setListeningLanguageName] = useState<string | null>(null);
  const [listenError, setListenError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const isRTL = RTL_LANGUAGES.includes(currentLanguage);
  const dir: 'rtl' | 'ltr' = isRTL ? 'rtl' : 'ltr';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = dir;
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage, dir]);

  const isSpeechRecognitionSupported =
    typeof window !== 'undefined' &&
    Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  const isSpeechSynthesisSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  const currentLanguageInfo =
    BRICS_33_LANGUAGES.find((l) => l.code === currentLanguage) || BRICS_33_LANGUAGES[0];

  // Initialize and listen to system speech synthesis voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        setAvailableVoices(voices);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Auto-adapt language when a region is selected (e.g. Karnataka -> Kannada 'kn')
  const adaptLanguageForRegion = (regionId: string, silent = false) => {
    const targetLangCode = REGION_TO_LANGUAGE_MAP[regionId];
    if (targetLangCode && targetLangCode !== currentLanguage) {
      const langObj = BRICS_33_LANGUAGES.find((l) => l.code === targetLangCode);
      setCurrentLanguage(targetLangCode);
      if (!silent && langObj) {
        setAdaptationNotice({
          languageName: langObj.name,
          nativeName: langObj.nativeName,
          locationName: regionId.replace('ind_', '').replace('mdg_', '').replace('_', ' ').toUpperCase(),
        });
        setTimeout(() => {
          setAdaptationNotice(null);
        }, 5000);
      }
    }
  };

  // Auto-adapt language when a country is selected (e.g. Madagascar -> Malagasy 'mg')
  const adaptLanguageForCountry = (countryId: string, silent = false) => {
    if (countryId === 'all') return;
    const targetLangCode = COUNTRY_TO_LANGUAGE_MAP[countryId];
    if (targetLangCode && targetLangCode !== currentLanguage) {
      const langObj = BRICS_33_LANGUAGES.find((l) => l.code === targetLangCode);
      setCurrentLanguage(targetLangCode);
      if (!silent && langObj) {
        setAdaptationNotice({
          languageName: langObj.name,
          nativeName: langObj.nativeName,
          locationName: countryId.toUpperCase(),
        });
        setTimeout(() => {
          setAdaptationNotice(null);
        }, 5000);
      }
    }
  };

  const dismissAdaptationNotice = () => setAdaptationNotice(null);

  // Build reactive translations: fallback cascade from current -> English default
  const baseDefault = ENGLISH_BASE_TRANSLATIONS;
  const legacyDict = FULL_33_TRANSLATIONS[currentLanguage] || {};
  const richDict = FULL_TRANSLATIONS_DATABASE[currentLanguage] || {};
  
  const t: Translations = {
    ...baseDefault,
    ...legacyDict,
    ...richDict,
  };

  const tCountry = (countryId: string): string => {
    const cid = (countryId || '').toLowerCase().replace(/[\s-]/g, '_');
    switch (cid) {
      case 'india':
      case 'in': return t.country_india || 'India';
      case 'brazil':
      case 'br': return t.country_brazil || 'Brazil';
      case 'south_africa':
      case 'southafrica':
      case 'za': return t.country_southAfrica || 'South Africa';
      case 'russia':
      case 'ru': return t.country_russia || 'Russia';
      case 'china':
      case 'cn': return t.country_china || 'China';
      case 'egypt':
      case 'eg': return t.country_egypt || 'Egypt';
      case 'ethiopia':
      case 'et': return t.country_ethiopia || 'Ethiopia';
      case 'iran':
      case 'ir': return t.country_iran || 'Iran';
      case 'uae':
      case 'ae': return t.country_uae || 'UAE';
      case 'saudi_arabia':
      case 'saudiarabia':
      case 'sa': return t.country_saudiArabia || 'Saudi Arabia';
      case 'madagascar':
      case 'mg': return t.country_madagascar || 'Madagascar';
      case 'all': return t.country_all || 'All Countries';
      default: return countryId || 'Country';
    }
  };

  const tSector = (sec: string): string => {
    if (!sec) return '';
    const clean = sec.toLowerCase();
    if (clean.includes('water') || clean.includes('sanitation') && !clean.includes('education')) return t.waterSanitation || sec;
    if (clean.includes('energy') || clean.includes('microgrid') || clean.includes('power')) return t.energyMicrogrids || sec;
    if (clean.includes('transport') || clean.includes('connectivity') || clean.includes('road')) return t.transportConnectivity || sec;
    if (clean.includes('health')) return t.healthInfrastructure || sec;
    if (clean.includes('digital') || clean.includes('dpi') || clean.includes('public')) return t.digitalPublicInfrastructure || sec;
    if (clean.includes('agricultur') || clean.includes('irrigation')) return t.agriculturalIrrigation || sec;
    if (clean.includes('education')) return t.educationSanitation || sec;
    if (clean === 'all' || clean.includes('all sectors')) return t.allSectors || 'All Sectors';
    return sec;
  };

  const tUrgency = (lvl: string): string => {
    switch ((lvl || '').toLowerCase()) {
      case 'critical': return t.critical || 'Critical';
      case 'high': return t.high || 'High';
      case 'medium': return t.medium || 'Medium';
      case 'low': return t.low || 'Low';
      default: return lvl;
    }
  };

  const tLayer = (layer: string): string => {
    switch ((layer || '').toLowerCase()) {
      case 'priority': return t.layerPriority || 'Priority';
      case 'vulnerability': return t.layerVulnerability || 'Vulnerability';
      case 'deficit': return t.layerDeficit || 'Deficit';
      case 'demand': return t.layerDemand || 'Demand';
      default: return layer;
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
    }
    if (audioElementRef.current) {
      try {
        audioElementRef.current.pause();
        audioElementRef.current.currentTime = 0;
      } catch (_) {}
      audioElementRef.current = null;
    }
    setIsSpeaking(false);
    setSpeakingLanguageName(null);
  };

  // Clean Markdown & format text for fluid Speech Synthesis
  const sanitizeTextForSpeech = (raw: string): string => {
    if (!raw) return '';
    return raw
      .replace(/#{1,6}\s+/g, '') // remove headings
      .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold
      .replace(/\*(.*?)\*/g, '$1') // remove italics
      .replace(/`{1,3}.*?`{1,3}/g, '') // remove code snippets
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // remove links
      .replace(/[-*•]\s+/g, '. ') // convert bullet items into spoken pauses
      .replace(/\n+/g, '. ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  };

  // 100% Guaranteed Native & Cloud TTS Speech Synthesizer across all 33 BRICS & Global Languages
  const speak = (
    text: string,
    customLang?: string,
    options?: { rate?: number; pitch?: number; onEnd?: () => void; onStart?: () => void }
  ) => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const cleanText = sanitizeTextForSpeech(text);
    if (!cleanText) return;

    const langCode = customLang || currentLanguage;
    const bcp47Tag = BCP47_LOCALE_MAP[langCode] || 'en-US';
    const langObj = BRICS_33_LANGUAGES.find((l) => l.code === langCode) || currentLanguageInfo;

    // Fallback: Cloud Audio TTS API (Guarantees zero silent failures for Odia, Gujarati, Bengali, Assamese, Malagasy, Zulu, etc.)
    const playCloudTTS = () => {
      try {
        if (audioElementRef.current) {
          audioElementRef.current.pause();
          audioElementRef.current = null;
        }
        const audioUrl = `/api/tts?text=${encodeURIComponent(cleanText)}&lang=${encodeURIComponent(langCode)}`;
        const audio = new Audio(audioUrl);
        audioElementRef.current = audio;

        audio.onplay = () => {
          setIsSpeaking(true);
          setSpeakingLanguageName(`${langObj.nativeName} (${langObj.name})`);
          options?.onStart?.();
        };

        audio.onended = () => {
          setIsSpeaking(false);
          setSpeakingLanguageName(null);
          audioElementRef.current = null;
          options?.onEnd?.();
        };

        audio.onerror = (e) => {
          console.warn('Cloud TTS playback warning:', e);
          setIsSpeaking(false);
          setSpeakingLanguageName(null);
          audioElementRef.current = null;
          options?.onEnd?.();
        };

        audio.play().catch((err) => {
          console.warn('Audio autoplay blocked or error:', err);
          setIsSpeaking(false);
          setSpeakingLanguageName(null);
          audioElementRef.current = null;
        });
      } catch (err) {
        console.warn('Cloud TTS initialization failed:', err);
        setIsSpeaking(false);
        setSpeakingLanguageName(null);
      }
    };

    // Check if browser SpeechSynthesis is available and has an exact or language-matching voice
    const hasSpeechSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window;
    if (hasSpeechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
        
        let matchingVoice = voices.find(
          (v) =>
            v.lang.toLowerCase() === bcp47Tag.toLowerCase() ||
            v.lang.replace('_', '-').toLowerCase() === bcp47Tag.toLowerCase()
        );

        if (!matchingVoice) {
          matchingVoice = voices.find((v) => v.lang.toLowerCase().startsWith(langCode.toLowerCase()));
        }

        if (!matchingVoice) {
          const langNameLower = langObj.name.toLowerCase();
          matchingVoice = voices.find((v) => v.name.toLowerCase().includes(langNameLower));
        }

        // If a real matching system voice is found, use window.speechSynthesis
        if (matchingVoice) {
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.lang = bcp47Tag;
          utterance.voice = matchingVoice;
          utterance.rate = options?.rate ?? 0.94;
          utterance.pitch = options?.pitch ?? 1.0;

          utterance.onstart = () => {
            setIsSpeaking(true);
            setSpeakingLanguageName(`${langObj.nativeName} (${langObj.name})`);
            options?.onStart?.();
          };

          utterance.onend = () => {
            setIsSpeaking(false);
            setSpeakingLanguageName(null);
            options?.onEnd?.();
          };

          utterance.onerror = (err) => {
            console.warn('SpeechSynthesis error, falling back to Cloud TTS:', err);
            // Seamlessly fall back to Cloud TTS if SpeechSynthesis failed mid-stream
            playCloudTTS();
          };

          window.speechSynthesis.speak(utterance);
          return;
        }
      } catch (e) {
        console.warn('Native speech synthesis attempt failed, routing to Cloud TTS:', e);
      }
    }

    // Direct Cloud TTS execution when no matching local voice is installed
    playCloudTTS();
  };

  // Web Speech API: Voice-To-Text (Speech-To-Text STT) in Native Country Language
  const startListening = (options?: {
    lang?: string;
    continuous?: boolean;
    onResult?: (transcript: string, isFinal: boolean) => void;
    onError?: (error: string) => void;
  }) => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const errMsg = 'Voice recognition is not supported in this browser. Please use Chrome, Safari, or Edge.';
      setListenError(errMsg);
      options?.onError?.(errMsg);
      return;
    }

    // Stop existing recognition if running
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
    }

    // Also stop any ongoing speech synthesis to prevent audio echo
    stopSpeaking();

    const langCode = options?.lang || currentLanguage;
    const bcp47Tag = BCP47_LOCALE_MAP[langCode] || 'en-US';
    const langObj = BRICS_33_LANGUAGES.find((l) => l.code === langCode) || currentLanguageInfo;

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = bcp47Tag;
      recognition.continuous = options?.continuous ?? false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setListeningLanguageName(`${langObj.nativeName} (${langObj.name})`);
        setListenError(null);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const combinedText = (finalTranscript || interimTranscript).trim();
        if (combinedText && options?.onResult) {
          options.onResult(combinedText, Boolean(finalTranscript));
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        setIsListening(false);
        setListeningLanguageName(null);
        if (event.error !== 'no-speech') {
          setListenError(`Microphone notice: ${event.error}`);
        }
        options?.onError?.(event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
        setListeningLanguageName(null);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('Failed to start speech recognition:', err);
      setIsListening(false);
      setListeningLanguageName(null);
      setListenError(err?.message || 'Could not access microphone');
      options?.onError?.(err?.message || 'Microphone error');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    setListeningLanguageName(null);
  };

  // Integrated Voice & Strategic Intelligence Engine with Gemini Sovereign Voice Agent
  const askGeminiVoice = async (
    query: string,
    customLang?: string,
    ministerialDomain?: string
  ): Promise<{
    markdown: string;
    spokenText: string;
    success: boolean;
    isDuplicate?: boolean;
    duplicateMessage?: string;
    isValid?: boolean;
    validityFeedback?: string;
    structuredComplaint?: any;
  }> => {
    const langCode = customLang || currentLanguage;
    const langObj = BRICS_33_LANGUAGES.find((l) => l.code === langCode) || currentLanguageInfo;

    try {
      const response = await fetch('/api/gemini-sovereign-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          targetLanguage: langObj.name,
          targetLanguageNative: langObj.nativeName,
          targetLanguageCode: langCode,
          ministerialDomain: ministerialDomain || 'Auto-Detect',
          actionType: 'voice_dialogue',
        }),
      });

      const data = await response.json();
      if (data.success) {
        const spoken = data.spokenSummary || data.reply;
        if (spoken) {
          speak(spoken, langCode);
        }
        return {
          markdown: data.reply,
          spokenText: spoken,
          success: true,
          isDuplicate: data.isDuplicate,
          duplicateMessage: data.duplicateMessage,
          isValid: data.isValid,
          validityFeedback: data.validityFeedback,
          structuredComplaint: data.structuredComplaint,
        };
      } else {
        const fallbackMsg = `Strategic briefing synthesized for ${langObj.nativeName}.`;
        speak(fallbackMsg, langCode);
        return {
          markdown: data.reply || fallbackMsg,
          spokenText: fallbackMsg,
          success: false,
        };
      }
    } catch (err: any) {
      console.error('Gemini Voice query error:', err);
      const errMsg = `Communication error with Gemini Sovereign Intelligence Hub.`;
      return {
        markdown: errMsg,
        spokenText: errMsg,
        success: false,
      };
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        currentLanguageInfo,
        isRTL,
        dir,
        setLanguage: setCurrentLanguage,
        adaptLanguageForRegion,
        adaptLanguageForCountry,
        adaptationNotice,
        dismissAdaptationNotice,
        t,
        tCountry,
        tSector,
        tUrgency,
        tLayer,
        allLanguages: BRICS_33_LANGUAGES,
        speak,
        stopSpeaking,
        isSpeaking,
        speakingLanguageName,
        isListening,
        listeningLanguageName,
        listenError,
        startListening,
        stopListening,
        isSpeechRecognitionSupported,
        isSpeechSynthesisSupported,
        askGeminiVoice,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
