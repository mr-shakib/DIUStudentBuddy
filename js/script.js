const semesters = [
    {"semesterId":"244","semesterYear":2024,"semesterName":"Short"},
    {"semesterId":"243","semesterYear":2024,"semesterName":"Fall"},
    {"semesterId":"242","semesterYear":2024,"semesterName":"Summer"},
    {"semesterId":"241","semesterYear":2024,"semesterName":"Spring"},
    {"semesterId":"233","semesterYear":2023,"semesterName":"Fall"},
    {"semesterId":"232","semesterYear":2023,"semesterName":"Summer"},
    {"semesterId":"231","semesterYear":2023,"semesterName":"Spring"},
    {"semesterId":"223","semesterYear":2022,"semesterName":"Fall"},
    {"semesterId":"222","semesterYear":2022,"semesterName":"Summer"},
    {"semesterId":"221","semesterYear":2022,"semesterName":"Spring"},
    {"semesterId":"213","semesterYear":2021,"semesterName":"Fall"},
    {"semesterId":"212","semesterYear":2021,"semesterName":"Summer"},
    {"semesterId":"211","semesterYear":2021,"semesterName":"Spring"},
    {"semesterId":"203","semesterYear":2020,"semesterName":"Fall"},
    {"semesterId":"202","semesterYear":2020,"semesterName":"Summer"},
    {"semesterId":"201","semesterYear":2020,"semesterName":"Spring"}
];

function populateDropdowns() {
    const yearDropdown = document.getElementById("yearDropdown");
    const semesterDropdown = document.getElementById("semesterDropdown");

    const years = [...new Set(semesters.map(s => s.semesterYear))];
    years.forEach(year => {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearDropdown.appendChild(option);
    });

    yearDropdown.addEventListener("change", () => {
        semesterDropdown.innerHTML = "";
        const selectedYear = yearDropdown.value;
        const filteredSemesters = semesters.filter(s => s.semesterYear == selectedYear);

        filteredSemesters.forEach(sem => {
            const option = document.createElement("option");
            option.value = sem.semesterId;
            option.textContent = sem.semesterName;
            semesterDropdown.appendChild(option);
        });
    });
}

async function getResult() {
    const studentId = document.getElementById("studentId").value;
    const semesterId = document.getElementById("semesterDropdown").value;
    const resultDiv = document.getElementById("result");
    const loadingDiv = document.getElementById("loading");
    const studentInfoDiv = document.getElementById("studentInfo");

    if (!studentId || !semesterId) {
        resultDiv.style.display = "block";
        resultDiv.textContent = "Please enter a valid Student ID and select a semester.";
        resultDiv.classList.add("error");
        loadingDiv.style.display = "none";
        return;
    }

    resultDiv.style.display = "none";
    studentInfoDiv.style.display = "none";
    resultDiv.classList.remove("error");
    loadingDiv.style.display = "flex";

    try {
        const response = await fetch(`http://software.diu.edu.bd:8006/result?grecaptcha=&semesterId=${semesterId}&studentId=${studentId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch result");
        }
        const data = await response.json();
        loadingDiv.style.display = "none";
        resultDiv.style.display = "block";

        if (data.length > 0) {
            const totalCgpa = data[0].cgpa;
            studentInfoDiv.style.display = "block";
            studentInfoDiv.innerHTML = `<span><strong>Student ID:</strong> ${studentId}</span>
                                        <span><strong>Total CGPA:</strong> ${totalCgpa}</span>`;

            let tableHTML = '<table><tr><th>Course ID</th><th>Course Title</th><th>Credit</th><th>Grade</th><th>Point</th></tr>';
            data.forEach(course => {
                tableHTML += `<tr>
                    <td>${course.customCourseId}</td>
                    <td>${course.courseTitle}</td>
                    <td>${course.totalCredit}</td>
                    <td>${course.gradeLetter}</td>
                    <td>${course.pointEquivalent}</td>
                </tr>`;
            });
            tableHTML += "</table>";
            resultDiv.innerHTML = tableHTML;
        } else {
            resultDiv.textContent = "No results found.";
        }
    } catch (error) {
        loadingDiv.style.display = "none";
        resultDiv.style.display = "block";
        resultDiv.textContent = "Error fetching result. Please try again.";
        resultDiv.classList.add("error");
    }
}

document.addEventListener("DOMContentLoaded", populateDropdowns);
