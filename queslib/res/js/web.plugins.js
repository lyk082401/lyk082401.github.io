function vc_feedbackPlugin()
		{
		// 首先，我们为vConsole添加一个“反馈”tab。
		const feedbackPlugin = new VConsole.VConsolePlugin('tip_login', '问题反馈');

feedbackPlugin.on('init', function () {
    // do something
});

// 为了复现问题，我们需要页面的url、浏览器的UA、用户的uid、页面的cookie，同时为了快速发现问题，我们需要页面上发生的网络请求信息，以及用户的日志。
// 获取页面信息
const url = window.location.href;
const uid = "app.tip_uid";
const UA = navigator.userAgent;
const { cookie } = document;

// 获取网络请求信息
const getNetworkInfo = function () {
    const { reqList } = window.vConsole.pluginList.network;
    const request = [];
    Object.keys(reqList)
      .forEach((key) => {
        const item = reqList[key];
        request.push({
          url: item.url,
          status: item.status,
          getParam: item.getData,
          postParam: item.postData,
          costTime: item.costTime,
          response: item.response,
        });
      });
    return request;
};

// 获取日志信息
const getLogInfo = function () {
    return window.vConsole.pluginList.default.$tabbox.innerText;
};

// 为了方便测试人员理解，我们在vconsole的界面上，加一下提示文案。
const html = `
   <div class="vc-item vc-item-info"><p>点击下方【复制...】按钮，复制信息发送给开发人员</p>
   <p>点击下方【一键反馈】按钮，发送当前环境日志给开发人员</p></div>
   <div class="vc-item vc-item-log"><p>页面链接：${url}</p></div>
   <div class="vc-item vc-item-log"><p>用户uid：${uid}</p></div>
   <div class="vc-item vc-item-log"><p>浏览器UA：${UA}</p></div>`;

feedbackPlugin.on('renderTab', (callback) => {
    callback(html);
});


// 再给反馈tab，加一些复制信息的按钮。
const btnList = [];
btnList.push({
    name: '复制用户信息',
    global: false,
    onClick() {
      const userInfo = { url, uid, UA, cookie };
      copyInfo(JSON.stringify(userInfo));
    },
});
btnList.push({
    name: '复制网络请求',
    global: false,
    onClick() {
      const request = getNetworkInfo();
      copyInfo(JSON.stringify(request));
    },
});
btnList.push({
    name: '复制日志',
    global: false,
    onClick() {
      const log = getLogInfo();
      copyInfo(log);
    },
});
feedbackPlugin.on('addTool', (callback) => {
    callback(btnList);
});


// 为了更方便地一次发送全部信息，我们加上一个“上报”按钮。reportFeedbackInfo上报接口，可以自己实现后台服务，也可以接入已经在用的日志系统。
btnList.push({
    name: '上报',
    global: false,
    onClick() {
      reportFeedbackInfo({
        uid,
        UA,
        url,
        cookie,
        log: getLogInfo(),
        request: getNetworkInfo(),
      }).then(() => {
        alert('上报成功，请通知开发人员查看');
      });
    },
});
return feedbackPlugin;
}

function vc_envPlugin()
{
// 通过vConsole切换sessionStorage里面tip_debug_cgi_env的值，CGI请求的时候，根据该值来切换测试和现网环境。
const envPlugin = new VConsole.VConsolePlugin('tip_tool', '切换环境');

const html = '<div>请点击下方按钮，切换测试/正式环境</div>';
envPlugin.on('renderTab', (callback) => {
    callback(html);
});

envPlugin.on('addTool', (callback) => {
    const toolList = [];
    toolList.push({
      name: '测试环境',
      global: false,
      onClick() {
        console.log('已切换为测试CGI，即将刷新页面......');
        window.sessionStorage.setItem('tip_debug_cgi_env', 'test');
        setTimeout(() => {
          location.reload();
        }, 1000);
      },
});
toolList.push({
      name: '现网环境',
      global: false,
      onClick() {
        console.log('已切换为正式CGI，即将刷新页面......');
        window.sessionStorage.setItem('tip_debug_cgi_env', 'prod');
        setTimeout(() => {
          location.reload();
        }, 1000);
      },
    });
    callback(toolList);
});
return envPlugin;

		}
		function vcPlugins()
		{
		
		// window.vConsole = new VConsole();
window.vConsole.addPlugin(feedbackPlugin);
window.vConsole.addPlugin(envPlugin);

		}
