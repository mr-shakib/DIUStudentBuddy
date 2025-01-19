// Dark mode functionality
const darkModeToggle = document.getElementById('darkModeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Initialize dark mode based on user preference or localStorage
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    darkModeToggle.checked = true;
} else if (currentTheme === 'light') {
    document.body.setAttribute('data-theme', 'light');
    darkModeToggle.checked = false;
} else if (prefersDarkScheme.matches) {
    document.body.setAttribute('data-theme', 'dark');
    darkModeToggle.checked = true;
}

// Toggle dark mode
darkModeToggle.addEventListener('change', function () {
    if (this.checked) {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
});

const dupeResults = [];
const semestersList = [
    { "semesterId": "244", "semesterYear": 2024, "semesterName": "Short" }, { "semesterId": "243", "semesterYear": 2024, "semesterName": "Fall" }, { "semesterId": "242", "semesterYear": 2024, "semesterName": "Summer" }, { "semesterId": "241", "semesterYear": 2024, "semesterName": "Spring" }, { "semesterId": "233", "semesterYear": 2023, "semesterName": "Fall" }, { "semesterId": "232", "semesterYear": 2023, "semesterName": "Summer" }, { "semesterId": "231", "semesterYear": 2023, "semesterName": "Spring" }, { "semesterId": "223", "semesterYear": 2022, "semesterName": "Fall" }, { "semesterId": "222", "semesterYear": 2022, "semesterName": "Summer" }, { "semesterId": "221", "semesterYear": 2022, "semesterName": "Spring" }, { "semesterId": "213", "semesterYear": 2021, "semesterName": "Fall" }, { "semesterId": "212", "semesterYear": 2021, "semesterName": "Summer" }, { "semesterId": "211", "semesterYear": 2021, "semesterName": "Spring" }, { "semesterId": "203", "semesterYear": 2020, "semesterName": "Fall" }, { "semesterId": "202", "semesterYear": 2020, "semesterName": "Summer" }, { "semesterId": "201", "semesterYear": 2020, "semesterName": "Spring" }, { "semesterId": "193", "semesterYear": 2019, "semesterName": "Fall" }, { "semesterId": "192", "semesterYear": 2019, "semesterName": "Summer" }, { "semesterId": "191", "semesterYear": 2019, "semesterName": "Spring" }, { "semesterId": "183", "semesterYear": 2018, "semesterName": "Fall" }, { "semesterId": "182", "semesterYear": 2018, "semesterName": "Summer" }, { "semesterId": "181", "semesterYear": 2018, "semesterName": "Spring" }, { "semesterId": "173", "semesterYear": 2017, "semesterName": "Fall" }, { "semesterId": "172", "semesterYear": 2017, "semesterName": "Summer" }, { "semesterId": "171", "semesterYear": 2017, "semesterName": "Spring" }, { "semesterId": "163", "semesterYear": 2016, "semesterName": "Fall" }, { "semesterId": "162", "semesterYear": 2016, "semesterName": "Summer" }, { "semesterId": "161", "semesterYear": 2016, "semesterName": "Spring" }, { "semesterId": "153", "semesterYear": 2015, "semesterName": "Fall" }, { "semesterId": "152", "semesterYear": 2015, "semesterName": "Summer" }, { "semesterId": "151", "semesterYear": 2015, "semesterName": "Spring" }, { "semesterId": "143", "semesterYear": 2014, "semesterName": "Fall" }, { "semesterId": "142", "semesterYear": 2014, "semesterName": "Summer" }, { "semesterId": "141", "semesterYear": 2014, "semesterName": "Spring" }, { "semesterId": "133", "semesterYear": 2013, "semesterName": "Fall" }, { "semesterId": "132", "semesterYear": 2013, "semesterName": "Summer" }, { "semesterId": "131", "semesterYear": 2013, "semesterName": "Spring" }, { "semesterId": "123", "semesterYear": 2012, "semesterName": "Fall" }, { "semesterId": "122", "semesterYear": 2012, "semesterName": "Summer" }, { "semesterId": "121", "semesterYear": 2012, "semesterName": "Spring" }, { "semesterId": "113", "semesterYear": 2011, "semesterName": "Fall" }, { "semesterId": "112", "semesterYear": 2011, "semesterName": "Summer" }, { "semesterId": "111", "semesterYear": 2011, "semesterName": "Spring" }, { "semesterId": "103", "semesterYear": 2010, "semesterName": "Fall" }, { "semesterId": "102", "semesterYear": 2010, "semesterName": "Summer" }, { "semesterId": "101", "semesterYear": 2010, "semesterName": "Spring" }, { "semesterId": "093", "semesterYear": 2009, "semesterName": "Fall" }, { "semesterId": "092", "semesterYear": 2009, "semesterName": "Summer" }, { "semesterId": "091", "semesterYear": 2009, "semesterName": "Spring" }, { "semesterId": "083", "semesterYear": 2008, "semesterName": "Fall" }
];

function calculateSgpaManual(semester) {
    let sc = 0;
    let weighted = 0;
    let semesterName = "";
    let semesterYear = 0;
    let wa = 0;

    for (let c of semester) {
        if (c["gradeLetter"] != "F") {
            semesterName = c["semesterName"];
            semesterYear = c["semesterYear"];
            weighted = weighted + c?.totalCredit * c?.pointEquivalent;
            sc = sc + Number(c["totalCredit"]);
        }
    }
    wa = Number((weighted / sc).toFixed(2));

    return [semesterName, semesterYear, sc, wa];
}

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://software.diu.edu.bd:8006'
    : '/api/proxy';

async function fetchStudentInfo(id) {
    try {
        const response = await fetch(
            API_BASE_URL === '/api/proxy'
                ? `${API_BASE_URL}?studentId=${id}`
                : `${API_BASE_URL}/result/studentInfo?studentId=${id}`,
            {
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': window.location.origin
                }
            }
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch student information');
        }
        const data = await response.json();
        if (data && data.studentId) {
            return {
                id: data.studentId,
                name: data.studentName,
                program: data.programName,
                batch: data.batchNo,
                department: data.departmentName,
                faculty: data.facultyName,
                shift: data.shift,
                campus: data.campusName,
                programType: data.programType,
                deptShortName: data.deptShortName,
                progShortName: data.progShortName
            };
        }
        throw new Error('No student information found');
    } catch (error) {
        console.error('Error fetching student info:', error);
        throw error;
    }
}

