/* ===================================
--------------------------------------
  LOANS2GO | Loans HTML Template
  Version: 1.0
--------------------------------------
======================================*/


'use strict';

$(window).on('load', function() {
	/*------------------
		Preloder
	--------------------*/
	$(".loader").fadeOut();
	$("#preloder").delay(400).fadeOut("slow");

});

(function($) {
	/*------------------
		Navigation
	--------------------*/
	$(".main-menu").slicknav({
        appendTo: '.header-section',
		allowParentLinks: true,
		closedSymbol: '<i class="fa fa-angle-right"></i>',
		openedSymbol: '<i class="fa fa-angle-down"></i>'
	});

	/*------------------
		Background Set
	--------------------*/
	$('.set-bg').each(function() {
		var bg = $(this).data('setbg');
		$(this).css('background-image', 'url(' + bg + ')');
	});

	/*------------------
		Hero Slider
	--------------------*/
	$('.hero-slider').owlCarousel({
		loop: true,
		nav: false,
		dots: true,
		mouseDrag: false,
		animateOut: 'fadeOut',
		animateIn: 'fadeIn',
		items: 1,
		autoplay: true
	});

	/*--------------------------
		Loans slide calculator
	------------------------------*/
	$("#slider-range-max").slider({
	  range: "max",
	  min: 1000,
	  max: 15000,
	  step: 10,
	  change: function (event, ui) {
		$("#loan-value").text('$' + ui.value);
		$("#lone-emi").text('$' + emi(ui.value));
		console.log(ui);
		
	  },
	  slide: function (event, ui) {
		$("#loan-value").text('$' + ui.value);
		$("#lone-emi").text('$' + emi(ui.value));
	  }
	});
  
	$("#lc-inc").click(function () {
	  var value = $("#slider-range-max").slider("value");
	  var step = $("#slider-range-max").slider("option", "step");
	  $("#slider-range-max").slider("value", value + step);
	  
	});

	$("#lc-dec").click(function () {
	  var value = $("#slider-range-max").slider("value")
	  var step = $("#slider-range-max").slider("option", "step");
	  $("#slider-range-max").slider("value", value - step);
	});

	function emi (amount) {
		var result,
			emi = 52;
		result = Math.round(amount/emi);
		return result;
	}

	/*------------------
		Accordions
	--------------------*/
	$('.panel-link').on('click', function (e) {
		$('.panel-link').removeClass('active');
		var $this = $(this);
		if (!$this.hasClass('active')) {
			$this.addClass('active');
		}
		e.preventDefault();
	});

	/*------------------
		Circle progress
	--------------------*/
	$('.circle-progress').each(function() {
		var cpvalue = $(this).data("cpvalue");
		var cpcolor = $(this).data("cpcolor");
		var cptitle = $(this).data("cptitle");
		var cpid 	= $(this).data("cpid");

		$(this).append('<div class="'+ cpid +'"></div><div class="progress-info"><h2>'+ cpvalue +'%</h2><p>'+ cptitle +'</p></div>');

		if (cpvalue < 100) {

			$('.' + cpid).circleProgress({
				value: '0.' + cpvalue,
				size: 163,
				thickness: 5,
				fill: cpcolor,
				emptyFill: "rgba(0, 0, 0, 0)"
			});
		} else {
			$('.' + cpid).circleProgress({
				value: 1,
				size: 163,
				thickness: 5,
				fill: cpcolor,
				emptyFill: "rgba(0, 0, 0, 0)"
			});
		}

	});
	/*------------------------------Tự code---------------------------------*/
	/*------------------
		Modal
	--------------------*/
	function showModal(message) {
		let html = "";
		let time = new Date().getTime();
		let classModal = "modalError-" + time;
		html += '<div class="modal fade ' + classModal + '" role="dialog">';
		html += '<div class="modal-dialog" style="width: 250px;">';
		html += '<div class="modal-content">';
		html += '<div class="modal-body">';
		html += '<p id="error">' + escapeHtml(message) + '</p>';
		html += '</div>';
		html += '<div class="modal-footer">';
		html += '<button type="button" class="btn btn-primary" data-dismiss="modal">OK</button>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		$('body').append(html);
		$('body').find('.' + classModal).modal();
	
		$('body').on('hidden.bs.modal', '.' + classModal, function (e) {
		    $('body').find('.' + classModal).remove();
		    return false;
		});
	}
	
	/*------------------
		Modal confirm
	--------------------*/
	var _cbComfirm = [];
	function showModalConfirm(message, callback) {
		let time = new Date().getTime();
		_cbComfirm[time] = callback;
		let classModal = "modalConfirm-" + time;
		let html = "";
		html += '<div class="modal fade ' + classModal + '" role="dialog" data-backdrop="static" data-keyboard="false">';
		html += '<div class="modal-dialog" style="width: 250px;">';
		html += '<div class="modal-content">';
		html += '<div class="modal-body">';
		html += '<p id="error">' + escapeHtml(message) + '</p>';
		html += '</div>';
		html += '<div class="modal-footer">';
		html += '<button type="button" class="btn btn-primary btn-ok">OK</button>';
		html += '<button type="button" class="btn btn-danger btn-cancel">Cancel</button>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		$('body').append(html);
		$('body').find('.' + classModal).modal();
	
		$('body').on('click', '.' + classModal + ' .btn-ok', function (e) {
			if (_cbComfirm[time] != null) {
				_cbComfirm[time](true);
			}
		    $('body').find('.' + classModal).modal('hide');
		    return false;
		});
	
		$('body').on('click', '.' + classModal + ' .btn-cancel', function (e) {
			if (_cbComfirm[time] != null) {
				_cbComfirm[time](false);
			}
		    $('body').find('.' + classModal).modal('hide');
		    return false;
		});
	
		$('body').on('hidden.bs.modal', '.' + classModal + '', function (e) {
		    _cbComfirm[time] = null;
		    $('body').find('.' + classModal + '').remove();
		    return false;
		});
	}

	/*------------------
		Escape html
	--------------------*/
	function escapeHtml(unsafe) {
		unsafe = unsafe + '';
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	/*------------------
		Event click apply
	--------------------*/
	$('.btn-apply').on('click', function(e) {
		let name = $('.ip-name').val();
		let phone = $('.ip-phone').val();
		let amount = $('.sl-amount').val();
		if (name == '') {
			showModal('Vui lòng nhập họ và tên');
			$('.ip-name').focus();
			return false;
		}

		if (phone == '') {
			showModal('Vui lòng nhập số điện thoại');
			$('.ip-phone').focus();
			return false;
		}

		if (amount == '') {
			showModal('Vui lòng chọn khoản vay');
			$('.sl-amount').focus();
			return false;
		}

		let dataPost = {
			name : name,
			phone : phone,
			amount : amount,
		}
		
		$.ajax({
            url: '/apply',
            type: 'post',
			dataType: 'json',
			data: dataPost,
            success: function (result) {
				if (result.error != "OK") {
					showModal(err);
					return;
				}
				showModal("Đã gửi hồ sơ, chúng sẽ sẽ sớm liên hệ tới quí khách. Xin cảm ơn!");
				return;
            },
        });
		return false;
	});
})(jQuery);

