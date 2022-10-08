const axios = require("axios");
const weatherKey = "9b9d9ce6a9384603948fc44bd9c94f4a";
const city = process.env.CITY;

const getCity = async () => {
  if (city) {
    const res = await axios.get(
      `https://geoapi.qweather.com/v2/city/lookup?location=${encodeURI(
        city
      )}&key=${weatherKey}`
    );
    return res.data.location[0].id;
  } else {
    console.log("请配置CITY变量");
    return null;
  }
};

const getWeather = async (location) => {
  if (location) {
    const resNow = await axios.get(
      `https://devapi.qweather.com/v7/weather/now?location=${location}&key=${weatherKey}`
    );
    const res3D = await axios.get(
      `https://devapi.qweather.com/v7/weather/3d?location=${location}&key=${weatherKey}`
    );
    // console.log(resNow.data);
    // console.log(res3D.data);
    const now = resNow.data.now;
    const today = res3D.data.daily[0];
    const weatherObj = {
      weather: now.text,
      temperature: now.temp,
      ...today,
    };
    return weatherObj;
  } else {
    console.log("获取天气函数的参数不存在");
  }
};

// 获取生活指数
const getIndices = async (location) => {
  if (location) {
    const type = "3,9,16";
    const res = await axios.get(
      `https://devapi.qweather.com/v7/indices/1d?type=${type}&location=${location}&key=${weatherKey}`
    );
    // console.log(res.data);
  } else {
    console.log("获取生活指数的参数不存在");
  }
};

module.exports = { getCity, getWeather, getIndices };
