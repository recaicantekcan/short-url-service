/*
* @requires jQuery 1.7.0 or later
* DValidate : jquery validate script

 * Copyright (c) DDA Bilişim Teknolojileri - Hüseyin UÇAK
 * Dual licensed under the MIT and GPL licenses.
 */

(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as anonymous module.
        define(["jquery"], factory);
    } else {
        // Browser globals.
        factory(jQuery);
    }
})(function ($) {

    "use strict";

    var $window = $(window),
        DValidate = function (element, options) {
            options = $.isPlainObject(options) ? options : {};
            this.$form      = $(element);
            this.$id        = element.id;
            this.defaults   = $.extend({}, DValidate.defaults, this.$form.data(), options);
            this.init();
        };

    DValidate.prototype =   {
        construstor: DValidate,

        init: function () {
            //this.setAspectRatio(this.defaults.aspectRatio);
            this.render();
        },
        render:function (callback) {

            var item  = this.defaults['items'];
            var datas = '';
            var elements = this.$form[0]['elements']
            var main  = this;
            item = item.split(',')
            var error = false;
            $.each(elements,function (key, val) {

                if($.inArray(val.localName,item)!== -1){

                    if(val.required){
                        if (!val.value || (val.localName=='select' && (val.value==0 || val.value==''))) {
                            if(main.defaults['onload']) {
                                main.error(val);
                            }
                        }else{
                            if(main.defaults['onload']) {
                                main.type_error(val);
                            }
                        }
                    }
                }
                main.debug(val);
                $(val).on('keyup change focusout',function () {
                    main.change(val);
                })

            })

            $(document).on('click','button[dform]',function () {
                if (typeof Ladda != 'undefined') {
                    var b = Ladda.create(document.querySelector('button[dform]'));
                    b.start();
                }
                main.debug(main.$id);
                if(!main.done()) {
                    var qu = $('.quantity-qu').val();
                    main.debug('Success...')
                    if($('.set-type-class').val()=='set') {
                        console.log('denetim var!');
                        if($('#item-response .product-item').length==0){
                            if ('undefined' == typeof window.swal) {
                                swal({
                                    title: 'Ürün seti giriniz!',
                                    text: 'Lütfen ürün seti tanımlayınız.',
                                    icon: "error",
                                    buttons: false
                                });
                            }
                            return false;
                        }else{
                            $('#item-response .product-item').each(function () {

                                var quantity = $(this).find('input').data('quantity');
                                var name = $(this).find('input').data('name');
                                var value = $(this).find('input').val()*qu;

                                if(value>quantity) {
                                    if ('undefined' == typeof window.swal) {
                                        swal({
                                            title: 'Geçersiz ürün seti adedi!',
                                            text: name + ' isimli ürüne maksimum ' + quantity + ' adet tanımlayabilirsiniz.',
                                            icon: "error",
                                            buttons: false
                                        });
                                    }
                                }else if(!value){
                                    if ('undefined' == typeof window.swal) {
                                        swal({
                                            title: 'Geçersiz ürün seti adedi!',
                                            text: name + ' isimli ürüne adet tanımlamalısınız.',
                                            icon: "error",
                                            buttons: false
                                        });
                                    }
                                }
                            })
                        }

                    }
                    main.debug('click');
                    if($(this).data('type')!='button'){
                        if($('#' + main.$id).data('action')){
                            eval($('#' + main.$id).data('action') + "()");
                        }else{
                            $('#' + main.$id).submit();
                        }
                    }
                    main.debug(main.$id)
                    main.debug($(this).attr('dform'));
                }else{
                    if (typeof Ladda != 'undefined') {
                        b.stop();
                    }
                    //main.debug(main)

                    if(main.defaults['modal'] && main.done()){
                        if ('undefined' == typeof window.swal) {
                                swal({
                                title: 'Zorunlu Alanlar Var!',
                                text: 'Lütfen girilmesi zorunlu alanları doldurunuz.',
                                icon: "error",
                                buttons: false
                            });
                        }
                    }
                }
            })

        },
        change:function (val) {
            //this.debug($(val).val())

            if (!val.value || (val.localName=='select' && (val.value==0 || val.value==''))) {
                if(val.required) {
                    this.error(val);
                }
            }else{
                this.type_error(val);
            }
        },
        error:function (val,text) {
            var temp  = this.defaults['template'];
            var err   = '';
            $(val).next('.d-errors').remove();
            $(val).removeClass('d-success');
            var child = document.createElement('div');
            child.className = 'd-errors';
            this.debug(temp)
            if(temp){
                this.debug(val)
                switch (temp){
                    case 'border':
                        this.debug('hasClass')
                        if(val.getAttribute('type')=='checkbox'){
                            $(val).parent().addClass('d-error');
                        }else {
                            if($(val).hasClass('select2-hidden-accessible')){
                                this.debug('hasClass')
                                $(val).next().addClass('d-error');
                            }else{
                                $(val).addClass('d-error');
                            }

                        }
                        break;
                    case 'after_text':
                        this.debug(val.getAttribute('data-error'));
                        if(val.getAttribute('data-error')) {
                            text = text?text:val.getAttribute('data-error');
                            err = "<dt class=\"input-error\">"+text+"</dt>";
                            child.innerHTML = err;
                            $(val).after(child);
                        }else{
                            if(text){
                                err = "<dt class=\"input-error\">"+text+"</dt>";
                                child.innerHTML = err;
                                $(val).after(child);
                            }else {
                                this.debug('Hata yazısı girilmemiş...')
                            }
                        }
                }
            }else{
                if(val.getAttribute('type')=='checkbox'){
                    $(val).parent().removeClass('d-success');
                    $(val).parent().addClass('d-error');
                }else {
                    $(val).removeClass('d-success');
                    $(val).addClass('d-error');
                }

                if(val.getAttribute('data-error')) {
                    text = text?text:val.getAttribute('data-error');
                    err = "<dt class=\"input-error\">"+text+"</dt>";
                    child.innerHTML = err;
                    $(val).after(child);
                }else {
                    if(text){
                        err = "<dt class=\"input-error\">"+text+"</dt>";
                        child.innerHTML = err;
                        $(val).after(child);
                    }else {
                        this.debug('Hata yazısı girilmemiş...')
                    }
                }
            }


        },
        type_error:function (val){

            this.debug(val.getAttribute('type'))

            if(val.getAttribute('data-type')=='ctel'){
                var tel = '';
                val.value = val.value.replace(/\D/g, '');
                tel = val.value.replace(/\ /g, '');
                tel = tel.replace(/\_/g, '');
                tel = tel.replace(/\(/g, '');
                tel = tel.replace(/\)/g, '');
                tel = tel.replace(/\-/g, '');
                tel = tel.replace(/\+/g, '');

                this.debug(tel)
                //val.value = val.value.replace('_', '');
            }
            if(val.getAttribute('data-type')=='imei'){
                val.value = val.value.replace(/\D/g, '');
                if(val.value.length>15){
                    val.value = val.value.substring(0,15)
                }
            }

            this.debug(val.getAttribute('data-type'));
            if(val.getAttribute('data-type')=='ctel') {
                if (val.required && !tel) {
                    this.error(val);
                    return true;
                } else {
                    if (tel.length != 10) {
                        this.error(val, 'Lütfen telefon numaranızı 10 haneli girin!');
                        return true;
                    } else if (tel.substring(0, 1) == 0) {
                        this.error(val, 'Telefon numarası 0 ile başlayamaz. 555 455 55 66 şeklinde giriniz.');
                        return true;
                    } else if (tel.substring(0, 1) != 5) {
                        this.error(val, 'Telefon numarası 5 ile başlamalıdır. 555 455 55 66 şeklinde giriniz.');
                        return true;
                    } else {
                        this.succes(val);
                        return false;
                    }
                }
            }else if(val.getAttribute('data-type')=='imei') {
                if (val.required && !val.value) {
                    this.error(val);
                    return true;
                }else{
                    if(val.value.length!=15){
                        this.error(val,'Lütfen IMEI numaranızı 15 haneli girin!');
                        return true;
                    }else {
                        this.succes(val);
                        return false;
                    }
                }
            }else if(val.getAttribute('type') =='checkbox'){
                if (val.required && val.checked==false) {
                    this.error(val);
                    return true;
                }else{
                    this.succes(val);
                    return false;
                }
            }else if(val.getAttribute('type') =='email'){
                var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i

                if(!pattern.test(val.value)) {
                    var text = 'Lütfen geçerli bir email adresi giriniz!';
                    this.error(val,text);
                    return true;
                }else{
                    this.succes(val);
                    return false;
                }
            }else if(val.getAttribute('data-type') && val.getAttribute('data-type')=='tax_number'){ // turkish tax number validate
                if(val.value.length>11){
                    val.value = val.value.substring(0,11);
                }
                if(val.value.length<10 || val.value.length>11){
                    var text = 'Lütfen geçerli bir vergi/tc numarası giriniz!';
                    this.error(val,text);
                    return true;
                }else{
                    var no = val.value;
                    var no1 = parseInt(no.substring(0,1));
                    var no2 = parseInt(no.substring(1,2));
                    var no3 = parseInt(no.substring(2,3));
                    var no4 = parseInt(no.substring(3,4));
                    var no5 = parseInt(no.substring(4,5));
                    var no6 = parseInt(no.substring(5,6));
                    var no7 = parseInt(no.substring(6,7));
                    var no8 = parseInt(no.substring(7,8));
                    var no9 = parseInt(no.substring(8,9));
                    var total = (no1 + no2 + no3 + no4 + no5 + no6 + no7 + no8 + no9);
                    var total_text = (no1.toString() + no2.toString() + no3.toString() + no4.toString() + no5.toString() + no6.toString() + no7.toString() + no8.toString() + no9.toString());
                    this.debug(val.value.length)
                    if(val.value.length==10){
                        var p1 = (no1 + 10 - 1 ) % 10;
                        var p2 = (no2 + 10 - 2 ) % 10;
                        var p3 = (no3 + 10 - 3 ) % 10;
                        var p4 = (no4 + 10 - 4 ) % 10;
                        var p5 = (no5 + 10 - 5 ) % 10;
                        var p6 = (no6 + 10 - 6 ) % 10;
                        var p7 = (no7 + 10 - 7 ) % 10;
                        var p8 = (no8 + 10 - 8 ) % 10;
                        var p9 = (no9 + 10 - 9 ) % 10;
                        this.debug(p1+'-'+p2+'-'+p3+'-'+p4+'-'+p5 + '-'+p6);
                        var q1 = p1==9?9:(p1*Math.pow(2,(10-1)))%9;
                        var q2 = p2==9?9:(p2*Math.pow(2,(10-2)))%9;
                        var q3 = p3==9?9:(p3*Math.pow(2,(10-3)))%9;
                        var q4 = p4==9?9:(p4*Math.pow(2,(10-4)))%9;
                        var q5 = p5==9?9:(p5*Math.pow(2,(10-5)))%9;
                        var q6 = p6==9?9:(p6*Math.pow(2,(10-6)))%9;
                        var q7 = p7==9?9:(p7*Math.pow(2,(10-7)))%9;
                        var q8 = p8==9?9:(p8*Math.pow(2,(10-8)))%9;
                        var q9 = p9==9?9:(p9*Math.pow(2,(10-9)))%9;
                        this.debug(q1+' - '+q2+' - '+q3 + ' - ' + q4 + ' - '+ q5 + ' - '+ q6+' - '+q7 + ' - '+ q8+ ' - '+q9);
                        c1 = (10 - ((q1+q2+q3+q4+q5+q6+q7+q8+q9)%10))%10;
                        this.debug('sonuc : '+c1);
                        this.debug(no + ' -- ' + (total_text+c1.toString()))
                        if(no != (total_text+c1.toString())){
                            var text = 'Lütfen geçerli bir vergi numarası giriniz!';
                            this.error(val,text);
                            return true;
                        }else{
                            this.succes(val);
                            return false;
                        }

                    }else{

                        this.debug(parseInt(no.substring(0,1)) +' - '+ parseInt(no.substring(2,3))+' - ' + parseInt(no.substring(4,5)) + ' - ' + parseInt(no.substring(6,7)));
                        var c1 =  (no1 + no3 + no5 + no7 + no9) * 7 - (no2 + no4 + no6 + no8);
                        c1 = c1 % 10;
                        var c2 = (total + c1);
                        c2 = c2 % 10;
                        this.debug(c1 + ' - ' + c2);
                        this.debug(no + ' -- ' + (total_text+c1.toString()+c2.toString()))
                        if(no != (total_text+c1.toString()+c2.toString())){
                            var text = 'Lütfen geçerli bir tc numarası giriniz!';
                            this.error(val,text);
                            return true;
                        }else{
                            this.succes(val);
                            return false;
                        }

                    }
                }
            }else{
                this.succes(val);
                return false;
            }

        },
        succes:function (val) {

            $(val).next('.d-errors').remove();
            $(val).removeClass('d-error');
            $(val).parent().removeClass('d-error');
            if(val.required) {
                $(val).addClass('d-success');
            }
        },
        debug:function (val) {
            var debug  = this.defaults['debug'];
            if(debug) {
                console.log(val);
            }
        },
        done:function () {

            var item  = this.defaults['items'];
            var datas = '';
            var elements = this.$form[0]['elements'];
            var main  = this;
            main.debug('done action!');
            item = item.split(',')
            var error = [];
            $.each(elements,function (key, val) {
                if($.inArray(val.localName,item)!== -1){
                    if(val.required){
                        main.debug(val.localName)
                        if (!val.value || (val.localName=='select' && (val.value==0 || val.value==''))) {
                            main.error(val);
                            error.push(true)
                        }else{
                            if(main.type_error(val)) {
                                error.push(true);
                            }
                        }
                    }
                }
            })

            var rval = error.length>0?true:false;
            this.debug('Done : '+rval);
            return rval;
        }

    }
    // Common methods
    DValidate.fn = {
        toggle: function ($e) {
            $e.toggleClass("cropper-hidden");
        },

        position: function ($e, option) {
            var position = $e.css("position");

            if (position === "static") {
                $e.css("position", option || "relative");
            }
        },

        size: function ($e, options) {
            if ($.isPlainObject(options)) {
                $e.css(options);
            } else {
                return {
                    height: $e.height(),
                    width: $e.width()
                };
            }
        },

        round: function (data, fn) {
            var value,
                i;

            for (i in data) {
                value = data[i];

                if (data.hasOwnProperty(i) && typeof value === "number") {
                    data[i] = Math.round($.isFunction(fn) ? fn(value) : value);
                }
            }

            return data;
        },

        transformData: function (data, ratio) {
            var _this = this,
                result = {};

            $.each(data, function (i, n) {
                if (_this.isDataOption(i) && $.isNumeric(n) && n >= 0) {
                    result[i] = Math.round(n * ratio);
                }
            });

            return result;
        },

        getOriginalEvent: function (event) {
            if (event && typeof event.originalEvent !== "undefined") {
                event = event.originalEvent;
            }

            return event;
        },

        isDataOption: function (s) {
            return /^(x1|y1|x2|y2|width|height)$/i.test(s);
        },

        isDirection: function (s) {
            return /^(\*|e|n|w|s|ne|nw|sw|se)$/i.test(s);
        }
    };

    DValidate.template = [
        '<div class="cropper-container">',
        '<div class="cropper-modal"></div>',
        '<div class="cropper-dragger">',
        '<span class="cropper-preview"></span>',
        '<span class="cropper-dashed dashed-h"></span>',
        '<span class="cropper-dashed dashed-v"></span>',
        '<span class="cropper-face" data-direction="*"></span>',
        '<span class="cropper-line line-e" data-direction="e"></span>',
        '<span class="cropper-line line-n" data-direction="n"></span>',
        '<span class="cropper-line line-w" data-direction="w"></span>',
        '<span class="cropper-line line-s" data-direction="s"></span>',
        '<span class="cropper-point point-e" data-direction="e"></span>',
        '<span class="cropper-point point-n" data-direction="n"></span>',
        '<span class="cropper-point point-w" data-direction="w"></span>',
        '<span class="cropper-point point-s" data-direction="s"></span>',
        '<span class="cropper-point point-ne" data-direction="ne"></span>',
        '<span class="cropper-point point-nw" data-direction="nw"></span>',
        '<span class="cropper-point point-sw" data-direction="sw"></span>',
        '<span class="cropper-point point-se" data-direction="se"></span>',
        '</div>',
        '</div>'
    ].join("");

    DValidate.defaults = {
        template: "after_text", // border, after_text, top_text, alert(modal)
        items: 'input,select,textarea',
        data: {},
        modal: true,
        debug: true,
        onload: false,
        preview: ""
    };

    DValidate.setDefaults = function (options) {
        $.extend(DValidate.defaults, options);
    };

    // Register as jQuery plugin
    $.fn.dvalidate = function (options, settings) {
        var result = this;

        this.each(function () {
            var $this = $(this),
                data = $this.data("dvalidate");

            if (!data) {
                data = new DValidate(this, options);
                $this.data("dvalidate", data);
                console.log('/*/*/*/ DValidate /*/*/*/');
            }else{
                console.log('/*/*/*/ DValidate /*/*/*/');
            }

            if (typeof options === "string" && $.isFunction(data[options])) {
                result = data[options](settings);
            }
        });

        return (typeof result !== "undefined" ? result : this);
    };


    $.fn.dvalidate.Constructor = DValidate;
    $.fn.dvalidate.setDefaults = DValidate.setDefaults;

    $(function () {
        if($("form[dvalidate]").length) {
            $("form[dvalidate]").dvalidate();
        }

    });


});