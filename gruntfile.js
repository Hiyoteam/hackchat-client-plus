module.exports = function (grunt) {
    grunt.initConfig({
        clean: [
            'dist/'
        ],
        copy: {
            main: {
                files: [
                    { expand: true, cwd: 'src', src: ['**'], dest: 'dist' },
                ],
            },
        },
        concat: {
            dist: {
                src: ["src/utils.js",
                    "src/notification.js",
                    "src/misc.js",
                    "src/i18n.js",
                    "src/sidebar.js",
                    "src/client.js",
                    "src/fancy.js",],
                dest: 'dist/index.js',
            },
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['@babel/preset-env']
            },
            dist: {
                files: {
                    'dist/index.js': 'dist/index.js'
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/index.js': ['dist/index.js'],
                },
            },
        },
        processhtml: {
            dist: {
                files: {
                    'dist/index.html': ['src/index.html'],
                },
            },
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'dist/index.html',
                }
            },
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: ['*.css', 'schemes/*.css'],
                    dest: 'dist',
                    ext: '.css'
                },]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['clean', 'copy', 'concat', 'uglify', 'babel', 'processhtml', 'htmlmin', 'cssmin']);
};