async function getStudentInfo(id) {
    const results = [];
    try {
        for (const semester of semestersList) {
            try {
                const response = await fetch(
                    API_BASE_URL === '/api/proxy'
                        ? `${API_BASE_URL}?studentId=${id}&semesterId=${semester.semesterId}`
                        : `${API_BASE_URL}/result?grecaptcha=&semesterId=${semester.semesterId}&studentId=${id}`,
                    {
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            'Origin': window.location.origin
                        }
                    }
                );
                
                if (response.ok) {
                    const data = await response.json();
                    if (data && Object.keys(data).length > 0) {
                        const semesterResults = data.map(course => ({
                            ...course,
                            semesterName: semester.semesterName,
                            semesterYear: semester.semesterYear
                        }));
                        results.push(semesterResults);
                    }
                }
            } catch (error) {
                console.log(`Failed to fetch semester ${semester.semesterId}:`, error);
            }
        }

        if (results.length === 0) {
            throw new Error("No results found for this ID");
        }

        return {
            inc: 0,
            studentInfoObj: {
                id: id,
                name: results[0][0]?.studentName || "Student"
            },
            semesterResults: results
        };
    } catch (error) {
        throw error;
    }
}

// Previous code remains same until calculateCgpa function

async function calculateCgpa(id, improvement, checkProject, projectCredit, projectResult) {
    const { studentInfoObj, semesterResults } = await getStudentInfo(id);
    let totalCredits = 0;
    let totalWeightedPoints = 0;
    const resultsList = [];
    const processedCourses = new Map(); // To track highest grades for improvement cases

    // Process each semester
    for (let semester of semesterResults) {
        let semesterCredits = 0;
        let semesterWeightedPoints = 0;
        let semesterName = semester[0]?.semesterName || "";
        let semesterYear = semester[0]?.semesterYear || "";

        // Process each course in the semester
        for (const course of semester) {
            const courseId = course.courseId;
            const credit = Number(course.totalCredit);
            const gradePoint = Number(course.pointEquivalent);

            if (improvement) {
                // For improvement cases, keep track of the highest grade for each course
                if (!processedCourses.has(courseId) ||
                    processedCourses.get(courseId).gradePoint < gradePoint) {
                    processedCourses.set(courseId, {
                        credit: credit,
                        gradePoint: gradePoint
                    });
                }
            } else {
                // For regular calculation, include all passing grades
                if (course.gradeLetter !== "F") {
                    semesterCredits += credit;
                    semesterWeightedPoints += credit * gradePoint;
                }
            }
        }

        // Calculate semester GPA and add to results
        if (!improvement && semesterCredits > 0) {
            const sgpa = semesterWeightedPoints / semesterCredits;
            resultsList.push([semesterName, semesterYear, semesterCredits, sgpa]);
            totalCredits += semesterCredits;
            totalWeightedPoints += semesterWeightedPoints;
        }
    }

    // Handle improvement cases
    if (improvement) {
        for (const [_, courseData] of processedCourses) {
            totalCredits += courseData.credit;
            totalWeightedPoints += courseData.credit * courseData.gradePoint;
        }
    }

    // Add project if included
    if (checkProject) {
        const projectCreditNum = Number(projectCredit);
        const projectGradePoint = Number(projectResult);
        totalCredits += projectCreditNum;
        totalWeightedPoints += projectCreditNum * projectGradePoint;
        resultsList.push(["Final Year Project", "", projectCreditNum, projectGradePoint]);
    }

    // Calculate final CGPA
    const finalCgpa = totalWeightedPoints / totalCredits;

    // Sort semesters chronologically
    resultsList.sort((a, b) => {
        if (a[1] === b[1]) {
            const seasonOrder = { Spring: 1, Summer: 2, Fall: 3 };
            return seasonOrder[a[0]] - seasonOrder[b[0]];
        }
        return Number(a[1]) - Number(b[1]);
    });

    // Format semester data for display
    const semesterData = resultsList.map(([name, year, credits, sgpa]) => {
        const semesterCourses = semesterResults.find(sem =>
            sem[0]?.semesterName === name &&
            sem[0]?.semesterYear === year
        ) || [];

        return {
            name,
            year,
            credits,
            sgpa,
            courses: semesterCourses
        };
    });

    return {
        studentInfo: studentInfoObj,
        cgpa: Number(finalCgpa.toFixed(2)),
        totalCredits: totalCredits,
        semesters: semesterData
    };
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');

    // Sort semesters from latest to oldest
    results.semesters.sort((a, b) => {
        if (a.year === b.year) {
            const seasonOrder = { 'Spring': 1, 'Summer': 2, 'Fall': 3 };
            return seasonOrder[b.name] - seasonOrder[a.name];
        }
        return b.year - a.year;
    });

    const cgpaHtml = `
        <div class="cgpa-card">
            <div class="student-info">
                <h2>${results.studentInfo.name}</h2>
                <div class="student-details">
                    <p><strong>ID</strong> ${results.studentInfo.id}</p>
                    <p><strong>Program</strong> ${results.studentInfo.program}</p>
                    <p><strong>Batch</strong> ${results.studentInfo.batch}</p>
                    <p><strong>Department</strong> ${results.studentInfo.department}</p>
                    <p><strong>Faculty</strong> ${results.studentInfo.faculty}</p>
                    <p><strong>Campus</strong> ${results.studentInfo.campus}</p>
                    <p><strong>Shift</strong> ${results.studentInfo.shift}</p>
                </div>
            </div>
            
            <div class="cgpa-value-container">
                <div class="cgpa-value">${results.cgpa.toFixed(2)}</div>
                <div class="credit-info">
                    Total Credits: <span class="credit-info-value">${results.totalCredits}</span>
                </div>
            </div>
        </div>
        
        <div class="summary-section" style="text-align: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
            <h2 style="color: var(--primary-color); margin-bottom: 0.5rem;">Overall Performance Summary</h2>
            <div style="display: flex; justify-content: center; gap: 2rem; margin-top: 1rem;">
                <div>
                    <div style="font-weight: bold; color: var(--text-color);">Total Credits</div>
                    <div style="font-size: 1.2rem;">${results.totalCredits}</div>
                </div>
                <div>
                    <div style="font-weight: bold; color: var(--text-color);">Total Semesters</div>
                    <div style="font-size: 1.2rem;">${results.semesters.length}</div>
                </div>
                <div>
                    <div style="font-weight: bold; color: var(--text-color);">Latest SGPA</div>
                    <div style="font-size: 1.2rem;">${results.semesters[0]?.sgpa.toFixed(2) || 'N/A'}</div>
                </div>
            </div>
        </div>

        <div class="semester-results">
            ${results.semesters.map(sem => `
                <div class="semester-card" data-semester='${JSON.stringify(sem)}'>
                    <div class="semester-header">
                        <h3>${sem.name} ${sem.year}</h3>
                    </div>
                    <div class="semester-stats">
                        <div class="stat-item">
                            <div class="stat-label">Credits</div>
                            <div class="stat-value">${sem.credits}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">SGPA</div>
                            <div class="stat-value">${sem.sgpa.toFixed(2)}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">Courses</div>
                            <div class="stat-value">${sem.courses.length}</div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="graph-container">
            <h2 style="color: var(--primary-color); margin-bottom: 1.5rem; text-align: center;">SGPA Progression</h2>
            <canvas id="cgpaChart"></canvas>
        </div>

        <div class="download-card" onclick="downloadPDF()">
            <div class="download-icon">📥</div>
            <div class="download-text">Download Complete Result</div>
            <div class="download-subtext">Get a detailed PDF report of your academic performance</div>
        </div>`;

    resultsDiv.innerHTML = cgpaHtml;

    // Store results in a global variable for PDF generation
    window.currentResults = results;

    // Create CGPA trend chart
    const ctx = document.getElementById('cgpaChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: results.semesters.map(sem => `${sem.name} ${sem.year}`).reverse(),
            datasets: [{
                label: 'SGPA',
                data: results.semesters.map(sem => sem.sgpa).reverse(),
                borderColor: '#1a73e8',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Semester-wise SGPA Trend'
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 4
                }
            }
        }
    });

    // Add click handlers for semester cards
    document.querySelectorAll('.semester-card').forEach(card => {
        card.addEventListener('click', () => showSemesterDetails(JSON.parse(card.dataset.semester)));
    });
}

function showSemesterDetails(semesterData) {
    const modal = document.getElementById('semesterModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');

    modalTitle.textContent = `${semesterData.name} ${semesterData.year}`;

    const tableHtml = `
        <table class="results-table">
            <thead>
                <tr>
                    <th>SL</th>
                    <th>Course Title</th>
                    <th>Credits</th>
                    <th>Grade</th>
                    <th>Grade Point</th>
                </tr>
            </thead>
            <tbody>
                ${semesterData.courses.map((course, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${course.courseTitle}</td>
                        <td>${course.totalCredit}</td>
                        <td>${course.gradeLetter}</td>
                        <td>${course.pointEquivalent}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;

    modalContent.innerHTML = tableHtml;
    modal.classList.add('active');
}

function downloadPDF() {
    if (typeof window.jspdf === 'undefined') {
        alert('PDF generation library is loading. Please try again in a moment.');
        return;
    }

    const results = window.currentResults;
    if (!results) {
        alert('No results available to download');
        return;
    }

    try {
        // Create loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-container';
        loadingDiv.style.display = 'block';
        loadingDiv.innerHTML = `
            <div class="loader"></div>
            <p>Generating PDF...</p>
        `;
        document.body.appendChild(loadingDiv);

        // Create new jsPDF instance
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Header
        doc.setFontSize(18);
        doc.setTextColor(26, 115, 232);
        doc.text('Daffodil International University', 105, 20, { align: 'center' });
        
        doc.setFontSize(14);
        doc.text('Academic Performance Report', 105, 30, { align: 'center' });

        // Student Info Box
        doc.setDrawColor(26, 115, 232);
        doc.setFillColor(240, 247, 255);
        doc.roundedRect(20, 40, 170, 35, 3, 3, 'FD');
        
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text('Student Information', 30, 50);
        doc.setFontSize(10);
        doc.text(`Name: ${results.studentInfo.name}`, 30, 58);
        doc.text(`ID: ${results.studentInfo.id}`, 30, 65);
        doc.text(`Overall CGPA: ${results.cgpa.toFixed(2)}`, 30, 72);
        doc.text(`Total Credits: ${results.totalCredits}`, 120, 72);

        let yPos = 90;

        // Semester-wise details
        results.semesters.forEach((sem, semesterIndex) => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }

            // Semester header
            doc.setFillColor(26, 115, 232);
            doc.rect(20, yPos - 5, 170, 8, 'F');
            doc.setTextColor(255);
            doc.setFontSize(11);
            doc.text(`${sem.name} ${sem.year} - SGPA: ${sem.sgpa.toFixed(2)}`, 25, yPos);
            yPos += 10;

            // Table headers
            doc.setTextColor(0);
            doc.setFontSize(10);
            doc.text('SL', 25, yPos);
            doc.text('Course Title', 45, yPos);
            doc.text('Credits', 140, yPos);
            doc.text('Grade', 160, yPos);
            doc.text('Points', 180, yPos);
            yPos += 5;

            // Horizontal line after headers
            doc.setDrawColor(200, 200, 200);
            doc.line(20, yPos, 190, yPos);
            yPos += 5;

            // Course details
            sem.courses.forEach((course, index) => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }

                doc.setFontSize(9);
                doc.text((index + 1).toString(), 25, yPos);
                
                // Handle long course titles
                const title = course.courseTitle;
                const maxWidth = 90;
                if (doc.getStringUnitWidth(title) * 9 > maxWidth) {
                    const words = title.split(' ');
                    let line = '';
                    for (let word of words) {
                        if (doc.getStringUnitWidth((line + ' ' + word)) * 9 <= maxWidth) {
                            line += (line ? ' ' : '') + word;
                        } else {
                            doc.text(line, 45, yPos);
                            yPos += 5;
                            line = word;
                        }
                    }
                    if (line) {
                        doc.text(line, 45, yPos);
                    }
                } else {
                    doc.text(title, 45, yPos);
                }

                doc.text(course.totalCredit.toString(), 142, yPos);
                doc.text(course.gradeLetter, 162, yPos);
                doc.text(course.pointEquivalent.toString(), 182, yPos);
                yPos += 7;
            });

            yPos += 10;
        });

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(128);
        const today = new Date().toLocaleDateString();
        doc.text(`Generated on: ${today}`, 20, 285);
        doc.text('DIU CGPA Calculator', 105, 285, { align: 'center' });
        doc.text('Page ' + doc.internal.getNumberOfPages(), 190, 285, { align: 'right' });

        // Save the PDF
        const filename = `${results.studentInfo.id}_academic_report.pdf`;
        doc.save(filename);

        // Remove loading indicator
        document.body.removeChild(loadingDiv);
    } catch (error) {
        console.error('PDF Generation Error:', error);
        alert('Failed to generate PDF. Please try again.');
        const loadingDiv = document.querySelector('.loading-container');
        if (loadingDiv) {
            document.body.removeChild(loadingDiv);
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('searchForm');
    const projectCheckbox = document.getElementById('hasProject');
    const projectInputs = document.getElementById('projectInputs');
    const modal = document.getElementById('semesterModal');
    const closeButton = modal.querySelector('.close-button');

    projectCheckbox.addEventListener('change', () => {
        projectInputs.classList.toggle('active', projectCheckbox.checked);
    });

    closeButton.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '<div class="loading"><div class="loader"></div><p>Calculating CGPA...</p></div>';

        try {
            const studentId = document.getElementById('studentId').value;
            
            // First fetch student info
            const studentInfo = await fetchStudentInfo(studentId);
            
            const improvement = document.getElementById('improvement').checked;
            const hasProject = document.getElementById('hasProject').checked;
            const projectCredit = document.getElementById('projectCredit').value;
            const projectResult = document.getElementById('projectResult').value;

            const results = await calculateCgpa(studentId, improvement, hasProject, projectCredit, projectResult);
            
            // Add the detailed student info to results
            results.studentInfo = {
                ...results.studentInfo,
                ...studentInfo
            };
            
            displayResults(results);
        } catch (error) {
            resultsDiv.innerHTML = `<div class="error">${error.message || 'Failed to calculate CGPA'}</div>`;
        }
    });
});