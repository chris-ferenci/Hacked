import define from "./observable-embeds/info-types-interactive-tree/index.js";
import {Runtime, Library, Inspector} from "./observable-embeds/info-types-interactive-tree/runtime.js";



var embedCells = new function() {


	const library = new Library();
	const runtime = new Runtime(library);

	const treeDiv = document.querySelector("#idb-observable-embed-info-types-interactive-tree")

	const main = runtime.module(define, (name => {
		if (name === "chart_ani") {
			return new Inspector(treeDiv)
		}
	}));

	function resizer(element, dimension) {
		return library.Generators.observe(notify => {
			let value = notify((element.getBoundingClientRect())[dimension]);
			const observer = new ResizeObserver(([entry]) => {
				const newValue = entry.contentRect[dimension];
				if (newValue !== value) {
					notify(value = newValue);
				}
			});
			observer.observe(element);
			return (() => observer.disconnect());
		});
	}

	main.redefine("width", resizer(treeDiv.parentNode, "width"));
	main.redefine("height", resizer(treeDiv.parentNode, "height"));

};

embedCells();