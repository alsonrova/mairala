const navButton = document.getElementById("navigation_button");
const navigation = document.querySelector(".navigation");

navButton.addEventListener("click", function() {
    navigation.classList.toggle("active");
});
