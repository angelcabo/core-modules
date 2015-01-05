'use strict';

var fs = require('fs'), util = require('util');

module.exports = function (grunt) {
  var config = grunt.file.readJSON('config.json');

  function preprocessChromeExtensionConfig(environment) {
    return {
      options: {
        context: {
          APPROOTURL: config.appRootUrl[environment],
          WEBSOCKETURI: config.webSocketUri[environment]
        }
      },
      src: '<%= config.dist %>/chrome/scripts/modules/config.js',
      dest: '<%= config.dist %>/chrome/scripts/modules/config.js'
    };
  }

  //TODO: lock version of meteor to use with --release [VERSION] while starting meteor?
  grunt.initConfig({
    config: config,
    copy: {
      dist: {
        expand: true,
        cwd: 'extensions/chrome',
        src: [
          '_locales/**',
          'bower_components/jquery/dist/jquery.min.js',
          'bower_components/gsap/src/minified/TweenMax.min.js',
          'bower_components/ddp.js/src/ddp.js',
          'bower_components/q/q.js',
          'bower_components/asteroid/dist/asteroid.chrome.js',
          'bower_components/requirejs/require.js',
          'html/*',
          'images/*',
          'scripts/**',
          'styles/compiled/*',
          'styles/vendor/*',
          'typefaces/*',
          'manifest.json'
        ],
        dest: '<%= config.dist %>/chrome/'
      }
    },
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '<%= config.dist %>/*',
              '!<%= config.dist %>/.git*'
            ]
          }
        ]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= config.chrome_ext %>/scripts/{,*/}*.js',
        '!<%= config.chrome_ext %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },
    preprocess: {
      dist: preprocessChromeExtensionConfig('dist'),
      qa: preprocessChromeExtensionConfig('qa'),
      local: preprocessChromeExtensionConfig('local')
    },
    crx: {
      dist: {
        src: '<%= config.dist %>/chrome/',
        dest: '<%= config.dist %>/parallels.crx',
        exclude: ['.git', '*.pem'],
        privateKey: 'extensions/chrome.pem'
      }
    },
    encode: {
      client: {
        src: ['<%= config.dist %>/parallels.crx'],
        dest: '<%= config.dist %>'
      }
    },
    bgShell: {
      meteor: {
        cmd: [
          'cd meteor-app',
          'meteor run --settings settings.json'
        ].join('&&'),
        bg: false,
        stdout: true,
        stderr: true
      },
      resetdb: {
        cmd: [
          'cd meteor-app',
          'meteor reset'
        ].join('&&'),
        bg: false,
        stdout: true,
        stderr: true
      },
      meteordebug: {
        cmd: [
          'cd meteor-app',
          'NODE_OPTIONS=\'--debug-brk\' meteor run --settings settings.json'
        ].join('&&'),
        bg: false,
        stdout: true,
        stderr: true
      },
      bowerChromeExt: {
        cmd: [
          'cd <%= config.chrome_ext %>',
          'bower install'
        ].join('&&'),
        bg: false,
        stdout: true,
        stderr: true
      },
      tests: {
        cmd: 'node node_modules/cucumber/bin/cucumber.js tests/features',
        bg: false,
        stdout: true,
        stderr: true
      }
    },
    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      chrome: {
        options: {
          sassDir: '<%= config.chrome_ext %>/styles',
          cssDir: '<%= config.chrome_ext %>/styles/compiled'
        }
      }
    },
    jade: {
      compile: {
        options: {
          data: {
            debug: false
          }
        },
        files: {
          '<%= config.chrome_ext %>/html/web_clipper.html': ['<%= config.chrome_ext %>/templates/web_clipper.jade']
        }
      }
    },
    concurrent: {
      serverdebug: [
        'bgShell:meteordebug',
        'watch'
      ],
      server: [
        'bgShell:meteor',
        'watch'
      ],
      options: {
        limit: 5,
        logConcurrentOutput: true
      }
    },
    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= config.chrome_ext %>/scripts/{,*/}*.js', '<%= config.chrome_ext %>/scripts/modules/{,*/}*.js'],
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      compass: {
        files: ['<%= config.chrome_ext %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:chrome']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      styles: {
        files: ['<%= config.chrome_ext %>/styles/compiled/{,*/}*.css', '<%= config.chrome_ext %>/styles/vendor/{,*/}*.css'],
        tasks: [],
        options: {
          livereload: true
        }
      },
      templates: {
        files: ['<%= config.chrome_ext %>/templates/{,*/}*.jade'],
        tasks: ['jade'],
        options: {
          livereload: true
        }
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.chrome_ext %>/html/*.html',
          '<%= config.chrome_ext %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= config.chrome_ext %>/manifest.json',
          '<%= config.chrome_ext %>/_locales/{,*/}*.json'
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      chrome: {
        options: {
          open: false,
          base: [
            '<%= config.chrome_ext %>'
          ]
        }
      }
    }
  });

  // Load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  //chromeOptions needs the extension to be a Base64 encoded string
  //so encode it, then build a requirejs module for it
  grunt.registerMultiTask('encode', 'Convert the .crx to a Base64 encoded string', function () {
    this.files.forEach(function (filePair) {
      var dest = filePair.dest;
      filePair.src.map(function (file) {
        var binaryData = fs.readFileSync(file);

        // convert binary data to base64 encoded string
        var encoded = new Buffer(binaryData).toString('base64');

        // setup as json
        var moduleTemplate = '{\n' +
          '   "base64":"%s"\n' +
          '}';

        var output = util.format(moduleTemplate, encoded);

        var fileName = file.substr(file.lastIndexOf('/'));
        file = dest + fileName + '.json';

        grunt.file.write(file, output);
      });
    });
  });

  // builds the chrome extension
  grunt.registerTask('build', 'Build chrome extension', function (target) {
    var tasks = [
      'clean:dist',
      'copy:dist'
    ];

    if (target === 'local')
      tasks.push('preprocess:local');
    else
      tasks.push('preprocess:dist');

    tasks = tasks.concat(['crx:dist', 'encode']);
    grunt.task.run(tasks);
  });

  grunt.registerTask('server', 'Run server', function (target) {
    if (target !== 'debug')
      target = '';

    var tasks = [
      'jshint',
      'bower',
      'compass:chrome',
      'jade',
      'connect:chrome',
      'concurrent:server' + target
    ];

    grunt.task.run(tasks);
  });

  grunt.registerTask('test', 'Run the testing tasks', function (target) {
    if (target !== 'debug')
      target = '';

    grunt.task.run('bgShell:tests' + target);
  });

  grunt.registerTask('bower', [
    'bgShell:bowerChromeExt'
  ]);

  grunt.registerTask('default', 'server');
};
