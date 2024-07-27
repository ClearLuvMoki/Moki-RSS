import {app, ipcMain, shell, nativeImage, clipboard, dialog} from "electron";
import {IPCChannel} from "@src/types/rss";
import * as fs from "node:fs";
import path from "path";
import OSService from "@src/dataBase/server/os";
import {ConfigEntities} from "@src/dataBase/entities/config";

const OSIpc = () => {
    ipcMain.handle(IPCChannel.OSConfig, () => {
        return OSService.getConfig()
    })

    ipcMain.handle(IPCChannel.UpdateOSConfig, (_, config: ConfigEntities) => {
        return OSService.updateConfig(config);
    })

    ipcMain.handle(IPCChannel.OpenUrlLocalBrowser, (_, url: string) => {
        return new Promise((resolve) => {
            if (url) {
                return resolve(shell.openExternal(url))
            }
            return resolve(null)
        })

    })

    // 复制文本获取图片
    ipcMain.handle(IPCChannel.CopyTextOrImage, (_, {type, content}: { type: "text" | "image", content: string }) => {
        return new Promise((resolve, reject) => {
            try {
                switch (type) {
                    case "text": {
                        clipboard.writeText(content || "");
                        return resolve("复制成功!")
                    }
                    case "image": {
                        const img = nativeImage.createFromDataURL(content);
                        clipboard.writeImage(img);
                        return resolve("复制成功!")
                    }
                }
            } catch (e) {
                return reject('复制失败!');
            }
        });
    });

    // 保存base64的图片
    ipcMain.handle(IPCChannel.SaveImageByBase64, (_, base64Image: string) => {
        return new Promise((resolve, reject) => {
            const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
            const imgBuffer = Buffer.from(base64Data, 'base64');
            dialog.showSaveDialog({
                title: 'Save Image',
                defaultPath: path.join(app.getPath('downloads'), 'image.png'),
                filters: [
                    {name: 'Images', extensions: ['png', 'jpg', 'jpeg']},
                ],
            }).then(result => {
                if (!result.canceled) {
                    // 保存图片到指定路径
                    fs.writeFile(result.filePath, imgBuffer, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result.filePath);
                        }
                    });
                }
            }).catch(reject);
        })
    })
}
export default OSIpc;
