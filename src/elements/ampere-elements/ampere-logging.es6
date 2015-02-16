(function() {
	let log = function(priority,logger,args) {
		if((WebComponents.flags.log || {})[logger.type] && console) {
			console.group(logger.prefix());
			console[priority].apply(console,args);
			console.groupEnd();
		}
	};

	class Logger {
		constructor(type,namespace) {
			this.namespace = namespace||'';
			this.type = type;
		}

		log() {
			log('log',this,arguments);
			return this;
		}

		warn(...args) {
			log('warn',this,arguments);
			return this;
		}

		error(...args) {
			log('error',this,arguments);
			return this;
		}

		assert(condition, msg) {
			typeof(condition)==='function' && (condition=condition());
			if(!condition) {
				typeof(msg)==='function' && (msg=msg());
				throw new Error(this.prefix(msg));
			}
			return this;
		}

		prefix(msg) {
			return `[${this.type}${this.namespace ? ':' + this.namespace : ''}${msg ? ' : ' + msg : ''}`;
		}
	}

	const LOGGERS = new Map();

	let init = function() {
		Ampere.default.UI.logger = (type,namespace)=>{
			const KEY = `${type}:${namespace||''}`;

			LOGGERS.has(KEY) || LOGGERS.set(KEY, new Logger(type, namespace));

			return LOGGERS.get(KEY);
		}
	};

	((document.readyState=="complete" || document.readyState==="loaded") && init()) || document.addEventListener("DOMContentLoaded", init);
})();
