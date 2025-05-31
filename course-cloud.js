const coursesBySemester = {
    10: [
        { name: "Drug Design", examTime: "2025-06-15T09:00:00" },
        { name: "Toxicology and Forensic Chemistry", examTime: "2025-06-16T09:00:00" },
        { name: "First Aid", examTime: "2025-06-17T09:00:00" },
        { name: "Research Methodology", examTime: "2025-06-18T09:00:00" },
        { name: "Advanced drug Delivery Systems", examTime: "2025-06-19T09:00:00" },
        { name: "Clinical Pharmacy 2 & Pharmacotherapeutics", examTime: "2025-06-20T09:00:00" },
        { name: "Entrepreneurship", examTime: "2025-06-21T09:00:00" },
        { name: "Public Health", examTime: "2025-06-22T09:00:00" },
        { name: "Professional Ethics", examTime: "2025-06-23T09:00:00" },
        { name: "Modern Trend in Drug Synthesis", examTime: "2025-06-24T09:00:00" }
    ],
    9: [
        "Drug Targeting",
        "Medical Microbiology",
        "Clinical Pharmacy 1",
        "Clinical Research, Pharmacoepidemiology and Pharmacovigilance",
        "Pathology",
        "Good Manufacturing Practice",
        "Drug Marketing & Pharmacoeconomics",
        "Medicinal Chemistry 3"
    ],
    8: [
        "Clinical Nutrition",
        "Clinical Pharmacokinetics",
        "Quality Control and Pharmaceutical Analysis",
        "Phytotherapy and Aromatherapy",
        "Therapeutics",
        "Pharmaceutical Technology 2",
        "Community Pharmacy Practice",
        "Medicinal Chemistry 2"
    ],
    7: [
        "Geriatrics",
        "Biotechnology",
        "Pharmacology 3",
        "Applied & Forensic Pharmacognosy",
        "Drug Information",
        "Clinical Biochemistry",
        "Pharmaceutical Technology 1",
        "Medicinal Chemistry 1",
        "Pharmaceutical Legislation and Regulatory Affairs"
    ],
    6: [
        "Pharmaceutical Microbiology",
        "Biopharmaceutics and Pharmacokinetics",
        "Phytochemistry 2",
        "Pharmaceutics 4",
        "Pharmacology 2",
        "Hospital Pharmacy"
    ],
    5: [
        "Biochemistry 2",
        "Parasitology and Virology",
        "Phytochemistry 1",
        "Pharmaceutics 3",
        "Spectroscopic Identification",
        "Pharmacology 1"
    ],
    4: [
        "Biochemistry 1",
        "General Microbiology and Immunology",
        "Instrumental Analysis",
        "Pathophysiology",
        "Pharmaceutics 2",
        "Biostatistics"
    ],
    3: [
        "Pharmaceutical Analytical Chemistry 3",
        "Pharmaceutical Organic Chemistry 3",
        "Scientific Writing",
        "Pharmacognosy 2",
        "Physiology",
        "Pharmaceutics 1"
    ],
    2: [
        "Pharmaceutical Analytical Chemistry 2",
        "Pharmaceutical Organic Chemistry 2",
        "Cell Biology",
        "Anatomy and Histology",
        "Physical Pharmacy",
        "Pharmacognosy 1",
        "Psychology",
        "Communication and Presentation Skills"
    ],
    1: [
        "Mathematics",
        "Human Rights and Corruption Fighting",
        "Pharmaceutical Analytical Chemistry 1",
        "Pharmaceutical Organic Chemistry 1",
        "Pharmacy Orientation",
        "Medicinal Plants",
        "Medical Terminology",
        "Information Technology"
    ]
};

function getElementBoundary(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return {
        top: rect.top - 15,
        bottom: rect.bottom + 15,
        left: rect.left - 15,
        right: rect.right + 15
    };
}

function isPositionClear(x, y, boundaries) {
    return boundaries.every(b => 
        x < b.left || x > b.right || 
        y < b.top || y > b.bottom
    );
}

function generateCourseCloud() {
    const container = document.getElementById('course-cloud-container');
    if (!container) return;

    container.innerHTML = '';
    const boundaries = [
        getElementBoundary('main-logo'),
        getElementBoundary('headline'),
        getElementBoundary('countdown')
    ].filter(Boolean);

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const isMobile = window.innerWidth < 768;
    const baseRadius = isMobile ? 100 : 150;

    for (let semester = 10; semester >= 1; semester--) {
        const courses = coursesBySemester[semester];
        if (!courses) continue;

        const radius = baseRadius * (1 + (10 - semester) * 0.2);
        const angleStep = (Math.PI * 2) / courses.length;

        courses.forEach((course, index) => {
            const el = document.createElement('div');
            el.className = `course-item semester-${semester}`;
            el.textContent = typeof course === 'object' ? course.name : course;
            if (typeof course === 'object' && course.examTime) {
                el.dataset.examTime = course.examTime;
            } else {
                el.classList.add('struck');
            }

            // Radial positioning with collision avoidance
            let x, y, angle;
            for (let attempt = 0; attempt < 50; attempt++) {
                angle = angleStep * index + (Math.random() * 0.5 - 0.25);
                x = centerX + radius * Math.cos(angle) * (isMobile ? 1.2 : 1);
                y = centerY + radius * Math.sin(angle) * (isMobile ? 0.8 : 1);
                if (isPositionClear(x, y, boundaries)) break;
            }

            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
            container.appendChild(el);
        });
    }
}

function updateCourseStrikes() {
    const now = new Date();
    document.querySelectorAll('.course-item[data-exam-time]').forEach(item => {
        if (new Date(item.dataset.examTime) <= now) {
            item.classList.add('struck');
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    generateCourseCloud();
    updateCourseStrikes();
    setInterval(updateCourseStrikes, 60000); // Check every minute
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(generateCourseCloud, 200);
    });
});
