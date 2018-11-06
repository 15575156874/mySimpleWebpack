# $1 src/$1/$2/$3
echo $1 $2 $3  
startDev()
{
     npx cross-env ENV_file=$2 cross-env ENV_other=$1 webpack-dev-server --open --watch --config ./build/webpack.dev.other.js 
}

if  [ $1 = other ] ; then
    if [ $2 ] ; then   
        if [ $3 ] ; then 
          startDev $2 $3
          echo 执行定制化项目${2}_$3
        else
          echo 请输入定制化项目$2的子项目
        fi
    else
    echo 请输入定制化项目目录
    fi
else
   npx cross-env ENV_file=$1 webpack-dev-server --open --watch --config ./build/webpack.dev.js --colors --profile
    echo 执行common项目
fi