# Workers

Workers 和 Vercel 上的代理脚本

## More info -> [core](https://github.com/JAVClub/core)

一开始是准备只使用 Workers 的, 但是奈何单账户很容易触发 ratelimit, 10ms 的 `CPU time` 又不足以计算 JWT

后面准备换用 Vercel, 但是发现 Payload 有 Max 5MB 的限制, 所以只好做成现在这样, Vercel 分发 `access token`, Workers 代理文件

### 准备

- [AutoRclone 创建的 Service Account 文件(们) (在 accounts 目录下](https://gsuitems.com/index.php/archives/13/)
- Vercel 账户

### 使用

```bash
git clone https://github.com/JAVClub/proxy JAVClub_proxy
cd JAVClub_proxy
cp workers/config.example.js workers/config.js
cp vercel/config.example.js vercel/config.js
cd workers
npm i
cd ../vercel
npm i
npm i -g now webpack webpack-cli
```

然后将准备到的 `Service Account` 文件们(格式如下)复制到本项目的 `vercel/accounts` 目录下, 然后在 `./vercel` 目录下运行 `node gen-tokens.js`

接下来更改 `./vercel/config.js` 中的 `aesPassword` 字段(对应 core 中表述的 `secret`)

最后在根目录执行 `now` 按提示部署至 Vercel 并记下 URL

再然后部署 Workers, 进入 `./workers`, 修改 `config.js` 中的 `tokenAPI` 为刚刚部署的 Vercel URL, 然后运行 webpack app.js, 最后将 `./workers/dist/main.js` 的内容部署至 Workers 即可

## 免责声明

本程序仅供学习了解, 请于下载后 24 小时内删除, 不得用作任何商业用途, 文字、数据及图片均有所属版权, 如转载须注明来源

使用本程序必循遵守部署服务器所在地、所在国家和用户所在国家的法律法规, 程序作者不对使用者任何不当行为负责
