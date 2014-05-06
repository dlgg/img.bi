module.exports = function(grunt) {
grunt.initConfig({
  jekyll: {
    web: {
      options: {
        src: 'jekyll',
        dest: 'build',
        config: 'jekyll/_config.yml',
        raw: 'buildfor: web\nurl: https://img.bi'
      }
    },
    tor: {
      options: {
        src: 'jekyll',
        dest: 'build',
        config: 'jekyll/_config.yml',
        raw: 'buildfor: tor\nurl: http://imgbifwwqoixh7te.onion'
      }
    },
    i2p: {
      options: {
        src: 'jekyll',
        dest: 'build',
        config: 'jekyll/_config.yml',
        raw: 'buildfor: i2p\nurl: http://imgbi.i2p'
      }
    },
    local: {
      options: {
        src: 'jekyll',
        dest: 'build',
        config: 'jekyll/_config.yml',
        raw: 'buildfor: web\nurl: http://127.0.0.1:9000'
      }
    },
  },
  clean: ['tmp'],
  less: {
    production: {
      options: {
        paths: ['bower_components/bootstrap/less']
      },
      files: {
        'tmp/main.css': 'less/main.less'
      }
    }
  },
  fontello: {
    dist: {
      options: {
        config  : 'config-fontello.json',
        fonts   : 'build/font',
        styles  : 'tmp',
        scss    : true,
        force   : true
      }
    }
  },
  cssmin: {
    dist: {
      src: ['tmp/main.css', 'tmp/fontello.css', 'tmp/animation.css'],
      dest: 'build/css/main.css'
    }
  },
  min: {
    dist: {
      src: [
        'bower_components/minified/dist/minified.js',
        'bower_components/indiesocial/indiesocial.min.js',
        'bower_components/img.bi.js/img.bi.min.js',
        'bower_components/l10n.js/l10n.min.js',
        'bower_components/sjcl/sjcl.js',
        //'bower_components/kokoku/kokoku.min.js',
        'bower_components/zeroclipboard/ZeroClipboard.min.js',
        'build/scripts/main.js'
      ],
      dest: 'tmp/main.js'
    }
  },
  htmlmin: {
    dist: {
      options: {
        collapseWhitespace: true
      },
      files: {
        'build/index.html': 'build/index.html',
        'build/ads/index.html': 'build/ads/index.html',
        'build/apps/index.html': 'build/apps/index.html',
        'build/autorm/index.html': 'build/autorm/index.html',
        'build/contacts/index.html': 'build/contacts/index.html',
        'build/donate/index.html': 'build/donate/index.html',
        'build/js/index.html': 'build/js/index.html',
        'build/rm/index.html': 'build/rm/index.html',
        'build/my/index.html': 'build/my/index.html'
      }
    }
  },
  rename: {
    moveThis: {
      src: 'tmp/main.js',
      dest: 'build/scripts/main.js'
    }
  },
  exec: {
    deploy: {
      cmd: function(addr,dest) {
             return 'rsync --progress -a --delete -e "ssh -q" build/ ' + addr + ':' + dest;
           }
    }
  },
  minjson: {
    compile: {
      files: {
        'build/locales/en.json': 'jekyll/locales/en.json',
        'build/locales/ru.json': 'jekyll/locales/ru.json',
        'build/locales/it.json': 'jekyll/locales/it.json',
        'build/locales/fr.json': 'jekyll/locales/fr.json'
      }
    }
  },
  connect: {
    server: {
      options: {
        hostname: '127.0.0.1',
        port: 9000,
        base: 'build',
        middleware: function (connect, options) {
          var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
          return [proxy,connect.static(options.base),connect.directory(options.base)];
        }
      },
      proxies: [{
        context: '/api',
        host: '127.0.0.1',
        port: 8080
      }]
    }    
  },
  watch: {
    scripts: {
      files: ['jekyll/*', 'less/*', 'bower_components/*', 'config-fontello.json'],
      tasks: ['serve'],
      options: {
        spawn: false,
      }
    },
  },
  mkdir: {
    all: {
      options: {
        mode: 0700,
        create: ['build/download', 'build/download/thumb']
      }
    }
  },
  copy: {
    main: {
      src: 'bower_components/zeroclipboard/ZeroClipboard.swf',
      dest: 'build/ZeroClipboard.swf',
    },
  },
  concat: {
    js: {
      src: [
        'bower_components/minified/dist/minified.js',
        'bower_components/indiesocial/indiesocial.min.js',
        'bower_components/img.bi.js/img.bi.min.js',
        'bower_components/l10n.js/l10n.min.js',
        'bower_components/sjcl/sjcl.js',
//        'bower_components/kokoku/kokoku.min.js',
        'bower_components/zeroclipboard/ZeroClipboard.min.js',
        'build/scripts/main.js'
      ],
      dest: 'build/scripts/main.js'
    },
    css: {
      src: ['tmp/main.css', 'tmp/fontello.css', 'tmp/animation.css'],
      dest: 'build/css/main.css'
    }
  },
  compress: {
    main: {
      options: {
        mode: 'gzip',
        level: 9
      },
      expand: true,
      cwd: 'build/',
      dest: 'build/',
      src: ['**/*']
    }
  },
  hashres: {
    options: {
      fileNameFormat: '${hash}-${name}.${ext}',
    },
    fontello: {
      src: [
        'build/font/*'
      ],
      dest: [
        'build/css/main.css'
      ]
    },
    prod: {
      src: [
        'build/css/main.css',
        'build/scripts/main.js',
        'build/locales/*',
        'build/favicon.png',
        'build/favicon152.png'
      ],
      dest: [
        'build/index.html',
        'build/ads/index.html',
        'build/apps/index.html',
        'build/autorm/index.html',
        'build/contacts/index.html',
        'build/donate/index.html',
        'build/js/index.html',
        'build/rm/index.html',
        'build/my/index.html'
      ]
    }
  },
  jshint: {
    all: ['Gruntfile.js', 'build/scripts/main.js']
  },
  jsonlint: {
    all: {
      src: [ 'build/locales/**.json' ]
    }
  },
  htmllint: {
    all: {
      src: ['build/**/*.html'],
      options: {
        ignore: ['An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.']
      },
    }
  }
});

grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-less');
grunt.loadNpmTasks('grunt-exec');
grunt.loadNpmTasks('grunt-fontello');
grunt.loadNpmTasks('grunt-yui-compressor');
grunt.loadNpmTasks('grunt-jekyll');
grunt.loadNpmTasks('grunt-rename');
grunt.loadNpmTasks('grunt-minjson');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-connect-proxy');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-htmlmin');
grunt.loadNpmTasks('grunt-mkdir');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-compress');
grunt.loadNpmTasks('grunt-hashres');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-jsonlint');
grunt.loadNpmTasks('grunt-html');
grunt.loadNpmTasks('grunt-contrib-qunit');

