const gulp = require('gulp'),
    sass = require('gulp-sass'), //Подключаем Sass пакет
    browserSync = require('browser-sync'), // Подключаем Browser Sync
    concat = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    del = require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    cache = require('gulp-cache'), // Подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer'), // Подключаем библиотеку для автоматического добавления префиксов
    spritesmith = require('gulp.spritesmith'); // Подключаем библиотеку для cоздания спрайтов

// Удаление старых cпрайтов
gulp.task('sprite-clean', function() {
    return del.sync('app/img/sprite*.png'); // Удаляем спрайт
});

// Создание спрайтов
gulp.task('sprite', ['sprite-clean'], function() {
    var spriteData = gulp.src('app/img/icons/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: '_sprite.scss',
            cssFormat: 'scss',
            padding: 2,
            cssVarMap: function (sprite) {
                sprite.name = 'icon-' + sprite.name
            },
            imgPath: '../img/sprite.png'
        }));

    spriteData.img
        .pipe(gulp.dest('app/img/'));

    spriteData.css
        .pipe(gulp.dest('app/sass/'));

    return spriteData;
});

gulp.task('sass', function() { // Создаем таск Sass
    return gulp.src('app/sass/**/*.scss') // Берем источник
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
            cascade: true
        })) // Создаем префиксы
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({
            stream: true
        })) // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});

gulp.task('scripts', function() {
    return gulp.src([ // Берем все необходимые библиотеки
            'app/libs/tmpl/tmpl.js', // Берем tmpl
            'app/libs/masonry/masonry.pkgd.js', // Берем Masonry
            'app/libs/masonry/imagesloaded.pkgd.js' // Берем imagesloaded
        ])
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('ie-libs', function() {
    return gulp.src([ // Берем все необходимые библиотеки
            'app/libs/html5shiv/html5shiv.js'
        ])
        .pipe(concat('ie.libs.min.js')) // Собираем их в кучу в новом файле ie.libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('watch', ['browser-sync', 'scripts', 'ie-libs'], function() {
    gulp.watch('app/sass/**/*.scss', ['sass']); // Наблюдение за sass файлами в папке sass
    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/js/**/*.js', browserSync.reload); // Наблюдение за JS файлами в папке js
});

gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({ // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {

    var buildCss = gulp.src([ // Переносим библиотеки в продакшен
            'app/css/reset.css',
            'app/css/main.css',
            'app/css/ie.css'
        ])
        .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
        .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
        .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
        .pipe(gulp.dest('dist'));

});

gulp.task('default', ['watch']);

gulp.task('clear', function() {
    return cache.clearAll();
})
