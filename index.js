const path = require("path");
const stylus = require("stylus");
const nib = require("nib");

module.exports = (hikaru) => {
  const {getPathFn, getURLFn} = hikaru.utils;
  const stylConfig = hikaru.site["siteConfig"]["stylus"] || {};
  const getPath = getPathFn(this.site["siteConfig"]["rootDir"]);
  const getURL = getURLFn(
    this.site["siteConfig"]["baseURL"],
    this.site["siteConfig"]["rootDir"]
  );
  hikaru.renderer.register(".styl", ".css", (file) => {
    return new Promise((resolve, reject) => {
      stylus(file["text"]).use(nib()).use((style) => {
        style.define("getSiteConfig", (data) => {
          const keys = data["val"].toString().trim().split(".");
          let res = hikaru.site["siteConfig"];
          for (const k of keys) {
            if (res[k] == null) {
              return null;
            }
            res = res[k];
          }
          return res;
        });
        style.define("getThemeConfig", (data) => {
          const keys = data["val"].toString().trim().split(".");
          let res = hikaru.site["themeConfig"];
          for (const k of keys) {
            if (res[k] == null) {
              return null;
            }
            res = res[k];
          }
          return res;
        });
        style.define("getPath", (data) => {
          return getPath(data["val"].toString().trim());
        });
        style.define("getURL", (data) => {
          return getURL(data["val"].toString().trim());
        });
        style.define("siteConfig", hikaru.site["siteConfig"]);
        style.define("themeConfig", hikaru.site["themeConfig"]);
        style.define("srcDir", file["srcDir"]);
        style.define("srcPath", file["srcPath"]);
        style.define("docDir", file["docDir"]);
        style.define("docPath", file["docPath"]);
      }).set("filename", path.join(
        hikaru.site["siteConfig"]["themeSrcDir"], file["srcPath"]
      )).set("sourcemap", stylConfig["sourcemap"])
        .set("compress", stylConfig["compress"])
        .set("include css", true).render((error, result) => {
          if (error != null) {
            return reject(error);
          }
          file["content"] = result;
          return resolve(file);
        });
    });
  });
};
