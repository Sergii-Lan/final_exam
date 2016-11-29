module.exports = function (grunt) {
    grunt.initConfig({
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['css/variables.scss',
                      'css/mixins.scss',
                      'css/reset.scss',
                      'css/style320.scss',
                      'css/style768.scss',
                      'css/style1440.scss',
                      'css/style.scss'],
                dest: 'css/main.scss'
            }
        },
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'css',
                    src: ['main.scss'],
                    dest: 'css-dist',
                    ext: '.css'
                }]
            }

        },
        watch: {
            sass: {
                files: ['css/*.scss'],
                tasks: ['concat', 'sass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat', 'sass']);
};