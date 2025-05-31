// Course data organized by semester (10 = current)
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

function generateCourseCloud() {
    const container = document.getElementById('course-cloud-container');
    if (!container) return;
    
    // Clear existing courses
    container.innerHTML = '';

    // Parameters for radial positioning
    const minRadius = 10;  // Minimum distance from center (%)
    const maxRadius = 90;  // Maximum distance from center (%)
    const centerX = 50;    // Center X position (%)
    const centerY = 50;    // Center Y position (%)

    // Create course elements
    for (let semester = 10; semester >= 1; semester--) {
        const courses = coursesBySemester[semester];
        if (!courses) continue;
        
        courses.forEach(course => {
            const el = document.createElement('div');
            el.className = `course-item semester-${semester}`;
            
            // Handle both string and object formats
            if (typeof course === 'object') {
                el.textContent = course.name;
                if (course.examTime) {
                    el.dataset.examTime = course.examTime;
                }
            } else {
                el.textContent = course;
                el.classList.add('struck');
            }
            
            // Radial positioning with semester-based radius
            const radius = minRadius + (maxRadius - minRadius) * ((10 - semester) / 9);
            const angle = Math.random() * Math.PI * 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            el.style.left = `${x}%`;
            el.style.top = `${y}%`;
            
            container.appendChild(el);
        });
    }
}

function updateCourseStrikes() {
    const now = new Date();
    document.querySelectorAll('.course-item[data-exam-time]').forEach(item => {
        const examTime = new Date(item.dataset.examTime);
        if (examTime <= now && !item.classList.contains('struck')) {
            item.classList.add('struck');
        }
    });
}

// Initialize and update periodically
document.addEventListener('DOMContentLoaded', () => {
    generateCourseCloud();
    updateCourseStrikes();
    setInterval(updateCourseStrikes, 60000); // Update every minute
});

// Regenerate on resize for responsiveness
window.addEventListener('resize', () => {
    generateCourseCloud();
});