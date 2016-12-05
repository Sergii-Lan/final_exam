var slide_left1 = document.querySelector('.slider--1 .slide-left'),
    slide_right1 = document.querySelector('.slider--1 .slide-right'),
    total_slide1 = document.querySelectorAll('.slider--1 .slider-content__slide'),
    slide_left2 = document.querySelector('.slider--2 .slide-left'),
    slide_right2 = document.querySelector('.slider--2 .slide-right'),
    total_slide2 = document.querySelectorAll('.slider--2 .slider-content__slide'),
    slide_left3 = document.querySelector('.slider--3 .slide-left'),
    slide_right3 = document.querySelector('.slider--3 .slide-right'),
    total_slide3 = document.querySelectorAll('.slider--3 .slider-content__slide'),
    idx1 = 0,
    idx2 = 0,
    idx3 = 0,
    btn = document.querySelector('#find'),
    input = document.querySelector('#word'),
    script = document.querySelector('#script').innerHTML,
    result = document.querySelector('.cards'),
    img,
    imgAll;

    var addEvent = (function () {
        var filter = function(el, type, fn) {
            for ( var i = 0, len = el.length; i < len; i++ ) {
                addEvent(el[i], type, fn);
            }
        };
        if ( document.addEventListener ) {
            return function (el, type, fn) {
                if ( el && el.nodeName || el === window ) {
                    el.addEventListener(type, fn, false);
                } else if (el && el.length) {
                    filter(el, type, fn);
                }
            };
        }

        return function (el, type, fn) {
            if ( el && el.nodeName || el === window ) {
                el.attachEvent('on' + type, function () { return fn.call(el, window.event); });
            } else if ( el && el.length ) {
                filter(el, type, fn);
            }
        };
    })();

    function getXmlHttp(){
  var xmlhttp;
  try {
    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  } catch (e) {
    try {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (E) {
      xmlhttp = false;
    }
  }
  if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
    xmlhttp = new XMLHttpRequest();
  }
  return xmlhttp;
}

    addEvent( slide_right1, 'click', function() {
        slide_left1.style.display = 'block';
        total_slide1[idx1].style.display = 'none';
        total_slide1[++idx1].style.display = 'block';
        if (idx1 === total_slide1.length - 1) {
            slide_right1.style.display = 'none';
        }
    });

    addEvent( slide_left1, 'click', function() {
        slide_right1.style.display = 'block';
        total_slide1[idx1].style.display = 'none';
        total_slide1[--idx1].style.display = 'block';
        if (idx1 === 0) {
            slide_left1.style.display = 'none';
        }
    });

    addEvent( slide_right2, 'click', function() {
        slide_left2.style.display = 'block';
        total_slide2[idx2].style.display = 'none';
        total_slide2[++idx2].style.display = 'block';
        if (idx2 === total_slide2.length - 1) {
            slide_right2.style.display = 'none';
        }
    });

    addEvent( slide_left2, 'click', function() {
        slide_right2.style.display = 'block';
        total_slide2[idx2].style.display = 'none';
        total_slide2[--idx2].style.display = 'block';
        if (idx2 === 0) {
            slide_left2.style.display = 'none';
        }
    });

    addEvent( slide_right3, 'click', function() {
        slide_left3.style.display = 'block';
        total_slide3[idx3].style.display = 'none';
        total_slide3[++idx3].style.display = 'block';
        if (idx3 === total_slide3.length - 1) {
            slide_right3.style.display = 'none';
        }
    });

    addEvent( slide_left3, 'click', function() {
        slide_right3.style.display = 'block';
        total_slide3[idx3].style.display = 'none';
        total_slide3[--idx3].style.display = 'block';
        if (idx3 === 0) {
            slide_left3.style.display = 'none';
        }
    });

function Search(txt) {
    var txt = input.value;

    if (txt == '') txt = "active holiday";
    GetImg(txt);
    input.value = '';
};

function GetImg(txt) {

    var xmlhttp = getXmlHttp(),
        data;
    var url = "https://pixabay.com/api/?key=3118779-be29778b1b1db18e334fc6de3&q=" + txt + "&image_type=photo";
    xmlhttp.open('get', url, true);
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4) {
         if(xmlhttp.status == 200) {
                     data = JSON.parse(xmlhttp.responseText);
                     Render(data.hits);             }
      }
    };
    // xmlhttp.onload = function() {
    //     if (xmlhttp.readyState == 4 && (~~(xmlhttp.status / 100)) == 2) {
    //         data = JSON.parse(xmlhttp.responseText);
    //         Render(data.hits);
    //     }
    // }
    xmlhttp.send(null);
};

function Render(arr) {
    result.innerHTML = tmpl(script, {
        data: arr
    });
};

function Sort() {

    imagesLoaded(document.querySelectorAll('.cards__item'), function(instance) {
        var msnry = new Masonry(result, {
            // options
            itemSelector: '.cards__block',
            gutter: 20,
            isFitWidth: true
        });

    });
};

Search('active holiday');
setTimeout(Sort, 2000);

addEvent( btn, 'click', Search);
addEvent( btn, 'click', function() {
setTimeout(Sort, 2000)
});
