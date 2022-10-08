const axios = require("axios");
const axiosRetry = require("axios-retry");
const tianxinKey = "7036ecd23d050fc5ba48544ba811553c";

axiosRetry(axios, { retries: 3 });

// 彩虹屁
const getRainBow = async () => {
  const res = await axios
    .get(`http://api.tianapi.com/caihongpi/index?key=${tianxinKey}`)
    .then((res) => {
      return res.data.newslist[0].content;
    })
    .catch((err) => console.log("彩虹屁获取失败：", err.code));
  return res;
};

// 早安语句
const getMorning = async () => {
  const res = await axios
    .get(`http://api.tianapi.com/zaoan/index?key=${tianxinKey}`)
    .then((res) => {
      return res.data.newslist[0].content;
    })
    .catch((err) => console.log("早安语句获取失败：", err.code));
  return res;
};

// 晚安语句
const getNight = async () => {
  const res = await axios
    .get(`http://api.tianapi.com/wanan/index?key=${tianxinKey}`)
    .then((res) => {
      // console.log(res.data);
      return res.data.newslist[0].content;
    })
    .catch((err) => console.log("晚安语句获取失败：", err.code));
  return res;
};

module.exports = { getRainBow, getMorning, getNight };
