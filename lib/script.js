const navButton = document.getElementById("navigation_button");
const navigation = document.querySelector(".navigation");

if (navButton && navigation) {
    navButton.addEventListener("click", function () {
        navigation.classList.toggle("active");
    });
}

/**
 * Simple review carousel for the homepage testimonials block.
 * Cycles through predefined testimonials, syncs pagination dots
 * and supports manual selection by clicking a dot.
 */
const reviews = [
    {
        title: "WHAT OUR CLIENTS ARE SAYING",
        quote:
            "« Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis fugit, dicta numquam aspernatur ducimus saepe maiores possimus quam asperiores dignissimos aperiam inventore. »",
        name: "John Doe",
        url: "https://john-doe.com",
        urlLabel: "john-doe.com",
    },
    {
        title: "WHAT OUR CLIENTS ARE SAYING",
        quote:
            "« Aperiam explicabo excepturi quae id dicta, doloremque incidunt laborum ipsam minus possimus fugit distinctio asperiores dolorum accusantium, reiciendis voluptatem. »",
        name: "Jane Keller",
        url: "https://jkellerstudio.com",
        urlLabel: "jkellerstudio.com",
    },
    {
        title: "WHAT OUR CLIENTS ARE SAYING",
        quote:
            "« Magnam molestias quasi molestiae! Quibusdam ipsum voluptatum tempora ad quos quas maiores consequuntur fugiat similique voluptatem, labore quis magnam. »",
        name: "Carlos Alvarez",
        url: "https://alvarezandco.com",
        urlLabel: "alvarezandco.com",
    },
];

const reviewTitle = document.querySelector(".homepage_reviews__card--title");
const reviewText = document.querySelector(".homepage_reviews__card--review");
const reviewName = document.querySelector(".homepage_reviews__card--name");
const reviewUrl = document.querySelector(".homepage_reviews__card--url");
const dots = document.querySelectorAll(".homepage_reviews__dot");

let currentReviewIndex = 0;
let reviewIntervalId;

const hasCarouselElements =
    reviewTitle && reviewText && reviewName && reviewUrl && dots.length;

function renderReview(index) {
    const review = reviews[index];
    if (!review) {
        return;
    }

    reviewTitle.textContent = review.title;
    reviewText.textContent = review.quote;
    reviewName.textContent = review.name;
    reviewUrl.textContent = review.urlLabel;
    reviewUrl.setAttribute("href", review.url);
}

function highlightDot(index) {
    dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === index;
        dot.classList.toggle("is-active", isActive);
        dot.style.backgroundColor = isActive ? "var(--color-quinary)" : "transparent";
    });
}

function goToReview(index) {
    currentReviewIndex = index;
    renderReview(currentReviewIndex);
    highlightDot(currentReviewIndex);
}

function startReviewAutoplay() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    clearInterval(reviewIntervalId);
    reviewIntervalId = setInterval(() => {
        const nextIndex = (currentReviewIndex + 1) % reviews.length;
        goToReview(nextIndex);
    }, 6000);
}

if (hasCarouselElements) {
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            goToReview(index);
            startReviewAutoplay();
        });
    });

    goToReview(currentReviewIndex);
    startReviewAutoplay();
}

/**
 * Progress circle animation for the skills section.
 * Reveals each SVG stroke when its card enters the viewport.
 */
const skillCards = document.querySelectorAll(".homepage_skills__card");

if (skillCards.length) {
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const skillObserver = !prefersReducedMotion
        ? new IntersectionObserver(
              (entries, observer) => {
                  entries.forEach((entry) => {
                      if (!entry.isIntersecting) {
                          return;
                      }

                      const card = entry.target;
                      const circle = card.querySelector("svg circle:nth-of-type(2)");
                      if (!circle) {
                          observer.unobserve(card);
                          return;
                      }

                      const targetOffset = Number(circle.dataset.targetOffset);
                      circle.style.transition = "stroke-dashoffset 1.6s ease-out";
                      requestAnimationFrame(() => {
                          circle.style.strokeDashoffset = targetOffset;
                      });
                      observer.unobserve(card);
                  });
              },
              {
                  threshold: 0.35,
              }
          )
        : null;

    skillCards.forEach((card) => {
        const valueElement = card.querySelector("span");
        const circle = card.querySelector("svg circle:nth-of-type(2)");

        if (!valueElement || !circle) {
            return;
        }

        const percent = parseInt(valueElement.textContent, 10);
        if (Number.isNaN(percent)) {
            return;
        }

        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const targetOffset = circumference - (percent / 100) * circumference;

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
        circle.dataset.targetOffset = `${targetOffset}`;

        if (prefersReducedMotion || !skillObserver) {
            circle.style.strokeDashoffset = targetOffset;
            return;
        }

        skillObserver.observe(card);
    });
}
