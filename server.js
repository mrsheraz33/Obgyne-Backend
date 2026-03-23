require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(
  cors({
    origin: [
    process.env.CLIENT_URL,
    "https://www.obsgynesimplified.com",
    "https://obsgynesimplified.com"
    ],
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/enrollments", require("./routes/enrollments"));
app.use("/api/admin", require("./routes/admin"));
app.get("/api/health", (req, res) =>
  res.json({ success: true, message: "OBGyne API is running 🚀" }),
);
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" }),
);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ success: false, message: "Server error", error: err.message });
});

// ═══════════════════════════════
// SEED DATA
// ═══════════════════════════════
const seedData = async () => {
  const User = require("./models/User");
  const Course = require("./models/Course");

  // ── Admin ──
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      await User.create({
        name: "Dr. Mariam",
        email: "gyneoobs@gmail.com",
        password: "obsgynesimplified@H26",
        role: "admin",
      });
      console.log("✅ Admin created");
    } else {
      console.log("✅ Admin exists:", adminExists.email);
    }
  } catch (err) {
    if (err.code === 11000) {
      console.log("✅ Admin already exists in database");
    } else {
      console.error("Admin seed error:", err.message);
    }
  }

  // ── Courses ──
  const count = await Course.countDocuments();
  if (count > 0) {
    console.log(`✅ ${count} courses already exist`);
    return;
  }
  console.log("🌱 Seeding 3 courses...");

  await Course.insertMany([
   
    // In server.js, replace the Theory Group course with:

    {
      title: "Theory Group",
      slug: "theory-group",
      shortDesc:
        "Complete OB/GYN theory preparation with TOACS-style modules & video lectures",
      description:
        "A comprehensive theory preparation course covering all major OB/GYN topics. Structured modules with video lectures, mnemonics, SAQs and MCQ practice.",
      instructor: "Dr. Mariam",
      tags: ["FCPS", "MCPS", "Theory", "MCQs", "SAQs", "Video Lectures"],
      level: "Intermediate",
      language: "Urdu / English",
      isPaid: true,
      isFree: false,
      enrollmentCount: 520,
      rating: 4.9,
      totalReviews: 210,
      colorTheme: "teal",
      iconClass: "fa-book-medical",
      badge: "Most Popular",
      hasModules: true, // ← CHANGE: Now has modules like TOACS
      whatYouLearn: [
        "Complete FCPS Part 1 & MCPS theory syllabus",
        "High-yield MCQs from past papers with explanations",
        "Mnemonics for quick recall in exams",
        "SAQ model answers and essay techniques",
        "Exam strategy and time management",
        "Video lectures for key topics",
      ],
      requirements: ["MBBS degree", "Preparing for FCPS/MCPS written exam"],
      modules: [
        {
          title: "Obstetrics Module",
          order: 1,
          lessons: [
            {
              title: "Normal Pregnancy & Physiology",
              duration: "40 min",
              isFree: true,
              order: 1,
              videoUrl: null,
            },
            {
              title: "Antenatal Care & Screening",
              duration: "35 min",
              isFree: false,
              order: 2,
              videoUrl: null,
            },
            {
              title: "Hypertensive Disorders in Pregnancy",
              duration: "45 min",
              isFree: false,
              order: 3,
              videoUrl: null,
            },
            {
              title: "Antepartum Haemorrhage (APH)",
              duration: "38 min",
              isFree: false,
              order: 4,
              videoUrl: null,
            },
            {
              title: "Preterm Labour & PROM",
              duration: "32 min",
              isFree: false,
              order: 5,
              videoUrl: null,
            },
            {
              title: "Normal & Abnormal Labour",
              duration: "42 min",
              isFree: false,
              order: 6,
              videoUrl: null,
            },
          ],
        },
        {
          title: "Gynaecology Module",
          order: 2,
          lessons: [
            {
              title: "Menstrual Disorders & DUB",
              duration: "38 min",
              isFree: false,
              order: 1,
              videoUrl: null,
            },
            {
              title: "Polycystic Ovary Syndrome (PCOS)",
              duration: "32 min",
              isFree: false,
              order: 2,
              videoUrl: null,
            },
            {
              title: "Endometriosis & Adenomyosis",
              duration: "28 min",
              isFree: false,
              order: 3,
              videoUrl: null,
            },
            {
              title: "Uterine Fibroids (Leiomyoma)",
              duration: "30 min",
              isFree: false,
              order: 4,
              videoUrl: null,
            },
            {
              title: "Infertility — Investigation & Management",
              duration: "40 min",
              isFree: false,
              order: 5,
              videoUrl: null,
            },
          ],
        },
        {
          title: "Contraception Module",
          order: 3,
          lessons: [
            {
              title: "Contraception — Complete Guide",
              duration: "35 min",
              isFree: false,
              order: 1,
              videoUrl: "https://youtu.be/bzhwQV9OvZ8?si=uyEY9WAhp3HaQLUk", // ← VIDEO LINK ADDED
            },
          ],
        },
        {
          title: "MCQ & Exam Practice Module",
          order: 4,
          lessons: [
            {
              title: "MCQ Practice — Obstetrics",
              duration: "60 min",
              isFree: false,
              order: 1,
              videoUrl: null,
            },
            {
              title: "MCQ Practice — Gynaecology",
              duration: "60 min",
              isFree: false,
              order: 2,
              videoUrl: null,
            },
            {
              title: "SAQ & Essay Techniques",
              duration: "45 min",
              isFree: false,
              order: 3,
              videoUrl: null,
            },
            {
              title: "Final Revision & Mock Paper",
              duration: "90 min",
              isFree: false,
              order: 4,
              videoUrl: null,
            },
          ],
        },
      ],
    },

    // ══ COURSE 2: TOACS GROUP ══
    {
      title: "TOACS Preparatory Group",
      slug: "toacs-group",
      shortDesc:
        "Complete TOACS preparation organised into modules — Oncology, Obstetrics, Gynae & more.",
      description:
        "A structured TOACS preparation course organised into clinical modules. Each module covers a major OB/GYN area with model OSCE answers, marking criteria, and examiner tips from Dr. Mariam.",
      instructor: "Dr. Mariam",
      tags: ["TOACS", "OSCE", "Clinical", "Stations", "Modules"],
      level: "All Levels",
      language: "Urdu / English",
      isPaid: true,
      isFree: false,
      enrollmentCount: 380,
      rating: 4.9,
      totalReviews: 165,
      colorTheme: "purple",
      iconClass: "fa-stethoscope",
      badge: "Enrolling Now",
      hasModules: true,
      whatYouLearn: [
        "12 comprehensive modules including key stations, recalls, and mock exam solutions",
        "Clinical Governance module with 15+ recall questions",
        "Access to both live and recorded sessions, plus flashcards",
        "Individual case presentations by each student",
        "Structured, module-by-module preparation approach",
        "Complete study resources available on the website",
      ],
      // requirements: ['MBBS degree', 'Registered for TOACS examination'],
      modules: [
        {
          title: "Oncology Module",
          order: 1,
          lessons: [
            {
              title: "Introduction to Oncology Stations",
              duration: "15 min",
              isFree: true,
              order: 1,
            },
            {
              title: "Breast Cancer — History & Management",
              duration: "35 min",
              isFree: false,
              order: 2,
            },
            {
              title: "Cervical Cancer & CIN Stations",
              duration: "38 min",
              isFree: false,
              order: 3,
            },
            {
              title: "Ovarian Cancer — Presentation & Mx",
              duration: "35 min",
              isFree: false,
              order: 4,
            },
            {
              title: "Endometrial Cancer Station",
              duration: "30 min",
              isFree: false,
              order: 5,
            },
            {
              title: "Vulvar Cancer",
              duration: "25 min",
              isFree: false,
              order: 6,
            },
            {
              title: "Gestational Trophoblastic Disease",
              duration: "28 min",
              isFree: false,
              order: 7,
            },
            {
              title: "Oncology OSCE Practice Stations",
              duration: "45 min",
              isFree: false,
              order: 8,
            },
          ],
        },
        {
          title: "Obstetrics Module",
          order: 2,
          lessons: [
            {
              title: "Normal Labour — Station Approach",
              duration: "30 min",
              isFree: false,
              order: 1,
            },
            {
              title: "Antepartum Haemorrhage Station",
              duration: "32 min",
              isFree: false,
              order: 2,
            },
            {
              title: "Preeclampsia & Eclampsia Stations",
              duration: "35 min",
              isFree: false,
              order: 3,
            },
            {
              title: "Postpartum Haemorrhage Station",
              duration: "30 min",
              isFree: false,
              order: 4,
            },
            {
              title: "Ectopic Pregnancy Station",
              duration: "28 min",
              isFree: false,
              order: 5,
            },
            {
              title: "Miscarriage Counselling Station",
              duration: "25 min",
              isFree: false,
              order: 6,
            },
            {
              title: "Obstetric Emergency Scenarios",
              duration: "40 min",
              isFree: false,
              order: 7,
            },
            {
              title: "Antenatal Care Stations",
              duration: "30 min",
              isFree: false,
              order: 8,
            },
          ],
        },
        {
          title: "Gynaecology Module",
          order: 3,
          lessons: [
            {
              title: "Menstrual Disorders Station",
              duration: "28 min",
              isFree: false,
              order: 1,
            },
            {
              title: "PCOS — History & Counselling",
              duration: "30 min",
              isFree: false,
              order: 2,
            },
            {
              title: "Infertility Consultation Station",
              duration: "35 min",
              isFree: false,
              order: 3,
            },
            {
              title: "Endometriosis Station",
              duration: "25 min",
              isFree: false,
              order: 4,
            },
            {
              title: "Uterine Fibroid Station",
              duration: "28 min",
              isFree: false,
              order: 5,
            },
            {
              title: "Contraception Counselling Station",
              duration: "30 min",
              isFree: false,
              order: 6,
            },
          ],
        },
        {
          title: "Urogynaecology Module",
          order: 4,
          lessons: [
            {
              title: "Urinary Incontinence — History",
              duration: "28 min",
              isFree: false,
              order: 1,
            },
            {
              title: "Pelvic Organ Prolapse Station",
              duration: "30 min",
              isFree: false,
              order: 2,
            },
            {
              title: "Overactive Bladder Counselling",
              duration: "22 min",
              isFree: false,
              order: 3,
            },
            {
              title: "Urogynae Examination Station",
              duration: "25 min",
              isFree: false,
              order: 4,
            },
          ],
        },
        {
          title: "Communication & Ethics Module",
          order: 5,
          lessons: [
            {
              title: "Breaking Bad News — Technique",
              duration: "30 min",
              isFree: false,
              order: 1,
            },
            {
              title: "Consent Counselling Stations",
              duration: "25 min",
              isFree: false,
              order: 2,
            },
            {
              title: "Difficult Patient Scenarios",
              duration: "28 min",
              isFree: false,
              order: 3,
            },
            {
              title: "Ethical Dilemmas in OB/GYN",
              duration: "25 min",
              isFree: false,
              order: 4,
            },
          ],
        },
        {
          title: "Data Interpretation Module",
          order: 6,
          lessons: [
            {
              title: "CTG Interpretation",
              duration: "35 min",
              isFree: false,
              order: 1,
            },
            {
              title: "Ultrasound Findings Station",
              duration: "32 min",
              isFree: false,
              order: 2,
            },
            {
              title: "Lab Values Interpretation",
              duration: "28 min",
              isFree: false,
              order: 3,
            },
            {
              title: "Mock TOACS Exam — Full Simulation",
              duration: "90 min",
              isFree: false,
              order: 4,
            },
          ],
        },
      ],
    },

    // ══ COURSE 3: PAST PAPERS ══
    {
      title: "Past Papers",
      slug: "past-papers",
      shortDesc:
        "Fully solved OB/GYN past papers from 2019 to 2026 with model answers.",
      description:
        "Access complete OB/GYN past papers from 2019 to 2026 with detailed model answers by Dr. Mariam. The most effective way to understand exam patterns, identify high-yield topics, and maximise your score.",
      instructor: "Dr. Mariam",
      tags: ["Past Papers", "MCQs", "SAQs", "FCPS", "MCPS", "TOACS"],
      level: "All Levels",
      language: "Urdu / English",
      isPaid: true,
      isFree: false,
      enrollmentCount: 295,
      rating: 4.8,
      totalReviews: 122,
      colorTheme: "green",
      iconClass: "fa-file-lines",
      badge: "Updated 2026",
      hasModules: false,
      whatYouLearn: [
        "Past papers 2019–2026 fully solved",
        "Understand examiner patterns and expected answers",
        "Model answers for SAQs and essays",
        "MCQ explanations with clinical reasoning",
        "Identify high-yield repeated topics",
      ],
      requirements: ["MBBS degree", "Preparing for FCPS/MCPS/TOACS"],
      lessons: [
        {
          title: "Past Papers 2019 — Full Paper with Solutions",
          duration: "90 min",
          isFree: true,
          order: 1,
        },
        {
          title: "Past Papers 2020 — Full Paper with Solutions",
          duration: "90 min",
          isFree: false,
          order: 2,
        },
        {
          title: "Past Papers 2021 — Full Paper with Solutions",
          duration: "90 min",
          isFree: false,
          order: 3,
        },
        {
          title: "Past Papers 2022 — Full Paper with Solutions",
          duration: "90 min",
          isFree: false,
          order: 4,
        },
        {
          title: "Past Papers 2023 — Full Paper with Solutions",
          duration: "90 min",
          isFree: false,
          order: 5,
        },
        {
          title: "Past Papers 2024 — Full Paper with Solutions",
          duration: "90 min",
          isFree: false,
          order: 6,
        },
        {
          title: "Past Papers 2025 — Full Paper with Solutions",
          duration: "90 min",
          isFree: false,
          order: 7,
        },
        {
          title: "Past Papers 2026 — Full Paper with Solutions",
          duration: "90 min",
          isFree: false,
          order: 8,
        },
        {
          title: "High-Yield Topic Analysis 2019–2026",
          duration: "45 min",
          isFree: false,
          order: 9,
        },
      ],
    },
  ]);

  console.log("✅ 3 courses seeded successfully!");
};

// ── START: DB first, then seed, then listen ──
const start = async () => {
  await connectDB();
  await seedData();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running: http://localhost:${PORT}`);
    console.log(`🔐 Admin: gyneoobs@gmail.com / obsgynesimplified@H26`);
  });
};

start().catch((err) => {
  console.error("Failed to start:", err.message);
  process.exit(1);
});
