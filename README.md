# Workers

Workers 和 Vercel 上的代理脚本

❗ | **因架构调整，本项目已不再维护并将存档。新项目将支持泛媒体文件管理，相关开发工作将迁移至 [@UsagiHouse](https://github.com/UsagiHouse) 进行，请知悉**
:---: | :---

## More info -> [core](https://github.com/JAVClub/core)

一开始是准备只使用 Workers 的, 但是奈何单账户很容易触发 ratelimit, 10ms 的 `CPU time` 又不足以计算 JWT

~~后面准备换用 Vercel, 但是发现 Payload 有 Max 5MB 的限制, 所以只好做成现在这样, Vercel 分发 `access token`, Workers 代理文件~~

更新后的布局是: 所有链接指向 Vercel, Vercel 再生成 access token 并 302 跳转至 Workers

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

然后部署 Workers, 进入 `./workers` 运行 `webpack app.js`, 将 `./workers/dist/main.js` 的内容部署至 Workers 即可

再然后将准备到的 `Service Account` 文件们复制到本项目的 `vercel/accounts` 目录下, 然后在 `./vercel` 目录下运行 `node genToken.js`

接下来更改 `./vercel/config.js` 中的 `password` 字段(对应 core 中表述的 `secret`)和其余的字段

最后在根目录执行 `now` 按提示部署至 Vercel 并记下 URL 即可

## 特殊使用

应要求加了个正常的使用方法 (即使用 refresh_token 获得 access_token)

若要使用这种方法，创建 `./worker/config.js` 并填写其中信息后, 将 `app.js` 的第三行的第一个注释(即 `//`)去掉即可

## 免责声明

本程序仅供学习了解, 请于下载后 24 小时内删除, 不得用作任何商业用途, 文字、数据及图片均有所属版权, 如转载须注明来源

使用本程序必循遵守部署服务器所在地、所在国家和用户所在国家的法律法规, 程序作者不对使用者任何不当行为负责
