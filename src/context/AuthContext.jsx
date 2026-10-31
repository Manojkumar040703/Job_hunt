import { createContext, useContext, useState, useEffect } from "react";
import {
  ACCOUNT_MANOJ,
  ACCOUNT_RAJ,
  ACCOUNT_RAMYA,
  ACCOUNT_HARI,
  ACCOUNT_MANOJKUMAR,
  ACCOUNT_RAVIKUMAR,
  ACCOUNT_DIVYA,
  INITIAL_CANDIDATE,
} from "../data/tamilNaduData";

const AuthContext = createContext();

const AUTH_STORAGE_KEY = "jobhunt_user_v3";
const RECRUITERS_LIST_KEY = "jobhunt_managed_recruiters_v3";
const THEME_STORAGE_KEY = "jobhunt_theme_v3";
const CUSTOM_PROFILES_KEY = "jobhunt_custom_profiles_v4";

export function AuthProvider({ children }) {
  // Saved customized profiles for Hari, Raj, Manoj, Ramya
  const [customProfiles, setCustomProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_PROFILES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_PROFILES_KEY, JSON.stringify(customProfiles));
    } catch (e) {}
  }, [customProfiles]);

  // Theme state
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) return savedTheme;
    } catch (e) {}
    return "dark";
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {}
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  // Predefined recruiter accounts managed by Admin
  const [managedRecruiters, setManagedRecruiters] = useState(() => {
    try {
      const saved = localStorage.getItem(RECRUITERS_LIST_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        ...ACCOUNT_RAVIKUMAR,
        isActive: true,
        createdAt: "2026-08-01",
      },
      {
        ...ACCOUNT_DIVYA,
        isActive: true,
        createdAt: "2026-08-15",
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(RECRUITERS_LIST_KEY, JSON.stringify(managedRecruiters));
    } catch (e) {}
  }, [managedRecruiters]);

  // Current active logged in user
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profilePhoto && parsed.profilePhoto.includes("unsplash.com")) {
          parsed.profilePhoto = null;
        }
        return parsed;
      }
    } catch (e) {}
    // Default to candidate for fresh visitors
    return INITIAL_CANDIDATE;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login"); // "login" | "register"

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {}
  }, [user]);

  // Registered users storage
  const USERS_LIST_KEY = "jobhunt_registered_users_v3";
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(USERS_LIST_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(registeredUsers));
    } catch (e) {}
  }, [registeredUsers]);

  // Secure login logic for candidates, recruiters, and admin
  function login(email, password, rolePreference = null) {
    const cleanEmail = (email || "").trim().toLowerCase();

    // 1. Check Admin Manoj
    if (
      cleanEmail === ACCOUNT_MANOJ.email.toLowerCase() ||
      cleanEmail === "manoj" ||
      cleanEmail === "manojkumar@jobhunt.com" ||
      cleanEmail === "manojkumar"
    ) {
      setUser(ACCOUNT_MANOJ);
      setIsAuthModalOpen(false);
      return { success: true, user: ACCOUNT_MANOJ };
    }

    // 2. Check Recruiter Raj
    if (
      cleanEmail === ACCOUNT_RAJ.email.toLowerCase() ||
      cleanEmail === "raj" ||
      cleanEmail === "ravikumar@jobhunt.com" ||
      cleanEmail === "ravikumar"
    ) {
      const raj = managedRecruiters.find((r) => r.id === ACCOUNT_RAJ.id || r.name === "Raj") || ACCOUNT_RAJ;
      if (!raj.isActive) {
        return { success: false, error: "This recruiter account has been deactivated by Manoj (Admin)." };
      }
      setUser(raj);
      setIsAuthModalOpen(false);
      return { success: true, user: raj };
    }

    // 3. Check Recruiter Ramya
    if (
      cleanEmail === ACCOUNT_RAMYA.email.toLowerCase() ||
      cleanEmail === "ramya" ||
      cleanEmail === "divya@jobhunt.com" ||
      cleanEmail === "divya"
    ) {
      const ramya = managedRecruiters.find((r) => r.id === ACCOUNT_RAMYA.id || r.name === "Ramya") || ACCOUNT_RAMYA;
      if (!ramya.isActive) {
        return { success: false, error: "This recruiter account has been deactivated by Manoj (Admin)." };
      }
      setUser(ramya);
      setIsAuthModalOpen(false);
      return { success: true, user: ramya };
    }

    // 4. Check Candidate Hari
    if (
      cleanEmail === ACCOUNT_HARI.email.toLowerCase() ||
      cleanEmail === "hari" ||
      cleanEmail === "karthik.subramanian@example.com"
    ) {
      setUser(ACCOUNT_HARI);
      setIsAuthModalOpen(false);
      return { success: true, user: ACCOUNT_HARI };
    }

    // 4. Check custom managed recruiters
    const customRecruiter = managedRecruiters.find((r) => r.email.toLowerCase() === cleanEmail);
    if (customRecruiter) {
      if (!customRecruiter.isActive) {
        return { success: false, error: "This recruiter account has been deactivated by Manojkumar (Admin)." };
      }
      setUser(customRecruiter);
      setIsAuthModalOpen(false);
      return { success: true, user: customRecruiter };
    }

    // 5. Check in dynamically registered users
    const foundUser = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (foundUser) {
      if (password && foundUser.password && foundUser.password !== password) {
        return { success: false, error: "Invalid password for this account." };
      }
      setUser(foundUser);
      setIsAuthModalOpen(false);
      return { success: true, user: foundUser };
    }

    // 6. Dynamic role-based login
    const isCandidate = rolePreference !== "recruiter";
    if (isCandidate) {
      const candidateUser = {
        ...INITIAL_CANDIDATE,
        id: "cand-" + Date.now(),
        email: email || INITIAL_CANDIDATE.email,
        name: email ? email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Candidate User",
        role: "candidate",
      };
      setUser(candidateUser);
      setIsAuthModalOpen(false);
      return { success: true, user: candidateUser };
    } else {
      const newRecruiter = {
        id: "recruiter-" + Date.now(),
        name: email ? email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Hiring Partner",
        email: email,
        role: "recruiter",
        company: "Tamil Nadu Enterprise",
        title: "Talent Acquisition Lead",
        district: "Chennai",
        city: "Chennai",
        state: "Tamil Nadu",
        avatar: "HR",
        isActive: true,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setManagedRecruiters((prev) => [newRecruiter, ...prev]);
      setUser(newRecruiter);
      setIsAuthModalOpen(false);
      return { success: true, user: newRecruiter };
    }
  }

  // Registration for both Candidate and Recruiter
  function register(formData) {
    const isRecruiter = formData.role === "recruiter";

    if (isRecruiter) {
      const newRecruiter = {
        id: "recruiter-" + Date.now(),
        name: formData.name || "Recruiter",
        email: formData.email.toLowerCase(),
        password: formData.password || "password",
        role: "recruiter",
        company: formData.company || "Enterprise Partner",
        title: formData.title || "Talent Acquisition Lead",
        district: formData.district || "Chennai",
        city: formData.city || "Chennai City",
        state: "Tamil Nadu",
        phone: formData.phone || "+91 98400 12345",
        avatar: (formData.company || formData.name || "R").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
        bio: formData.bio || `Hiring top engineering and professional talent in Tamil Nadu for ${formData.company || "our enterprise"}.`,
        isActive: true,
        createdAt: new Date().toISOString().split("T")[0],
      };

      setManagedRecruiters((prev) => [newRecruiter, ...prev.filter((r) => r.email !== newRecruiter.email)]);
      setRegisteredUsers((prev) => [newRecruiter, ...prev.filter((u) => u.email !== newRecruiter.email)]);
      setUser(newRecruiter);
      setIsAuthModalOpen(false);
      return { success: true, user: newRecruiter };
    }

    // Default: Candidate Registration
    const newCandidate = {
      id: "candidate-" + Date.now(),
      name: formData.name || "Candidate User",
      email: formData.email.toLowerCase(),
      password: formData.password || "password",
      role: "candidate",
      district: formData.district || "Chennai",
      city: formData.city || "Chennai City",
      state: "Tamil Nadu",
      phone: formData.phone || "+91 90000 00000",
      title: formData.title || "Active Job Seeker",
      avatar: (formData.name || "CU").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
      profilePhoto: formData.profilePhoto || null,
      skills: formData.skills
        ? formData.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : ["Python", "JavaScript", "SQL"],
      bio: formData.bio || "Active job seeker on Job Hunt looking for verified opportunities.",
      resume: {
        fileName: `${(formData.name || "Candidate").replace(/\s+/g, "_")}_Resume.pdf`,
        uploadedDate: new Date().toLocaleDateString(),
        fileSize: "190 KB",
      },
      profileCompletion: 85,
    };

    setRegisteredUsers((prev) => [newCandidate, ...prev.filter((u) => u.email !== newCandidate.email)]);
    setUser(newCandidate);
    setIsAuthModalOpen(false);
    return { success: true, user: newCandidate };
  }

  // Switch to specific predefined user with persistent custom profile changes
  function selectPredefinedAccount(accountKey) {
    const key = (accountKey || "").toLowerCase();
    let baseAccount = ACCOUNT_HARI;
    let storeKey = "hari";

    if (key === "manoj" || key === "manojkumar") {
      baseAccount = ACCOUNT_MANOJ;
      storeKey = "manoj";
    } else if (key === "raj" || key === "ravikumar") {
      baseAccount = ACCOUNT_RAJ;
      storeKey = "raj";
    } else if (key === "ramya" || key === "divya") {
      baseAccount = ACCOUNT_RAMYA;
      storeKey = "ramya";
    } else {
      baseAccount = ACCOUNT_HARI;
      storeKey = "hari";
    }

    const savedCustom = customProfiles[storeKey] || {};
    let managedMatch = null;
    if (storeKey === "raj") {
      managedMatch = managedRecruiters.find((r) => r.id === ACCOUNT_RAJ.id || r.name === "Raj" || r.email === ACCOUNT_RAJ.email);
    } else if (storeKey === "ramya") {
      managedMatch = managedRecruiters.find((r) => r.id === ACCOUNT_RAMYA.id || r.name === "Ramya" || r.email === ACCOUNT_RAMYA.email);
    }

    const mergedUser = {
      ...baseAccount,
      ...(managedMatch || {}),
      ...savedCustom,
    };

    if (mergedUser.profilePhoto && mergedUser.profilePhoto.includes("unsplash.com")) {
      mergedUser.profilePhoto = null;
    }

    setUser(mergedUser);
  }

  // Admin controls for Recruiter accounts
  function createRecruiter(recruiterData) {
    if (user?.role !== "admin") return { success: false, error: "Unauthorized. Admin access required." };

    const newRecruiter = {
      id: "recruiter-" + Date.now(),
      name: recruiterData.name,
      email: recruiterData.email.toLowerCase(),
      role: "recruiter",
      company: recruiterData.company,
      title: recruiterData.title || "Talent Acquisition Lead",
      district: recruiterData.district || "Chennai",
      city: recruiterData.city || "Chennai",
      state: "Tamil Nadu",
      avatar: (recruiterData.name || "R").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
      isActive: true,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setManagedRecruiters((prev) => [newRecruiter, ...prev]);
    return { success: true, recruiter: newRecruiter };
  }

  function toggleRecruiterStatus(recruiterId) {
    if (user?.role !== "admin") return;
    setManagedRecruiters((prev) =>
      prev.map((r) =>
        r.id === recruiterId ? { ...r, isActive: !r.isActive } : r
      )
    );
  }

  function updateRecruiter(recruiterId, updatedData) {
    if (user?.role !== "admin") return { success: false, error: "Admin access required." };
    setManagedRecruiters((prev) =>
      prev.map((r) => (r.id === recruiterId ? { ...r, ...updatedData } : r))
    );
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === recruiterId ? { ...u, ...updatedData } : u))
    );
    // Also save in customProfiles if editing Raj or Ramya
    if (recruiterId === ACCOUNT_RAJ.id || recruiterId === "user-raj") {
      setCustomProfiles((prev) => ({
        ...prev,
        raj: { ...(prev.raj || {}), ...updatedData },
      }));
    } else if (recruiterId === ACCOUNT_RAMYA.id || recruiterId === "user-ramya") {
      setCustomProfiles((prev) => ({
        ...prev,
        ramya: { ...(prev.ramya || {}), ...updatedData },
      }));
    }
    if (user?.id === recruiterId) {
      setUser((prev) => ({ ...prev, ...updatedData }));
    }
    return { success: true };
  }

  function deleteRecruiter(recruiterId) {
    if (user?.role !== "admin") return { success: false, error: "Admin access required." };
    setManagedRecruiters((prev) => prev.filter((r) => r.id !== recruiterId));
    setRegisteredUsers((prev) => prev.filter((u) => u.id !== recruiterId));
    return { success: true };
  }

  function logout() {
    setUser(null);
  }

  function updateProfile(updatedFields) {
    setUser((prev) => {
      const updated = {
        ...prev,
        ...updatedFields,
      };

      // Determine persona key to keep custom profiles persistent across persona switching
      let personaKey = "hari";
      if (updated.role === "admin" || updated.id === ACCOUNT_MANOJ.id || updated.email === ACCOUNT_MANOJ.email || updated.name === "Manoj") {
        personaKey = "manoj";
      } else if (updated.role === "recruiter" && (updated.id === ACCOUNT_RAMYA.id || updated.email === ACCOUNT_RAMYA.email || updated.name === "Ramya")) {
        personaKey = "ramya";
      } else if (updated.role === "recruiter") {
        personaKey = "raj";
      } else if (updated.role === "candidate") {
        personaKey = "hari";
      }

      setCustomProfiles((cPrev) => ({
        ...cPrev,
        [personaKey]: { ...(cPrev[personaKey] || {}), ...updated },
      }));

      return updated;
    });

    if (user?.role === "recruiter") {
      setManagedRecruiters((prev) =>
        prev.map((r) =>
          r.id === user.id || (r.email && user.email && r.email.toLowerCase() === user.email.toLowerCase())
            ? { ...r, ...updatedFields }
            : r
        )
      );
    }
    setRegisteredUsers((prev) =>
      prev.map((u) =>
        u.id === user?.id || (u.email && user?.email && u.email.toLowerCase() === user?.email.toLowerCase())
          ? { ...u, ...updatedFields }
          : u
      )
    );
  }

  function openLogin() {
    setAuthModalMode("login");
    setIsAuthModalOpen(true);
  }

  function openRegister() {
    setAuthModalMode("register");
    setIsAuthModalOpen(true);
  }

  function closeAuthModal() {
    setIsAuthModalOpen(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        theme,
        toggleTheme,
        isAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        login,
        register,
        logout,
        selectPredefinedAccount,
        managedRecruiters,
        createRecruiter,
        updateRecruiter,
        deleteRecruiter,
        toggleRecruiterStatus,
        updateProfile,
        openLogin,
        openRegister,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
