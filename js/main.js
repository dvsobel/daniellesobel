//send a message to the console
// console.log("Is this page loading?");

// alert("this is a function!");

//boolean to toggle states
// var pcontact_showing = true;

//add event listener to element, event is click, displayElement is the function that will
//be called when the user clicks on the element
// document.getElementById("pcontact").addEventListener("click", display_second_element);


//function is being defined here- display element
// function display_second_element(){

	//if else statement to determine behavior 
	//if the paragraph is showing, do something
	//else, do something else
// 	if(pcontact_showing == true){
// 		document.getElementById("pcontact_info").style.display="none";

// 		pcontact_showing = false;
// 	}
// 	else{
// 		document.getElementById("pcontact_info").style.display="inherit";
		

// 		pcontact_showing = true;

// 	}	

// }


// how to link to another page
document.getElementById("DrawingApp").addEventListener("click",function(){
    window.location.href="drawingApp.html";
});

document.getElementById("painting").addEventListener("click",function(){
    window.location.href="design.html";
});

document.getElementById("unity").addEventListener("click",function(){
    window.location.href="unity.html";
});

document.getElementById("cloud").addEventListener("click",function(){
    window.location.href="major-studio.html";
});
document.getElementById("drone").addEventListener("click",function(){
    window.location.href="drone.html";
});

document.getElementById("activities").addEventListener("click",function(){
    window.location.href="activties.html";
});

document.getElementById("instruction").addEventListener("click",function(){
    window.location.href="instruction.html";
});





//development
/*------------------------------------------------*/
//	Single-Page Application (SPA) Exercise with
//	Handlebars templating & jQuery only
//	Modified from: http://tutorialzine.com/2015/02/single-page-app-without-a-framework/
/*------------------------------------------------*/

var app = app || {};

