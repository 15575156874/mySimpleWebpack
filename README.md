Sparrow
-----------

通用+定制化相关H5页面仓库
本项目src下的other是定制化项目，其他的是通用项目

1，如何开发
npm run dev +文件夹+文件夹+文件夹 
开启本地开发模式
例如：
npm run dev other boccc help  开启boccc下的help项目
npm run dev help开启通用help项目
npm run dev qrcode开启通用qrcode项目

2，如何Buid
npm run build之后会获得src项目下所有项目的tar包
npm run build common 会获得通用的tar包
npm run build other boccc会获得boccc定制化的tar包

3，如果需要修改webpack启动模式，可以在Build文件夹下面查找
common是公用配置
util是用来获得entry以及html-plug对象
配置通过merge库进行合并

4，如何添加新项目
入口文件，是与html同文件夹下的main.js文件

例如你要新增一个test项目步骤为
{
    1，在src文件下新建一个test文件夹，
    2，在test文件下新建一个页面文件夹testPage（与内部html同名），
    3，在testPage文件夹下，新建testPage.html+main.js（静态资源导入这个入口文件，目前loader支持.js,.css,jpg|png）
    4，这个项目打包之后输出到dist文件夹为test/testPage.html,开发服务器路径为  testPage
}

例如你要在src/help下新增一个test页面步骤为
{
    1，在src/help文件下新建一个test文件夹，
    2，在test文件夹下，新建test.html+main.js（静态资源导入这个入口文件，目前loader支持.js,.css,jpg|png）
    3，这个项目打包之后输出到dist文件夹为help/test.html,开发服务器路径为  test
}

例如你要新增一个定制化项目步骤为
{
    1，在src/other文件下新建一个test文件夹，
    2，在test文件下新建一个页面文件夹testPage（与内部html同名），
    3，在testPage文件夹下，新建testPage.html+main.js（静态资源导入这个入口文件，目前loader支持.js,.css,jpg|png）
    4，这个项目打包之后输出到dist文件夹为test/testPage.html,开发服务器路径为  test/testPag.html
}
