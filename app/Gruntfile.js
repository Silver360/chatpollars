

module.exports = function(grunt){

    grunt.initConfig({
        concat: {
            options: {
                separator: ';'
            },
            js: {
                src: ['public/js/**/*.js', '!public/js/lib/*.js'],
                dest: 'public/build/main.js'
            },
            css: {
                src: ['public/css/**/*.scss'],
                dest: 'public/build/style.scss'
            }
        },
        sass: {
            dist: {
                files: {
                    'public/build/style.css': 'public/scss/all.scss'
                }
            }
        },
        uglify: {
            js: {
                files: {
                    'public/build/main.min.js': ['public/build/main.js'],
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'public/build/style.min.css': ['public/build/style.css']
                }
            }
        },
        watch: {
            js: {
                files: ['public/js/**/*.js'],
                tasks: ['concat:js', 'uglify']
            },
            sass: {
                files: ['public/css/**/*.css'],
                tasks: ['sass', 'cssmin']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['concat:js', 'sass', 'uglify', 'cssmin', 'watch']);

};