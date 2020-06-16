const IPSUM_LOREM = `<div class="mw-parser-output">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed diam mauris, congue sed mauris non, auctor ornare quam. In sit amet ligula ut turpis auctor mollis. Nam malesuada erat sollicitudin nisl faucibus tristique. Cras mattis feugiat posuere. Pellentesque laoreet erat tortor, id pellentesque ante dapibus vitae. Praesent sodales erat quis pellentesque pretium. Quisque tincidunt non dolor et blandit. Donec a molestie magna, sed auctor felis. Etiam finibus urna facilisis mauris maximus rhoncus. Integer feugiat accumsan mattis. Sed et sem sit amet ligula vestibulum efficitur. Vivamus eu neque eleifend, dignissim lectus vitae, eleifend sem.

<h2>Ipsum norum</h2>
Morbi ut tempor tellus. Suspendisse potenti. Donec ut suscipit nisi. Ut sodales dolor justo, sed viverra nulla iaculis sit amet. Nulla vel lectus mollis, mollis purus at, iaculis metus. Ut finibus elementum augue eleifend malesuada. Donec lobortis, enim eget dictum luctus, erat lectus lobortis enim, non fringilla diam nunc eget arcu. In neque tellus, bibendum rhoncus est eget, suscipit pretium libero. Duis quis ipsum augue. Nunc ac libero et turpis rhoncus viverra. Ut ultrices, justo vitae accumsan varius, nisl ligula bibendum mauris, rutrum scelerisque lectus mi id magna. In hac habitasse platea dictumst.

<h2>Donec laoreet</h2>
Donec nec metus ut lacus mattis consequat laoreet vitae mi. Praesent urna nulla, facilisis eget ultrices vitae, luctus quis diam. Donec interdum tortor sit amet lobortis sagittis. Aliquam sed vehicula tellus. Quisque volutpat sem in metus feugiat venenatis. Aenean hendrerit condimentum dui, sed feugiat urna dapibus fringilla. Nam accumsan tellus nec enim laoreet, eget accumsan odio pretium. Praesent sem dui, volutpat ac orci eu, fringilla vulputate mauris. Fusce ut semper velit, sit amet tempus est. Integer luctus volutpat mollis. Aliquam ut elit et mauris consequat porttitor.

In vitae imperdiet turpis, eu sagittis justo. Fusce a bibendum massa. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed in nisl eu tellus tincidunt congue. Phasellus ornare est non ex suscipit, eget malesuada purus hendrerit. Nam ut accumsan felis. Suspendisse pulvinar velit quis justo lacinia, eget bibendum mauris bibendum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac nulla ut dolor porta dapibus eget fringilla enim. Nullam massa tellus, dapibus ut tempus quis, consectetur vel nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nulla dui, maximus consequat porttitor eu, feugiat nec enim. Nullam at leo massa. Cras eget congue tellus, nec fringilla elit. Etiam posuere suscipit sem, eget efficitur orci dictum quis.

Morbi sed maximus ex, in tincidunt nibh. Praesent tempus nibh ac dolor pretium eleifend. Fusce eleifend aliquam tortor, at ornare mauris interdum quis. Suspendisse eu justo sed tellus tempor mollis. Quisque semper nisi eget sapien feugiat sodales. Nullam et tristique ante. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec vitae tempor urna. Pellentesque efficitur commodo pretium. Curabitur viverra arcu eu eleifend semper. Fusce quis euismod lorem. Integer eleifend mattis est a venenatis. Suspendisse id risus eros. 
</div>`

const placeholder = ( msg, height ) => {
    return `<div style="width: 100%; color: black; height: ${height || 200}px; margin-bottom: 2px;
            font-size: 12px; padding: 8px; box-sizing: border-box;
            display: flex; background: #eee; align-items: center;justify-content: center;">${msg}</div>`;
};

const headelement = (css, modules) => {
	return `<html class="client-js"><head>
<link rel="stylesheet" href="https://en.wikipedia.org/w/load.php?lang=en-gb&modules=${modules.join('|')}&only=styles">
<style>${css}</style></head><body>`;
}

const printtail = () => {
	return `</body></html>`;
}

export {
	placeholder,
	printtail, headelement,
	IPSUM_LOREM
};
