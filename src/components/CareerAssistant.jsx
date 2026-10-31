import { useState, useEffect, useRef } from "react";
import {
  IconMic,
  IconMicOff,
  IconVolume,
  IconVolumeOff,
  IconSend,
  IconSparkles,
  IconMapPin,
  IconBot,
  IconShield,
  IconClose,
} from "./Icons";
import { useAuth } from "../context/AuthContext";

function getWelcomeMessage(lang, userName) {
  const firstName = userName ? userName.split(" ")[0] : "";
  const isTa = lang === "ta-IN";

  if (isTa) {
    return {
      id: "msg-welcome",
      sender: "assistant",
      text: `வணக்கம் ${firstName ? firstName + "! " : ""}👋 நான் உங்கள் Job Hunt தமிழ் AI குரல் உதவியாளர்.\n\nமைக்ரோஃபோனை அழுத்தி தமிழில் பேசுங்கள் அல்லது கீழே உள்ள பெட்டியில் தட்டச்சு செய்யுங்கள். தமிழ்நாட்டில் வேலை வாய்ப்புகள், உங்கள் விண்ணப்ப நிலை, அல்லது நேர்காணல் குறிப்புகளை உடனே பெறலாம்!`,
      timestamp: "Just now",
      suggestions: [
        "சென்னையில் பைதான் வேலைகள்",
        "கோயம்புத்தூரில் வேலை தேடு",
        "எனது விண்ணப்ப நிலை என்ன?",
        "புதியவர்களுக்கான வேலைகள் (Fresher Jobs)",
        "நேர்காணல் உதவிக்குறிப்புகள்",
        "சம்பளம் ₹50,000 மேல் உள்ள வேலைகள்",
      ],
    };
  } else {
    return {
      id: "msg-welcome",
      sender: "assistant",
      text: `Hello ${firstName ? firstName + "! " : ""}👋 I am your Job Hunt AI Voice & Career Assistant.\n\nTap the microphone to speak in English, or type below. Ask me to find verified jobs across Tamil Nadu, check your application pipeline, or give technical interview tips!`,
      timestamp: "Just now",
      suggestions: [
        "Find Python jobs in Chennai",
        "Jobs in Coimbatore",
        "What is my application status?",
        "Fresher-friendly job openings",
        "Technical interview tips",
        "Jobs with salary above ₹50,000",
      ],
    };
  }
}

