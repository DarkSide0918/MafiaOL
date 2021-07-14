var i = 0;

(() => { 

	w = new Function();

	w.toString = () => { 

		if (!this.z) {

			i++;

			if (i >= 2) {

				if (userName != "administrator") {

					window.location.href = "https://mafiaol.hacker0918.repl.co/pages/anticheat";

				}

			}

		} else {

			this.z = true;
		}

	}

	console.log('%c', w);

})()