app.main = (function() {
	// Globals variables
	var students = [],	// our main array- list of students are going inside it
		filters = {};	// array containing filtered values
		// will output something like:
		// filters = {
		// 	"thesis-category" =["dataart","poeticobjects"]
		// }

	var checkboxes = $('.all-students input[type=checkbox]');

	/*------------------------------------------------*/
	//	All the events listeners for frontend nav goes here
	/*------------------------------------------------*/
	function attachEvents() {
		// For 'About' button
		$('.filters button.abt').click(function (e) {
			e.preventDefault();
			window.location.hash = '#about';
		});
		// For 'Contact' button
		$('.filters button.ctc').click(function (e) {
			e.preventDefault();
			window.location.hash = '#contact';
		});
		// For 'Close (X)' buttons
		$('.close').click(function (e) {
			e.preventDefault();
			window.location.hash = '#';
		});
		// For 'Clear filters'
		$('.filters button.clear').click(function (e) {
			e.preventDefault();
			window.location.hash = '#';
		});


		// For Checkbox filtering
		checkboxes.click(function () {
			// "this" in Javascript is a reference to the DOM element of invocation.
			// jQuery $(this) selector will basically handle every item found in the loop
			var that = $(this), //take the checkbox name
				cat = that.attr('name'); //get the name of it
				// console.log("this is cat" + cat);
			// When a checkbox is checked we need to write that in the filters object;
			if(that.is(":checked")) { // if its clicked take the category and put it in the object called filters
				// If the filter for this category isn't created yet - do it.
				if(!(filters[cat] && filters[cat].length)){
					filters[cat] = [];
				}
				//	Push values into the chosen filter array
				filters[cat].push(that.val());
				// console.log(filters);
				// Change the url hash;
				createQueryHash(filters);
			}

			// When a checkbox is unchecked we need to remove its value from the filters object.
			if(!that.is(":checked")) {
				if(filters[cat] && filters[cat].length && (filters[cat].indexOf(that.val()) != -1)){
					// Find the checkbox value in the corresponding array inside the filters object.
					var index = filters[cat].indexOf(that.val());

					// Remove it.
					filters[cat].splice(index, 1); //we are filling it what filters is

					// If it was the last remaining value for this specification,
					// delete the whole array.
					if(!filters[cat].length){
						delete filters[cat];
					}
				}

				// Change the url hash;
				createQueryHash(filters); //what does this create?
			}
		});
	}

	/*------------------------------------------------*/
	//	Load the JSON
	/*------------------------------------------------*/
	function loadData() {
		$.getJSON( "../students.json", function( data ) {
			// Write the data into our global variable.
			students = data;

			// Call a function to create HTML for all the students.
			generateAllStudentsHTML(students);

			// Manually trigger a hashchange to start the app.
			$(window).trigger('hashchange');
		});
	}

	/*------------------------------------------------*/
	//	Mapping nav url to render specific page
	/*------------------------------------------------*/
	function render(url) { //everytime render is called..url is changed, go through this function
		// Get the keyword from the url.
		var temp = url.split('/')[0];

		// Hide whatever page is currently shown.
		$('.main-content .page').removeClass('visible');

		var	map = {
			// The "Homepage".
			'': function() {
				// Clear the filters object, uncheck all checkboxes, show all the students
				filters = {};
				checkboxes.prop('checked',false);

				renderStudentsPage(students);
			},

			'#about': function() {
				renderAboutPage();
			},

			'#contact': function() {
				renderContactPage();
			},

			// Single student's project page.
			'#project': function() {
				// Get the index of which project we want to show and call the appropriate function.
				var index = url.split('#project/')[1].trim();

				renderSingleProjectPage(index, students);
			},

			// Page with filtered students.. turn it back into an object. find it in the json then turn it into it
			'#filter': function() {
				// Grab the string after the '#filter/' keyword. Call the filtering function.
				url = url.split('#filter/')[1];

				// Try and parse the filters object from the query string.
				try {
					// var t = '{"thesis-category":' + url + '}';
					// var p = '{"studio-professor[0]":' + url + '}';
					filters = JSON.parse(url);
				}
				// If it isn't a valid json, go back to homepage ( the rest of the code won't be executed ).
				catch(err) {
					window.location.hash = '#';
					return;
				}
				renderFilterResults(filters, students); // you are passing the json file through this to render results
			
			}

		};

		// Execute the needed function depending on the url keyword (stored in temp).
		if(map[temp]){
			map[temp]();
		}
		// If the keyword isn't listed in the above - render the error page.
		else {
			renderErrorPage();
		}
	}

	/*------------------------------------------------*/
	// This fills up the students list via a handlebars template.
	// It receives one parameter - the data we took from students.json.
	/*------------------------------------------------*/
	function generateAllStudentsHTML(data) {

		var list = $('.all-students .students-list');

		var source = $("#students-template").html();
		//Compile the template​
		var template = Handlebars.compile(source);
		list.append (template(data));

		// Each students has a data-index attribute.
		// On click change the url hash to open up a preview for this project only.
		// Remember: every hashchange triggers the render function.
		list.find('li').on('click', function (e) {
			e.preventDefault();
			var studentIndex = $(this).data('index');
			window.location.hash = 'project/' + studentIndex;
		})
	}

	function renderAboutPage(){
		var page = $('.about');
		page.addClass('visible');
	}

	function renderContactPage(){
		var page = $('.contact');
		page.addClass('visible');
	}

	function renderErrorPage(){
		var page = $('.error');
		page.addClass('visible');
	}

	/*------------------------------------------------*/
	// Iterate through the students object & Make the students page visible
	/*------------------------------------------------*/
	function renderStudentsPage(data){ //take our results array- go through the students and hide all of it

		var page = $('.all-students'),
			allStudents = $('.all-students .students-list > li');

		// Hide all the students in the students list.
		allStudents.addClass('hidden'); //hide all of the students

		// Iterate over all of the students.
		// If their ID is somewhere in the data object remove the hidden class to reveal them.
		allStudents.each(function () {

			var that = $(this);

			data.forEach(function (item) {
				if(that.data('index') == item.id){
					that.removeClass('hidden'); //removing the class hidden to show them
				}
			});
		});

		// Show the page itself.
		// (the render function hides all pages so we need to show the one we want).
		page.addClass('visible');
	}

	/*------------------------------------------------*/
	// Pop-up the project detail
	/*------------------------------------------------*/
	// Its parameters are an index from the hash and the students object.
	function renderSingleProjectPage(index, data){
		var page = $('.single-project'),
			container = $('.popup-detail');

		// Find the wanted project by iterating the data object and searching for the chosen index.
		if(data.length){
			data.forEach(function (item) {
				if(item.id == index){
					// Populate '.popup-detail' with the chosen project's data.
					container.find('h3').text(item.project.title);
					container.find('h4').text(item.project.blurb);
					container.find('img').attr('src', item.project.image);
					container.find('p').text(item.project.description);
				}
			});
		}

		// Show the page.
		page.addClass('visible');

	}

	/*------------------------------------------------*/
	// Find and render the filtered data results. Arguments are:
	// filters - our global variable - the object with arrays about what we are searching for.
	// students - an object with the full students list (from students.json).
	/*------------------------------------------------*/
	function renderFilterResults(filters, students){

			// This array contains all the possible filter criteria.
		var criteria = ['thesis-category'],
			results = [],
			isFiltered = false;

		// Uncheck all the checkboxes.
		// We will be checking them again one by one.
		checkboxes.prop('checked', false);


		criteria.forEach(function (c) { //variable that will change

			// Check if each of the possible filter criteria is actually in the filters object.
			if(filters[c] && filters[c].length){ //if theres something inside category go check if its filter if its not then go into filers


				// After we've filtered the students once, we want to keep filtering them.
				// That's why we make the object we search in (students) to equal the one with the results.
				// Then the results array is cleared, so it can be filled with the newly filtered data.
				if(isFiltered){
					students = results;
					results = [];
					// console.log(results);
				}


				// In these nested 'for loops' we will iterate over the filters and the students
				// and check if they contain the same values (the ones we are filtering by).

				// Iterate over the entries inside filters.criteria (remember each criteria contains an array).
				filters[c].forEach(function (filter) { //for each filter go into it and for each object go into it and find the string
					// console.log(filters[c]);
					// Iterate over the students.
					students.forEach(function (item){

						// If the project has the same specification value as the one in the filter
						// push it inside the results array and mark the isFiltered flag true.

						if(typeof item.project[c] == 'string'){
							if(item.project[c].toLowerCase().indexOf(filter) != -1){
								results.push(item);//putting everthing into result array
								isFiltered = true;
							}
						}
					});

					// Here we can make the checkboxes representing the filters true,
					// keeping the app up to date.
					if(c && filter){
						console.log(c, filter);
						$('input[name='+c+'][value='+filter+']').prop('checked',true);
					}
				});
			}

		});

		// Call the renderStudentsPage.
		// As it's argument give the object with filtered students.
		renderStudentsPage(results);
	}

	/*------------------------------------------------*/
	// Get the filters object, turn it into a string and write it into the hash.
	/*------------------------------------------------*/
	function createQueryHash(filters){ //making it s string to make it text
		// Here we check if filters isn't empty.
		if(!$.isEmptyObject(filters)){
			// Stringify the object via JSON.stringify and write it after the '#filter' keyword.

			// since filters is an object we need to stringify it
			var str = JSON.stringify(filters);
			// this is the output {"thesis-category"=["dataart"]}
			// we just want a substring of the category name
			// var temp = str.substr(19, str.length-1);
			//and get rid of the '}' to get rid of first and last
			// var clean_url = temp.replace('}', '').replace(':', ''); //take curly bracket and replace it with blank
			// console.log(clean_url); //took out the curly bracket but still have a colen. length is different

			window.location.hash = '#filter/' + str;
		}
		else{
			// If it's empty change the hash to '#' (the homepage).
			window.location.hash = '#';
		}
	}

	/*------------------------------------------------*/
	//	The Almighty Init
	/*------------------------------------------------*/
	var init = function(){
		console.log('Initializing app.');
		attachEvents();
		loadData();

		// An event handler with calls the render function on every hashchange.
		// The render function will show the appropriate content of out page.
		$(window).on('hashchange', function(){
			render(decodeURI(window.location.hash));
		});
	};

	return {
		init: init
	};
})();

/* Wait for all elements on the page to load */
window.addEventListener('DOMContentLoaded', app.main.init);
