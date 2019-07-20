$( document ).ready(function() {

	document.querySelector('#txtEmail').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { 
      $('#btnGo').click();
      }
	});

	document.querySelector('#txtEmailC').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { 
      $('#btnGoC').click();
      }
	});


	$('#btnGo').click(function(){
		var data = $("#txtEmail").val();
		$("#txtEmail").val("");
		createQueryHash(data);
	});

	$('#btnGoC').click(function(){
		window.scrollTo(0,0)
		var data = $("#txtEmailC").val();
		$("#txtEmailC").val("");
		createQueryHash(data);
	});

	$('#txtEmail').focus(function(){
		$('#input').attr('class','placeholder left top input');
		$('#txtEmail').attr('class','active txtEmail');
	});

	$('#txtEmail').blur(function(){
		changePlaceHolder('txtEmail','input')
	});


	$('#txtEmailC').focus(function(){
		$('#inputC').attr('class','placeholder left top input');
		$('#txtEmailC').attr('class','active txtEmail');
	});

	$('#txtEmailC').blur(function(){
		changePlaceHolder('txtEmailC','inputC')
	});

	$.ajax({
  	url: "https://data-json-api.herokuapp.com/data",
  	success: function( result ) {
    		var data;
			data = result;
			localStorage.setItem('data', JSON.stringify(data));
  		}
	});
});

$(function () { 
	$(window).trigger('hashchange');
});

$(window).on('hashchange', function(){
        // On every hash change the render function is called with the new hash.
        // This is how the navigation of our app happens.
        render(decodeURI(window.location.hash));
    });

 function isValidEmail(mail) { 
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail); 
}

function renderMainPage(){
	var mainpage = document.getElementById('main-page');
	var resultpage = document.getElementById('result-page');
	mainpage.classList.add('visible');
	mainpage.classList.remove('not-visible');
	resultpage.classList.remove('visible');
	resultpage.classList.add('not-visible');
}

function renderResultPage(data){
	var mainpage = document.getElementById('main-page');
	var resultpage = document.getElementById('result-page');
	
	var name = document.getElementById('name');
	var notes = document.getElementById('notes');
	var address = document.getElementById('address');
	var email = document.getElementById('email');
	var phone = document.getElementById('phones');
	var relatives = document.getElementById('relatives');

	name.innerHTML  = data.name + ', '+ data.age;
	notes.innerHTML = '<p class="paragraph">' + data.notes + '</p>';
	address.innerHTML = '<p class="p-sheet paragraph">'+data.address+'</p>';
	email.innerHTML = '<p class="p-sheet paragraph">' +  data.email +'</p>';

	var PhoneHTML = "";
	data.phoneNumbers.forEach(function(item){
		if (typeof item.phone !== "undefined") {
		PhoneHTML = PhoneHTML + '<p class="phone">'+ item.phone +'</p>';
		}
	});
	phone.innerHTML = PhoneHTML;

	var relativesHTML = "";
	data.relatives.forEach(function(item){
		if (typeof item.name !== "undefined") {
		relativesHTML = relativesHTML + '<p class="p-sheet paragraph">'+  item.name +'</p>';
		}
	});
	relatives.innerHTML = relativesHTML;


	resultpage.classList.add('visible');
	resultpage.classList.remove('not-visible');
	mainpage.classList.remove('visible');
	mainpage.classList.add('not-visible');
}

function render(url){
	var temp = url.split('/')[0];
	var mainpage = document.getElementById('main-page');
	mainpage.classList.remove('visible');
	mainpage.classList.add('not-visible');
	var map = {
			'': function() {
				renderMainPage();
            },
            '#person': function() {
            	var email = url.split('#person/')[1].trim();
            	var data = buscar(email);
            	renderResultPage(data);
            }
        }
    map[temp]();
}

function buscar(email){
	var data = JSON.parse(localStorage.getItem('data'));;
	var result;
	data.forEach(function(item){
		if (item.email == email){
			result = item;
			}
		});
	return result;
	}

function createQueryHash(email){
	if(email.length > 0){
      window.location.hash = '#person/' + email;
    }
    else{
      window.location.hash = '#';
    }

}

function changePlaceHolder(input,div){
	var email = $('#'+input).val();
	if (email == "") {
			$('#'+div).removeAttr('class');
			$('#'+div).attr('class','placeholder left input');
			$('#'+input).removeAttr('class');
			$('#'+input).attr('class','txtEmail');
		}else{
			if (!isValidEmail(email)) {
				$('#'+div).removeAttr('class');

				$('#'+input).removeAttr('class');
				$('#'+input).attr('class','error txtEmail');
				$('#'+div).removeAttr('data-placeholder');
				$('#'+div).attr('data-placeholder','Please add a valid email address');

				$('#'+div).attr('class','placeholder left top text-red input');
			}else{
				$('#'+input).removeAttr('class');
				$('#'+div).removeAttr('data-placeholder');
				$('#'+div).attr('data-placeholder','EMAIL');
			}
		}
}


