document.addEventListener("DOMContentLoaded", function () {

  const data = JSON.parse(localStorage.getItem("portfolioData"));
  if (!data) return;

  // ===== Display Basic Info =====
  document.getElementById("display-name").textContent = data.name || "";
  document.getElementById("display-email").textContent = data.email || "";
  document.getElementById("display-mobile").textContent = data.mobile || "";
  document.getElementById("display-about").textContent = data.about || "";
  document.getElementById("display-education").textContent = data.education || "";
  document.getElementById("display-experience").textContent = data.experience || "";
  document.getElementById("display-meeting").textContent = data.meeting || "";
  document.getElementById("display-skills").textContent = data.skills || "";
  document.getElementById("display-projects").textContent = data.projects || "";

  if (data.photo) {
    document.getElementById("display-photo").src = data.photo;
  }

  // ===== NEW SMART AI SYSTEM =====
  const results = getAISuggestions(data.skills);

  const jobsContainer = document.getElementById("suggested-jobs");
  const projectsContainer = document.getElementById("suggested-projects");

  jobsContainer.innerHTML = "";
  projectsContainer.innerHTML = "";

  results.forEach(result => {

    // Career Recommendation
    const jobDiv = document.createElement("div");
    jobDiv.style.marginBottom = "15px";
    jobDiv.innerHTML = `
      <strong>${result.role}</strong> – ${result.percentage}% Match<br>
      <small style="color:#666;">
         Improve by learning: 
        ${result.missing.length > 0 ? result.missing.join(", ") : "All skills matched!"}
      </small>
    `;
    jobsContainer.appendChild(jobDiv);

    // Project Recommendation
    const projectDiv = document.createElement("div");
    projectDiv.style.marginBottom = "10px";
    projectDiv.innerHTML = `
      <strong>${result.role} Projects:</strong> 
      ${result.projects.join(", ")}
    `;
    projectsContainer.appendChild(projectDiv);

  });

  // ===== PDF Download =====
  // Download as PDF
  const downloadBtn = document.getElementById("downloadPDF");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const data = JSON.parse(localStorage.getItem("portfolioData"));
      if (!data) return;

      doc.setFontSize(18);
      doc.text("Careerfolio Portfolio", 10, 20);
      doc.setFontSize(12);
      let y = 40;
      doc.text(`Name: ${data.name}`, 10, y); y += 10;
      doc.text(`Email: ${data.email}`, 10, y); y += 10;
      doc.text(`Mobile: ${data.mobile}`, 10, y); y += 10;
      doc.text(`Education: ${data.education}`, 10, y); y += 10;
      doc.text(`Experience: ${data.experience}`, 10, y); y += 10;
      doc.text(`Meeting: ${data.meeting}`, 10, y); y += 10;
      doc.text(`Skills: ${data.skills}`, 10, y); y += 10;
      doc.text(`Projects: ${data.projects}`, 10, y); y += 10;
      doc.text(`LinkedIn: ${data.linkedin}`, 10, y); y += 10;
      doc.text(`GitHub: ${data.github}`, 10, y); y += 10;

      // Add photo if available
      if (data.photo) {
        doc.addImage(data.photo, "JPEG", 150, 10, 40, 40);
      }

      doc.save(`${data.name}_Careerfolio.pdf`);
    });
  }
});


// ===== ADVANCED AI SUGGESTION FUNCTION =====
function getAISuggestions(skillsInput) {

  const userSkills = skillsInput.toLowerCase().split(",").map(skill => skill.trim());

  const careerDatabase = [
    {
      role: "AI Engineer",
      requiredSkills: ["python", "machine learning", "deep learning", "tensorflow", "nlp"],
      projects: ["AI Chatbot", "Image Classifier", "Prediction Model"]
    },
    {
      role: "Data Analyst",
      requiredSkills: ["python", "sql", "excel", "power bi", "statistics"],
      projects: ["Sales Dashboard", "Data Visualization Tool", "Business Insights App"]
    },
    {
      role: "Frontend Developer",
      requiredSkills: ["html", "css", "javascript", "react", "ui/ux"],
      projects: ["Responsive Website", "Portfolio Website", "E-commerce UI"]
    },
    {
      role: "Java Developer",
      requiredSkills: ["java", "spring", "jdbc", "sql"],
      projects: ["Library Management System", "Banking App", "Student Portal"]
    }
  ];

  let results = [];

  careerDatabase.forEach(career => {

    let matchedSkills = career.requiredSkills.filter(skill =>
      userSkills.includes(skill)
    );

    let percentage = Math.round(
      (matchedSkills.length / career.requiredSkills.length) * 100
    );

    let missingSkills = career.requiredSkills.filter(skill =>
      !userSkills.includes(skill)
    );

    results.push({
      role: career.role,
      percentage: percentage,
      missing: missingSkills,
      projects: career.projects
    });

  });

  return results.sort((a, b) => b.percentage - a.percentage);
}