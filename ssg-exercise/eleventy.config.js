export default function (config) {
  config.addPassthroughCopy("src/assets");
  return { dir: { input: "src", includes: "_includes", output: "_site" } };
}
