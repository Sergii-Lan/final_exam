$(function () {
    function slider(idSlider) {
        var elWrap = idSlider,
            el = elWrap.find('.img'),
            indexImg = 1,
            indexMax = el.length,
            phase = 3000;

        function change() {
            el.fadeOut(500);
            el.filter(':nth-child(' + indexImg + ')').fadeIn(500);
        }

        function autoCange() {
            indexImg++;

            if (indexImg > indexMax) {
                indexImg = 1;
            }

            change();
        }

        var interval = setInterval(autoCange, phase);

        elWrap.mouseover(function () {
            clearInterval(interval);
        });

        elWrap.mouseout(function () {
            interval = setInterval(autoCange, phase);
        });

        elWrap.append('<span class="next"></span><span class="prev"></span>');
        var btnNext = $('span.next'),
            btnPrev = $('span.prev');

        btnNext.click(function () {
            indexImg++;
            if (indexImg > indexMax) {
                indexImg = 1;
            }
            change();
        });

        btnPrev.click(function () {
            indexImg--;
            if (indexImg < 1) {
                indexImg = indexMax;
            }
            change();
        });
    }

    function provIE8() {
        return $('html.ie8').length > 0;
    }

    function provIE9() {
        return $('html.ie9').length > 0;
    }

    var $tile;

    function get_pixplorer(filter, count) {
        $.ajax({
            url: 'http://api.pixplorer.co.uk/image?word=' + filter + '&amount=' + count,
            dataType: 'json',
            method: 'GET',
            success: function (data) {
                if (data.count==0) {
                    alert('Error pictures');
                    return;
                }
                $tile.masonry('remove', $('.ideas__picture'));

                var items = tmpl('ideas__template', data);
                var re = /(<div class([\s\S]*?)\/div>)/gim;
                var found = items.match(re);
                var $items = $(found.join(''));

                if (window.innerWidth >= 768  || provIE8() ) {
                    if (data.count > 4) {
                        $('img', $items).eq(4).addClass('ideas__foto--width2');
                        $items.eq(4).addClass('ideas__foto--width2');
                    }
                    if (data.count > 5) {
                        $('img', $items).eq(5).addClass('ideas__foto--width2');
                    }
                }

                if (!provIE8() && !provIE9()) {
                    $tile.append($items).masonry('appended', $items);
                    $tile.masonry('layout', $items);
                } else {
                    $tile.masonry('destroy');
                    $('.ideas__picture').html('');
                    var optionsMasonry = {
                        itemSelector: '.ideas__picture',
                        initLayout: true,
                        gutter: 20,
                        columnWidth: 300
                    };

                    $tile = $('.ideas__pictures').masonry(optionsMasonry);
                    $tile.append($items).masonry('appended', $items);
                    $tile.masonry('layout', $items);

                    if(provIE8()) {
                        var x = $(optionsMasonry.itemSelector);
                        var el = x.eq(x.length - 1);
                        el.css('left',parseInt(el.css('left'))*2);
                    }
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('Error bugs');
            }
        });
    }

    function pictures() {
        $.support.cors = true;
        $('.searcher__search').on('click', function (e) {
            e.preventDefault();
            var searchText = $('input[name="search-picture"]').val();
            if (searchText.length == 0) {
                alert('Enter something in search');
                return this;
            }
            get_pixplorer(searchText, 7);
            $('input[name="search-picture"]').focus().select();
        });

        $('input[name="search-picture"]').on('keyup', function (e) {
            if (e.which == 13)
                $('.searcher__search').trigger('click');
        });

        $.fn.scrollView = function () {
            return this.each(function () {
                $('html, body').animate({
                    scrollTop: $(this).offset().top
                }, 1000);
            });
        };

        var optionsMasonry = {
            itemSelector: '.ideas__picture',
            initLayout: true,
            gutter: 10,
            columnWidth: 300
        };

        if (768 <= window.innerWidth) {
            optionsMasonry.gutter = 20;
            if (window.innerWidth < 940)
                optionsMasonry.columnWidth = 236;
        }

        $tile = $('.ideas__pictures').masonry(optionsMasonry);
        get_pixplorer('', 7);
    }

    function templates(){
        var cache = {};

        this.tmpl = function tmpl(str, data){
            var fn = !/\W/.test(str) ?
                cache[str] = cache[str] ||
                    tmpl(document.getElementById(str).innerHTML) :

                new Function("obj",
                    "var p=[],print=function(){p.push.apply(p,arguments);};" +
                    "with(obj){p.push('" +
                    str
                        .replace(/[\r\t\n]/g, " ")
                        .split("<%").join("\t") .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                        .replace(/\t=(.*?)%>/g, "',$1,'")
                        .split("\t").join("');")
                        .split("%>").join("p.push('")
                        .split("\r").join("\\'")
                    + "');}return p.join('');");
            return data ? fn( data ) : fn;
        };
    }

    slider($('#slider1'));
    slider($('#slider2'));
    slider($('#slider3'));

    templates();
    pictures();
});