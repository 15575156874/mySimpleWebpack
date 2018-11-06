rm -r dist
dir=$(ls -l ./src |awk '/^d/ {print $NF}')
cur_date="`date +%Y%m%d%H%M%S`" 
dir_other=$(ls -l ./src/other |awk '/^d/ {print $NF}')
buildOtherOne ()
{
         dir_otherOne=$(ls -l ./src/other/$2 |awk '/^d/ {print $NF}')
         for otherOne in $dir_otherOne  #otherOne是Other目录下的某一个定制化项目的具体项目，eg. other/boccc/help，
         do
           npx cross-env ENV_file=${otherOne} cross-env ENV_other=${2} webpack --config ./build/webpack.pro.other.js 
           echo "打包单个定制化项目: ${2} ${otherOne}"
         done  
}
buildOtherAll ()
{
     for i in $dir_other
        do
            dir_otherChild=$(ls -l ./src/other/${i} |awk '/^d/ {print $NF}')
            for a in $dir_otherChild 
            do
                npx cross-env ENV_file=${a} cross-env ENV_other=${i} webpack --config ./build/webpack.pro.other.js 
                echo "打包的定制化项目:other ${i} ${a}"
            done
        done
}
buildCommon()
{
    for i in $dir
        do
            if [ ${i} != other ];then
            npx cross-env ENV_file=${i} webpack --config ./build/webpack.pro.js 
            echo "打包的通用项目: $i"
            fi
        done
}
if [ $1 == other ];then 
echo "other" # 打包定制化的内容
    if [ $2 ];then
    buildOtherOne $1 $2
    else
    buildOtherAll $1 $2
    fi    
elif [ $1 == common ];then
    buildCommon $1 $2
else  # 打包全部
    rm -r dist
    for i in $dir
        do
            if [ ${i} != other ];then
                npx cross-env ENV_file=${i} webpack --config ./build/webpack.pro.js 
                echo "打包的通用项目########################: $i"
            else
            buildOtherAll 
            fi
        done
fi
# mv dist/ sparrow${cur_date}
# tar -zcvf ./sparrow${cur_date}.tar.gz ./sparrow${cur_date}/*
# rm -r sparrow${cur_date}
# mkdir dist
# mv sparrow${cur_date}.tar.gz dist
