#!/usr/bin/env node

const colors = require('colors')
const http = require('http')

let score = ''

//让用户输入电影名
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

readline.question(`请输入要想搜索的电影名>`, name => {
    query(name).then(res=>{
        console.log(name, colors.green('评分:'), colors.red(res))
        readline.close()
    }).catch(err=>{
        console.log(err)
        readline.close()
    })
})


const query = (val) => {
    return new Promise((resolve,reject) => {
        http.get(`http://t.yushu.im/v2/movie/search?q=${val}`, (res) => {
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => {
                rawData += chunk;
            });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    score = parsedData.subjects[0].rating.average
                    resolve(score)
                } catch (e) {
                    reject('查询失败')
                    // console.error(e.message);
                }
            });
        }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
        });
    })
}