"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
const localFilePathKey = "UNI_ADMIN_UPGRADE_CENTER_LOCAL_FILE_PATH";
const platform_iOS = "iOS";
let downloadTask = null;
let openSchemePromise;
function compare(v1 = "0", v2 = "0") {
  v1 = String(v1).split(".");
  v2 = String(v2).split(".");
  const minVersionLens = Math.min(v1.length, v2.length);
  let result = 0;
  for (let i = 0; i < minVersionLens; i++) {
    const curV1 = Number(v1[i]);
    const curV2 = Number(v2[i]);
    if (curV1 > curV2) {
      result = 1;
      break;
    } else if (curV1 < curV2) {
      result = -1;
      break;
    }
  }
  if (result === 0 && v1.length !== v2.length) {
    const v1BiggerThenv2 = v1.length > v2.length;
    const maxLensVersion = v1BiggerThenv2 ? v1 : v2;
    for (let i = minVersionLens; i < maxLensVersion.length; i++) {
      const curVersion = Number(maxLensVersion[i]);
      if (curVersion > 0) {
        v1BiggerThenv2 ? result = 1 : result = -1;
        break;
      }
    }
  }
  return result;
}
const _sfc_main = {
  data() {
    return {
      // 从之前下载安装
      installForBeforeFilePath: "",
      // 安装
      installed: false,
      installing: false,
      // 下载
      downloadSuccess: false,
      downloading: false,
      downLoadPercent: 0,
      downloadedSize: 0,
      packageFileSize: 0,
      tempFilePath: "",
      // 要安装的本地包地址
      // 默认安装包信息
      title: "更新日志",
      contents: "",
      is_mandatory: false,
      // 可自定义属性
      subTitle: "发现新版本",
      downLoadBtnTextiOS: "立即跳转更新",
      downLoadBtnText: "立即下载更新",
      downLoadingText: "安装包下载中，请稍后"
    };
  },
  onLoad({
    local_storage_key
  }) {
    if (!local_storage_key) {
      console.error("local_storage_key为空，请检查后重试");
      common_vendor.index.navigateBack();
      return;
    }
    const localPackageInfo = common_vendor.index.getStorageSync(local_storage_key);
    if (!localPackageInfo) {
      console.error("安装包信息为空，请检查后重试");
      common_vendor.index.navigateBack();
      return;
    }
    const requiredKey = ["version", "url", "type"];
    for (let key in localPackageInfo) {
      if (requiredKey.indexOf(key) !== -1 && !localPackageInfo[key]) {
        console.error(`参数 ${key} 必填，请检查后重试`);
        common_vendor.index.navigateBack();
        return;
      }
    }
    Object.assign(this, localPackageInfo);
    this.checkLocalStoragePackage();
  },
  onBackPress() {
    if (this.is_mandatory) {
      return true;
    }
    downloadTask && downloadTask.abort();
  },
  onHide() {
    openSchemePromise = null;
  },
  computed: {
    isWGT() {
      return this.type === "wgt";
    },
    isiOS() {
      return !this.isWGT ? this.platform.includes(platform_iOS) : false;
    },
    isAppStore() {
      return this.isiOS || !this.isiOS && !this.isWGT && this.url.indexOf(".apk") === -1;
    }
  },
  methods: {
    checkLocalStoragePackage() {
      const localFilePathRecord = common_vendor.index.getStorageSync(localFilePathKey);
      if (localFilePathRecord) {
        const {
          version,
          savedFilePath,
          installed
        } = localFilePathRecord;
        if (!installed && compare(version, this.version) === 0) {
          this.downloadSuccess = true;
          this.installForBeforeFilePath = savedFilePath;
          this.tempFilePath = savedFilePath;
        } else {
          this.deleteSavedFile(savedFilePath);
        }
      }
    },
    async closeUpdate() {
      if (this.downloading) {
        if (this.is_mandatory) {
          return common_vendor.index.showToast({
            title: "下载中，请稍后……",
            icon: "none",
            duration: 500
          });
        }
        common_vendor.index.showModal({
          title: "是否取消下载？",
          cancelText: "否",
          confirmText: "是",
          success: (res) => {
            if (res.confirm) {
              downloadTask && downloadTask.abort();
              common_vendor.index.navigateBack();
            }
          }
        });
        return;
      }
      if (this.downloadSuccess && this.tempFilePath) {
        await this.saveFile(this.tempFilePath, this.version);
        common_vendor.index.navigateBack();
        return;
      }
      common_vendor.index.navigateBack();
    },
    updateApp() {
      this.checkStoreScheme().catch(() => {
        this.downloadPackage();
      });
    },
    // 跳转应用商店
    checkStoreScheme() {
      const storeList = (this.store_list || []).filter((item) => item.enable);
      if (storeList && storeList.length) {
        storeList.sort((cur, next) => next.priority - cur.priority).map((item) => item.scheme).reduce((promise, cur, curIndex) => {
          openSchemePromise = (promise || (promise = Promise.reject())).catch(() => {
            return new Promise((resolve, reject) => {
              plus.runtime.openURL(cur, (err) => {
                reject(err);
              });
            });
          });
          return openSchemePromise;
        }, openSchemePromise);
        return openSchemePromise;
      }
      return Promise.reject();
    },
    downloadPackage() {
      this.downloading = true;
      downloadTask = common_vendor.index.downloadFile({
        url: this.url,
        success: (res) => {
          if (res.statusCode == 200) {
            this.downloadSuccess = true;
            this.tempFilePath = res.tempFilePath;
            if (this.is_mandatory) {
              this.installPackage();
            }
          }
        },
        complete: () => {
          this.downloading = false;
          this.downLoadPercent = 0;
          this.downloadedSize = 0;
          this.packageFileSize = 0;
          downloadTask = null;
        }
      });
      downloadTask.onProgressUpdate((res) => {
        this.downLoadPercent = res.progress;
        this.downloadedSize = (res.totalBytesWritten / Math.pow(1024, 2)).toFixed(2);
        this.packageFileSize = (res.totalBytesExpectedToWrite / Math.pow(1024, 2)).toFixed(2);
      });
    },
    installPackage() {
    },
    restart() {
      this.installed = false;
    },
    saveFile(tempFilePath, version) {
      return new Promise((resolve, reject) => {
        common_vendor.index.saveFile({
          tempFilePath,
          success({
            savedFilePath
          }) {
            common_vendor.index.setStorageSync(localFilePathKey, {
              version,
              savedFilePath
            });
          },
          complete() {
            resolve();
          }
        });
      });
    },
    deleteSavedFile(filePath) {
      common_vendor.index.removeStorageSync(localFilePathKey);
      return common_vendor.index.removeSavedFile({
        filePath
      });
    },
    jumpToAppStore() {
      plus.runtime.openURL(this.url);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.title),
    b: common_assets._imports_0,
    c: common_vendor.t($data.subTitle),
    d: common_vendor.t($data.contents),
    e: $options.isAppStore
  }, $options.isAppStore ? {
    f: common_vendor.t($data.downLoadBtnTextiOS),
    g: common_vendor.o((...args) => $options.jumpToAppStore && $options.jumpToAppStore(...args))
  } : common_vendor.e({
    h: !$data.downloadSuccess
  }, !$data.downloadSuccess ? common_vendor.e({
    i: $data.downloading
  }, $data.downloading ? {
    j: $data.downLoadPercent,
    k: common_vendor.t($data.downLoadingText),
    l: common_vendor.t($data.downloadedSize),
    m: common_vendor.t($data.packageFileSize)
  } : {
    n: common_vendor.t($data.downLoadBtnText),
    o: common_vendor.o((...args) => $options.updateApp && $options.updateApp(...args))
  }) : $data.downloadSuccess && !$data.installed ? {
    q: common_vendor.t($data.installing ? "正在安装……" : "下载完成，立即安装"),
    r: $data.installing,
    s: $data.installing,
    t: common_vendor.o((...args) => $options.installPackage && $options.installPackage(...args))
  } : {}, {
    p: $data.downloadSuccess && !$data.installed,
    v: $data.installed && $options.isWGT
  }, $data.installed && $options.isWGT ? {
    w: common_vendor.o((...args) => $options.restart && $options.restart(...args))
  } : {}), {
    x: !$data.is_mandatory
  }, !$data.is_mandatory ? {
    y: common_assets._imports_1,
    z: common_vendor.o((...args) => $options.closeUpdate && $options.closeUpdate(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/nico/Documents/HBuilderProjects/MagazineReader/uni_modules/uni-upgrade-center-app/pages/upgrade-popup.vue"]]);
wx.createPage(MiniProgramPage);