grunt.registerTask('afterjekyll', [ 'less', 'fontello', 'min', 'rename', 'cssmin', 'minjson', 'htmlmin', 'copy', 'clean' ]);
grunt.registerTask('default', [ 'jekyll:web', 'afterjekyll' ]);
grunt.registerTask('tor', [ 'jekyll:tor', 'afterjekyll' ]);
grunt.registerTask('i2p', [ 'jekyll:i2p', 'afterjekyll' ]);
grunt.registerTask('serve', [ 'jekyll:local', 'less', 'fontello', 'concat', 'mkdir', 'copy', 'configureProxies:server', 'connect:server', 'watch' ]);
grunt.registerTask('test', [ 'jekyll:web', 'jshint', 'jsonlint', 'htmllint']);
grunt.registerTask('deploy', 'Deploy', function(n) {
  if (grunt.option('web')) {
    grunt.task.run(['default', 'hashres', 'compress', 'exec:deploy:' + grunt.option('web')]);
  }
  if (grunt.option('tor')) {
    grunt.task.run(['tor', 'hashres', 'compress', 'exec:deploy:' + grunt.option('tor')]);
  }
  if (grunt.option('i2p')) {
    grunt.task.run(['i2p', 'hashres', 'compress', 'exec:deploy:' + grunt.option('i2p')]);
  }
});
};
