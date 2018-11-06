const path = require("path");
const fs = require("fs");
function getHtml(resourcePath){
    const dirPath=path.resolve(resourcePath,'../')  //获得文件夹路径
    let htmlName
    const dirs=fs.readdirSync(dirPath)
            for(let i  of dirs){
                if(i.indexOf('html')>0){
                    htmlName=i  
                }
            }
    return htmlName
}
module.exports = function (source) {
    var file = path.basename(this.resourcePath)
    var dir = this.resourcePath.split('/')[this.resourcePath.split('/').length - 2]
    console.log('-----------------2-------------------', file, dir,getHtml(this.resourcePath))
    if (process.env.NODE_ENV === "development" && file === "main.js" && dir !== 'scripts') {
        return `if (process.env.NODE_ENV === "development") {
        require("./${getHtml(this.resourcePath)}");
    };` + source;
    }
    return source
}