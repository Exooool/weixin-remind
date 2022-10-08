const axios = require("axios");
const dayjs = require("dayjs");
const Lunar = require("../public/javascripts/dateChange");
const CORPID = process.env.CORPID;
const CORPSECRET = process.env.CORPSECRET;
const AGENTID = process.env.AGENTID;
// const userid = "HeWenYu";
const city = process.env.CITY;
const love_day = process.env.LOVEDAY;
const birthday = process.env.BIRTHDAY;
const lunar = process.env.LUNAR;
const words = "";

const getToken = async () => {
  if (CORPID && CORPSECRET) {
    const res = await axios.get(
      `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${CORPID}&corpsecret=${CORPSECRET}`
    );
    // console.log(res.data);
    return res.data.access_token;
  } else {
    console.log("请配置CORPID和CORPSECRET");
  }
};

const pushMessage = async (id, token, weather, messageConfig) => {
  // console.log("发出消息", weather);
  const date = dayjs().format("YYYY-MM-DD");
  const love_days = dayjs().diff(love_day, "day");
  let trulyBirthDay = birthday;
  // 计算天数
  let compDays = 0;
  // 生日天数
  let birthdays = 0;

  // 计算生日天数

  if (lunar === "true") {
    compDays = dayjs(birthday).year(dayjs().year()).diff(dayjs(), "day");
    if (compDays < 0) {
      compDays = dayjs(birthday).add(1, "y").diff(dayjs(), "day");
    }
    birthdays = compDays;
  } else {
    // 通过外部函数进行转换
    trulyBirthDay = Lunar.toSolar(
      dayjs().year(),
      birthday.split("/")[0],
      birthday.split("/")[1]
    );
    // console.log("农历转公历", trulyBirthDay.join("/"));
    compDays = dayjs(trulyBirthDay.join("/")).diff(dayjs(), "day");

    if (compDays < 0) {
      compDays = dayjs(trulyBirthDay.join("/"))
        .add(1, "y")
        .diff(dayjs(), "day");
    }
    birthdays = compDays;
  }

  const data = {
    touser: `${id}`,
    msgtype: "textcard",
    agentid: AGENTID,
    textcard: {
      title: `${messageConfig.mainText}${messageConfig.subText}`,
      description: `📅${date}
🏢地区：${city}
🌞今天天气：${weather.weather}
☁️当前温度：${weather.temperature}℃
❄️最低温：${weather.tempMax}℃
🔥最高温：${weather.tempMin}℃
🌀风向风级：${weather.windDirDay} ${weather.windScaleDay}
🈳相对湿度：${weather.humidity}
🌅日出时间：${weather.sunrise}
🌇日落时间：${weather.sunset}

💌我们已经相恋： ${love_days} 天啦
🎁距离你的生日还有：${birthdays}天

${messageConfig.words ? "🌈" + messageConfig.sentence : ""}`,
      url: "URL",
      btntxt: "更多",
    },
    safe: 0,
    enable_id_trans: 0,
    enable_duplicate_check: 0,
    duplicate_check_interval: 1800,
  };
  await axios
    .post(
      `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${token}`,
      data
    )
    .then((res) => {
      console.log(`id:${id}, 微信消息推送结果：${res.data.errmsg}, 推送时间：${dayjs()}`);
    })
    .catch((err) => {
      console.log(`id:${id}, 微信消息推送结果：${err.code}, 时间：${dayjs()}`);
    });
};

module.exports = { getToken, pushMessage };
