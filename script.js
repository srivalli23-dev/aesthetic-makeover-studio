/* =========================================
   THE AESTHETIC MAKEOVER STUDIO
   MAIN JAVASCRIPT
========================================= */


/* =========================================
   SMOOTH NAVIGATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        });

    });

});


/* =========================================
   HERO BUTTONS
========================================= */

function scrollToAssistant() {

    const assistant = document.getElementById("ai-assistant");

    if (assistant) {
        assistant.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

}


/* =========================================
   AI STYLE ASSISTANT
========================================= */

const styleForm = document.getElementById("style-form");

if (styleForm) {

    styleForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const goal = document.getElementById("goal").value;
        const style = document.getElementById("style").value;
        const budget = document.getElementById("budget").value;

        const loading = document.getElementById("loading");
        const result = document.getElementById("ai-result");

        /* Basic validation */

        if (!name || !goal || !style || !budget) {

            result.style.display = "block";

            result.innerHTML = `
                <h3>Please complete your profile ✨</h3>
                <p>
                    Fill in all the details above so we can create
                    a personalized style plan for you.
                </p>
            `;

            return;
        }


        /* Show loading */

        loading.style.display = "block";

        result.style.display = "none";


        try {

            const response = await fetch("/api/style-advice", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name: name,
                    goal: goal,
                    style: style,
                    budget: budget

                })

            });


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error || "Something went wrong."
                );

            }


            /* Hide loading */

            loading.style.display = "none";


            /* Display AI response */

            result.style.display = "block";

            result.innerHTML = formatAIResponse(data.advice);


            /* Scroll to result */

            result.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });


        } catch (error) {

            console.error("AI Assistant Error:", error);

            loading.style.display = "none";

            result.style.display = "block";

            result.innerHTML = `
                <h3>We couldn't create your plan yet.</h3>

                <p>
                    Please make sure the AI service is configured correctly
                    and try again.
                </p>

                <p>
                    <strong>Error:</strong> ${escapeHTML(error.message)}
                </p>
            `;

        }

    });

}


/* =========================================
   FORMAT AI RESPONSE
========================================= */

function formatAIResponse(advice) {

    if (!advice) {

        return `
            <h3>Your Personalized Plan</h3>
            <p>
                Your style plan is being prepared. Please try again.
            </p>
        `;

    }


    /*
       Convert common Markdown formatting
       into simple HTML.
    */

    let formatted = escapeHTML(advice);


    /* Bold text */

    formatted = formatted.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );


    /* Headings */

    formatted = formatted.replace(
        /^### (.*?)$/gm,
        "<h3>$1</h3>"
    );

    formatted = formatted.replace(
        /^## (.*?)$/gm,
        "<h3>$1</h3>"
    );


    /* Bullet points */

    formatted = formatted.replace(
        /^[-•] (.*?)$/gm,
        "<li>$1</li>"
    );


    /* Wrap consecutive list items */

    formatted = formatted.replace(
        /(<li>.*?<\/li>)+/gs,
        match => `<ul>${match}</ul>`
    );


    /* Paragraphs */

    formatted = formatted
        .split(/\n{2,}/)
        .map(block => {

            if (
                block.startsWith("<h3>") ||
                block.startsWith("<ul>")
            ) {
                return block;
            }

            return `<p>${block.replace(/\n/g, "<br>")}</p>`;

        })
        .join("");


    return formatted;

}


/* =========================================
   HTML SECURITY HELPER
========================================= */

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


/* =========================================
   BUTTON MICRO-INTERACTION
========================================= */

document.addEventListener("click", function (event) {

    const button = event.target.closest("button");

    if (!button) {
        return;
    }


    button.style.transform = "scale(0.97)";


    setTimeout(() => {

        button.style.transform = "";

    }, 120);

});


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements = document.querySelectorAll(
    ".problem-card, .step, .service-card, .style-form"
);


const revealObserver = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

                revealObserver.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.12
    }
);


revealElements.forEach(element => {

    element.style.opacity = "0";

    element.style.transform = "translateY(25px)";

    element.style.transition =
        "opacity 0.6s ease, transform 0.6s ease";

    revealObserver.observe(element);

});