"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_list_item2 = common_vendor.resolveComponent("uni-list-item");
  const _easycom_uni_list2 = common_vendor.resolveComponent("uni-list");
  (_easycom_uni_search_bar2 + _easycom_uni_list_item2 + _easycom_uni_list2)();
}
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_uni_list_item = () => "../../uni_modules/uni-list/components/uni-list-item/uni-list-item.js";
const _easycom_uni_list = () => "../../uni_modules/uni-list/components/uni-list/uni-list.js";
if (!Math) {
  (_easycom_uni_search_bar + _easycom_uni_list_item + _easycom_uni_list)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "explore",
  setup(__props) {
    const searchValue = common_vendor.ref("");
    const magazines = common_vendor.ref([]);
    const extractService = common_vendor.Ws.importObject("extractEpub");
    const search = async () => {
      const resourceListResponse = await extractService.searchEpubResourceByKey(searchValue.value);
      if (resourceListResponse.code !== 0) {
        common_vendor.index.showToast({
          title: "No results found",
          icon: "none"
        });
      }
      const resourceList = resourceListResponse.data;
      magazines.value = resourceList.map((resource) => ({
        id: resource.bookId,
        title: resource.name,
        url: resource.url
      }));
    };
    const clear = () => {
      searchValue.value = "";
    };
    const extractBook = async (url, id) => {
      console.log("start");
      const result = await extractService.extract(id, url);
      if (result.errCode == 0) {
        common_vendor.index.showToast({
          icon: "success",
          title: result.errMsg
        });
      }
    };
    common_vendor.onReady(() => {
      console.log("onReady");
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(search),
        b: common_vendor.o(clear),
        c: common_vendor.o(($event) => searchValue.value = $event),
        d: common_vendor.p({
          focus: true,
          placeholder: "Search Your Magazines",
          modelValue: searchValue.value
        }),
        e: common_vendor.f(magazines.value, (item, k0, i0) => {
          return {
            a: item.id,
            b: common_vendor.o(extractBook, item.id),
            c: "7defd10f-2-" + i0 + ",7defd10f-1",
            d: common_vendor.p({
              title: item.title
            })
          };
        }),
        f: common_vendor.f(magazines.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: item.id,
            c: common_vendor.o(($event) => extractBook(item.url, item.id), item.id)
          };
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/nico/Documents/HBuilderProjects/MagazineReader/pages/explore/explore.vue"]]);
wx.createPage(MiniProgramPage);
