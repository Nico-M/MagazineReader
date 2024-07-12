"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  const _easycom_uni_grid_item2 = common_vendor.resolveComponent("uni-grid-item");
  const _easycom_uni_grid2 = common_vendor.resolveComponent("uni-grid");
  (_easycom_uni_card2 + _easycom_uni_grid_item2 + _easycom_uni_grid2)();
}
const _easycom_uni_card = () => "../../uni_modules/uni-card/components/uni-card/uni-card.js";
const _easycom_uni_grid_item = () => "../../uni_modules/uni-grid/components/uni-grid-item/uni-grid-item.js";
const _easycom_uni_grid = () => "../../uni_modules/uni-grid/components/uni-grid/uni-grid.js";
if (!Math) {
  (_easycom_uni_card + _easycom_uni_grid_item + _easycom_uni_grid)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "bookShelf",
  setup(__props) {
    const rawBooks = common_vendor.reactive([]);
    common_vendor.onMounted(() => {
      common_vendor.Vs.callFunction({
        name: "getMetaOfRawBook"
      }).then((res) => {
        console.log(res);
        const data = res.result;
        rawBooks.push(...data);
      });
    });
    const navigateToReader = (params) => {
      const url = `/pages/reader/reader?bookId=${params.bookId}&title=${encodeURIComponent(params.title)}`;
      common_vendor.index.navigateTo({
        url
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(rawBooks, (book, k0, i0) => {
          return {
            a: common_vendor.t(book.title),
            b: common_vendor.o(($event) => navigateToReader(book), book.bookId),
            c: "4f94e4eb-2-" + i0 + "," + ("4f94e4eb-1-" + i0),
            d: book.bookId,
            e: "4f94e4eb-1-" + i0 + ",4f94e4eb-0"
          };
        }),
        b: common_vendor.p({
          column: 2,
          showBorder: false
        })
      };
    };
  }
});
wx.createPage(_sfc_main);
