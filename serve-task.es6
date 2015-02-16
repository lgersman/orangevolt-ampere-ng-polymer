const fs    		 = require('fs'),
			express    = require('express'),
			gzipStatic = require('connect-gzip-static'),
			path       = require('path'),
			gulp       = require('gulp'),
			tu    		 = require('./task-util.es6'),
			globby 		 = require('globby'),
			to5			 	 = require("6to5"),
			browserSync= require('browser-sync'),
			less 			 = require('less')
;

less.logger.addListener(console);

const BROWSER_PORT = 4000,
			BROWSERSYNC_PORT = 4002
;

function loadExample(file) {
	let ex = {
		path        : path.relative(__dirname, file),
		caption     : path.basename(path.dirname(file)),
		description : "",
		scripts			: [],
		links 			: [],
		imports			: [],
		templates   : [],
		bootstrap		: '',
		element     : ''
	};

	Object.assign(ex, require(file));

	if(!ex.scripts.length) {
		ex.scripts = globby.sync(
			['*.js', '*.es6', '!meta.es6'],
			{cwd : path.dirname(file)}
		).map(file=>`<script src="/${path.dirname(ex.path)}/${file}"></script>`);
	}

	if(!ex.imports.length) {
		ex.imports = globby.sync(
			['*.html'],
			{cwd : path.dirname(file)}
		).map(file=>`<link rel="import" href="/${path.dirname(ex.path)}/${file}">`);
	}

	if(!ex.links.length) {
		ex.links = globby.sync(
			['*.css', '*.less'],
			{cwd : path.dirname(file)}
		).map(file=>`<link rel="stylesheet" href="/${path.dirname(ex.path)}/${file}" shim-shadowdom>`);
	}

	if(!ex.bootstrap) {
		ex.bootstrap = `<script>
			var app = window.Ampere.default.app(bootstrap());
			document.addEventListener('polymer-ready',function() {
				app.promise.then(function() {
					console.log("${ex.caption} ready : ", app);
				});

				document.querySelector('ampere-splash').app = app;
			});
		</script>
		`;
	}

	if(!ex.element) {
		ex.element = `<ampere-splash fit></ampere-splash>`;
	}

	//console.log(JSON.stringify(ex, null, '  '));

	return ex;
}

function exampleListMiddleware() {
	return (req,res,next)=>{
		if(req.path==='/') {
			let examples = [];

			gulp.src('examples/**/meta.es6')
			.on("data", (file, enc, cb)=>{
				examples.push(loadExample(file.path));
			})
			.on("end", ()=>{
				let lis = examples.map(ex=>`
						<li>
							<a href="${ex.path}">${ex.caption}</a>
							<p>
								${ex.description}
							</p>
						</li>
				`).join('');

				res.end(`
						<!doctype html>
						<html>
							<head>
								<title>Ampere examples</title>
							</head>
							<body>
								<h2>Ampere NG/Polymer examples</h2>
								<ul>
									${lis}
								</ul>
							</body>
						</html>
				`);
			});
		} else {
			next();
		}
	};
};

function exampleMiddleware() {
	return (req,res,next)=>{
		if(req.path.endsWith('/meta.es6')) {
			let ex = loadExample( '.' + req.path);

			res.end(`
					<!doctype html>
					<html lang="en">
						<head>
							<title>${ex.caption}</title>

							<meta charset="utf-8">
							<meta http-equiv="X-UA-Compatible" content="IE=edge">
							<meta name="description" content="">
							<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
						  <meta name="mobile-web-app-capable" content="yes">
						  <meta name="apple-mobile-web-app-capable" content="yes">

							<!-- Place favicon.ico and apple-touch-icon(s) in the root directory -->

							<script src="/bower_components/webcomponentsjs/webcomponents.js"></script>
							<link rel="import" href="/bower_components/font-roboto/roboto.html">
							<link rel="import" href="/bower_components/core-elements/core-elements.html">
							<link rel="import" href="/bower_components/paper-elements/paper-elements.html">
							<link rel="import" href="/bower_components/marked-element/marked-element.html">

								<!-- Load the ampere ui component using an HTML Import -->
							<link rel="import" href="/src/elements/ampere-elements/ampere-elements.html">

							<!-- Load ampere runtime -->
							<script>
								window.Ampere = {
									VERBOSE : true
								};

								if(window.Ampere.VERBOSE) {
									WebComponents.flags.log['<ampere-splash>']=true;
									WebComponents.flags.log['<ampere-app>']=true;
									WebComponents.flags.log['<ampere-overlay>']=true;
									WebComponents.flags.log['<ampere-status>']=true;
									WebComponents.flags.log['<ampere-transition>']=true;
									WebComponents.flags.log['<ampere-view>']=true;
								}
							</script>
							<script src="/orangevolt-ampere-ng/node_modules/traceur/bin/traceur-runtime.js"></script>
							<script type="not/inuse" src="/orangevolt-ampere-ng/build/browserify/ampere-production-uglifyjs-min.js"></script>
							<script src="/orangevolt-ampere-ng/build/browserify/ampere.js"></script>

							<link rel="stylesheet" href="/examples/index.css" shim-shadowdom>

							${ex.imports.join('\n')}

							${ex.links.join('\n')}

							${ex.scripts.join('\n')}

							${ex.templates.join('\n')}
						</head>
						<!--
								use fullbleed attribute to specify the body should fill the viewport
							-->
						<body unresolved touch-action="auto" fullbleed>
							<!--[if lt IE 11]>
							<p>
								You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.
							</p>
							<![endif]-->

							${ex.element}

							${ex.bootstrap}

							<script async src='//localhost:${BROWSERSYNC_PORT}/browser-sync/browser-sync-client.1.9.1.js'></script>
						</body>
					</html>
			`);
		} else if(req.path.endsWith('.es6')) {
			res.setHeader('content-type', 'text/javascript');
			res.end(to5.transformFileSync(
				'.' + req.path,
				{
					ssourceMap : 'inline'
				}
			).code);
		} else if(req.path.endsWith('.less')) {
			let lessContents = fs.readFileSync('.' + req.path).toString();
			less.render(
				lessContents,
				{
					filename : '.' + req.path,
					sourceMap : {
						sourceMapFileInline : true
					}
				},
				(error,output)=>{
					if(error) {
						console.log(error);
					} else {
						res.setHeader('content-type', 'text/css');
						res.end(output.css);
					}
				}
			)
		} else {
			next();
		}
	};
}

module.exports = ()=>{
	let app        = express();

	app
		.use(exampleListMiddleware(gulp))
		.use(exampleMiddleware(gulp))
		.use(require('serve-index')(path.join(__dirname,'examples')))
		.use(gzipStatic(__dirname))
		.listen(BROWSER_PORT)
	;

	browserSync.init(null, {
		port : BROWSERSYNC_PORT,
		proxy: {
			host: "http://localhost",
			port: BROWSER_PORT
		}
	});

	gulp.watch( ['./src/**/*.js', './examples/**/*.*'], [ 'build', 'test']);
	gulp.watch( ['./src/**/*.js', './examples/**/*.*'], /*notifyLiveReload*/ browserSync.reload);
};
