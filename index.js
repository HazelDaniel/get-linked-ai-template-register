"use strict";
document.addEventListener("DOMContentLoaded", function () {
	//elements
	const navigationLinks = document.querySelectorAll('.header-link a');
	const hamburgerIcon = document.querySelector("header").querySelector(".hamburger");
	const headerMenu = document.querySelector("header").querySelector(".header-menu");
	const baseUri = 'https://backend.getlinked.ai/';
	const registerForm = document.querySelector('.register-form');
	const categoryListSelect = document.getElementById('dds1');
	let toggleCount = 0;

	const registerTransformObject = {
		"MOBILE" : 1,
		"WEB": 2,
		"UI/UX": 3
	}

	const handleToastRender = function(message) {
		const toast = document.querySelector('.toast');


		if (toast) {
			const pElement = toast.querySelector('p');
			const cancelButton = toast.querySelector('.cancel');

			if (pElement)
				pElement.textContent = message;
			if (cancelButton)
			{
				cancelButton.addEventListener('click', function(){
					toast.classList.remove('slide-in');
				})
			}
			toast.classList.add('slide-in');
		}
		setTimeout(()=>{
			toast.classList.remove('slide-in');
		}, 2200);
	};

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
		};

		// Create an Intersection Observer
		const observer = new IntersectionObserver(addBounceClass, observerOptions);

		// Remove the "bounce" class from all elements initially
		removeBounceClass();

		// Get all elements with the class name "bounce"
		const elements = document.querySelectorAll('.animate-bounce');
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


	function populateCategoryList(categories) {
		categoryListSelect.innerHTML = '';

		const defaultOption = document.createElement('option');
		defaultOption.value = '';
		defaultOption.text = 'Select your category';
		defaultOption.disabled = true;
		categoryListSelect.appendChild(defaultOption);

		categories.forEach(category => {
			const option = document.createElement('option');
			option.value = category.name;
			option.text = category.name;
			categoryListSelect.appendChild(option);
		});
	}

	function populateCategoryList(categories) {
		categoryListSelect.innerHTML = '';

		const defaultOption = document.createElement('option');
		defaultOption.value = '';
		defaultOption.text = 'Select your category';
		defaultOption.disabled = true;
		categoryListSelect.appendChild(defaultOption);

		categories.forEach(category => {
			const option = document.createElement('option');
			option.value = category.name;
			option.text = category.name;
			categoryListSelect.appendChild(option);
		});
	}

	const initPopulateCategories = function () {
		fetch(baseUri + 'hackathon/categories-list')
			.then(response => response.json())
			.then(data => {
				if (Array.isArray(data) && data.length > 0 && data[0].hasOwnProperty('name')) {
					handleToastRender("Form Data Retrieved");
					populateCategoryList(data);
				} else {
					console.error('Invalid response data structure.');
				}
			})
			.catch(error => {
				console.error('Error:', error);
		});

	}

	const handleRegisterFormSubmit = function(event) {
		event.preventDefault();

		const form = document.querySelector('.register-form');

		if (!form.checkValidity()) {
			handleToastRender("Form fields not correctly provided!");
			return;
		}

		const formData = new FormData(form);
		if (formData.has("privacy_poclicy_accepted")) {
			console.log("the field exists");
			if (formData.get("privacy_poclicy_accepted") === "on")
			{
				formData.set("privacy_poclicy_accepted", true);
			}
			else
			{
				formData.set("privacy_poclicy_accepted", false);
			}
		}

		for (const [key, value] of formData.entries()) {
			if (key === "category") {
				formData.set(key, +registerTransformObject[value]);
			}
			if (key === "group_size") {
				formData.set(key, +value);
			}
		}

		for (const [key, value] of formData.entries()) {
			console.log(`key :${key} \n value : ${value}`);
		}

		fetch(baseUri + "hackathon/registration", {
			method: 'POST',
			headers: {
			"Content-Type": "application/json",
			},
			redirect: "follow",
			body: JSON.stringify(formData),
		})
			.then(response => {
				if (response.ok) {
					//this is where i display the success page
					console.log("Successfully submitted");
				} else {
					handleToastRender("Oops! something went wrong with the submission");
					console.error("Failed to submit");
				}
			})
			.catch(error => {
				console.error("Failed to submit:", error);
			});
	}


	const handleRegistrationForm = function() {
		if (registerForm) {
			registerForm.addEventListener('submit', handleRegisterFormSubmit);
		}
	}

	// driver code
	initHeaderLinks();
	handleHamburgerClick();
	initPopulateCategories();
	handleRegistrationForm();
	initBounce();

});
