Slingshot.createDirective("s3Uploader", Slingshot.S3Storage, {
  bucket: "parallels-bits",

  AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  AWSSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  acl: "public-read",

  authorize: function () {
    return true;
  },

  key: function (file) {
    return Date.now() + "/" + file.name;
  }
});
