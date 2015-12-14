module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    watch: {
      engine: {
        files: ['src/**/*.coffee'],
        tasks: ['coffee:engine']
      }
    },

    coffee: {
      options: {
        bare: true,
        join: true
      },
      engine: {
        files: {
          'dist/engine.js': [
            'src/**/*.coffee'
          ]
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['coffee']);

};