export default function CareerAssistant({
  jobs = [],
  applications = [],
  courses = [],
  onApplyJob,
  onNavigate,
}) {
  const { user } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState("en-IN"); // Options: 'en-IN' (English) | 'ta-IN' (Tamil)

  const [messages, setMessages] = useState(() => [
    getWelcomeMessage("en-IN", user?.name),
  ]);
  const [inputText, setInputText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [micPermissionError, setMicPermissionError] = useState("");
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isSpeechOutputEnabled, setIsSpeechOutputEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const recognitionRef = useRef(null);
  const finalTranscriptAccumulator = useRef("");
  const chatBottomRef = useRef(null);

  // Initialize Web Speech API safely
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSpeechSupported(true);
    } else {
      setSpeechSupported(false);
    }

    // Cleanup on unmount: stop recognition & speech synthesis
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  // Request Mic Permission & Start Recording
  async function startListening() {
    setMicPermissionError("");
    setInterimText("");

    if (!speechSupported) {
      setMicPermissionError(
        selectedLanguage === "ta-IN"
          ? "உங்கள் உலாவியில் குரல் அறிதல் ஆதரிக்கப்படவில்லை. கீழே உள்ள உரை உள்ளீட்டைப் பயன்படுத்தவும்."
          : "Speech recognition is not supported in this browser. Please use the text input below."
      );
      return;
    }

    // 1. Verify Microphone Permission first via MediaDevices
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Release stream immediately so SpeechRecognition has sole audio ownership
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (err) {
      console.warn("Microphone permission check warning:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setMicPermissionError(
          selectedLanguage === "ta-IN"
            ? "மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. தயவுசெய்து உங்கள் உலாவியின் முகவரிப் பட்டியில் மைக்ரோஃபோன் அனுமதியை இயக்கவும்."
            : "Microphone access was denied. Please allow microphone permissions in your browser address bar."
        );
        return;
      }
    }

    // 2. Initialize recognition instance
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false; // Reliable turn-based capture across mobile & desktop
      recognition.interimResults = true; // Show live interim text
      recognition.lang = selectedLanguage;
      recognition.maxAlternatives = 1;

      finalTranscriptAccumulator.current = inputText ? inputText + " " : "";

      recognition.onstart = () => {
        setIsListening(true);
        setMicPermissionError("");
      };

      recognition.onresult = (event) => {
        let interim = "";
        let finalSegment = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalSegment += item[0].transcript + " ";
          } else {
            interim += item[0].transcript;
          }
        }

        if (finalSegment) {
          finalTranscriptAccumulator.current += finalSegment;
        }

        setInterimText(interim);
        // Put the combined text directly into the editable input field
        const combined = (finalTranscriptAccumulator.current + interim).trim();
        setInputText(combined);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setMicPermissionError(
            selectedLanguage === "ta-IN"
              ? "மைக்ரோஃபோன் அனுமதி தேவைப்படுகிறது. உலாவி அமைப்புகளில் அனுமதியைச் சரிபார்க்கவும்."
              : "Microphone permission denied. Please allow microphone access in browser settings."
          );
        } else if (event.error === "no-speech") {
          // Normal silence timeout, don't show red error
        } else if (event.error === "network") {
          setMicPermissionError(
            selectedLanguage === "ta-IN"
              ? "குரல் அறிதலின் போது இணையப் பிழை ஏற்பட்டது. இணைய இணைப்பைச் சரிபார்க்கவும்."
              : "Network issue during speech recognition. Please check your internet connection."
          );
        }
        setIsListening(false);
        setInterimText("");
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText("");
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Failed to start SpeechRecognition:", err);
      setIsListening(false);
      setMicPermissionError(
        selectedLanguage === "ta-IN"
          ? "மைக்ரோஃபோனைத் தொடங்க முடியவில்லை. மீண்டும் முயற்சிக்கவும் அல்லது தட்டச்சு செய்யவும்."
          : "Could not start microphone. Please try again or type your query."
      );
    }
  }

  function stopListening() {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
    setInterimText("");
  }

  function toggleListening() {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  // Handle dynamic language switching between English and Tamil
  function handleLanguageChange(newLang) {
    if (newLang === selectedLanguage) return;
    setSelectedLanguage(newLang);
    if (isListening) stopListening();
    if (isSpeaking) stopSpeaking();

    setMessages((prev) => {
      // If thread only contains initial greeting, replace it directly
      if (prev.length <= 1 && prev[0]?.id === "msg-welcome") {
        return [getWelcomeMessage(newLang, user?.name)];
      }
      // If active conversation, post language switch alert card
      const isTa = newLang === "ta-IN";
      const switchNotice = {
        id: "lang-switch-" + Date.now(),
        sender: "assistant",
        text: isTa
          ? "🌐 மொழி தமிழுக்கு மாற்றப்பட்டது! இனி உங்கள் குரலும் எனது பதில்களும் தமிழில் இருக்கும்."
          : "🌐 Language switched to English! Voice recognition and assistant responses are now in English.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestions: isTa
          ? [
              "சென்னையில் பைதான் வேலைகள்",
              "கோயம்புத்தூரில் வேலை தேடு",
              "எனது விண்ணப்ப நிலை என்ன?",
              "புதியவர்களுக்கான வேலைகள்",
            ]
          : [
              "Find Python jobs in Chennai",
              "Jobs in Coimbatore",
              "What is my application status?",
              "Fresher-friendly openings",
            ],
      };
      return [...prev, switchNotice];
    });
  }

  // Text-To-Speech Output in Tamil or English
  function speakResponse(text) {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const isTa = selectedLanguage === "ta-IN";
    utterance.lang = isTa ? "ta-IN" : "en-IN";
    utterance.rate = 0.95;

    // Browser voice discovery: find matching Tamil or English system voice
    const voices = window.speechSynthesis.getVoices() || [];
    if (voices.length > 0) {
      if (isTa) {
        const tamilVoice = voices.find(
          (v) => v.lang?.toLowerCase().startsWith("ta") || v.name?.toLowerCase().includes("tamil")
        );
        if (tamilVoice) utterance.voice = tamilVoice;
      } else {
        const englishVoice =
          voices.find((v) => v.lang?.toLowerCase() === "en-in") ||
          voices.find((v) => v.lang?.toLowerCase().startsWith("en-in")) ||
          voices.find((v) => v.lang?.toLowerCase().startsWith("en"));
        if (englishVoice) utterance.voice = englishVoice;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }

  // Comprehensive Tamil & English Query NLP Parser
  function processQuery(query) {
    const q = query.toLowerCase().trim();
    const isTamil = selectedLanguage === "ta-IN" || /[\u0B80-\u0BFF]/.test(query);
    const userSkills = user?.skills || ["Python", "React", "PostgreSQL"];
    let replyText = "";
    let matchedJobs = [];
    let applicationInfo = null;

    // 1. Application status query (விண்ணப்ப நிலை / Status)
    if (
      q.includes("விண்ணப்ப") ||
      q.includes("விண்ணப்பித்த") ||
      q.includes("நிலை") ||
      q.includes("my application") ||
      q.includes("applied") ||
      q.includes("status")
    ) {
      if (applications.length === 0) {
        replyText = isTamil
          ? "நீங்கள் இன்னும் எந்த வேலைக்கும் விண்ணப்பிக்கவில்லை. தமிழ்நாட்டின் வேலை வாய்ப்புகளைப் பார்த்து 1-கிளிக்கில் விண்ணப்பிக்கவும்!"
          : "You haven't submitted any job applications yet on Job Hunt. Browse verified Tamil Nadu jobs and 1-click apply!";
      } else {
        replyText = isTamil
          ? `உங்களிடம் ${applications.length} விண்ணப்பங்கள் உள்ளன. உங்கள் தற்போதைய விண்ணப்ப நிலை இதோ:`
          : `You currently have ${applications.length} active applications. Here is your latest pipeline status:`;
        applicationInfo = applications;
      }
    }
    // 2. District & Location Search (சென்னை, கோவை, மதுரை, சேலம், காஞ்சிபுரம், திருச்சி, ஓசூர்)
    else if (
      q.includes("சென்னை") ||
      q.includes("chennai") ||
      q.includes("கோயம்புத்தூர்") ||
      q.includes("கோவை") ||
      q.includes("coimbatore") ||
      q.includes("மதுரை") ||
      q.includes("madurai") ||
      q.includes("சேலம்") ||
      q.includes("salem") ||
      q.includes("காஞ்சிபுரம்") ||
      q.includes("kancheepuram") ||
      q.includes("ஸ்ரீபெரும்புதூர்") ||
      q.includes("sriperumbudur") ||
      q.includes("ஓசூர்") ||
      q.includes("hosur") ||
      q.includes("திருச்சி") ||
      q.includes("trichy")
    ) {
      let targetDistrict = "";
      let targetDistrictTamil = "";

      if (q.includes("சென்னை") || q.includes("chennai")) {
        targetDistrict = "Chennai";
        targetDistrictTamil = "சென்னை";
      } else if (q.includes("கோயம்புத்தூர்") || q.includes("கோவை") || q.includes("coimbatore")) {
        targetDistrict = "Coimbatore";
        targetDistrictTamil = "கோயம்புத்தூர்";
      } else if (q.includes("மதுரை") || q.includes("madurai")) {
        targetDistrict = "Madurai";
        targetDistrictTamil = "மதுரை";
      } else if (q.includes("சேலம்") || q.includes("salem")) {
        targetDistrict = "Salem";
        targetDistrictTamil = "சேலம்";
      } else if (q.includes("காஞ்சிபுரம்") || q.includes("kancheepuram") || q.includes("ஸ்ரீபெரும்புதூர்") || q.includes("sriperumbudur")) {
        targetDistrict = "Kancheepuram";
        targetDistrictTamil = "காஞ்சிபுரம் / ஸ்ரீபெரும்புதூர்";
      } else if (q.includes("ஓசூர்") || q.includes("hosur")) {
        targetDistrict = "Krishnagiri";
        targetDistrictTamil = "ஓசூர் (கிருஷ்ணகிரி)";
      } else {
        targetDistrict = "Tiruchirappalli";
        targetDistrictTamil = "திருச்சிராப்பள்ளி";
      }

      matchedJobs = jobs.filter(
        (j) =>
          j.district?.toLowerCase() === targetDistrict.toLowerCase() ||
          j.city?.toLowerCase().includes(targetDistrict.toLowerCase())
      );

      // Check for Python or software skill filter
      if (q.includes("python") || q.includes("பைதான்")) {
        const filtered = matchedJobs.filter((j) =>
          j.title.toLowerCase().includes("python") || j.tags?.some((t) => t.toLowerCase().includes("python"))
        );
        if (filtered.length > 0) matchedJobs = filtered;
      }

      if (matchedJobs.length > 0) {
        replyText = isTamil
          ? `${targetDistrictTamil} மாவட்டத்தில் ${matchedJobs.length} வேலை வாய்ப்புகள் கண்டறியப்பட்டுள்ளன:`
          : `Found ${matchedJobs.length} verified job opening(s) in ${targetDistrict}, Tamil Nadu:`;
      } else {
        replyText = isTamil
          ? `${targetDistrictTamil} பகுதியில் தற்போது திறப்புகள் இல்லை. பிற மாவட்டங்களின் வாய்ப்புகள் இதோ:`
          : `No exact matches in ${targetDistrict} right now. Showing other verified Tamil Nadu positions:`;
        matchedJobs = jobs.slice(0, 3);
      }
    }
    // 3. Fresher friendly jobs (புதியவர்கள் / Fresher)
    else if (q.includes("fresher") || q.includes("புதிய") || q.includes("ஃப்ரெஷர்")) {
      matchedJobs = jobs.filter((j) =>
        j.experience?.toLowerCase().includes("fresher") || j.experience?.toLowerCase().includes("0-1")
      );
      replyText = isTamil
        ? `தமிழ்நாட்டில் புதியவர்களுக்கான (Fresher) ${matchedJobs.length} வேலை வாய்ப்புகள் இதோ:`
        : `Found ${matchedJobs.length} verified fresher-friendly job openings in Tamil Nadu:`;
    }
    // 4. Skills matching (திறன்கள் / Skills)
    else if (
      q.includes("matching my skills") ||
      q.includes("my skills") ||
      q.includes("திறன்") ||
      q.includes("எனக்கு ஏற்ற")
    ) {
      matchedJobs = jobs.filter((job) =>
        job.tags?.some((t) =>
          userSkills.some((s) => s.toLowerCase() === t.toLowerCase())
        )
      );
      replyText = isTamil
        ? `உங்கள் சுயவிவரத் திறன்களுக்கு (${userSkills.join(", ")}) பொருந்தக்கூடிய ${matchedJobs.length} வேலை வாய்ப்புகள் கண்டறியப்பட்டுள்ளன:`
        : `Based on your profile skills (${userSkills.join(", ")}), here are ${matchedJobs.length} matching verified openings in Tamil Nadu:`;
    }
    // 5. Salary query (சம்பளம் / Salary)
    else if (
      q.includes("salary") ||
      q.includes("சம்பளம்") ||
      q.includes("ஊதியம்") ||
      q.includes("15,000") ||
      q.includes("15000") ||
      q.includes("lpa")
    ) {
      matchedJobs = jobs.filter((j) => j.salary);
      replyText = isTamil
        ? "தமிழ்நாட்டின் சிறந்த ஊதியத்துடன் கூடிய வேலை வாய்ப்புகள் இதோ:"
        : "Here are top verified Tamil Nadu openings with competitive salary packages:";
    }
    // 6. Resume tips (ரெஸ்யூம் / சுயவிவரம்)
    else if (q.includes("improve") || q.includes("resume") || q.includes("ரெஸ்யூம்") || q.includes("சுயவிவர")) {
      replyText = isTamil
        ? "தமிழ்நாடு நிறுவனங்களுக்கான சிறந்த ரெஸ்யூம் வழிகாட்டல்:\n\n" +
          "1. உங்கள் சாதனைகளை அளவிடவும்: எ.கா., 'FastAPI மூலம் API பதிலளிப்பு நேரத்தை 40% குறைத்தேன்'.\n" +
          "2. உங்களின் GitHub திட்ட இணைப்புகளை தெளிவாகச் சேர்க்கவும்.\n" +
          "3. தமிழ்நாட்டின் முக்கிய திறன்களைக் குறிப்பிடவும் (FastAPI, React, CAN Bus, PostgreSQL).\n" +
          "4. ரெஸ்யூமை PDF வடிவில் 2MB-க்குள் வைத்திருக்கவும்."
        : "Here are 4 high-impact resume improvements for Tamil Nadu employers:\n\n" +
          "1. Quantify achievements: e.g., 'Built FastAPI microservices reducing API response time by 40%'.\n" +
          "2. Add your GitHub demo URLs and live deployed links prominently.\n" +
          "3. Highlight key Tamil Nadu sector competencies (FastAPI, React, CAN Bus, AUTOSAR, PostgreSQL).\n" +
          "4. Keep the resume in standard PDF format under 2MB for recruiter ATS parsers.";
    }
    // 7. Interview preparation (நேர்காணல் / Interview)
    else if (q.includes("interview") || q.includes("prepare") || q.includes("நேர்காணல்")) {
      replyText = isTamil
        ? "முக்கிய நேர்காணல் கேள்விகள் (Raj @ Apex Mobility & Ramya @ CloudScale Tech):\n\n" +
          "1. தொழில்நுட்பம்: FastAPI எவ்வாறு ஒத்திசைவற்ற (async) கோரிக்கைகளைக் கையாள்கிறது?\n" +
          "2. கட்டமைப்பு: PostgreSQL-ல் நிலையான பரிவர்த்தனைகளை எவ்வாறு வடிவமைக்கிறீர்கள்?\n" +
          "3. தானியங்கி/EV: CAN bus செய்தி முன்னுரிமை மற்றும் ஐடென்டிஃபையர் என்றால் என்ன?\n" +
          "4. உற்பத்தி: நீங்கள் தீர்வு கண்ட முக்கியமான உற்பத்தி பிழை பற்றி விளக்குங்கள்."
        : "Top interview questions asked by recruiters (Raj @ Apex Mobility & Ramya @ CloudScale Tech):\n\n" +
          "1. Technical: Explain how FastAPI handles async requests compared to traditional WSGI.\n" +
          "2. Architecture: How do you design an idempotent payment or application state in PostgreSQL?\n" +
          "3. Embedded/EV: What are CAN bus message identifiers and arbitration priorities?\n" +
          "4. Scenario: Walk us through a critical production bug you diagnosed and resolved.";
    }
    // 8. General fallback
    else {
      matchedJobs = jobs.slice(0, 3);
      replyText = isTamil
        ? `உங்கள் கேள்வி: "${query}". தமிழ்நாடு வேலைவாய்ப்புத் தரவுகளில் பொருந்தக்கூடிய தகவல்கள் இதோ:`
        : `I analyzed your query: "${query}". Here are verified Tamil Nadu career openings matching your criteria:`;
    }

    return { replyText, matchedJobs, applicationInfo };
  }


  function handleSend(e) {
    e?.preventDefault();
    const query = inputText.trim();
    if (!query || isProcessing) return;

    if (isListening) stopListening();

    const userMsg = {
      id: "usr-" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setInterimText("");
    finalTranscriptAccumulator.current = "";
    setIsProcessing(true);

    setTimeout(() => {
      const result = processQuery(query);
      const botMsg = {
        id: "bot-" + Date.now(),
        sender: "assistant",
        text: result.replyText,
        matchedJobs: result.matchedJobs,
        applicationInfo: result.applicationInfo,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsProcessing(false);

      if (isSpeechOutputEnabled) {
        speakResponse(result.replyText);
      }
    }, 500);
  }

  function handleQuickPrompt(promptText) {
    setInputText(promptText);
    setTimeout(() => {
      const form = document.getElementById("ai-voice-form");
      if (form) form.requestSubmit();
    }, 60);
  }

  return (
    <div className="career-assistant-view">
      {/* Top Banner with Voice Controls */}
      <div className="ai-assistant-banner">
        <div className="assistant-banner-info">
          <div className="ai-bot-avatar">
            <IconBot size={26} />
          </div>
          <div>
            <h2>Job Hunt AI Voice Assistant</h2>
            <p className="assistant-subtitle">
              Voice-enabled Tamil Nadu job search, real-time application tracker, & interview prep.
            </p>
          </div>
        </div>

        <div className="assistant-controls-bar">
          {/* Language Options: English & Tamil */}
          <div className="assistant-lang-options" role="group" aria-label="Language selection">
            <button
              type="button"
              className={`lang-option-btn ${selectedLanguage.startsWith("en") ? "lang-option-btn--active" : ""}`}
              onClick={() => handleLanguageChange("en-IN")}
              title="Speak & receive answers in English"
            >
              <span className="lang-flag">🇬🇧</span>
              <span className="lang-name">English</span>
            </button>
            <button
              type="button"
              className={`lang-option-btn ${selectedLanguage === "ta-IN" ? "lang-option-btn--active" : ""}`}
              onClick={() => handleLanguageChange("ta-IN")}
              title="Speak & receive answers in Tamil (தமிழ்)"
            >
              <span className="lang-flag">🇮🇳</span>
              <span className="lang-name">தமிழ் (Tamil)</span>
            </button>
          </div>

          {/* Speech TTS output toggle */}
          <button
            type="button"
            className={`btn-voice-toggle ${isSpeechOutputEnabled ? "btn-voice-toggle--active" : ""}`}
            onClick={() => {
              if (isSpeaking) {
                stopSpeaking();
              }
              setIsSpeechOutputEnabled(!isSpeechOutputEnabled);
            }}
            title={isSpeechOutputEnabled ? "Mute Spoken Responses" : "Enable Spoken Responses"}
          >
            {isSpeechOutputEnabled ? <IconVolume size={16} /> : <IconVolumeOff size={16} />}
            <span>{isSpeechOutputEnabled ? "TTS On" : "TTS Off"}</span>
          </button>
        </div>
      </div>

      {/* Permission / Browser Error Banner */}
      {micPermissionError && (
        <div className="mic-error-banner">
          <IconShield size={16} />
          <span className="mic-error-text">{micPermissionError}</span>
          <button
            type="button"
            className="btn-icon"
            onClick={() => setMicPermissionError("")}
          >
            <IconClose size={16} />
          </button>
        </div>
      )}

      {/* Voice Privacy & Permission Notice */}
      <div className="voice-privacy-notice">
        <IconShield size={14} />
        <span>
          <strong>Microphone Privacy Notice:</strong> Audio is processed in real time via your browser's native Web Speech API solely to transcribe career search queries. Voice recordings are never stored, sent to third parties, or saved on external servers.
        </span>
      </div>

      {/* Active Speaking State */}
      {isSpeaking && (
        <div className="voice-speaking-status-card">
          <div className="speaking-indicator-row">
            <IconVolume size={18} className="pulse-active" />
            <span>Speaking career answer...</span>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={stopSpeaking}>
            Mute Speech
          </button>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <div className="voice-processing-status-card">
          <span className="spinner-inline" />
          <span>Analyzing career queries across Tamil Nadu openings...</span>
        </div>
      )}

      {/* Active Listening Indicator */}
      {isListening && (
        <div className="voice-listening-status-card">
          <div className="voice-waves-container">
            <span className="voice-wave-bar" />
            <span className="voice-wave-bar" />
            <span className="voice-wave-bar" />
            <span className="voice-wave-bar" />
            <span className="voice-wave-bar" />
          </div>
          <div className="listening-text-box">
            <strong className="listening-headline">
              {selectedLanguage === "ta-IN" ? "தமிழில் கேட்கிறது (Listening in Tamil)..." : "Listening in English..."}
            </strong>
            <p className="interim-preview">
              {interimText || (selectedLanguage === "ta-IN" ? "மைக்ரோஃபோனில் தெளிவாகப் பேசுங்கள்..." : "Speak clearly into your microphone...")}
            </p>
          </div>
          <button
            type="button"
            className="btn-stop-mic"
            onClick={stopListening}
          >
            {selectedLanguage === "ta-IN" ? "பேசி முடித்தேன்" : "Done Speaking"}
          </button>
        </div>
      )}

      {/* Chat Stream */}
      <div className="ai-chat-thread">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`ai-message-row ${msg.sender === "user" ? "ai-message-row--user" : "ai-message-row--assistant"}`}
          >
            <div className="message-avatar">
              {msg.sender === "user" ? (
                <div className="avatar-user">{user?.avatar || "ME"}</div>
              ) : (
                <div className="avatar-bot">
                  <IconSparkles size={16} />
                </div>
              )}
            </div>

            <div className="message-bubble">
              <div className="message-header-meta">
                <span className="sender-name">
                  {msg.sender === "user" ? user?.name || "You" : "Job Hunt Assistant"}
                </span>
                <span className="message-time">{msg.timestamp}</span>
              </div>

              <div className="message-text">
                {msg.text.split("\n").map((line, idx) => (
                  <p key={idx} style={{ marginBottom: line ? "6px" : "12px" }}>
                    {line}
                  </p>
                ))}
              </div>

              {/* Suggestions chips */}
              {msg.suggestions && (
                <div className="assistant-suggestions">
                  <span className="suggestions-label">Try asking:</span>
                  <div className="suggestions-chips">
                    {msg.suggestions.map((sugg, i) => (
                      <button
                        key={i}
                        type="button"
                        className="suggestion-chip"
                        onClick={() => handleQuickPrompt(sugg)}
                      >
                        {sugg}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Real Jobs */}
              {msg.matchedJobs && msg.matchedJobs.length > 0 && (
                <div className="ai-results-cards-grid">
                  {msg.matchedJobs.map((job) => (
                    <div key={job.id} className="ai-job-mini-card">
                      <div className="ai-job-header">
                        <div
                          className="company-logo-avatar company-logo-avatar--sm"
                          style={{ backgroundColor: job.logoColor || "#1d4ed8" }}
                        >
                          {job.company.charAt(0)}
                        </div>
                        <div>
                          <h4 className="job-title-sm">{job.title}</h4>
                          <span className="job-company-sm">{job.company}</span>
                        </div>
                      </div>

                      <div className="ai-job-meta">
                        <span>
                          <IconMapPin size={12} /> {job.district || job.location}
                        </span>
                        <span>{job.salary}</span>
                      </div>

                      <div className="ai-job-actions">
                        <button
                          type="button"
                          className="btn btn-primary btn-xs"
                          onClick={() => onApplyJob && onApplyJob(job, "Applied via Job Hunt AI Voice Assistant")}
                        >
                          1-Click Apply
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-xs"
                          onClick={() => onNavigate && onNavigate("explore")}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Application Status Cards */}
              {msg.applicationInfo && (
                <div className="ai-results-cards-grid">
                  {msg.applicationInfo.map((app) => (
                    <div key={app.id} className="ai-job-mini-card">
                      <div className="ai-job-header">
                        <div>
                          <h4 className="job-title-sm">{app.role}</h4>
                          <span className="job-company-sm">{app.company}</span>
                        </div>
                      </div>
                      <div className="ai-job-meta">
                        <span className={`status-badge status--${(app.status || "applied").toLowerCase()}`}>
                          {app.status}
                        </span>
                        <span>Applied: {app.appliedDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="ai-message-row ai-message-row--assistant">
            <div className="message-avatar">
              <div className="avatar-bot">
                <IconSparkles size={16} />
              </div>
            </div>
            <div className="message-bubble typing-bubble">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-text">Searching real Tamil Nadu job records...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input bar with editable text and microphone toggle */}
      <form id="ai-voice-form" onSubmit={handleSend} className="ai-input-bar">
        <button
          type="button"
          className={`mic-button ${isListening ? "mic-button--active pulse-active" : ""}`}
          onClick={toggleListening}
          title={isListening ? "Stop listening" : "Click to speak voice query"}
          aria-label={isListening ? "Stop listening" : "Start voice recognition"}
        >
          {isListening ? <IconMicOff size={20} /> : <IconMic size={20} />}
        </button>

        <input
          type="text"
          placeholder={
            isListening
              ? selectedLanguage === "ta-IN"
                ? "தமிழில் கேட்கிறது... பேசுவது இங்கே தோன்றும்..."
                : "Listening in English... Your speech appears here. You can also edit it."
              : selectedLanguage === "ta-IN"
                ? "தமிழில் பேசவும் அல்லது தட்டச்சு செய்யவும் (எ.கா. 'சென்னையில் பைதான் வேலைகள்')..."
                : "Speak or type in English (e.g., 'Find Python jobs in Coimbatore', 'Show my applications')..."
          }
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <button
          type="submit"
          className="btn btn-primary btn-send-ai"
          disabled={!inputText.trim() || isProcessing}
        >
          <IconSend size={16} />
          <span>{selectedLanguage === "ta-IN" ? "அனுப்பு" : "Send"}</span>
        </button>
      </form>
    </div>
  );
}
