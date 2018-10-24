
const path = require('path');
const gulp = require('gulp');
const webpack = require('webpack-stream');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');


const icons = {
  src: 'src/img/rating.png',
  dest: 'assets/img/icons',
  sizes: [192, 512],
  tag(size = 192) {
    if(!this.sizes.includes(size)) throw new Error('Icon is not generated for this size');

    const sizeString = `${size}x${size}`;
    return `<link rel="icon"
      sizes="${sizeString}"
      href="${path.join(this.dest, `icon_${sizeString}.png`)}">`
  },
  toCache() {
    return this.sizes
      .map(size => path.join(this.dest, `icon_${size}x${size}.png`));
  }
}

const manifestConfig = {
  filename: '/assets/manifest.json',
  fingerprints: false,
  name: 'Restaurant Reviews',
  short_name: 'RR',
  description: 'Restaurant Reviews Progressive Web App',
  background_color: '#252831',
  theme_color: '#252831',
  publicPath: 'assets',
  includeDirectory: true,
  icons: [
    {
      src: path.resolve(icons.src),
      sizes: icons.sizes, // multiple sizes
      destination: path.join(icons.dest),
    }
  ],
  includeDirectory: false,
  inject: true
};

// configration for the HtmlWebpackPlugin
const htmlPluginConfig = {
  // excluding this chunck so that the plugin
  // doesn't inject a script tag for it
  // excludeChunks: ['blank'],
  meta: {
    description: manifestConfig.description
  },
  // a custome template parameter to inject
  // the <link> tag for the icon
  relIcon: icons.tag()
};


const config = {
  destBase: './app',
  depth: 2,
  webpack: {
		plugins: [
      new HtmlWebpackPlugin(Object.assign(htmlPluginConfig, {
        template: 'src/templates/index.html',
        filename: 'index.html',
      })),
      new HtmlWebpackPlugin(Object.assign(htmlPluginConfig, {
        template: 'src/templates/restaurant.html',
        filename: 'restaurant.html',
      })),
      new WebpackPwaManifest(manifestConfig)
    ],
    mode: 'production'
  }
}


process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error.message);
});


gulp.task('scripts', () => {
  return gulp.src('./src/js/_blank.js', { allowEmpty: true})
    .pipe(webpack(config.webpack))
    .pipe(gulp.dest(config.destBase));
});