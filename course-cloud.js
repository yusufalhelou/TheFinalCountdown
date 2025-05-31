// course-cloud.js
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

function initCourseCloud() {
    // Create container if it doesn't exist
    if (!document.getElementById('courses-container')) {
        const container = document.createElement('div');
        container.id = 'courses-container';
        container.innerHTML = `
            <div id="top-left" class="courses-section"></div>
            <div id="top-right" class="courses-section"></div>
            <div id="bottom-left" class="courses-section"></div>
            <div id="bottom-right" class="courses-section"></div>
        `;
        document.body.appendChild(container);
    }
    
    renderCourses();
    setInterval(renderCourses, 60000); // Update every minute
}

function renderCourses() {
    const now = new Date();
    
    // Clear existing courses
    document.querySelectorAll('.courses-section').forEach(section => {
        section.innerHTML = '';
    });
    
    // Process each semester
    Object.entries(coursesBySemester).forEach(([semester, courses]) => {
        const semesterNum = parseInt(semester);
        
        courses.forEach((course, index) => {
            const courseName = typeof course === 'string' ? course : course.name;
            const examTime = typeof course === 'object' ? new Date(course.examTime).getTime() : null;
            const isCompleted = typeof course === 'string' || (examTime && now.getTime() > examTime);
            
            const courseElement = document.createElement('div');
            courseElement.className = `course-item ${isCompleted ? 'completed' : ''}`;
            courseElement.textContent = courseName;
            
            // Determine position based on semester
            let section;
            if (semesterNum <= 3) section = 'bottom-left';
            else if (semesterNum <= 6) section = 'bottom-right';
            else if (semesterNum <= 8) section = 'top-right';
            else section = 'top-left'; // Semesters 9-10
            
            // Current semester courses get more emphasis
            if (semesterNum === 10) {
                courseElement.style.fontWeight = '500';
                courseElement.style.opacity = '0.9';
            }
            
            document.getElementById(section).appendChild(courseElement);
        });
    });
}

// Initialize when DOM is ready
if (document.readyState === 'complete') {
    initCourseCloud();
} else {
    document.addEventListener('DOMContentLoaded', initCourseCloud);
}
