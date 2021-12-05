const pad = num => {
  return num < 10 ? `0${num}` : num;
}

const convertMillisecondsToDigitalClock = ms => {
  let minutes = Math.floor((ms % 3600000) / 60000),
    seconds = Math.floor(((ms % 360000) % 60000) / 1000);

  if (ms < 0) minutes += 1;
  return pad(minutes) + 'm' + pad(seconds) + 's';
}

export default convertMillisecondsToDigitalClock;