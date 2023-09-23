"use strict";
document.addEventListener("DOMContentLoaded", function () {
	//elements
	const navigationLinks = document.querySelectorAll('.header-link a');
	const hamburgerIcon = document.querySelector("header").querySelector(".hamburger");
	const headerMenu = document.querySelector("header").querySelector(".header-menu");
	const heroMotto = document.querySelector("section.hero").querySelector("h3");
	const baseUri = 'https://backend.getlinked.ai/';
	let toggleCount = 0;

	const initBounce = function () {
		function removeBounceClass() {
			const elements = document.querySelectorAll('.bounce');
			elements.forEach((element) => {
				element.classList.remove('bounce');
			});
		}

		// Function to add the "bounce" class to elements when they are in view
		function addBounceClass(entries) {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('bounce');
				}
			});
		}

		// Intersection Observer configuration
		const observerOptions = {
			root: null, // Use the viewport as the root
			rootMargin: '0px', // No margin
			threshold: 0.5, // 50% of the element must be in view
		};

		// Create an Intersection Observer
		const observer = new IntersectionObserver(addBounceClass, observerOptions);

		// Remove the "bounce" class from all elements initially
		removeBounceClass();

		// Get all elements with the class name "bounce"
		const elements = document.querySelectorAll('.bounce');

		// Observe each element
		elements.forEach((element) => {
			observer.observe(element);
		});
		
	}

	const initHeaderLinks = function() {

		navigationLinks.forEach(link => {
			link.addEventListener('click', (event) => {

				navigationLinks.forEach(navLink => {
					navLink.classList.remove('active');
				});
				link.classList.add('active');
			});
		});
	}

	const handleHamburgerClick = function() {
		hamburgerIcon.addEventListener('click', (_) => {
			hamburgerIcon.classList.toggle("opened");
			toggleCount++;
			if (toggleCount % 2) {
				headerMenu.style.visibility = "visible";
			}
			else
			{
				headerMenu.style.visibility = "hidden";

			}
		})
	}

	const initializeTyped = function() {

		const targetElement = document.getElementById("typed-element");
		targetElement.textContent = "";
		const text = "Igniting a Revolution in HR Innovation";
		let index = 0;
		let text_string = `
				<span>
					<svg width="255" viewBox="0 0 255 17" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M1 14.043C43.3333 5.7097 154.4 -5.95697 254 14.043" stroke="#FF26B9" stroke-width="5"/>
					</svg>
				</span>
		`;
		let child_span = document.createElement("span");
		child_span.innerHTML = text_string;
		let new_el = child_span.firstElementChild;

		function type() {
			if (index < text.length) {
				targetElement.textContent += text.charAt(index);
				index++;
				setTimeout(type, 100);
			}
			else
			{
				targetElement.appendChild(new_el);
			}
		}

		const observer = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					type();
					observer.unobserve(entry.target);
				}
			});
		}); 
		observer.observe(targetElement);

  };

	const initCountDown = function () {
		function countdown() {
			const countdownDate = new Date("2027-12-31 23:59:59").getTime(); // Set your target date and time
			const countdownElement = document.getElementById("countdown");

			function updateCountdown() {
				const now = new Date().getTime();
				const timeRemaining = countdownDate - now;

				if (timeRemaining <= 0) {
					clearInterval(interval);
					countdownElement.innerHTML = "Countdown expired!";
					return;
				}

				const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
				const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
				const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

				document.querySelector(".hero-countdown-div").querySelector(".hour-countdown").innerText = hours.toString().padStart(2, "0");
				document.querySelector(".hero-countdown-div").querySelector(".minute-countdown").innerText = minutes.toString().padStart(2, "0");
				document.querySelector(".hero-countdown-div").querySelector(".seconds-countdown").innerText = seconds.toString().padStart(2, "0");
			}

			updateCountdown();
			const interval = setInterval(updateCountdown, 1000);
		}

		countdown();
	}
	const categoryListSelect = document.getElementById('dds1');

// Function to populate the "category_list" select element
	function populateCategoryList(categories) {
		// Clear existing options
		categoryListSelect.innerHTML = '';

		// Create and add default option
		const defaultOption = document.createElement('option');
		defaultOption.value = '';
		defaultOption.text = 'Select your category';
		defaultOption.disabled = true;
		categoryListSelect.appendChild(defaultOption);

		// Populate options with category names
		categories.forEach(category => {
			const option = document.createElement('option');
			option.value = category.name;
			option.text = category.name;
			categoryListSelect.appendChild(option);
		});
	}

	fetch(baseUri + 'hackathon/categories-list')
  .then(response => response.json())
  .then(data => {
    if (Array.isArray(data) && data.length > 0 && data[0].hasOwnProperty('name')) {
				console.log("data retrieved");
      populateCategoryList(data);
    } else {
      alert('Invalid response data structure.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });


	// driver code
	initHeaderLinks();
	handleHamburgerClick();
	initializeTyped();
	initCountDown();
	initBounce();

});
