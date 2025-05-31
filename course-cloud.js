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
 * @param {number} padding - The amount of padding to add around the element.
 * @returns {object|null} The boundary object (top, bottom, left, right) or null if element not found.
 */
function getElementBoundary(elementId, padding = 30) { // Increased default padding for more space
    const el = document.getElementById(elementId);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
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
 * @param {number} padding - The amount of padding to add around the combined boundary.
 * @returns {object|null} The combined boundary object or null if no elements found.
 */
function getCombinedBoundary(elementIds, padding = 40) { // Increased default padding
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

    return {
        top: minY - padding,
        bottom: maxY + padding,
        left: minX - padding,
        right: maxX + padding
    };
}

/**
 * Checks if two rectangles overlap.
 * @param {object} rect1 - The first rectangle {left, top, right, bottom}.
 * @param {object} rect2 - The second rectangle {left, top, right, bottom}.
 * @returns {boolean} True if the rectangles overlap, false otherwise.
 */
function doRectanglesOverlap(rect1, rect2) {
    return rect1.left < rect2.right &&
           rect1.right > rect2.left &&
           rect1.top < rect2.bottom &&
           rect1.bottom > rect2.top;
}

/**
 * Checks if a given item rectangle is clear of all specified boundaries and previously placed items.
 * @param {object} itemRect - The rectangle of the item to check {left, top, right, bottom}.
 * @param {Array<object>} boundariesToAvoid - An array of boundary objects (e.g., central elements).
 * @param {Array<object>} placedItems - An array of objects, each containing a 'rect' property for previously placed items.
 * @returns {boolean} True if the position is clear, false otherwise.
 */
function isPositionClear(itemRect, boundariesToAvoid, placedItems) {
    // Check against fixed boundaries (logo, timer, headline)
    for (const boundary of boundariesToAvoid) {
        if (boundary && doRectanglesOverlap(itemRect, boundary)) {
            return false;
        }
    }
    // Check against already placed course items
    for (const placedItem of placedItems) {
        if (doRectanglesOverlap(itemRect, placedItem.rect)) {
            return false;
        }
    }
    return true;
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
    const centralElementsIds = ['main-logo', 'headline', 'countdown'];
    // Get individual boundaries for collision checking with added padding
    const centralBoundaries = centralElementsIds.map(id => getElementBoundary(id, 30)).filter(Boolean); // Increased padding
    // Get the combined boundary of the central elements
    const combinedCentralRect = getCombinedBoundary(centralElementsIds, 50); // Increased padding for combined rect

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Define the top and bottom container areas based on the central elements
    // Ensure containers have a minimum height if central elements are very close to top/bottom
    let topContainer = {
        top: 0,
        bottom: combinedCentralRect ? Math.max(0, combinedCentralRect.top) : viewportHeight / 2 - 50,
        left: 0,
        right: viewportWidth
    };
    let bottomContainer = {
        top: combinedCentralRect ? Math.min(viewportHeight, combinedCentralRect.bottom) : viewportHeight / 2 + 50,
        bottom: viewportHeight,
        left: 0,
        right: viewportWidth
    };

    // Ensure containers have positive height, provide a fallback if they collapse
    if (topContainer.bottom <= topContainer.top) {
        topContainer.bottom = topContainer.top + 100; // Give it some minimal height
    }
    if (bottomContainer.top >= bottomContainer.bottom) {
        bottomContainer.top = bottomContainer.bottom - 100; // Give it some minimal height
    }

    // Flatten all courses and prepare for placement, maintaining semester order (10 first)
    const allCoursesFlat = [];
    for (let s = 10; s >= 1; s--) {
        const courses = coursesBySemester[s];
        if (courses) {
            courses.forEach(course => allCoursesFlat.push({
                name: typeof course === 'object' ? course.name : course,
                examTime: typeof course === 'object' ? course.examTime : null,
                semester: s // Store semester for proximity logic
            }));
        }
    }

    const placedItems = []; // Store rectangles of placed items to avoid overlap

    // Calculate a dynamic font size and max-width for course items, adaptive to screen size and number of courses.
    // This ensures uniformity across all courses while adapting to available space.
    const totalCourseCount = allCoursesFlat.length;
    const totalAvailableArea = (topContainer.right - topContainer.left) * Math.max(0, (topContainer.bottom - topContainer.top)) +
                               (bottomContainer.right - bottomContainer.left) * Math.max(0, (bottomContainer.bottom - bottomContainer.top));

    // Heuristic for font size: Adjust these multipliers based on desired visual density.
    // This formula aims to scale font size based on the average area per course.
    let targetFontSizeRem = 0.85; // Base font size
    if (totalCourseCount > 0 && totalAvailableArea > 0) {
        const averageAreaPerCourse = totalAvailableArea / totalCourseCount;
        // A scaling factor that makes larger average areas result in larger fonts.
        // The 0.0005 and 0.5 are tuning parameters; adjust for desired effect.
        targetFontSizeRem = Math.min(1.0, Math.max(0.6, 0.5 + Math.sqrt(averageAreaPerCourse) * 0.0005));
    }

    // Adaptive max-width for course items to prevent them from being too wide
    const courseItemMaxWidth = Math.max(80, viewportWidth * 0.12); // Min 80px, up to 12% of viewport width

    // Now, iterate and place courses
    allCoursesFlat.forEach(courseData => {
        const el = document.createElement('div');
        el.className = `course-item semester-${courseData.semester}`;
        el.textContent = courseData.name;
        el.style.maxWidth = `${courseItemMaxWidth}px`; // Apply dynamic max-width
        el.style.fontSize = `${targetFontSizeRem}rem`; // Apply dynamic font size

        if (courseData.examTime) {
            el.dataset.examTime = courseData.examTime;
        } else {
            el.classList.add('struck');
        }

        // Temporarily append to get dimensions, then remove
        container.appendChild(el);
        const itemWidth = el.offsetWidth;
        const itemHeight = el.offsetHeight;
        container.removeChild(el);

        let x, y;
        let positionFound = false;
        const maxAttempts = 300; // Increased attempts for better packing and collision avoidance

        // Determine which containers to try for placement, prioritizing closer regions for Semester 10
        const containersToTry = [];

        // Define sub-regions within top/bottom containers that are closer to the central block
        // These regions are designed to be adjacent to the central block
        const topCloserRegion = {
            top: topContainer.top,
            bottom: combinedCentralRect ? combinedCentralRect.top : topContainer.bottom,
            left: topContainer.left,
            right: topContainer.right
        };
        const bottomCloserRegion = {
            top: combinedCentralRect ? combinedCentralRect.bottom : bottomContainer.top,
            bottom: bottomContainer.bottom,
            left: bottomContainer.left,
            right: bottomContainer.right
        };

        // Prioritize these closer regions for Semester 10 courses
        if (courseData.semester === 10) {
            // Ensure regions are valid before adding
            if (topCloserRegion.bottom > topCloserRegion.top && topCloserRegion.right > topCloserRegion.left) containersToTry.push(topCloserRegion);
            if (bottomCloserRegion.bottom > bottomCloserRegion.top && bottomCloserRegion.right > bottomCloserRegion.left) containersToTry.push(bottomCloserRegion);
        }

        // Add full containers as fallback or for other semesters
        // Ensure regions are valid before adding
        if (topContainer.bottom > topContainer.top && topContainer.right > topContainer.left) containersToTry.push(topContainer);
        if (bottomContainer.bottom > bottomContainer.top && bottomContainer.right > bottomContainer.left) containersToTry.push(bottomContainer);

        // Shuffle containers to add randomness to which area is tried first
        for (let i = containersToTry.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [containersToTry[i], containersToTry[j]] = [containersToTry[j], containersToTry[i]];
        }

        // Attempt to place the course item
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const currentContainer = containersToTry[attempt % containersToTry.length]; // Cycle through containers

            // Ensure the container is valid (has positive width and height)
            if (!currentContainer || currentContainer.right <= currentContainer.left || currentContainer.bottom <= currentContainer.top) {
                continue;
            }

            // Generate random position for the CENTER of the item within the current container
            // Account for itemWidth/Height so the *entire* item fits within the container
            const centerX = currentContainer.left + itemWidth / 2 + Math.random() * (currentContainer.right - currentContainer.left - itemWidth);
            const centerY = currentContainer.top + itemHeight / 2 + Math.random() * (currentContainer.bottom - currentContainer.top - itemHeight);

            // Calculate the top-left corner for the itemRect, as the CSS transform will center it
            const itemRect = {
                left: centerX - itemWidth / 2,
                top: centerY - itemHeight / 2,
                right: centerX + itemWidth / 2,
                bottom: centerY + itemHeight / 2
            };

            // Check if the calculated position is clear of all defined boundaries and other placed items
            if (isPositionClear(itemRect, centralBoundaries, placedItems)) {
                positionFound = true;
                // Set CSS left/top to the desired CENTER of the element
                el.style.left = `${centerX}px`;
                el.style.top = `${centerY}px`;
                container.appendChild(el);
                placedItems.push({ el: el, rect: itemRect }); // Store the element and its final rectangle
                break; // Position found, move to next course
            }
        }

        // Fallback: If no clear position is found after many attempts, place it at a default random spot
        // This ensures all courses appear, even if some overlap in very dense scenarios.
        if (!positionFound) {
            // Try to pick a valid container for fallback
            const fallbackContainer = containersToTry.find(c => c.bottom > c.top && c.right > c.left) || topContainer;

            if (fallbackContainer.right > fallbackContainer.left && fallbackContainer.bottom > fallbackContainer.top) {
                // Calculate random center for fallback
                const centerX = fallbackContainer.left + itemWidth / 2 + Math.random() * (fallbackContainer.right - fallbackContainer.left - itemWidth);
                const centerY = fallbackContainer.top + itemHeight / 2 + Math.random() * (fallbackContainer.bottom - fallbackContainer.top - itemHeight);

                const itemRect = {
                    left: centerX - itemWidth / 2,
                    top: centerY - itemHeight / 2,
                    right: centerX + itemWidth / 2,
                    bottom: centerY + itemHeight / 2
                };

                el.style.left = `${centerX}px`;
                el.style.top = `${centerY}px`;
                container.appendChild(el);
                placedItems.push({ el: el, rect: itemRect });
            } else {
                // If even fallback fails (e.g., no valid containers), just append it.
                container.appendChild(el);
            }
        }
    });
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
