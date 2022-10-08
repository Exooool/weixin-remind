const dayjs = require("dayjs");
const { getMorning, getNight, getRainBow } = require("./other");
const { getCity, getWeather, getIndices } = require("./weather");
const { getToken, pushMessage } = require("./weixin");
const userids = ["HeWenYu", "YuanQi"];

const getBasicInfo = async () => {
  async function getWea() {
    const id = await getCity();
    const indices = await getIndices(id);
    const weather = await getWeather(id);
    return weather;
  }

  const token = await getToken()
    .then(async (token) => {
      return token;
    })
    .catch((err) => {
      console.log("token请求错误", err.code);
    });

  const weather = await getWea()
    .then((weather) => {
      return weather;
    })
    .catch((err) => {
      console.log("天气请求错误", err.code);
    });

  return {
    token: token,
    weather: weather,
  };
};

const getSentence = async (type) => {
  const time = dayjs().hour();
  if (type === "time") {
    let sentence = null;
    time >= 0 && time <= 12
      ? (sentence = await getMorning())
      : (sentence = await getNight());
    return sentence;
  } else if (type === "rainbow") {
    return await getRainBow();
  }
};

/**
 * @param {*} config 包含了words参数 参数可选值为greet、rainbow
 *
 */
// 判断时间执行不同的推送
const chargeTime = async (config) => {
  const time = dayjs().hour();
  // console.log(time);
  let mainText = "";
  switch (true) {
    case time >= 0 && time < 12:
      mainText = "早上好呀！";
      break;
    case time >= 12 && time < 13:
      mainText = "中午好呀！";
      break;
    case time >= 13 && time < 18:
      mainText = "下午好呀！";
      break;
    case time >= 18 && time < 23:
      mainText = "晚上好呀！";
      break;
    default:
      mainText = "你好呀！";
      break;
  }
  const subText = "宝贝";

  let sentence;
  if (config.words === "greet") {
    sentence = await getSentence("time");
  } else if (config.words === "rainbow") {
    sentence = await getSentence("rainbow");
  }

  const messageConfig = {
    mainText: mainText,
    subText: subText,
    ...config,
    sentence,
  };

  // console.log(sentence);
  const { token, weather } = await getBasicInfo();
  // console.log(token, weather);

  userids.forEach((id) => {
    pushMessage(id, token, weather, messageConfig);
  });
};

module.exports = { chargeTime };
