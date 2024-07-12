"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "reader",
  setup(__props) {
    const getChapterService = common_vendor.Ws.importObject("getContentOfBook");
    const bookInitial = common_vendor.reactive({
      bookId: "",
      title: ""
    });
    const allChapters = common_vendor.ref([]);
    const readingChapter = common_vendor.ref(null);
    common_vendor.onLoad((query) => {
      const bookId = query.bookId;
      const title = decodeURIComponent(query.title);
      bookInitial.bookId = bookId;
      bookInitial.title = title;
    });
    common_vendor.onReady(async () => {
      common_vendor.index.setNavigationBarTitle({
        title: bookInitial.title
      });
      const chaptersRes = await getChapterService.getChaptersOfBook(bookInitial.bookId);
      if (chaptersRes.code == 0 && chaptersRes.data) {
        const {
          chapterList,
          chapterContent
        } = chaptersRes.data;
        allChapters.value = chapterList;
        readingChapter.value = chapterContent;
      }
    });
    return (_ctx, _cache) => {
      return {
        a: readingChapter.value && readingChapter.value.text || ""
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/nico/Documents/HBuilderProjects/MagazineReader/pages/reader/reader.vue"]]);
wx.createPage(MiniProgramPage);
