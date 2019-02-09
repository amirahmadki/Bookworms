if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI: "mongodb://amirahmadki:19Dec1977@ds211143.mlab.com:11143/vidjot"
  };
} else {
  module.exports = {
    mongoURI: "mongodb://localhost/vidjot-devel"
  };
}
