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

/**
 * Gets the bounding rectangle of an element with added padding.
 * @param {string} elementId - The ID of the HTML element.
 * @returns {object|null} The boundary object (top, bottom, left, right) or null if element not found.
 */
function getElementBoundary(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    // Increased padding for a larger exclusion zone around central elements
    const padding = 25;
    return {
        top: rect.top - padding,
        bottom: rect.bottom + padding,
        left: rect.left - padding,
        right: rect.right + padding
    };
}

/**
 * Calculates the combined bounding rectangle of multiple elements.
 * This helps determine the overall space occupied by central elements.
 * @param {string[]} elementIds - An array of HTML element IDs.
 * @returns {object|null} The combined boundary object or null if no elements found.
 */
function getCombinedBoundary(elementIds) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let foundAny = false;

    elementIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const rect = el.getBoundingClientRect();
            minX = Math.min(minX, rect.left);
            minY = Math.min(minY, rect.top);
            maxX = Math.max(maxX, rect.right);
            maxY = Math.max(maxY, rect.bottom);
            foundAny = true;
        }
    });

    if (!foundAny) return null;

    // Add some padding to the combined boundary for extra space
    const padding = 30;
    return {
        top: minY - padding,
        bottom: maxY + padding,
        left: minX - padding,
        right: maxX + padding
    };
}

/**
 * Checks if a given position (x, y) is clear of all specified boundaries.
 * @param {number} x - The x-coordinate to check.
 * @param {number} y - The y-coordinate to check.
 * @param {Array<object>} boundaries - An array of boundary objects (top, bottom, left, right).
 * @returns {boolean} True if the position is clear, false otherwise.
 */
function isPositionClear(x, y, boundaries) {
    // Check if the point (x, y) is outside of ALL boundaries
    return boundaries.every(b =>
        x < b.left || x > b.right ||
        y < b.top || y > b.bottom
    );
}

/**
 * Generates and positions the course cloud elements on the page.
 */
function generateCourseCloud() {
    const container = document.getElementById('course-cloud-container');
    if (!container) return;

    // Clear existing course items before regenerating
    container.innerHTML = '';

    // Define the elements that the course cloud should avoid
    const elementsToAvoid = ['main-logo', 'headline', 'countdown'];
    // Get individual boundaries for collision checking
    const boundaries = elementsToAvoid.map(id => getElementBoundary(id)).filter(Boolean);

    // Calculate the combined boundary of the central elements to determine a dynamic starting radius
    const combinedCentralBoundary = getCombinedBoundary(elementsToAvoid);

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const isMobile = window.innerWidth < 768;

    let minCentralRadius = 0;
    if (combinedCentralBoundary) {
        // Calculate the maximum distance from the center to any corner of the combined boundary
        // This helps ensure the initial placement of course items is outside this central area
        const distToTopLeft = Math.sqrt(Math.pow(centerX - combinedCentralBoundary.left, 2) + Math.pow(centerY - combinedCentralBoundary.top, 2));
        const distToTopRight = Math.sqrt(Math.pow(centerX - combinedCentralBoundary.right, 2) + Math.pow(centerY - combinedCentralBoundary.top, 2));
        const distToBottomLeft = Math.sqrt(Math.pow(centerX - combinedCentralBoundary.left, 2) + Math.pow(centerY - combinedCentralBoundary.bottom, 2));
        const distToBottomRight = Math.sqrt(Math.pow(centerX - combinedCentralBoundary.right, 2) + Math.pow(centerY - combinedCentralBoundary.bottom, 2));
        minCentralRadius = Math.max(distToTopLeft, distToTopRight, distToBottomLeft, distToBottomRight);
    }

    // Determine the base radius for the innermost semester (Semester 10).
    // It should be at least the larger of a default value or the calculated minimum radius
    // plus an additional buffer to ensure space around the central elements.
    const defaultBaseRadius = isMobile ? 100 : 150;
    const bufferAroundCentral = isMobile ? 30 : 50; // Extra space
    const baseRadius = Math.max(defaultBaseRadius, minCentralRadius + bufferAroundCentral);


    // Iterate through semesters from 10 down to 1 to ensure proximity order
    for (let semester = 10; semester >= 1; semester--) {
        const courses = coursesBySemester[semester];
        if (!courses) continue;

        // Calculate the radius for the current semester.
        // Newer semesters (closer to 10) will have smaller radii, placing them closer to the center.
        const radius = baseRadius * (1 + (10 - semester) * 0.2); // 0.2 is the spread factor
        const angleStep = (Math.PI * 2) / courses.length; // Evenly distribute courses around the circle

        courses.forEach((course, index) => {
            const el = document.createElement('div');
            el.className = `course-item semester-${semester}`;
            // Set text content, handling both string and object course formats
            el.textContent = typeof course === 'object' ? course.name : course;

            // Apply strike-through logic:
            // If it's a Semester 10 course with an exam time, store it for dynamic striking.
            // Otherwise (Semesters 1-9 or Semester 10 without exam time), pre-strike it.
            if (typeof course === 'object' && course.examTime) {
                el.dataset.examTime = course.examTime;
            } else {
                el.classList.add('struck');
            }

            // Radial positioning with collision avoidance attempts
            let x, y, angle;
            let positionFound = false;
            // Attempt to find a clear position up to 100 times to avoid overlaps
            for (let attempt = 0; attempt < 100; attempt++) {
                // Introduce a small random offset to the angle for a more scattered look
                angle = angleStep * index + (Math.random() * 0.5 - 0.25);
                // Calculate position based on center and radius
                x = centerX + radius * Math.cos(angle);
                y = centerY + radius * Math.sin(angle);

                // Check if the calculated position is clear of all defined boundaries
                if (isPositionClear(x, y, boundaries)) {
                    positionFound = true;
                    break;
                }
            }

            // If no clear position is found after many attempts, place it anyway
            // (this should be rare with the dynamic baseRadius and increased attempts)
            if (!positionFound) {
                x = centerX + radius * Math.cos(angle);
                y = centerY + radius * Math.sin(angle);
            }

            // Apply the calculated position to the element's style
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
            container.appendChild(el);
        });
    }
}

/**
 * Updates the strike-through status for Semester 10 courses based on their exam times.
 */
function updateCourseStrikes() {
    const now = new Date();
    document.querySelectorAll('.course-item[data-exam-time]').forEach(item => {
        if (new Date(item.dataset.examTime) <= now) {
            item.classList.add('struck');
        }
    });
}

// Initialize the course cloud generation and strike-through updates when the DOM is loaded.
document.addEventListener('DOMContentLoaded', () => {
    generateCourseCloud();
    updateCourseStrikes();
    // Check and update strike-through status every minute
    setInterval(updateCourseStrikes, 60000);

    // Regenerate the course cloud on window resize to ensure responsiveness
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        // Debounce the resize event to prevent excessive recalculations
        resizeTimeout = setTimeout(generateCourseCloud, 200);
    });
});
